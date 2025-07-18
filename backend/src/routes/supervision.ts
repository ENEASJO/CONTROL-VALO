import { Router } from 'express'
import { validateBody, validateParams, validateQuery, commonSchemas } from '../middleware/validation'
import * as supervisionController from '../controllers/supervisionController'

const router = Router()

// GET /api/supervision/obras - Listar obras de supervisión
router.get('/obras',
  validateQuery(commonSchemas.pagination),
  supervisionController.getObras
)

// GET /api/supervision/obras/:id - Obtener obra de supervisión por ID
router.get('/obras/:id',
  validateParams(commonSchemas.id),
  supervisionController.getObraById
)

// POST /api/supervision/obras - Crear nueva obra de supervisión
router.post('/obras',
  validateBody(commonSchemas.obra),
  supervisionController.createObra
)

// PUT /api/supervision/obras/:id - Actualizar obra de supervisión
router.put('/obras/:id',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.obra.fork(['numeroContrato'], (schema) => schema.optional())),
  supervisionController.updateObra
)

// DELETE /api/supervision/obras/:id - Eliminar obra de supervisión
router.delete('/obras/:id',
  validateParams(commonSchemas.id),
  supervisionController.deleteObra
)

// Rutas para profesionales
// GET /api/supervision/obras/:id/profesionales - Listar profesionales de una obra
router.get('/obras/:id/profesionales',
  validateParams(commonSchemas.id),
  supervisionController.getProfesionales
)

// POST /api/supervision/obras/:id/profesionales - Agregar profesional a obra
router.post('/obras/:id/profesionales',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.obra.extract('profesionales').items().single()),
  supervisionController.addProfesional
)

// PUT /api/supervision/profesionales/:id - Actualizar profesional
router.put('/profesionales/:id',
  validateParams(commonSchemas.id),
  validateBody(commonSchemas.obra.extract('profesionales').items().single()),
  supervisionController.updateProfesional
)

// DELETE /api/supervision/profesionales/:id - Eliminar profesional
router.delete('/profesionales/:id',
  validateParams(commonSchemas.id),
  supervisionController.deleteProfesional
)

export default router