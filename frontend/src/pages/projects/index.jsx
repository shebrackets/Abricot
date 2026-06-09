import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectCard from '@/components/ui/ProjectCard'
import useAuth from '@/hooks/useAuth'
import useProjects from '@/hooks/useProjects'
import styles from '@/styles/projects.module.scss'

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const { projects, loading: loadingProjects } = useProjects(user)

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Mes projets</h1>
          <p className={styles.subtitle}>Gérez vos projets</p>
        </div>
        <Link href="/projects/new" className={styles.btnCreate}>
          + Créer un projet
        </Link>
      </header>

      <section aria-label="Liste des projets">
        <div className={styles.grid}>
          {loadingProjects ? (
            <p className={styles.empty}>Chargement des projets...</p>
          ) : projects.length === 0 ? (
            <p className={styles.empty}>Aucun projet pour l'instant</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </section>
    </DashboardLayout>
  )
}