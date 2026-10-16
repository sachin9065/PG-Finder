import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 transition ${className}`}>
      {/* House + Location Pin SVG Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Location Pin combined with House Roof & Door */}
          <path d="M12 21c3.5-3.5 6-7.5 6-11a6 6 0 0 0-12 0c0 3.5 2.5 7.5 6 11z" />
          {/* House Roof & Center Window */}
          <path d="M9.5 10l2.5-2.5 2.5 2.5" />
          <path d="M10 12.5h4v3.5h-4z" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            PG<span className="text-indigo-600">Finder</span>
          </span>
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100">
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 font-medium">Find a place that feels like home.</span>
        )}
      </div>
    </Link>
  );
}
