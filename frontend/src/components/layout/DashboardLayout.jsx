import Navbar from './Navbar'
import Footer from './Footer'
import styles from './DashboardLayout.module.scss'

export default function DashboardLayout({ children, user }) {
  return (
    <div className={styles.page}>
      <Navbar user={user} />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}