import Image from 'next/image'
import TaskCard from '@/components/ui/TaskCard'
import { iconSearch } from '@/assets/icons'
import styles from './TaskListView.module.scss'

export default function TaskListView({ tasks, search, onSearch }) {
  const filteredTasks = tasks.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className={styles.panel} aria-label="Mes tâches assignées">
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Mes tâches assignées</h2>
          <p className={styles.panelSubtitle}>Par ordre de priorité</p>
        </div>
        <div className={styles.search} role="search">
          <label htmlFor="task-search" className="sr-only">Rechercher une tâche</label>
          <input
            id="task-search"
            type="search"
            placeholder="Rechercher une tâche"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Rechercher une tâche"
          />
          <Image src={iconSearch} alt="" width={14} height={14} aria-hidden="true" />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className={styles.empty}>Aucune tâche assignée</p>
      ) : (
        <ul className={styles.taskList} role="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} variant="list" />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}