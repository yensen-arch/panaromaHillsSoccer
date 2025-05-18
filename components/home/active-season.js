'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ActiveSeason() {
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveSeason = async () => {
      try {
        const response = await fetch('/api/seasons/active');
        const data = await response.json();
        
        if (data.success) {
          setSeason(data.season);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch active season');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSeason();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !season) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Current Season</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto mt-4"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[300px] sm:h-[400px]">
            <Image
              src={season.bannerImage}
              alt={season.heading}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{season.heading}</h3>
            <p className="text-gray-600 mb-6">{season.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <Link 
              href={`/seasons/${season._id}`}
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 