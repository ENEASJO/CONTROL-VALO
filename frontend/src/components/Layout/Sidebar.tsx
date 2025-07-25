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
  },
  {
    id: 'ejecucion',
    label: 'Ejecución',
    path: '/ejecucion',
    icon: ConstructionIcon,
    color: '#388e3c', // Verde para ejecución
  },
  {
    id: 'supervision',
    label: 'Supervisión',
    path: '/supervision',
    icon: SupervisionIcon,
    color: '#f57c00', // Naranja para supervisión
  },
  {
    id: 'empresas',
    label: 'Empresas',
    path: '/empresas',
    icon: BusinessIcon,
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
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      {/* Logo/Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Control de
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Valorizaciones
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sistema de Gestión
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? 'white' : (item.color || 'text.secondary'),
                    minWidth: 40,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.95rem',
                  }}
                />
                {item.color && !active && (
                  <Chip
                    size="small"
                    sx={{
                      bgcolor: item.color,
                      color: 'white',
                      width: 8,
                      height: 8,
                      '& .MuiChip-label': {
                        display: 'none',
                      },
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