import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { requestLogger } from './middleware/requestLogger'
import empresasRoutes from './routes/empresas'
import ejecucionRoutes from './routes/ejecucion'
import supervisionRoutes from './routes/supervision'

// Validar variables de entorno al inicio
console.log('🔧 Validando configuración del servidor...')
console.log(`📦 Entorno: ${env.NODE_ENV}`)
console.log(`🔌 Puerto: ${env.PORT}`)
console.log(`🌐 CORS Origin: ${env.CORS_ORIGIN}`)
console.log(`🗄️  Base de datos: ${env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'}`)

// Inicializar Prisma (singleton para serverless)
let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

export { prisma }

const app = express()
const PORT = env.PORT

// Middleware básico
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Middleware personalizado
app.use(requestLogger)

// Rutas de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de Control de Valorizaciones funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
    database: 'Connected'
  })
})

// Rutas principales
app.use('/api/empresas', empresasRoutes)
app.use('/api/ejecucion', ejecucionRoutes)
app.use('/api/supervision', supervisionRoutes)

// Middleware de manejo de errores
app.use(notFoundHandler)
app.use(errorHandler)

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ¡Servidor iniciado correctamente!')
  console.log(`📊 API disponible en http://localhost:${PORT}/api`)
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
  console.log('📝 Variables de entorno validadas correctamente')
})

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 Cerrando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})