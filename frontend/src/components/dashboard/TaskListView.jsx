import Image from 'next/image'
import TaskCard from '@/components/ui/TaskCard'
import { iconSearch } from '@/assets/icons'
import styles from './TaskListView.module.scss'

export default function TaskListView({ tasks, search, onSearch }) {
  const filteredTasks = tasks.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelTitle}>Mes tâches assignées</p>
          <p className={styles.panelSubtitle}>Par ordre de priorité</p>
        </div>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Rechercher une tâche"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Image src={iconSearch} alt="" width={14} height={14} />
        </div>
      </div>

      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <p className={styles.empty}>Aucune tâche assignée</p>
        ) : (
          filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}