import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'owner']).default('user'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role } = validation.data;
    const lowerEmail = email.toLowerCase().trim();

    const db = await connectDB();

    if (db.isConnected) {
      const existing = await User.findOne({ email: lowerEmail });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        name,
        email: lowerEmail,
        phone,
        password: hashedPassword,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      });

      const token = signToken({
        userId: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          avatar: newUser.avatar,
        },
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // In-memory fallback
    const exists = store.users.some((u) => u.email.toLowerCase() === lowerEmail);
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const newId = `user-${Date.now()}`;
    const userObj = {
      id: newId,
      name,
      email: lowerEmail,
      phone,
      password,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };
    store.users.push(userObj);

    const token = signToken({
      userId: newId,
      email: lowerEmail,
      role,
      name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        role: userObj.role,
        avatar: userObj.avatar,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
