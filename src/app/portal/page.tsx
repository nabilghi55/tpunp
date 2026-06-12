import { cookies } from 'next/headers';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import styles from './page.module.css';

export const revalidate = 0;

export default async function PortalLandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  let user = null;
  let isApproved = false;

  if (token) {
    try {
      user = await verifyToken(token);
      if (user && user.status === 'APPROVED') {
        isApproved = true;
      }
    } catch (e) {
      // session invalid or expired
    }
  }

  // Fetch some metrics to display on the portal gate
  const totalAlumni = await prisma.user.count({ where: { role: 'ALUMNI', status: 'APPROVED' } });
  const totalJobs = await prisma.jobListing.count();
  const totalAnnouncements = await prisma.announcement.count();

  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        <section className={styles.portalHero}>
          <div className={`${styles.heroContainer} container`}>
            <span className={styles.badge}>Gateway System</span>
            <h1 className="gold-gradient-text gold-glow">PORTAL ALUMNI IKATP-FT UNP</h1>
            <p className={styles.subtitle}>
              Pusat pelayanan digital terpadu bagi seluruh alumni Teknik Pertambangan FT UNP. 
              Tempat berkumpulnya database alumni, penerbitan Kartu Anggota Digital, dan bursa karir terintegrasi.
            </p>

            {/* Check current user state and display relevant action */}
            {user ? (
              <div className={`glass-panel ${styles.welcomeBackCard}`}>
                <h3>Selamat Datang Kembali, <span className={styles.userName}>{user.name}</span>!</h3>
                <p>Status Akun Anda: <b>{user.status === 'APPROVED' ? '🟢 TERVERIFIKASI' : '⏳ MENUNGGU VERIFIKASI'}</b></p>
                <div className={styles.welcomeActions}>
                  <Link 
                    href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} 
                    className={styles.primaryBtn}
                  >
                    Masuk ke Dashboard Anda →
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.portalActionsGrid}>
                {/* Panel 1: Login */}
                <div className={`glass-panel ${styles.actionCard}`}>
                  <div className={styles.cardIcon}>🔑</div>
                  <h3>Masuk Portal</h3>
                  <p>Sudah memiliki akun terverifikasi? Masuk untuk mengedit data diri, memposting bursa kerja, dan mengunduh Kartu Alumni.</p>
                  <Link href="/login" className={styles.primaryBtn}>
                    Masuk Sekarang
                  </Link>
                </div>

                {/* Panel 2: Register */}
                <div className={`glass-panel ${styles.actionCard}`}>
                  <div className={styles.cardIcon}>✍️</div>
                  <h3>Registrasi Alumni</h3>
                  <p>Baru pertama kali masuk? Daftarkan data kelulusan (NIM & Angkatan) Anda terlebih dahulu untuk diverifikasi admin.</p>
                  <Link href="/register" className={styles.secondaryBtn}>
                    Daftar Anggota
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Portal Features Grid */}
        <section className={styles.featuresSection}>
          <div className="container">
            <h3 className={styles.sectionTitle}>Fasilitas Layanan Portal</h3>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🪪</span>
                <h4>Kartu Alumni Digital</h4>
                <p>Mendapatkan kartu tanda anggota elektronik resmi lengkap dengan QR code validasi langsung dari jurusan.</p>
              </div>

              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>📁</span>
                <h4>Direktori Terenkripsi</h4>
                <p>Akses data kontak dan jejaring profesional sesama rekan alumni lintas angkatan yang terdaftar secara aman.</p>
              </div>

              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>💼</span>
                <h4>Bursa Karir Tambang</h4>
                <p>Bagikan dan lamar lowongan pekerjaan khusus site tambang atau industri sipil/geologi dari jaringan internal alumni.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portal Stats Summary */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={`glass-panel ${styles.statsPanel}`}>
              <div className={styles.statsGrid}>
                <div className={styles.statCol}>
                  <h3>{totalAlumni}+</h3>
                  <p>Alumni Terverifikasi</p>
                </div>
                <div className={styles.statCol}>
                  <h3>{totalJobs}</h3>
                  <p>Lowongan Pekerjaan Aktif</p>
                </div>
                <div className={styles.statCol}>
                  <h3>{totalAnnouncements}</h3>
                  <p>Pengumuman Jurusan</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
