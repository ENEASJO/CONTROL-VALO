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
  Construction as ConstructionIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useObrasEjecucion, useDeleteObraEjecucion } from '../../hooks/useEjecucion'
import { useNotification } from '../../hooks/useNotification'
import { TableColumn, PaginationParams, SearchFilters } from '../../types'
import SearchBar from '../../components/Common/SearchBar.tsx'
import LoadingSpinner from '../../components/Common/LoadingSpinner.tsx'
import DataTable from '../../components/Common/DataTable.tsx'
import ErrorMessage from '../../components/Common/ErrorMessage.tsx'
import ConfirmDialog from '../../components/Common/ConfirmDialog.tsx'
import NotificationSnackbar from '../../components/Common/NotificationSnackbar.tsx'

// Tipos temporales hasta que estén definidos correctamente
interface Obra {
  id: number
  nombreObra: string
  numeroContrato: string
  numeroExpediente: string
  periodoValorizado: string
  fechaInicio: string
  plazoEjecucion: number
  empresaEjecutora: string
  profesionales: number
  createdAt: string
  updatedAt: string
}

interface ObraFilters extends SearchFilters, PaginationParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const EjecucionObras = () => {
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

  const { showNotification, notification, hideNotification } = useNotification()

  // Queries y mutations
  const { data: obrasData, isLoading, error, refetch } = useObrasEjecucion(filters)
  const deleteMutation = useDeleteObraEjecucion()

  // Configuración de columnas de la tabla
  const columns: TableColumn<Obra>[] = [
    {
      id: 'nombreObra',
      label: 'Nombre de la Obra',
      width: 250,
    },
    {
      id: 'numeroContrato',
      label: 'N° Contrato',
      width: 140,
    },
    {
      id: 'numeroExpediente',
      label: 'N° Expediente',
      width: 140,
    },
    {
      id: 'periodoValorizado',
      label: 'Período',
      width: 120,
    },
    {
      id: 'fechaInicio',
      label: 'Fecha Inicio',
      width: 120,
      format: (value: any) => new Date(value).toLocaleDateString('es-PE'),
    },
    {
      id: 'plazoEjecucion',
      label: 'Plazo (días)',
      width: 100,
      format: (value: any) => `${value} días`,
      align: 'center',
    },
    {
      id: 'empresaEjecutora',
      label: 'Empresa Ejecutora',
      width: 200,
      format: (value: any) => value?.nombre || 'N/A',
    },
    {
      id: 'profesionales',
      label: 'Profesionales',
      width: 120,
      align: 'center',
      format: (value) => (
        <Chip 
          label={`${value?.length || 0}`} 
          size="small" 
          color="primary" 
          variant="outlined"
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
    navigate(`/ejecucion/${obra.id}`)
  }

  const handleEdit = (obra: Obra) => {
    navigate(`/ejecucion/${obra.id}/editar`)
  }

  const handleDelete = (obra: Obra) => {
    setDeleteDialog({ open: true, obra })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.obra) return

    try {
      await deleteMutation.mutateAsync(deleteDialog.obra.id)
      showNotification('Obra eliminada exitosamente', 'success')
      refetch()
      setDeleteDialog({ open: false, obra: null })
    } catch (error: any) {
      showNotification(error.message || 'Error al eliminar obra', 'error')
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
            <ConstructionIcon sx={{ color: '#388e3c', fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Obras de Ejecución
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestión de obras en ejecución
              </Typography>
            </Box>
          </Box>
        </Box>
        <ErrorMessage
          message="Error al cargar las obras de ejecución"
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
          <ConstructionIcon sx={{ color: '#388e3c', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Obras de Ejecución
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestión de obras en ejecución
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#388e3c' }}
          onClick={() => navigate('/ejecucion/nueva')}
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
        <LoadingSpinner message="Cargando obras de ejecución..." />
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
          emptyMessage="No hay obras de ejecución registradas. ¡Crea la primera obra!"
        />
      )}

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Obra de Ejecución"
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

export default EjecucionObras