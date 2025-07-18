import axios from 'axios'
import { ApiResponse, PaginatedResponse } from '../types'

// Configurar axios
const api = axios.create({
  baseURL: '/api', // API en la misma URL que el frontend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message)
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Manejar error de autenticación
      console.log('🔐 Error de autenticación')
    } else if (error.response?.status === 403) {
      // Manejar error de autorización
      console.log('🚫 Error de autorización')
    } else if (error.response?.status >= 500) {
      // Manejar errores del servidor
      console.log('🔥 Error del servidor')
    }
    
    return Promise.reject(error)
  }
)

// Funciones de utilidad para las respuestas
export const handleApiResponse = <T>(response: any): ApiResponse<T> => {
  return response.data
}

export const handleApiError = (error: any): ApiResponse<null> => {
  if (error.response?.data) {
    return error.response.data
  }
  
  return {
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message: 'Error de conexión con el servidor'
    }
  }
}

export default api