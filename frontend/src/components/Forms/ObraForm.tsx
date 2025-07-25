import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Construction as ConstructionIcon,
  Visibility as SupervisionIcon,
} from '@mui/icons-material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  FormularioObraData, 
  ProfesionalFormData, 
  Empresa,
  ModuloTipo,
  VALIDATION_RULES, 
  VALIDATION_MESSAGES 
} from '../../types'
import { useEmpresas } from '../../hooks/useEmpresas'
import {
  useCreateObraEjecucion,
  useUpdateObraEjecucion,
  useObraEjecucion
} from '../../hooks/useEjecucion'
import {
  useCreateObraSupervision,
  useUpdateObraSupervision,
  useObraSupervision
} from '../../hooks/useSupervision'
import { useNotification } from '../../hooks/useNotification'
import LoadingSpinner from '../Common/LoadingSpinner'
import NotificationSnackbar from '../Common/NotificationSnackbar'

interface ObraFormProps {
  tipo: ModuloTipo
  obraId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

const ObraForm = ({ tipo, obraId, onSuccess, onCancel }: ObraFormProps) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!(obraId || id)
  const currentId = obraId || (id ? parseInt(id) : undefined)

  const { notification, showSuccess, showError, hideNotification } = useNotification()

  // Queries
  const { data: empresasData, isLoading: loadingEmpresas } = useEmpresasForSelect()
  
  // Queries específicas por tipo de módulo
  const { data: obraEjecucionData, isLoading: loadingObraEjecucion } = useEjecucionObra(
    currentId!, 
    { enabled: isEditing && !!currentId && tipo === ModuloTipo.EJECUCION }
  )
  const { data: obraSupervisionData, isLoading: loadingObraSupervision } = useSupervisionObra(
    currentId!, 
    { enabled: isEditing && !!currentId && tipo === ModuloTipo.SUPERVISION }
  )

  // Mutations específicas por tipo de módulo
  const createEjecucionMutation = useCreateEjecucionObra()
  const updateEjecucionMutation = useUpdateEjecucionObra()
  const createSupervisionMutation = useCreateSupervisionObra()
  const updateSupervisionMutation = useUpdateSupervisionObra()

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormularioObraData>({
    mode: 'onChange',
    defaultValues: {
      nombreObra: '',
      numeroContrato: '',
      numeroExpediente: '',
      periodoValorizado: '',
      fechaInicio: '',
      plazoEjecucion: 30,
      empresaEjecutoraId: 0,
      empresaSupervisoraId: 0,
      profesionales: [],
    },
  })

  // Field array para profesionales
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'profesionales',
  })

  const watchedProfesionales = watch('profesionales')

  // Calcular total de porcentajes
  const totalPorcentaje = watchedProfesionales?.reduce(
    (sum, prof) => sum + (prof.porcentajeParticipacion || 0), 
    0
  ) || 0

  // Obtener empresas
  const empresas = empresasData?.success ? empresasData.data || [] : []

  // Configuración por tipo de módulo
  const config = {
    [ModuloTipo.EJECUCION]: {
      title: 'Obra de Ejecución',
      icon: ConstructionIcon,
      color: '#388e3c',
      path: '/ejecucion',
    },
    [ModuloTipo.SUPERVISION]: {
      title: 'Obra de Supervisión',
      icon: SupervisionIcon,
      color: '#f57c00',
      path: '/supervision',
    },
  }

  const currentConfig = config[tipo]
  const Icon = currentConfig.icon

  // Validaciones personalizadas
  const validateFechaInicio = (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED
    const fecha = new Date(value)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    if (fecha > hoy) {
      return VALIDATION_MESSAGES.FECHA_FUTURA
    }
    return true
  }

  const validatePorcentaje = (value: number) => {
    if (value < VALIDATION_RULES.PORCENTAJE_MIN || value > VALIDATION_RULES.PORCENTAJE_MAX) {
      return VALIDATION_MESSAGES.PORCENTAJE_INVALID
    }
    return true
  }

  // Agregar profesional
  const handleAddProfesional = () => {
    append({
      nombreCompleto: '',
      cargo: '',
      porcentajeParticipacion: 0,
    })
  }

  // Cargar datos para edición
  useEffect(() => {
    const obraData = tipo === ModuloTipo.EJECUCION ? obraEjecucionData : obraSupervisionData
    
    if (isEditing && obraData?.success && obraData.data) {
      const obra = obraData.data
      reset({
        nombreObra: obra.nombreObra,
        numeroContrato: obra.numeroContrato,
        numeroExpediente: obra.numeroExpediente,
        periodoValorizado: obra.periodoValorizado,
        fechaInicio: obra.fechaInicio.split('T')[0], // Convertir a formato YYYY-MM-DD
        plazoEjecucion: obra.plazoEjecucion,
        empresaEjecutoraId: obra.empresaEjecutoraId,
        empresaSupervisoraId: obra.empresaSupervisoraId,
        profesionales: obra.profesionales.map(prof => ({
          nombreCompleto: prof.nombreCompleto,
          cargo: prof.cargo,
          porcentajeParticipacion: prof.porcentajeParticipacion,
        })),
      })
    }
  }, [obraEjecucionData, obraSupervisionData, isEditing, reset, tipo])

  // Manejar envío del formulario
  const onSubmit = async (data: FormularioObraData) => {
    // Validar que la suma de porcentajes no exceda 100%
    if (totalPorcentaje > 100) {
      showError(VALIDATION_MESSAGES.PORCENTAJE_EXCEDE)
      return
    }

    // Validar que haya al menos un profesional
    if (data.profesionales.length === 0) {
      showError('Debe agregar al menos un profesional')
      return
    }

    try {
      let result
      
      if (tipo === ModuloTipo.EJECUCION) {
        if (isEditing && currentId) {
          result = await updateEjecucionMutation.mutateAsync({ id: currentId, data })
        } else {
          result = await createEjecucionMutation.mutateAsync(data)
        }
      } else {
        if (isEditing && currentId) {
          result = await updateSupervisionMutation.mutateAsync({ id: currentId, data })
        } else {
          result = await createSupervisionMutation.mutateAsync(data)
        }
      }

      if (result.success) {
        showSuccess(`${currentConfig.title} ${isEditing ? 'actualizada' : 'creada'} exitosamente`)
        
        if (onSuccess) {
          onSuccess()
        } else {
          navigate(currentConfig.path)
        }
      } else {
        showError(result.error?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la obra`)
      }
    } catch (error) {
      showError('Error inesperado al procesar la solicitud')
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(currentConfig.path)
    }
  }

  // Estados de carga
  const isLoadingData = loadingEmpresas || 
    (isEditing && tipo === ModuloTipo.EJECUCION && loadingObraEjecucion) ||
    (isEditing && tipo === ModuloTipo.SUPERVISION && loadingObraSupervision)

  const isSubmitting = createEjecucionMutation.isPending || 
    updateEjecucionMutation.isPending || 
    createSupervisionMutation.isPending || 
    updateSupervisionMutation.isPending

  if (isLoadingData) {
    return <LoadingSpinner message="Cargando datos..." />
  }

  // Verificar errores de carga
  const obraData = tipo === ModuloTipo.EJECUCION ? obraEjecucionData : obraSupervisionData
  if (isEditing && obraData && !obraData.success) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar los datos de la obra: {obraData.error?.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Icon sx={{ color: currentConfig.color, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {isEditing ? `Editar ${currentConfig.title}` : `Nueva ${currentConfig.title}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete todos los campos requeridos
              </Typography>
            </Box>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Información básica de la obra */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Información de la Obra
            </Typography>
            
            <Grid container spacing={3}>
              {/* Nombre de la obra */}
              <Grid item xs={12}>
                <Controller
                  name="nombreObra"
                  control={control}
                  rules={{
                    required: VALIDATION_MESSAGES.REQUIRED,
                    minLength: {
                      value: VALIDATION_RULES.NOMBRE_MIN_LENGTH,
                      message: `Mínimo ${VALIDATION_RULES.NOMBRE_MIN_LENGTH} caracteres`
                    },
                    maxLength: {
                      value: VALIDATION_RULES.NOMBRE_MAX_LENGTH,
                      message: `Máximo ${VALIDATION_RULES.NOMBRE_MAX_LENGTH} caracteres`
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre de la Obra"
                      fullWidth
                      required
                      error={!!errors.nombreObra}
                      helperText={errors.nombreObra?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </Grid>

              {/* Número de contrato */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="numeroContrato"
                  control={control}
                  rules={{
                    required: VALIDATION_MESSAGES.REQUIRED,
                    minLength: {
                      value: VALIDATION_RULES.CONTRATO_MIN_LENGTH,
                      message: `Mínimo ${VALIDATION_RULES.CONTRATO_MIN_LENGTH} caracteres`
                    },
                    maxLength: {
                      value: VALIDATION_RULES.CONTRATO_MAX_LENGTH,
                      message: `Máximo ${VALIDATION_RULES.CONTRATO_MAX_LENGTH} caracteres`
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número de Contrato"
                      fullWidth
                      required
                      error={!!errors.numeroContrato}
                      helperText={errors.numeroContrato?.message}
                    />
                  )}
                />
              </Grid>

              {/* Número de expediente */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="numeroExpediente"
                  control={control}
                  rules={{ required: VALIDATION_MESSAGES.REQUIRED }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número de Expediente"
                      fullWidth
                      required
                      error={!!errors.numeroExpediente}
                      helperText={errors.numeroExpediente?.message}
                    />
                  )}
                />
              </Grid>

              {/* Período valorizado */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="periodoValorizado"
                  control={control}
                  rules={{ required: VALIDATION_MESSAGES.REQUIRED }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Período Valorizado"
                      fullWidth
                      required
                      error={!!errors.periodoValorizado}
                      helperText={errors.periodoValorizado?.message}
                      placeholder="Ej: Enero 2024"
                    />
                  )}
                />
              </Grid>

              {/* Fecha de inicio */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="fechaInicio"
                  control={control}
                  rules={{
                    required: VALIDATION_MESSAGES.REQUIRED,
                    validate: validateFechaInicio
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha de Inicio"
                      type="date"
                      fullWidth
                      required
                      error={!!errors.fechaInicio}
                      helperText={errors.fechaInicio?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              {/* Plazo de ejecución */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="plazoEjecucion"
                  control={control}
                  rules={{
                    required: VALIDATION_MESSAGES.REQUIRED,
                    min: {
                      value: VALIDATION_RULES.PLAZO_MIN,
                      message: `Mínimo ${VALIDATION_RULES.PLAZO_MIN} día`
                    },
                    max: {
                      value: VALIDATION_RULES.PLAZO_MAX,
                      message: `Máximo ${VALIDATION_RULES.PLAZO_MAX} días`
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Plazo de Ejecución (días)"
                      type="number"
                      fullWidth
                      required
                      error={!!errors.plazoEjecucion}
                      helperText={errors.plazoEjecucion?.message}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Empresas */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Empresas
            </Typography>
            
            <Grid container spacing={3}>
              {/* Empresa ejecutora */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="empresaEjecutoraId"
                  control={control}
                  rules={{ 
                    required: 'La empresa ejecutora es obligatoria',
                    validate: (value) => value > 0 || 'Seleccione una empresa ejecutora'
                  }}
                  render={({ field }) => (
                    <Autocomplete
                      options={empresas}
                      getOptionLabel={(option) => `${option.nombre} (${option.ruc})`}
                      value={empresas.find(e => e.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || 0)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Empresa Ejecutora"
                          required
                          error={!!errors.empresaEjecutoraId}
                          helperText={errors.empresaEjecutoraId?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Empresa supervisora */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="empresaSupervisoraId"
                  control={control}
                  rules={{ 
                    required: 'La empresa supervisora es obligatoria',
                    validate: (value) => value > 0 || 'Seleccione una empresa supervisora'
                  }}
                  render={({ field }) => (
                    <Autocomplete
                      options={empresas}
                      getOptionLabel={(option) => `${option.nombre} (${option.ruc})`}
                      value={empresas.find(e => e.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || 0)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Empresa Supervisora"
                          required
                          error={!!errors.empresaSupervisoraId}
                          helperText={errors.empresaSupervisoraId?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Plantel profesional */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Plantel Profesional
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddProfesional}
                size="small"
              >
                Agregar Profesional
              </Button>
            </Box>

            {/* Tabla de profesionales */}
            {fields.length > 0 && (
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre Completo</TableCell>
                      <TableCell>Cargo</TableCell>
                      <TableCell width={120}>Porcentaje (%)</TableCell>
                      <TableCell width={80}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`profesionales.${index}.nombreCompleto`}
                            control={control}
                            rules={{ required: 'Nombre requerido' }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                fullWidth
                                error={!!errors.profesionales?.[index]?.nombreCompleto}
                                placeholder="Nombre completo"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`profesionales.${index}.cargo`}
                            control={control}
                            rules={{ required: 'Cargo requerido' }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                fullWidth
                                error={!!errors.profesionales?.[index]?.cargo}
                                placeholder="Cargo"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`profesionales.${index}.porcentajeParticipacion`}
                            control={control}
                            rules={{
                              required: 'Porcentaje requerido',
                              validate: validatePorcentaje
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                fullWidth
                                error={!!errors.profesionales?.[index]?.porcentajeParticipacion}
                                inputProps={{ min: 0, max: 100, step: 0.01 }}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Resumen de porcentajes */}
            {fields.length > 0 && (
              <Alert 
                severity={totalPorcentaje > 100 ? 'error' : totalPorcentaje === 100 ? 'success' : 'info'}
                sx={{ mb: 3 }}
              >
                Total de porcentajes: {totalPorcentaje.toFixed(2)}%
                {totalPorcentaje > 100 && ' - Excede el 100%'}
                {totalPorcentaje === 100 && ' - Perfecto'}
                {totalPorcentaje < 100 && ` - Faltan ${(100 - totalPorcentaje).toFixed(2)}%`}
              </Alert>
            )}

            {fields.length === 0 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Debe agregar al menos un profesional al plantel
              </Alert>
            )}

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ bgcolor: currentConfig.color }}
                disabled={!isValid || totalPorcentaje > 100 || fields.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </Box>
  )
}

export default ObraForm