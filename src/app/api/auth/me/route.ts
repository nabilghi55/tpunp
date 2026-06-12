import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// 1. Get logged in user details
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada sesi aktif' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Sesi tidak valid atau kedaluwarsa' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Return user without password
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.error('Fetch me API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil profil Anda' },
      { status: 500 }
    );
  }
}

// 2. Update alumni profile
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada sesi aktif' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Sesi tidak valid' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name,
      phone, 
      currentCompany, 
      jobTitle, 
      location, 
      bio, 
      linkedinUrl, 
      photo 
    } = body;

    // Update User Name if provided
    if (name) {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { name },
      });
    }

    // Update or Create AlumniProfile
    const updatedProfile = await prisma.alumniProfile.update({
      where: { userId: payload.userId },
      data: {
        phone: phone !== undefined ? phone : undefined,
        currentCompany: currentCompany !== undefined ? currentCompany : undefined,
        jobTitle: jobTitle !== undefined ? jobTitle : undefined,
        location: location !== undefined ? location : undefined,
        bio: bio !== undefined ? bio : undefined,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
        photo: photo !== undefined ? photo : undefined,
      },
    });

    return NextResponse.json({
      message: 'Profil berhasil diperbarui',
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui profil' },
      { status: 500 }
    );
  }
}
