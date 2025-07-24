import { apiRequest, ApiResponse } from './api'
import { Empresa } from './empresas'

// Tipos específicos para Obras de Ejecución
export interface ObraEjecucion {
  id: number
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  createdAt: string
  updatedAt: string
  empresaEjecutora: Empresa
  empresaSupervisora: Empresa
  profesionales: ProfesionalEjecucion[]
}

export interface ProfesionalEjecucion {
  id: number
  obraId: number
  nombreCompleto: string
  cargo: string
  porcentajeParticipacion: number
  createdAt: string
  updatedAt: string
}

export interface CreateObraEjecucionData {
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  profesionales?: Omit<ProfesionalEjecucion, 'id' | 'obraId' | 'createdAt' | 'updatedAt'>[]
}

export interface UpdateObraEjecucionData extends Partial<CreateObraEjecucionData> {}

export interface ObrasEjecucionFilters {
  search?: string
  empresaEjecutoraId?: number
  empresaSupervisoraId?: number
  periodoValorizado?: string
  page?: number
  limit?: number
}

// Servicio de Obras de Ejecución
export const ejecucionService = {
  // Obtener lista de obras de ejecución con filtros y paginación
  getObras: (filters: ObrasEjecucionFilters = {}): Promise<ApiResponse<ObraEjecucion[]>> => {
    return apiRequest.get('/ejecucion/obras', filters)
  },

  // Obtener obra de ejecución por ID
  getObraById: (id: number): Promise<ApiResponse<ObraEjecucion>> => {
    return apiRequest.get(`/ejecucion/obras/${id}`)
  },

  // Crear nueva obra de ejecución
  createObra: (data: CreateObraEjecucionData): Promise<ApiResponse<ObraEjecucion>> => {
    return apiRequest.post('/ejecucion/obras', data)
  },

  // Actualizar obra de ejecución existente
  updateObra: (id: number, data: UpdateObraEjecucionData): Promise<ApiResponse<ObraEjecucion>> => {
    return apiRequest.put(`/ejecucion/obras/${id}`, data)
  },

  // Eliminar obra de ejecución
  deleteObra: (id: number): Promise<ApiResponse<void>> => {
    return apiRequest.delete(`/ejecucion/obras/${id}`)
  },

  // Gestión de profesionales
  profesionales: {
    // Obtener profesionales de una obra
    getByObra: (obraId: number): Promise<ApiResponse<ProfesionalEjecucion[]>> => {
      return apiRequest.get(`/ejecucion/obras/${obraId}/profesionales`)
    },

    // Agregar profesional a obra
    create: (obraId: number, data: Omit<ProfesionalEjecucion, 'id' | 'obraId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProfesionalEjecucion>> => {
      return apiRequest.post(`/ejecucion/obras/${obraId}/profesionales`, data)
    },

    // Actualizar profesional
    update: (obraId: number, profesionalId: number, data: Partial<ProfesionalEjecucion>): Promise<ApiResponse<ProfesionalEjecucion>> => {
      return apiRequest.put(`/ejecucion/obras/${obraId}/profesionales/${profesionalId}`, data)
    },

    // Eliminar profesional
    delete: (obraId: number, profesionalId: number): Promise<ApiResponse<void>> => {
      return apiRequest.delete(`/ejecucion/obras/${obraId}/profesionales/${profesionalId}`)
    },
  },

  // Estadísticas y reportes
  getEstadisticas: (): Promise<ApiResponse<any>> => {
    return apiRequest.get('/ejecucion/estadisticas')
  },
}

export default ejecucionService