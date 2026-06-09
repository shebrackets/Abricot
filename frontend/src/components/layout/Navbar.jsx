import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import logo from '@/assets/logo.svg'
import { iconDashboard, iconDashboardOrange, iconProjects, iconProjectsWhite } from '@/assets/icons'
import { getInitials } from '@/utils/helpers'
import styles from './Navbar.module.scss'

export default function Navbar({ user }) {
  const router = useRouter()
  const initials = getInitials(user?.name) || 'U'

  return (
    <header className={styles.navbar}>
      <Link href="/dashboard">
        <Image src={logo} alt="Abricot - Accueil" width={147} height={19} className={styles.logo} />
      </Link>

      <nav className={styles.nav} aria-label="Navigation principale">
        <Link
          href="/dashboard"
          className={`${styles.navItem} ${router.pathname === '/dashboard' ? styles.active : ''}`}
          aria-current={router.pathname === '/dashboard' ? 'page' : undefined}
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
          aria-current={router.pathname.startsWith('/projects') ? 'page' : undefined}
        >
          <Image
            src={router.pathname.startsWith('/projects') ? iconProjectsWhite : iconProjects}
            alt=""
            width={29}
            height={22}
          />
          Projets
        </Link>
      </nav>

      <Link href="/account" className={styles.userIcon} aria-label={`Mon compte - ${user?.name}`}>
        {initials}
      </Link>
    </header>
  )
}