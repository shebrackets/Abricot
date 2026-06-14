import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useAuth from '@/hooks/useAuth'
import styles from '@/styles/404.module.scss'

export default function NotFoundPage() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <DashboardLayout user={user}>
      <div className={styles.container}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.title}>Page introuvable</p>
        <p className={styles.subtitle}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/dashboard" className={styles.btn}>
          Retour au tableau de bord
        </Link>
      </div>
    </DashboardLayout>
  )
}