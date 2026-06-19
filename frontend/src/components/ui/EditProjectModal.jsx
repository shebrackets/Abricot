import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { iconChevronDown } from '@/assets/icons'
import useClickOutside from '@/hooks/useClickOutside'
import { getInitials } from '@/utils/helpers'
import { API_URL, getToken } from '@/services/api'
import styles from './EditProjectModal.module.scss'

export default function EditProjectModal({ project, onClose, onSave, onDelete }) {
  const [name, setName] = useState(project.name || '')
  const [description, setDescription] = useState(project.description || '')
  const [allUsers, setAllUsers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState(
    project.members?.map((m) => m.userId) || []
  )
  const [contributorsOpen, setContributorsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const contributorsRef = useRef(null)
  useClickOutside(contributorsRef, () => setContributorsOpen(false))

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (res.ok) {
          const data = await res.json()
          setAllUsers(data.data.users || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [])

  const toggleMember = (userId) => {
    if (userId === project.owner?.id) return
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const profileRes = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, description }),
      })
      const profileData = await profileRes.json()
      if (!profileRes.ok) {
        setError(profileData.message || 'Erreur lors de la modification')
        return
      }

      const currentMemberIds = project.members?.map((m) => m.userId) || []
      const toAdd = selectedMembers.filter((id) => !currentMemberIds.includes(id))
      const toRemove = currentMemberIds.filter((id) => !selectedMembers.includes(id))

      for (const userId of toAdd) {
        const user = allUsers.find((u) => u.id === userId)
        if (user) {
          await fetch(`${API_URL}/api/projects/${project.id}/contributors`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ email: user.email }),
          })
        }
      }

      for (const userId of toRemove) {
        await fetch(`${API_URL}/api/projects/${project.id}/contributors/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        })
      }

      onSave(profileData.data.project)
      onClose()
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Supprimer définitivement "${project.name}" ?`)) return
    try {
      const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.ok) {
        window.location.href = '/projects'
      }
    } catch (err) {
      console.error(err)
    }
  }

  const membersCount = selectedMembers.length + 1
  const isValid = name.trim().length >= 2 && description.trim().length >= 2

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">✕</button>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <h2 id="modal-title" className={styles.title}>Modifier un projet</h2>

          {error && <p role="alert" className={styles.error}>{error}</p>}

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="project-name">Titre*</label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du projet"
                required
                autoComplete="off"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="project-description">Description*</label>
              <input
                id="project-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du projet"
                required
                autoComplete="off"
              />
            </div>

            <div className={styles.field}>
              <span id="contributors-label" className={styles.fieldLabel}>Contributeurs</span>
              <div
                className={styles.contributorsWrapper}
                ref={contributorsRef}
                role="combobox"
                aria-expanded={contributorsOpen}
                aria-labelledby="contributors-label"
              >
                <button
                  type="button"
                  className={styles.contributorsField}
                  onClick={() => setContributorsOpen(!contributorsOpen)}
                  aria-expanded={contributorsOpen}
                  aria-haspopup="listbox"
                >
                  <span className={styles.contributorsText}>
                    {membersCount} collaborateur{membersCount > 1 ? 's' : ''}
                  </span>
                  <Image src={iconChevronDown} alt="" width={16} height={8} aria-hidden="true" />
                </button>
                {contributorsOpen && (
                  <ul className={styles.contributorsDropdown} role="listbox">
                    {project.owner && (
                      <li className={styles.contributorItem}>
                        <div className={styles.contributorAvatar}>
                          {getInitials(project.owner.name)}
                        </div>
                        <span className={styles.contributorName}>{project.owner.name}</span>
                        <span className={styles.ownerBadge}>Propriétaire</span>
                      </li>
                    )}
                    {allUsers.map((u) => {
                      const isSelected = selectedMembers.includes(u.id)
                      return (
                        <li
                          key={u.id}
                          className={`${styles.contributorItem} ${styles.contributorClickable} ${isSelected ? styles.contributorSelected : ''}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => toggleMember(u.id)}
                        >
                          <div className={styles.contributorAvatar}>
                            {getInitials(u.name)}
                          </div>
                          <span className={styles.contributorName}>{u.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={`${styles.btnSave} ${isValid && !loading ? styles.btnSaveActive : ''}`}
              disabled={!isValid || loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              className={styles.btnDelete}
              onClick={handleDelete}
            >
              Supprimer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}