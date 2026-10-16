import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
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
        const favs = await Favorite.find({ user: user.userId })
          .populate('property')
          .lean();
        const properties = favs.map((f: any) => ({
          ...f.property,
          id: f.property?._id?.toString() || f.property?.id,
          favoriteId: f._id.toString(),
        })).filter(Boolean);

        if (properties.length > 0) {
          return NextResponse.json({ success: true, favorites: properties });
        }
      } catch (e) {
        // proceed to memory fallback
      }
    }

    const userFavs = store.favorites.filter((f) => f.userId === user.userId);
    const properties = userFavs
      .map((f) => {
        const prop = store.properties.find((p) => p.id === f.propertyId);
        if (!prop) return null;
        return {
          ...prop,
          favoriteId: f.id,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, favorites: properties });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Please login to save favorites' }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }

    // Check if already favorited in store
    const existingIdx = store.favorites.findIndex(
      (f) => f.userId === user.userId && f.propertyId === propertyId
    );

    if (existingIdx !== -1) {
      // Toggle remove
      store.favorites.splice(existingIdx, 1);
      return NextResponse.json({ success: true, favorited: false, message: 'Removed from favorites' });
    }

    const newFav = {
      id: `fav-${Date.now()}`,
      userId: user.userId,
      propertyId,
      createdAt: new Date().toISOString(),
    };
    store.favorites.push(newFav);

    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Favorite.create({ user: user.userId, property: propertyId });
      } catch (e) {
        // fallback handled
      }
    }

    return NextResponse.json({ success: true, favorited: true, message: 'Added to favorites' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }

    const idx = store.favorites.findIndex(
      (f) => f.userId === user.userId && f.propertyId === propertyId
    );
    if (idx !== -1) {
      store.favorites.splice(idx, 1);
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Favorite.findOneAndDelete({ user: user.userId, property: propertyId });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, message: 'Removed from favorites' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
