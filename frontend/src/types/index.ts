// Interfaces base de entidades
export interface Obra {
  id: number
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  empresaEjecutora?: Empresa
  empresaSupervisora?: Empresa
  profesionales: Profesional[]
  createdAt: string
  updatedAt: string
}

export interface Empresa {
  id: number
  nombre: string
  ruc: string
  telefono?: string | null
  esConsorcio: boolean
  createdAt: string
  updatedAt: string
  integrantesConsorcio?: IntegranteConsorcio[]
}

export interface IntegranteConsorcio {
  id: number
  empresaId: number
  nombre: string
  ruc: string
  porcentajeParticipacion: number
  createdAt: string
  updatedAt: string
}

export interface Profesional {
  id: number
  obraId: number
  nombreCompleto: string
  cargo: string
  porcentajeParticipacion: number
  createdAt: string
  updatedAt: string
}

// Tipos para formularios
export interface FormularioObraData {
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  profesionales: ProfesionalFormData[]
}

export interface FormularioEmpresaData {
  nombre: string
  ruc: string
  telefono?: string
  esConsorcio: boolean
  integrantesConsorcio: IntegranteConsorcioFormData[]
}

export interface IntegranteConsorcioFormData {
  nombre: string
  ruc: string
  porcentajeParticipacion: number
}

export interface ProfesionalFormData {
  nombreCompleto: string
  cargo: string
  porcentajeParticipacion: number
}

// Tipos de respuesta de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para filtros y búsqueda
export interface ObraFilters {
  search?: string
  empresaEjecutoraId?: number
  empresaSupervisoraId?: number
  fechaInicio?: {
    from?: string
    to?: string
  }
  page?: number
  limit?: number
  sortBy?: 'nombreObra' | 'numeroContrato' | 'fechaInicio' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface EmpresaFilters {
  search?: string
  page?: number
  limit?: number
  sortBy?: 'nombre' | 'ruc' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Enums
export enum ModuloTipo {
  EJECUCION = 'ejecucion',
  SUPERVISION = 'supervision'
}

export enum TipoNotificacion {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Tipos para componentes
export interface TablaColumn<T> {
  id: keyof T
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: any, row?: T) => React.ReactNode
}

export interface FormFieldProps {
  name: string
  label: string
  required?: boolean
  type?: 'text' | 'email' | 'number' | 'date' | 'select'
  options?: { value: any; label: string }[]
  multiline?: boolean
  rows?: number
  helperText?: string
}

// Tipos para navegación
export interface MenuItem {
  id: string
  label: string
  path: string
  icon?: React.ComponentType
  color?: string
}

// Tipos para estado de la aplicación
export interface AppState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface User {
  id: number
  email: string
  name: string
  role: string
}

// Tipos para hooks personalizados
export interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  enabled?: boolean
}

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

// Constantes de validación (frontend)
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  EMAIL_INVALID: 'Ingrese un email válido',
  RUC_INVALID: 'El RUC debe tener 11 dígitos',
  PORCENTAJE_INVALID: 'El porcentaje debe estar entre 0 y 100',
  PORCENTAJE_EXCEDE: 'La suma de porcentajes no puede exceder 100%',
  FECHA_FUTURA: 'La fecha no puede ser futura',
  CONTRATO_DUPLICADO: 'El número de contrato ya existe',
  NUMERO_POSITIVO: 'Debe ser un número positivo'
} as const

export const VALIDATION_RULES = {
  RUC_LENGTH: 11,
  PORCENTAJE_MIN: 0,
  PORCENTAJE_MAX: 100,
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 255,
  CONTRATO_MIN_LENGTH: 5,
  CONTRATO_MAX_LENGTH: 50,
  PLAZO_MIN: 1,
  PLAZO_MAX: 3650
} as const

// Tipos específicos por módulo
export type ObraEjecucion = Obra
export type ObraSupervision = Obra
export type ProfesionalEjecucion = Profesional
export type ProfesionalSupervision = Profesional