import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import Property from '@/models/Property';
import { getUserFromRequest } from '@/lib/auth';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        const filter = user.role === 'owner' ? { owner: user.userId } : { user: user.userId };
        const mongoEnquiries = await Enquiry.find(filter)
          .populate('property', 'title address city locality rent images')
          .populate('user', 'name email phone avatar')
          .populate('owner', 'name email phone')
          .sort({ createdAt: -1 })
          .lean();

        if (mongoEnquiries.length > 0) {
          const formatted = mongoEnquiries.map((e: any) => ({
            id: e._id.toString(),
            userName: e.user?.name || 'Guest User',
            userEmail: e.user?.email || '',
            userPhone: e.phone || e.user?.phone || '',
            propertyId: e.property?._id?.toString(),
            propertyTitle: e.property?.title || 'PG Property',
            propertyImage: e.property?.images?.[0] || '',
            message: e.message,
            visitDate: e.visitDate,
            status: e.status,
            createdAt: e.createdAt,
          }));
          return NextResponse.json({ success: true, enquiries: formatted });
        }
      } catch (err) {
        // fallback to memory
      }
    }

    // In-memory fallback
    let list = store.enquiries;
    if (user.role === 'owner') {
      list = list.filter(
        (e) => e.ownerEmail.toLowerCase() === user.email.toLowerCase() || user.role === 'admin'
      );
    } else {
      list = list.filter((e) => e.userId === user.userId || e.userEmail.toLowerCase() === user.email.toLowerCase());
    }

    return NextResponse.json({ success: true, enquiries: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();
    const { propertyId, message, phone, visitDate } = body;

    if (!propertyId || !message) {
      return NextResponse.json(
        { success: false, error: 'Property and message are required' },
        { status: 400 }
      );
    }

    const prop = store.properties.find((p) => p.id === propertyId);
    const propertyTitle = prop ? prop.title : 'PG Listing';
    const ownerEmail = prop ? prop.ownerEmail : 'owner@pgfinder.com';

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      userId: user ? user.userId : `guest-${Date.now()}`,
      userName: user ? user.name : 'Prospective Resident',
      userEmail: user ? user.email : 'guest@example.com',
      userPhone: phone || (user ? '+91 98765 43210' : ''),
      ownerEmail,
      propertyId,
      propertyTitle,
      message,
      visitDate: visitDate || '',
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };

    store.enquiries.unshift(newEnquiry);

    const db = await connectDB();
    if (db.isConnected && user) {
      try {
        const mongoProp = await Property.findById(propertyId);
        if (mongoProp) {
          await Enquiry.create({
            user: user.userId,
            owner: mongoProp.owner,
            property: mongoProp._id,
            message,
            phone: newEnquiry.userPhone,
            visitDate,
            status: 'Pending',
          });
        }
      } catch (e) {
        // fallback handled
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry sent to property owner successfully',
      enquiry: newEnquiry,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send enquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }

    const memEnq = store.enquiries.find((e) => e.id === id);
    if (memEnq) {
      memEnq.status = status;
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Enquiry.findByIdAndUpdate(id, { status });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry status updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}
