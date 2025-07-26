import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { obrasService, type ObraBase, type CreateObraBaseDto, type UpdateObraBaseDto, type ObraBaseFilters } from '../services/obras'
import { useNotification } from './useNotification'

export const useObras = (filters?: ObraBaseFilters) => {
  const { showNotification } = useNotification()
  
  return useQuery({
    queryKey: ['obras', filters],
    queryFn: () => obrasService.getObras(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  })
}

export const useObra = (id: number) => {
  return useQuery({
    queryKey: ['obra', id],
    queryFn: () => obrasService.getObraById(id),
    enabled: !!id
  })
}

export const useObrasStats = () => {
  return useQuery({
    queryKey: ['obras', 'stats'],
    queryFn: () => obrasService.getObrasStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true
  })
}

export const useObrasDisponibles = () => {
  return useQuery({
    queryKey: ['obras', 'disponibles'],
    queryFn: () => obrasService.getObrasDisponibles(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    select: (data) => data.data?.data || []
  })
}

export const useCreateObra = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  return useMutation({
    mutationFn: (data: CreateObraBaseDto) => obrasService.createObra(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['obras'] })
      showNotification('Obra creada exitosamente', 'success')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al crear la obra'
      showNotification(message, 'error')
    }
  })
}

export const useUpdateObra = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateObraBaseDto }) => 
      obrasService.updateObra(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['obras'] })
      queryClient.invalidateQueries({ queryKey: ['obra', variables.id] })
      showNotification('Obra actualizada exitosamente', 'success')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar la obra'
      showNotification(message, 'error')
    }
  })
}

export const useDeleteObra = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  return useMutation({
    mutationFn: (id: number) => obrasService.deleteObra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] })
      showNotification('Obra eliminada exitosamente', 'success')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al eliminar la obra'
      showNotification(message, 'error')
    }
  })
}

// Hook personalizado para manejo avanzado de obras con estado local
export const useObrasManager = () => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ObraBaseFilters>({
    page: 1,
    limit: 10,
    sortBy: 'nombre',
    sortOrder: 'asc'
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  
  // Aplicar filtros con debounce para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
        page: 1 // Reset página cuando se busca
      }))
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const obrasQuery = useObras(filters)
  const createMutation = useCreateObra()
  const updateMutation = useUpdateObra()
  const deleteMutation = useDeleteObra()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleSortChange = (sortBy: 'nombre' | 'createdAt', sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }

  const handleCreate = async (data: CreateObraBaseDto) => {
    try {
      await createMutation.mutateAsync(data)
      return true
    } catch (error) {
      return false
    }
  }

  const handleUpdate = async (id: number, data: UpdateObraBaseDto) => {
    try {
      await updateMutation.mutateAsync({ id, data })
      return true
    } catch (error) {
      return false
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      return true
    } catch (error) {
      return false
    }
  }

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['obras'] })
  }

  return {
    // Data
    obras: obrasQuery.data?.data?.data || [],
    pagination: obrasQuery.data?.data?.pagination,
    
    // Estado
    isLoading: obrasQuery.isLoading,
    isError: obrasQuery.isError,
    error: obrasQuery.error,
    
    // Estados de mutación
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Filtros actuales
    currentFilters: filters,
    searchTerm,
    
    // Acciones
    handleSearch,
    handlePageChange,
    handleSortChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    refreshData
  }
}