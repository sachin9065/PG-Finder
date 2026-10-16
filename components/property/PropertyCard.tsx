'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import {
  Heart,
  MapPin,
  Star,
  ShieldCheck,
  Wifi,
  Wind,
  Utensils,
  Car,
  Tv,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface PropertyCardData {
  id: string;
  title: string;
  city: string;
  locality: string;
  rent: number;
  securityDeposit?: number;
  roomType: string;
  gender: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  availableRooms?: number;
  isFavorited?: boolean;
}

interface PropertyCardProps {
  property: PropertyCardData;
  onFavoriteChange?: (id: string, isFavorited: boolean) => void;
}

export default function PropertyCard({ property, onFavoriteChange }: PropertyCardProps) {
  const { user } = useAuth();
  const { toast, success } = useToast();
  const [isFavorited, setIsFavorited] = useState(property.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast('Please login to save properties to your favorites', 'info');
      return;
    }

    setLoadingFav(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFavorited(data.favorited);
        if (onFavoriteChange) {
          onFavoriteChange(property.id, data.favorited);
        }
        success(data.message || (data.favorited ? 'Saved to favorites' : 'Removed from favorites'));
      }
    } catch (e) {
      // optimistic fallback
      setIsFavorited(!isFavorited);
    } finally {
      setLoadingFav(false);
    }
  };

  const amenityIcons: Record<string, any> = {
    WiFi: <Wifi className="w-3.5 h-3.5" />,
    AC: <Wind className="w-3.5 h-3.5" />,
    Food: <Utensils className="w-3.5 h-3.5" />,
    Parking: <Car className="w-3.5 h-3.5" />,
  };

  const imageSrc =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80';

  const genderBadgeStyle =
    property.gender === 'Boys'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : property.gender === 'Girls'
      ? 'bg-pink-50 text-pink-700 border-pink-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center">
          {property.isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/95 text-white shadow-sm backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${genderBadgeStyle}`}
          >
            {property.gender}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          disabled={loadingFav}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-md ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Room Type Tag on bottom left of image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            {property.roomType} Sharing
          </span>
        </div>
      </div>

      {/* Property Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-900">{property.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400">({property.reviewsCount} reviews)</span>
            </div>

            {property.availableRooms !== undefined && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {property.availableRooms} {property.availableRooms === 1 ? 'room' : 'rooms'} left
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/pg/${property.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </p>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {property.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                {amenityIcons[amenity] || <Sparkles className="w-3 h-3 text-indigo-500" />}
                {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-400">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {formatPrice(property.rent)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/mo</span>
            </div>
          </div>

          <Link
            href={`/pg/${property.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm hover:shadow-indigo-500/20"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
