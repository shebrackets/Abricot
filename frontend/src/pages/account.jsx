import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useAuth from '@/hooks/useAuth'
import { API_URL, getToken } from '@/services/api'
import styles from '@/styles/account.module.scss'

export default function AccountPage() {
  const { user, loading } = useAuth()

  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
      setEmail(user.email || '')
    }
  }, [user])

  const verifyCurrentPassword = async () => {
    if (!currentPassword) return
    setVerifying(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: currentPassword }),
      })
      if (res.ok) {
        setPasswordVerified(true)
      } else {
        setPasswordVerified(false)
        setError('Mot de passe actuel incorrect')
      }
    } catch {
      setPasswordVerified(false)
      setError('Erreur de connexion au serveur')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFormLoading(true)

    try {
      const name = [firstName, lastName].filter(Boolean).join(' ')

      const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, email }),
      })
      const profileData = await profileRes.json()
      if (!profileRes.ok) {
        setError(profileData.message || 'Une erreur est survenue')
        return
      }

      if (passwordVerified && newPassword) {
        const passwordRes = await fetch(`${API_URL}/api/auth/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        })
        const passwordData = await passwordRes.json()
        if (!passwordRes.ok) {
          setError(passwordData.message || 'Erreur lors de la mise à jour du mot de passe')
          return
        }
      }

      setSuccess('Informations mises à jour avec succès')
      setCurrentPassword('')
      setNewPassword('')
      setPasswordVerified(false)
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <section className={styles.card} aria-labelledby="account-title">
        <div className={styles.cardHeader}>
          <h1 id="account-title" className={styles.cardTitle}>Mon compte</h1>
          <p className={styles.userName}>{user?.name}</p>
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}
        {success && <p className={styles.success} role="status">{success}</p>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Votre nom"
              autoComplete="family-name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prenom">Prénom</label>
            <input
              id="prenom"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Votre prénom"
              autoComplete="given-name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setPasswordVerified(false)
                setError('')
              }}
              onBlur={verifyCurrentPassword}
              placeholder="••••••••••"
              autoComplete="new-password"
            />
            {verifying && (
              <p className={styles.hint}>Vérification...</p>
            )}
          </div>

          {passwordVerified && (
            <div className={styles.formGroup}>
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                autoComplete="new-password"
              />
              <p className={styles.hint}>
                8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)
              </p>
            </div>
          )}

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={formLoading}
          >
            {formLoading ? 'Enregistrement...' : 'Modifier les informations'}
          </button>
        </form>
      </section>
    </DashboardLayout>
  )
}