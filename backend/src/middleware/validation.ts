import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { VALIDATION_RULES } from '../types'

// Middleware para validar el cuerpo de la request
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      error.isJoi = true
      return next(error)
    }
    next()
  }
}

// Middleware para validar parámetros de query
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, { abortEarly: false })
    if (error) {
      error.isJoi = true
      return next(error)
    }
    next()
  }
}

// Middleware para validar parámetros de ruta
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false })
    if (error) {
      error.isJoi = true
      return next(error)
    }
    next()
  }
}

// Esquemas de validación comunes
export const commonSchemas = {
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  empresa: Joi.object({
    nombre: Joi.string()
      .min(VALIDATION_RULES.NOMBRE_MIN_LENGTH)
      .max(VALIDATION_RULES.NOMBRE_MAX_LENGTH)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 255 caracteres',
        'any.required': 'El nombre es obligatorio'
      }),
    
    ruc: Joi.string()
      .length(VALIDATION_RULES.RUC_LENGTH)
      .pattern(/^\d+$/)
      .required()
      .messages({
        'string.length': 'El RUC debe tener exactamente 11 dígitos',
        'string.pattern.base': 'El RUC debe contener solo números',
        'any.required': 'El RUC es obligatorio'
      }),
    
    telefono: Joi.string().allow('', null).optional(),
    
    esConsorcio: Joi.boolean().default(false),
    
    integrantesConsorcio: Joi.array().items(
      Joi.object({
        nombre: Joi.string()
          .min(VALIDATION_RULES.NOMBRE_MIN_LENGTH)
          .max(VALIDATION_RULES.NOMBRE_MAX_LENGTH)
          .required(),
        
        ruc: Joi.string()
          .length(VALIDATION_RULES.RUC_LENGTH)
          .pattern(/^\d+$/)
          .required(),
        
        porcentajeParticipacion: Joi.number()
          .min(VALIDATION_RULES.PORCENTAJE_MIN)
          .max(VALIDATION_RULES.PORCENTAJE_MAX)
          .required()
      })
    ).optional().custom((value, helpers) => {
      // Solo validar porcentajes si es un consorcio y hay integrantes
      if (value && value.length > 0) {
        const totalPorcentaje = value.reduce(
          (sum: number, integrante: any) => sum + integrante.porcentajeParticipacion, 
          0
        )
        
        if (totalPorcentaje > 100) {
          return helpers.error('custom.porcentajeExcedeConsorcio')
        }
      }
      
      return value
    }).messages({
      'custom.porcentajeExcedeConsorcio': 'La suma de porcentajes del consorcio no puede exceder 100%'
    })
  }).custom((value, helpers) => {
    // Validar que si es consorcio, tenga al menos un integrante
    if (value.esConsorcio && (!value.integrantesConsorcio || value.integrantesConsorcio.length === 0)) {
      return helpers.error('custom.consorcioSinIntegrantes')
    }
    
    return value
  }).messages({
    'custom.consorcioSinIntegrantes': 'Un consorcio debe tener al menos un integrante'
  }),

  obra: Joi.object({
    nombreObra: Joi.string()
      .min(VALIDATION_RULES.NOMBRE_MIN_LENGTH)
      .max(VALIDATION_RULES.NOMBRE_MAX_LENGTH)
      .required()
      .messages({
        'any.required': 'El nombre de la obra es obligatorio'
      }),
    
    numeroContrato: Joi.string()
      .min(VALIDATION_RULES.CONTRATO_MIN_LENGTH)
      .max(VALIDATION_RULES.CONTRATO_MAX_LENGTH)
      .required()
      .messages({
        'any.required': 'El número de contrato es obligatorio'
      }),
    
    numeroExpediente: Joi.string().required().messages({
      'any.required': 'El número de expediente es obligatorio'
    }),
    
    periodoValorizado: Joi.string().required().messages({
      'any.required': 'El período valorizado es obligatorio'
    }),
    
    fechaInicio: Joi.date().max('now').required().messages({
      'date.max': 'La fecha de inicio no puede ser futura',
      'any.required': 'La fecha de inicio es obligatoria'
    }),
    
    plazoEjecucion: Joi.number()
      .integer()
      .min(VALIDATION_RULES.PLAZO_MIN)
      .max(VALIDATION_RULES.PLAZO_MAX)
      .required()
      .messages({
        'number.min': 'El plazo debe ser al menos 1 día',
        'number.max': 'El plazo no puede exceder 10 años',
        'any.required': 'El plazo de ejecución es obligatorio'
      }),
    
    empresaEjecutoraId: Joi.number().integer().positive().required().messages({
      'any.required': 'La empresa ejecutora es obligatoria'
    }),
    
    empresaSupervisoraId: Joi.number().integer().positive().required().messages({
      'any.required': 'La empresa supervisora es obligatoria'
    }),
    
    profesionales: Joi.array().items(
      Joi.object({
        nombreCompleto: Joi.string()
          .min(VALIDATION_RULES.NOMBRE_MIN_LENGTH)
          .max(VALIDATION_RULES.NOMBRE_MAX_LENGTH)
          .required(),
        
        cargo: Joi.string()
          .min(VALIDATION_RULES.NOMBRE_MIN_LENGTH)
          .max(VALIDATION_RULES.NOMBRE_MAX_LENGTH)
          .required(),
        
        porcentajeParticipacion: Joi.number()
          .min(VALIDATION_RULES.PORCENTAJE_MIN)
          .max(VALIDATION_RULES.PORCENTAJE_MAX)
          .required()
      })
    ).min(1).required().messages({
      'array.min': 'Debe incluir al menos un profesional'
    })
  }).custom((value, helpers) => {
    // Validar que la suma de porcentajes no exceda 100%
    const totalPorcentaje = value.profesionales.reduce(
      (sum: number, prof: any) => sum + prof.porcentajeParticipacion, 
      0
    )
    
    if (totalPorcentaje > 100) {
      return helpers.error('custom.porcentajeExcede')
    }
    
    return value
  }).messages({
    'custom.porcentajeExcede': 'La suma de porcentajes de participación no puede exceder 100%'
  })
}