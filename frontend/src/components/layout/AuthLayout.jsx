import Image from 'next/image'
import logo from '@/assets/logo.svg'
import styles from './AuthLayout.module.scss'

export default function AuthLayout({ children, bgImage, footer }) {
  return (
    <main className={styles.page}>
      <div className={styles.bgWrapper}>
        <Image
          src={bgImage}
          alt=""
          fill
          style={{ objectFit: 'cover' }}
          priority
          aria-hidden="true"
        />
      </div>

      <aside className={styles.left}>
        <Image
          className={styles.logo}
          src={logo}
          alt="Abricot"
          width={180}
          height={33}
          priority
        />
        <div className={styles.content}>
          {children}
        </div>
        {footer && (
          <footer className={styles.footer}>
            {footer}
          </footer>
        )}
      </aside>
    </main>
  )
}