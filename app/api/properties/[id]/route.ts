import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { getUserFromRequest } from '@/lib/auth';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const db = await connectDB();
    if (db.isConnected) {
      try {
        const property = await Property.findById(id).populate('owner', 'name email phone avatar');
        if (property) {
          const propObj = property.toObject();
          return NextResponse.json({
            success: true,
            property: {
              ...propObj,
              id: property._id.toString(),
              ownerName: propObj.owner?.name || 'Verified Host',
              ownerEmail: propObj.owner?.email || 'owner@pgfinder.com',
              ownerPhone: propObj.owner?.phone || '+91 98112 34567',
            },
          });
        }
      } catch (err) {
        // ID might be non-ObjectId format in fallback, proceed to memory store
      }
    }

    const memProp = store.properties.find((p) => p.id === id);
    if (!memProp) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property: memProp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const memIdx = store.properties.findIndex((p) => p.id === id);
    if (memIdx !== -1) {
      store.properties[memIdx] = {
        ...store.properties[memIdx],
        ...body,
      };
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Property.findByIdAndUpdate(id, body, { new: true });
      } catch (e) {
        // fallback
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      property: memIdx !== -1 ? store.properties[memIdx] : body,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    const memIdx = store.properties.findIndex((p) => p.id === id);
    if (memIdx !== -1) {
      store.properties.splice(memIdx, 1);
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Property.findByIdAndDelete(id);
      } catch (e) {
        // fallback
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete property' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const { status, availableRooms } = await req.json();

    const memProp = store.properties.find((p) => p.id === id);
    if (memProp) {
      if (status !== undefined) memProp.status = status;
      if (availableRooms !== undefined) memProp.availableRooms = availableRooms;
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        const updateObj: any = {};
        if (status !== undefined) updateObj.status = status;
        if (availableRooms !== undefined) updateObj.availableRooms = availableRooms;
        await Property.findByIdAndUpdate(id, updateObj);
      } catch (e) {
        // fallback
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Property status updated',
      property: memProp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update property status' },
      { status: 500 }
    );
  }
}
