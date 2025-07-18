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
  FormControlLabel,
  Switch,
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
} from '@mui/icons-material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { FormularioEmpresaData, VALIDATION_RULES, VALIDATION_MESSAGES } from '../../types'
import { useCreateEmpresa, useUpdateEmpresa, useEmpresa } from '../../hooks/useEmpresas'
import { useNotification } from '../../hooks/useNotification'
import LoadingSpinner from '../Common/LoadingSpinner'
import NotificationSnackbar from '../Common/NotificationSnackbar'

interface EmpresaFormProps {
  empresaId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

const EmpresaForm = ({ empresaId, onSuccess, onCancel }: EmpresaFormProps) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!(empresaId || id)
  const currentId = empresaId || (id ? parseInt(id) : undefined)

  const { notification, showSuccess, showError, hideNotification } = useNotification()

  // Queries y mutations
  const { data: empresaData, isLoading: loadingEmpresa } = useEmpresa(currentId!, {
    enabled: isEditing && !!currentId
  })
  const createMutation = useCreateEmpresa()
  const updateMutation = useUpdateEmpresa()

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormularioEmpresaData>({
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      ruc: '',
      telefono: '',
      esConsorcio: false,
      integrantesConsorcio: [],
    },
  })

  // Field array para integrantes del consorcio
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'integrantesConsorcio',
  })

  const watchEsConsorcio = watch('esConsorcio')
  const watchedIntegrantes = watch('integrantesConsorcio')

  // Calcular total de porcentajes del consorcio
  const totalPorcentajeConsorcio = watchedIntegrantes?.reduce(
    (sum, integrante) => sum + (integrante.porcentajeParticipacion || 0), 
    0
  ) || 0

  // Cargar datos para edición
  useEffect(() => {
    if (isEditing && empresaData?.success && empresaData.data) {
      const empresa = empresaData.data
      reset({
        nombre: empresa.nombre,
        ruc: empresa.ruc,
        telefono: empresa.telefono || '',
        esConsorcio: empresa.esConsorcio || false,
        integrantesConsorcio: empresa.integrantesConsorcio?.map(integrante => ({
          nombre: integrante.nombre,
          ruc: integrante.ruc,
          porcentajeParticipacion: integrante.porcentajeParticipacion,
        })) || [],
      })
    }
  }, [empresaData, isEditing, reset])

  // Validaciones personalizadas
  const validateRuc = (value: string) => {
    if (!value) return VALIDATION_MESSAGES.REQUIRED
    if (value.length !== VALIDATION_RULES.RUC_LENGTH) {
      return VALIDATION_MESSAGES.RUC_INVALID
    }
    if (!/^\d+$/.test(value)) {
      return VALIDATION_MESSAGES.RUC_INVALID
    }
    return true
  }

  const validatePorcentajeConsorcio = (value: number) => {
    if (value < VALIDATION_RULES.PORCENTAJE_MIN || value > VALIDATION_RULES.PORCENTAJE_MAX) {
      return VALIDATION_MESSAGES.PORCENTAJE_INVALID
    }
    return true
  }

  // Agregar integrante al consorcio
  const handleAddIntegrante = () => {
    append({
      nombre: '',
      ruc: '',
      porcentajeParticipacion: 0,
    })
  }

  // Manejar envío del formulario
  const onSubmit = async (data: FormularioEmpresaData) => {
    try {
      if (isEditing && currentId) {
        const result = await updateMutation.mutateAsync({ id: currentId, data })
        if (result.success) {
          showSuccess('Empresa actualizada exitosamente')
          onSuccess?.()
          if (!onSuccess) {
            navigate('/empresas')
          }
        } else {
          showError(result.error?.message || 'Error al actualizar la empresa')
        }
      } else {
        const result = await createMutation.mutateAsync(data)
        if (result.success) {
          showSuccess('Empresa creada exitosamente')
          onSuccess?.()
          if (!onSuccess) {
            navigate('/empresas')
          }
        } else {
          showError(result.error?.message || 'Error al crear la empresa')
        }
      }
    } catch (error) {
      showError('Error inesperado al procesar la solicitud')
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/empresas')
    }
  }

  if (isEditing && loadingEmpresa) {
    return <LoadingSpinner message="Cargando datos de la empresa..." />
  }

  if (isEditing && empresaData && !empresaData.success) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar los datos de la empresa: {empresaData.error?.message}
      </Alert>
    )
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid item xs={12} md={8}>
                <Controller
                  name="nombre"
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
                      label="Nombre de la Empresa"
                      fullWidth
                      required
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              {/* RUC */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="ruc"
                  control={control}
                  rules={{
                    required: VALIDATION_MESSAGES.REQUIRED,
                    validate: validateRuc
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="RUC"
                      fullWidth
                      required
                      error={!!errors.ruc}
                      helperText={errors.ruc?.message || 'Debe tener 11 dígitos'}
                      disabled={isLoading}
                      inputProps={{ maxLength: 11 }}
                    />
                  )}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Teléfono"
                      fullWidth
                      error={!!errors.telefono}
                      helperText={errors.telefono?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              {/* Es Consorcio */}
              <Grid item xs={12}>
                <Controller
                  name="esConsorcio"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      }
                      label="Es un Consorcio"
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Sección de Consorcio */}
            {watchEsConsorcio && (
              <>
                <Divider sx={{ my: 4 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Integrantes del Consorcio
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddIntegrante}
                    size="small"
                    disabled={isLoading}
                  >
                    Agregar Integrante
                  </Button>
                </Box>

                {/* Tabla de integrantes */}
                {fields.length > 0 && (
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre de la Empresa</TableCell>
                          <TableCell>RUC</TableCell>
                          <TableCell width={120}>Porcentaje (%)</TableCell>
                          <TableCell width={80}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Controller
                                name={`integrantesConsorcio.${index}.nombre`}
                                control={control}
                                rules={{ required: 'Nombre requerido' }}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    error={!!errors.integrantesConsorcio?.[index]?.nombre}
                                    placeholder="Nombre de la empresa"
                                    disabled={isLoading}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`integrantesConsorcio.${index}.ruc`}
                                control={control}
                                rules={{
                                  required: 'RUC requerido',
                                  validate: (value) => {
                                    if (value.length !== VALIDATION_RULES.RUC_LENGTH) {
                                      return VALIDATION_MESSAGES.RUC_INVALID
                                    }
                                    if (!/^\d+$/.test(value)) {
                                      return VALIDATION_MESSAGES.RUC_INVALID
                                    }
                                    return true
                                  }
                                }}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    error={!!errors.integrantesConsorcio?.[index]?.ruc}
                                    placeholder="RUC"
                                    inputProps={{ maxLength: 11 }}
                                    disabled={isLoading}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`integrantesConsorcio.${index}.porcentajeParticipacion`}
                                control={control}
                                rules={{
                                  required: 'Porcentaje requerido',
                                  validate: validatePorcentajeConsorcio
                                }}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    error={!!errors.integrantesConsorcio?.[index]?.porcentajeParticipacion}
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    disabled={isLoading}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => remove(index)}
                                disabled={isLoading}
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

                {/* Resumen de porcentajes del consorcio */}
                {fields.length > 0 && (
                  <Alert 
                    severity={totalPorcentajeConsorcio > 100 ? 'error' : totalPorcentajeConsorcio === 100 ? 'success' : 'info'}
                    sx={{ mb: 3 }}
                  >
                    Total de porcentajes del consorcio: {totalPorcentajeConsorcio.toFixed(2)}%
                    {totalPorcentajeConsorcio > 100 && ' - Excede el 100%'}
                    {totalPorcentajeConsorcio === 100 && ' - Perfecto'}
                    {totalPorcentajeConsorcio < 100 && ` - Faltan ${(100 - totalPorcentajeConsorcio).toFixed(2)}%`}
                  </Alert>
                )}

                {fields.length === 0 && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Debe agregar al menos un integrante al consorcio
                  </Alert>
                )}
              </>
            )}

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isLoading || !isValid || (!isDirty && isEditing) || (watchEsConsorcio && totalPorcentajeConsorcio > 100)}
              >
                {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
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

export default EmpresaForm