import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlumniDashboardClient from './AlumniDashboardClient';
import styles from './page.module.css';

export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  // If user is Admin, redirect to admin dashboard instead
  if (payload.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  // Fetch full user and profile
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    profile: user.profile ? {
      id: user.profile.id,
      nim: user.profile.nim,
      graduationYear: user.profile.graduationYear,
      phone: user.profile.phone || '',
      currentCompany: user.profile.currentCompany || '',
      jobTitle: user.profile.jobTitle || '',
      location: user.profile.location || '',
      linkedinUrl: user.profile.linkedinUrl || '',
      bio: user.profile.bio || '',
      photo: user.profile.photo || '',
    } : null,
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <AlumniDashboardClient user={serializedUser} />
        </div>
      </main>
      <Footer />
    </>
  );
}
