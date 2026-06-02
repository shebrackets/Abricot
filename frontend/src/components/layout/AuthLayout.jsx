import Image from 'next/image'
import logo from '@/assets/logo.svg'
import styles from './AuthLayout.module.scss'

export default function AuthLayout({ children, bgImage, footer }) {
  return (
    <div
      className={styles.page}
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.left}>
        <Image className={styles.logo} src={logo} alt="Abricot" width={180} height={33} />
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          {footer}
        </div>
      </div>
    </div>
  )
}