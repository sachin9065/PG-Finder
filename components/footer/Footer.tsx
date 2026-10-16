import React from 'react';
import Link from 'next/link';
import Logo from '../navbar/Logo';
import { Github, Linkedin, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M12 21c3.5-3.5 6-7.5 6-11a6 6 0 0 0-12 0c0 3.5 2.5 7.5 6 11z" />
                  <path d="M9.5 10l2.5-2.5 2.5 2.5" />
                  <path d="M10 12.5h4v3.5h-4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white font-sans tracking-tight">
                PG<span className="text-indigo-400">Finder</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              &quot;Find a place that feels like home.&quot; India&apos;s most trusted platform for verified PG, hostel, and room rental discovery tailored for students and working professionals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-indigo-400 transition">
                  Browse All PGs
                </Link>
              </li>
              <li>
                <Link href="/explore?gender=Boys" className="hover:text-indigo-400 transition">
                  Boys PG
                </Link>
              </li>
              <li>
                <Link href="/explore?gender=Girls" className="hover:text-indigo-400 transition">
                  Girls PG
                </Link>
              </li>
              <li>
                <Link href="/explore?gender=Co-Living" className="hover:text-indigo-400 transition">
                  Co-Living Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Top Cities</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore?city=Bangalore" className="hover:text-indigo-400 transition">
                  PG in Bangalore
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Delhi" className="hover:text-indigo-400 transition">
                  PG in Delhi
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Gurgaon" className="hover:text-indigo-400 transition">
                  PG in Gurgaon
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Pune" className="hover:text-indigo-400 transition">
                  PG in Pune
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Hyderabad" className="hover:text-indigo-400 transition">
                  PG in Hyderabad
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Mumbai" className="hover:text-indigo-400 transition">
                  PG in Mumbai
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Property Owners & Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Owners & Info</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register?role=owner" className="text-indigo-400 font-medium hover:underline">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/owner/dashboard" className="hover:text-indigo-400 transition">
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-indigo-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-indigo-400 transition">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PGFinder Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for young dreamers & builders.
          </p>
        </div>
      </div>
    </footer>
  );
}
