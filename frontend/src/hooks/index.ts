// Exportaciones centralizadas de todos los hooks personalizados
export { useNotification } from './useNotification'
export type { NotificationType, Notification } from './useNotification'

export { useForm, validators } from './useForm'
export type { FormField, FormConfig } from './useForm'

export { 
  useObras, 
  useObra, 
  useObrasStats,
  useObrasDisponibles,
  useCreateObra, 
  useUpdateObra, 
  useDeleteObra,
  useObrasManager
} from './useObras'

export { 
  useEmpresas, 
  useEmpresa, 
  useCreateEmpresa, 
  useUpdateEmpresa, 
  useDeleteEmpresa, 
  useSearchEmpresas,
  useEmpresasForSelect,
  empresasKeys 
} from './useEmpresas'

export { 
  useObrasEjecucion, 
  useObraEjecucion, 
  useCreateObraEjecucion, 
  useUpdateObraEjecucion, 
  useDeleteObraEjecucion,
  useProfesionalesEjecucion,
  useCreateProfesionalEjecucion,
  useEstadisticasEjecucion,
  useEjecucionObra,
  ejecucionKeys 
} from './useEjecucion'

export { 
  useObrasSupervision, 
  useObraSupervision, 
  useCreateObraSupervision, 
  useUpdateObraSupervision, 
  useDeleteObraSupervision,
  useProfesionalesSupervision,
  useCreateProfesionalSupervision,
  useEstadisticasSupervision,
  useSupervisionObras,
  useSupervisionObra,
  useDeleteSupervisionObra,
  supervisionKeys 
} from './useSupervision'