'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard, { PropertyCardData } from '@/components/property/PropertyCard';
import FilterSidebar, { FilterState } from '@/components/filters/FilterSidebar';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Building2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    city: searchParams.get('city') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    roomType: searchParams.get('roomType') || '',
    gender: searchParams.get('gender') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
    rating: searchParams.get('rating') || '',
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setFilters({
      city: searchParams.get('city') || '',
      minRent: searchParams.get('minRent') || '',
      maxRent: searchParams.get('maxRent') || '',
      roomType: searchParams.get('roomType') || '',
      gender: searchParams.get('gender') || '',
      amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
      rating: searchParams.get('rating') || '',
    });
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'recommended');
  }, [searchParams]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.minRent) params.set('minRent', filters.minRent);
      if (filters.maxRent) params.set('maxRent', filters.maxRent);
      if (filters.roomType) params.set('roomType', filters.roomType);
      if (filters.gender) params.set('gender', filters.gender);
      if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
      if (filters.rating) params.set('rating', filters.rating);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (sortBy) params.set('sort', sortBy);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.properties) {
        setProperties(data.properties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, sortBy]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateUrlParams = (newFilters: FilterState, newSort = sortBy, newSearch = searchQuery) => {
    const params = new URLSearchParams();
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.minRent) params.set('minRent', newFilters.minRent);
    if (newFilters.maxRent) params.set('maxRent', newFilters.maxRent);
    if (newFilters.roomType) params.set('roomType', newFilters.roomType);
    if (newFilters.gender) params.set('gender', newFilters.gender);
    if (newFilters.amenities.length > 0) params.set('amenities', newFilters.amenities.join(','));
    if (newFilters.rating) params.set('rating', newFilters.rating);
    if (newSearch.trim()) params.set('search', newSearch.trim());
    if (newSort && newSort !== 'recommended') params.set('sort', newSort);

    router.push(`/explore?${params.toString()}`);
  };

  const handleApply = () => {
    updateUrlParams(filters);
    setMobileFilterOpen(false);
  };

  const handleClear = () => {
    const cleared: FilterState = {
      city: '',
      minRent: '',
      maxRent: '',
      roomType: '',
      gender: '',
      amenities: [],
      rating: '',
    };
    setFilters(cleared);
    setSearchQuery('');
    setSortBy('recommended');
    router.push('/explore');
    setMobileFilterOpen(false);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateUrlParams(filters, newSort);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Discoveries
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore PGs & Hostels
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through hundreds of student and professional accommodations.
          </p>
        </div>

        {/* Search Input in explore header */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateUrlParams(filters, sortBy, searchQuery);
              }
            }}
            placeholder="Search by locality or title..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (col-span-4 or 3) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24">
          <FilterSidebar
            filters={filters}
            onChange={(f) => setFilters(f)}
            onApply={handleApply}
            onClear={handleClear}
          />
        </aside>

        {/* Right Listings Area (col-span-8 or 9) */}
        <section className="lg:col-span-8 space-y-6">
          {/* Controls Bar: Mobile filter button + Result count + Sort dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {(filters.city || filters.gender || filters.roomType || filters.amenities.length > 0) && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                )}
              </button>

              <p className="text-sm font-bold text-slate-800">
                <span className="text-indigo-600">{properties.length}</span> PGs found
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-dropdown" className="text-xs font-medium text-slate-500 hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(filters.city || filters.gender || filters.roomType || filters.amenities.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Active filters:</span>
              {filters.city && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  City: {filters.city}
                  <button onClick={() => { const next = { ...filters, city: '' }; setFilters(next); updateUrlParams(next); }}>
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {filters.gender && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {filters.gender}
                  <button onClick={() => { const next = { ...filters, gender: '' }; setFilters(next); updateUrlParams(next); }}>
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {filters.roomType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {filters.roomType} Sharing
                  <button onClick={() => { const next = { ...filters, roomType: '' }; setFilters(next); updateUrlParams(next); }}>
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}
              {filters.amenities.map((am) => (
                <span key={am} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {am}
                  <button onClick={() => { const next = { ...filters, amenities: filters.amenities.filter((a) => a !== am) }; setFilters(next); updateUrlParams(next); }}>
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              ))}
              <button
                onClick={handleClear}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Reset
              </button>
            </div>
          )}

          {/* Listings Grid or Loading Skeleton or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No PGs match your filters</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try widening your budget range, checking another locality, or resetting your filter criteria.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-lg font-bold text-slate-900">Filter Properties</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                onChange={(f) => setFilters(f)}
                onApply={handleApply}
                onClear={handleClear}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
          Loading explore page...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
