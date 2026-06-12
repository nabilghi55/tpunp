import Link from 'next/link';
import { cookies } from 'next/headers';
import styles from './Navbar.module.css';
import { verifyToken } from '@/lib/auth';

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  let user = null;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (e) {
      // Token expired or invalid
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navContainer} container`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoGold}>IKATP</span>
          <span className={styles.logoWhite}>-FT UNP</span>
        </Link>
        
        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={styles.navLink}>Beranda</Link>
          </li>
          <li>
            <Link href="/about" className={styles.navLink}>Profil</Link>
          </li>
          <li>
            <Link href="/alumni" className={styles.navLink}>Alumni</Link>
          </li>
          <li>
            <Link href="/jobs" className={styles.navLink}>Karir</Link>
          </li>
          <li>
            <Link href="/contact" className={styles.navLink}>Kontak</Link>
          </li>
        </ul>
        
        <div className={styles.navAuth}>
          {user ? (
            <Link 
              href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} 
              className={styles.dashboardBtn}
            >
              Dashboard ({user.name.split(' ')[0]})
            </Link>
          ) : (
            <Link href="/portal" className={styles.registerBtn}>
              Portal Alumni →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
