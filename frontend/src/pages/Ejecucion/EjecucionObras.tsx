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
  Search as SearchIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useObrasEjecucion, useDeleteObraEjecucion } from '../../hooks/useEjecucion'
import { useNotification } from '../../hooks/useNotification'
import { TableColumn, PaginationParams, SearchFilters } from '../../types'
import SearchBar from '../../components/Common/SearchBar'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import DataTable from '../../components/Common/DataTable'
import ErrorMessage from '../../components/Common/ErrorMessage'
import ConfirmDialog from '../../components/Common/ConfirmDialog'
import NotificationSnackbar from '../../components/Common/NotificationSnackbar'

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

  // Configuración de columnas de la tabla (solo campos que existen)
  const columns: TableColumn<Obra>[] = [
    {
      id: 'id',
      label: 'ID',
      width: 80,
      align: 'center',
    },
    {
      id: 'nombreObra',
      label: 'Nombre de la Obra',
      width: 300,
    },
    {
      id: 'numeroContrato',
      label: 'N° Contrato',
      width: 180,
    },
    {
      id: 'estado',
      label: 'Estado',
      width: 140,
      format: (value: any) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'EN_PROCESO' ? 'warning' : 'default'}
          variant="filled"
        />
      ),
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      width: 200,
      format: (value: any) => value || 'Sin descripción',
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

  const obras = obrasData?.data || []
  const totalCount = obrasData?.pagination?.total || 0

  return (
    <Box>
      {/* Header Moderno */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
                backdrop: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <ConstructionIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                  Obras de Ejecución 🏗️
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                  Gestión y control de proyectos en construcción
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {totalCount} {totalCount === 1 ? 'obra registrada' : 'obras registradas'}
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
              onClick={() => navigate('/ejecucion/nueva')}
            >
              Nueva Obra
            </Button>
          </Box>
        </Box>
        
        {/* Elementos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          width: 60,
          height: 60,
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
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
        <LoadingSpinner message="Cargando obras de ejecución..." />
      ) : (
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <CardContent sx={{ p: 0 }}>
            {obras.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay obras de ejecución registradas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ¡Crea la primera obra de ejecución!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white'
                    }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Nombre de la Obra</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>N° Contrato</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Estado</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Descripción</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obras.map((obra, index) => (
                      <tr key={obra.id} style={{ 
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                          <Chip label={obra.id} size="small" variant="outlined" />
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', fontWeight: 500 }}>
                          {obra.nombreObra}
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', fontFamily: 'monospace' }}>
                          {obra.numeroContrato}
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                          <Chip 
                            label={obra.estado} 
                            size="small" 
                            color={obra.estado === 'EN_PROCESO' ? 'warning' : 'success'}
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                          {obra.descripcion || 'Sin descripción'}
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={() => handleView(obra)}
                              sx={{ minWidth: 60 }}
                            >
                              Ver
                            </Button>
                            <Button 
                              size="small" 
                              variant="contained" 
                              onClick={() => handleEdit(obra)}
                              sx={{ minWidth: 60 }}
                            >
                              Editar
                            </Button>
                          </Box>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </CardContent>
        </Card>
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