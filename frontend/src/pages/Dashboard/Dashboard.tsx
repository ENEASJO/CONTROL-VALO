import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material'
import {
  Construction as ConstructionIcon,
  Visibility as SupervisionIcon,
  Business as BusinessIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'Obras de Ejecución',
      count: '12',
      icon: ConstructionIcon,
      color: '#388e3c',
      path: '/ejecucion',
      newPath: '/ejecucion/nueva',
    },
    {
      title: 'Obras de Supervisión',
      count: '8',
      icon: SupervisionIcon,
      color: '#f57c00',
      path: '/supervision',
      newPath: '/supervision/nueva',
    },
    {
      title: 'Empresas Registradas',
      count: '25',
      icon: BusinessIcon,
      color: '#1976d2',
      path: '/empresas',
      newPath: '/empresas/nueva',
    },
  ]

  const recentActivity = [
    {
      type: 'ejecucion',
      title: 'Nueva obra de ejecución creada',
      subtitle: 'Construcción de Puente Peatonal Los Olivos',
      time: 'Hace 2 horas',
      color: '#388e3c',
    },
    {
      type: 'supervision',
      title: 'Obra de supervisión actualizada',
      subtitle: 'Supervisión Edificio Multifamiliar San Borja',
      time: 'Hace 4 horas',
      color: '#f57c00',
    },
    {
      type: 'empresa',
      title: 'Nueva empresa registrada',
      subtitle: 'Constructora San Martín S.A.C.',
      time: 'Hace 1 día',
      color: '#1976d2',
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen general del sistema de control de valorizaciones
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
                onClick={() => navigate(stat.path)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${stat.color}15`,
                        mr: 2,
                      }}
                    >
                      <Icon sx={{ color: stat.color, fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h3" fontWeight="bold" color={stat.color}>
                        {stat.count}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(stat.path)
                      }}
                    >
                      Ver Todos
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ bgcolor: stat.color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(stat.newPath)
                      }}
                    >
                      Nuevo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Actividad Reciente
            </Typography>
            <Box sx={{ mt: 2 }}>
              {recentActivity.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: index < recentActivity.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: activity.color,
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.subtitle}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Acciones Rápidas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<ConstructionIcon />}
                fullWidth
                sx={{ bgcolor: '#388e3c', py: 1.5 }}
                onClick={() => navigate('/ejecucion/nueva')}
              >
                Nueva Obra de Ejecución
              </Button>
              <Button
                variant="contained"
                startIcon={<SupervisionIcon />}
                fullWidth
                sx={{ bgcolor: '#f57c00', py: 1.5 }}
                onClick={() => navigate('/supervision/nueva')}
              >
                Nueva Obra de Supervisión
              </Button>
              <Button
                variant="outlined"
                startIcon={<BusinessIcon />}
                fullWidth
                sx={{ py: 1.5 }}
                onClick={() => navigate('/empresas/nueva')}
              >
                Registrar Empresa
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Estado del Sistema
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Módulo Ejecución</Typography>
                  <Chip label="Activo" size="small" color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Módulo Supervisión</Typography>
                  <Chip label="Activo" size="small" color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Base de Datos</Typography>
                  <Chip label="Conectada" size="small" color="success" />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard