import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'
import { requestLogger } from './middleware/requestLogger'
import empresasRoutes from './routes/empresas'
import ejecucionRoutes from './routes/ejecucion'
import supervisionRoutes from './routes/supervision'

// Inicializar Prisma (singleton para serverless)
let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

export { prisma }

const app = express()
const PORT = process.env.PORT || 3000

// Middleware básico
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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
    version: '1.0.0'
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
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
  console.log(`📊 API disponible en http://localhost:${PORT}/api`)
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
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