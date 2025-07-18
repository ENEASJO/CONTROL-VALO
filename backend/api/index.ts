import { VercelRequest, VercelResponse } from '@vercel/node'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { errorHandler } from '../src/middleware/errorHandler'
import { notFoundHandler } from '../src/middleware/notFoundHandler'
import { requestLogger } from '../src/middleware/requestLogger'
import empresasRoutes from '../src/routes/empresas'
import ejecucionRoutes from '../src/routes/ejecucion'
import supervisionRoutes from '../src/routes/supervision'

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

// Middleware básico
app.use(cors({
  origin: true, // Permitir todos los orígenes en Vercel
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
    platform: 'Vercel Serverless'
  })
})

// Rutas principales
app.use('/api/empresas', empresasRoutes)
app.use('/api/ejecucion', ejecucionRoutes)
app.use('/api/supervision', supervisionRoutes)

// Middleware de manejo de errores
app.use(notFoundHandler)
app.use(errorHandler)

// Export para Vercel
export default app