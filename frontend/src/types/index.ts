// Tipos base comunes
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// Tipos para paginación
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

// Tipos para filtros de búsqueda
export interface SearchFilters {
  search?: string
  [key: string]: any
}

// Tipos para respuestas de API
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  pagination?: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// Tipos para formularios
export interface FormErrors {
  [key: string]: string | undefined
}

export interface FormState<T> {
  values: T
  errors: FormErrors
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

// Tipos para estados de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = any> {
  data?: T
  error?: string
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

// Tipos para modales
export interface ModalState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view' | 'delete'
  data?: any
}

// Tipos para notificaciones
export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info'

export interface NotificationData {
  message: string
  severity: NotificationSeverity
  autoHideDuration?: number
}

// Tipos para configuración de tablas
export interface TableColumn<T = any> {
  id: keyof T
  label: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  format?: (value: any, row: T) => React.ReactNode
}

// Alias para compatibilidad con código existente
export type TablaColumn<T = any> = TableColumn<T>

export interface TableState {
  page: number
  rowsPerPage: number
  orderBy?: string
  order: 'asc' | 'desc'
  selected: (string | number)[]
}

// Tipos para rutas y navegación
export interface RouteItem {
  path: string
  label: string
  icon?: React.ComponentType
  children?: RouteItem[]
}

// Tipos de fechas (helpers)
export type DateString = string // ISO date string
export type TimeString = string // ISO time string
export type DateTimeString = string // ISO datetime string

// Tipos para exportación de datos
export type ExportFormat = 'excel' | 'pdf' | 'csv'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  columns?: string[]
  filters?: Record<string, any>
}

// Tipos para validación
export type ValidationRule<T = any> = (value: T) => string | undefined
export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule[]>>

// Tipos para permisos (si se implementa autenticación)
export type Permission = string
export type Role = string

export interface UserPermissions {
  roles: Role[]
  permissions: Permission[]
}

// Tipos específicos del dominio de construcción
export type TipoObra = 'ejecucion' | 'supervision'
export type EstadoObra = 'planificada' | 'en_proceso' | 'completada' | 'suspendida'
export type TipoEmpresa = 'constructora' | 'supervisora' | 'consorcio'
export type ModuloTipo = 'ejecucion' | 'supervision'

// Constantes para ModuloTipo (para usar como valores)
export const MODULO_TIPO = {
  EJECUCION: 'ejecucion' as const,
  SUPERVISION: 'supervision' as const
} as const

// Tipos de empresas
export interface Empresa extends BaseEntity {
  nombre: string
  ruc: string
  telefono?: string
  email?: string
  direccion?: string
  esConsorcio: boolean
  integrantesConsorcio?: IntegranteConsorcio[]
}

export interface IntegranteConsorcio {
  id: number
  empresaId: number
  nombre: string
  ruc: string
  porcentajeParticipacion: number
}

// Tipos de profesionales
export interface Profesional extends BaseEntity {
  nombres: string
  apellidos: string
  documentoIdentidad: string
  cip?: string
  telefono?: string
  email?: string
  especialidad: string
}

export interface ProfesionalFormData {
  nombres: string
  apellidos: string
  documentoIdentidad: string
  cip?: string
  telefono?: string
  email?: string
  especialidad: string
  nombreCompleto?: string
  cargo?: string
  porcentajeParticipacion?: number
}

// Tipos de obras
export interface ObraBase extends BaseEntity {
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  montoContrato: number
  ubicacion: string
  descripcion?: string
  estado: EstadoObra
}

export interface FormularioObraData {
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  montoContrato: number
  ubicacion: string
  descripcion?: string
  empresaEjecutoraId?: number
  empresaSupervisoraId?: number
  profesionales?: ProfesionalFormData[]
}

// Tipo Obra completo (extendiendo ObraBase con relaciones)
export interface Obra extends ObraBase {
  empresaEjecutora?: Empresa
  empresaSupervisora?: Empresa
  profesionales?: ProfesionalFormData[]
  modulo: ModuloTipo
}

// Tipos para filtros de obras
export interface ObraFilters extends SearchFilters {
  estado?: EstadoObra
  empresaEjecutoraId?: number
  empresaSupervisoraId?: number
  fechaInicioDesde?: string
  fechaInicioHasta?: string
  modulo?: ModuloTipo
}

// Tipos para servicios de empresas (compatibilidad con servicios antiguos)
export interface EmpresaFilters extends SearchFilters {
  nombre?: string
  ruc?: string
  esConsorcio?: boolean
}

export interface FormularioEmpresaData {
  nombre: string
  ruc: string
  telefono?: string
  email?: string
  direccion?: string
  esConsorcio?: boolean
  integrantesConsorcio?: Omit<IntegranteConsorcio, 'id' | 'empresaId'>[]
}

// Reglas de validación
export const VALIDATION_RULES = {
  required: 'Este campo es obligatorio',
  email: 'Ingrese un email válido',
  phone: 'Ingrese un teléfono válido',
  ruc: 'Ingrese un RUC válido',
  cip: 'Ingrese un CIP válido',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  numeric: 'Solo se permiten números',
  positive: 'Debe ser un número positivo',
  percentage: 'Debe ser un porcentaje válido (0-100)',
  dateFormat: 'Formato de fecha inválido',
  contractNumber: 'Formato de número de contrato inválido',
  expedientNumber: 'Formato de número de expediente inválido',
  NOMBRE_MIN_LENGTH: 3,
  NOMBRE_MAX_LENGTH: 100,
  CONTRATO_MIN_LENGTH: 5,
  CONTRATO_MAX_LENGTH: 50,
  PLAZO_MIN: 1,
  PLAZO_MAX: 3650,
  PORCENTAJE_MIN: 0,
  PORCENTAJE_MAX: 100,
} as const

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Ingrese un email válido',
  INVALID_PHONE: 'Ingrese un teléfono válido',
  INVALID_RUC: 'El RUC debe tener 11 dígitos',
  INVALID_CIP: 'El CIP debe tener el formato correcto',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  INVALID_NUMBER: 'Debe ser un número válido',
  INVALID_POSITIVE: 'Debe ser un número positivo',
  INVALID_PERCENTAGE: 'Debe estar entre 0 y 100',
  INVALID_DATE: 'Fecha inválida',
  FUTURE_DATE_REQUIRED: 'La fecha debe ser futura',
  PAST_DATE_REQUIRED: 'La fecha debe ser pasada',
  REQUIRED: 'Este campo es obligatorio',
  FECHA_FUTURA: 'La fecha debe ser futura',
  PORCENTAJE_INVALID: 'El porcentaje debe estar entre 0 y 100',
  PORCENTAJE_EXCEDE: 'La suma de porcentajes no puede exceder 100%',
  NOMBRE_MIN_LENGTH: 3,
  NOMBRE_MAX_LENGTH: 100,
  CONTRATO_MIN_LENGTH: 5,
  CONTRATO_MAX_LENGTH: 50,
  PLAZO_MIN: 1,
  PLAZO_MAX: 3650,
} as const

// Constantes útiles
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const
export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  input: 'YYYY-MM-DD',
  full: 'DD/MM/YYYY HH:mm:ss',
} as const