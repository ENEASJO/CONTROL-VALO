import { Request, Response, NextFunction } from 'express'
import { prisma } from '../index'
import { 
  ApiResponse, 
  PaginatedResponse, 
  Obra, 
  Profesional,
  CreateObraDto, 
  UpdateObraDto,
  CreateProfesionalDto,
  UpdateProfesionalDto,
  ObraFilters 
} from '../types'

// GET /api/supervision/obras - Listar obras de supervisión
export const getObras = async (
  req: Request<{}, {}, {}, ObraFilters>,
  res: Response<ApiResponse<PaginatedResponse<Obra>>>,
  next: NextFunction
) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      empresaEjecutoraId,
      empresaSupervisoraId,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { nombreObra: { contains: search, mode: 'insensitive' } },
        { numeroContrato: { contains: search, mode: 'insensitive' } },
        { numeroExpediente: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (empresaEjecutoraId) {
      where.empresaEjecutoraId = parseInt(empresaEjecutoraId.toString())
    }

    if (empresaSupervisoraId) {
      where.empresaSupervisoraId = parseInt(empresaSupervisoraId.toString())
    }

    // Obtener obras con relaciones
    const [obras, total] = await Promise.all([
      prisma.obraSupervision.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          empresaEjecutora: true,
          empresaSupervisora: true,
          profesionales: {
            orderBy: { porcentajeParticipacion: 'desc' }
          }
        }
      }),
      prisma.obraSupervision.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    const response: PaginatedResponse<Obra> = {
      data: obras.map(obra => ({
        ...obra,
        profesionales: obra.profesionales.map(prof => ({
          ...prof,
          porcentajeParticipacion: Number(prof.porcentajeParticipacion)
        }))
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    res.json({
      success: true,
      data: response,
      message: `${obras.length} obras de supervisión encontradas`
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/supervision/obras/:id - Obtener obra de supervisión por ID
export const getObraById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Obra>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const obra = await prisma.obraSupervision.findUnique({
      where: { id: parseInt(id) },
      include: {
        empresaEjecutora: true,
        empresaSupervisora: true,
        profesionales: {
          orderBy: { porcentajeParticipacion: 'desc' }
        }
      }
    })

    if (!obra) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Obra de supervisión no encontrada'
        }
      })
    }

    const obraResponse = {
      ...obra,
      profesionales: obra.profesionales.map(prof => ({
        ...prof,
        porcentajeParticipacion: Number(prof.porcentajeParticipacion)
      }))
    }

    res.json({
      success: true,
      data: obraResponse,
      message: 'Obra de supervisión encontrada'
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/supervision/obras - Crear nueva obra de supervisión
export const createObra = async (
  req: Request<{}, {}, CreateObraDto>,
  res: Response<ApiResponse<Obra>>,
  next: NextFunction
) => {
  try {
    const { profesionales, ...obraData } = req.body

    // Verificar que las empresas existen
    const [empresaEjecutora, empresaSupervisora] = await Promise.all([
      prisma.empresa.findUnique({ where: { id: obraData.empresaEjecutoraId } }),
      prisma.empresa.findUnique({ where: { id: obraData.empresaSupervisoraId } })
    ])

    if (!empresaEjecutora) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Empresa ejecutora no encontrada'
        }
      })
    }

    if (!empresaSupervisora) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Empresa supervisora no encontrada'
        }
      })
    }

    // Crear obra con profesionales en una transacción
    const obra = await prisma.obraSupervision.create({
      data: {
        ...obraData,
        fechaInicio: new Date(obraData.fechaInicio),
        profesionales: {
          create: profesionales.map(prof => ({
            nombreCompleto: prof.nombreCompleto,
            cargo: prof.cargo,
            porcentajeParticipacion: prof.porcentajeParticipacion
          }))
        }
      },
      include: {
        empresaEjecutora: true,
        empresaSupervisora: true,
        profesionales: {
          orderBy: { porcentajeParticipacion: 'desc' }
        }
      }
    })

    const obraResponse = {
      ...obra,
      profesionales: obra.profesionales.map(prof => ({
        ...prof,
        porcentajeParticipacion: Number(prof.porcentajeParticipacion)
      }))
    }

    res.status(201).json({
      success: true,
      data: obraResponse,
      message: 'Obra de supervisión creada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/supervision/obras/:id - Actualizar obra de supervisión
export const updateObra = async (
  req: Request<{ id: string }, {}, UpdateObraDto>,
  res: Response<ApiResponse<Obra>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { profesionales, ...updateData } = req.body

    // Verificar que la obra existe
    const obraExistente = await prisma.obraSupervision.findUnique({
      where: { id: parseInt(id) }
    })

    if (!obraExistente) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Obra de supervisión no encontrada'
        }
      })
    }

    // Preparar datos de actualización
    const dataToUpdate: any = { ...updateData }
    if (updateData.fechaInicio) {
      dataToUpdate.fechaInicio = new Date(updateData.fechaInicio)
    }

    // Actualizar obra y profesionales si se proporcionan
    const obra = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos de la obra
      const obraActualizada = await tx.obraSupervision.update({
        where: { id: parseInt(id) },
        data: dataToUpdate
      })

      // Si se proporcionan profesionales, reemplazar todos
      if (profesionales) {
        // Eliminar profesionales existentes
        await tx.profesionalSupervision.deleteMany({
          where: { obraId: parseInt(id) }
        })

        // Crear nuevos profesionales
        await tx.profesionalSupervision.createMany({
          data: profesionales.map(prof => ({
            obraId: parseInt(id),
            nombreCompleto: prof.nombreCompleto,
            cargo: prof.cargo,
            porcentajeParticipacion: prof.porcentajeParticipacion
          }))
        })
      }

      // Retornar obra completa con relaciones
      return tx.obraSupervision.findUnique({
        where: { id: parseInt(id) },
        include: {
          empresaEjecutora: true,
          empresaSupervisora: true,
          profesionales: {
            orderBy: { porcentajeParticipacion: 'desc' }
          }
        }
      })
    })

    const obraResponse = {
      ...obra!,
      profesionales: obra!.profesionales.map(prof => ({
        ...prof,
        porcentajeParticipacion: Number(prof.porcentajeParticipacion)
      }))
    }

    res.json({
      success: true,
      data: obraResponse,
      message: 'Obra de supervisión actualizada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/supervision/obras/:id - Eliminar obra de supervisión
export const deleteObra = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // Verificar que la obra existe
    const obraExistente = await prisma.obraSupervision.findUnique({
      where: { id: parseInt(id) }
    })

    if (!obraExistente) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Obra de supervisión no encontrada'
        }
      })
    }

    // Eliminar obra (los profesionales se eliminan automáticamente por CASCADE)
    await prisma.obraSupervision.delete({
      where: { id: parseInt(id) }
    })

    res.json({
      success: true,
      message: 'Obra de supervisión eliminada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/supervision/obras/:id/profesionales - Listar profesionales de una obra
export const getProfesionales = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Profesional[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // Verificar que la obra existe
    const obra = await prisma.obraSupervision.findUnique({
      where: { id: parseInt(id) }
    })

    if (!obra) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Obra de supervisión no encontrada'
        }
      })
    }

    const profesionales = await prisma.profesionalSupervision.findMany({
      where: { obraId: parseInt(id) },
      orderBy: { porcentajeParticipacion: 'desc' }
    })

    const profesionalesResponse = profesionales.map(prof => ({
      ...prof,
      porcentajeParticipacion: Number(prof.porcentajeParticipacion)
    }))

    res.json({
      success: true,
      data: profesionalesResponse,
      message: `${profesionales.length} profesionales encontrados`
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/supervision/obras/:id/profesionales - Agregar profesional a obra
export const addProfesional = async (
  req: Request<{ id: string }, {}, CreateProfesionalDto>,
  res: Response<ApiResponse<Profesional>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const profesionalData = req.body

    // Verificar que la obra existe
    const obra = await prisma.obraSupervision.findUnique({
      where: { id: parseInt(id) }
    })

    if (!obra) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Obra de supervisión no encontrada'
        }
      })
    }

    // Verificar que la suma de porcentajes no exceda 100%
    const profesionalesExistentes = await prisma.profesionalSupervision.findMany({
      where: { obraId: parseInt(id) }
    })

    const totalPorcentajeExistente = profesionalesExistentes.reduce(
      (sum, prof) => sum + Number(prof.porcentajeParticipacion), 
      0
    )

    if (totalPorcentajeExistente + profesionalData.porcentajeParticipacion > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'La suma de porcentajes de participación no puede exceder 100%'
        }
      })
    }

    const profesional = await prisma.profesionalSupervision.create({
      data: {
        obraId: parseInt(id),
        ...profesionalData
      }
    })

    const profesionalResponse = {
      ...profesional,
      porcentajeParticipacion: Number(profesional.porcentajeParticipacion)
    }

    res.status(201).json({
      success: true,
      data: profesionalResponse,
      message: 'Profesional agregado exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/supervision/profesionales/:id - Actualizar profesional
export const updateProfesional = async (
  req: Request<{ id: string }, {}, UpdateProfesionalDto>,
  res: Response<ApiResponse<Profesional>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Verificar que el profesional existe
    const profesionalExistente = await prisma.profesionalSupervision.findUnique({
      where: { id: parseInt(id) }
    })

    if (!profesionalExistente) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Profesional no encontrado'
        }
      })
    }

    // Si se actualiza el porcentaje, verificar que no exceda 100%
    if (updateData.porcentajeParticipacion !== undefined) {
      const otrosProfesionales = await prisma.profesionalSupervision.findMany({
        where: { 
          obraId: profesionalExistente.obraId,
          id: { not: parseInt(id) }
        }
      })

      const totalOtrosPorcentajes = otrosProfesionales.reduce(
        (sum, prof) => sum + Number(prof.porcentajeParticipacion), 
        0
      )

      if (totalOtrosPorcentajes + updateData.porcentajeParticipacion > 100) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'La suma de porcentajes de participación no puede exceder 100%'
          }
        })
      }
    }

    const profesional = await prisma.profesionalSupervision.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    const profesionalResponse = {
      ...profesional,
      porcentajeParticipacion: Number(profesional.porcentajeParticipacion)
    }

    res.json({
      success: true,
      data: profesionalResponse,
      message: 'Profesional actualizado exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/supervision/profesionales/:id - Eliminar profesional
export const deleteProfesional = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // Verificar que el profesional existe
    const profesionalExistente = await prisma.profesionalSupervision.findUnique({
      where: { id: parseInt(id) }
    })

    if (!profesionalExistente) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Profesional no encontrado'
        }
      })
    }

    await prisma.profesionalSupervision.delete({
      where: { id: parseInt(id) }
    })

    res.json({
      success: true,
      message: 'Profesional eliminado exitosamente'
    })
  } catch (error) {
    next(error)
  }
}