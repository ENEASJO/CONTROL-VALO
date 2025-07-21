/**
 * Aplicación Express para SeeNode
 * Versión adaptada del backend para hosting tradicional
 */

const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

// Importar middleware
const { errorHandler } = require('./middleware/errorHandler')
const { notFoundHandler } = require('./middleware/notFoundHandler')
const { requestLogger } = require('./middleware/requestLogger')

// Importar rutas
const empresasRoutes = require('./routes/empresas')
const ejecucionRoutes = require('./routes/ejecucion')
const supervisionRoutes = require('./routes/supervision')

// Inicializar Prisma
let prisma

try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error', 'warn']
  })
  
  console.log('✅ Prisma Client inicializado')
} catch (error) {
  console.error('❌ Error inicializando Prisma:', error)
}

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

// Middleware personalizado
app.use(requestLogger)

// Headers de seguridad
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// Ruta de salud con test de base de datos
app.get('/health', async (req, res) => {
  const healthCheck = {
    success: true,
    message: 'API de Control de Valorizaciones funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    database: 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  }

  try {
    if (prisma) {
      const startTime = Date.now()
      await prisma.$queryRaw`SELECT 1`
      const dbResponseTime = Date.now() - startTime
      
      healthCheck.database = 'connected'
      healthCheck.databaseResponseTime = `${dbResponseTime}ms`
    } else {
      throw new Error('Prisma client not initialized')
    }
    
    res.json(healthCheck)
  } catch (error) {
    console.error('❌ Database connection error:', error)
    
    healthCheck.success = false
    healthCheck.message = 'API funcionando pero con problemas de base de datos'
    healthCheck.database = 'disconnected'
    healthCheck.databaseError = error.message
    
    res.status(503).json(healthCheck)
  }
})

// Ruta de test
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API SeeNode funcionando correctamente',
    timestamp: new Date().toISOString(),
    routes: {
      empresas: '/api/empresas',
      ejecucion: '/api/ejecucion',
      supervision: '/api/supervision'
    }
  })
})

// Rutas principales
app.use('/empresas', empresasRoutes)
app.use('/ejecucion', ejecucionRoutes)
app.use('/supervision', supervisionRoutes)

// Middleware de manejo de errores
app.use(notFoundHandler)
app.use(errorHandler)

// Conectar a la base de datos al iniciar
if (prisma) {
  prisma.$connect()
    .then(() => console.log('✅ Conectado a la base de datos'))
    .catch((error) => console.error('❌ Error conectando a la base de datos:', error))
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando conexión a base de datos...')
  if (prisma) {
    await prisma.$disconnect()
  }
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 Cerrando conexión a base de datos...')
  if (prisma) {
    await prisma.$disconnect()
  }
})

module.exports = app