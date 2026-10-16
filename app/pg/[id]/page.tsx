'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Wifi,
  Wind,
  Utensils,
  Car,
  Tv,
  Zap,
  Camera,
  Shirt,
  Dumbbell,
  Sparkles,
  Phone,
  Mail,
  User,
  Clock,
  Send,
  X,
  Building,
  Navigation,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyType: string;
  gender: string;
  address: string;
  city: string;
  locality: string;
  rent: number;
  securityDeposit: number;
  roomType: string;
  availableRooms: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  status: string;
  houseRules: string[];
  nearbyPlaces: Array<{ name: string; distance: string }>;
  coordinates?: { lat: number; lng: number };
}

interface ReviewItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast, success, error: toastError } = useToast();

  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Enquiry Form State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState(
    'Hi, I am interested in this PG. Is a room currently available for immediate move-in?'
  );
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryDate, setEnquiryDate] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const propertyId = params.id as string;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [propRes, revRes] = await Promise.all([
          fetch(`/api/properties/${propertyId}`),
          fetch(`/api/reviews?propertyId=${propertyId}`),
        ]);

        const propData = await propRes.json();
        const revData = await revRes.json();

        if (propData.success && propData.property) {
          setProperty(propData.property);
        }

        if (revData.success && revData.reviews) {
          setReviews(revData.reviews);
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [propertyId]);

  const toggleFavorite = async () => {
    if (!user) {
      toast('Please login to save properties to your favorites', 'info');
      return;
    }
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFavorited(data.favorited);
        success(data.favorited ? 'Added to your favorites' : 'Removed from favorites');
      }
    } catch (e) {
      setIsFavorited(!isFavorited);
    }
  };

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryMessage.trim()) {
      toastError('Please enter a message');
      return;
    }

    setSubmittingEnquiry(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          message: enquiryMessage,
          phone: enquiryPhone,
          visitDate: enquiryDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success('Enquiry sent to property owner successfully!');
        setEnquiryModalOpen(false);
        setEnquiryMessage('');
      } else {
        toastError(data.error || 'Failed to send enquiry');
      }
    } catch (err: any) {
      toastError(err.message || 'Error submitting enquiry');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please login to post a review', 'info');
      router.push('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toastError('Please write your review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setReviewComment('');
        success('Review submitted successfully!');
        if (property) {
          setProperty({
            ...property,
            reviewsCount: property.reviewsCount + 1,
          });
        }
      } else {
        toastError(data.error || 'Failed to submit review');
      }
    } catch (err: any) {
      toastError(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const amenityIconMap: Record<string, any> = {
    WiFi: <Wifi className="w-5 h-5 text-indigo-600" />,
    AC: <Wind className="w-5 h-5 text-blue-600" />,
    Food: <Utensils className="w-5 h-5 text-emerald-600" />,
    Laundry: <Shirt className="w-5 h-5 text-purple-600" />,
    Parking: <Car className="w-5 h-5 text-amber-600" />,
    Gym: <Dumbbell className="w-5 h-5 text-rose-600" />,
    CCTV: <Camera className="w-5 h-5 text-teal-600" />,
    'Power Backup': <Zap className="w-5 h-5 text-yellow-600" />,
    Housekeeping: <Sparkles className="w-5 h-5 text-indigo-600" />,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <Building className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-sm text-slate-500">The property you are looking for might have been moved or removed.</p>
        <Link
          href="/explore"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700"
        >
          Explore Other PGs
        </Link>
      </div>
    );
  }

  const galleryImages =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href={`/explore?city=${property.city}`} className="hover:text-indigo-600">{property.city}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate">{property.title}</span>
      </nav>

      {/* Title & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {property.isVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Property
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {property.gender} Accommodation
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {property.roomType} Sharing
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{property.address}, {property.locality}, {property.city}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition shadow-sm font-semibold text-xs ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: property.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                success('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 1. Large Image Gallery */}
      <section className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-md">
          <Image
            src={galleryImages[activeImageIdx]}
            alt={property.title}
            fill
            priority
            className="object-cover transition-all duration-300"
          />
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold">
            Photo {activeImageIdx + 1} of {galleryImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                  activeImageIdx === i ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content Layout: 8 cols details + 4 cols sticky contact card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-10">
          {/* Key Metrics Overview Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Monthly Rent</span>
              <p className="text-xl font-extrabold text-slate-900">{formatPrice(property.rent)}</p>
              <span className="text-[11px] text-slate-500">Per Resident</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Security Deposit</span>
              <p className="text-xl font-extrabold text-slate-900">{formatPrice(property.securityDeposit || 0)}</p>
              <span className="text-[11px] text-slate-500">Refundable</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Room Type</span>
              <p className="text-xl font-extrabold text-indigo-600">{property.roomType}</p>
              <span className="text-[11px] text-slate-500">Occupancy</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Available</span>
              <p className="text-xl font-extrabold text-emerald-600">{property.availableRooms} Rooms</p>
              <span className="text-[11px] text-slate-500">Ready to occupy</span>
            </div>
          </div>

          {/* Description Section */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About this Property</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {property.description}
            </p>
          </section>

          {/* Amenities Grid */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Offered Amenities</h2>
              <p className="text-xs text-slate-500 mt-1">All inclusive amenities provided with your monthly rent</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                    {amenityIconMap[amenity] || <Sparkles className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{amenity}</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Included</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* House Rules */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">House Rules & Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.houseRules && property.houseRules.length > 0 ? (
                property.houseRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Standard community guidelines apply.</p>
              )}
            </div>
          </section>

          {/* Nearby Locations */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Nearby Essentials & Commute</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.nearbyPlaces && property.nearbyPlaces.length > 0 ? (
                property.nearbyPlaces.map((place, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <Navigation className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-slate-800">{place.name}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {place.distance}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Conveniently connected to bus stops and markets.</p>
              )}
            </div>
          </section>

          {/* Location & Map Placeholder */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Property Location</h2>
            <div className="relative aspect-[16/8] w-full rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-3 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{property.locality}, {property.city}</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">{property.address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${property.title} ${property.address} ${property.city}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-indigo-600 shadow-sm hover:bg-slate-50 transition"
              >
                Open in Google Maps
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Resident Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-900">{property.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">({reviews.length} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handlePostReview} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-sm font-bold text-slate-800">Leave a Review</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= reviewRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience regarding food, WiFi, safety, and cleanliness..."
                rows={3}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this property!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                          <p className="text-[10px] text-slate-400">Verified Resident</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Desktop Sticky Contact & Booking Card */}
        <aside className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium">Rent per month</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">{formatPrice(property.rent)}</span>
                  <span className="text-xs text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Zero Brokerage
              </span>
            </div>

            {/* Key Inclusions */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span>Security Deposit</span>
                <span className="font-bold text-slate-900">{formatPrice(property.securityDeposit)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span>Room Sharing</span>
                <span className="font-bold text-slate-900">{property.roomType} Sharing</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span>Lock-in Period</span>
                <span className="font-bold text-slate-900">1 Month Notice</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Contact Owner / Schedule Visit</span>
              </button>

              <button
                onClick={toggleFavorite}
                className={`w-full py-3 px-4 rounded-2xl border text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
                <span>{isFavorited ? 'Saved in Favorites' : 'Save Property'}</span>
              </button>
            </div>

            {/* Verified Owner Info Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  {property.ownerName ? property.ownerName.charAt(0) : 'O'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{property.ownerName || 'Verified Host'}</h4>
                  <p className="text-[10px] text-emerald-600 font-medium">Verified Property Partner</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Avg response: 15 mins
                </span>
                <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setEnquiryModalOpen(true)}>
                  Direct Chat
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Enquiry Modal */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEnquiryModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-slide-up space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Send Enquiry to Owner</h3>
                <p className="text-xs text-slate-500 mt-0.5">{property.title}</p>
              </div>
              <button
                onClick={() => setEnquiryModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Visit Date (Optional)
                </label>
                <input
                  type="date"
                  value={enquiryDate}
                  onChange={(e) => setEnquiryDate(e.target.value)}
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  required
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {submittingEnquiry ? 'Sending...' : 'Send Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
