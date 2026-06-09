import { useState } from 'react'
import { API_URL, getToken } from '@/services/api'
import { getInitials, formatDateTime } from '@/utils/helpers'
import styles from './CommentSection.module.scss'

export default function CommentSection({ task, user, projectId, onUpdate }) {
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setLoading(true)
        try {
            const res = await fetch(
                `${API_URL}/api/projects/${projectId}/tasks/${task.id}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ content: newComment }),
                }
            )
            if (res.ok) {
                const data = await res.json()
                onUpdate(data.data.comment)
                setNewComment('')
                setIsEditing(false)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setNewComment('')
    }

    return (
        <section className={styles.section} aria-label="Commentaires">
            {task.comments?.length > 0 && (
                <ul className={styles.commentList} role="list">
                    {task.comments.map((c) => (
                        <li key={c.id} className={styles.comment}>
                            <div className={styles.avatar} aria-hidden="true">
                                {getInitials(c.author?.name)}
                            </div>
                            <div className={styles.bubble}>
                                <div className={styles.bubbleHeader}>
                                    <span className={styles.author}>{c.author?.name}</span>
                                    <time className={styles.date} dateTime={c.createdAt}>
                                        {formatDateTime(c.createdAt)}
                                    </time>
                                </div>
                                <p className={styles.content}>{c.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} className={styles.addComment} noValidate>
                <div
                    className={styles.userAvatar}
                    style={{ background: '#ffe8d9' }}
                    aria-hidden="true"
                >
                    {getInitials(user?.name)}
                </div>
                {isEditing ? (
                    <div className={styles.editBubble}>
                        <label htmlFor="comment-input" className="sr-only">
                            Ajouter un commentaire
                        </label>
                        <textarea
                            id="comment-input"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ajouter un commentaire..."
                            autoFocus
                            rows={3}
                        />
                        <div className={styles.editActions}>
                            <button
                                type="button"
                                className={styles.btnCancel}
                                onClick={handleCancel}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={styles.btnSubmit}
                                disabled={loading || !newComment.trim()}
                            >
                                {loading ? '...' : 'Commenter'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={styles.placeholder}
                        onClick={() => setIsEditing(true)}
                        aria-label="Ajouter un commentaire"
                    >
                        Ajouter un commentaire...
                    </button>
                )}
            </form>
        </section>
    )
}