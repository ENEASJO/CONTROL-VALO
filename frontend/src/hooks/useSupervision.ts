import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  supervisionService, 
  type ObrasSupervisionFilters, 
  type CreateObraSupervisionData, 
  type UpdateObraSupervisionData,
  type ProfesionalSupervision
} from '../services/supervision'
import { useNotification } from './useNotification'

// Keys para React Query
export const supervisionKeys = {
  all: ['supervision'] as const,
  obras: () => [...supervisionKeys.all, 'obras'] as const,
  obrasList: (filters: ObrasSupervisionFilters) => [...supervisionKeys.obras(), 'list', { filters }] as const,
  obraDetail: (id: number) => [...supervisionKeys.obras(), 'detail', id] as const,
  profesionales: (obraId: number) => [...supervisionKeys.obras(), obraId, 'profesionales'] as const,
  estadisticas: () => [...supervisionKeys.all, 'estadisticas'] as const,
}

// Hook para obtener lista de obras de supervisión
export const useObrasSupervision = (filters: ObrasSupervisionFilters = {}) => {
  return useQuery({
    queryKey: supervisionKeys.obrasList(filters),
    queryFn: () => supervisionService.getObras(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener obra de supervisión por ID
export const useObraSupervision = (id: number) => {
  return useQuery({
    queryKey: supervisionKeys.obraDetail(id),
    queryFn: () => supervisionService.getObraById(id),
    enabled: !!id,
  })
}

// Hook para crear obra de supervisión
export const useCreateObraSupervision = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (data: CreateObraSupervisionData) => supervisionService.createObra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.estadisticas() })
      showNotification('Obra de supervisión creada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al crear obra de supervisión', 'error')
    },
  })
}

// Hook para actualizar obra de supervisión
export const useUpdateObraSupervision = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateObraSupervisionData }) => 
      supervisionService.updateObra(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obraDetail(variables.id) })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.estadisticas() })
      showNotification('Obra de supervisión actualizada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al actualizar obra de supervisión', 'error')
    },
  })
}

// Hook para eliminar obra de supervisión
export const useDeleteObraSupervision = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (id: number) => supervisionService.deleteObra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.estadisticas() })
      showNotification('Obra de supervisión eliminada exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al eliminar obra de supervisión', 'error')
    },
  })
}

// Hook para profesionales de supervisión
export const useProfesionalesSupervision = (obraId: number) => {
  return useQuery({
    queryKey: supervisionKeys.profesionales(obraId),
    queryFn: () => supervisionService.profesionales.getByObra(obraId),
    enabled: !!obraId,
  })
}

// Hook para crear profesional de supervisión
export const useCreateProfesionalSupervision = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: ({ obraId, data }: { obraId: number; data: Omit<ProfesionalSupervision, 'id' | 'obraId' | 'createdAt' | 'updatedAt'> }) => 
      supervisionService.profesionales.create(obraId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: supervisionKeys.profesionales(variables.obraId) })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obraDetail(variables.obraId) })
      showNotification('Profesional agregado exitosamente', 'success')
    },
    onError: (error: any) => {
      showNotification(error.message || 'Error al agregar profesional', 'error')
    },
  })
}

// Hook para obtener estadísticas de supervisión
export const useEstadisticasSupervision = () => {
  return useQuery({
    queryKey: supervisionKeys.estadisticas(),
    queryFn: () => supervisionService.getEstadisticas(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Aliases para compatibilidad con código existente
export const useSupervisionObras = useObrasSupervision
export const useSupervisionObra = useObraSupervision
export const useDeleteSupervisionObra = useDeleteObraSupervision