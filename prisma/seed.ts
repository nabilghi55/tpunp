import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.announcement.deleteMany({});
  await prisma.jobListing.deleteMany({});
  await prisma.alumniProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Admin
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin IKA TM UNP',
      email: 'admin@ikatmunp.org',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  // 2. Create Verified Alumni 1
  const alumni1PasswordHash = await bcrypt.hash('alumni123', 10);
  const alumni1 = await prisma.user.create({
    data: {
      name: 'Budi Pratama, S.T.',
      email: 'budi.pratama@gmail.com',
      passwordHash: alumni1PasswordHash,
      role: 'ALUMNI',
      status: 'APPROVED',
      profile: {
        create: {
          nim: '18029001',
          graduationYear: 2022,
          phone: '081234567890',
          currentCompany: 'PT Bukit Asam Tbk',
          jobTitle: 'Mining Engineer',
          location: 'Tanjung Enim, Sumatera Selatan',
          linkedinUrl: 'https://linkedin.com/in/budipratama',
          bio: 'Alumni Teknik Pertambangan UNP angkatan 2018. Berfokus pada mine planning, survey, dan pemetaan tambang terbuka.',
        },
      },
    },
  });

  // 3. Create Verified Alumni 2
  const alumni2PasswordHash = await bcrypt.hash('alumni123', 10);
  const alumni2 = await prisma.user.create({
    data: {
      name: 'Siti Rahma, S.T.',
      email: 'siti.rahma@gmail.com',
      passwordHash: alumni2PasswordHash,
      role: 'ALUMNI',
      status: 'APPROVED',
      profile: {
        create: {
          nim: '17029045',
          graduationYear: 2021,
          phone: '085277889900',
          currentCompany: 'PT Freeport Indonesia',
          jobTitle: 'Senior Geotechnical Engineer',
          location: 'Mimika, Papua',
          linkedinUrl: 'https://linkedin.com/in/sitirahma',
          bio: 'Alumni angkatan 2017. Berpengalaman di bidang geoteknik tambang bawah tanah (underground mining) Tembagapura.',
        },
      },
    },
  });

  // 4. Create Pending Alumni 3
  const alumni3PasswordHash = await bcrypt.hash('alumni123', 10);
  const alumni3 = await prisma.user.create({
    data: {
      name: 'Andi Wijaya, S.T.',
      email: 'andi.wijaya@gmail.com',
      passwordHash: alumni3PasswordHash,
      role: 'ALUMNI',
      status: 'PENDING',
      profile: {
        create: {
          nim: '20029012',
          graduationYear: 2024,
          phone: '089911223344',
          currentCompany: 'Fresh Graduate',
          jobTitle: 'Junior Surveyor / Intern',
          location: 'Padang, Sumatera Barat',
          linkedinUrl: 'https://linkedin.com/in/andiwijaya',
          bio: 'Baru menyelesaikan studi di Teknik Pertambangan UNP tahun 2024. Senang belajar hal baru tentang eksplorasi mineral.',
        },
      },
    },
  });

  // 5. Create Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Reuni Akbar IKA Teknik Pertambangan UNP 2026',
        content: 'Kami mengundang seluruh alumni Teknik Pertambangan Universitas Negeri Padang dari seluruh angkatan untuk menghadiri Reuni Akbar yang akan diadakan di Hotel Grand Zuri, Padang pada tanggal 15 Agustus 2026. Agenda acara meliputi temu kangen, seminar karir pertambangan, dan diskusi panel pembentukan yayasan beasiswa alumni.',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        postedByUserId: admin.id,
      },
      {
        title: 'Pemberian Beasiswa Ikatan Alumni Angkatan I',
        content: 'Dalam rangka mendukung peningkatan kompetensi adik-adik mahasiswa Teknik Pertambangan UNP yang aktif, Pengurus IKA TM UNP meluncurkan program beasiswa prestasi untuk 5 mahasiswa terpilih. Pendaftaran dibuka hingga 30 Juni 2026 melalui portal beasiswa di jurusan.',
        coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
        postedByUserId: admin.id,
      },
    ],
  });

  // 6. Create Job Listings
  await prisma.jobListing.create({
    data: {
      title: 'Mine Planner Engineer',
      company: 'PT Bukit Asam Tbk',
      description: 'Dibutuhkan Mine Planner Engineer untuk site Tanjung Enim. Kualifikasi: Lulusan S1 Teknik Pertambangan, menguasai software tambang (Surpac/Minescape), pengalaman minimal 2 tahun di tambang batu bara terbuka. Fresh graduate berprestasi dipersilakan melamar.',
      location: 'Tanjung Enim, Sumatera Selatan',
      type: 'FULL_TIME',
      salary: 'Rp 8.000.000 - Rp 15.000.000',
      contactEmail: 'career@bukitasam.co.id',
      postedByUserId: alumni1.id,
    },
  });

  await prisma.jobListing.create({
    data: {
      title: 'Geotechnical Engineer (Underground)',
      company: 'PT Freeport Indonesia',
      description: 'Kami mencari Senior/Junior Geotechnical Engineer untuk area operasi bawah tanah Tembagapura. Kualifikasi: Lulusan S1/S2 Teknik Pertambangan/Geologi, memahami analisis kestabilan lubang bukaan bawah tanah, menguasai software pemodelan geoteknik.',
      location: 'Tembagapura, Papua',
      type: 'FULL_TIME',
      salary: 'Negosiasi / Kompetitif',
      contactEmail: 'recruitment@fmi.com',
      postedByUserId: alumni2.id,
    },
  });

  console.log('Seeding complete! Admin: admin@ikatmunp.org / admin123, Alumni: budi.pratama@gmail.com / alumni123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Clean exit
  });
