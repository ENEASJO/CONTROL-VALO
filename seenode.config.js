/**
 * Configuración para SeeNode
 */

module.exports = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },
  
  // Configuración de build
  build: {
    command: 'npm run build:seenode',
    outputDir: 'dist'
  },
  
  // Configuración de inicio
  start: {
    command: 'npm start',
    script: 'server.js'
  },
  
  // Variables de entorno requeridas
  env: {
    required: [
      'DATABASE_URL',
      'NODE_ENV'
    ],
    optional: [
      'CORS_ORIGIN',
      'PORT'
    ]
  },
  
  // Configuración de Node.js
  node: {
    version: '18.x'
  },
  
  // Configuración de salud
  health: {
    path: '/health',
    timeout: 30000
  },
  
  // Configuración de logs
  logs: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
}