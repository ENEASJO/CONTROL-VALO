import api, { handleApiResponse, handleApiError } from './api'
import { 
  ApiResponse, 
  PaginatedResponse, 
  Obra, 
  Profesional,
  FormularioObraData,
  ProfesionalFormData,
  ObraFilters 
} from '../types'

export const ejecucionService = {
  // Obtener todas las obras de ejecución
  getObras: async (filters: ObraFilters = {}): Promise<ApiResponse<PaginatedResponse<Obra>>> => {
    try {
      const response = await api.get('/ejecucion/obras', { params: filters })
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Obtener obra de ejecución por ID
  getObraById: async (id: number): Promise<ApiResponse<Obra>> => {
    try {
      const response = await api.get(`/ejecucion/obras/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Crear nueva obra de ejecución
  createObra: async (data: FormularioObraData): Promise<ApiResponse<Obra>> => {
    try {
      const response = await api.post('/ejecucion/obras', data)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Actualizar obra de ejecución
  updateObra: async (id: number, data: Partial<FormularioObraData>): Promise<ApiResponse<Obra>> => {
    try {
      const response = await api.put(`/ejecucion/obras/${id}`, data)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Eliminar obra de ejecución
  deleteObra: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete(`/ejecucion/obras/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Obtener profesionales de una obra
  getProfesionales: async (obraId: number): Promise<ApiResponse<Profesional[]>> => {
    try {
      const response = await api.get(`/ejecucion/obras/${obraId}/profesionales`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Agregar profesional a obra
  addProfesional: async (obraId: number, data: ProfesionalFormData): Promise<ApiResponse<Profesional>> => {
    try {
      const response = await api.post(`/ejecucion/obras/${obraId}/profesionales`, data)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Actualizar profesional
  updateProfesional: async (profesionalId: number, data: Partial<ProfesionalFormData>): Promise<ApiResponse<Profesional>> => {
    try {
      const response = await api.put(`/ejecucion/profesionales/${profesionalId}`, data)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Eliminar profesional
  deleteProfesional: async (profesionalId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete(`/ejecucion/profesionales/${profesionalId}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}