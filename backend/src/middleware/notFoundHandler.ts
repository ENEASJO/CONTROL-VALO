import { Request, Response } from 'express'
import { ApiResponse } from '../types'

export const notFoundHandler = (req: Request, res: Response<ApiResponse<null>>) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Ruta ${req.method} ${req.path} no encontrada`
    }
  })
}