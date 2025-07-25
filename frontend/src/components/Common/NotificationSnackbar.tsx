import { Snackbar, Alert, AlertColor } from '@mui/material'

interface NotificationSnackbarProps {
  open?: boolean
  message?: string
  severity?: AlertColor
  duration?: number
  onClose?: () => void
}

// Componente individual para compatibilidad hacia atrás
const NotificationSnackbar = ({
  open = false,
  message = '',
  severity = 'info',
  duration = 6000,
  onClose,
}: NotificationSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

// Provider simple que no hace nada (para compatibilidad)
export const NotificationProvider = () => {
  return null
}

export default NotificationSnackbar