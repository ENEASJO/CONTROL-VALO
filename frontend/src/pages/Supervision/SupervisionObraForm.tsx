import {
  Box,
  Typography,
} from '@mui/material'
import {
  Visibility as SupervisionIcon,
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { MODULO_TIPO } from '../../types'
import ObraForm from '../../components/Forms/ObraForm'

const SupervisionObraForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <SupervisionIcon sx={{ color: '#f57c00', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEditing ? 'Editar Obra de Supervisión' : 'Nueva Obra de Supervisión'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Modificar datos de la obra' : 'Registrar nueva obra de supervisión'}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <ObraForm tipo={MODULO_TIPO.SUPERVISION} />
    </Box>
  )
}

export default SupervisionObraForm