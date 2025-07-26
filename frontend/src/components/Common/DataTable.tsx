import React from 'react'
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
  TableSortLabel,
} from '@mui/material'

export interface DataTableColumn<T = any> {
  field: keyof T | string
  headerName: string
  width?: number
  minWidth?: number
  flex?: number
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => React.ReactNode
}

export interface DataTablePagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  pagination?: DataTablePagination
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  emptyMessage?: string
  emptyDescription?: string
  loading?: boolean
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  pagination,
  onPageChange,
  onSortChange,
  sortBy,
  sortOrder = 'asc',
  emptyMessage = 'No hay datos disponibles',
  emptyDescription,
  loading = false
}: DataTableProps<T>) => {

  const handlePageChange = (event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage + 1) // MUI usa 0-based, nosotros 1-based
    }
  }

  const handleSortClick = (field: string) => {
    if (!onSortChange) return
    
    const isAsc = sortBy === field && sortOrder === 'asc'
    onSortChange(field, isAsc ? 'desc' : 'asc')
  }

  const renderCellValue = (row: T, column: DataTableColumn<T>) => {
    if (column.renderCell) {
      return column.renderCell(row)
    }
    
    const value = row[column.field as keyof T]
    
    if (value === null || value === undefined) {
      return '-'
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No'
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
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        {emptyDescription && (
          <Typography variant="body2" color="text.secondary">
            {emptyDescription}
          </Typography>
        )}
      </Paper>
    )
  }

  return (
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden',
      borderRadius: 2,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  align={column.align || 'left'}
                  style={{ 
                    minWidth: column.minWidth,
                    width: column.width,
                    ...(column.flex && { flexGrow: column.flex, flexBasis: 0 })
                  }}
                  sx={{
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  {column.sortable && onSortChange ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortOrder : 'asc'}
                      onClick={() => handleSortClick(String(column.field))}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                hover 
                key={row.id || index}
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
                    key={String(column.field)} 
                    align={column.align || 'left'}
                    sx={{ 
                      borderBottom: '1px solid #f1f5f9',
                      py: 2
                    }}
                  >
                    {renderCellValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {pagination && onPageChange && (
        <TablePagination
          rowsPerPageOptions={[]} // Deshabilitamos cambio de tamaño de página por ahora
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1} // MUI usa 0-based, nosotros 1-based
          onPageChange={handlePageChange}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          labelRowsPerPage="Filas por página:"
        />
      )}
    </Paper>
  )
}

export default DataTable