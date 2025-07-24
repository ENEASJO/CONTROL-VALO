import { useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: number
}

let notificationCounter = 0

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const notification: Notification = {
      id: `notification-${++notificationCounter}`,
      message,
      type,
      timestamp: Date.now(),
    }

    setNotifications(prev => [...prev, notification])

    // Auto-remover después de 5 segundos (solo en producción, no en tests)
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    }

    return notification.id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
  }
}