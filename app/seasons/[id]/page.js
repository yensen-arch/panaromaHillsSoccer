'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { Calendar, Users, Clock, ArrowRight } from 'lucide-react';

export default function SeasonDetails() {
  const { id } = useParams();
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const response = await fetch(`/api/seasons/${id}`);
        if (!response.ok) throw new Error('Failed to fetch season');
        const data = await response.json();
        setSeason(data.season);
      } catch (error) {
        console.error('Error fetching season:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeason();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Not Found</h2>
          <p className="text-gray-600 mb-6">The season you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowRight className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[500px] w-full">
          <Image
            src={season.bannerImage}
            alt={season.heading}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {season.heading}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
          <p className="text-xl text-black mb-8">
            {season.description}
          </p>
            {/* Season Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <Calendar className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(season.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <Clock className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(season.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <Users className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {season.isActive ? 'Active' : 'Upcoming'}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration CTA */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Don't miss out on this exciting season! Register now to secure your spot and be part of our soccer community.
              </p>
              <Link 
                href="/register" 
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors transform hover:scale-105"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 