#!/usr/bin/env node

/**
 * Servidor principal para SeeNode
 * Combina backend API y frontend estático
 */

const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

console.log('🚀 Iniciando servidor SeeNode...')

// Middleware básico
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// Importar y usar las rutas del backend
try {
  // Intentar cargar la aplicación backend compilada
  let backendApp
  try {
    backendApp = require('./backend/dist/index.js')
  } catch (distError) {
    console.log('📝 Dist no disponible, cargando desde src...')
    // Fallback: cargar desde src si dist no existe
    backendApp = require('./backend/src/app.js')
  }
  
  // Montar las rutas de la API
  app.use('/api', backendApp)
  
  console.log('✅ Backend API cargado correctamente')
} catch (error) {
  console.error('❌ Error cargando backend:', error)
  
  // Fallback: cargar rutas básicas
  app.get('/api/health', (req, res) => {
    res.json({
      success: false,
      message: 'Backend no disponible',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  })
  
  app.get('/api/test', (req, res) => {
    res.json({
      success: false,
      message: 'Backend en modo fallback',
      timestamp: new Date().toISOString()
    })
  })
}

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, 'frontend/dist')
console.log(`📁 Sirviendo frontend desde: ${frontendPath}`)

app.use(express.static(frontendPath))

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor SeeNode funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    port: PORT
  })
})

// Servir el frontend para todas las rutas no-API (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html')
  console.log(`📄 Sirviendo SPA: ${req.path} -> ${indexPath}`)
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error sirviendo index.html:', err)
      res.status(500).send('Error interno del servidor')
    }
  })
})

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('❌ Error del servidor:', error)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor'
    }
  })
})

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor SeeNode ejecutándose en puerto ${PORT}`)
  console.log(`📊 API disponible en http://localhost:${PORT}/api`)
  console.log(`🌐 Frontend disponible en http://localhost:${PORT}`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
})

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🔄 Cerrando servidor SeeNode...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🔄 Cerrando servidor SeeNode...')
  process.exit(0)
})