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

// Constantes útiles
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const
export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  input: 'YYYY-MM-DD',
  full: 'DD/MM/YYYY HH:mm:ss',
} as const