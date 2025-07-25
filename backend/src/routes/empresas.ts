import { Router } from 'express'
import { validateBody, validateParams, validateQuery, commonSchemas } from '../middleware/validation'
import * as empresasController from '../controllers/empresasController'

const router = Router()

// GET /api/empresas - Listar empresas con paginación y filtros
router.get('/', 
  validateQuery(commonSchemas.pagination),
  empresasController.getEmpresas
)

// GET /api/empresas/:id - Obtener empresa por ID
router.get('/:id',
  validateParams(commonSchemas.id),
  empresasController.getEmpresaById
)

// POST /api/empresas - Crear nueva empresa
router.post('/',
  validateBody(commonSchemas.empresa),
  empresasController.createEmpresa
)

// PUT /api/empresas/:id - Actualizar empresa
router.put('/:id',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.empresa.fork(['ruc'], (schema) => schema.optional())),
  empresasController.updateEmpresa
)

// DELETE /api/empresas/:id - Eliminar empresa
router.delete('/:id',
  validateParams(commonSchemas.id),
  empresasController.deleteEmpresa
)

export default router