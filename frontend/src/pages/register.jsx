import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AuthLayout from '@/components/layout/AuthLayout'
import registerBg from '@/assets/register-bg.jpg'
import styles from '@/styles/auth.module.scss'
import { API_URL } from '@/services/api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || "Erreur lors de l'inscription"); return }
      router.push('/login')
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout bgImage={registerBg} footer={
      <p className={styles.authSwitch}>
        Déjà inscrit ? <Link href="/login">Se connecter</Link>
      </p>
    }>
      <h1 className={styles.authTitle}>Inscription</h1>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {error && <div className={styles.authError}>{error}</div>}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
    </AuthLayout>
  )
}