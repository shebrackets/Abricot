import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { iconChevronDown } from '@/assets/icons'
import useClickOutside from '@/hooks/useClickOutside'
import { getInitials } from '@/utils/helpers'
import { API_URL, getToken } from '@/services/api'
import styles from './CreateProjectModal.module.scss'

export default function CreateProjectModal({ onClose, onSave }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [contributors, setContributors] = useState([])
    const [allUsers, setAllUsers] = useState([])
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

    const toggleContributor = (userId) => {
        setContributors((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const contributorEmails = allUsers
                .filter((u) => contributors.includes(u.id))
                .map((u) => u.email)

            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ name, description, contributors: contributorEmails }),
            })
            const data = await res.json()
            if (res.ok) {
                onSave(data.data.project)
                onClose()
            } else {
                setError(data.message || 'Erreur lors de la création')
            }
        } catch {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

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
                    <h2 id="modal-title" className={styles.title}>Créer un projet</h2>

                    {error && <p role="alert" className={styles.error}>{error}</p>}

                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="project-name">Titre*</label>
                            <input
                                id="project-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                required
                                autoComplete="off"
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
                                        {contributors.length > 0
                                            ? `${contributors.length} collaborateur${contributors.length > 1 ? 's' : ''} sélectionné${contributors.length > 1 ? 's' : ''}`
                                            : 'Choisir un ou plusieurs collaborateurs'}
                                    </span>
                                    <Image src={iconChevronDown} alt="" width={16} height={8} aria-hidden="true" />
                                </button>
                                {contributorsOpen && (
                                    <ul className={styles.contributorsDropdown} role="listbox">
                                        {allUsers.length === 0 ? (
                                            <li className={styles.emptyUsers}>Aucun utilisateur disponible</li>
                                        ) : (
                                            allUsers.map((u) => {
                                                const isSelected = contributors.includes(u.id)
                                                return (
                                                    <li key={u.id} role="option" aria-selected={isSelected}>
                                                        <button
                                                            type="button"
                                                            className={`${styles.contributorOption} ${isSelected ? styles.contributorSelected : ''}`}
                                                            onClick={() => toggleContributor(u.id)}
                                                        >
                                                            <div className={styles.contributorAvatar} aria-hidden="true">
                                                                {getInitials(u.name)}
                                                            </div>
                                                            <span>{u.name}</span>
                                                            {isSelected && (
                                                                <span className={styles.checkmark} aria-hidden="true">✓</span>
                                                            )}
                                                        </button>
                                                    </li>
                                                )
                                            })
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.btnSave} ${isValid && !loading ? styles.btnSaveActive : ''}`}
                        disabled={!isValid || loading}
                    >
                        {loading ? 'Création...' : 'Ajouter un projet'}
                    </button>
                </form>
            </div>
        </div>
    )
}