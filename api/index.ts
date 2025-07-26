import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { supabase } from './supabase.js'

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
      obras: '/api/obras',
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

// ============================================
// ENDPOINTS DE OBRAS (CRUD COMPLETO)
// ============================================

// Función auxiliar para validar datos de obras
const validateObraData = (data: any) => {
  const errors: string[] = []
  
  if ('nombre' in data && data.nombre !== undefined) {
    if (!data.nombre?.trim()) {
      errors.push('El nombre es requerido')
    } else if (data.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    } else if (data.nombre.trim().length > 255) {
      errors.push('El nombre no puede exceder 255 caracteres')
    }
  }
  
  return errors
}

// Función auxiliar para obtener estadísticas de obras
const getObrasStats = async () => {
  try {
    const { data, error } = await supabase
      .from('obras_stats')
      .select('*')
      .single()

    if (error) {
      // Si la vista no existe, calcular manualmente
      const [obrasResult, ejecucionResult, supervisionResult] = await Promise.all([
        supabase.from('obras').select('id'),
        supabase.from('obras_ejecucion').select('obra_id').not('obra_id', 'is', null),
        supabase.from('obras_supervision').select('obra_id').not('obra_id', 'is', null)
      ])

      const totalObras = obrasResult.data?.length || 0
      const obrasConEjecucion = ejecucionResult.data?.length || 0
      const obrasConSupervision = supervisionResult.data?.length || 0

      // Calcular obras completas (con ambos módulos)
      const { data: obrasCompletas } = await supabase
        .from('obras')
        .select(`
          id,
          obras_ejecucion!inner(obra_id),
          obras_supervision!inner(obra_id)
        `)

      const obrasCompletasCount = obrasCompletas?.length || 0

      return {
        total_obras: totalObras,
        obras_con_ejecucion: obrasConEjecucion,
        obras_con_supervision: obrasConSupervision,
        obras_completas: obrasCompletasCount,
        obras_solo_ejecucion: obrasConEjecucion - obrasCompletasCount,
        obras_solo_supervision: obrasConSupervision - obrasCompletasCount,
        obras_sin_asignar: totalObras - obrasConEjecucion - obrasConSupervision + obrasCompletasCount
      }
    }

    return data
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return null
  }
}

// GET /api/obras - Listar obras con filtros y paginación
app.get('/api/obras', async (req: Request, res: Response) => {
  try {
    const { id, stats, search, page = '1', limit = '10', sortBy = 'nombre', sortOrder = 'asc' } = req.query

    // GET /api/obras?id=X - Obtener obra específica
    if (id) {
      const obraId = parseInt(id as string)
      
      if (isNaN(obraId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID inválido'
          }
        })
      }

      const { data: obra, error: obraError } = await supabase
        .from('obras')
        .select(`
          *,
          obras_ejecucion (
            *,
            empresas:empresa_ejecutora_id (*)
          ),
          obras_supervision (
            *,
            empresas:empresa_supervisora_id (*)
          )
        `)
        .eq('id', obraId)
        .single()

      if (obraError) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'OBRA_NOT_FOUND',
            message: 'Obra no encontrada'
          }
        })
      }

      return res.json({
        success: true,
        data: obra
      })
    }

    // GET /api/obras?stats=true - Obtener estadísticas
    if (stats === 'true') {
      const statsData = await getObrasStats()
      
      return res.json({
        success: true,
        data: statsData
      })
    }

    // GET /api/obras - Listar obras con filtros
    const pageNum = parseInt(page as string) || 1
    const limitNum = parseInt(limit as string) || 10
    const offset = (pageNum - 1) * limitNum

    // Construir query base
    let supabaseQuery = supabase
      .from('obras')
      .select(`
        *,
        obras_ejecucion!left (id),
        obras_supervision!left (id)
      `, { count: 'exact' })

    // Aplicar filtro de búsqueda
    if (search) {
      supabaseQuery = supabaseQuery.ilike('nombre', `%${search}%`)
    }

    // Aplicar ordenamiento
    supabaseQuery = supabaseQuery.order(sortBy as string, { ascending: sortOrder === 'asc' })

    // Aplicar paginación
    supabaseQuery = supabaseQuery.range(offset, offset + limitNum - 1)

    const { data: obras, error: obrasError, count } = await supabaseQuery

    if (obrasError) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'GET_OBRAS_ERROR',
          message: 'Error al obtener obras'
        }
      })
    }

    return res.json({
      success: true,
      data: {
        data: obras,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Error en GET /api/obras:', error)
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor'
      }
    })
  }
})

// POST /api/obras - Crear nueva obra
app.post('/api/obras', async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body
    const errors = validateObraData({ nombre })

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errors[0]
        }
      })
    }

    // Verificar si ya existe una obra con el mismo nombre
    const { data: existingObra } = await supabase
      .from('obras')
      .select('id')
      .ilike('nombre', nombre.trim())
      .single()

    if (existingObra) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'OBRA_EXISTS',
          message: 'Ya existe una obra con este nombre'
        }
      })
    }

    // Crear obra
    const { data: newObra, error: createError } = await supabase
      .from('obras')
      .insert([{ nombre: nombre.trim() }])
      .select()
      .single()

    if (createError) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_OBRA_ERROR',
          message: 'Error al crear la obra'
        }
      })
    }

    return res.status(201).json({
      success: true,
      data: newObra,
      message: 'Obra creada exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en POST /api/obras:', error)
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor'
      }
    })
  }
})

// PUT /api/obras?id=X - Actualizar obra
app.put('/api/obras', async (req: Request, res: Response) => {
  try {
    const { id } = req.query
    const { nombre } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ID',
          message: 'ID requerido para actualización'
        }
      })
    }

    const updateId = parseInt(id as string)
    if (isNaN(updateId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'ID inválido'
        }
      })
    }

    const errors = validateObraData({ nombre })
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errors[0]
        }
      })
    }

    // Verificar si la obra existe
    const { data: obraToUpdate } = await supabase
      .from('obras')
      .select('id')
      .eq('id', updateId)
      .single()

    if (!obraToUpdate) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'OBRA_NOT_FOUND',
          message: 'Obra no encontrada'
        }
      })
    }

    // Si se actualiza el nombre, verificar duplicados
    if (nombre) {
      const { data: duplicateObra } = await supabase
        .from('obras')
        .select('id')
        .ilike('nombre', nombre.trim())
        .neq('id', updateId)
        .single()

      if (duplicateObra) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'OBRA_EXISTS',
            message: 'Ya existe otra obra con este nombre'
          }
        })
      }
    }

    // Actualizar obra
    const { data: updatedObra, error: updateError } = await supabase
      .from('obras')
      .update({ 
        ...(nombre && { nombre: nombre.trim() }),
        updated_at: new Date().toISOString()
      })
      .eq('id', updateId)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_OBRA_ERROR',
          message: 'Error al actualizar la obra'
        }
      })
    }

    return res.json({
      success: true,
      data: updatedObra,
      message: 'Obra actualizada exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en PUT /api/obras:', error)
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor'
      }
    })
  }
})

// DELETE /api/obras?id=X - Eliminar obra
app.delete('/api/obras', async (req: Request, res: Response) => {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ID',
          message: 'ID requerido para eliminación'
        }
      })
    }

    const deleteId = parseInt(id as string)
    if (isNaN(deleteId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'ID inválido'
        }
      })
    }

    // Verificar si la obra existe y tiene dependencias
    const { data: obraToDelete } = await supabase
      .from('obras')
      .select(`
        id,
        obras_ejecucion (id),
        obras_supervision (id)
      `)
      .eq('id', deleteId)
      .single()

    if (!obraToDelete) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'OBRA_NOT_FOUND',
          message: 'Obra no encontrada'
        }
      })
    }

    // Verificar dependencias
    if (obraToDelete.obras_ejecucion?.length > 0 || obraToDelete.obras_supervision?.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OBRA_HAS_DEPENDENCIES',
          message: 'No se puede eliminar la obra porque tiene registros de ejecución o supervisión asociados'
        }
      })
    }

    // Eliminar obra
    const { error: deleteError } = await supabase
      .from('obras')
      .delete()
      .eq('id', deleteId)

    if (deleteError) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_OBRA_ERROR',
          message: 'Error al eliminar la obra'
        }
      })
    }

    return res.json({
      success: true,
      message: 'Obra eliminada exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en DELETE /api/obras:', error)
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor'
      }
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