import TaskCard from '@/components/ui/TaskCard'
import styles from './TaskKanbanView.module.scss'

const COLUMNS = [
  { key: 'TODO', label: 'À faire' },
  { key: 'IN_PROGRESS', label: 'En cours' },
  { key: 'DONE', label: 'Terminées' },
]

export default function TaskKanbanView({ tasks }) {
  return (
    <div className={styles.board}>
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div key={col.key} className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnTitle}>{col.label}</span>
              <span className={styles.columnCount}>{colTasks.length}</span>
            </div>
            <div className={styles.columnTasks}>
              {colTasks.length === 0 ? (
                <p className={styles.empty}>Aucune tâche</p>
              ) : (
                colTasks.map((task) => <TaskCard key={task.id} task={task} variant="kanban" />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}