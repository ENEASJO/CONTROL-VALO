import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Construction as ConstructionIcon,
  Visibility as SupervisionIcon,
  Business as BusinessIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { MenuItem } from '../../types'

interface SidebarProps {
  onItemClick?: () => void
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: DashboardIcon,
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
  },
  {
    id: 'ejecucion',
    label: 'Ejecución',
    path: '/ejecucion',
    icon: ConstructionIcon,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
  {
    id: 'supervision',
    label: 'Supervisión',
    path: '/supervision',
    icon: SupervisionIcon,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  },
  {
    id: 'consorcios',
    label: 'Consorcios',
    path: '/empresas',
    icon: BusinessIcon,
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
]

const Sidebar = ({ onItemClick }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleItemClick = (path: string) => {
    navigate(path)
    onItemClick?.()
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderRight: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      {/* Logo/Header */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
            Control de
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
            Valorizaciones
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Sistema de Gestión
          </Typography>
        </Box>
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
      </Box>

      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  background: active ? item.gradient : 'transparent',
                  color: active ? 'white' : 'text.primary',
                  transition: 'all 0.3s ease',
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    background: active ? item.gradient : `${item.color}10`,
                    transform: 'translateX(4px)',
                    boxShadow: active 
                      ? `0 4px 20px ${item.color}40` 
                      : `0 2px 8px ${item.color}20`,
                  },
                  '&::before': active ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '0 2px 2px 0'
                  } : {}
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? 'white' : item.color,
                    minWidth: 45,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Icon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.9)',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 },
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Info Section */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Módulos Independientes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#388e3c',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Ejecución de Obras
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#f57c00',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Supervisión de Obras
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar