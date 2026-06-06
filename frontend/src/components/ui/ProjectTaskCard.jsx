import { useState } from 'react'
import Image from 'next/image'
import { iconMore, iconCalendar, iconChevronDown } from '@/assets/icons'
import styles from './ProjectTaskCard.module.scss'

const STATUS_LABELS = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminée',
  CANCELLED: 'Annulée',
}

const STATUS_CLASSES = {
  TODO: styles.todo,
  IN_PROGRESS: styles.inProgress,
  DONE: styles.done,
  CANCELLED: styles.todo,
}

export default function ProjectTaskCard({ task, onEdit }) {
  const [commentsOpen, setCommentsOpen] = useState(false)

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : null

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <div className={styles.titleRow}>
            <p className={styles.title}>{task.title}</p>
            <span className={`${styles.tag} ${STATUS_CLASSES[task.status] || styles.todo}`}>
              {STATUS_LABELS[task.status] || 'À faire'}
            </span>
          </div>
          <p className={styles.description}>{task.description}</p>
        </div>
        <button className={styles.moreBtn} onClick={() => onEdit?.(task)}>
          <Image src={iconMore} alt="Plus" width={15} height={4} />
        </button>
      </div>

      {dueDate && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Échéance :</span>
          <span className={styles.metaDate}>
            <Image src={iconCalendar} alt="" width={15} height={17} />
            {dueDate}
          </span>
        </div>
      )}

      {task.assignees?.length > 0 && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Assigné à :</span>
          <div className={styles.assignees}>
            {task.assignees.map((a, index) => (
              <div key={a.userId || a.id || index} className={styles.assigneeItem}>
                <div className={styles.avatar}>{getInitials(a.user?.name)}</div>
                <span className={styles.assigneeName}>{a.user?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.divider} />

      <button
        className={styles.comments}
        onClick={() => setCommentsOpen(!commentsOpen)}
      >
        <span className={styles.commentsLabel}>
          Commentaires ({task.comments?.length || task._count?.comments || 0})
        </span>
        <Image
          src={iconChevronDown}
          alt=""
          width={16}
          height={8}
          className={`${styles.chevron} ${commentsOpen ? styles.open : ''}`}
        />
      </button>

      {commentsOpen && task.comments?.length > 0 && (
        <div className={styles.commentsList}>
          {task.comments.map((c, index) => (
            <div key={c.id || index} className={styles.comment}>
              <p className={styles.commentAuthor}>{c.author?.name}</p>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}