import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import AlumniDirectoryClient from './AlumniDirectoryClient';
import styles from './page.module.css';

export const revalidate = 0;

export default async function AlumniPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  let isLoggedIn = false;

  if (token) {
    const user = await verifyToken(token);
    if (user && user.status === 'APPROVED') {
      isLoggedIn = true;
    }
  }

  // Fetch verified alumni from SQLite directly
  const alumniList = await prisma.user.findMany({
    where: {
      role: 'ALUMNI',
      status: 'APPROVED',
    },
    include: {
      profile: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Map into safe public/private fields
  const serializedAlumni = alumniList.map((user) => {
    const profile = user.profile;
    return {
      id: user.id,
      name: user.name,
      email: isLoggedIn ? user.email : null,
      nim: profile?.nim || '',
      graduationYear: profile?.graduationYear || 0,
      phone: isLoggedIn ? (profile?.phone ?? null) : null,
      currentCompany: profile?.currentCompany || '',
      jobTitle: profile?.jobTitle || '',
      location: profile?.location || '',
      linkedinUrl: isLoggedIn ? (profile?.linkedinUrl ?? null) : null,
      bio: profile?.bio || '',
      photo: profile?.photo || null,
    };
  });

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.badge}>Database Alumni</span>
            <h1 className="gold-gradient-text gold-glow">DIREKTORI ALUMNI</h1>
            <p className={styles.subtitle}>
              Jejaring profesional alumni Teknik Pertambangan Universitas Negeri Padang.
            </p>
          </div>
          
          <AlumniDirectoryClient 
            initialAlumni={serializedAlumni} 
            isLoggedIn={isLoggedIn} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
