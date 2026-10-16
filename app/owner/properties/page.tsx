'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import {
  Building2,
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  AlertTriangle,
  X,
  BedDouble,
  ArrowRight,
} from 'lucide-react';

export default function OwnerPropertiesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'owner' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?ownerEmail=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success && data.properties) {
        setProperties(data.properties);
      }
    } catch (e) {
      console.error('Failed to load owner properties', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
        );
        success(`Property marked as ${nextStatus}`);
      }
    } catch (e) {
      toastError('Failed to update status');
    }
  };

  const confirmDelete = (prop: any) => {
    setPropertyToDelete(prop);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
        success('Property deleted successfully');
        setDeleteModalOpen(false);
        setPropertyToDelete(null);
      } else {
        toastError(data.error || 'Failed to delete');
      }
    } catch (e) {
      toastError('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Listings Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My PG Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View, edit, or adjust room vacancies and live discovery statuses.
          </p>
        </div>

        <Link
          href="/owner/add-property"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {/* Properties List / Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your listings...</div>
      ) : properties.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No properties listed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by adding your first PG, hostel, or flat with photos and amenities.
          </p>
          <Link
            href="/owner/add-property"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6 font-bold">Property</th>
                  <th className="py-3.5 px-4 font-bold">City & Locality</th>
                  <th className="py-3.5 px-4 font-bold">Rent</th>
                  <th className="py-3.5 px-4 font-bold">Available Rooms</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
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
                            className="font-bold text-slate-900 hover:text-indigo-600 truncate max-w-xs block text-sm"
                          >
                            {prop.title}
                          </Link>
                          <span className="text-[10px] text-slate-400">
                            {prop.propertyType} • {prop.gender} • {prop.roomType} Sharing
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.locality}, {prop.city}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {formatPrice(prop.rent)}/mo
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                        <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
                        {prop.availableRooms} Left
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(prop.id, prop.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition ${
                          prop.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {prop.status === 'Active' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Live (Active)
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            Paused (Inactive)
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/pg/${prop.id}`}
                          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="View Live Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(prop)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-slide-up space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Property Listing?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete &quot;{propertyToDelete.title}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
