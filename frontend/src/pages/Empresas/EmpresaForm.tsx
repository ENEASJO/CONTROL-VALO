import {
  Box,
  Typography,
} from '@mui/material'
import {
  Business as BusinessIcon,
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import EmpresaFormComponent from '../../components/Forms/EmpresaForm'

const EmpresaForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <BusinessIcon sx={{ color: '#1976d2', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Modificar datos de la empresa' : 'Registrar nueva empresa'}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <EmpresaFormComponent />
    </Box>
  )
}

export default EmpresaForm