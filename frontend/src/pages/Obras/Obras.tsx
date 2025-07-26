import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Engineering as EngineeringIcon,
  Visibility as VisibilityIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'

import DataTable from '../../components/Common/DataTable'
import SearchBar from '../../components/Common/SearchBar'
import ConfirmDialog from '../../components/Common/ConfirmDialog'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import ErrorMessage from '../../components/Common/ErrorMessage'
import ObraBaseForm from '../../components/Forms/ObraBaseForm'

import { useObrasManager, useObrasStats } from '../../hooks/useObras'
import { type ObraBase, type CreateObraBaseDto, type UpdateObraBaseDto } from '../../services/obras'

const Obras: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedObra, setSelectedObra] = useState<ObraBase | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [obraToDelete, setObraToDelete] = useState<ObraBase | null>(null)

  const {
    obras,
    pagination,
    isLoading,
    isError,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    currentFilters,
    searchTerm,
    handleSearch,
    handlePageChange,
    handleSortChange,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useObrasManager()

  const { data: statsData, isLoading: statsLoading } = useObrasStats()

  // Manejadores de eventos
  const handleCreateClick = () => {
    setSelectedObra(null)
    setFormMode('create')
    setFormOpen(true)
  }

  const handleEditClick = (obra: ObraBase) => {
    setSelectedObra(obra)
    setFormMode('edit')
    setFormOpen(true)
  }

  const handleDeleteClick = (obra: ObraBase) => {
    setObraToDelete(obra)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: CreateObraBaseDto | UpdateObraBaseDto) => {
    if (formMode === 'create') {
      return await handleCreate(data as CreateObraBaseDto)
    } else {
      return await handleUpdate(selectedObra!.id, data as UpdateObraBaseDto)
    }
  }

  const handleConfirmDelete = async () => {
    if (obraToDelete) {
      const success = await handleDelete(obraToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setObraToDelete(null)
      }
    }
  }

  // Configuración de columnas para DataTable
  const columns = [
    {
      field: 'nombre',
      headerName: 'Nombre de la Obra',
      flex: 1,
      minWidth: 300,
      sortable: true
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 180,
      sortable: false,
      renderCell: (obra: ObraBase) => {
        const hasEjecucion = obra.obras_ejecucion && obra.obras_ejecucion.length > 0
        const hasSupervision = obra.obras_supervision && obra.obras_supervision.length > 0
        
        if (hasEjecucion && hasSupervision) {
          return <Chip label="Completa" color="success" size="small" />
        } else if (hasEjecucion) {
          return <Chip label="Solo Ejecución" color="primary" size="small" />
        } else if (hasSupervision) {
          return <Chip label="Solo Supervisión" color="secondary" size="small" />
        } else {
          return <Chip label="Sin Asignar" color="default" size="small" />
        }
      }
    },
    {
      field: 'created_at',
      headerName: 'Fecha de Creación',
      width: 150,
      sortable: true,
      renderCell: (obra: ObraBase) => 
        new Date(obra.created_at).toLocaleDateString('es-PE')
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      align: 'center' as const,
      renderCell: (obra: ObraBase) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar obra">
            <IconButton
              size="small"
              onClick={() => handleEditClick(obra)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar obra">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(obra)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  if (isError) {
    return <ErrorMessage message="Error al cargar las obras" />
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Gestión de Obras
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las obras del sistema. Desde aquí podrás crear obras base que 
          luego se asociarán a los módulos de Ejecución y Supervisión.
        </Typography>
      </Box>

      {/* Cards de estadísticas */}
      {!statsLoading && statsData?.data && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {statsData.data.total_obras}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Total de Obras
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EngineeringIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {statsData.data.obras_completas}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Obras Completas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {statsData.data.obras_sin_asignar}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Sin Asignar
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {((statsData.data.obras_completas / statsData.data.total_obras) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Completitud
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Información útil */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>💡 Flujo de trabajo:</strong> Primero crea las obras aquí, luego ve a los módulos de 
          <strong> Ejecución</strong> o <strong>Supervisión</strong> para asociar la información específica de cada proceso.
        </Typography>
      </Alert>

      {/* Herramientas y filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar obras por nombre..."
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ 
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' }
            }}
          >
            Nueva Obra
          </Button>
        </Box>
      </Paper>

      {/* Tabla de datos */}
      <Paper sx={{ overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            data={obras}
            columns={columns}
            pagination={{
              page: currentFilters.page || 1,
              limit: currentFilters.limit || 10,
              total: pagination?.total || 0,
              totalPages: pagination?.totalPages || 0
            }}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            sortBy={currentFilters.sortBy}
            sortOrder={currentFilters.sortOrder}
            emptyMessage="No se encontraron obras"
            emptyDescription="Crea tu primera obra para comenzar"
          />
        )}
      </Paper>

      {/* Formulario de obra */}
      <ObraBaseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedObra || undefined}
        isLoading={isCreating || isUpdating}
        mode={formMode}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Obra"
        message={`¿Estás seguro de que deseas eliminar la obra "${obraToDelete?.nombre}"?`}
        severity="error"
        isLoading={isDeleting}
      />
    </Box>
  )
}

export default Obras