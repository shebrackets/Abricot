import Image from 'next/image'
import { useRouter } from 'next/router'
import { iconFolder, iconCalendar, iconComment } from '@/assets/icons'
import styles from './TaskCard.module.scss'

const STATUS_LABELS = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminée',
}

const STATUS_CLASSES = {
  TODO: styles.todo,
  IN_PROGRESS: styles.inProgress,
  DONE: styles.done,
}

export default function TaskCard({ task, variant = 'list' }) {
  const router = useRouter()
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : null

  if (variant === 'kanban') {
    return (
      <div className={styles.kanbanCard}>
        <div className={styles.kanbanTop}>
          <p className={styles.title}>{task.title}</p>
          <span className={`${styles.tag} ${STATUS_CLASSES[task.status] || styles.todo}`}>
            {STATUS_LABELS[task.status] || 'À faire'}
          </span>
        </div>
        <p className={styles.description}>{task.description}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Image src={iconFolder} alt="" width={18} height={14} />
            {task.project?.name || 'Projet'}
          </span>
          {dueDate && (
            <>
              <span className={styles.separator}>|</span>
              <span className={styles.metaItem}>
                <Image src={iconCalendar} alt="" width={15} height={17} />
                {dueDate}
              </span>
            </>
          )}
          <span className={styles.separator}>|</span>
          <span className={styles.metaItem}>
            <Image src={iconComment} alt="" width={15} height={15} />
            {task.comments?.length || task._count?.comments || 0}
          </span>
        </div>
        <button
          className={styles.btn}
          onClick={() => router.push(`/projects/${task.projectId}`)}
        >
          Voir
        </button>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.info}>
          <p className={styles.title}>{task.title}</p>
          <p className={styles.description}>{task.description}</p>
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Image src={iconFolder} alt="" width={18} height={14} />
            {task.project?.name || 'Projet'}
          </span>
          {dueDate && (
            <>
              <span className={styles.separator}>|</span>
              <span className={styles.metaItem}>
                <Image src={iconCalendar} alt="" width={15} height={17} />
                {dueDate}
              </span>
            </>
          )}
          <span className={styles.separator}>|</span>
          <span className={styles.metaItem}>
            <Image src={iconComment} alt="" width={15} height={15} />
            {task.comments?.length || task._count?.comments || 0}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <span className={`${styles.tag} ${STATUS_CLASSES[task.status] || styles.todo}`}>
          {STATUS_LABELS[task.status] || 'À faire'}
        </span>
        <button
          className={styles.btn}
          onClick={() => router.push(`/projects/${task.projectId}`)}
        >
          Voir
        </button>
      </div>
    </div>
  )
}