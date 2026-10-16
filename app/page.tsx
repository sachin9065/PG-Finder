import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSearch from '@/components/search/HeroSearch';
import PropertyCard from '@/components/property/PropertyCard';
import { SEED_PROPERTIES } from '@/lib/seed-data';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  UserCheck,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  // Use first 6 popular properties for landing page
  const featuredProperties = SEED_PROPERTIES.slice(0, 6);

  const categories = [
    {
      title: 'Boys PG',
      desc: 'Comfortable hostels for men',
      count: '120+ Listings',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600',
      href: '/explore?gender=Boys',
    },
    {
      title: 'Girls PG',
      desc: 'Safe & secure verified homes',
      count: '95+ Listings',
      icon: ShieldCheck,
      color: 'from-pink-500 to-rose-600',
      bgLight: 'bg-pink-50 text-pink-600',
      href: '/explore?gender=Girls',
    },
    {
      title: 'Co-Living',
      desc: 'Vibrant modern shared spaces',
      count: '80+ Listings',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      bgLight: 'bg-purple-50 text-purple-600',
      href: '/explore?gender=Co-Living',
    },
    {
      title: 'Student Housing',
      desc: 'Near top colleges & universities',
      count: '65+ Listings',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 text-emerald-600',
      href: '/explore?roomType=Double',
    },
    {
      title: 'Working Professionals',
      desc: 'Close to major IT parks & metro',
      count: '140+ Listings',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-600',
      href: '/explore?minRent=10000',
    },
    {
      title: 'Single Rooms',
      desc: 'Complete privacy with attach bath',
      count: '50+ Listings',
      icon: Building,
      color: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50 text-cyan-600',
      href: '/explore?roomType=Single',
    },
  ];

  const whyFeatures = [
    {
      icon: ShieldCheck,
      title: 'Verified Listings',
      desc: 'Find trusted properties thoroughly checked by our team for safety, hygiene, and authentic amenities.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: Search,
      title: 'Smart Search',
      desc: 'Filter PGs effortlessly by locality, monthly budget, room sharing, gender, AC, WiFi, and meal preferences.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      icon: Zap,
      title: 'Transparent Pricing',
      desc: 'Compare rent, security deposits, and maintenance charges upfront with zero hidden broker charges.',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: PhoneCall,
      title: 'Easy Contact',
      desc: 'Connect directly with verified owners, schedule visits, and secure your booking with instant responses.',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Search',
      desc: 'Enter your preferred city, locality, or workplace and set your monthly budget.',
    },
    {
      step: '02',
      title: 'Compare',
      desc: 'Browse verified photos, compare amenities, house rules, and authentic reviews from residents.',
    },
    {
      step: '03',
      title: 'Move In',
      desc: 'Schedule a visit or contact the owner directly to finalize your room and move into your new home.',
    },
  ];

  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      role: 'Software Engineer at Flipkart',
      city: 'Bangalore',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review:
        'PGFinder made my relocation to Koramangala incredibly seamless. I found a verified PG 10 minutes from my office within one day. No brokerage, accurate pictures!',
    },
    {
      name: 'Ananya Sharma',
      role: 'Design Lead at Zomato',
      city: 'Gurgaon',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review:
        'As a woman moving to Gurgaon for the first time, safety was my primary priority. The verified filter and transparent house rules gave me total peace of mind.',
    },
    {
      name: 'Karthik Nair',
      role: 'MBA Student at DU',
      city: 'Delhi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      review:
        'Found an awesome student hostel in Kamla Nagar with study tables and nutritious food. Highly recommend PGFinder to any college fresher looking for accommodation.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading + Subtitle + Hero Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>India&apos;s #1 Verified Room Discovery Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Find your perfect PG,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  without the hassle.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover verified PGs and rooms that match your budget, location, and lifestyle. Zero
                brokerage, authentic photos, and instant owner connectivity.
              </p>

              {/* Multi-field interactive Hero Search */}
              <div className="pt-2">
                <HeroSearch />
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Verified Properties</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Brokerage Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Owner Contact</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with floating badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-indigo-950/10">
                  <Image
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern student & professional room"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
                      Featured Living
                    </span>
                    <h2 className="text-xl font-bold">UrbanNest Luxury Residency</h2>
                    <p className="text-xs text-slate-200 mt-1">Koramangala, Bangalore • ₹11,500/mo</p>
                  </div>
                </div>

                {/* Floating Badge 1: Top Right */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Verification</p>
                    <p className="text-sm font-bold text-slate-800">100% In-Person Audited</p>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-extrabold text-slate-900">4.9 / 5.0</span>
                      <span className="text-xs text-slate-400 font-medium">(2,400+ reviews)</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Loved by 15,000+ residents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Tailored Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Find accommodation that suits your lifestyle
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            Explore all categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card-hover hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.bgLight}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {cat.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PG SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Top Rated Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular PGs near you
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked verified accommodations in premier IT hubs and student localities.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
          >
            View All PGs ({SEED_PROPERTIES.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 4. WHY PGFINDER SECTION */}
      <section className="bg-slate-100/60 py-16 sm:py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Why PGFinder
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Discover housing with zero compromises
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              We eliminate traditional brokerage scams and misleading pictures by verifying every
              single room directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            How PGFinder Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            From search to move-in, experience the smoothest room discovery journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {howItWorks.map((step, idx) => (
            <div
              key={step.step}
              className="relative p-8 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-black text-indigo-200/80 font-mono tracking-wider block mb-4">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <span>Step {idx + 1} of 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Loved by 15,000+ happy residents
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Here is what students and working professionals say about finding their home on PGFinder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &quot;{t.review}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                  <p className="text-xs text-slate-500">
                    {t.role} • {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. OWNER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
                For Property Owners
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Are you a PG Owner? List your property with zero brokerage.
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base max-w-xl leading-relaxed">
                Connect with thousands of verified tenants, fill vacancies faster, and manage your
                enquiries effortlessly from a single dedicated dashboard.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/register?role=owner"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-sm text-center shadow-lg transition"
              >
                List Your PG Now
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-2xl bg-indigo-700/50 hover:bg-indigo-700 text-white font-semibold text-sm text-center border border-indigo-500/30 transition"
              >
                Owner Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
