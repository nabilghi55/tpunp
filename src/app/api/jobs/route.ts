import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// Fetch all jobs
export async function GET() {
  try {
    const jobs = await prisma.jobListing.findMany({
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
    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('Fetch jobs API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data lowongan pekerjaan' },
      { status: 500 }
    );
  }
}

// Post a new job
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
    if (!user || user.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Hanya alumni terverifikasi yang dapat memposting lowongan kerja' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, company, description, location, type, salary, contactEmail } = body;

    if (!title || !company || !description || !location || !type || !contactEmail) {
      return NextResponse.json(
        { error: 'Mohon isi semua data yang wajib' },
        { status: 400 }
      );
    }

    const newJob = await prisma.jobListing.create({
      data: {
        title,
        company,
        description,
        location,
        type,
        salary: salary || null,
        contactEmail,
        postedByUserId: user.userId,
      },
    });

    return NextResponse.json(
      { message: 'Lowongan kerja berhasil diposting', job: newJob },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Post job API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan lowongan pekerjaan' },
      { status: 500 }
    );
  }
}
