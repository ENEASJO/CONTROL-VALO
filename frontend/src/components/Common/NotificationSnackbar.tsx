import { Snackbar, Alert, AlertColor, Stack } from '@mui/material'
import { useNotification } from '../../hooks/useNotification'

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

// Componente mejorado que usa el hook de notificaciones
export const NotificationProvider = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <Stack
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 400,
      }}
    >
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity={notification.type}
          variant="filled"
          onClose={() => removeNotification(notification.id)}
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        >
          {notification.message}
        </Alert>
      ))}
    </Stack>
  )
}

// Hook para usar notificaciones fácilmente en componentes
export const useNotify = () => {
  const { showNotification } = useNotification()
  
  return {
    success: (message: string) => showNotification(message, 'success'),
    error: (message: string) => showNotification(message, 'error'),
    warning: (message: string) => showNotification(message, 'warning'),
    info: (message: string) => showNotification(message, 'info'),
  }
}

export default NotificationSnackbar