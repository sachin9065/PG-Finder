import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PGFinder - Find a place that feels like home',
  description:
    'Discover verified PGs, hostels, and room rentals for students and working professionals across Bangalore, Delhi, Gurgaon, Pune, Hyderabad, and Mumbai.',
  keywords: [
    'PG Finder',
    'Paying Guest',
    'Hostels in Bangalore',
    'Co-living spaces',
    'Rooms for rent',
    'Student housing',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
