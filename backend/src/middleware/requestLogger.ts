import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Log de la request
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`)
  
  // Interceptar la respuesta para loggear el tiempo
  const originalSend = res.send
  res.send = function(body) {
    const duration = Date.now() - start
    console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
    return originalSend.call(this, body)
  }
  
  next()
}