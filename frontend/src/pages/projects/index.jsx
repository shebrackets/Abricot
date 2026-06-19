import { useState } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectCard from '@/components/ui/ProjectCard'
import CreateProjectModal from '@/components/ui/CreateProjectModal'
import useAuth from '@/hooks/useAuth'
import useProjects from '@/hooks/useProjects'
import Head from 'next/head'
import styles from '@/styles/projects.module.scss'

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { projects, setProjects, loading: loadingProjects } = useProjects(user)
  const [creatingProject, setCreatingProject] = useState(false)

  const handleProjectCreated = (newProject) => {
    router.push(`/projects/${newProject.id}`)
  }

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <>
      <Head>
        <title>Mes projets - Abricot</title>
      </Head>
    <DashboardLayout user={user}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Mes projets</h1>
          <p className={styles.subtitle}>Gérez vos projets</p>
        </div>
        <button
          className={styles.btnCreate}
          onClick={() => setCreatingProject(true)}
        >
          + Créer un projet
        </button>
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

      {creatingProject && (
        <CreateProjectModal
          onClose={() => setCreatingProject(false)}
          onSave={handleProjectCreated}
        />
      )}
    </DashboardLayout>
    </>
  )
}