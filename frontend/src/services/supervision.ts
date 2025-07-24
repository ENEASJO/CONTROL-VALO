import { apiRequest, ApiResponse } from './api'
import { Empresa } from './empresas'

// Tipos específicos para Obras de Supervisión
export interface ObraSupervision {
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
  profesionales: ProfesionalSupervision[]
}

export interface ProfesionalSupervision {
  id: number
  obraId: number
  nombreCompleto: string
  cargo: string
  porcentajeParticipacion: number
  createdAt: string
  updatedAt: string
}

export interface CreateObraSupervisionData {
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutoraId: number
  empresaSupervisoraId: number
  profesionales?: Omit<ProfesionalSupervision, 'id' | 'obraId' | 'createdAt' | 'updatedAt'>[]
}

export interface UpdateObraSupervisionData extends Partial<CreateObraSupervisionData> {}

export interface ObrasSupervisionFilters {
  search?: string
  empresaEjecutoraId?: number
  empresaSupervisoraId?: number
  periodoValorizado?: string
  page?: number
  limit?: number
}

// Servicio de Obras de Supervisión
export const supervisionService = {
  // Obtener lista de obras de supervisión con filtros y paginación
  getObras: (filters: ObrasSupervisionFilters = {}): Promise<ApiResponse<ObraSupervision[]>> => {
    return apiRequest.get('/supervision/obras', filters)
  },

  // Obtener obra de supervisión por ID
  getObraById: (id: number): Promise<ApiResponse<ObraSupervision>> => {
    return apiRequest.get(`/supervision/obras/${id}`)
  },

  // Crear nueva obra de supervisión
  createObra: (data: CreateObraSupervisionData): Promise<ApiResponse<ObraSupervision>> => {
    return apiRequest.post('/supervision/obras', data)
  },

  // Actualizar obra de supervisión existente
  updateObra: (id: number, data: UpdateObraSupervisionData): Promise<ApiResponse<ObraSupervision>> => {
    return apiRequest.put(`/supervision/obras/${id}`, data)
  },

  // Eliminar obra de supervisión
  deleteObra: (id: number): Promise<ApiResponse<void>> => {
    return apiRequest.delete(`/supervision/obras/${id}`)
  },

  // Gestión de profesionales
  profesionales: {
    // Obtener profesionales de una obra
    getByObra: (obraId: number): Promise<ApiResponse<ProfesionalSupervision[]>> => {
      return apiRequest.get(`/supervision/obras/${obraId}/profesionales`)
    },

    // Agregar profesional a obra
    create: (obraId: number, data: Omit<ProfesionalSupervision, 'id' | 'obraId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProfesionalSupervision>> => {
      return apiRequest.post(`/supervision/obras/${obraId}/profesionales`, data)
    },

    // Actualizar profesional
    update: (obraId: number, profesionalId: number, data: Partial<ProfesionalSupervision>): Promise<ApiResponse<ProfesionalSupervision>> => {
      return apiRequest.put(`/supervision/obras/${obraId}/profesionales/${profesionalId}`, data)
    },

    // Eliminar profesional
    delete: (obraId: number, profesionalId: number): Promise<ApiResponse<void>> => {
      return apiRequest.delete(`/supervision/obras/${obraId}/profesionales/${profesionalId}`)
    },
  },

  // Estadísticas y reportes
  getEstadisticas: (): Promise<ApiResponse<any>> => {
    return apiRequest.get('/supervision/estadisticas')
  },
}

export default supervisionService