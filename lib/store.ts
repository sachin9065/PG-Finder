import { SEED_PROPERTIES, SEED_USERS, SeedProperty } from './seed-data';

export interface InMemoryUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface InMemoryFavorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface InMemoryEnquiry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  ownerEmail: string;
  propertyId: string;
  propertyTitle: string;
  message: string;
  visitDate?: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface InMemoryReview {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Global persistent in-memory store in dev
interface DataStore {
  properties: SeedProperty[];
  users: InMemoryUser[];
  favorites: InMemoryFavorite[];
  enquiries: InMemoryEnquiry[];
  reviews: InMemoryReview[];
}

declare global {
  // eslint-disable-next-line no-var
  var __PGFINDER_STORE__: DataStore | undefined;
}

function initStore(): DataStore {
  const users: InMemoryUser[] = SEED_USERS.map((u, i) => ({
    id: `user-${i + 1}`,
    name: u.name,
    email: u.email,
    phone: u.phone,
    password: u.password,
    role: u.role,
    avatar: u.avatar,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  }));

  const properties: SeedProperty[] = [...SEED_PROPERTIES];

  const enquiries: InMemoryEnquiry[] = [
    {
      id: 'enq-1',
      userId: 'user-1',
      userName: 'Aarav Sharma',
      userEmail: 'user@pgfinder.com',
      userPhone: '+91 98765 43210',
      ownerEmail: 'owner@pgfinder.com',
      propertyId: 'prop-1',
      propertyTitle: 'UrbanNest Luxury PG for Gents',
      message: 'Hi Vikramaditya, I would like to schedule a room visit this Saturday afternoon for a Single room.',
      visitDate: '2026-09-18',
      status: 'Contacted',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'enq-2',
      userId: 'user-1',
      userName: 'Aarav Sharma',
      userEmail: 'user@pgfinder.com',
      userPhone: '+91 98765 43210',
      ownerEmail: 'owner@pgfinder.com',
      propertyId: 'prop-2',
      propertyTitle: 'StaySphere Premium Co-Living',
      message: 'Is food included in the monthly rent? Interested in immediate move-in from next month.',
      status: 'Pending',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  const favorites: InMemoryFavorite[] = [
    {
      id: 'fav-1',
      userId: 'user-1',
      propertyId: 'prop-1',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'fav-2',
      userId: 'user-1',
      propertyId: 'prop-3',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const reviews: InMemoryReview[] = [
    {
      id: 'rev-1',
      propertyId: 'prop-1',
      userId: 'user-1',
      userName: 'Aarav Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      comment: 'Super fast WiFi and high cleanliness. The food tastes really authentic and homestyle. Highly recommend for developers working in Koramangala!',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 'rev-2',
      propertyId: 'prop-1',
      userId: 'user-3',
      userName: 'Rohan Deshmukh',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4,
      comment: 'Spacious rooms and good power backup. Only minor suggestion is extending visitor hours slightly.',
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
    {
      id: 'rev-3',
      propertyId: 'prop-2',
      userId: 'user-1',
      userName: 'Aarav Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      comment: 'Amazing community events every Saturday! Coworking desks are well equipped.',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
  ];

  return { properties, users, favorites, enquiries, reviews };
}

if (!global.__PGFINDER_STORE__) {
  global.__PGFINDER_STORE__ = initStore();
}

export const store = global.__PGFINDER_STORE__;

export function resetStore() {
  global.__PGFINDER_STORE__ = initStore();
  return global.__PGFINDER_STORE__;
}
