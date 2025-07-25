interface AppConfig {
  apiUrl: string
  appName: string
  appVersion: string
  isDevelopment: boolean
  isProduction: boolean
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue
  if (!value) {
    throw new Error(`❌ Variable de entorno requerida no encontrada: ${key}`)
  }
  return value
}

export const config: AppConfig = {
  apiUrl: import.meta.env.PROD 
    ? '/api'  // En producción usar la misma URL
    : getEnvVar('VITE_API_URL', 'http://localhost:3000/api'), // En desarrollo
  appName: getEnvVar('VITE_APP_NAME', 'Control de Valorizaciones'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

// Validar configuración al cargar
console.log('🔧 Configuración del Frontend:')
console.log(`📱 Nombre: ${config.appName} v${config.appVersion}`)
console.log(`🌐 API URL: ${config.apiUrl}`)
console.log(`📦 Entorno: ${config.isDevelopment ? 'Desarrollo' : 'Producción'}`)
console.log(`🔄 Build: ${new Date().toISOString()} - FIXED`)

export default config