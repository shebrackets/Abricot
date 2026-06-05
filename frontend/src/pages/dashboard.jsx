import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import TaskListView from '@/components/dashboard/TaskListView'
import TaskKanbanView from '@/components/dashboard/TaskKanbanView'
import { iconList, iconKanban } from '@/assets/icons'
import styles from '@/styles/dashboard.module.scss'
import { API_URL } from '@/services/api'
import useAuth from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user, loading, getToken } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')

  useEffect(() => {
    if (!user) return
    const token = getToken()

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/assigned-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          console.log('dashboard data:', data)
          setTasks(data.data.tasks || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchTasks()
  }, [user])

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.subtitle}>
            Bonjour {user?.name}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <button className={styles.btnCreate} onClick={() => router.push('/projects')}>
          + Créer un projet
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${view === 'list' ? styles.active : ''}`}
          onClick={() => setView('list')}
        >
          <Image src={iconList} alt="" width={16} height={16} />
          Liste
        </button>
        <button
          className={`${styles.tab} ${view === 'kanban' ? styles.active : ''}`}
          onClick={() => setView('kanban')}
        >
          <Image src={iconKanban} alt="" width={15} height={17} />
          Kanban
        </button>
      </div>

      {view === 'list' ? (
        <TaskListView tasks={tasks} search={search} onSearch={setSearch} />
      ) : (
        <TaskKanbanView tasks={tasks} />
      )}
    </DashboardLayout>
  )
}