import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ejecucionService } from '../services/ejecucionService'
import { ObraFilters, FormularioObraData, ProfesionalFormData } from '../types'

// Query keys
export const ejecucionKeys = {
  all: ['ejecucion'] as const,
  obras: () => [...ejecucionKeys.all, 'obras'] as const,
  obrasList: (filters: ObraFilters) => [...ejecucionKeys.obras(), 'list', filters] as const,
  obraDetail: (id: number) => [...ejecucionKeys.obras(), 'detail', id] as const,
  profesionales: (obraId: number) => [...ejecucionKeys.all, 'profesionales', obraId] as const,
}

// Hook para obtener lista de obras de ejecución
export const useEjecucionObras = (filters: ObraFilters = {}) => {
  return useQuery({
    queryKey: ejecucionKeys.obrasList(filters),
    queryFn: () => ejecucionService.getObras(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener obra de ejecución por ID
export const useEjecucionObra = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ejecucionKeys.obraDetail(id),
    queryFn: () => ejecucionService.getObraById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  })
}

// Hook para obtener profesionales de una obra
export const useEjecucionProfesionales = (obraId: number) => {
  return useQuery({
    queryKey: ejecucionKeys.profesionales(obraId),
    queryFn: () => ejecucionService.getProfesionales(obraId),
    enabled: !!obraId,
  })
}

// Hook para crear obra de ejecución
export const useCreateEjecucionObra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormularioObraData) => ejecucionService.createObra(data),
    onSuccess: () => {
      // Invalidar listas de obras
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obras() })
    },
  })
}

// Hook para actualizar obra de ejecución
export const useUpdateEjecucionObra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FormularioObraData> }) =>
      ejecucionService.updateObra(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obraDetail(id) })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.profesionales(id) })
    },
  })
}

// Hook para eliminar obra de ejecución
export const useDeleteEjecucionObra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ejecucionService.deleteObra(id),
    onSuccess: () => {
      // Invalidar listas de obras
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obras() })
    },
  })
}

// Hook para agregar profesional
export const useAddEjecucionProfesional = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ obraId, data }: { obraId: number; data: ProfesionalFormData }) =>
      ejecucionService.addProfesional(obraId, data),
    onSuccess: (_, { obraId }) => {
      // Invalidar profesionales y detalle de obra
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.profesionales(obraId) })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obraDetail(obraId) })
    },
  })
}

// Hook para actualizar profesional
export const useUpdateEjecucionProfesional = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data, obraId }: { id: number; data: Partial<ProfesionalFormData>; obraId: number }) =>
      ejecucionService.updateProfesional(id, data),
    onSuccess: (_, { obraId }) => {
      // Invalidar profesionales y detalle de obra
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.profesionales(obraId) })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obraDetail(obraId) })
    },
  })
}

// Hook para eliminar profesional
export const useDeleteEjecucionProfesional = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, obraId }: { id: number; obraId: number }) =>
      ejecucionService.deleteProfesional(id),
    onSuccess: (_, { obraId }) => {
      // Invalidar profesionales y detalle de obra
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.profesionales(obraId) })
      queryClient.invalidateQueries({ queryKey: ejecucionKeys.obraDetail(obraId) })
    },
  })
}