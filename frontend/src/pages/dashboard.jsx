import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import TaskListView from '@/components/dashboard/TaskListView'
import TaskKanbanView from '@/components/dashboard/TaskKanbanView'
import useAuth from '@/hooks/useAuth'
import useDashboardTasks from '@/hooks/useDashboardTasks'
import useClickOutside from '@/hooks/useClickOutside'
import { iconList, iconKanban, iconChevronDown } from '@/assets/icons'
import styles from '@/styles/dashboard.module.scss'

const STATUS_OPTIONS = [
  { key: 'ALL', label: 'Tous' },
  { key: 'TODO', label: 'À faire' },
  { key: 'IN_PROGRESS', label: 'En cours' },
  { key: 'DONE', label: 'Terminée' },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { tasks } = useDashboardTasks(user)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [statusOpen, setStatusOpen] = useState(false)

  const statusRef = useRef(null)
  useClickOutside(statusRef, () => setStatusOpen(false))

  const filteredTasks = tasks.filter(
    (t) => statusFilter === 'ALL' || t.status === statusFilter
  )

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

      <div className={styles.controls}>
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

        <div className={styles.statusFilterWrapper} ref={statusRef}>
          <button
            className={styles.statusFilter}
            onClick={() => setStatusOpen(!statusOpen)}
            aria-expanded={statusOpen}
            aria-haspopup="listbox"
          >
            <span>{STATUS_OPTIONS.find((o) => o.key === statusFilter)?.label || 'Statut'}</span>
            <Image
              src={iconChevronDown}
              alt=""
              width={16}
              height={8}
              className={`${styles.chevron} ${statusOpen ? styles.open : ''}`}
              aria-hidden="true"
            />
          </button>
          {statusOpen && (
            <ul className={styles.statusDropdown} role="listbox">
              {STATUS_OPTIONS.map((option) => (
                <li key={option.key} role="option" aria-selected={statusFilter === option.key}>
                  <button
                    className={`${styles.statusOption} ${statusFilter === option.key ? styles.statusActive : ''}`}
                    onClick={() => { setStatusFilter(option.key); setStatusOpen(false) }}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section aria-label="Tâches">
        {view === 'list' ? (
          <TaskListView tasks={filteredTasks} search={search} onSearch={setSearch} />
        ) : (
          <TaskKanbanView tasks={filteredTasks} />
        )}
      </section>
    </DashboardLayout>
  )
}