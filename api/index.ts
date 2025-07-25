import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { supabase } from './supabase'

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

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de Control de Valorizaciones',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      empresas: '/api/empresas',
      ejecucion: '/api/ejecucion/obras',
      supervision: '/api/supervision/obras'
    }
  })
})

// Health check CON Supabase
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Probar conexión con Supabase
    const { data, error } = await supabase.from('empresas').select('count').limit(1)
    
    res.json({
      success: true,
      message: 'API de Control de Valorizaciones funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: error ? 'connection_error' : 'connected',
      environment: process.env.NODE_ENV || 'development',
      status: 'SUPABASE CONNECTED'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error de conexión con la base de datos',
      error: error
    })
  }
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

// Endpoint de empresas CON Supabase
app.get('/api/empresas', async (req: Request, res: Response) => {
  try {
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: error.message }
      })
    }

    res.json({
      success: true,
      data: empresas?.map(empresa => ({
        id: empresa.id,
        ruc: empresa.ruc,
        razonSocial: empresa.razon_social,
        nombreComercial: empresa.nombre_comercial,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        email: empresa.email,
        representanteLegal: empresa.representante_legal,
        esConsorcio: empresa.es_consorcio,
        estado: empresa.estado
      })) || [],
      pagination: {
        page: 1,
        limit: 100,
        total: empresas?.length || 0,
        totalPages: 1
      },
      message: 'Datos desde Supabase'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
})

app.get('/api/ejecucion/obras', async (req: Request, res: Response) => {
  try {
    const { data: obras, error } = await supabase
      .from('obras_ejecucion')
      .select(`
        *,
        empresas:empresa_ejecutora_id(id, razon_social, nombre_comercial)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: error.message }
      })
    }

    res.json({
      success: true,
      data: obras?.map(obra => ({
        id: obra.id,
        numeroContrato: obra.numero_contrato,
        nombreObra: obra.nombre_obra,
        numeroExpediente: obra.numero_expediente,
        periodoValorizado: obra.periodo_valorizado,
        fechaInicio: obra.fecha_inicio,
        plazoEjecucion: obra.plazo_ejecucion,
        empresaEjecutora: obra.empresas?.razon_social || 'No asignada',
        montoContrato: obra.monto_contrato,
        ubicacion: obra.ubicacion,
        descripcion: obra.descripcion,
        estado: obra.estado
      })) || [],
      pagination: {
        page: 1,
        limit: 100,
        total: obras?.length || 0,
        totalPages: 1
      },
      message: 'Datos desde Supabase'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
})

app.get('/api/supervision/obras', async (req: Request, res: Response) => {
  try {
    const { data: obras, error } = await supabase
      .from('obras_supervision')
      .select(`
        *,
        empresas:empresa_supervisora_id(id, razon_social, nombre_comercial)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: error.message }
      })
    }

    res.json({
      success: true,
      data: obras?.map(obra => ({
        id: obra.id,
        numeroContrato: obra.numero_contrato,
        nombreObra: obra.nombre_obra,
        numeroExpediente: obra.numero_expediente,
        periodoValorizado: obra.periodo_valorizado,
        fechaInicio: obra.fecha_inicio,
        plazoEjecucion: obra.plazo_ejecucion,
        empresaSupervisora: obra.empresas?.razon_social || 'No asignada',
        montoContrato: obra.monto_contrato,
        ubicacion: obra.ubicacion,
        descripcion: obra.descripcion,
        estado: obra.estado
      })) || [],
      pagination: {
        page: 1,
        limit: 100,
        total: obras?.length || 0,
        totalPages: 1
      },
      message: 'Datos desde Supabase'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
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