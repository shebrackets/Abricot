import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { iconChevronDown } from '@/assets/icons'
import useClickOutside from '@/hooks/useClickOutside'
import { getInitials } from '@/utils/helpers'
import { API_URL, getToken } from '@/services/api'
import styles from './EditProjectModal.module.scss'

export default function EditProjectModal({ project, onClose, onSave }) {
  const [name, setName] = useState(project.name || '')
  const [description, setDescription] = useState(project.description || '')
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

  const allMembers = [
    ...(project.owner ? [{ userId: project.owner.id, user: project.owner, role: 'OWNER' }] : []),
    ...(project.members || []),
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, description }),
      })
      const data = await res.json()
      console.log('response status:', res.status, 'data:', data)
      if (res.ok) {
        onSave(data.data.project)
        onClose()
      } else {
        setError(data.message || 'Erreur lors de la modification')
      }
    } catch (err) {
      console.error('catch error:', err)
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
              />
            </div>

            <div className={styles.field}>
              <label id="contributors-label">Contributeurs</label>
              <div className={styles.contributorsWrapper} ref={contributorsRef}>
                <button
                  type="button"
                  className={styles.contributorsField}
                  onClick={() => setContributorsOpen(!contributorsOpen)}
                  aria-expanded={contributorsOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="contributors-label"
                >
                  <span className={styles.contributorsText}>
                    {allMembers.length} collaborateur{allMembers.length > 1 ? 's' : ''}
                  </span>
                  <Image src={iconChevronDown} alt="" width={16} height={8} aria-hidden="true" />
                </button>
                {contributorsOpen && (
                  <ul className={styles.contributorsDropdown} role="listbox">
                    {allMembers.map((m) => (
                      <li key={m.userId} className={styles.contributorOption} role="option">
                        <div className={styles.contributorAvatar} aria-hidden="true">
                          {getInitials(m.user?.name)}
                        </div>
                        <span>{m.user?.name}</span>
                        {m.role === 'OWNER' && (
                          <span className={styles.ownerBadge}>Propriétaire</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
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