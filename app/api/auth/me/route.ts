import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const db = await connectDB();
    if (db.isConnected) {
      const user = await User.findById(payload.userId);
      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
          },
        });
      }
    }

    // In-memory fallback
    const memUser = store.users.find((u) => u.id === payload.userId || u.email === payload.email);
    if (memUser) {
      return NextResponse.json({
        success: true,
        user: {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          phone: memUser.phone,
          role: memUser.role,
          avatar: memUser.avatar,
        },
      });
    }

    // Fallback payload info
    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        phone: '+91 98765 43210',
        role: payload.role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name)}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
