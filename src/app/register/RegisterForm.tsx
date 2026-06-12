'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nim, setNim] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [phone, setPhone] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          nim,
          graduationYear,
          phone,
          currentCompany,
          jobTitle,
          location,
          bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Pendaftaran gagal.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate graduation years list from 2003 to 2026
  const currentYear = 2026;
  const startYear = 2003;
  const years = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y);
  }

  return (
    <div className={`glass-panel ${styles.registerCard}`}>
      {isSuccess ? (
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className="gold-gradient-text">Pendaftaran Berhasil!</h2>
          <p>
            Akun alumni Anda dengan nama <b>{name}</b> dan NIM <b>{nim}</b> berhasil dibuat.
          </p>
          <div className={styles.infoAlert}>
            <p>
              ⏳ <b>Status Akun: MENUNGGU VERIFIKASI (PENDING)</b>
            </p>
            <p>
              Pengurus IKATP-FT UNP akan memverifikasi kesesuaian data NIM Anda dengan database lulusan jurusan. 
              Proses ini biasanya memakan waktu 1x24 jam. Setelah disetujui, Anda dapat masuk ke portal.
            </p>
          </div>
          <Link href="/login" className={styles.loginBtn}>
            Masuk Halaman Login →
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cardHeader}>
            <h2>REGISTRASI ALUMNI</h2>
            <p>Lengkapi formulir di bawah ini untuk didaftarkan ke Direktori Alumni IKATP-FT UNP.</p>
          </div>

          {errorMsg && (
            <div className={styles.errorAlert}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <h4 className={styles.formSectionTitle}>1. Informasi Akun Dasar (Wajib)</h4>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Contoh: Budi Pratama, S.T."
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow2Col}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Alamat Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="nama@email.com"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Kata Sandi</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Minimal 6 karakter..."
                  className={styles.input}
                />
              </div>
            </div>

            <h4 className={styles.formSectionTitle}>2. Data Akademik Alumni (Wajib)</h4>
            <div className={styles.formRow2Col}>
              <div className={styles.formGroup}>
                <label htmlFor="nim">NIM (Nomor Induk Mahasiswa)</label>
                <input 
                  type="text" 
                  id="nim" 
                  value={nim} 
                  onChange={(e) => setNim(e.target.value)} 
                  required 
                  placeholder="Contoh: 18029001"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="graduationYear">Tahun Kelulusan (Angkatan)</label>
                <select 
                  id="graduationYear" 
                  value={graduationYear} 
                  onChange={(e) => setGraduationYear(e.target.value)} 
                  required
                  className={styles.selectInput}
                >
                  <option value="">Pilih Tahun...</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className={styles.formSectionTitle}>3. Kontak & Karir Saat Ini (Opsional)</h4>
            
            <div className={styles.formRow2Col}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Nomor HP / WhatsApp</label>
                <input 
                  type="text" 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="0812XXXXXXXX"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="location">Kota Domisili Sekarang</label>
                <input 
                  type="text" 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Contoh: Jakarta Selatan"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow2Col}>
              <div className={styles.formGroup}>
                <label htmlFor="currentCompany">Nama Perusahaan Kerja</label>
                <input 
                  type="text" 
                  id="currentCompany" 
                  value={currentCompany} 
                  onChange={(e) => setCurrentCompany(e.target.value)} 
                  placeholder="Contoh: PT Bukit Asam Tbk"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="jobTitle">Jabatan / Posisi Kerja</label>
                <input 
                  type="text" 
                  id="jobTitle" 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  placeholder="Contoh: Mine Planner"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Tentang Diri / Bio Singkat</label>
                <textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tulis bio singkat profil profesional Anda..."
                  className={styles.textarea}
                  rows={3}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Mendaftarkan...' : 'Kirim Pendaftaran →'}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>Sudah mendaftar dan terverifikasi? <Link href="/login"><b>Masuk di sini</b></Link></p>
          </div>
        </>
      )}
    </div>
  );
}
