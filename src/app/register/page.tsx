import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from './RegisterForm';
import styles from './page.module.css';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
