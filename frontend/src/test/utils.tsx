import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { ReactElement, ReactNode } from 'react'

// Tema simplificado para tests
const testTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#388e3c' },
  },
})

// Crear un QueryClient específico para tests
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

// Wrapper personalizado para tests
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  initialEntries?: string[]
}

const AllTheProviders = ({ 
  children, 
  queryClient, 
  initialEntries = ['/'] 
}: { 
  children: ReactNode
  queryClient?: QueryClient
  initialEntries?: string[]
}) => {
  const testQueryClient = queryClient || createTestQueryClient()
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider theme={testTheme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Función de render personalizada
export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, initialEntries, ...renderOptions } = options

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders 
      queryClient={queryClient} 
      initialEntries={initialEntries}
    >
      {children}
    </AllTheProviders>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: queryClient || createTestQueryClient(),
  }
}

// Helper para crear datos de prueba
export const createMockEmpresa = (overrides = {}) => ({
  id: 1,
  nombre: 'Empresa Test S.A.',
  ruc: '20123456789',
  telefono: '01-234-5678',
  esConsorcio: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})

export const createMockObraEjecucion = (overrides = {}) => ({
  id: 1,
  nombreObra: 'Obra Test',
  numeroContrato: 'CON-TEST-001',
  numeroExpediente: 'EXP-TEST-001',
  periodoValorizado: '2024-01',
  fechaInicio: '2024-01-15T00:00:00.000Z',
  plazoEjecucion: 180,
  empresaEjecutoraId: 1,
  empresaSupervisoraId: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  empresaEjecutora: createMockEmpresa(),
  empresaSupervisora: createMockEmpresa({ id: 2, nombre: 'Supervisora Test S.A.' }),
  profesionales: [],
  ...overrides,
})

// Helper para esperar por queries de React Query
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

// Re-exportar todo de testing-library
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'