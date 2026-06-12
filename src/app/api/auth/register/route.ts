import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      name, 
      password, 
      nim, 
      graduationYear, 
      phone, 
      currentCompany, 
      jobTitle, 
      location, 
      bio 
    } = body;

    // Validation
    if (!email || !name || !password || !nim || !graduationYear) {
      return NextResponse.json(
        { error: 'Mohon lengkapi data wajib (Email, Nama, Sandi, NIM, Tahun Kelulusan)' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Check if NIM exists
    const existingNim = await prisma.alumniProfile.findUnique({
      where: { nim },
    });

    if (existingNim) {
      return NextResponse.json(
        { error: 'NIM sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User & AlumniProfile in a transaction
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ALUMNI',
        status: 'PENDING', // starts as pending verification
        profile: {
          create: {
            nim,
            graduationYear: parseInt(graduationYear),
            phone: phone || '',
            currentCompany: currentCompany || '',
            jobTitle: jobTitle || '',
            location: location || '',
            bio: bio || '',
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Pendaftaran berhasil. Akun Anda sedang menunggu verifikasi oleh Admin.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat pendaftaran' },
      { status: 500 }
    );
  }
}
