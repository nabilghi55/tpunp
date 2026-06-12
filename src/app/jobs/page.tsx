import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import JobsClient from './JobsClient';
import styles from './page.module.css';

export const revalidate = 0;

export default async function JobsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  let isLoggedIn = false;
  let isVerified = false;

  if (token) {
    const user = await verifyToken(token);
    if (user) {
      isLoggedIn = true;
      if (user.status === 'APPROVED') {
        isVerified = true;
      }
    }
  }

  // Fetch job listings
  const jobsList = await prisma.jobListing.findMany({
    include: {
      postedByUser: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Map database model to plain object for client component serialization
  const serializedJobs = jobsList.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    location: job.location,
    type: job.type,
    salary: job.salary,
    contactEmail: job.contactEmail,
    createdAt: job.createdAt.toISOString(),
    postedByUserName: job.postedByUser?.name || 'Alumni',
  }));

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.badge}>Bursa Karir</span>
            <h1 className="gold-gradient-text gold-glow">INFO LOWONGAN KERJA</h1>
            <p className={styles.subtitle}>
              Temukan peluang karir dan proyek pertambangan terbaik yang dibagikan oleh jaringan alumni IKATP-FT UNP.
            </p>
          </div>
          
          <JobsClient 
            initialJobs={serializedJobs} 
            isLoggedIn={isLoggedIn}
            isVerified={isVerified}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
