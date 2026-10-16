import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Property from '@/models/Property';
import Enquiry from '@/models/Enquiry';
import { getUserFromRequest } from '@/lib/auth';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        const [totalUsers, totalOwners, totalProperties, pendingProperties, totalEnquiries] = await Promise.all([
          User.countDocuments({ role: 'user' }),
          User.countDocuments({ role: 'owner' }),
          Property.countDocuments(),
          Property.countDocuments({ isVerified: false }),
          Enquiry.countDocuments(),
        ]);

        return NextResponse.json({
          success: true,
          stats: {
            totalUsers,
            totalOwners,
            totalProperties,
            pendingProperties,
            totalEnquiries,
          },
        });
      } catch (e) {}
    }

    // In-memory stats
    const totalUsers = store.users.filter((u) => u.role === 'user').length;
    const totalOwners = store.users.filter((u) => u.role === 'owner').length;
    const totalProperties = store.properties.length;
    const pendingProperties = store.properties.filter((p) => !p.isVerified).length;
    const totalEnquiries = store.enquiries.length;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalProperties,
        pendingProperties,
        totalEnquiries,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
