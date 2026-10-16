'use client';

import React from 'react';
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Users,
  Sparkles,
  Star,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export interface FilterState {
  city: string;
  minRent: string;
  maxRent: string;
  roomType: string;
  gender: string;
  amenities: string[];
  rating: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

const ALL_AMENITIES = [
  'WiFi',
  'AC',
  'Food',
  'Laundry',
  'Parking',
  'Gym',
  'Power Backup',
  'CCTV',
  'Housekeeping',
];

const CITIES = ['All Cities', 'Bangalore', 'Delhi', 'Gurgaon', 'Pune', 'Hyderabad', 'Mumbai', 'Noida'];

export default function FilterSidebar({
  filters,
  onChange,
  onApply,
  onClear,
}: FilterSidebarProps) {
  const toggleAmenity = (amenity: string) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: next });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Filters</h3>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* 1. Location / City */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
          City
        </label>
        <select
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value === 'All Cities' ? '' : e.target.value })}
          className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
        >
          {CITIES.map((c) => (
            <option key={c} value={c === 'All Cities' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Rent Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
          Monthly Rent (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Min Rent</span>
            <input
              type="number"
              value={filters.minRent}
              onChange={(e) => onChange({ ...filters, minRent: e.target.value })}
              placeholder="Min (5000)"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Max Rent</span>
            <input
              type="number"
              value={filters.maxRent}
              onChange={(e) => onChange({ ...filters, maxRent: e.target.value })}
              placeholder="Max (25000)"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Gender */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          Gender / Accommodation
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['', 'Boys', 'Girls', 'Co-Living'].map((g) => {
            const label = g === '' ? 'All' : g;
            const isSelected = filters.gender === g;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange({ ...filters, gender: g })}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border transition text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Room Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
          Room Sharing
        </label>
        <div className="space-y-1.5">
          {['', 'Single', 'Double', 'Triple'].map((r) => {
            const label = r === '' ? 'Any Room Type' : `${r} Sharing`;
            return (
              <label
                key={label}
                className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg"
              >
                <input
                  type="radio"
                  name="roomType"
                  checked={filters.roomType === r}
                  onChange={() => onChange({ ...filters, roomType: r })}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Amenities */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALL_AMENITIES.map((amenity) => {
            const checked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className={`flex items-center gap-2 text-xs font-medium p-2 rounded-xl border cursor-pointer transition ${
                  checked
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                    : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="truncate">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Minimum Rating */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {['', '4.0', '4.5', '4.8'].map((starVal) => {
            const isSelected = filters.rating === starVal;
            const label = starVal === '' ? 'Any' : `${starVal}+ ★`;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange({ ...filters, rating: starVal })}
                className={`py-1.5 text-xs font-semibold rounded-xl border transition ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply Filters CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onApply}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition active:scale-[0.98]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
