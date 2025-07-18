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
  Business as BusinessIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEmpresas, useDeleteEmpresa } from '../../hooks/useEmpresas'
import { useNotification } from '../../hooks/useNotification'
import { Empresa, TablaColumn, EmpresaFilters } from '../../types'
import DataTable from '../../components/Common/DataTable'
import SearchBar from '../../components/Common/SearchBar'
import ConfirmDialog from '../../components/Common/ConfirmDialog'
import NotificationSnackbar from '../../components/Common/NotificationSnackbar'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import ErrorMessage from '../../components/Common/ErrorMessage'

const Empresas = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<EmpresaFilters>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'nombre',
    sortOrder: 'asc'
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    empresa: Empresa | null
  }>({ open: false, empresa: null })

  const { notification, showSuccess, showError, hideNotification } = useNotification()

  // Queries y mutations
  const { data: empresasData, isLoading, error, refetch } = useEmpresas(filters)
  const deleteMutation = useDeleteEmpresa()

  // Configuración de columnas de la tabla
  const columns: TablaColumn<Empresa>[] = [
    {
      id: 'nombre',
      label: 'Nombre',
      minWidth: 200,
    },
    {
      id: 'ruc',
      label: 'RUC',
      minWidth: 120,
    },
    {
      id: 'esConsorcio',
      label: 'Tipo',
      minWidth: 100,
      format: (value) => (
        <Chip 
          label={value ? 'Consorcio' : 'Empresa'} 
          size="small" 
          color={value ? 'secondary' : 'default'}
          variant={value ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      id: 'integrantesConsorcio',
      label: 'Integrantes',
      minWidth: 100,
      align: 'center',
      format: (value, row) => row.esConsorcio ? (
        <Chip 
          label={`${value?.length || 0}`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      ) : '-',
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      minWidth: 120,
      format: (value) => value || '-',
    },
    {
      id: 'createdAt',
      label: 'Fecha Registro',
      minWidth: 140,
      format: (value) => new Date(value).toLocaleDateString('es-PE'),
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

  const handleView = (empresa: Empresa) => {
    // Por ahora navegar a editar, más adelante se puede crear una vista de detalle
    navigate(`/empresas/${empresa.id}/editar`)
  }

  const handleEdit = (empresa: Empresa) => {
    navigate(`/empresas/${empresa.id}/editar`)
  }

  const handleDelete = (empresa: Empresa) => {
    setDeleteDialog({ open: true, empresa })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.empresa) return

    try {
      const result = await deleteMutation.mutateAsync(deleteDialog.empresa.id)
      if (result.success) {
        showSuccess('Empresa eliminada exitosamente')
        setDeleteDialog({ open: false, empresa: null })
      } else {
        showError(result.error?.message || 'Error al eliminar la empresa')
      }
    } catch (error) {
      showError('Error inesperado al eliminar la empresa')
    }
  }

  const cancelDelete = () => {
    setDeleteDialog({ open: false, empresa: null })
  }

  // Renderizado condicional para estados de carga y error
  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BusinessIcon sx={{ color: '#1976d2', fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Empresas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestión de empresas ejecutoras y supervisoras
              </Typography>
            </Box>
          </Box>
        </Box>
        <ErrorMessage
          message="Error al cargar las empresas"
          onRetry={() => refetch()}
          fullWidth
        />
      </Box>
    )
  }

  const empresas = empresasData?.success ? empresasData.data?.data || [] : []
  const totalCount = empresasData?.success ? empresasData.data?.pagination.total || 0 : 0

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BusinessIcon sx={{ color: '#1976d2', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Empresas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestión de empresas ejecutoras y supervisoras
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/empresas/nueva')}
        >
          Nueva Empresa
        </Button>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchBar
              value={filters.search || ''}
              onChange={handleSearch}
              placeholder="Buscar por nombre, RUC o email..."
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tabla */}
      {isLoading ? (
        <LoadingSpinner message="Cargando empresas..." />
      ) : (
        <DataTable
          data={empresas}
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
          emptyMessage="No hay empresas registradas. ¡Crea la primera empresa!"
        />
      )}

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Empresa"
        message={`¿Estás seguro de que deseas eliminar la empresa "${deleteDialog.empresa?.nombre}"? Esta acción no se puede deshacer.`}
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

export default Empresas