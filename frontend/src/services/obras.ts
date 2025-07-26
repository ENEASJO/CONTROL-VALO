import { apiRequest } from './api'

export interface ObraBase {
  id: number
  nombre: string
  created_at: string
  updated_at: string
  obras_ejecucion?: any[]
  obras_supervision?: any[]
}

export interface CreateObraBaseDto {
  nombre: string
}

export interface UpdateObraBaseDto {
  nombre?: string
}

export interface ObraBaseFilters {
  search?: string
  page?: number
  limit?: number
  sortBy?: 'nombre' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface ObrasStats {
  total_obras: number
  obras_con_ejecucion: number
  obras_con_supervision: number
  obras_completas: number
  obras_solo_ejecucion: number
  obras_solo_supervision: number
  obras_sin_asignar: number
}

class ObrasService {
  private readonly baseUrl = '/api/obras'

  async getObras(filters?: ObraBaseFilters) {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    const queryString = params.toString()
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl
    
    return apiRequest.get<{
      data: ObraBase[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(url)
  }

  async getObraById(id: number) {
    return apiRequest.get<ObraBase>(`${this.baseUrl}?id=${id}`)
  }

  async createObra(data: CreateObraBaseDto) {
    return apiRequest.post<ObraBase>(this.baseUrl, data)
  }

  async updateObra(id: number, data: UpdateObraBaseDto) {
    return apiRequest.put<ObraBase>(`${this.baseUrl}?id=${id}`, data)
  }

  async deleteObra(id: number) {
    return apiRequest.delete(`${this.baseUrl}?id=${id}`)
  }

  async getObrasStats() {
    return apiRequest.get<ObrasStats>(`${this.baseUrl}?stats=true`)
  }

  // Método para obtener obras disponibles para asociar a ejecución/supervisión
  async getObrasDisponibles() {
    return apiRequest.get<{data: ObraBase[]}>(`${this.baseUrl}?limit=1000&sortBy=nombre&sortOrder=asc`)
  }
}

export const obrasService = new ObrasService()
export default obrasService