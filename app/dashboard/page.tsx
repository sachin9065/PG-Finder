'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/lib/utils';
import PropertyCard, { PropertyCardData } from '@/components/property/PropertyCard';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Building2,
  Calendar,
  Phone,
  Mail,
  Shield,
  Search,
} from 'lucide-react';

interface EnquiryItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  ownerEmail: string;
  message: string;
  visitDate?: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  createdAt: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const { user, loading: authLoading, logout } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [favorites, setFavorites] = useState<PropertyCardData[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile update form states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      setLoadingData(true);
      try {
        const [favRes, enqRes] = await Promise.all([
          fetch('/api/favorites'),
          fetch('/api/enquiries'),
        ]);
        const favData = await favRes.json();
        const enqData = await enqRes.json();

        if (favData.success && favData.favorites) {
          setFavorites(favData.favorites);
        }
        if (enqData.success && enqData.enquiries) {
          setEnquiries(enqData.enquiries);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadUserData();
  }, [user]);

  const removeFavorite = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/favorites?propertyId=${propertyId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
        success('Removed from saved PGs');
      }
    } catch (e) {
      toastError('Failed to remove favorite');
    }
  };

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading your dashboard...
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'favorites', label: 'Saved PGs', icon: Heart, count: favorites.length },
    { id: 'enquiries', label: 'My Enquiries', icon: MessageSquare, count: enquiries.length },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-6">
          {/* User Brief Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md overflow-hidden">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="border-t border-slate-100 my-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Tenant Dashboard
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Hello, {user.name.split(' ')[0]}!
                  </h2>
                  <p className="text-sm text-indigo-200 max-w-lg leading-relaxed">
                    Track your shortlisted PGs, monitor your visit enquiries, and contact hosts directly.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 block">Saved Accommodations</span>
                  <p className="text-2xl font-black text-slate-900">{favorites.length}</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 block">Enquiries Sent</span>
                  <p className="text-2xl font-black text-slate-900">{enquiries.length}</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 block">Account Status</span>
                  <p className="text-xl font-bold text-emerald-600">Active Tenant</p>
                </div>
              </div>

              {/* Shortlisted Highlights */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg">Recently Saved PGs</h3>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View All ({favorites.length})
                  </button>
                </div>

                {favorites.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
                    <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No saved PGs yet</p>
                    <p className="text-xs text-slate-400">Browse verified listings and click the heart icon to save.</p>
                    <Link
                      href="/explore"
                      className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                    >
                      Browse PGs
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.slice(0, 2).map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Saved Accommodations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {favorites.length} properties saved to your shortlist
                  </p>
                </div>
                <Link
                  href="/explore"
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition"
                >
                  Explore More PGs
                </Link>
              </div>

              {favorites.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Save properties while browsing so you can compare prices and amenities in one place.
                  </p>
                  <Link
                    href="/explore"
                    className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                  >
                    Explore Listings
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((prop) => (
                    <div key={prop.id} className="relative group">
                      <PropertyCard property={prop} />
                      <button
                        onClick={() => removeFavorite(prop.id)}
                        className="absolute top-4 right-14 z-10 p-2 rounded-full bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white shadow-md transition"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Enquiries</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track communication with property managers and schedule visits
                </p>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No enquiries sent yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you contact a property owner or schedule a visit, your enquiry will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <Link
                            href={`/pg/${enq.propertyId}`}
                            className="text-base font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1.5"
                          >
                            <span>{enq.propertyTitle}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">Owner: {enq.ownerEmail}</p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enq.status === 'Contacted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : enq.status === 'Closed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            Status: {enq.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        &quot;{enq.message}&quot;
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Sent: {formatDate(enq.createdAt)}
                          </span>
                          {enq.visitDate && (
                            <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                              <Calendar className="w-3.5 h-3.5" />
                              Requested Visit: {enq.visitDate}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/pg/${enq.propertyId}`}
                          className="font-semibold text-indigo-600 hover:underline"
                        >
                          View Property Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage your account details and contact preferences</p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full text-sm font-medium bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Email cannot be changed directly</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.role}
                    className="w-full text-sm font-medium bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 uppercase cursor-not-allowed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => success('Profile preferences updated successfully!')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage notifications and security preferences</p>
              </div>

              <div className="space-y-4 max-w-lg divide-y divide-slate-100">
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Email Notifications</h4>
                    <p className="text-xs text-slate-500">Receive owner responses and rent alerts via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">SMS / WhatsApp Alerts</h4>
                    <p className="text-xs text-slate-500">Get scheduled visit reminders on phone</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                  >
                    Sign out of this device
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
