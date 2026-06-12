'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';

interface PendingAlumni {
  id: string;
  name: string;
  email: string;
  status: string;
  nim: string;
  graduationYear: number;
  phone: string;
  currentCompany: string;
  jobTitle: string;
  location: string;
  bio: string;
  createdAt: string;
}

interface Props {
  adminName: string;
  initialPendingAlumni: PendingAlumni[];
}

type TabType = 'verify' | 'announcement';

export default function AdminDashboardClient({ adminName, initialPendingAlumni }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('verify');
  const [pendingAlumni, setPendingAlumni] = useState<PendingAlumni[]>(initialPendingAlumni);
  
  // Announcement Form States
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [announceImage, setAnnounceImage] = useState('');
  
  const [announceMsg, setAnnounceMsg] = useState('');
  const [announceError, setAnnounceError] = useState('');
  const [isPostingAnnounce, setIsPostingAnnounce] = useState(false);

  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifyError, setVerifyError] = useState('');

  // Logout
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

  // Approve/Reject Handler
  const handleVerifyAction = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    setVerifyMsg('');
    setVerifyError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses verifikasi');

      setVerifyMsg(data.message);
      // Remove verified alumni from current client list
      setPendingAlumni((prev) => prev.filter((al) => al.id !== userId));
      router.refresh();
    } catch (err: any) {
      setVerifyError(err.message);
    }
  };

  // Submit Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnounceMsg('');
    setAnnounceError('');
    setIsPostingAnnounce(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announceTitle,
          content: announceContent,
          coverImage: announceImage || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pengumuman');

      setAnnounceMsg('Pengumuman berhasil dipublikasikan ke halaman utama!');
      setAnnounceTitle('');
      setAnnounceContent('');
      setAnnounceImage('');
      router.refresh();
    } catch (err: any) {
      setAnnounceError(err.message);
    } finally {
      setIsPostingAnnounce(false);
    }
  };

  return (
    <div className={styles.dashboardGrid}>
      {/* Sidebar Panel */}
      <div className={`glass-panel ${styles.sidebar}`}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarLarge}>
            👑
          </div>
          <h3>{adminName}</h3>
          <p className={styles.roleLabel}>Administrator</p>
        </div>

        <ul className={styles.menuList}>
          <li 
            className={activeTab === 'verify' ? styles.menuItemActive : styles.menuItem}
            onClick={() => setActiveTab('verify')}
          >
            📋 Verifikasi Alumni ({pendingAlumni.length})
          </li>
          <li 
            className={activeTab === 'announcement' ? styles.menuItemActive : styles.menuItem}
            onClick={() => setActiveTab('announcement')}
          >
            📢 Buat Pengumuman
          </li>
        </ul>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Keluar Sesi
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`glass-panel ${styles.contentArea}`}>
        
        {/* Tab 1: Verify Alumni */}
        {activeTab === 'verify' && (
          <div className={styles.tabContent}>
            <h3 className={styles.tabTitle}>Persetujuan Registrasi Alumni</h3>
            <p className={styles.tabSubtitle}>Tinjau kesesuaian NIM alumni terdaftar sebelum menyetujui akun mereka.</p>

            {verifyMsg && <div className={styles.successAlert}>✅ {verifyMsg}</div>}
            {verifyError && <div className={styles.errorAlert}>⚠️ {verifyError}</div>}

            <div className={styles.pendingList}>
              {pendingAlumni.map((alumni) => (
                <div key={alumni.id} className={styles.alumniRequestCard}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeaderRow}>
                      <h4>{alumni.name}</h4>
                      <span className={styles.nimBadge}>NIM: {alumni.nim} &bull; Angkatan {alumni.graduationYear}</span>
                    </div>
                    
                    <div className={styles.alumniMeta}>
                      <p>📧 {alumni.email} &bull; 📞 {alumni.phone || '-'}</p>
                      <p>💼 {alumni.jobTitle ? `${alumni.jobTitle} di ${alumni.currentCompany}` : 'Belum memasukkan kerja'}</p>
                      {alumni.location && <p>📍 {alumni.location}</p>}
                    </div>

                    {alumni.bio && (
                      <blockquote className={styles.bioText}>
                        &ldquo;{alumni.bio}&rdquo;
                      </blockquote>
                    )}
                    
                    <span className={styles.regDate}>
                      Mendaftar pada: {new Date(alumni.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className={styles.cardActions}>
                    <button 
                      onClick={() => handleVerifyAction(alumni.id, 'APPROVE')} 
                      className={styles.approveBtn}
                    >
                      Setujui (Approve)
                    </button>
                    <button 
                      onClick={() => handleVerifyAction(alumni.id, 'REJECT')} 
                      className={styles.rejectBtn}
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))}

              {pendingAlumni.length === 0 && (
                <div className={styles.emptyVerification}>
                  <div className={styles.emptyIcon}>🎉</div>
                  <h4>Semua Bersih!</h4>
                  <p>Tidak ada pendaftaran alumni baru yang memerlukan verifikasi admin saat ini.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Create Announcement */}
        {activeTab === 'announcement' && (
          <div className={styles.tabContent}>
            <h3 className={styles.tabTitle}>Publikasikan Berita & Pengumuman</h3>
            <p className={styles.tabSubtitle}>Pengumuman ini akan langsung muncul di halaman beranda utama website.</p>

            {announceMsg && <div className={styles.successAlert}>✅ {announceMsg}</div>}
            {announceError && <div className={styles.errorAlert}>⚠️ {announceError}</div>}

            <form onSubmit={handleCreateAnnouncement} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Judul Pengumuman *</label>
                <input 
                  type="text" 
                  value={announceTitle} 
                  onChange={(e) => setAnnounceTitle(e.target.value)} 
                  required 
                  placeholder="Contoh: Reuni Akbar Angkatan Pertama..."
                  className={styles.input} 
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL Gambar Sampul (Opsional)</label>
                <input 
                  type="url" 
                  value={announceImage} 
                  onChange={(e) => setAnnounceImage(e.target.value)} 
                  placeholder="Masukkan link gambar/foto kegiatan..."
                  className={styles.input} 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Isi Konten Pengumuman *</label>
                <textarea 
                  value={announceContent} 
                  onChange={(e) => setAnnounceContent(e.target.value)} 
                  required 
                  rows={8} 
                  placeholder="Tulis detail pengumuman secara rinci di sini..."
                  className={styles.textarea}
                ></textarea>
              </div>

              <button type="submit" disabled={isPostingAnnounce} className={styles.saveBtn}>
                {isPostingAnnounce ? 'Mempublikasikan...' : 'Publikasikan Sekarang'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
