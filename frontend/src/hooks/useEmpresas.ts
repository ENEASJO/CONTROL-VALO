import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { empresasService } from '../services/empresasService'
import { EmpresaFilters, FormularioEmpresaData } from '../types'

// Query keys
export const empresasKeys = {
  all: ['empresas'] as const,
  lists: () => [...empresasKeys.all, 'list'] as const,
  list: (filters: EmpresaFilters) => [...empresasKeys.lists(), filters] as const,
  details: () => [...empresasKeys.all, 'detail'] as const,
  detail: (id: number) => [...empresasKeys.details(), id] as const,
  forSelect: () => [...empresasKeys.all, 'select'] as const,
}

// Hook para obtener lista de empresas
export const useEmpresas = (filters: EmpresaFilters = {}) => {
  return useQuery({
    queryKey: empresasKeys.list(filters),
    queryFn: () => empresasService.getEmpresas(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener empresa por ID
export const useEmpresa = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: empresasKeys.detail(id),
    queryFn: () => empresasService.getEmpresaById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  })
}

// Hook para obtener empresas para selector
export const useEmpresasForSelect = () => {
  return useQuery({
    queryKey: empresasKeys.forSelect(),
    queryFn: () => empresasService.getEmpresasForSelect(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para crear empresa
export const useCreateEmpresa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormularioEmpresaData) => empresasService.createEmpresa(data),
    onSuccess: () => {
      // Invalidar todas las queries de empresas
      queryClient.invalidateQueries({ queryKey: empresasKeys.all })
    },
  })
}

// Hook para actualizar empresa
export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FormularioEmpresaData> }) =>
      empresasService.updateEmpresa(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: empresasKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: empresasKeys.lists() })
      queryClient.invalidateQueries({ queryKey: empresasKeys.forSelect() })
    },
  })
}

// Hook para eliminar empresa
export const useDeleteEmpresa = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => empresasService.deleteEmpresa(id),
    onSuccess: () => {
      // Invalidar todas las queries de empresas
      queryClient.invalidateQueries({ queryKey: empresasKeys.all })
    },
  })
}