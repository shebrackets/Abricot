import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import TaskListView from '@/components/dashboard/TaskListView'
import TaskKanbanView from '@/components/dashboard/TaskKanbanView'
import useAuth from '@/hooks/useAuth'
import useDashboardTasks from '@/hooks/useDashboardTasks'
import { iconList, iconKanban } from '@/assets/icons'
import styles from '@/styles/dashboard.module.scss'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { tasks } = useDashboardTasks(user)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.subtitle}>
            Bonjour {user?.name}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <Link href="/projects" className={styles.btnCreate}>
          + Créer un projet
        </Link>
      </header>

      <nav className={styles.tabs} aria-label="Vue des tâches">
        <button
          className={`${styles.tab} ${view === 'list' ? styles.active : ''}`}
          onClick={() => setView('list')}
          aria-pressed={view === 'list'}
        >
          <Image src={iconList} alt="" width={16} height={16} />
          Liste
        </button>
        <button
          className={`${styles.tab} ${view === 'kanban' ? styles.active : ''}`}
          onClick={() => setView('kanban')}
          aria-pressed={view === 'kanban'}
        >
          <Image src={iconKanban} alt="" width={15} height={17} />
          Kanban
        </button>
      </nav>

      <section aria-label="Tâches">
        {view === 'list' ? (
          <TaskListView tasks={tasks} search={search} onSearch={setSearch} />
        ) : (
          <TaskKanbanView tasks={tasks} />
        )}
      </section>
    </DashboardLayout>
  )
}