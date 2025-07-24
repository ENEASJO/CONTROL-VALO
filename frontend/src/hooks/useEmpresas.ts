import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { empresasService, type EmpresasFilters, type CreateEmpresaData, type UpdateEmpresaData } from '../services/empresas'
import { useNotification } from './useNotification'

// Keys para React Query
export const empresasKeys = {
  all: ['empresas'] as const,
  lists: () => [...empresasKeys.all, 'list'] as const,
  list: (filters: EmpresasFilters) => [...empresasKeys.lists(), { filters }] as const,
  details: () => [...empresasKeys.all, 'detail'] as const,
  detail: (id: number) => [...empresasKeys.details(), id] as const,
}

// Hook para obtener lista de empresas
export const useEmpresas = (filters: EmpresasFilters = {}) => {
  return useQuery({
    queryKey: empresasKeys.list(filters),
    queryFn: () => empresasService.getEmpresas(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener empresa por ID
export const useEmpresa = (id: number) => {
  return useQuery({
    queryKey: empresasKeys.detail(id),
    queryFn: () => empresasService.getEmpresaById(id),
    enabled: !!id,
  })
}

// Hook para crear empresa
export const useCreateEmpresa = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (data: CreateEmpresaData) => empresasService.createEmpresa(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: empresasKeys.lists() })
      showNotification('Empresa creada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al crear empresa', 'error')
    },
  })
}

// Hook para actualizar empresa
export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmpresaData }) => 
      empresasService.updateEmpresa(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: empresasKeys.lists() })
      queryClient.invalidateQueries({ queryKey: empresasKeys.detail(variables.id) })
      showNotification('Empresa actualizada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al actualizar empresa', 'error')
    },
  })
}

// Hook para eliminar empresa
export const useDeleteEmpresa = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (id: number) => empresasService.deleteEmpresa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: empresasKeys.lists() })
      showNotification('Empresa eliminada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al eliminar empresa', 'error')
    },
  })
}

// Hook para búsqueda de empresas (útil para autocomplete)
export const useSearchEmpresas = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['empresas', 'search', query],
    queryFn: () => empresasService.searchEmpresas(query),
    enabled: enabled && query.length > 2,
    staleTime: 30 * 1000, // 30 segundos
  })
}