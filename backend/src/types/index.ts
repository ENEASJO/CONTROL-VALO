// Tipos actualizados para SQLite

// Interfaces base de entidades
export interface Obra {
  id: number
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: Date
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  empresaEjecutora?: Empresa
  empresaSupervisora?: Empresa
  profesionales: Profesional[]
  createdAt: Date
  updatedAt: Date
}

export interface Empresa {
  id: number
  nombre: string
  ruc: string
  telefono?: string | null
  esConsorcio: boolean
  createdAt: Date
  updatedAt: Date
  integrantesConsorcio?: IntegranteConsorcio[]
}

export interface IntegranteConsorcio {
  id: number
  empresaId: number
  nombre: string
  ruc: string
  porcentajeParticipacion: number
  createdAt: Date
  updatedAt: Date
}

export interface Profesional {
  id: number
  obraId: number
  nombreCompleto: string
  cargo: string
  porcentajeParticipacion: number
  createdAt: Date
  updatedAt: Date
}

// DTOs para formularios y requests
export interface CreateObraDto {
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  profesionales: CreateProfesionalDto[]
}

export interface UpdateObraDto {
  nombreObra?: string
  numeroContrato?: string
  numeroExpediente?: string
  periodoValorizado?: string
  fechaInicio?: string
  plazoEjecucion?: number
  empresaEjecutoraId?: number
  empresaSupervisoraId?: number
  profesionales?: CreateProfesionalDto[]
}

export interface CreateEmpresaDto {
  nombre: string
  ruc: string
  telefono?: string
  esConsorcio: boolean
  integrantesConsorcio?: CreateIntegranteConsorcioDto[]
}

export interface UpdateEmpresaDto {
  nombre?: string
  ruc?: string
  telefono?: string
  esConsorcio?: boolean
  integrantesConsorcio?: CreateIntegranteConsorcioDto[]
}

export interface CreateIntegranteConsorcioDto {
  nombre: string
  ruc: string
  porcentajeParticipacion: number
}

export interface CreateProfesionalDto {
  nombreCompleto: string
  cargo: string
  porcentajeParticipacion: number
}

export interface UpdateProfesionalDto {
  nombreCompleto?: string
  cargo?: string
  porcentajeParticipacion?: number
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

// Tipos para validación
export interface ValidationError {
  field: string
  message: string
  value?: any
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

// Tipos específicos por módulo
export type ObraEjecucion = Obra
export type ObraSupervision = Obra
export type ProfesionalEjecucion = Profesional
export type ProfesionalSupervision = Profesional

// Enums
export enum ModuloTipo {
  EJECUCION = 'ejecucion',
  SUPERVISION = 'supervision'
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

// Tipos para middleware
export interface RequestWithUser extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

// Constantes de validación
export const VALIDATION_RULES = {
  RUC_LENGTH: 11,
  PORCENTAJE_MIN: 0,
  PORCENTAJE_MAX: 100,
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 255,
  CONTRATO_MIN_LENGTH: 5,
  CONTRATO_MAX_LENGTH: 50,
  PLAZO_MIN: 1,
  PLAZO_MAX: 3650 // 10 años máximo
} as const