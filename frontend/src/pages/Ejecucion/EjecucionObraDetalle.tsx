import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material'
import {
  Construction as ConstructionIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEjecucionObra } from '../../hooks/useEjecucion'
import LoadingSpinner from '../../components/Common/LoadingSpinner.tsx'
import ErrorMessage from '../../components/Common/ErrorMessage.tsx'

const EjecucionObraDetalle = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const obraId = id ? parseInt(id) : 0

  const { data: obraData, isLoading, error, refetch } = useEjecucionObra(obraId)

  if (isLoading) {
    return <LoadingSpinner message="Cargando detalle de la obra..." />
  }

  if (error || !obraData?.success) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <ConstructionIcon sx={{ color: '#388e3c', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Detalle de Obra de Ejecución
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Error al cargar la información
            </Typography>
          </Box>
        </Box>
        <ErrorMessage
          message="Error al cargar los detalles de la obra de ejecución"
          onRetry={() => refetch()}
          fullWidth
        />
      </Box>
    )
  }

  const obra = obraData.data!

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ConstructionIcon sx={{ color: '#388e3c', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {obra.nombreObra}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Obra de Ejecución - {obra.numeroContrato}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/ejecucion')}
          >
            Volver
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ bgcolor: '#388e3c' }}
            onClick={() => navigate(`/ejecucion/${obra.id}/editar`)}
          >
            Editar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Información básica */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Información de la Obra
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Número de Contrato
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {obra.numeroContrato}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Número de Expediente
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {obra.numeroExpediente}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Período Valorizado
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {obra.periodoValorizado}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Inicio
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(obra.fechaInicio).toLocaleDateString('es-PE')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Plazo de Ejecución
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body1" fontWeight="medium">
                      {obra.plazoEjecucion} días
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información adicional */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Resumen
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Profesionales
                  </Typography>
                  <Chip 
                    label={`${obra.profesionales?.length || 0} profesionales`}
                    sx={{ bgcolor: '#388e3c', color: 'white' }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body1">
                    {new Date(obra.createdAt).toLocaleDateString('es-PE')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Última Actualización
                  </Typography>
                  <Typography variant="body1">
                    {new Date(obra.updatedAt).toLocaleDateString('es-PE')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Empresas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Empresas Involucradas
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#388e3c15', borderRadius: 2 }}>
                    <ConstructionIcon sx={{ color: '#388e3c' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Empresa Ejecutora
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {obra.empresaEjecutora?.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        RUC: {obra.empresaEjecutora?.ruc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <BusinessIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Empresa Supervisora
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {obra.empresaSupervisora?.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        RUC: {obra.empresaSupervisora?.ruc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Plantel profesional */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Plantel Profesional
              </Typography>
              {obra.profesionales && obra.profesionales.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre Completo</TableCell>
                        <TableCell>Cargo</TableCell>
                        <TableCell align="center">Porcentaje de Participación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {obra.profesionales.map((profesional, index) => (
                        <TableRow key={index}>
                          <TableCell>{profesional.nombreCompleto}</TableCell>
                          <TableCell>{profesional.cargo}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${profesional.porcentajeParticipacion}%`}
                              size="small"
                              sx={{ bgcolor: '#388e3c', color: 'white' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay profesionales registrados para esta obra
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EjecucionObraDetalle