import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import logo from '@/assets/logo.svg'
import { iconDashboard, iconDashboardOrange, iconProjects, iconProjectsWhite } from '@/assets/icons'
import styles from './Navbar.module.scss'

export default function Navbar({ user }) {
  const router = useRouter()
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <nav className={styles.navbar}>
      <Image src={logo} alt="Abricot" width={147} height={19} className={styles.logo} />
      <div className={styles.nav}>
        <Link
          href="/dashboard"
          className={`${styles.navItem} ${router.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <Image
            src={router.pathname === '/dashboard' ? iconDashboard : iconDashboardOrange}
            alt=""
            width={24}
            height={24}
          />
          Tableau de bord
        </Link>
        <Link
          href="/projects"
          className={`${styles.navItem} ${router.pathname.startsWith('/projects') ? styles.active : ''}`}
        >
          <Image
            src={router.pathname.startsWith('/projects') ? iconProjectsWhite : iconProjects}
            alt=""
            width={29}
            height={22}
          />
          Projets
        </Link>
      </div>
      <div className={styles.userIcon}>{initials}</div>
    </nav>
  )
}