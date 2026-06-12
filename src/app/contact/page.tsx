import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import styles from './page.module.css';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.header}>
          <div className="container">
            <span className={styles.badge}>Hubungi Kami</span>
            <h1 className="gold-gradient-text gold-glow">KONTAK SEKRETARIAT</h1>
            <p className={styles.subtitle}>
              Punya pertanyaan seputar organisasi, pendaftaran alumni, atau kerja sama? Hubungi kami.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.contactGrid}>
              {/* Contact Info Box */}
              <div className={`glass-panel ${styles.infoPanel}`}>
                <h3 className={styles.panelTitle}>Informasi Kontak</h3>
                <p className={styles.panelDesc}>
                  Silakan berkunjung langsung ke Sekretariat atau hubungi kami melalui media elektronik berikut:
                </p>
                
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <div className={styles.infoItemText}>
                      <h5>Alamat Sekretariat</h5>
                      <p>Jurusan Teknik Pertambangan FT UNP</p>
                      <p>Jl. Prof. Dr. Hamka, Air Tawar, Kec. Padang Utara, Kota Padang, Sumatera Barat 25131</p>
                    </div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📧</span>
                    <div className={styles.infoItemText}>
                      <h5>Alamat Email</h5>
                      <p>info@ikatpftunp.org</p>
                      <p>humas.ikatpftunp@gmail.com</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📞</span>
                    <div className={styles.infoItemText}>
                      <h5>Telepon / WhatsApp</h5>
                      <p>+62 812-3456-7890 (Humas IKATP)</p>
                      <p>+62 852-7788-9900 (Aditya - Sekjen)</p>
                    </div>
                  </div>
                </div>

                {/* Social media connections */}
                <div className={styles.socialBox}>
                  <h5>Ikuti Media Sosial Kami:</h5>
                  <div className={styles.socialIcons}>
                    <span className={styles.socialIcon}>🌐 Instagram: @ikatp_ftunp</span>
                    <span className={styles.socialIcon}>🌐 Facebook: IKATP-FT UNP</span>
                  </div>
                </div>
              </div>

              {/* Contact Form Panel */}
              <div className={`glass-panel ${styles.formPanel}`}>
                <h3 className={styles.panelTitle}>Kirim Pesan</h3>
                <p className={styles.panelDesc}>
                  Isi formulir di bawah ini untuk mengirim pesan langsung kepada Pengurus IKATP-FT UNP.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
