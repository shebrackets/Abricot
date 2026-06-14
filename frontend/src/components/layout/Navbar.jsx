import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useRef, useState } from 'react'
import logo from '@/assets/logo.svg'
import { iconDashboard, iconDashboardOrange, iconProjects, iconProjectsWhite } from '@/assets/icons'
import { getInitials } from '@/utils/helpers'
import { removeToken } from '@/services/api'
import useClickOutside from '@/hooks/useClickOutside'
import styles from './Navbar.module.scss'

export default function Navbar({ user }) {
  const router = useRouter()
  const initials = getInitials(user?.name) || 'U'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useClickOutside(menuRef, () => setMenuOpen(false))

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

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

      <div className={styles.userMenu} ref={menuRef}>
        <button
          className={styles.userIcon}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={`Menu compte - ${user?.name}`}
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          {initials}
        </button>

        {menuOpen && (
          <div className={styles.dropdown} role="menu">
            <Link
              href="/account"
              className={styles.dropdownItem}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              Mon compte
            </Link>
            <button
              className={styles.dropdownItem}
              role="menuitem"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  )
}