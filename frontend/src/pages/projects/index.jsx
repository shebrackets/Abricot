import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectCard from '@/components/ui/ProjectCard'
import useAuth from '@/hooks/useAuth'
import styles from '@/styles/projects.module.scss'
import { API_URL } from '@/services/api'

export default function ProjectsPage() {
  const { user, loading, getToken } = useAuth()
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const token = getToken()

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setProjects(data.data.projects || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [user])

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Mes projets</h1>
          <p className={styles.subtitle}>Gérez vos projets</p>
        </div>
        <button className={styles.btnCreate} onClick={() => router.push('/projects/new')}>
          + Créer un projet
        </button>
      </div>

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
    </DashboardLayout>
  )
}