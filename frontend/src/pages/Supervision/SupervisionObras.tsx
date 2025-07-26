import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as SupervisionIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSupervisionObras, useDeleteSupervisionObra } from '../../hooks/useSupervision'
import { useNotification } from '../../hooks/useNotification'
import { Obra, TablaColumn, ObraFilters } from '../../types'
import DataTable from '../../components/Common/DataTable'
import SearchBar from '../../components/Common/SearchBar'
import ConfirmDialog from '../../components/Common/ConfirmDialog'
import NotificationSnackbar from '../../components/Common/NotificationSnackbar'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import ErrorMessage from '../../components/Common/ErrorMessage'

const SupervisionObras = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ObraFilters>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    obra: Obra | null
  }>({ open: false, obra: null })

  const { notification, showNotification, hideNotification } = useNotification()

  // Queries y mutations
  const { data: obrasData, isLoading, error, refetch } = useSupervisionObras(filters)
  const deleteMutation = useDeleteSupervisionObra()

  // Configuración de columnas de la tabla (solo campos que existen)
  const columns: TablaColumn<Obra>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 80,
      align: 'center',
    },
    {
      id: 'nombreObra',
      label: 'Nombre de la Obra',
      minWidth: 300,
    },
    {
      id: 'numeroContrato',
      label: 'N° Contrato',
      minWidth: 180,
    },
    {
      id: 'estado',
      label: 'Estado',
      minWidth: 140,
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'EN_PROCESO' ? 'warning' : 'default'}
          variant="filled"
          sx={{ bgcolor: '#f57c00', color: 'white' }}
        />
      ),
    },
    {
      id: 'empresaSupervisora',
      label: 'Empresa Supervisora',
      minWidth: 200,
      format: (value) => value || 'No asignada',
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      minWidth: 200,
      format: (value) => value || 'Sin descripción',
    },
  ]

  // Handlers
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page: page + 1 }))
  }

  const handleRowsPerPageChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }

  const handleView = (obra: Obra) => {
    navigate(`/supervision/${obra.id}`)
  }

  const handleEdit = (obra: Obra) => {
    navigate(`/supervision/${obra.id}/editar`)
  }

  const handleDelete = (obra: Obra) => {
    setDeleteDialog({ open: true, obra })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.obra) return

    try {
      const result = await deleteMutation.mutateAsync(deleteDialog.obra.id)
      if (result.success) {
        showNotification('Obra eliminada exitosamente', 'success')
        setDeleteDialog({ open: false, obra: null })
      } else {
        showNotification(result.error?.message || 'Error al eliminar la obra', 'error')
      }
    } catch (error) {
      showNotification('Error inesperado al eliminar la obra', 'error')
    }
  }

  const cancelDelete = () => {
    setDeleteDialog({ open: false, obra: null })
  }

  // Renderizado condicional para estados de carga y error
  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SupervisionIcon sx={{ color: '#f57c00', fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Obras de Supervisión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestión de obras en supervisión
              </Typography>
            </Box>
          </Box>
        </Box>
        <ErrorMessage
          message="Error al cargar las obras de supervisión"
          onRetry={() => refetch()}
          fullWidth
        />
      </Box>
    )
  }

  // Debug: Mostrar estructura de datos
  console.log('🔍 DEBUG obrasData Supervision:', obrasData)
  
  const obras = obrasData?.data || []
  const totalCount = obrasData?.pagination?.total || 0

  return (
    <Box>
      {/* Header */}
      {/* Header Moderno */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        borderRadius: 4,
        p: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mb: 4
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <SupervisionIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                  Obras de Supervisión 👁️
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                  Seguimiento y control de calidad de obras
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {totalCount} {totalCount === 1 ? 'obra en supervisión' : 'obras en supervisión'}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              sx={{ 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }
              }}
              onClick={() => navigate('/supervision/nueva')}
            >
              Nueva Obra
            </Button>
          </Box>
        </Box>
        
        {/* Elementos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -25,
          left: -25,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 1
        }} />
      </Box>

      {/* Filtros Modernos */}
      <Card sx={{ 
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              p: 1,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              color: 'white'
            }}>
              <SearchIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              Filtros de Búsqueda
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar
              value={filters.search || ''}
              onChange={handleSearch}
              placeholder="Buscar por nombre, contrato o expediente..."
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tabla */}
      {isLoading ? (
        <LoadingSpinner message="Cargando obras de supervisión..." />
      ) : (
        <DataTable
          data={obras}
          columns={columns}
          totalCount={totalCount}
          page={(filters.page || 1) - 1}
          rowsPerPage={filters.limit || 10}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
          emptyMessage="No hay obras de supervisión registradas. ¡Crea la primera obra!"
        />
      )}

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Obra de Supervisión"
        message={`¿Estás seguro de que deseas eliminar la obra "${deleteDialog.obra?.nombreObra}"? Esta acción eliminará también todos los profesionales asociados y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        severity="error"
        loading={deleteMutation.isPending}
      />

      {/* Notificaciones */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </Box>
  )
}

export default SupervisionObras