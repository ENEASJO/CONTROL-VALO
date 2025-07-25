import { Router } from 'express'
import { validateBody, validateParams, validateQuery, commonSchemas } from '../middleware/validation'
import * as ejecucionController from '../controllers/ejecucionController'

const router = Router()

// GET /api/ejecucion/obras - Listar obras de ejecución
router.get('/obras',
  validateQuery(commonSchemas.pagination),
  ejecucionController.getObras
)

// GET /api/ejecucion/obras/:id - Obtener obra de ejecución por ID
router.get('/obras/:id',
  validateParams(commonSchemas.id),
  ejecucionController.getObraById
)

// POST /api/ejecucion/obras - Crear nueva obra de ejecución
router.post('/obras',
  validateBody(commonSchemas.obra),
  ejecucionController.createObra
)

// PUT /api/ejecucion/obras/:id - Actualizar obra de ejecución
router.put('/obras/:id',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.obra.fork(['numeroContrato'], (schema) => schema.optional())),
  ejecucionController.updateObra
)

// DELETE /api/ejecucion/obras/:id - Eliminar obra de ejecución
router.delete('/obras/:id',
  validateParams(commonSchemas.id),
  ejecucionController.deleteObra
)

// Rutas para profesionales
// GET /api/ejecucion/obras/:id/profesionales - Listar profesionales de una obra
router.get('/obras/:id/profesionales',
  validateParams(commonSchemas.id),
  ejecucionController.getProfesionales
)

// POST /api/ejecucion/obras/:id/profesionales - Agregar profesional a obra
router.post('/obras/:id/profesionales',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.obra.extract('profesionales').items().single()),
  ejecucionController.addProfesional
)

// PUT /api/ejecucion/profesionales/:id - Actualizar profesional
router.put('/profesionales/:id',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.obra.extract('profesionales').items().single()),
  ejecucionController.updateProfesional
)

// DELETE /api/ejecucion/profesionales/:id - Eliminar profesional
router.delete('/profesionales/:id',
  validateParams(commonSchemas.id),
  ejecucionController.deleteProfesional
)

export default router