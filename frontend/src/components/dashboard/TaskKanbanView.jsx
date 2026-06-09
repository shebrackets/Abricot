import TaskCard from '@/components/ui/TaskCard'
import styles from './TaskKanbanView.module.scss'

const COLUMNS = [
  { key: 'TODO', label: 'À faire' },
  { key: 'IN_PROGRESS', label: 'En cours' },
  { key: 'DONE', label: 'Terminées' },
]

export default function TaskKanbanView({ tasks }) {
  return (
    <section className={styles.board} aria-label="Vue Kanban">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <section
            key={col.key}
            className={styles.column}
            aria-label={col.label}
          >
            <header className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>{col.label}</h2>
              <span
                className={styles.columnCount}
                aria-label={`${colTasks.length} tâche${colTasks.length > 1 ? 's' : ''}`}
              >
                {colTasks.length}
              </span>
            </header>
            {colTasks.length === 0 ? (
              <p className={styles.empty}>Aucune tâche</p>
            ) : (
              <ul className={styles.columnTasks} role="list">
                {colTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} variant="kanban" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </section>
  )
}