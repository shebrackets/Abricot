import Link from 'next/link'
import Image from 'next/image'
import { iconFolder, iconCalendar, iconComment } from '@/assets/icons'
import { formatDate, STATUS_LABELS } from '@/utils/helpers'
import styles from './TaskCard.module.scss'

const STATUS_CLASSES = {
  TODO: styles.todo,
  IN_PROGRESS: styles.inProgress,
  DONE: styles.done,
}

const TaskMeta = ({ task, dueDate }) => (
  <div className={styles.meta}>
    <span className={styles.metaItem}>
      <Image src={iconFolder} alt="Projet" width={18} height={14} />
      {task.project?.name || 'Projet'}
    </span>
    {dueDate && (
      <>
        <span className={styles.separator} aria-hidden="true">|</span>
        <span className={styles.metaItem}>
          <Image src={iconCalendar} alt="Échéance" width={15} height={17} />
          <time dateTime={task.dueDate}>{dueDate}</time>
        </span>
      </>
    )}
    <span className={styles.separator} aria-hidden="true">|</span>
    <span className={styles.metaItem}>
      <Image src={iconComment} alt="Commentaires" width={15} height={15} />
      {task.comments?.length || task._count?.comments || 0}
    </span>
  </div>
)

export default function TaskCard({ task, variant = 'list' }) {
  const dueDate = formatDate(task.dueDate)
  const statusLabel = STATUS_LABELS[task.status] || 'À faire'
  const statusClass = STATUS_CLASSES[task.status] || styles.todo

  if (variant === 'kanban') {
    return (
      <article className={styles.kanbanCard}>
        <div className={styles.kanbanTop}>
          <h3 className={styles.title}>{task.title}</h3>
          <span className={`${styles.tag} ${statusClass}`}>{statusLabel}</span>
        </div>
        <p className={styles.description}>{task.description}</p>
        <TaskMeta task={task} dueDate={dueDate} />
        <Link href={`/projects/${task.projectId}`} className={styles.btn}>
          Voir
        </Link>
      </article>
    )
  }

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <div className={styles.info}>
          <h3 className={styles.title}>{task.title}</h3>
          <p className={styles.description}>{task.description}</p>
        </div>
        <TaskMeta task={task} dueDate={dueDate} />
      </div>
      <div className={styles.right}>
        <span className={`${styles.tag} ${statusClass}`}>{statusLabel}</span>
        <Link href={`/projects/${task.projectId}`} className={styles.btn}>
          Voir
        </Link>
      </div>
    </article>
  )
}