import Link from 'next/link'
import AuthLayout from '@/components/layout/AuthLayout'
import registerBg from '@/assets/register-bg.jpg'
import styles from '@/styles/auth.module.scss'
import useAuthForm from '@/hooks/useAuthForm'

export default function RegisterPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useAuthForm({
    endpoint: '/api/auth/register',
    onSuccess: (_, router) => router.push('/login'),
  })

  return (
    <AuthLayout bgImage={registerBg} footer={
      <p className={styles.authSwitch}>
        Déjà inscrit ? <Link href="/login">Se connecter</Link>
      </p>
    }>
      <h1 className={styles.authTitle}>Inscription</h1>
      <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
        {error && <p role="alert" className={styles.authError}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required autoFocus autoComplete="email" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required autoComplete="new-password" />
        </div>
        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
    </AuthLayout>
  )
}