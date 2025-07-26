import { useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard/Dashboard'
import Obras from '../../pages/Obras/Obras'
import EjecucionObras from '../../pages/Ejecucion/EjecucionObras'
import EjecucionObraForm from '../../pages/Ejecucion/EjecucionObraForm'
import EjecucionObraDetalle from '../../pages/Ejecucion/EjecucionObraDetalle'
import SupervisionObras from '../../pages/Supervision/SupervisionObras'
import SupervisionObraForm from '../../pages/Supervision/SupervisionObraForm'
import SupervisionObraDetalle from '../../pages/Supervision/SupervisionObraDetalle'
import Empresas from '../../pages/Empresas/Empresas'
import EmpresaForm from '../../pages/Empresas/EmpresaForm'

const DRAWER_WIDTH = 280

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Control de Valorizaciones de Obras
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Sidebar onItemClick={() => setMobileOpen(false)} />
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px', // AppBar height
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Rutas de Obras */}
          <Route path="/obras" element={<Obras />} />
          
          {/* Rutas de Ejecución */}
          <Route path="/ejecucion" element={<EjecucionObras />} />
          <Route path="/ejecucion/nueva" element={<EjecucionObraForm />} />
          <Route path="/ejecucion/:id" element={<EjecucionObraDetalle />} />
          <Route path="/ejecucion/:id/editar" element={<EjecucionObraForm />} />
          
          {/* Rutas de Supervisión */}
          <Route path="/supervision" element={<SupervisionObras />} />
          <Route path="/supervision/nueva" element={<SupervisionObraForm />} />
          <Route path="/supervision/:id" element={<SupervisionObraDetalle />} />
          <Route path="/supervision/:id/editar" element={<SupervisionObraForm />} />
          
          {/* Rutas de Empresas */}
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresas/nueva" element={<EmpresaForm />} />
          <Route path="/empresas/:id/editar" element={<EmpresaForm />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default Layout