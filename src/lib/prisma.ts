import bcrypt from 'bcryptjs';

// Pre-hash passwords to ensure bcryptjs comparison works correctly in the API endpoints
const adminHash = bcrypt.hashSync('admin123', 10);
const alumniHash = bcrypt.hashSync('alumni123', 10);

interface UserMock {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AlumniProfileMock {
  id: string;
  userId: string;
  nim: string;
  graduationYear: number;
  phone: string | null;
  currentCompany: string | null;
  jobTitle: string | null;
  location: string | null;
  linkedinUrl: string | null;
  bio: string | null;
  photo: string | null;
  updatedAt: Date;
}

interface JobListingMock {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  salary: string | null;
  contactEmail: string;
  createdAt: Date;
  postedByUserId: string;
}

interface AnnouncementMock {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  createdAt: Date;
  postedByUserId: string;
}

// Persist database state globally to survive Hot Module Replacement during development
const globalForDb = globalThis as unknown as {
  db: {
    users: UserMock[];
    profiles: AlumniProfileMock[];
    jobListings: JobListingMock[];
    announcements: AnnouncementMock[];
  } | undefined;
};

// Initialize the mock database state
const initMockDb = () => {
  return {
    users: [
      {
        id: 'admin-user-id',
        name: 'Admin IKA TM UNP',
        email: 'admin@ikatmunp.org',
        passwordHash: adminHash,
        role: 'ADMIN',
        status: 'APPROVED',
        createdAt: new Date('2026-06-12T00:00:00.000Z'),
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
      // Keep a fallback admin with the other domain format just in case
      {
        id: 'admin-user-id-alt',
        name: 'Admin IKA TM UNP',
        email: 'admin@ikatpftunp.org',
        passwordHash: adminHash,
        role: 'ADMIN',
        status: 'APPROVED',
        createdAt: new Date('2026-06-12T00:00:00.000Z'),
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
      {
        id: 'budi-user-id',
        name: 'Budi Pratama, S.T.',
        email: 'budi.pratama@gmail.com',
        passwordHash: alumniHash,
        role: 'ALUMNI',
        status: 'APPROVED',
        createdAt: new Date('2026-06-12T00:00:00.000Z'),
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
      {
        id: 'siti-user-id',
        name: 'Siti Rahma, S.T.',
        email: 'siti.rahma@gmail.com',
        passwordHash: alumniHash,
        role: 'ALUMNI',
        status: 'APPROVED',
        createdAt: new Date('2026-06-12T00:00:00.000Z'),
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
      {
        id: 'andi-user-id',
        name: 'Andi Wijaya, S.T.',
        email: 'andi.wijaya@gmail.com',
        passwordHash: alumniHash,
        role: 'ALUMNI',
        status: 'PENDING',
        createdAt: new Date('2026-06-12T00:00:00.000Z'),
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      }
    ],
    profiles: [
      {
        id: 'profile-budi',
        userId: 'budi-user-id',
        nim: '18029001',
        graduationYear: 2022,
        phone: '081234567890',
        currentCompany: 'PT Bukit Asam Tbk',
        jobTitle: 'Mining Engineer',
        location: 'Tanjung Enim, Sumatera Selatan',
        linkedinUrl: 'https://linkedin.com/in/budipratama',
        bio: 'Alumni Teknik Pertambangan UNP angkatan 2018. Berfokus pada mine planning, survey, dan pemetaan tambang terbuka.',
        photo: null,
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
      {
        id: 'profile-siti',
        userId: 'siti-user-id',
        nim: '17029045',
        graduationYear: 2021,
        phone: '085277889900',
        currentCompany: 'PT Freeport Indonesia',
        jobTitle: 'Senior Geotechnical Engineer',
        location: 'Mimika, Papua',
        linkedinUrl: 'https://linkedin.com/in/sitirahma',
        bio: 'Alumni angkatan 2017. Berpengalaman di bidang geoteknik tambang bawah tanah (underground mining) Tembagapura.',
        photo: null,
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      },
      {
        id: 'profile-andi',
        userId: 'andi-user-id',
        nim: '20029012',
        graduationYear: 2024,
        phone: '089911223344',
        currentCompany: 'Fresh Graduate',
        jobTitle: 'Junior Surveyor / Intern',
        location: 'Padang, Sumatera Barat',
        linkedinUrl: 'https://linkedin.com/in/andiwijaya',
        bio: 'Baru menyelesaikan studi di Teknik Pertambangan UNP tahun 2024. Senang belajar hal baru tentang eksplorasi mineral.',
        photo: null,
        updatedAt: new Date('2026-06-12T00:00:00.000Z'),
      }
    ],
    announcements: [
      {
        id: 'ann-1',
        title: 'Reuni Akbar IKA Teknik Pertambangan UNP 2026',
        content: 'Kami mengundang seluruh alumni Teknik Pertambangan Universitas Negeri Padang dari seluruh angkatan untuk menghadiri Reuni Akbar yang akan diadakan di Hotel Grand Zuri, Padang pada tanggal 15 Agustus 2026. Agenda acara meliputi temu kangen, seminar karir pertambangan, dan diskusi panel pembentukan yayasan beasiswa alumni.',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        postedByUserId: 'admin-user-id',
        createdAt: new Date('2026-06-11T10:00:00.000Z'),
      },
      {
        id: 'ann-2',
        title: 'Pemberian Beasiswa Ikatan Alumni Angkatan I',
        content: 'Dalam rangka mendukung peningkatan kompetensi adik-adik mahasiswa Teknik Pertambangan UNP yang aktif, Pengurus IKA TM UNP meluncurkan program beasiswa prestasi untuk 5 mahasiswa terpilih. Pendaftaran dibuka hingga 30 Juni 2026 melalui portal beasiswa di jurusan.',
        coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
        postedByUserId: 'admin-user-id',
        createdAt: new Date('2026-06-10T09:00:00.000Z'),
      }
    ],
    jobListings: [
      {
        id: 'job-1',
        title: 'Mine Planner Engineer',
        company: 'PT Bukit Asam Tbk',
        description: 'Dibutuhkan Mine Planner Engineer untuk site Tanjung Enim. Kualifikasi: Lulusan S1 Teknik Pertambangan, menguasai software tambang (Surpac/Minescape), pengalaman minimal 2 tahun di tambang batu bara terbuka. Fresh graduate berprestasi dipersilakan melamar.',
        location: 'Tanjung Enim, Sumatera Selatan',
        type: 'FULL_TIME',
        salary: 'Rp 8.000.000 - Rp 15.000.000',
        contactEmail: 'career@bukitasam.co.id',
        postedByUserId: 'budi-user-id',
        createdAt: new Date('2026-06-11T12:00:00.000Z'),
      },
      {
        id: 'job-2',
        title: 'Geotechnical Engineer (Underground)',
        company: 'PT Freeport Indonesia',
        description: 'Kami mencari Senior/Junior Geotechnical Engineer untuk area operasi bawah tanah Tembagapura. Kualifikasi: Lulusan S1/S2 Teknik Pertambangan/Geologi, memahami analisis kestabilan lubang bukaan bawah tanah, menguasai software pemodelan geoteknik.',
        location: 'Tembagapura, Papua',
        type: 'FULL_TIME',
        salary: 'Negosiasi / Kompetitif',
        contactEmail: 'recruitment@fmi.com',
        postedByUserId: 'siti-user-id',
        createdAt: new Date('2026-06-10T11:00:00.000Z'),
      }
    ]
  };
};

const globalDb = globalForDb.db ?? initMockDb();
if (process.env.NODE_ENV !== 'production') globalForDb.db = globalDb;

export const prisma = {
  user: {
    findMany: async (args?: any) => {
      let result = [...globalDb.users];
      if (args?.where) {
        result = result.filter(u => {
          for (const key in args.where) {
            if (key === 'role' && u.role !== args.where.role) return false;
            if (key === 'status' && u.status !== args.where.status) return false;
          }
          return true;
        });
      }
      
      if (args?.orderBy) {
        if (args.orderBy.name) {
          const dir = args.orderBy.name === 'asc' ? 1 : -1;
          result.sort((a, b) => a.name.localeCompare(b.name) * dir);
        } else if (args.orderBy.createdAt) {
          const dir = args.orderBy.createdAt === 'asc' ? 1 : -1;
          result.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * dir);
        }
      }

      return result.map(u => {
        const profile = globalDb.profiles.find(p => p.userId === u.id) || null;
        return {
          ...u,
          profile: args?.include?.profile ? profile : null
        };
      });
    },

    findUnique: async (args: any) => {
      const { email, id } = args.where;
      const user = globalDb.users.find(u => (email && u.email === email) || (id && u.id === id));
      if (!user) return null;
      const profile = globalDb.profiles.find(p => p.userId === user.id) || null;
      return {
        ...user,
        profile: args.include?.profile ? profile : null
      };
    },

    count: async (args?: any) => {
      let result = [...globalDb.users];
      if (args?.where) {
        result = result.filter(u => {
          for (const key in args.where) {
            if (key === 'role' && u.role !== args.where.role) return false;
            if (key === 'status' && u.status !== args.where.status) return false;
          }
          return true;
        });
      }
      return result.length;
    },

    create: async (args: any) => {
      const { name, email, passwordHash, role, status, profile } = args.data;
      const newUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        passwordHash,
        role: role || 'ALUMNI',
        status: status || 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      globalDb.users.push(newUser);

      let createdProfile = null;
      if (profile?.create) {
        createdProfile = {
          id: 'profile-' + Math.random().toString(36).substring(2, 9),
          userId: newUser.id,
          nim: profile.create.nim,
          graduationYear: parseInt(profile.create.graduationYear),
          phone: profile.create.phone || null,
          currentCompany: profile.create.currentCompany || null,
          jobTitle: profile.create.jobTitle || null,
          location: profile.create.location || null,
          linkedinUrl: profile.create.linkedinUrl || null,
          bio: profile.create.bio || null,
          photo: profile.create.photo || null,
          updatedAt: new Date(),
        };
        globalDb.profiles.push(createdProfile);
      }

      return {
        ...newUser,
        profile: createdProfile
      };
    },

    update: async (args: any) => {
      const { id } = args.where;
      const userIdx = globalDb.users.findIndex(u => u.id === id);
      if (userIdx === -1) throw new Error('User not found');
      
      const updatedUser = {
        ...globalDb.users[userIdx],
        ...args.data,
        updatedAt: new Date()
      };
      globalDb.users[userIdx] = updatedUser;

      const profile = globalDb.profiles.find(p => p.userId === updatedUser.id) || null;
      return {
        ...updatedUser,
        profile: args.include?.profile ? profile : null
      };
    }
  },

  alumniProfile: {
    findUnique: async (args: any) => {
      const { nim, userId } = args.where;
      const profile = globalDb.profiles.find(p => (nim && p.nim === nim) || (userId && p.userId === userId));
      return profile || null;
    },

    update: async (args: any) => {
      const { userId } = args.where;
      const profileIdx = globalDb.profiles.findIndex(p => p.userId === userId);
      if (profileIdx === -1) throw new Error('Profile not found');

      const updatedProfile = {
        ...globalDb.profiles[profileIdx],
        ...args.data,
        updatedAt: new Date()
      };
      globalDb.profiles[profileIdx] = updatedProfile;
      return updatedProfile;
    }
  },

  jobListing: {
    findMany: async (args?: any) => {
      let result = [...globalDb.jobListings];
      
      if (args?.orderBy) {
        if (args.orderBy.createdAt) {
          const dir = args.orderBy.createdAt === 'asc' ? 1 : -1;
          result.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * dir);
        }
      }

      if (args?.take) {
        result = result.slice(0, args.take);
      }

      return result.map(j => {
        const user = globalDb.users.find(u => u.id === j.postedByUserId);
        return {
          ...j,
          postedByUser: args?.include?.postedByUser ? { name: user?.name || 'Alumni' } : undefined
        };
      });
    },

    count: async () => {
      return globalDb.jobListings.length;
    },

    create: async (args: any) => {
      const { title, company, description, location, type, salary, contactEmail, postedByUserId } = args.data;
      const newJob = {
        id: 'job-' + Math.random().toString(36).substring(2, 9),
        title,
        company,
        description,
        location,
        type,
        salary: salary || null,
        contactEmail,
        postedByUserId,
        createdAt: new Date(),
      };
      globalDb.jobListings.push(newJob);
      return newJob;
    }
  },

  announcement: {
    findMany: async (args?: any) => {
      let result = [...globalDb.announcements];

      if (args?.orderBy) {
        if (args.orderBy.createdAt) {
          const dir = args.orderBy.createdAt === 'asc' ? 1 : -1;
          result.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * dir);
        }
      }

      if (args?.take) {
        result = result.slice(0, args.take);
      }

      return result.map(a => {
        const user = globalDb.users.find(u => u.id === a.postedByUserId);
        return {
          ...a,
          postedByUser: args?.include?.postedByUser ? { name: user?.name || 'Admin' } : undefined
        };
      });
    },

    count: async () => {
      return globalDb.announcements.length;
    },

    create: async (args: any) => {
      const { title, content, coverImage, postedByUserId } = args.data;
      const newAnn = {
        id: 'ann-' + Math.random().toString(36).substring(2, 9),
        title,
        content,
        coverImage: coverImage || null,
        postedByUserId,
        createdAt: new Date(),
      };
      globalDb.announcements.push(newAnn);
      return newAnn;
    }
  }
};

export default prisma;
