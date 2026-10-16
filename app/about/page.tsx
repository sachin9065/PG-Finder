'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  Heart,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';

export default function AboutPage() {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const stats = [
    { label: 'Verified Listings', value: '1,200+' },
    { label: 'Happy Tenants', value: '15,000+' },
    { label: 'Partner Hosts', value: '350+' },
    { label: 'Metro Cities', value: '7' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      success('Thank you for reaching out! Our support team will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Find a place that feels like home.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          PGFinder was built with a clear purpose: to take the stress, deceit, and exorbitant
          brokerage fees out of finding student and working professional accommodation in India.
        </p>
      </section>

      {/* Stats Counter */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-1 shadow-sm"
          >
            <p className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono">{s.value}</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Core Values */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            What Drives Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Built by tenants, for tenants.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% In-Person Audited</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every single property listed on PGFinder undergoes strict verification checks for
              hygiene, security, and amenities.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Brokerage Forever</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We connect tenants directly with property owners and managers. Never pay a single rupee in
              brokerage commissions.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Transparent Community</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Authentic reviews, real food ratings, Wi-Fi speed insights, and verified house rules so
              there are zero surprises when you move in.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Get in Touch
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">We&apos;re here to help</h2>
            <p className="text-sm text-slate-500">
              Have questions about a listing or want to partner with us as a PG owner?
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Email Support</p>
                <p className="text-sm font-bold text-slate-900">support@pgfinder.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Customer Care</p>
                <p className="text-sm font-bold text-slate-900">+91 98765 43210 (9 AM - 8 PM)</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Headquarters</p>
                <p className="text-sm font-bold text-slate-900">Koramangala 4th Block, Bangalore, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Send us a direct message</h3>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Deshmukh"
                className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Message
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you today?"
                className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Sending...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
