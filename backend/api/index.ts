import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'

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

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// Health check SIN base de datos
app.get('/api/health', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de Control de Valorizaciones funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'not_configured',
    environment: process.env.NODE_ENV || 'development',
    status: 'DEMO MODE - Sin base de datos'
  })
})

// Test endpoint
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API funcionando en modo DEMO',
    timestamp: new Date().toISOString(),
    routes: {
      empresas: '/api/empresas (DEMO)',
      ejecucion: '/api/ejecucion (DEMO)',
      supervision: '/api/supervision (DEMO)'
    }
  })
})

// Rutas DEMO con datos ficticios
app.get('/api/empresas', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        ruc: '20123456789',
        razonSocial: 'CONSTRUCTORA DEMO SAC',
        nombreComercial: 'Constructora Demo',
        direccion: 'Av. Demo 123, Lima',
        telefono: '01-1234567',
        email: 'demo@constructora.com',
        representanteLegal: 'Juan Demo',
        esConsorcio: false,
        estado: 'ACTIVO'
      },
      {
        id: 2,
        ruc: '20987654321',
        razonSocial: 'INGENIEROS DEMO SRL',
        nombreComercial: 'Ingenieros Demo',
        direccion: 'Calle Demo 456, Lima',
        telefono: '01-7654321',
        email: 'demo@ingenieros.com',
        representanteLegal: 'María Demo',
        esConsorcio: false,
        estado: 'ACTIVO'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1
    },
    message: 'Datos DEMO - Configurar base de datos para datos reales'
  })
})

app.get('/api/ejecucion/obras', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        numeroContrato: 'EJE-DEMO-001',
        nombreObra: 'Obra Demo de Ejecución',
        empresaId: 1,
        montoContrato: 250000.00,
        fechaInicio: '2024-01-15',
        fechaFin: '2024-06-15',
        ubicacion: 'Lima - Demo',
        descripcion: 'Obra de demostración para testing',
        estado: 'EN_PROCESO'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    },
    message: 'Datos DEMO - Configurar base de datos para datos reales'
  })
})

app.get('/api/supervision/obras', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        numeroContrato: 'SUP-DEMO-001',
        nombreObra: 'Supervisión Demo',
        empresaId: 2,
        montoContrato: 75000.00,
        fechaInicio: '2024-01-10',
        fechaFin: '2024-08-10',
        ubicacion: 'Lima - Demo',
        descripcion: 'Supervisión de demostración para testing',
        estado: 'EN_PROCESO'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    },
    message: 'Datos DEMO - Configurar base de datos para datos reales'
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Ruta ${req.method} ${req.path} no encontrada`
    }
  })
})

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', error)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor'
    }
  })
})

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`🚀 Backend API ejecutándose en puerto ${PORT}`)
  })
}

// Para Vercel (serverless)
export default app