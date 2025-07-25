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
      count: '2',
      icon: ConstructionIcon,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      path: '/ejecucion',
      newPath: '/ejecucion/nueva',
    },
    {
      title: 'Obras de Supervisión',
      count: '2',
      icon: SupervisionIcon,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      path: '/supervision',
      newPath: '/supervision/nueva',
    },
    {
      title: 'Empresas Registradas',
      count: '3',
      icon: BusinessIcon,
      color: '#2563eb',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
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
      <Box sx={{ mb: 5 }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
          borderRadius: 4,
          p: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          mb: 4
        }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
              ¡Bienvenido al Dashboard! 👋
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
              Sistema de Control de Valorizaciones de Obras
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Gestiona proyectos, supervisa obras y controla empresas de manera eficiente
            </Typography>
          </Box>
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 1
          }} />
        </Box>
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
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                    },
                    '& .stat-number': {
                      transform: 'scale(1.05)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: stat.gradient,
                  }
                }}
                onClick={() => navigate(stat.path)}
              >
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box
                      className="icon-container"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: stat.gradient,
                        mr: 3,
                        transition: 'transform 0.3s ease',
                        boxShadow: `0 4px 20px ${stat.color}40`,
                      }}
                    >
                      <Icon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        className="stat-number"
                        variant="h2" 
                        fontWeight="bold" 
                        sx={{ 
                          background: stat.gradient,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          transition: 'transform 0.3s ease',
                          mb: 1
                        }}
                      >
                        {stat.count}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                    {stat.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Gestiona y controla eficientemente
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: stat.color,
                        color: stat.color,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: `${stat.color}10`,
                          borderColor: stat.color,
                        }
                      }}
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
                      sx={{ 
                        background: stat.gradient,
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:hover': {
                          background: stat.gradient,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${stat.color}40`,
                        }
                      }}
                      startIcon={<AddIcon />}
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