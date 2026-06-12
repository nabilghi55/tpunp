import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// 1. Get all pending verification requests (Admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada otorisasi' }, { status: 401 });
    }

    const adminUser = await verifyToken(token);
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const pendingAlumni = await prisma.user.findMany({
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

    return NextResponse.json(pendingAlumni);
  } catch (error: any) {
    console.error('Fetch pending alumni error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data pending' },
      { status: 500 }
    );
  }
}

// 2. Approve or Reject an alumni account (Admin only)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada otorisasi' }, { status: 401 });
    }

    const adminUser = await verifyToken(token);
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action } = body; // action can be 'APPROVE' or 'REJECT'

    if (!userId || !action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
      include: { profile: true },
    });

    return NextResponse.json({
      message: `Alumni ${updatedUser.name} berhasil ${action === 'APPROVE' ? 'disetujui' : 'ditolak'}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    console.error('Verify alumni error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat melakukan verifikasi alumni' },
      { status: 500 }
    );
  }
}
