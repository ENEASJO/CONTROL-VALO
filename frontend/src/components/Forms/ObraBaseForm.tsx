import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material'
import { useForm } from '../../hooks/useForm'
import { type CreateObraBaseDto, type UpdateObraBaseDto } from '../../services/obras'

interface ObraBaseFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateObraBaseDto | UpdateObraBaseDto) => Promise<boolean>
  initialData?: UpdateObraBaseDto
  isLoading?: boolean
  mode: 'create' | 'edit'
}

const ObraBaseForm: React.FC<ObraBaseFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  mode
}) => {
  const { values, setValue, fields, handleSubmit, reset } = useForm({
    initialValues: {
      nombre: initialData?.nombre || ''
    },
    validationRules: {
      nombre: (value: string) => {
        if (!value?.trim()) return 'El nombre de la obra es requerido'
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
        if (value.trim().length > 255) return 'El nombre no puede exceder 255 caracteres'
        return undefined
      }
    },
    onSubmit: async (formData) => {
      const success = await onSubmit(formData)
      if (success) {
        reset()
        onClose()
      }
    }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  React.useEffect(() => {
    if (open && initialData) {
      setValue('nombre', initialData.nombre || '')
    }
  }, [open, initialData, setValue])

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {mode === 'create' ? 'Nueva Obra' : 'Editar Obra'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {mode === 'create' 
            ? 'Registra una nueva obra en el sistema'
            : 'Modifica los datos de la obra'
          }
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              name="nombre"
              label="Nombre de la Obra"
              value={values.nombre}
              onChange={(e) => setValue('nombre', e.target.value)}
              error={!!fields.nombre?.error}
              helperText={fields.nombre?.error}
              required
              fullWidth
              autoFocus
              placeholder="Ej: Construcción de Puente Metropolitano"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
            
            {mode === 'create' && (
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'info.50', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'info.200'
                }}
              >
                <Typography variant="body2" color="info.main" sx={{ fontWeight: 500 }}>
                  💡 Información
                </Typography>
                <Typography variant="body2" color="info.dark" sx={{ mt: 0.5 }}>
                  Una vez creada la obra, podrás asociarla tanto a registros de 
                  <strong> Ejecución</strong> como de <strong>Supervisión</strong> desde sus respectivos módulos.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            disabled={isLoading}
            sx={{ minWidth: 100 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !!fields.nombre?.error || !values.nombre?.trim()}
            sx={{ 
              minWidth: 100,
              bgcolor: mode === 'create' ? 'success.main' : 'primary.main',
              '&:hover': {
                bgcolor: mode === 'create' ? 'success.dark' : 'primary.dark',
              }
            }}
          >
            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear Obra' : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ObraBaseForm