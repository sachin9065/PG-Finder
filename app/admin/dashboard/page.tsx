'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck,
  Users,
  Building2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Eye,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalProperties: 0,
    pendingProperties: 0,
    totalEnquiries: 0,
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [statsRes, propsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/properties?status='), // all statuses
      ]);

      const statsData = await statsRes.json();
      const propsData = await propsRes.json();

      if (statsData.success && statsData.stats) {
        setStats(statsData.stats);
      }
      if (propsData.success && propsData.properties) {
        setProperties(propsData.properties);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const toggleVerification = async (id: string, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isVerified: !currentVerified } : p))
        );
        success(!currentVerified ? 'Property verified & approved!' : 'Verification removed');
      }
    } catch (e) {
      toastError('Failed to update verification status');
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing from the platform?')) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        success('Property listing removed by admin');
      }
    } catch (e) {
      toastError('Failed to remove property');
    }
  };

  const handleTriggerSeed = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        success('Platform successfully reseeded with 12+ verified listings!');
        loadAdminData();
      }
    } catch (e) {
      toastError('Seeding failed');
    }
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.locality.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading admin console...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Super Admin Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Moderation & Verification
          </h1>
          <p className="text-xs text-slate-400">
            Monitor users, audit room quality, and approve verified property listings.
          </p>
        </div>

        <button
          onClick={handleTriggerSeed}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          Reseed Demo Database
        </button>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalUsers || 240}</p>
          <span className="text-xs text-blue-600 font-semibold">Active Tenants</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Owners
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalOwners || 35}</p>
          <span className="text-xs text-purple-600 font-semibold">Property Managers</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Properties
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{properties.length}</p>
          <span className="text-xs text-emerald-600 font-semibold">Available on search</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Audit
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {properties.filter((p) => !p.isVerified).length}
          </p>
          <span className="text-xs text-amber-600 font-semibold">Requires verification</span>
        </div>
      </div>

      {/* Property Moderation Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Property Moderation Table</h2>
            <p className="text-xs text-slate-500">Audit authenticity and 1-click approve verified badges</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or city..."
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-bold">Property</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">Rent</th>
                <th className="py-3 px-4 font-bold">Owner Contact</th>
                <th className="py-3 px-4 font-bold">Verification Badge</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'}
                          alt={prop.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/pg/${prop.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 block text-xs truncate max-w-xs"
                        >
                          {prop.title}
                        </Link>
                        <span className="text-[10px] text-slate-400">
                          {prop.propertyType} • {prop.gender}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {prop.locality}, {prop.city}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatPrice(prop.rent)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <p className="font-semibold text-slate-800">{prop.ownerName}</p>
                    <p className="text-[10px] text-slate-400">{prop.ownerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleVerification(prop.id, prop.isVerified)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        prop.isVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{prop.isVerified ? 'Verified' : 'Pending Audit'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/pg/${prop.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 inline-block"
                      title="View listing"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProperty(prop.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
