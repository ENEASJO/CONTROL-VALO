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
  Search as SearchIcon,
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

  const { notification, showNotification, hideNotification } = useNotification()

  // Queries y mutations
  const { data: empresasData, isLoading, error, refetch } = useEmpresas(filters)
  const deleteMutation = useDeleteEmpresa()

  // Configuración de columnas de la tabla (basada en datos reales de la API)
  const columns: TablaColumn<Empresa>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 80,
      align: 'center',
    },
    {
      id: 'razonSocial',
      label: 'Razón Social',
      minWidth: 250,
    },
    {
      id: 'nombreComercial',
      label: 'Nombre Comercial',
      minWidth: 200,
      format: (value) => value || '-',
    },
    {
      id: 'ruc',
      label: 'RUC',
      minWidth: 120,
    },
    {
      id: 'esConsorcio',
      label: 'Tipo',
      minWidth: 120,
      format: (value) => (
        <Chip 
          label={value ? '🏗️ Consorcio' : '🏢 Empresa'} 
          size="small" 
          color={value ? 'primary' : 'secondary'}
          variant="filled"
          sx={{
            fontWeight: 600,
            background: value 
              ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
              : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: 'white'
          }}
        />
      ),
    },
    {
      id: 'estado',
      label: 'Estado',
      minWidth: 100,
      format: (value) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'ACTIVO' ? 'success' : 'default'}
          variant="filled"
        />
      ),
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      minWidth: 120,
      format: (value) => value || '-',
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 180,
      format: (value) => value || '-',
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
        showNotification('Empresa eliminada exitosamente', 'success')
        setDeleteDialog({ open: false, empresa: null })
      } else {
        showNotification(result.error?.message || 'Error al eliminar la empresa', 'error')
      }
    } catch (error) {
      showNotification('Error inesperado al eliminar la empresa', 'error')
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

  // Debug: Mostrar estructura de datos
  console.log('🔍 DEBUG empresasData:', empresasData)
  
  const empresas = empresasData?.data || []
  const totalCount = empresasData?.pagination?.total || 0

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
                <BusinessIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                  Consorcios 🏢
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                  Gestión de consorcios ejecutores y empresas supervisoras
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {totalCount} {totalCount === 1 ? 'consorcio/empresa registrada' : 'consorcios/empresas registradas'}
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
              onClick={() => navigate('/empresas/nueva')}
            >
              Nuevo Consorcio
            </Button>
          </Box>
        </Box>
        
        {/* Elementos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: -35,
          right: -35,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          top: '40%',
          right: '8%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
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
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
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
              placeholder="Buscar consorcios por nombre, RUC o email..."
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