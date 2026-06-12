import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from './LoginForm';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-mint)' }}>Memuat Halaman...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
