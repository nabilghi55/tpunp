import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// Fetch all announcements
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error('Fetch announcements API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pengumuman' },
      { status: 500 }
    );
  }
}

// Create new announcement (Admin only)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Anda harus masuk terlebih dahulu' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang dapat membuat pengumuman' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Judul dan konten pengumuman wajib diisi' },
        { status: 400 }
      );
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        coverImage: coverImage || null,
        postedByUserId: user.userId,
      },
    });

    return NextResponse.json(
      { message: 'Pengumuman berhasil dipublikasikan', announcement: newAnnouncement },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create announcement API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan pengumuman' },
      { status: 500 }
    );
  }
}
