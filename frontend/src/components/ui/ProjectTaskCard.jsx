import { useState, useRef } from 'react'
import Image from 'next/image'
import { iconMore, iconCalendar, iconChevronDown, iconTrash, iconEdit } from '@/assets/icons'
import CommentSection from './CommentSection'
import useClickOutside from '@/hooks/useClickOutside'
import { getInitials, formatDate, STATUS_LABELS } from '@/utils/helpers'
import styles from './ProjectTaskCard.module.scss'

const STATUS_CLASSES = {
  TODO: styles.todo,
  IN_PROGRESS: styles.inProgress,
  DONE: styles.done,
  CANCELLED: styles.todo,
}

export default function ProjectTaskCard({ task, onEdit, onDelete, user }) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useClickOutside(menuRef, () => setMenuOpen(false))

  const dueDate = formatDate(task.dueDate)
  const statusLabel = STATUS_LABELS[task.status] || 'À faire'
  const statusClass = STATUS_CLASSES[task.status] || styles.todo

  const handleCommentAdded = (newComment) => {
    task.comments = [...(task.comments || []), newComment]
  }

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{task.title}</h3>
            <span className={`${styles.tag} ${statusClass}`}>{statusLabel}</span>
          </div>
          <p className={styles.description}>{task.description}</p>
        </div>

        <div className={styles.moreWrapper} ref={menuRef}>
          <button
            className={styles.moreBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Options de la tâche"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Image src={iconMore} alt="" width={15} height={4} aria-hidden="true" />
          </button>
          {menuOpen && (
            <div className={styles.moreDropdown} role="menu">
              <p className={styles.moreDropdownTitle}>{task.title}</p>
              <p className={styles.moreDropdownDesc}>{task.description}</p>
              <div className={styles.moreDropdownDivider} aria-hidden="true" />
              <div className={styles.moreDropdownActions}>
                <button
                  className={`${styles.moreOption} ${styles.moreOptionDanger}`}
                  onClick={() => { setMenuOpen(false); onDelete?.(task) }}
                  role="menuitem"
                >
                  <Image src={iconTrash} alt="" width={14} height={16} aria-hidden="true" />
                  Supprimer
                </button>
                <span className={styles.moreDropdownSeparator} aria-hidden="true">|</span>
                <button
                  className={styles.moreOption}
                  onClick={() => { setMenuOpen(false); onEdit?.(task) }}
                  role="menuitem"
                >
                  <Image src={iconEdit} alt="" width={14} height={14} aria-hidden="true" />
                  Modifier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {dueDate && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Échéance :</span>
          <span className={styles.metaDate}>
            <Image src={iconCalendar} alt="" width={15} height={17} aria-hidden="true" />
            <time dateTime={task.dueDate}>{dueDate}</time>
          </span>
        </div>
      )}

      {task.assignees?.length > 0 && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Assigné à :</span>
          <ul className={styles.assignees} role="list">
            {task.assignees.map((a, index) => (
              <li key={a.userId || a.id || index} className={styles.assigneeItem}>
                <div className={styles.avatar} aria-hidden="true">
                  {getInitials(a.user?.name)}
                </div>
                <span className={styles.assigneeName}>{a.user?.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className={styles.divider} aria-hidden="true" />

      <button
        className={styles.comments}
        onClick={() => setCommentsOpen(!commentsOpen)}
        aria-expanded={commentsOpen}
      >
        <span className={styles.commentsLabel}>
          Commentaires ({task.comments?.length || 0})
        </span>
        <Image
          src={iconChevronDown}
          alt=""
          width={16}
          height={8}
          className={`${styles.chevron} ${commentsOpen ? styles.open : ''}`}
          aria-hidden="true"
        />
      </button>

      {commentsOpen && (
        <CommentSection
          task={task}
          user={user}
          projectId={task.projectId}
          onUpdate={handleCommentAdded}
        />
      )}
    </article>
  )
}