import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase, type Obra } from './supabase'

interface CreateObraRequest {
  nombre: string
}

interface UpdateObraRequest {
  nombre?: string
}

interface ObraFilters {
  search?: string
  page?: number
  limit?: number
  sortBy?: 'nombre' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Función auxiliar para validar datos
const validateObraData = (data: CreateObraRequest | UpdateObraRequest) => {
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

// Función auxiliar para obtener estadísticas
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query, body } = req

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          // GET /api/obras/:id - Obtener obra por ID
          const id = parseInt(query.id as string)
          
          if (isNaN(id)) {
            const response: ApiResponse = {
              success: false,
              error: {
                code: 'INVALID_ID',
                message: 'ID inválido'
              }
            }
            return res.status(400).json(response)
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
            .eq('id', id)
            .single()

          if (obraError) {
            const response: ApiResponse = {
              success: false,
              error: {
                code: 'OBRA_NOT_FOUND',
                message: 'Obra no encontrada'
              }
            }
            return res.status(404).json(response)
          }

          const response: ApiResponse<Obra> = {
            success: true,
            data: obra
          }
          return res.json(response)

        } else if (query.stats === 'true') {
          // GET /api/obras?stats=true - Obtener estadísticas
          const stats = await getObrasStats()
          
          const response: ApiResponse = {
            success: true,
            data: stats
          }
          return res.json(response)

        } else {
          // GET /api/obras - Obtener todas las obras con filtros
          const filters: ObraFilters = {
            search: query.search as string,
            page: query.page ? parseInt(query.page as string) : 1,
            limit: query.limit ? parseInt(query.limit as string) : 10,
            sortBy: (query.sortBy as 'nombre' | 'created_at') || 'nombre',
            sortOrder: (query.sortOrder as 'asc' | 'desc') || 'asc'
          }

          const page = filters.page || 1
          const limit = filters.limit || 10
          const offset = (page - 1) * limit

          // Construir query base
          let supabaseQuery = supabase
            .from('obras')
            .select(`
              *,
              obras_ejecucion!left (id),
              obras_supervision!left (id)
            `, { count: 'exact' })

          // Aplicar filtro de búsqueda
          if (filters.search) {
            supabaseQuery = supabaseQuery.ilike('nombre', `%${filters.search}%`)
          }

          // Aplicar ordenamiento
          supabaseQuery = supabaseQuery.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })

          // Aplicar paginación
          supabaseQuery = supabaseQuery.range(offset, offset + limit - 1)

          const { data: obras, error: obrasError, count } = await supabaseQuery

          if (obrasError) {
            const response: ApiResponse = {
              success: false,
              error: {
                code: 'GET_OBRAS_ERROR',
                message: 'Error al obtener obras'
              }
            }
            return res.status(500).json(response)
          }

          const response: ApiResponse = {
            success: true,
            data: {
              data: obras,
              pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
              }
            }
          }
          return res.json(response)
        }

      case 'POST':
        // POST /api/obras - Crear nueva obra
        const createData: CreateObraRequest = body
        const createErrors = validateObraData(createData)

        if (createErrors.length > 0) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: createErrors[0]
            }
          }
          return res.status(400).json(response)
        }

        // Verificar si ya existe una obra con el mismo nombre
        const { data: existingObra } = await supabase
          .from('obras')
          .select('id')
          .ilike('nombre', createData.nombre.trim())
          .single()

        if (existingObra) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'OBRA_EXISTS',
              message: 'Ya existe una obra con este nombre'
            }
          }
          return res.status(409).json(response)
        }

        // Crear obra
        const { data: newObra, error: createError } = await supabase
          .from('obras')
          .insert([{ nombre: createData.nombre.trim() }])
          .select()
          .single()

        if (createError) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'CREATE_OBRA_ERROR',
              message: 'Error al crear la obra'
            }
          }
          return res.status(500).json(response)
        }

        const createResponse: ApiResponse<Obra> = {
          success: true,
          data: newObra,
          message: 'Obra creada exitosamente'
        }
        return res.status(201).json(createResponse)

      case 'PUT':
        // PUT /api/obras/:id - Actualizar obra
        if (!query.id) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'MISSING_ID',
              message: 'ID requerido para actualización'
            }
          }
          return res.status(400).json(response)
        }

        const updateId = parseInt(query.id as string)
        if (isNaN(updateId)) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'INVALID_ID',
              message: 'ID inválido'
            }
          }
          return res.status(400).json(response)
        }

        const updateData: UpdateObraRequest = body
        const updateErrors = validateObraData(updateData)

        if (updateErrors.length > 0) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: updateErrors[0]
            }
          }
          return res.status(400).json(response)
        }

        // Verificar si la obra existe
        const { data: obraToUpdate } = await supabase
          .from('obras')
          .select('id')
          .eq('id', updateId)
          .single()

        if (!obraToUpdate) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'OBRA_NOT_FOUND',
              message: 'Obra no encontrada'
            }
          }
          return res.status(404).json(response)
        }

        // Si se actualiza el nombre, verificar duplicados
        if (updateData.nombre) {
          const { data: duplicateObra } = await supabase
            .from('obras')
            .select('id')
            .ilike('nombre', updateData.nombre.trim())
            .neq('id', updateId)
            .single()

          if (duplicateObra) {
            const response: ApiResponse = {
              success: false,
              error: {
                code: 'OBRA_EXISTS',
                message: 'Ya existe otra obra con este nombre'
              }
            }
            return res.status(409).json(response)
          }
        }

        // Actualizar obra
        const { data: updatedObra, error: updateError } = await supabase
          .from('obras')
          .update({ 
            ...(updateData.nombre && { nombre: updateData.nombre.trim() }),
            updated_at: new Date().toISOString()
          })
          .eq('id', updateId)
          .select()
          .single()

        if (updateError) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'UPDATE_OBRA_ERROR',
              message: 'Error al actualizar la obra'
            }
          }
          return res.status(500).json(response)
        }

        const updateResponse: ApiResponse<Obra> = {
          success: true,
          data: updatedObra,
          message: 'Obra actualizada exitosamente'
        }
        return res.json(updateResponse)

      case 'DELETE':
        // DELETE /api/obras/:id - Eliminar obra
        if (!query.id) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'MISSING_ID',
              message: 'ID requerido para eliminación'
            }
          }
          return res.status(400).json(response)
        }

        const deleteId = parseInt(query.id as string)
        if (isNaN(deleteId)) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'INVALID_ID',
              message: 'ID inválido'
            }
          }
          return res.status(400).json(response)
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
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'OBRA_NOT_FOUND',
              message: 'Obra no encontrada'
            }
          }
          return res.status(404).json(response)
        }

        // Verificar dependencias
        if (obraToDelete.obras_ejecucion?.length > 0 || obraToDelete.obras_supervision?.length > 0) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'OBRA_HAS_DEPENDENCIES',
              message: 'No se puede eliminar la obra porque tiene registros de ejecución o supervisión asociados'
            }
          }
          return res.status(400).json(response)
        }

        // Eliminar obra
        const { error: deleteError } = await supabase
          .from('obras')
          .delete()
          .eq('id', deleteId)

        if (deleteError) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'DELETE_OBRA_ERROR',
              message: 'Error al eliminar la obra'
            }
          }
          return res.status(500).json(response)
        }

        const deleteResponse: ApiResponse = {
          success: true,
          message: 'Obra eliminada exitosamente'
        }
        return res.json(deleteResponse)

      default:
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Método no permitido'
          }
        }
        return res.status(405).json(response)
    }
  } catch (error) {
    console.error('Error en API de obras:', error)
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor'
      }
    }
    return res.status(500).json(response)
  }
}