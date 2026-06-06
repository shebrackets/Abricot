import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectTaskCard from '@/components/ui/ProjectTaskCard'
import useAuth from '@/hooks/useAuth'
import { iconBack, iconList, iconKanban, iconSearch, iconChevronDown, iconStar } from '@/assets/icons'
import styles from '@/styles/project.module.scss'
import { API_URL } from '@/services/api'

export default function ProjectPage() {
  const { user, loading, getToken } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')
  const [loadingProject, setLoadingProject] = useState(true)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!id) return
    const token = getToken()
    if (!token) return

    const fetchProject = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          fetch(`${API_URL}/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/projects/${id}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (projectRes.ok) {
          const data = await projectRes.json()
          setProject(data.data.project)
        }

        if (tasksRes.ok) {
          const data = await tasksRes.json()
          setTasks(data.data.tasks || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProject(false)
      }
    }

    fetchProject()
  }, [id])

  const filteredTasks = tasks.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'

  if (loading || loadingProject) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.push('/projects')}>
            <Image src={iconBack} alt="Retour" width={15} height={10} />
          </button>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.projectName}>{project?.name}</h1>
              <button className={styles.editLink}>Modifier</button>
            </div>
            <p className={styles.projectDescription}>{project?.description}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnCreate}>Créer une tâche</button>
          <button className={styles.btnAI}>
            <Image src={iconStar} alt="" width={21} height={21} />
            IA
          </button>
        </div>
      </div>

      <div className={styles.contributors}>
        <div className={styles.contributorsLeft}>
          <span className={styles.contributorsTitle}>Contributeurs</span>
          <span className={styles.contributorsCount}>
            {(project?.members?.length || 0) + 1} personnes
          </span>
        </div>
        <div className={styles.contributorsList}>
          {project?.owner && (
            <div className={styles.contributorItem}>
              <div className={`${styles.avatar} ${styles.owner}`}>
                {getInitials(project.owner.name)}
              </div>
              <span className={styles.ownerTag}>Propriétaire</span>
            </div>
          )}
          {project?.members?.map((m) => (
            <div key={m.userId} className={styles.contributorItem}>
              <div className={`${styles.avatar} ${styles.member}`}>
                {getInitials(m.user?.name)}
              </div>
              <span className={styles.memberTag}>{m.user?.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelLeft}>
            <p className={styles.panelTitle}>Tâches</p>
            <p className={styles.panelSubtitle}>Par ordre de priorité</p>
          </div>
          <div className={styles.panelControls}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${view === 'list' ? styles.active : ''}`}
                onClick={() => setView('list')}
              >
                <Image src={iconList} alt="" width={16} height={16} />
                Liste
              </button>
              <button
                className={`${styles.tab} ${view === 'calendar' ? styles.active : ''}`}
                onClick={() => setView('calendar')}
              >
                <Image src={iconKanban} alt="" width={15} height={17} />
                Calendrier
              </button>
            </div>
            <button className={styles.statusFilter}>
              <span>Statut</span>
              <Image src={iconChevronDown} alt="" width={16} height={8} />
            </button>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Image src={iconSearch} alt="" width={14} height={14} />
            </div>
          </div>
        </div>

        <div className={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <p className={styles.empty}>Aucune tâche</p>
          ) : (
            filteredTasks.map((task) => (
              <ProjectTaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}