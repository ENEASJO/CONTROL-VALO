// Exportaciones centralizadas de todos los hooks personalizados
export { useNotification } from './useNotification'
export type { NotificationType, Notification } from './useNotification'

export { useForm, validators } from './useForm'
export type { FormField, FormConfig } from './useForm'

export { 
  useEmpresas, 
  useEmpresa, 
  useCreateEmpresa, 
  useUpdateEmpresa, 
  useDeleteEmpresa, 
  useSearchEmpresas,
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
  supervisionKeys 
} from './useSupervision'