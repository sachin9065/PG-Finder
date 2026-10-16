'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  Clock,
  PlusCircle,
  Users,
  MessageSquare,
  TrendingUp,
  ExternalLink,
  BedDouble,
  LogOut,
  LayoutDashboard,
  Eye,
} from 'lucide-react';

const MONTHLY_ENQUIRY_DATA = [
  { month: 'Apr', enquiries: 12 },
  { month: 'May', enquiries: 19 },
  { month: 'Jun', enquiries: 28 },
  { month: 'Jul', enquiries: 42 },
  { month: 'Aug', enquiries: 36 },
  { month: 'Sep', enquiries: 54 },
];

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { success, error: toastError } = useToast();

  const [properties, setProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'owner' && user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadOwnerData() {
      if (!user) return;
      setLoading(true);
      try {
        const [propRes, enqRes] = await Promise.all([
          fetch(`/api/properties?ownerEmail=${encodeURIComponent(user.email)}`),
          fetch('/api/enquiries'),
        ]);

        const propData = await propRes.json();
        const enqData = await enqRes.json();

        if (propData.success && propData.properties) {
          setProperties(propData.properties);
        }
        if (enqData.success && enqData.enquiries) {
          setEnquiries(enqData.enquiries);
        }
      } catch (err) {
        console.error('Failed to load owner data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOwnerData();
  }, [user]);

  const updateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        success(`Enquiry marked as ${newStatus}`);
      }
    } catch (e) {
      toastError('Failed to update enquiry status');
    }
  };

  const activeProperties = properties.filter((p) => p.status === 'Active');
  const totalAvailableRooms = properties.reduce((sum, p) => sum + (p.availableRooms || 0), 0);

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading owner portal...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Owner Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your accommodations, occupancy rates, and tenant visit requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/owner/properties"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
          >
            My Listings ({properties.length})
          </Link>
          <Link
            href="/owner/add-property"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Property
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Properties
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{properties.length}</p>
          <span className="text-xs text-indigo-600 font-semibold">Under your management</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Listings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{activeProperties.length}</p>
          <span className="text-xs text-emerald-600 font-semibold">Live on discovery search</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{enquiries.length}</p>
          <span className="text-xs text-blue-600 font-semibold">Prospective tenants</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Rooms
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalAvailableRooms}</p>
          <span className="text-xs text-amber-600 font-semibold">Ready for occupancy</span>
        </div>
      </div>

      {/* Analytics Chart Section (Recharts) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tenant Enquiries Overview</h2>
            <p className="text-xs text-slate-500">Monthly inbound visit and booking enquiries</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            +32% MoM Growth
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_ENQUIRY_DATA}>
              <defs>
                <linearGradient id="enquiryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="enquiries"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#enquiryGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Inbound Tenant Enquiries */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Tenant Inquiries</h2>
            <p className="text-xs text-slate-500">Respond to prospective residents and manage visit schedules</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {enquiries.length} Active Leads
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm">No enquiries received yet for your properties.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="pb-3 font-bold">Tenant Details</th>
                  <th className="pb-3 font-bold">Property</th>
                  <th className="pb-3 font-bold">Message</th>
                  <th className="pb-3 font-bold">Visit Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 pr-3">
                      <p className="font-bold text-slate-900">{enq.userName}</p>
                      <p className="text-slate-400">{enq.userEmail}</p>
                      <p className="text-indigo-600 font-medium">{enq.userPhone || 'Phone upon visit'}</p>
                    </td>
                    <td className="py-3.5 pr-3 max-w-[160px]">
                      <Link
                        href={`/pg/${enq.propertyId}`}
                        className="font-semibold text-slate-800 hover:text-indigo-600 truncate block"
                      >
                        {enq.propertyTitle}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-3 max-w-[200px]">
                      <p className="text-slate-600 line-clamp-2 italic">&quot;{enq.message}&quot;</p>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-600">
                      {enq.visitDate ? (
                        <span className="font-semibold text-slate-800">{enq.visitDate}</span>
                      ) : (
                        <span className="text-slate-400">Not specified</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          enq.status === 'Contacted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : enq.status === 'Closed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1">
                      {enq.status === 'Pending' && (
                        <button
                          onClick={() => updateEnquiryStatus(enq.id, 'Contacted')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {enq.status === 'Contacted' && (
                        <button
                          onClick={() => updateEnquiryStatus(enq.id, 'Closed')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                        >
                          Close Lead
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
