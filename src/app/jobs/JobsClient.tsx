'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Jobs.module.css';

interface JobItem {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  salary: string | null;
  contactEmail: string;
  createdAt: string;
  postedByUserName: string;
}

interface Props {
  initialJobs: JobItem[];
  isLoggedIn: boolean;
  isVerified: boolean;
}

export default function JobsClient({ initialJobs, isLoggedIn, isVerified }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter jobs based on keyword search
  const filteredJobs = initialJobs.filter((job) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.jobsContainer}>
      {/* Post Job Call-to-Action Bar */}
      <div className={styles.postJobCtaBar}>
        <div className={styles.ctaText}>
          <h4>Miliki Info Lowongan Kerja?</h4>
          <p>Bantu rekan alumni dan mahasiswa tingkat akhir dengan membagikan info karir atau peluang proyek tambang.</p>
        </div>
        <div>
          {isLoggedIn ? (
            isVerified ? (
              <Link href="/dashboard" className={styles.ctaBtn}>
                + Bagikan Info Kerja
              </Link>
            ) : (
              <span className={styles.disabledCta}>
                ⏳ Akun Anda menunggu verifikasi untuk memposting
              </span>
            )
          ) : (
            <Link href="/login" className={styles.ctaBtn}>
              🔑 Masuk untuk Posting
            </Link>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Cari lowongan berdasarkan posisi, perusahaan, kota..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Jobs list grid */}
      <div className={styles.jobsList}>
        {filteredJobs.map((job) => (
          <div key={job.id} className={`glass-panel ${styles.jobCard}`}>
            <div className={styles.jobHeader}>
              <div>
                <span className={styles.jobTypeBadge}>
                  {job.type === 'FULL_TIME' ? 'Penuh Waktu' : 
                   job.type === 'PART_TIME' ? 'Paruh Waktu' :
                   job.type === 'CONTRACT' ? 'Kontrak / Proyek' : 'Magang'}
                </span>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.companyName}>🏢 {job.company} &bull; 📍 {job.location}</p>
              </div>
              
              {job.salary && (
                <div className={styles.salaryBadge}>
                  💵 {job.salary}
                </div>
              )}
            </div>

            <div className={styles.jobBody}>
              <p className={styles.description}>{job.description}</p>
            </div>

            <div className={styles.jobFooter}>
              <div className={styles.footerCol}>
                <span className={styles.postedBy}>
                  Diposting oleh: 👤 <b>{job.postedByUserName}</b>
                </span>
                <span className={styles.date}>
                  pada {new Date(job.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className={styles.applyAction}>
                <a href={`mailto:${job.contactEmail}`} className={styles.applyBtn}>
                  Kirim Lamaran (Email) →
                </a>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className={styles.noResults}>
            <p>Tidak ada lowongan kerja yang sesuai dengan kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
