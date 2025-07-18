import {
  Box,
  Typography,
} from '@mui/material'
import {
  Construction as ConstructionIcon,
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { ModuloTipo } from '../../types'
import ObraForm from '../../components/Forms/ObraForm'

const EjecucionObraForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <ConstructionIcon sx={{ color: '#388e3c', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEditing ? 'Editar Obra de Ejecución' : 'Nueva Obra de Ejecución'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Modificar datos de la obra' : 'Registrar nueva obra de ejecución'}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <ObraForm tipo={ModuloTipo.EJECUCION} />
    </Box>
  )
}

export default EjecucionObraForm