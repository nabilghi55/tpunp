'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AlumniDashboard.module.css';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile: {
    id: string;
    nim: string;
    graduationYear: number;
    phone: string;
    currentCompany: string;
    jobTitle: string;
    location: string;
    linkedinUrl: string;
    bio: string;
    photo: string;
  } | null;
}

interface Props {
  user: UserProfile;
}

type TabType = 'profile' | 'post-job' | 'digital-card';

export default function AlumniDashboardClient({ user }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Edit Profile States
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.profile?.phone || '');
  const [currentCompany, setCurrentCompany] = useState(user.profile?.currentCompany || '');
  const [jobTitle, setJobTitle] = useState(user.profile?.jobTitle || '');
  const [location, setLocation] = useState(user.profile?.location || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.profile?.linkedinUrl || '');
  const [bio, setBio] = useState(user.profile?.bio || '');
  
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Post Job States
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [jobSalary, setJobSalary] = useState('');
  const [jobEmail, setJobEmail] = useState(user.email);
  
  const [jobMsg, setJobMsg] = useState('');
  const [jobError, setJobError] = useState('');
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Logout Handler
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Update Profile Submit
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    setIsUpdatingProfile(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          currentCompany,
          jobTitle,
          location,
          linkedinUrl,
          bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui profil');

      setProfileMsg('Profil berhasil diperbarui!');
      router.refresh();
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Post Job Submit
  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobMsg('');
    setJobError('');
    setIsPostingJob(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitleInput,
          company: jobCompany,
          description: jobDescription,
          location: jobLocation,
          type: jobType,
          salary: jobSalary,
          contactEmail: jobEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memposting lowongan kerja');

      setJobMsg('Lowongan kerja berhasil diposting!');
      setJobTitleInput('');
      setJobCompany('');
      setJobDescription('');
      setJobLocation('');
      setJobSalary('');
      router.refresh();
    } catch (err: any) {
      setJobError(err.message);
    } finally {
      setIsPostingJob(false);
    }
  };

  const isApproved = user.status === 'APPROVED';

  return (
    <div className={styles.dashboardGrid}>
      {/* Sidebar Panel */}
      <div className={`glass-panel ${styles.sidebar}`}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarLarge}>
            {user.name.charAt(0)}
          </div>
          <h3>{user.name}</h3>
          <p>NIM: {user.profile?.nim || '-'}</p>
          
          <div className={`${styles.statusBadge} ${isApproved ? styles.statusApproved : styles.statusPending}`}>
            {isApproved ? '🟢 Terverifikasi' : '⏳ Menunggu Verifikasi'}
          </div>
        </div>

        <ul className={styles.menuList}>
          <li 
            className={activeTab === 'profile' ? styles.menuItemActive : styles.menuItem}
            onClick={() => setActiveTab('profile')}
          >
            👤 Edit Profil
          </li>
          <li 
            className={activeTab === 'post-job' ? styles.menuItemActive : styles.menuItem}
            onClick={() => setActiveTab('post-job')}
          >
            💼 Bagikan Info Karir
          </li>
          <li 
            className={activeTab === 'digital-card' ? styles.menuItemActive : styles.menuItem}
            onClick={() => setActiveTab('digital-card')}
          >
            🪪 Kartu Alumni Digital
          </li>
        </ul>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Keluar Sesi
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`glass-panel ${styles.contentArea}`}>
        {/* Verification Pending Notice Banner */}
        {!isApproved && (
          <div className={styles.pendingBanner}>
            <h4>⚠️ Sesi Terbatas (Verifikasi Pending)</h4>
            <p>
              Akun Anda sedang dalam proses peninjauan oleh Admin Jurusan. 
              Beberapa fitur bursa kerja dan cetak Kartu Alumni Digital belum diaktifkan secara resmi sampai status Anda berubah menjadi <b>TERVERIFIKASI</b>.
            </p>
          </div>
        )}

        {/* Tab 1: Edit Profile */}
        {activeTab === 'profile' && (
          <div className={styles.tabContent}>
            <h3 className={styles.tabTitle}>Profil Akun Alumni</h3>
            <p className={styles.tabSubtitle}>Perbarui informasi karir dan kontak Anda agar tampil di direktori alumni.</p>

            {profileMsg && <div className={styles.successAlert}>✅ {profileMsg}</div>}
            {profileError && <div className={styles.errorAlert}>⚠️ {profileError}</div>}

            <form onSubmit={handleUpdateProfile} className={styles.form}>
              <div className={styles.formRow2Col}>
                <div className={styles.formGroup}>
                  <label>Nama Lengkap</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Nomor HP / WhatsApp</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow2Col}>
                <div className={styles.formGroup}>
                  <label>Perusahaan Sekarang</label>
                  <input type="text" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Jabatan Kerja</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow2Col}>
                <div className={styles.formGroup}>
                  <label>Kota Domisili</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>LinkedIn URL</label>
                  <input type="text" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/username" className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Bio Singkat</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={styles.textarea}></textarea>
              </div>

              <button type="submit" disabled={isUpdatingProfile} className={styles.saveBtn}>
                {isUpdatingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Post Job */}
        {activeTab === 'post-job' && (
          <div className={styles.tabContent}>
            <h3 className={styles.tabTitle}>Bagikan Peluang Karir</h3>
            <p className={styles.tabSubtitle}>Posting info lowongan pekerjaan site, office, atau magang mahasiswa di sini.</p>

            {jobMsg && <div className={styles.successAlert}>✅ {jobMsg}</div>}
            {jobError && <div className={styles.errorAlert}>⚠️ {jobError}</div>}

            <form onSubmit={handlePostJob} className={styles.form}>
              <div className={styles.formRow2Col}>
                <div className={styles.formGroup}>
                  <label>Posisi Pekerjaan *</label>
                  <input type="text" value={jobTitleInput} onChange={(e) => setJobTitleInput(e.target.value)} required disabled={!isApproved} placeholder="Contoh: Mine Plan Engineer" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Nama Perusahaan *</label>
                  <input type="text" value={jobCompany} onChange={(e) => setJobCompany(e.target.value)} required disabled={!isApproved} placeholder="Contoh: PT Bukit Asam Tbk" className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow2Col}>
                <div className={styles.formGroup}>
                  <label>Lokasi Kerja (Site/Kota) *</label>
                  <input type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} required disabled={!isApproved} placeholder="Contoh: Tanjung Enim / Remote" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Jenis Pekerjaan *</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)} required disabled={!isApproved} className={styles.select}>
                    <option value="FULL_TIME">Penuh Waktu (Full-time)</option>
                    <option value="PART_TIME">Paruh Waktu (Part-time)</option>
                    <option value="CONTRACT">Kontrak / Proyek</option>
                    <option value="INTERNSHIP">Magang (Internship)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow2Col}>
                <div className={styles.formGroup}>
                  <label>Kisaran Gaji (Opsional)</label>
                  <input type="text" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} disabled={!isApproved} placeholder="Contoh: Rp 8.000.000 - Rp 12.000.000" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Kontak Lamaran *</label>
                  <input type="email" value={jobEmail} onChange={(e) => setJobEmail(e.target.value)} required disabled={!isApproved} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Deskripsi Kebutuhan Pekerjaan *</label>
                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required disabled={!isApproved} rows={5} placeholder="Jelaskan kualifikasi kandidat dan tanggung jawab kerja secara detail..." className={styles.textarea}></textarea>
              </div>

              <button type="submit" disabled={isPostingJob || !isApproved} className={styles.saveBtn}>
                {isPostingJob ? 'Memposting...' : 'Publikasikan Lowongan Kerja'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Digital Alumni Card */}
        {activeTab === 'digital-card' && (
          <div className={styles.tabContent}>
            <h3 className={styles.tabTitle}>Kartu Alumni Digital Resmi</h3>
            <p className={styles.tabSubtitle}>Identitas digital Anda sebagai anggota resmi IKATP-FT UNP.</p>

            <div className={styles.cardPreviewSection}>
              {/* Premium CSS Alumni Card */}
              <div className={`${styles.alumniCard} ${!isApproved ? styles.alumniCardWatermarked : ''}`}>
                
                {/* Front Card layout */}
                <div className={styles.cardFront}>
                  {/* Card Glowing Accents */}
                  <div className={styles.cardGlow}></div>
                  
                  {/* Header info logo */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLogo}>
                      <span className={styles.logoGold}>IKATP</span>
                      <span className={styles.logoWhite}>-FT UNP</span>
                    </div>
                    <div className={styles.cardDeptName}>
                      TEKNIK PERTAMBANGAN UNP
                    </div>
                  </div>

                  {/* Body layout */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardProfilePhoto}>
                      <span>🪖</span>
                    </div>
                    
                    <div className={styles.cardProfileDetails}>
                      <div className={styles.cardName}>{user.name}</div>
                      <div className={styles.cardNim}>NIM: {user.profile?.nim || '-'}</div>
                      <div className={styles.cardAngkatan}>Angkatan: {user.profile?.graduationYear || '-'}</div>
                    </div>

                    <div className={styles.cardQr}>
                      {/* Styled CSS mockup of a QR code */}
                      <div className={styles.qrGrid}>
                        <div className={styles.qrCorner}></div>
                        <div className={styles.qrCorner}></div>
                        <div className={styles.qrCorner}></div>
                        <div className={styles.qrBlock}></div>
                      </div>
                      <span className={styles.qrLabel}>VERIFIED</span>
                    </div>
                  </div>

                  {/* Watermark label */}
                  {!isApproved && (
                    <div className={styles.watermarkLabel}>
                      PROSES VERIFIKASI PENDING
                    </div>
                  )}

                  {/* Card bottom border details */}
                  <div className={styles.cardBottomBar}>
                    KARTU ALUMNI DIGITAL RESMI &bull; PORTAL IKATP-FT UNP
                  </div>
                </div>
              </div>

              {isApproved ? (
                <button 
                  onClick={() => window.print()} 
                  className={styles.printBtn}
                >
                  🖨️ Cetak / Simpan sebagai PDF
                </button>
              ) : (
                <p className={styles.cardLockedAlert}>
                  🔒 Cetak kartu dinonaktifkan sementara akun Anda dalam status peninjauan admin.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
