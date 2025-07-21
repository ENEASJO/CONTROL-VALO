import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { errorHandler } from '../src/middleware/errorHandler'
import { notFoundHandler } from '../src/middleware/notFoundHandler'
import empresasRoutes from '../src/routes/empresas'
import ejecucionRoutes from '../src/routes/ejecucion'
import supervisionRoutes from '../src/routes/supervision'

// Inicializar Prisma (singleton para serverless)
let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn'],
    errorFormat: 'minimal'
  })
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    })
  }
  prisma = global.__prisma
}

// Manejo de errores de conexión de Prisma
prisma.$on('error' as never, (e: any) => {
  console.error('❌ Prisma Error:', e)
})

// Conectar explícitamente en serverless
if (process.env.NODE_ENV === 'production') {
  prisma.$connect().catch((error) => {
    console.error('❌ Failed to connect to database:', error)
  })
}

export { prisma }

const app = express()

// Middleware básico
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Middleware personalizado (adaptado para serverless)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Logging simplificado para serverless
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  
  // Interceptar respuesta para medir tiempo
  const originalSend = res.send
  res.send = function(body) {
    const duration = Date.now() - start
    console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
    return originalSend.call(this, body)
  }
  
  next()
})

// Middleware de seguridad básica
app.use((req: Request, res: Response, next: NextFunction) => {
  // Headers de seguridad básicos
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// Middleware de timeout para serverless
app.use((req: Request, res: Response, next: NextFunction) => {
  // Timeout de 25 segundos (Vercel tiene límite de 30s)
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error(`⏰ Timeout en ${req.method} ${req.path}`)
      res.status(504).json({
        success: false,
        error: {
          code: 'TIMEOUT_ERROR',
          message: 'La operación tardó demasiado tiempo en completarse'
        }
      })
    }
  }, 25000)

  // Limpiar timeout cuando la respuesta se envía
  const originalSend = res.send
  res.send = function(body) {
    clearTimeout(timeout)
    return originalSend.call(this, body)
  }

  next()
})

// Ruta de salud mejorada con test de base de datos
app.get('/api/health', async (req: Request, res: Response) => {
  const healthCheck = {
    success: true,
    message: 'API de Control de Valorizaciones funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      api: 'healthy',
      database: 'unknown'
    }
  }

  try {
    // Test de conexión a la base de datos con timeout
    const startTime = Date.now()
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ])
    const dbResponseTime = Date.now() - startTime
    
    healthCheck.database = 'connected'
    healthCheck.services.database = 'healthy'
    healthCheck.services = {
      ...healthCheck.services,
      databaseResponseTime: `${dbResponseTime}ms`
    }
    
    res.json(healthCheck)
  } catch (error) {
    console.error('❌ Database connection error:', error)
    
    healthCheck.success = false
    healthCheck.message = 'API funcionando pero con problemas de base de datos'
    healthCheck.database = 'disconnected'
    healthCheck.services.database = 'unhealthy'
    healthCheck.services = {
      ...healthCheck.services,
      databaseError: error instanceof Error ? error.message : 'Unknown error'
    }
    
    res.status(503).json(healthCheck)
  }
})

// Ruta de test para verificar integración
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API serverless funcionando correctamente',
    timestamp: new Date().toISOString(),
    routes: {
      empresas: '/api/empresas',
      ejecucion: '/api/ejecucion',
      supervision: '/api/supervision'
    }
  })
})

// Rutas principales
app.use('/api/empresas', empresasRoutes)
app.use('/api/ejecucion', ejecucionRoutes)
app.use('/api/supervision', supervisionRoutes)

// Middleware de manejo de errores específico para serverless
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Serverless Error:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  // Errores específicos de serverless
  if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: 'Error de conexión temporal. Intenta nuevamente.'
      }
    })
  }

  // Error de memoria en serverless
  if (error.message && error.message.includes('out of memory')) {
    return res.status(507).json({
      success: false,
      error: {
        code: 'MEMORY_ERROR',
        message: 'Operación demasiado grande para procesar'
      }
    })
  }

  // Continuar con el manejo normal de errores
  next(error)
})

// Middleware de manejo de errores estándar
app.use(notFoundHandler)
app.use(errorHandler)

// Manejo de errores no capturados específico para serverless
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception in serverless:', error)
  // En serverless, no podemos hacer process.exit, solo loggear
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection in serverless:', reason)
  // En serverless, no podemos hacer process.exit, solo loggear
})

// Export para Vercel
export default app