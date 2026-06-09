import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectTaskCard from '@/components/ui/ProjectTaskCard'
import EditTaskModal from '@/components/ui/EditTaskModal'
import EditProjectModal from '@/components/ui/EditProjectModal'
import useAuth from '@/hooks/useAuth'
import useProject from '@/hooks/useProject'
import useClickOutside from '@/hooks/useClickOutside'
import { iconBack, iconList, iconCalendarOrange, iconSearch, iconChevronDown, iconStar } from '@/assets/icons'
import { getInitials } from '@/utils/helpers'
import { API_URL, getToken } from '@/services/api'
import styles from '@/styles/project.module.scss'

const STATUS_OPTIONS = [
  { key: 'ALL', label: 'Tous' },
  { key: 'TODO', label: 'À faire' },
  { key: 'IN_PROGRESS', label: 'En cours' },
  { key: 'DONE', label: 'Terminée' },
]

export default function ProjectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const { project, tasks, setTasks, loading: loadingProject, setProject } = useProject(id)

  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [statusOpen, setStatusOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editingProject, setEditingProject] = useState(false)

  const statusRef = useRef(null)
  useClickOutside(statusRef, () => setStatusOpen(false))

  const filteredTasks = tasks
    .filter((t) => statusFilter === 'ALL' || t.status === statusFilter)
    .filter((t) => t.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (view === 'calendar') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return 0
    })

  const handleEdit = (task) => setEditingTask(task)

  const handleSave = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    )
  }

  const handleDelete = async (task) => {
    if (!confirm(`Supprimer la tâche "${task.title}" ?`)) return
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}/tasks/${task.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== task.id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveProject = (updatedProject) => {
    setProject((prev) => ({ ...prev, ...updatedProject }))
  }

  if (loading || loadingProject) return <div style={{ padding: '2rem' }}>Chargement...</div>

  return (
    <DashboardLayout user={user}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => router.push('/projects')}
            aria-label="Retour aux projets"
          >
            <Image src={iconBack} alt="" width={15} height={10} />
          </button>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.projectName}>{project?.name}</h1>
              {(project?.userRole === 'ADMIN' || project?.owner?.id === user?.id) && (
                <button
                  className={styles.editLink}
                  onClick={() => setEditingProject(true)}
                >
                  Modifier
                </button>
              )}
            </div>
            <p className={styles.projectDescription}>{project?.description}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnCreate}>Créer une tâche</button>
          <button className={styles.btnAI} aria-label="Générer des tâches avec l'IA">
            <Image src={iconStar} alt="" width={21} height={21} aria-hidden="true" />
            IA
          </button>
        </div>
      </header>

      <section className={styles.contributors} aria-label="Contributeurs du projet">
        <div className={styles.contributorsLeft}>
          <span className={styles.contributorsTitle}>Contributeurs</span>
          <span className={styles.contributorsCount}>
            {(project?.members?.length || 0) + 1} personnes
          </span>
        </div>
        <ul className={styles.contributorsList} role="list">
          {project?.owner && (
            <li className={styles.contributorItem}>
              <div className={`${styles.avatar} ${styles.owner}`}>
                {getInitials(project.owner.name)}
              </div>
              <span className={styles.ownerTag}>Propriétaire</span>
            </li>
          )}
          {project?.members?.map((m) => (
            <li key={m.userId} className={styles.contributorItem}>
              <div className={`${styles.avatar} ${styles.member}`}>
                {getInitials(m.user?.name)}
              </div>
              <span className={styles.memberTag}>{m.user?.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel} aria-label="Tâches du projet">
        <div className={styles.panelHeader}>
          <div className={styles.panelLeft}>
            <h2 className={styles.panelTitle}>Tâches</h2>
            <p className={styles.panelSubtitle}>Par ordre de priorité</p>
          </div>
          <div className={styles.panelControls}>
            <nav className={styles.tabs} aria-label="Vue des tâches">
              <button
                className={`${styles.tab} ${view === 'list' ? styles.active : ''}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
              >
                <Image src={iconList} alt="" width={16} height={16} aria-hidden="true" />
                Liste
              </button>
              <button
                className={`${styles.tab} ${view === 'calendar' ? styles.active : ''}`}
                onClick={() => setView('calendar')}
                aria-pressed={view === 'calendar'}
              >
                <Image src={iconCalendarOrange} alt="" width={15} height={17} aria-hidden="true" />
                Calendrier
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

            <div className={styles.search} role="search">
              <label htmlFor="task-search" className="sr-only">Rechercher une tâche</label>
              <input
                id="task-search"
                type="search"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Rechercher une tâche"
              />
              <Image src={iconSearch} alt="" width={14} height={14} aria-hidden="true" />
            </div>
          </div>
        </div>

        <ul className={styles.taskList} role="list">
          {filteredTasks.length === 0 ? (
            <li><p className={styles.empty}>Aucune tâche</p></li>
          ) : (
            filteredTasks.map((task) => (
              <li key={task.id}>
                <ProjectTaskCard
                  task={task}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </li>
            ))
          )}
        </ul>
      </section>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projectId={id}
          projectMembers={[
            ...(project?.owner ? [{ userId: project.owner.id, user: project.owner }] : []),
            ...(project?.members || []),
          ]}
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={project}
          onClose={() => setEditingProject(false)}
          onSave={handleSaveProject}
        />
      )}
    </DashboardLayout>
  )
}