import { describe, it, expect, beforeEach } from 'vitest'
import { empresasService } from '../empresas'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import { config } from '../../config/env'

describe('empresasService', () => {
  beforeEach(() => {
    // Reset cualquier mock específico entre tests
    server.resetHandlers()
  })

  describe('getEmpresas', () => {
    it('debe obtener lista de empresas exitosamente', async () => {
      const response = await empresasService.getEmpresas()
      
      expect(response.success).toBe(true)
      expect(response.data).toBeInstanceOf(Array)
      expect(response.data.length).toBeGreaterThan(0)
      expect(response.data[0]).toHaveProperty('id')
      expect(response.data[0]).toHaveProperty('nombre')
      expect(response.data[0]).toHaveProperty('ruc')
    })

    it('debe filtrar empresas por búsqueda', async () => {
      const searchTerm = 'ABC'
      const response = await empresasService.getEmpresas({ search: searchTerm })
      
      expect(response.success).toBe(true)
      expect(response.data.every(empresa => 
        empresa.nombre.includes(searchTerm) || empresa.ruc.includes(searchTerm)
      )).toBe(true)
    })

    it('debe manejar errores de red', async () => {
      // Mock temporario para simular error
      server.use(
        http.get(`${config.apiUrl}/empresas`, () => {
          return HttpResponse.error()
        })
      )

      await expect(empresasService.getEmpresas()).rejects.toThrow()
    })
  })

  describe('getEmpresaById', () => {
    it('debe obtener empresa por ID exitosamente', async () => {
      const empresaId = 1
      const response = await empresasService.getEmpresaById(empresaId)
      
      expect(response.success).toBe(true)
      expect(response.data).toHaveProperty('id', empresaId)
      expect(response.data).toHaveProperty('nombre')
      expect(response.data).toHaveProperty('ruc')
    })

    it('debe manejar empresa no encontrada', async () => {
      const empresaId = 999
      
      await expect(empresasService.getEmpresaById(empresaId))
        .rejects.toMatchObject({
          status: 404,
          message: 'Empresa no encontrada'
        })
    })
  })

  describe('createEmpresa', () => {
    it('debe crear empresa exitosamente', async () => {
      const nuevaEmpresa = {
        nombre: 'Nueva Empresa S.A.',
        ruc: '20999999999',
        telefono: '01-999-9999',
        esConsorcio: false,
      }

      const response = await empresasService.createEmpresa(nuevaEmpresa)
      
      expect(response.success).toBe(true)
      expect(response.data).toMatchObject(nuevaEmpresa)
      expect(response.data).toHaveProperty('id')
      expect(response.data).toHaveProperty('createdAt')
      expect(response.data).toHaveProperty('updatedAt')
    })

    it('debe validar datos requeridos', async () => {
      // Mock temporario para simular error de validación
      server.use(
        http.post(`${config.apiUrl}/empresas`, () => {
          return HttpResponse.json(
            { 
              success: false, 
              message: 'Datos inválidos',
              errors: { ruc: ['RUC es requerido'] }
            },
            { status: 400 }
          )
        })
      )

      const empresaInvalida = {
        nombre: 'Empresa Sin RUC',
        ruc: '', // RUC vacío
        esConsorcio: false,
      }

      await expect(empresasService.createEmpresa(empresaInvalida))
        .rejects.toMatchObject({
          status: 400,
          message: 'Datos inválidos'
        })
    })
  })

  describe('searchEmpresas', () => {
    it('debe buscar empresas con query', async () => {
      const query = 'Constructora'
      const response = await empresasService.searchEmpresas(query)
      
      expect(response.success).toBe(true)
      expect(response.data).toBeInstanceOf(Array)
      // Debe limitar a 10 resultados por defecto
      expect(response.data.length).toBeLessThanOrEqual(10)
    })

    it('debe retornar array vacío para búsquedas sin resultados', async () => {
      const query = 'NoExiste'
      const response = await empresasService.searchEmpresas(query)
      
      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(0)
    })
  })
})