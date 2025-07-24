import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ejecucionService, 
  type ObrasEjecucionFilters, 
  type CreateObraEjecucionData, 
  type UpdateObraEjecucionData,
  type ProfesionalEjecucion
} from '../services/ejecucion'
import { useNotification } from './useNotification'

// Keys para React Query
export const ejecucionKeys = {
  all: ['ejecucion'] as const,
  obras: () => [...ejecucionKeys.all, 'obras'] as const,
  obrasList: (filters: ObrasEjecucionFilters) => [...ejecucionKeys.obras(), 'list', { filters }] as const,
  obraDetail: (id: number) => [...ejecucionKeys.obras(), 'detail', id] as const,
  profesionales: (obraId: number) => [...ejecucionKeys.obras(), obraId, 'profesionales'] as const,
  estadisticas: () => [...ejecucionKeys.all, 'estadisticas'] as const,
}

// Hook para obtener lista de obras de ejecución
export const useObrasEjecucion = (filters: ObrasEjecucionFilters = {}) => {
  return useQuery({
    queryKey: ejecucionKeys.obrasList(filters),
    queryFn: () => ejecucionService.getObras(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener obra de ejecución por ID
export const useObraEjecucion = (id: number) => {
  return useQuery({
    queryKey: ejecucionKeys.obraDetail(id),
    queryFn: () => ejecucionService.getObraById(id),
    enabled: !!id,
  })
}

// Hook para crear obra de ejecución
export const useCreateObraEjecucion = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (data: CreateObraEjecucionData) => ejecucionService.createObra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.estadisticas() })
      showNotification('Obra de ejecución creada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al crear obra de ejecución', 'error')
    },
  })
}

// Hook para actualizar obra de ejecución
export const useUpdateObraEjecucion = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateObraEjecucionData }) => 
      ejecucionService.updateObra(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obraDetail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.estadisticas() })
      showNotification('Obra de ejecución actualizada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al actualizar obra de ejecución', 'error')
    },
  })
}

// Hook para eliminar obra de ejecución
export const useDeleteObraEjecucion = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (id: number) => ejecucionService.deleteObra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.estadisticas() })
      showNotification('Obra de ejecución eliminada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al eliminar obra de ejecución', 'error')
    },
  })
}

// Hook para profesionales de ejecución
export const useProfesionalesEjecucion = (obraId: number) => {
  return useQuery({
    queryKey: ejecucionKeys.profesionales(obraId),
    queryFn: () => ejecucionService.profesionales.getByObra(obraId),
    enabled: !!obraId,
  })
}

// Hook para crear profesional de ejecución
export const useCreateProfesionalEjecucion = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: ({ obraId, data }: { obraId: number; data: Omit<ProfesionalEjecucion, 'id' | 'obraId' | 'createdAt' | 'updatedAt'> }) => 
      ejecucionService.profesionales.create(obraId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.profesionales(variables.obraId) })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obraDetail(variables.obraId) })
      showNotification('Profesional agregado exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al agregar profesional', 'error')
    },
  })
}

// Hook para obtener estadísticas de ejecución
export const useEstadisticasEjecucion = () => {
  return useQuery({
    queryKey: ejecucionKeys.estadisticas(),
    queryFn: () => ejecucionService.getEstadisticas(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}