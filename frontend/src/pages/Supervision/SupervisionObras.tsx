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

  const { notification, showSuccess, showError, hideNotification } = useNotification()

  // Queries y mutations
  const { data: obrasData, isLoading, error, refetch } = useSupervisionObras(filters)
  const deleteMutation = useDeleteSupervisionObra()

  // Configuración de columnas de la tabla
  const columns: TablaColumn<Obra>[] = [
    {
      id: 'nombreObra',
      label: 'Nombre de la Obra',
      minWidth: 250,
    },
    {
      id: 'numeroContrato',
      label: 'N° Contrato',
      minWidth: 140,
    },
    {
      id: 'numeroExpediente',
      label: 'N° Expediente',
      minWidth: 140,
    },
    {
      id: 'periodoValorizado',
      label: 'Período',
      minWidth: 120,
    },
    {
      id: 'fechaInicio',
      label: 'Fecha Inicio',
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString('es-PE'),
    },
    {
      id: 'plazoEjecucion',
      label: 'Plazo (días)',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'empresaSupervisora',
      label: 'Empresa Supervisora',
      minWidth: 200,
      format: (value) => value?.nombre || '-',
    },
    {
      id: 'profesionales',
      label: 'Profesionales',
      minWidth: 120,
      align: 'center',
      format: (value) => (
        <Chip 
          label={`${value?.length || 0}`} 
          size="small" 
          sx={{ bgcolor: '#f57c00', color: 'white' }}
        />
      ),
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
        showSuccess('Obra eliminada exitosamente')
        setDeleteDialog({ open: false, obra: null })
      } else {
        showError(result.error?.message || 'Error al eliminar la obra')
      }
    } catch (error) {
      showError('Error inesperado al eliminar la obra')
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

  const obras = obrasData?.success ? obrasData.data?.data || [] : []
  const totalCount = obrasData?.success ? obrasData.data?.pagination.total || 0 : 0

  return (
    <Box>
      {/* Header */}
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#f57c00' }}
          onClick={() => navigate('/supervision/nueva')}
        >
          Nueva Obra
        </Button>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
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