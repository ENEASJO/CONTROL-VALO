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
  RadioGroup,
  Radio,
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
  Business as BusinessIcon,
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
      esConsorcio: true,
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

  // Inicializar consorcio con 2 empresas
  const handleInitConsorcio = () => {
    append({
      nombre: '',
      ruc: '',
      porcentajeParticipacion: 50,
    })
    append({
      nombre: '',
      ruc: '',
      porcentajeParticipacion: 50,
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Box sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              color: 'white'
            }}>
              <BusinessIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 0.5 }}>
                {isEditing ? 'Editar Consorcio/Empresa 📝' : 'Nuevo Consorcio/Empresa ➕'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {watchEsConsorcio 
                  ? 'Los consorcios son la forma principal de ejecución en obras públicas'
                  : 'Empresa individual para casos excepcionales'
                }
              </Typography>
            </Box>
          </Box>
          
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
                      label={watchEsConsorcio ? "Nombre del Consorcio" : "Nombre de la Empresa"}
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

              {/* Tipo de Registro */}
              <Grid item xs={12}>
                <Box sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '2px solid #e2e8f0'
                }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#374151' }}>
                    Tipo de Registro
                  </Typography>
                  <Controller
                    name="esConsorcio"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value ? 'consorcio' : 'empresa'}
                        onChange={(e) => field.onChange(e.target.value === 'consorcio')}
                        sx={{ gap: 1 }}
                      >
                        <FormControlLabel
                          value="consorcio"
                          control={<Radio disabled={isLoading} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight="600">
                                🏗️ Consorcio
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                (Integrado por 2 o más empresas - Principal)
                              </Typography>
                            </Box>
                          }
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: field.value ? '#10b981' : 'transparent',
                            background: field.value ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            '&:hover': {
                              background: 'rgba(16, 185, 129, 0.05)'
                            }
                          }}
                        />
                        <FormControlLabel
                          value="empresa"
                          control={<Radio disabled={isLoading} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight="600">
                                🏢 Empresa Individual
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                (Casos excepcionales)
                              </Typography>
                            </Box>
                          }
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: !field.value ? '#3b82f6' : 'transparent',
                            background: !field.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            '&:hover': {
                              background: 'rgba(59, 130, 246, 0.05)'
                            }
                          }}
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Sección de Consorcio */}
            {watchEsConsorcio && (
              <>
                <Divider sx={{ my: 4 }} />
                
                <Card sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #fefefe 0%, #f8fafc 100%)',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white'
                      }}>
                        <BusinessIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Empresas Integrantes del Consorcio
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mínimo 2 empresas requeridas para formar un consorcio
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddIntegrante}
                      size="medium"
                      disabled={isLoading}
                      sx={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
                        }
                      }}
                    >
                      Agregar Empresa
                    </Button>
                  </Box>

                  {/* Tabla de integrantes */}
                  {fields.length > 0 && (
                    <TableContainer 
                      component={Paper} 
                      variant="outlined" 
                      sx={{ 
                        mb: 3, 
                        borderRadius: 3, 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                          <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Nombre de la Empresa</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>RUC</TableCell>
                          <TableCell width={130} sx={{ fontWeight: 'bold', color: '#374151' }}>Porcentaje (%)</TableCell>
                          <TableCell width={100} sx={{ fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>Acciones</TableCell>
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
                            <TableCell sx={{ textAlign: 'center' }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => remove(index)}
                                disabled={isLoading || fields.length <= 2}
                                sx={{
                                  '&:hover': {
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    transform: 'scale(1.1)'
                                  },
                                  opacity: fields.length <= 2 ? 0.5 : 1
                                }}
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
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Alert 
                        severity={totalPorcentajeConsorcio > 100 ? 'error' : totalPorcentajeConsorcio === 100 ? 'success' : 'warning'}
                        sx={{ 
                          flex: 1,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: totalPorcentajeConsorcio > 100 ? '#fee2e2' : totalPorcentajeConsorcio === 100 ? '#dcfce7' : '#fef3c7'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            Total de participación: {totalPorcentajeConsorcio.toFixed(2)}%
                          </Typography>
                          {totalPorcentajeConsorcio > 100 && <Typography variant="body2">⚠️ Excede el 100%</Typography>}
                          {totalPorcentajeConsorcio === 100 && <Typography variant="body2">✅ Perfecto</Typography>}
                          {totalPorcentajeConsorcio < 100 && (
                            <Typography variant="body2">
                              📊 Faltan {(100 - totalPorcentajeConsorcio).toFixed(2)}%
                            </Typography>
                          )}
                        </Box>
                      </Alert>
                      
                      <Alert 
                        severity={fields.length >= 2 ? 'success' : 'error'}
                        sx={{ 
                          minWidth: 200,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: fields.length >= 2 ? '#dcfce7' : '#fee2e2'
                        }}
                      >
                        <Typography variant="body2" fontWeight="600">
                          {fields.length >= 2 ? `✅ ${fields.length} empresas` : `❌ Mínimo 2 empresas`}
                        </Typography>
                      </Alert>
                    </Box>
                  )}

                  {fields.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#374151' }}>
                        🏗️ Configurar Consorcio
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Los consorcios son la modalidad principal para obras públicas.<br/>
                        Inicie agregando las empresas integrantes (mínimo 2).
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleInitConsorcio}
                        disabled={isLoading}
                        sx={{
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(5,150,105,0.3)'
                          }
                        }}
                      >
                        ➕ Inicializar Consorcio (2 empresas)
                      </Button>
                    </Box>
                  )}
                </Card>
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
                disabled={
                  isLoading || 
                  !isValid || 
                  (!isDirty && isEditing) || 
                  (watchEsConsorcio && (
                    totalPorcentajeConsorcio > 100 || 
                    fields.length < 2 ||
                    totalPorcentajeConsorcio !== 100
                  ))
                }
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