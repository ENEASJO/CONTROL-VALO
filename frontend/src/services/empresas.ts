import { apiRequest, ApiResponse } from './api'

// Tipos específicos para Empresas
export interface Empresa {
  id: number
  nombre: string
  ruc: string
  telefono?: string
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

export interface CreateEmpresaData {
  nombre: string
  ruc: string
  telefono?: string
  esConsorcio: boolean
  integrantesConsorcio?: Omit<IntegranteConsorcio, 'id' | 'empresaId' | 'createdAt' | 'updatedAt'>[]
}

export interface UpdateEmpresaData extends Partial<CreateEmpresaData> {}

export interface EmpresasFilters {
  search?: string
  esConsorcio?: boolean
  page?: number
  limit?: number
}

// Servicio de Empresas
export const empresasService = {
  // Obtener lista de empresas con filtros y paginación
  getEmpresas: (filters: EmpresasFilters = {}): Promise<ApiResponse<Empresa[]>> => {
    return apiRequest.get('/empresas', filters)
  },

  // Obtener empresa por ID
  getEmpresaById: (id: number): Promise<ApiResponse<Empresa>> => {
    return apiRequest.get(`/empresas/${id}`)
  },

  // Crear nueva empresa
  createEmpresa: (data: CreateEmpresaData): Promise<ApiResponse<Empresa>> => {
    return apiRequest.post('/empresas', data)
  },

  // Actualizar empresa existente
  updateEmpresa: (id: number, data: UpdateEmpresaData): Promise<ApiResponse<Empresa>> => {
    return apiRequest.put(`/empresas/${id}`, data)
  },

  // Eliminar empresa
  deleteEmpresa: (id: number): Promise<ApiResponse<void>> => {
    return apiRequest.delete(`/empresas/${id}`)
  },

  // Buscar empresas (helper para autocomplete)
  searchEmpresas: (query: string): Promise<ApiResponse<Empresa[]>> => {
    return apiRequest.get('/empresas', { search: query, limit: 10 })
  },
}

export default empresasService