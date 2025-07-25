import { useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: number
}

export interface SingleNotification {
  open: boolean
  message: string
  severity: NotificationType
}

let notificationCounter = 0

export const useNotification = () => {
  const [notification, setNotification] = useState<SingleNotification>({
    open: false,
    message: '',
    severity: 'info'
  })

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    setNotification({
      open: true,
      message,
      severity: type
    })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }))
  }, [])

  // Aliases para compatibilidad
  const showSuccess = useCallback((message: string) => showNotification(message, 'success'), [showNotification])
  const showError = useCallback((message: string) => showNotification(message, 'error'), [showNotification])
  const showWarning = useCallback((message: string) => showNotification(message, 'warning'), [showNotification])
  const showInfo = useCallback((message: string) => showNotification(message, 'info'), [showNotification])

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}