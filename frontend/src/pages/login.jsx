import Link from 'next/link'
import AuthLayout from '@/components/layout/AuthLayout'
import loginBg from '@/assets/login-bg.jpg'
import styles from '@/styles/auth.module.scss'
import useAuthForm from '@/hooks/useAuthForm'

export default function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useAuthForm({
    endpoint: '/api/auth/login',
    onSuccess: (data, router) => {
      localStorage.setItem('token', data.data.token)
      router.push('/dashboard')
    },
  })

  return (
    <AuthLayout bgImage={loginBg} footer={
      <p className={styles.authSwitch}>
        Pas encore de compte ? <Link href="/register">Créer un compte</Link>
      </p>
    }>
      <h1 className={styles.authTitle}>Connexion</h1>
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
            required autoComplete="current-password" />
        </div>
        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <Link href="#" className={styles.btnForgot}>Mot de passe oublié?</Link>
      </form>
    </AuthLayout>
  )
}