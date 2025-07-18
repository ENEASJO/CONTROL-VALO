import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supervisionService } from '../services/supervisionService'
import { ObraFilters, FormularioObraData, ProfesionalFormData } from '../types'

// Query keys
export const supervisionKeys = {
  all: ['supervision'] as const,
  obras: () => [...supervisionKeys.all, 'obras'] as const,
  obrasList: (filters: ObraFilters) => [...supervisionKeys.obras(), 'list', filters] as const,
  obraDetail: (id: number) => [...supervisionKeys.obras(), 'detail', id] as const,
  profesionales: (obraId: number) => [...supervisionKeys.all, 'profesionales', obraId] as const,
}

// Hook para obtener lista de obras de supervisión
export const useSupervisionObras = (filters: ObraFilters = {}) => {
  return useQuery({
    queryKey: supervisionKeys.obrasList(filters),
    queryFn: () => supervisionService.getObras(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener obra de supervisión por ID
export const useSupervisionObra = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: supervisionKeys.obraDetail(id),
    queryFn: () => supervisionService.getObraById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  })
}

// Hook para obtener profesionales de una obra
export const useSupervisionProfesionales = (obraId: number) => {
  return useQuery({
    queryKey: supervisionKeys.profesionales(obraId),
    queryFn: () => supervisionService.getProfesionales(obraId),
    enabled: !!obraId,
  })
}

// Hook para crear obra de supervisión
export const useCreateSupervisionObra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormularioObraData) => supervisionService.createObra(data),
    onSuccess: () => {
      // Invalidar listas de obras
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obras() })
    },
  })
}

// Hook para actualizar obra de supervisión
export const useUpdateSupervisionObra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FormularioObraData> }) =>
      supervisionService.updateObra(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obraDetail(id) })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obras() })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.profesionales(id) })
    },
  })
}

// Hook para eliminar obra de supervisión
export const useDeleteSupervisionObra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => supervisionService.deleteObra(id),
    onSuccess: () => {
      // Invalidar listas de obras
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obras() })
    },
  })
}

// Hook para agregar profesional
export const useAddSupervisionProfesional = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ obraId, data }: { obraId: number; data: ProfesionalFormData }) =>
      supervisionService.addProfesional(obraId, data),
    onSuccess: (_, { obraId }) => {
      // Invalidar profesionales y detalle de obra
      queryClient.invalidateQueries({ queryKey: supervisionKeys.profesionales(obraId) })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obraDetail(obraId) })
    },
  })
}

// Hook para actualizar profesional
export const useUpdateSupervisionProfesional = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data, obraId }: { id: number; data: Partial<ProfesionalFormData>; obraId: number }) =>
      supervisionService.updateProfesional(id, data),
    onSuccess: (_, { obraId }) => {
      // Invalidar profesionales y detalle de obra
      queryClient.invalidateQueries({ queryKey: supervisionKeys.profesionales(obraId) })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obraDetail(obraId) })
    },
  })
}

// Hook para eliminar profesional
export const useDeleteSupervisionProfesional = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, obraId }: { id: number; obraId: number }) =>
      supervisionService.deleteProfesional(id),
    onSuccess: (_, { obraId }) => {
      // Invalidar profesionales y detalle de obra
      queryClient.invalidateQueries({ queryKey: supervisionKeys.profesionales(obraId) })
      queryClient.invalidateQueries({ queryKey: supervisionKeys.obraDetail(obraId) })
    },
  })
}