import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { config } from '../config/env'

// Crear instancia de axios configurada
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    if (config.isDevelopment) {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (config.isDevelopment) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Error desconocido'
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message,
    })
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Manejar error de autenticación si se implementa
      console.warn('🔐 Error de autenticación')
    }
    
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    })
  }
)

// Tipos para respuestas API
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  status?: number
  message: string
  data?: any
}

// Funciones helper para requests
export const apiRequest = {
  get: <T>(url: string, params?: object): Promise<ApiResponse<T>> =>
    apiClient.get(url, { params }).then(response => response.data),
    
  post: <T>(url: string, data?: object): Promise<ApiResponse<T>> =>
    apiClient.post(url, data).then(response => response.data),
    
  put: <T>(url: string, data?: object): Promise<ApiResponse<T>> =>
    apiClient.put(url, data).then(response => response.data),
    
  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    apiClient.delete(url).then(response => response.data),
}

// Funciones helper para manejar respuestas y errores (compatibility con servicios antiguos)
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  return response.data
}

export const handleApiError = (error: any): never => {
  const apiError: ApiError = {
    status: error.response?.status,
    message: error.response?.data?.message || error.message || 'Error desconocido',
    data: error.response?.data,
  }
  throw apiError
}

export default apiClient