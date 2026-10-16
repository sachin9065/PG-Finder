'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, IndianRupee, BedDouble, ChevronDown } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (city.trim()) {
      params.set('city', city.trim());
    }

    if (budgetRange) {
      const [min, max] = budgetRange.split('-');
      if (min) params.set('minRent', min);
      if (max && max !== 'above') params.set('maxRent', max);
    }

    if (roomType) {
      params.set('roomType', roomType);
    }

    router.push(`/explore?${params.toString()}`);
  };

  const cities = ['Bangalore', 'Delhi', 'Gurgaon', 'Pune', 'Hyderabad', 'Mumbai', 'Noida'];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-xl shadow-indigo-950/5 border border-slate-200/80">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Location / City field */}
        <div className="md:col-span-4 relative group">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="hero-city-input" className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Location
              </label>
              <input
                id="hero-city-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city or locality (e.g. Bangalore)"
                className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Budget Field */}
        <div className="md:col-span-3 relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <IndianRupee className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="hero-budget-select" className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Monthly Budget
              </label>
              <select
                id="hero-budget-select"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="0-8000">Under ₹8,000</option>
                <option value="8000-12000">₹8,000 - ₹12,000</option>
                <option value="12000-18000">₹12,000 - ₹18,000</option>
                <option value="18000-above">₹18,000 & Above</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room Type Field */}
        <div className="md:col-span-3 relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <BedDouble className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="hero-room-type-select" className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Room Sharing
              </label>
              <select
                id="hero-room-type-select"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="">All Room Types</option>
                <option value="Single">Single Room</option>
                <option value="Double">Double Sharing</option>
                <option value="Triple">Triple Sharing</option>
              </select>
            </div>
          </div>
        </div>

        {/* CTA Search Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full h-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search PGs</span>
          </button>
        </div>
      </form>

      {/* Quick popular city pills */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-400">Popular:</span>
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCity(c);
              router.push(`/explore?city=${c}`);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition text-slate-600"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
