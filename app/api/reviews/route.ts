import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Property from '@/models/Property';
import { getUserFromRequest } from '@/lib/auth';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        const reviews = await Review.find({ property: propertyId })
          .populate('user', 'name avatar')
          .sort({ createdAt: -1 })
          .lean();
        if (reviews.length > 0) {
          const formatted = reviews.map((r: any) => ({
            id: r._id.toString(),
            propertyId,
            userId: r.user?._id?.toString(),
            userName: r.user?.name || 'Resident',
            userAvatar: r.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=User`,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
          }));
          return NextResponse.json({ success: true, reviews: formatted });
        }
      } catch (e) {}
    }

    const memReviews = store.reviews.filter((r) => r.propertyId === propertyId);
    return NextResponse.json({ success: true, reviews: memReviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Please login to leave a review' }, { status: 401 });
    }

    const { propertyId, rating, comment } = await req.json();
    if (!propertyId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Please provide rating and comment' },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      propertyId,
      userId: user.userId,
      userName: user.name,
      userAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
      rating: numRating,
      comment,
      createdAt: new Date().toISOString(),
    };

    store.reviews.unshift(newReview);

    // Recalculate property rating in memory
    const allPropReviews = store.reviews.filter((r) => r.propertyId === propertyId);
    const avgRating = Number(
      (allPropReviews.reduce((sum, r) => sum + r.rating, 0) / allPropReviews.length).toFixed(1)
    );
    const targetProp = store.properties.find((p) => p.id === propertyId);
    if (targetProp) {
      targetProp.rating = avgRating;
      targetProp.reviewsCount = allPropReviews.length;
    }

    const db = await connectDB();
    if (db.isConnected) {
      try {
        await Review.create({
          user: user.userId,
          property: propertyId,
          rating: numRating,
          comment,
        });
        await Property.findByIdAndUpdate(propertyId, {
          $inc: { reviewsCount: 1 },
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: 'Review posted successfully',
      review: newReview,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to post review' },
      { status: 500 }
    );
  }
}
