import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Check if requester is logged in & verified
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    let isAuthorized = false;

    if (token) {
      const user = await verifyToken(token);
      if (user && user.status === 'APPROVED') {
        isAuthorized = true;
      }
    }

    // Fetch only verified alumni (User status = APPROVED, role = ALUMNI)
    const alumni = await prisma.user.findMany({
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

    // Redact contact information if the requester is not logged in/verified
    const safeAlumni = alumni.map((al) => {
      const { email, profile, ...rest } = al;
      
      if (!profile) return { name: al.name, email: isAuthorized ? email : null, profile: null };

      return {
        id: al.id,
        name: al.name,
        email: isAuthorized ? email : null,
        profile: {
          nim: profile.nim,
          graduationYear: profile.graduationYear,
          currentCompany: profile.currentCompany,
          jobTitle: profile.jobTitle,
          location: profile.location,
          bio: profile.bio,
          photo: profile.photo,
          phone: isAuthorized ? profile.phone : null,
          linkedinUrl: isAuthorized ? profile.linkedinUrl : null,
        },
      };
    });

    return NextResponse.json(safeAlumni);
  } catch (error: any) {
    console.error('Alumni API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data alumni' },
      { status: 500 }
    );
  }
}
