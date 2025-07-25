import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'
import { TablaColumn } from '../../types'

interface DataTableProps<T> {
  data: T[]
  columns: TablaColumn<T>[]
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onView?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
}

const DataTable = <T extends { id: number }>({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
}: DataTableProps<T>) => {
  const hasActions = onView || onEdit || onDelete

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10))
  }

  const renderCellValue = (item: T, column: TablaColumn<T>) => {
    const value = item[column.id]
    
    if (column.format) {
      return column.format(value, item)
    }
    
    if (value === null || value === undefined) {
      return '-'
    }
    
    if (typeof value === 'boolean') {
      return (
        <Chip
          label={value ? 'Sí' : 'No'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    
    return String(value)
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Cargando...</Typography>
      </Paper>
    )
  }

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden',
      borderRadius: 3,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow 
                hover 
                key={item.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'scale(1.001)',
                    transition: 'all 0.2s ease',
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={String(column.id)} 
                    align={column.align}
                    sx={{ 
                      borderBottom: '1px solid #f1f5f9',
                      py: 2
                    }}
                  >
                    {renderCellValue(item, column)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {onView && (
                        <Tooltip title="Ver detalle">
                          <IconButton
                            size="small"
                            onClick={() => onView(item)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(item)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(item)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Paper>
  )
}

export default DataTable