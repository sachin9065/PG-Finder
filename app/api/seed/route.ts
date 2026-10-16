import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Property from '@/models/Property';
import { SEED_PROPERTIES, SEED_USERS } from '@/lib/seed-data';
import { hashPassword } from '@/lib/auth';
import { resetStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    resetStore();

    const db = await connectDB();
    if (db.isConnected) {
      await User.deleteMany({});
      await Property.deleteMany({});

      const hashedUsers = await Promise.all(
        SEED_USERS.map(async (u) => ({
          name: u.name,
          email: u.email,
          phone: u.phone,
          password: await hashPassword(u.password),
          role: u.role,
          avatar: u.avatar,
        }))
      );

      const createdUsers = await User.insertMany(hashedUsers);
      const owner1 = createdUsers.find((u) => u.role === 'owner')?._id || createdUsers[0]._id;

      const propertiesToInsert = SEED_PROPERTIES.map((p) => ({
        ...p,
        owner: owner1,
      }));

      await Property.insertMany(propertiesToInsert);
    }

    return NextResponse.json({
      success: true,
      message: 'Database & store seeded with 12+ realistic properties and demo accounts successfully!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
