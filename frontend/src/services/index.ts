// Exportaciones centralizadas de todos los servicios
export { default as apiClient, apiRequest } from './api'
export type { ApiResponse, ApiError } from './api'

export { default as empresasService } from './empresas'
export type { 
  Empresa, 
  IntegranteConsorcio, 
  CreateEmpresaData, 
  UpdateEmpresaData, 
  EmpresasFilters 
} from './empresas'

export { default as ejecucionService } from './ejecucion'
export type { 
  ObraEjecucion, 
  ProfesionalEjecucion, 
  CreateObraEjecucionData, 
  UpdateObraEjecucionData, 
  ObrasEjecucionFilters 
} from './ejecucion'

export { default as supervisionService } from './supervision'
export type { 
  ObraSupervision, 
  ProfesionalSupervision, 
  CreateObraSupervisionData, 
  UpdateObraSupervisionData, 
  ObrasSupervisionFilters 
} from './supervision'