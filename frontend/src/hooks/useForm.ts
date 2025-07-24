import { useState, useCallback } from 'react'

export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
}

export interface FormConfig<T extends Record<string, any>> {
  initialValues: T
  validationRules?: Partial<Record<keyof T, (value: any) => string | undefined>>
  onSubmit?: (values: T) => Promise<void> | void
}

export const useForm = <T extends Record<string, any>>(config: FormConfig<T>) => {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields = {} as Record<keyof T, FormField>
    Object.keys(config.initialValues).forEach((key) => {
      initialFields[key as keyof T] = {
        value: config.initialValues[key],
        error: undefined,
        touched: false,
      }
    })
    return initialFields
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>()

  // Obtener valores actuales del formulario
  const getValues = useCallback((): T => {
    const values = {} as T
    Object.keys(fields).forEach((key) => {
      values[key as keyof T] = fields[key as keyof T].value
    })
    return values
  }, [fields])

  // Establecer valor de un campo
  const setValue = useCallback((name: keyof T, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: config.validationRules?.[name]?.(value),
        touched: true,
      }
    }))
  }, [config.validationRules])

  // Establecer error de un campo
  const setError = useCallback((name: keyof T, error: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      }
    }))
  }, [])

  // Marcar campo como tocado
  const setTouched = useCallback((name: keyof T, touched = true) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
      }
    }))
  }, [])

  // Validar todo el formulario
  const validate = useCallback((): boolean => {
    let isValid = true
    const newFields = { ...fields }

    Object.keys(fields).forEach((key) => {
      const fieldKey = key as keyof T
      const validator = config.validationRules?.[fieldKey]
      if (validator) {
        const error = validator(fields[fieldKey].value)
        newFields[fieldKey] = {
          ...newFields[fieldKey],
          error,
          touched: true,
        }
        if (error) {
          isValid = false
        }
      }
    })

    setFields(newFields)
    return isValid
  }, [fields, config.validationRules])

  // Resetear formulario
  const reset = useCallback(() => {
    const resetFields = {} as Record<keyof T, FormField>
    Object.keys(config.initialValues).forEach((key) => {
      resetFields[key as keyof T] = {
        value: config.initialValues[key],
        error: undefined,
        touched: false,
      }
    })
    setFields(resetFields)
    setSubmitError(undefined)
    setIsSubmitting(false)
  }, [config.initialValues])

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!validate()) {
      return
    }

    if (!config.onSubmit) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(undefined)

    try {
      await config.onSubmit(getValues())
    } catch (error: any) {
      setSubmitError(error.message || 'Error al enviar formulario')
    } finally {
      setIsSubmitting(false)
    }
  }, [validate, config.onSubmit, getValues])

  // Verificar si el formulario es válido
  const isValid = Object.values(fields).every(field => !field.error)
  
  // Verificar si el formulario ha sido modificado
  const isDirty = Object.keys(fields).some(key => 
    fields[key as keyof T].value !== config.initialValues[key as keyof T]
  )

  return {
    fields,
    values: getValues(),
    setValue,
    setError,
    setTouched,
    validate,
    reset,
    handleSubmit,
    isSubmitting,
    submitError,
    isValid,
    isDirty,
  }
}

// Validadores comunes
export const validators = {
  required: (message = 'Este campo es requerido') => (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message
    }
    return undefined
  },

  email: (message = 'Email inválido') => (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message
    }
    return undefined
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `Debe tener al menos ${min} caracteres`
    }
    return undefined
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message || `No debe exceder ${max} caracteres`
    }
    return undefined
  },

  ruc: (message = 'RUC inválido') => (value: string) => {
    if (value && !/^\d{11}$/.test(value)) {
      return message
    }
    return undefined
  },

  percentage: (message = 'Debe ser un porcentaje válido (0-100)') => (value: number) => {
    if (value !== undefined && (value < 0 || value > 100)) {
      return message
    }
    return undefined
  },
}