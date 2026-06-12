'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal. Periksa kembali email dan sandi Anda.');
      }

      // Login success, refresh to apply cookies and redirect
      router.refresh();
      
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push(redirect);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`glass-panel ${styles.loginCard}`}>
      <div className={styles.cardHeader}>
        <h2>MASUK PORTAL</h2>
        <p>Gunakan akun alumni terdaftar Anda untuk masuk ke dashboard.</p>
      </div>
      
      {errorMsg && (
        <div className={styles.errorAlert}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Masukkan email terdaftar..."
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
            placeholder="Masukkan kata sandi..."
            className={styles.input}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Masuk...' : 'Masuk Sekarang →'}
        </button>
      </form>

      <div className={styles.cardFooter}>
        <p>Belum memiliki akun alumni? <Link href="/register"><b>Daftar di sini</b></Link></p>
        <p className={styles.hint}>*Untuk pengujian: <b>admin@ikatmunp.org / admin123</b> atau <b>budi.pratama@gmail.com / alumni123</b></p>
      </div>
    </div>
  );
}
