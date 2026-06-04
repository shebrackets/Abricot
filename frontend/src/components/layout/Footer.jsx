import Image from 'next/image'
import logoBlack from '@/assets/logo-black.svg'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image src={logoBlack} alt="Abricot" width={101} height={13} className={styles.logo} />
      <span className={styles.copy}>Abricot 2025</span>
    </footer>
  )
}