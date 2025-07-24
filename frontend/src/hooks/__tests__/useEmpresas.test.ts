import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { useEmpresas, useEmpresa, useCreateEmpresa } from '../useEmpresas'
import { useNotification } from '../useNotification'

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useEmpresas', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('useEmpresas', () => {
    it('debe cargar lista de empresas', async () => {
      const { result } = renderHook(() => useEmpresas(), { wrapper })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.success).toBe(true)
      expect(result.current.data?.data).toBeInstanceOf(Array)
    })

    it('debe cargar empresas con filtros', async () => {
      const filters = { search: 'ABC' }
      const { result } = renderHook(() => useEmpresas(filters), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data).toBeInstanceOf(Array)
    })
  })

  describe('useEmpresa', () => {
    it('debe cargar empresa por ID', async () => {
      const empresaId = 1
      const { result } = renderHook(() => useEmpresa(empresaId), { wrapper })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data).toHaveProperty('id', empresaId)
    })

    it('no debe hacer request si ID es 0', () => {
      const { result } = renderHook(() => useEmpresa(0), { wrapper })

      expect(result.current.isFetching).toBe(false)
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('useCreateEmpresa', () => {
    it('debe crear empresa exitosamente', async () => {
      const { result } = renderHook(() => useCreateEmpresa(), { wrapper })

      const nuevaEmpresa = {
        nombre: 'Test Empresa',
        ruc: '20123456789',
        esConsorcio: false,
      }

      expect(result.current.isPending).toBe(false)

      act(() => {
        result.current.mutate(nuevaEmpresa)
      })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data).toMatchObject(nuevaEmpresa)
    })
  })
})

describe('useNotification', () => {
  it('debe mostrar y remover notificaciones', () => {
    const { result } = renderHook(() => useNotification())

    expect(result.current.notifications).toHaveLength(0)

    // Mostrar notificación
    let notificationId: string
    act(() => {
      notificationId = result.current.showNotification('Test message', 'success')
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0]).toMatchObject({
      id: notificationId!,
      message: 'Test message',
      type: 'success',
    })

    // Remover notificación
    act(() => {
      result.current.removeNotification(notificationId!)
    })

    expect(result.current.notifications).toHaveLength(0)
  })

  it('debe limpiar todas las notificaciones', () => {
    const { result } = renderHook(() => useNotification())

    // Agregar múltiples notificaciones
    act(() => {
      result.current.showNotification('Message 1', 'info')
      result.current.showNotification('Message 2', 'warning')
    })

    expect(result.current.notifications).toHaveLength(2)

    // Limpiar todas
    act(() => {
      result.current.clearAllNotifications()
    })

    expect(result.current.notifications).toHaveLength(0)
  })
})