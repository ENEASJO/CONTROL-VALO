import { 
  Alert, 
  AlertTitle, 
  Box, 
  Button, 
  Typography 
} from '@mui/material'
import { 
  Refresh as RefreshIcon,
  Error as ErrorIcon 
} from '@mui/icons-material'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  variant?: 'standard' | 'filled' | 'outlined'
  severity?: 'error' | 'warning' | 'info'
  fullWidth?: boolean
}

const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  variant = 'standard',
  severity = 'error',
  fullWidth = false
}: ErrorMessageProps) => {
  return (
    <Box sx={{ py: 2, ...(fullWidth && { width: '100%' }) }}>
      <Alert 
        severity={severity} 
        variant={variant}
        icon={<ErrorIcon />}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Reintentar
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        <Typography variant="body2">
          {message}
        </Typography>
      </Alert>
    </Box>
  )
}

export default ErrorMessage