import { useRouter } from 'next/router'
import Image from 'next/image'
import { iconTeam } from '@/assets/icons'
import styles from './ProjectCard.module.scss'

export default function ProjectCard({ project }) {
    const router = useRouter()

    const totalTasks = project._count?.tasks || 0
    const doneTasks = project.tasks?.filter((t) => t.status === 'DONE').length || 0
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    const owner = project.owner
    const others = project.members || []

    const getInitials = (name) =>
        name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'

    return (
        <div className={styles.card} onClick={() => router.push(`/projects/${project.id}`)}>
            <div className={styles.top}>
                <p className={styles.name}>{project.name}</p>
                <p className={styles.description}>{project.description}</p>
            </div>

            <div className={styles.bottom}>
                <div className={styles.progress}>
                    <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>Progression</span>
                        <span className={styles.progressValue}>{progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <p className={styles.progressTasks}>
                        {doneTasks}/{totalTasks} tâches terminées
                    </p>
                </div>

                <div className={styles.team}>
                    <span className={styles.teamLabel}>
                        <Image src={iconTeam} alt="" width={12} height={11} />
                        Équipe ({others.length + 1})
                    </span>
                    <div className={styles.contributors}>
                        {owner && (
                            <>
                                <div className={styles.avatar}>
                                    {getInitials(owner.name)}
                                </div>
                                <span className={styles.ownerTag}>Propriétaire</span>
                            </>
                        )}
                        {others.slice(0, 2).map((m) => (
                            <div key={m.userId} className={`${styles.avatar} ${styles.other}`}>
                                {getInitials(m.user?.name)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}