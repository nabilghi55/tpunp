import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardClient from './AdminDashboardClient';
import styles from './page.module.css';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch pending alumni from database
  const pendingAlumniList = await prisma.user.findMany({
    where: {
      role: 'ALUMNI',
      status: 'PENDING',
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Map into serializable array for the client component
  const serializedPendingAlumni = pendingAlumniList.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    nim: user.profile?.nim || '',
    graduationYear: user.profile?.graduationYear || 0,
    phone: user.profile?.phone || '',
    currentCompany: user.profile?.currentCompany || '',
    jobTitle: user.profile?.jobTitle || '',
    location: user.profile?.location || '',
    bio: user.profile?.bio || '',
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <AdminDashboardClient 
            adminName={payload.name} 
            initialPendingAlumni={serializedPendingAlumni} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
