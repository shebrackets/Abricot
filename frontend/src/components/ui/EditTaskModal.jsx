import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { iconChevronDown, iconCalendar } from '@/assets/icons'
import useClickOutside from '@/hooks/useClickOutside'
import { getInitials } from '@/utils/helpers'
import { API_URL, getToken } from '@/services/api'
import styles from './EditTaskModal.module.scss'

const STATUS_OPTIONS = [
  { key: 'TODO', label: 'À faire', activeClass: 'todo' },
  { key: 'IN_PROGRESS', label: 'En cours', activeClass: 'inProgress' },
  { key: 'DONE', label: 'Terminée', activeClass: 'done' },
]

export default function EditTaskModal({ task, projectId, projectMembers, onClose, onSave }) {
  const [title, setTitle] = useState(task.title || '')
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status || 'TODO')
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )
  const [selectedAssignees, setSelectedAssignees] = useState(
    task.assignees?.map((a) => a.userId || a.user?.id).filter(Boolean) || []
  )
  const [assigneesOpen, setAssigneesOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const assigneesRef = useRef(null)
  useClickOutside(assigneesRef, () => setAssigneesOpen(false))

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggleAssignee = (userId) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          dueDate: dueDate || null,
          assigneeIds: selectedAssignees.filter(Boolean),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        onSave(data.data.task)
        onClose()
      } else {
        const data = await res.json()
        setError(data.message || 'Erreur lors de la modification')
      }
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fermer la modale"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <h2 id="modal-title" className={styles.title}>Modifier</h2>

          {error && <p role="alert" className={styles.error}>{error}</p>}

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="task-title">Titre</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la tâche"
                required
                autoComplete="off"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la tâche"
                rows={3}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="task-duedate">Échéance</label>
              <div className={styles.dateField}>
                <input
                  id="task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <label htmlFor="task-duedate" style={{ cursor: 'pointer' }}>
                  <Image src={iconCalendar} alt="" width={15} height={17} aria-hidden="true" />
                </label>
              </div>
            </div>

            <div className={styles.field}>
              <label id="assignees-label">Assigné à :</label>
              <div
                className={styles.assigneesWrapper}
                ref={assigneesRef}
                role="combobox"
                aria-expanded={assigneesOpen}
                aria-labelledby="assignees-label"
              >
                <button
                  type="button"
                  className={styles.assigneesField}
                  onClick={() => setAssigneesOpen(!assigneesOpen)}
                  aria-haspopup="listbox"
                >
                  <span className={styles.assigneesText}>
                    {selectedAssignees.length} collaborateur{selectedAssignees.length > 1 ? 's' : ''}
                  </span>
                  <Image src={iconChevronDown} alt="" width={16} height={8} aria-hidden="true" />
                </button>
                {assigneesOpen && (
                  <ul className={styles.assigneesDropdown} role="listbox">
                    {projectMembers?.map((m) => {
                      const userId = m.userId || m.id
                      const isSelected = selectedAssignees.includes(userId)
                      return (
                        <li key={userId} role="option" aria-selected={isSelected}>
                          <button
                            type="button"
                            className={`${styles.assigneeOption} ${isSelected ? styles.assigneeSelected : ''}`}
                            onClick={() => toggleAssignee(userId)}
                          >
                            <div className={styles.assigneeAvatar} aria-hidden="true">
                              {getInitials(m.user?.name || m.name)}
                            </div>
                            <span>{m.user?.name || m.name}</span>
                            {isSelected && <span className={styles.checkmark} aria-hidden="true">✓</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            <fieldset className={styles.statusField}>
              <legend>Statut :</legend>
              <div className={styles.statusOptions}>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`${styles.statusTag} ${styles[opt.activeClass]} ${status === opt.key ? styles.statusSelected : ''}`}
                    onClick={() => setStatus(opt.key)}
                    aria-pressed={status === opt.key}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button
            type="submit"
            className={`${styles.btnSave} ${!loading ? styles.btnSaveActive : ''}`}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  )
}