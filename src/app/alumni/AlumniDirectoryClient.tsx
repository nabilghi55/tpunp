'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AlumniDirectory.module.css';

interface AlumniItem {
  id: string;
  name: string;
  email: string | null;
  nim: string;
  graduationYear: number;
  phone: string | null;
  currentCompany: string;
  jobTitle: string;
  location: string;
  linkedinUrl: string | null;
  bio: string;
  photo: string | null;
}

interface Props {
  initialAlumni: AlumniItem[];
  isLoggedIn: boolean;
}

export default function AlumniDirectoryClient({ initialAlumni, isLoggedIn }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');

  // Filter logic
  const filteredAlumni = initialAlumni.filter((alumni) => {
    const matchesSearch = 
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesYear = selectedYear === 'ALL' || alumni.graduationYear === selectedYear;

    return matchesSearch && matchesYear;
  });

  // Extract unique years present in database for the filter dropdown
  const years = Array.from(
    new Set(initialAlumni.map((al) => al.graduationYear))
  ).sort((a, b) => b - a); // newest graduation year first

  return (
    <div className={styles.directoryContainer}>
      {/* Privacy Notice */}
      {!isLoggedIn && (
        <div className={styles.privacyNotice}>
          <div className={styles.privacyIcon}>🔒</div>
          <div className={styles.privacyText}>
            <h4>Informasi Kontak Terkunci</h4>
            <p>
              Untuk menjaga privasi alumni, nomor telepon, alamat email, dan link LinkedIn disembunyikan dari publik. 
              Silakan <Link href="/login"><b>Masuk</b></Link> atau <Link href="/register"><b>Daftar</b></Link> sebagai alumni untuk membuka akses penuh direktori.
            </p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Cari nama, perusahaan, keahlian, atau kota..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className={styles.filterSelect}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
        >
          <option value="ALL">Semua Angkatan</option>
          {years.map((y) => (
            <option key={y} value={y}>Angkatan {y}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p className={styles.resultsCount}>
        Menampilkan {filteredAlumni.length} alumni dari total {initialAlumni.length} alumni terverifikasi.
      </p>

      {/* Grid List */}
      <div className={styles.alumniGrid}>
        {filteredAlumni.map((alumni) => (
          <div key={alumni.id} className={`glass-panel ${styles.alumniCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                {alumni.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={alumni.photo} alt={alumni.name} className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarText}>
                    {alumni.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className={styles.headerInfo}>
                <h3 className={styles.alumniName}>{alumni.name}</h3>
                <span className={styles.badgeYear}>Angkatan {alumni.graduationYear}</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              {alumni.jobTitle || alumni.currentCompany ? (
                <div className={styles.jobBadge}>
                  💼 <b>{alumni.jobTitle || 'Alumni'}</b> di {alumni.currentCompany || 'Umum'}
                </div>
              ) : (
                <div className={styles.jobBadge}>💼 Belum memperbarui info kerja</div>
              )}
              
              {alumni.location && (
                <p className={styles.location}>📍 {alumni.location}</p>
              )}

              {alumni.bio && (
                <p className={styles.bio}>&ldquo;{alumni.bio}&rdquo;</p>
              )}
            </div>

            <div className={styles.cardFooter}>
              {isLoggedIn ? (
                <div className={styles.contactDetails}>
                  <p>📧 {alumni.email || '-'}</p>
                  <p>📞 {alumni.phone || '-'}</p>
                  {alumni.linkedinUrl && (
                    <a 
                      href={alumni.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.linkedinLink}
                    >
                      🔗 Profil LinkedIn →
                    </a>
                  )}
                </div>
              ) : (
                <div className={styles.contactLocked}>
                  <span>🔒 Informasi kontak disembunyikan</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAlumni.length === 0 && (
          <div className={styles.noResults}>
            <p>Alumni dengan kriteria tersebut tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
