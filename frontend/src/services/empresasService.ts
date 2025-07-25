import api, { handleApiResponse, handleApiError } from './api'
import { 
  ApiResponse, 
  PaginatedResponse, 
  Empresa, 
  FormularioEmpresaData,
  EmpresaFilters 
} from '../types'

export const empresasService = {
  // Obtener todas las empresas con paginación y filtros
  getEmpresas: async (filters: EmpresaFilters = {}): Promise<ApiResponse<PaginatedResponse<Empresa>>> => {
    try {
      const response = await api.get('/empresas', { params: filters })
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Obtener empresa por ID
  getEmpresaById: async (id: number): Promise<ApiResponse<Empresa>> => {
    try {
      const response = await api.get(`/empresas/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Crear nueva empresa
  createEmpresa: async (data: FormularioEmpresaData): Promise<ApiResponse<Empresa>> => {
    try {
      const response = await api.post('/empresas', data)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Actualizar empresa
  updateEmpresa: async (id: number, data: Partial<FormularioEmpresaData>): Promise<ApiResponse<Empresa>> => {
    try {
      const response = await api.put(`/empresas/${id}`, data)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Eliminar empresa
  deleteEmpresa: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete(`/empresas/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Obtener empresas para selector (sin paginación)
  getEmpresasForSelect: async (): Promise<ApiResponse<Empresa[]>> => {
    try {
      const response = await api.get('/empresas', { 
        params: { limit: 100, sortBy: 'nombre', sortOrder: 'asc' } 
      })
      const result = handleApiResponse<PaginatedResponse<Empresa>>(response)
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data.data,
          message: result.message
        }
      }
      
      return result as unknown as ApiResponse<Empresa[]>
    } catch (error) {
      return handleApiError(error)
    }
  }
}