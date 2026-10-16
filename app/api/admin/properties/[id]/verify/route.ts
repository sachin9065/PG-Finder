import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { getUserFromRequest } from '@/lib/auth';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { isVerified, status } = body;

    const memProp = store.properties.find((p) => p.id === id);
    if (memProp) {
      if (typeof isVerified === 'boolean') memProp.isVerified = isVerified;
      if (status) memProp.status = status;
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        const update: any = {};
        if (typeof isVerified === 'boolean') update.isVerified = isVerified;
        if (status) update.status = status;
        await Property.findByIdAndUpdate(id, update);
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: 'Property verification status updated',
      property: memProp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update verification' },
      { status: 500 }
    );
  }
}
