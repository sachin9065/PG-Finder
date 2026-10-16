import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import { getUserFromRequest } from '@/lib/auth';
import { store } from '@/lib/store';
import { SeedProperty } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const city = searchParams.get('city')?.toLowerCase() || '';
    const locality = searchParams.get('locality')?.toLowerCase() || '';
    const minRent = searchParams.get('minRent') ? Number(searchParams.get('minRent')) : 0;
    const maxRent = searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : Infinity;
    const roomType = searchParams.get('roomType') || '';
    const gender = searchParams.get('gender') || '';
    const amenitiesParam = searchParams.get('amenities');
    const amenities = amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : [];
    const minRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
    const sort = searchParams.get('sort') || 'recommended';
    const ownerEmail = searchParams.get('ownerEmail') || '';
    const status = searchParams.get('status') || '';

    const db = await connectDB();

    if (db.isConnected) {
      const query: any = {};

      if (status) {
        query.status = status;
      } else if (!ownerEmail) {
        query.status = 'Active';
      }

      if (city) {
        query.city = { $regex: new RegExp(city, 'i') };
      }
      if (locality) {
        query.locality = { $regex: new RegExp(locality, 'i') };
      }
      if (roomType) {
        query.roomType = roomType;
      }
      if (gender) {
        query.gender = gender;
      }
      if (minRating > 0) {
        query.rating = { $gte: minRating };
      }

      query.rent = { $gte: minRent };
      if (maxRent < Infinity) {
        query.rent.$lte = maxRent;
      }

      if (amenities.length > 0) {
        query.amenities = { $all: amenities };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { locality: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { rent: 1 };
      if (sort === 'price_desc') sortOption = { rent: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };

      const properties = await Property.find(query)
        .populate('owner', 'name email phone avatar')
        .sort(sortOption)
        .lean();

      // If mongo has data, return
      if (properties.length > 0 || city || search) {
        const formatted = properties.map((p: any) => ({
          ...p,
          id: p._id.toString(),
          ownerName: p.owner?.name || 'Verified Host',
          ownerEmail: p.owner?.email || 'owner@pgfinder.com',
          ownerPhone: p.owner?.phone || '+91 98112 34567',
        }));
        return NextResponse.json({ success: true, count: formatted.length, properties: formatted });
      }
    }

    // In-memory filter logic
    let list: SeedProperty[] = [...store.properties];

    if (ownerEmail) {
      list = list.filter((p) => p.ownerEmail.toLowerCase() === ownerEmail.toLowerCase());
    } else if (status) {
      list = list.filter((p) => p.status === status);
    } else {
      // By default show Active properties
      list = list.filter((p) => p.status === 'Active');
    }

    if (city) {
      list = list.filter((p) => p.city.toLowerCase().includes(city));
    }
    if (locality) {
      list = list.filter((p) => p.locality.toLowerCase().includes(locality));
    }
    if (search) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.locality.toLowerCase().includes(search) ||
          p.city.toLowerCase().includes(search) ||
          p.address.toLowerCase().includes(search)
      );
    }
    if (roomType) {
      list = list.filter((p) => p.roomType.toLowerCase() === roomType.toLowerCase());
    }
    if (gender) {
      list = list.filter((p) => p.gender.toLowerCase() === gender.toLowerCase());
    }
    if (minRent > 0) {
      list = list.filter((p) => p.rent >= minRent);
    }
    if (maxRent < Infinity) {
      list = list.filter((p) => p.rent <= maxRent);
    }
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }
    if (amenities.length > 0) {
      list = list.filter((p) => amenities.every((a) => p.amenities.includes(a)));
    }

    // Sorting
    if (sort === 'price_asc') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // recommended: verified first, then highest rating
      list.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || b.rating - a.rating);
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      properties: list,
    });
  } catch (error: any) {
    console.error('Properties GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only PG owners or admins can add listings.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      propertyType,
      gender,
      address,
      city,
      locality,
      rent,
      securityDeposit,
      roomType,
      availableRooms,
      amenities,
      images,
      houseRules,
      nearbyPlaces,
      status = 'Active',
    } = body;

    if (!title || !city || !locality || !rent || !roomType || !gender) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const defaultImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    ];

    const propertyObj: SeedProperty = {
      id: `prop-${Date.now()}`,
      title,
      description: description || 'Well-maintained PG with all modern amenities.',
      ownerName: user.name,
      ownerEmail: user.email,
      ownerPhone: '+91 98112 34567',
      propertyType: propertyType || 'PG',
      gender: gender || 'Co-Living',
      address,
      city,
      locality,
      rent: Number(rent),
      securityDeposit: Number(securityDeposit || 0),
      roomType: roomType || 'Single',
      availableRooms: Number(availableRooms || 1),
      amenities: amenities || ['WiFi', 'Food'],
      images: defaultImages,
      rating: 4.8,
      reviewsCount: 1,
      isVerified: user.role === 'admin' ? true : false,
      status: status || 'Active',
      houseRules: houseRules || ['No smoking inside premises', 'Entry closed at 11 PM'],
      nearbyPlaces: nearbyPlaces || [{ name: 'Metro Station', distance: '500m' }],
      coordinates: { lat: 12.9716, lng: 77.5946 },
    };

    // Save in store
    store.properties.unshift(propertyObj);

    // Save in MongoDB if connected
    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Property.create({
          title: propertyObj.title,
          description: propertyObj.description,
          owner: user.userId,
          propertyType: propertyObj.propertyType,
          gender: propertyObj.gender,
          address: propertyObj.address,
          city: propertyObj.city,
          locality: propertyObj.locality,
          rent: propertyObj.rent,
          securityDeposit: propertyObj.securityDeposit,
          roomType: propertyObj.roomType,
          availableRooms: propertyObj.availableRooms,
          amenities: propertyObj.amenities,
          images: propertyObj.images,
          rating: propertyObj.rating,
          reviewsCount: propertyObj.reviewsCount,
          isVerified: propertyObj.isVerified,
          status: propertyObj.status,
          houseRules: propertyObj.houseRules,
          nearbyPlaces: propertyObj.nearbyPlaces,
          coordinates: propertyObj.coordinates,
        });
      } catch (e: any) {
        console.warn('Mongo property creation warning:', e.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      property: propertyObj,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Property POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}
