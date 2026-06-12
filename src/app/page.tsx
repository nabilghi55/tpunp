import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

export const revalidate = 0; // Fresh data on every request

export default async function Home() {
  // Fetch recent announcements & jobs directly from DB on server
  const announcements = await prisma.announcement.findMany({
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

  const jobs = await prisma.jobListing.findMany({
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={`${styles.heroContainer} container`}>
            <div className={styles.heroContent}>
              <span className={styles.badge}>Ikatan Keluarga Alumni</span>
              <h1 className="gold-gradient-text gold-glow">
                TEKNIK PERTAMBANGAN <br />
                UNIVERSITAS NEGERI PADANG
              </h1>
              <p className={styles.heroSubtitle}>
                Wadah pemersatu, kolaborasi, dan kemajuan karir bagi alumni Teknik Pertambangan UNP. Bersama membangun kontribusi nyata untuk dunia industri pertambangan Indonesia.
              </p>
              <div className={styles.heroActions}>
                <Link href="/register" className={styles.primaryBtn}>
                  Bergabung Sekarang
                </Link>
                <Link href="/about" className={styles.secondaryBtn}>
                  Tentang Organisasi
                </Link>
              </div>
            </div>
            
            <div className={styles.heroStats}>
              <div className={`glass-panel ${styles.statCard}`}>
                <h3 className={styles.statNumber}>1,200+</h3>
                <p className={styles.statLabel}>Alumni Terdaftar</p>
              </div>
              <div className={`glass-panel ${styles.statCard}`}>
                <h3 className={styles.statNumber}>45+</h3>
                <p className={styles.statLabel}>Mitra Perusahaan</p>
              </div>
              <div className={`glass-panel ${styles.statCard}`}>
                <h3 className={styles.statNumber}>20+</h3>
                <p className={styles.statLabel}>Tahun Pengabdian</p>
              </div>
            </div>
          </div>
        </section>

        {/* Info & Vision */}
        <section className={styles.infoSection}>
          <div className="container">
            <div className={`glass-panel ${styles.infoCard}`}>
              <div className={styles.infoGrid}>
                <div className={styles.infoCol}>
                  <h2 className={styles.sectionTitle}>
                    Menghubungkan Profesional & Mitra Industri
                  </h2>
                  <p className={styles.infoText}>
                    IKATP-FT UNP dibentuk untuk merajut silaturahmi yang erat di antara alumni lintas generasi, mendukung pengembangan kompetensi profesional, serta menjembatani karir bagi para lulusan baru di industri energi dan mineral.
                  </p>
                </div>
                <div className={styles.infoCol}>
                  <div className={styles.visionBox}>
                    <h4>Misi Utama Kami:</h4>
                    <ul>
                      <li>Memperkuat jaringan alumni di sektor global.</li>
                      <li>Berbagi info peluang kerja, proyek, dan beasiswa pertambangan.</li>
                      <li>Sinergi riset praktis antara akademisi kampus dan praktisi site.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements/News Section */}
        <section className={styles.newsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className="gold-gradient-text">Pengumuman & Kegiatan Terbaru</h2>
              <Link href="/about#kegiatan" className={styles.viewMoreLink}>Lihat Semua →</Link>
            </div>
            
            <div className={styles.cardsGrid}>
              {announcements.map((item) => (
                <div key={item.id} className={`glass-panel ${styles.newsCard}`}>
                  {item.coverImage && (
                    <div className={styles.cardImageWrapper}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className={styles.cardImage} 
                      />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <span className={styles.cardDate}>
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>{item.content.substring(0, 140)}...</p>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className={styles.emptyText}>Belum ada pengumuman terbaru.</p>
              )}
            </div>
          </div>
        </section>

        {/* Quick Job Teaser */}
        <section className={styles.jobTeaser}>
          <div className="container">
            <div className={`glass-panel ${styles.jobTeaserCard}`}>
              <div className={styles.sectionHeader}>
                <h2 className="gold-gradient-text">Peluang Karir Terbaru</h2>
                <Link href="/jobs" className={styles.viewMoreLink}>Buka Bursa Kerja →</Link>
              </div>
              
              <div className={styles.jobsList}>
                {jobs.map((job) => (
                  <div key={job.id} className={styles.jobRow}>
                    <div className={styles.jobInfo}>
                      <h4>{job.title}</h4>
                      <p>{job.company} &bull; {job.location}</p>
                    </div>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobTypeBadge}>
                        {job.type === 'FULL_TIME' ? 'Penuh Waktu' : 'Kontrak / Proyek'}
                      </span>
                      <Link href="/jobs" className={styles.jobApplyBtn}>Detail</Link>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <p className={styles.emptyText}>Belum ada lowongan terdaftar.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h2 className="gold-gradient-text gold-glow">Sudah Lulus Teknik Pertambangan UNP?</h2>
              <p>Segera daftarkan diri Anda di Direktori IKATP-FT UNP untuk mendapatkan Kartu Alumni Digital resmi dan akses penuh ke bursa karir eksklusif.</p>
              <div className={styles.ctaActions}>
                <Link href="/register" className={styles.primaryBtn}>Registrasi Alumni</Link>
                <Link href="/login" className={styles.secondaryBtn}>Masuk Portal</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
