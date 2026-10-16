# PGFinder — Modern PG, Hostel & Room Rental Discovery Platform

> **"Find a place that feels like home."**

PGFinder is a full-stack, production-quality web application built for students and young working professionals to discover, filter, shortlist, and securely enquire about verified Paying Guest (PG) accommodations, hostels, and co-living rooms across major Indian metropolitan cities (Bangalore, Delhi, Gurgaon, Pune, Hyderabad, Mumbai, Noida).

---

## Key Highlights & Features

### 🌟 For Tenants / Students / Professionals
- **Verified Property Discovery**: Real-time browsing with high-resolution interior photos, verified badges, room vacancy counters, and authentic resident reviews.
- **Multi-Parameter Search & Filtering**:
  - Search by city or locality (e.g., Koramangala, Kamla Nagar, DLF Cyber City, Hinjewadi, Bandra).
  - Price slider & budget range (₹5,000 – ₹25,000+).
  - Room occupancy filter: Single, Double, Triple, or Four Sharing.
  - Gender categorization: Boys, Girls, Co-Living.
  - Amenities checklist: WiFi, AC, Food / Mess, Laundry, Parking, Gym, Power Backup, CCTV, Housekeeping.
  - Minimum star rating filter (4.0+, 4.5+, 4.8+).
  - Sorting: Recommended, Price Low to High, Price High to Low, Highest Rated.
- **Comprehensive Details Page (`/pg/[id]`)**:
  - Image gallery with interactive thumbnail switching.
  - Transparent pricing: Monthly rent, security deposit, and zero brokerage guarantees.
  - House rules (lock-in period, guest rules, quiet hours).
  - Nearby essential landmarks (Metro stations, IT parks, colleges, hospitals) with walking/commute distances.
  - Interactive Google Maps launch.
  - Verified property manager profile card.
  - Sticky booking widget with direct visit scheduler / enquiry form.
  - Resident reviews list and rating submission form.
- **Tenant Dashboard (`/dashboard`)**:
  - **Overview**: Activity stats and recent shortlists.
  - **Saved PGs**: Instant heart toggle to add or remove favorites.
  - **My Enquiries**: Inbound communication tracker with live statuses (`Pending`, `Contacted`, `Closed`).
  - **Profile & Settings**: Contact information and notification preferences.

### 🏢 For PG Owners & Property Managers
- **Owner Portal (`/owner/dashboard`)**:
  - Key business metrics: Total properties, active listings, total inbound enquiries, and available rooms.
  - **Recharts Analytics**: Interactive area chart of monthly enquiry trends.
  - Inbound lead management table: View tenant contact details, visit dates, and update enquiry statuses.
- **Listing Management (`/owner/properties`)**:
  - Complete list of properties with occupancy status.
  - 1-click status toggling (`Active` vs `Inactive`).
  - Permanent delete action with confirmation modal.
- **Add New Property (`/owner/add-property`)**:
  - Multi-section validated form for basic information, pricing, room sharing, amenities checklist, and multiple image uploads with live preview.

### 🛡️ For Super Admins
- **Admin Console (`/admin/dashboard`)**:
  - Platform-wide stats: Total tenants, total owners, live listings, and pending audit count.
  - **Property Moderation Table**: 1-click verification badge granting/revocation.
  - Reseed demo database button for instant testing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14+ (App Router)](https://nextjs.org/) with React 18 & TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with custom design system |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Models** | [Mongoose](https://mongoosejs.com/) with MongoDB |
| **Database Resilience** | Connection caching + Transparent In-Memory Seed Fallback (zero crash guarantee) |
| **Authentication** | [jsonwebtoken (JWT)](https://www.npmjs.com/package/jsonwebtoken) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) + HttpOnly Cookies |
| **Analytics Charts** | [Recharts](https://recharts.org/) |
| **Image Hosting** | Cloudinary SDK integration + local base64/data URI fallback |
| **Validation** | [Zod](https://zod.dev/) schema validation |

---

## 📂 Project Architecture

```text
pg-finder/
├── app/
│   ├── layout.tsx              # Root layout with Auth & Toast providers, Navbar, Footer
│   ├── globals.css             # Global Tailwind styles & design tokens
│   ├── page.tsx                # Landing Page (Hero, Categories, Featured, Why Us, How It Works)
│   ├── explore/
│   │   └── page.tsx            # Explore & Search page with sidebar filters & mobile drawer
│   ├── pg/
│   │   └── [id]/
│   │       └── page.tsx        # Property details page with gallery, enquiry & review forms
│   ├── login/
│   │   └── page.tsx            # Sign in with 1-click demo credential autofill
│   ├── register/
│   │   └── page.tsx            # Sign up with Tenant vs PG Owner role selection
│   ├── dashboard/
│   │   └── page.tsx            # Tenant Dashboard (Overview, Saved PGs, Enquiries, Profile)
│   ├── owner/
│   │   ├── dashboard/page.tsx  # Owner Dashboard with Recharts analytics
│   │   ├── properties/page.tsx # Property listings manager & status toggle
│   │   └── add-property/page.tsx # Multi-step property creation form
│   ├── admin/
│   │   └── dashboard/page.tsx  # Admin platform metrics & property verification audit
│   ├── about/
│   │   └── page.tsx            # Company story, core values & support contact
│   ├── not-found.tsx           # Custom 404 page
│   └── api/                    # RESTful Next.js API Routes
│       ├── auth/               # register, login, me, logout
│       ├── properties/         # search & filter GET, create POST, [id] PUT/DELETE/PATCH
│       ├── favorites/          # user wishlist GET, POST, DELETE
│       ├── enquiries/          # lead management GET, POST, PATCH
│       ├── reviews/            # property reviews GET, POST
│       ├── admin/              # platform stats & property verification
│       ├── upload/             # image upload endpoint
│       └── seed/               # 1-click database seeder
├── components/
│   ├── navbar/                 # Sticky glassmorphic navbar with custom logo & mobile drawer
│   ├── footer/                 # Modern responsive footer
│   ├── property/               # PropertyCard with optimistic favoriting
│   ├── search/                 # HeroSearch multi-parameter search bar
│   └── filters/                # FilterSidebar & active filter chips
├── context/
│   ├── AuthContext.tsx         # Global user session & JWT cookie state
│   └── ToastContext.tsx        # Floating notification toast system
├── lib/
│   ├── mongodb.ts              # Mongoose connection pooling & fallback handler
│   ├── auth.ts                 # JWT signing, verification, and password hashing
│   ├── cloudinary.ts           # Cloudinary SDK wrapper & image uploader
│   ├── seed-data.ts            # 12+ pre-populated realistic Indian PG listings
│   ├── store.ts                # In-memory persistent data store
│   └── utils.ts                # Class merging & Indian currency / date formatters
├── models/
│   ├── User.ts                 # Mongoose User model (user, owner, admin)
│   ├── Property.ts             # Mongoose Property model with search indexes
│   ├── Favorite.ts             # Mongoose Favorite model
│   ├── Enquiry.ts              # Mongoose Enquiry model
│   └── Review.ts               # Mongoose Review model
├── scripts/
│   └── seed.mjs                # Standalone database seed script (`npm run seed`)
├── .env.example
├── .env.local
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ or 20+ (tested on Node v22)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env.local
```

Configure your variables:
```env
# MongoDB Connection (Optional: if empty or offline, the app uses an automatic in-memory store)
MONGODB_URI=mongodb://127.0.0.1:27017/pgfinder

# JWT Authentication Secret
JWT_SECRET=pgfinder_super_secret_jwt_key_2026

# Cloudinary (Optional: for production cloud image hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts (Ready to Test Out-of-the-Box)

For fast testing and interview demonstrations, the login page (`/login`) includes **1-Click Autofill Buttons**:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Tenant** | `user@pgfinder.com` | `password123` | Can explore, save favorites, send enquiries, and post reviews. |
| **PG Owner** | `owner@pgfinder.com` | `password123` | Can view enquiry charts, add listings, manage rooms, and update leads. |
| **Admin** | `admin@pgfinder.com` | `adminpassword` | Can audit all properties, toggle verification badges, and reseed data. |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user / owner | No |
| `POST` | `/api/auth/login` | Sign in & set JWT cookie | No |
| `GET` | `/api/auth/me` | Fetch active user session | Yes |
| `POST` | `/api/auth/logout` | Clear auth session | No |
| `GET` | `/api/properties` | Search & filter properties (`?city=...&minRent=...`) | No |
| `POST` | `/api/properties` | Create a new property listing | Owner / Admin |
| `GET` | `/api/properties/[id]` | Get single property with reviews | No |
| `PUT` | `/api/properties/[id]` | Update property details | Owner / Admin |
| `DELETE` | `/api/properties/[id]` | Delete listing | Owner / Admin |
| `PATCH` | `/api/properties/[id]` | Toggle status (`Active` / `Inactive`) | Owner / Admin |
| `GET` | `/api/favorites` | List user's saved PGs | Tenant |
| `POST` | `/api/favorites` | Add property to wishlist | Tenant |
| `DELETE`| `/api/favorites` | Remove property from wishlist | Tenant |
| `GET` | `/api/enquiries` | Get tenant enquiries or owner leads | Yes |
| `POST` | `/api/enquiries` | Send visit / booking enquiry | Yes / Guest |
| `PATCH`| `/api/enquiries` | Update status (`Contacted` / `Closed`) | Owner / Admin |
| `GET` | `/api/reviews` | Fetch reviews for property | No |
| `POST` | `/api/reviews` | Post review & rating | Tenant |
| `GET` | `/api/admin/stats` | Platform metrics & counts | Admin |
| `PATCH`| `/api/admin/properties/[id]/verify` | Toggle verified badge | Admin |
| `POST` | `/api/upload` | Upload image (Cloudinary or DataURI) | Yes |
| `POST` | `/api/seed` | Seed or reset demo database | No |

---

## 💡 Interview Talking Points
- **Next.js App Router Architecture**: Clean separation of Server and Client components, optimizing initial page load and SEO.
- **Zero Crash Database Resilience**: Designed with production-ready Mongoose models and connection caching, alongside a graceful in-memory fallback pattern so demo reviews never break during an interview.
- **Secure Authentication**: HttpOnly cookie-based JWT authentication preventing XSS token theft, with bcryptjs salted password hashing.
- **Optimistic UI Updates**: Favorites and enquiry status updates reflect instantaneously on the client while synchronizing with the backend.
- **Responsive Startup UI**: Tailwind CSS glassmorphic components, micro-animations, accessible colors, and drawer navigation optimized across mobile, tablet, and desktop viewports.
