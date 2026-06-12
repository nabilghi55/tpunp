import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContainer} container`}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <span className={styles.logoGold}>IKATP</span>
            <span className={styles.logoWhite}>-FT UNP</span>
          </div>
          <p className={styles.brandText}>
            Wadah kolaborasi, komunikasi, dan kontribusi seluruh alumni Teknik Pertambangan Universitas Negeri Padang di manapun berada.
          </p>
        </div>
        
        <div className={styles.footerLinks}>
          <h4>Tautan Penting</h4>
          <ul>
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/about">Profil Organisasi</Link></li>
            <li><Link href="/alumni">Direktori Alumni</Link></li>
            <li><Link href="/jobs">Lowongan Karir</Link></li>
            <li><Link href="/contact">Hubungi Kami</Link></li>
          </ul>
        </div>

        <div className={styles.footerContact}>
          <h4>Sekretariat IKATP-FT UNP</h4>
          <p>Jurusan Teknik Pertambangan FT UNP</p>
          <p>Jl. Prof. Dr. Hamka, Air Tawar, Kec. Padang Utara</p>
          <p>Kota Padang, Sumatera Barat 25131</p>
          <p className={styles.contactEmail}>Email: info@ikatmunp.org</p>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Ikatan Alumni Teknik Pertambangan FT UNP (IKATP-FT UNP). All Rights Reserved.</p>
      </div>
    </footer>
  );
}
