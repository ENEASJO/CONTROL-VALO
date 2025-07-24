import { http, HttpResponse } from 'msw'
import { config } from '../../config/env'
import type { Empresa } from '../../services/empresas'
import type { ObraEjecucion } from '../../services/ejecucion'
import type { ObraSupervision } from '../../services/supervision'

// Datos mock para empresas
const mockEmpresas: Empresa[] = [
  {
    id: 1,
    nombre: 'Constructora ABC S.A.',
    ruc: '20123456789',
    telefono: '01-234-5678',
    esConsorcio: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    nombre: 'Consorcio XYZ',
    ruc: '20987654321',
    telefono: '01-987-6543',
    esConsorcio: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    integrantesConsorcio: [
      {
        id: 1,
        empresaId: 2,
        nombre: 'Empresa Integrante 1',
        ruc: '20111111111',
        porcentajeParticipacion: 60,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    ],
  },
]

// Datos mock para obras de ejecución
const mockObrasEjecucion: ObraEjecucion[] = [
  {
    id: 1,
    nombreObra: 'Construcción de Puente Los Andes',
    numeroContrato: 'CON-2024-001',
    numeroExpediente: 'EXP-2024-001',
    periodoValorizado: '2024-01',
    fechaInicio: '2024-01-15T00:00:00.000Z',
    plazoEjecucion: 180,
    empresaEjecutoraId: 1,
    empresaSupervisoraId: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    empresaEjecutora: mockEmpresas[0],
    empresaSupervisora: mockEmpresas[1],
    profesionales: [],
  },
]

// Handlers para las rutas de la API
export const handlers = [
  // Empresas endpoints
  http.get(`${config.apiUrl}/empresas`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    
    let filteredEmpresas = mockEmpresas
    if (search) {
      filteredEmpresas = mockEmpresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(search.toLowerCase()) ||
        empresa.ruc.includes(search)
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: filteredEmpresas,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredEmpresas.length,
        totalPages: 1,
      },
    })
  }),

  http.get(`${config.apiUrl}/empresas/:id`, ({ params }) => {
    const id = parseInt(params.id as string)
    const empresa = mockEmpresas.find(e => e.id === id)
    
    if (!empresa) {
      return HttpResponse.json(
        { success: false, message: 'Empresa no encontrada' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: empresa,
    })
  }),

  http.post(`${config.apiUrl}/empresas`, async ({ request }) => {
    const data = await request.json() as Partial<Empresa>
    const newEmpresa: Empresa = {
      id: Math.max(...mockEmpresas.map(e => e.id)) + 1,
      nombre: data.nombre || '',
      ruc: data.ruc || '',
      telefono: data.telefono,
      esConsorcio: data.esConsorcio || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockEmpresas.push(newEmpresa)
    
    return HttpResponse.json({
      success: true,
      data: newEmpresa,
      message: 'Empresa creada exitosamente',
    })
  }),

  // Obras de ejecución endpoints
  http.get(`${config.apiUrl}/ejecucion/obras`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    
    let filteredObras = mockObrasEjecucion
    if (search) {
      filteredObras = mockObrasEjecucion.filter(obra =>
        obra.nombreObra.toLowerCase().includes(search.toLowerCase()) ||
        obra.numeroContrato.includes(search)
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: filteredObras,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredObras.length,
        totalPages: 1,
      },
    })
  }),

  http.get(`${config.apiUrl}/ejecucion/obras/:id`, ({ params }) => {
    const id = parseInt(params.id as string)
    const obra = mockObrasEjecucion.find(o => o.id === id)
    
    if (!obra) {
      return HttpResponse.json(
        { success: false, message: 'Obra no encontrada' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: obra,
    })
  }),

  // Health check endpoint
  http.get(`${config.apiUrl}/health`, () => {
    return HttpResponse.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  }),

  // Catch-all para endpoints no implementados
  http.all('*', ({ request }) => {
    console.warn(`Endpoint no mockeado: ${request.method} ${request.url}`)
    return HttpResponse.json(
      { success: false, message: 'Endpoint no encontrado' },
      { status: 404 }
    )
  }),
]