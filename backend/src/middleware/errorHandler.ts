import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ApiResponse } from '../types'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  console.error('❌ Error:', error)

  // Error de validación de Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación en los datos',
        details: error.message
      }
    })
  }

  // Error de constraint único de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const field = error.meta?.target as string[]
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: `Ya existe un registro con este ${field?.[0] || 'valor'}`,
          details: error.meta
        }
      })
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Registro no encontrado'
        }
      })
    }
  }

  // Error de validación de Joi
  if (error.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación',
        details: error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      }
    })
  }

  // Error personalizado con status
  if (error.status) {
    return res.status(error.status).json({
      success: false,
      error: {
        code: error.code || 'CUSTOM_ERROR',
        message: error.message
      }
    })
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor'
    }
  })
}