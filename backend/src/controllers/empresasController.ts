import { Request, Response, NextFunction } from 'express'
import { prisma } from '../index'
import { ApiResponse, PaginatedResponse, Empresa, CreateEmpresaDto, UpdateEmpresaDto, EmpresaFilters } from '../types'

// GET /api/empresas - Listar empresas con paginación y filtros
export const getEmpresas = async (
  req: Request<{}, PaginatedResponse<Empresa>, {}, EmpresaFilters>,
  res: Response<ApiResponse<PaginatedResponse<Empresa>>>,
  next: NextFunction
) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query

    // Convertir a números
    const pageNum = parseInt(page.toString())
    const limitNum = parseInt(limit.toString())
    const skip = (pageNum - 1) * limitNum

    // Construir filtros de búsqueda
    const where = search ? {
      OR: [
        { nombre: { contains: search, mode: 'insensitive' as const } },
        { ruc: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}

    // Obtener empresas con paginación
    const [empresas, total] = await Promise.all([
      prisma.empresa.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        include: {
          integrantesConsorcio: true
        }
      }),
      prisma.empresa.count({ where })
    ])

    const totalPages = Math.ceil(total / limitNum)

    const response: PaginatedResponse<Empresa> = {
      data: empresas,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    }

    res.json({
      success: true,
      data: response,
      message: `${empresas.length} empresas encontradas`
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/empresas/:id - Obtener empresa por ID
export const getEmpresaById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Empresa>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const empresa = await prisma.empresa.findUnique({
      where: { id: parseInt(id) },
      include: {
        integrantesConsorcio: true
      }
    })

    if (!empresa) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Empresa no encontrada'
        }
      })
    }

    res.json({
      success: true,
      data: empresa,
      message: 'Empresa encontrada'
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/empresas - Crear nueva empresa
export const createEmpresa = async (
  req: Request<{}, {}, CreateEmpresaDto>,
  res: Response<ApiResponse<Empresa>>,
  next: NextFunction
) => {
  try {
    const { integrantesConsorcio, ...empresaData } = req.body

    const empresa = await prisma.empresa.create({
      data: {
        ...empresaData,
        integrantesConsorcio: integrantesConsorcio ? {
          create: integrantesConsorcio.map(integrante => ({
            nombre: integrante.nombre,
            ruc: integrante.ruc,
            porcentajeParticipacion: integrante.porcentajeParticipacion
          }))
        } : undefined
      },
      include: {
        integrantesConsorcio: true
      }
    })

    res.status(201).json({
      success: true,
      data: empresa,
      message: 'Empresa creada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/empresas/:id - Actualizar empresa
export const updateEmpresa = async (
  req: Request<{ id: string }, {}, UpdateEmpresaDto>,
  res: Response<ApiResponse<Empresa>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { integrantesConsorcio, ...updateData } = req.body

    // Verificar que la empresa existe
    const empresaExistente = await prisma.empresa.findUnique({
      where: { id: parseInt(id) }
    })

    if (!empresaExistente) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Empresa no encontrada'
        }
      })
    }

    // Actualizar empresa y sus integrantes en una transacción
    const empresa = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos de la empresa
      const empresaActualizada = await tx.empresa.update({
        where: { id: parseInt(id) },
        data: updateData
      })

      // Si se proporcionan integrantes, reemplazar todos
      if (integrantesConsorcio !== undefined) {
        // Eliminar integrantes existentes
        await tx.integranteConsorcio.deleteMany({
          where: { empresaId: parseInt(id) }
        })

        // Crear nuevos integrantes si los hay
        if (integrantesConsorcio.length > 0) {
          await tx.integranteConsorcio.createMany({
            data: integrantesConsorcio.map(integrante => ({
              empresaId: parseInt(id),
              nombre: integrante.nombre,
              ruc: integrante.ruc,
              porcentajeParticipacion: integrante.porcentajeParticipacion
            }))
          })
        }
      }

      // Retornar empresa completa con relaciones
      return tx.empresa.findUnique({
        where: { id: parseInt(id) },
        include: {
          integrantesConsorcio: true
        }
      })
    })

    res.json({
      success: true,
      data: empresa!,
      message: 'Empresa actualizada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/empresas/:id - Eliminar empresa
export const deleteEmpresa = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // Verificar que la empresa existe
    const empresaExistente = await prisma.empresa.findUnique({
      where: { id: parseInt(id) }
    })

    if (!empresaExistente) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Empresa no encontrada'
        }
      })
    }

    // Verificar si la empresa está siendo utilizada en obras
    const [obrasEjecucionEjecutora, obrasEjecucionSupervisora, obrasSupervisionEjecutora, obrasSupervisionSupervisora] = await Promise.all([
      prisma.obraEjecucion.count({ where: { empresaEjecutoraId: parseInt(id) } }),
      prisma.obraEjecucion.count({ where: { empresaSupervisoraId: parseInt(id) } }),
      prisma.obraSupervision.count({ where: { empresaEjecutoraId: parseInt(id) } }),
      prisma.obraSupervision.count({ where: { empresaSupervisoraId: parseInt(id) } })
    ])

    const totalObras = obrasEjecucionEjecutora + obrasEjecucionSupervisora + obrasSupervisionEjecutora + obrasSupervisionSupervisora

    if (totalObras > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONSTRAINT_ERROR',
          message: `No se puede eliminar la empresa porque está asociada a ${totalObras} obra(s)`
        }
      })
    }

    await prisma.empresa.delete({
      where: { id: parseInt(id) }
    })

    res.json({
      success: true,
      message: 'Empresa eliminada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}