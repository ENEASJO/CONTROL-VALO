import {
  Box,
  Typography,
} from '@mui/material'
import {
  Business as BusinessIcon,
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import EmpresaFormComponent from '../../components/Forms/EmpresaForm.tsx'

const EmpresaForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  return (
    <Box>
      {/* Header Moderno */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        borderRadius: 4,
        p: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mb: 4
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{
              p: 2.5,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}>
              <BusinessIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                {isEditing ? 'Editar Consorcio/Empresa 📝' : 'Nuevo Consorcio/Empresa ➕'}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {isEditing ? 'Modificar datos del consorcio o empresa individual' : 'Registrar nuevo consorcio (2+ empresas) o empresa individual'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Elementos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
      </Box>

      {/* Form */}
      <EmpresaFormComponent />
    </Box>
  )
}

export default EmpresaForm