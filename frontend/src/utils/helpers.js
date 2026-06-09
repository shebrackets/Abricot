export const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'

export const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : null

export const formatDateTime = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

export const STATUS_LABELS = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminée',
  CANCELLED: 'Annulée',
}