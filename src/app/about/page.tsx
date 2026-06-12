import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function About() {
  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        {/* Header Section */}
        <section className={styles.header}>
          <div className="container">
            <span className={styles.badge}>Profil Organisasi</span>
            <h1 className="gold-gradient-text gold-glow">TENTANG IKATP-FT UNP</h1>
            <p className={styles.subtitle}>
              Mengenal lebih dekat Ikatan Keluarga Alumni Teknik Pertambangan Universitas Negeri Padang.
            </p>
          </div>
        </section>

        {/* History */}
        <section className={styles.section}>
          <div className="container">
            <div className={`glass-panel ${styles.panel}`}>
              <h2 className={styles.sectionTitle}>Sejarah Singkat Jurusan & IKATP</h2>
              <div className={styles.grid2Col}>
                <div className={styles.textCol}>
                  <p>
                    Program Studi Teknik Pertambangan Universitas Negeri Padang didirikan untuk memenuhi kebutuhan tenaga ahli profesional di bidang industri pertambangan mineral dan batubara di Indonesia. Seiring dengan berjalannya waktu dan bertambahnya lulusan, dirasa penting untuk membentuk sebuah wadah komunikasi resmi.
                  </p>
                  <p>
                    Ikatan Alumni Teknik Pertambangan Fakultas Teknik Universitas Negeri Padang (IKATP-FT UNP) resmi dideklarasikan sebagai organisasi resmi alumni. IKATP-FT UNP didirikan atas kesadaran bersama untuk menjalin kekeluargaan, saling bertukar informasi profesional, serta memberikan kontribusi balik (give back) bagi almamater tercinta.
                  </p>
                </div>
                <div className={styles.statsBox}>
                  <div className={styles.miniStat}>
                    <h3>2003</h3>
                    <p>Tahun Pendirian PS. Teknik Pertambangan UNP</p>
                  </div>
                  <div className={styles.miniStat}>
                    <h3>1,000+</h3>
                    <p>Total Alumni Tersebar di Seluruh Indonesia & Internasional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.grid2Col}>
              <div className={`glass-panel ${styles.panel}`}>
                <h3 className={styles.panelTitle}>Visi Organisasi</h3>
                <p className={styles.panelText}>
                  Menjadi ikatan alumni yang solid, profesional, mandiri, dan berdaya saing global, serta mampu memberikan sumbangsih nyata bagi kemajuan almamater, masyarakat, dan industri pertambangan nasional.
                </p>
              </div>
              
              <div className={`glass-panel ${styles.panel}`}>
                <h3 className={styles.panelTitle}>Misi Organisasi</h3>
                <ul className={styles.list}>
                  <li>Membangun silaturahmi yang berkelanjutan dan harmonis di antara seluruh alumni Teknik Pertambangan FT UNP.</li>
                  <li>Mengembangkan kapasitas profesional alumni melalui sharing session, pelatihan, dan kolaborasi bisnis/kerja.</li>
                  <li>Membantu memfasilitasi lulusan baru (fresh graduates) dalam penyerapan karir di industri tambang.</li>
                  <li>Mendukung kemajuan akademik dan non-akademik Jurusan Teknik Pertambangan UNP melalui beasiswa dan kerja sama.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Management Structure */}
        <section className={styles.section}>
          <div className="container">
            <div className={`glass-panel ${styles.panel}`}>
              <h2 className={styles.sectionTitle + ' text-center'}>Struktur Kepengurusan</h2>
              <p className={styles.structureSubtitle}>
                Berikut adalah struktur inti kepengurusan IKATP-FT UNP Periode 2024 - 2028:
              </p>
              
              <div className={styles.structureGrid}>
                <div className={styles.cardLeader}>
                  <div className={styles.leaderPhotoPlaceholder}>🪖</div>
                  <h4>Hendri Satria, S.T.</h4>
                  <p className={styles.roleLabel}>Ketua Umum (Angkatan 2004)</p>
                  <p className={styles.jobText}>Manager Operasi Tambang PT Bukit Asam Tbk</p>
                </div>
                
                <div className={styles.cardLeader}>
                  <div className={styles.leaderPhotoPlaceholder}>🪖</div>
                  <h4>Aditya Wibowo, S.T., M.T.</h4>
                  <p className={styles.roleLabel}>Sekretaris Jenderal (Angkatan 2007)</p>
                  <p className={styles.jobText}>Dosen Teknik Pertambangan UNP</p>
                </div>
                
                <div className={styles.cardLeader}>
                  <div className={styles.leaderPhotoPlaceholder}>🪖</div>
                  <h4>Yulia Fitri, S.T.</h4>
                  <p className={styles.roleLabel}>Bendahara Umum (Angkatan 2009)</p>
                  <p className={styles.jobText}>Senior Surveyor PT Vale Indonesia</p>
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
