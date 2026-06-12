'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Mock API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSuccessMsg('Terima kasih! Pesan Anda telah terkirim ke email humas IKATP-FT UNP.');
    }, 1200);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {successMsg && (
        <div className={styles.successAlert}>
          ✅ {successMsg}
        </div>
      )}
      
      {errorMsg && (
        <div className={styles.errorAlert}>
          ❌ {errorMsg}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="name">Nama Lengkap</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          placeholder="Masukkan nama Anda..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Alamat Email</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          placeholder="Masukkan email Anda..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject">Subjek / Perihal</label>
        <input 
          type="text" 
          id="subject" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
          placeholder="Subjek pesan Anda..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Pesan Anda</label>
        <textarea 
          id="message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
          placeholder="Tuliskan detail pertanyaan atau masukan Anda..."
          className={styles.textarea}
          rows={5}
        ></textarea>
      </div>

      <button 
        type="submit" 
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan →'}
      </button>
    </form>
  );
}
