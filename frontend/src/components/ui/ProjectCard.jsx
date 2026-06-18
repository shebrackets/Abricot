import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { iconTeam } from '@/assets/icons'
import { getInitials } from '@/utils/helpers'
import { API_URL, getToken } from '@/services/api'
import styles from './ProjectCard.module.scss'

export default function ProjectCard({ project }) {
  const [doneTasks, setDoneTasks] = useState(0)
  const totalTasks = project._count?.tasks || 0

  useEffect(() => {
    const fetchDoneTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects/${project.id}/tasks`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (res.ok) {
          const data = await res.json()
          const done = (data.data.tasks || []).filter((t) => t.status === 'DONE').length
          setDoneTasks(done)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDoneTasks()
  }, [project.id])

  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
  const owner = project.owner
  const others = project.members || []

  return (
    <article className={styles.card}>
      <Link href={`/projects/${project.id}`} className={styles.cardLink} aria-label={`Voir le projet ${project.name}`}>
        <div className={styles.top}>
          <h2 className={styles.name}>{project.name}</h2>
          <p className={styles.description}>{project.description}</p>
        </div>

        <div className={styles.bottom}>
          <div className={styles.progress}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Progression</span>
              <span className={styles.progressValue}>{progress}%</span>
            </div>
            <div
              className={styles.progressBar}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression : ${progress}%`}
            >
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.progressTasks}>
              {doneTasks}/{totalTasks} tâches terminées
            </p>
          </div>

          <div className={styles.team}>
            <span className={styles.teamLabel}>
              <Image src={iconTeam} alt="" width={12} height={11} aria-hidden="true" />
              Équipe ({others.length + 1})
            </span>
            <div className={styles.contributors} role="list" aria-label="Membres de l'équipe">
              {owner && (
                <div role="listitem" className={styles.contributorItem}>
                  <div className={styles.avatar}>{getInitials(owner.name)}</div>
                  <span className={styles.ownerTag}>Propriétaire</span>
                </div>
              )}
              {others.slice(0, 2).map((m) => (
                <div key={m.userId} role="listitem" className={`${styles.avatar} ${styles.other}`}>
                  {getInitials(m.user?.name)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}