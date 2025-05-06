'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatDate, truncateText } from '@/lib/utils';

export function LatestUpdates() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback data for development
        setNewsItems([
          {
            _id: '1',
            title: 'Summer Training Camp Announced',
            content: 'Join us for our annual summer training camp. Open to all age groups, this intensive week-long camp focuses on skill development, tactical understanding, and fitness.',
            imageUrl: 'https://images.pexels.com/photos/3459979/pexels-photo-3459979.jpeg',
            createdAt: new Date('2023-06-15')
          },
          {
            _id: '2',
            title: 'Team Wins Regional Championship',
            content: 'Congratulations to our senior team for winning the regional championship! After a nail-biting final match that went to penalties, our team emerged victorious.',
            imageUrl: 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg',
            createdAt: new Date('2023-06-05')
          },
          {
            _id: '3',
            title: 'New Youth Coach Joins the Club',
            content: 'We\'re excited to welcome James Thompson to our coaching staff. James brings 15 years of experience working with youth players and will lead our U14 team.',
            imageUrl: 'https://images.pexels.com/photos/8224721/pexels-photo-8224721.jpeg',
            createdAt: new Date('2023-05-28')
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {newsItems.map((item) => (
        <div key={item._id} className="news-card">
          <div className="relative h-48 w-full">
            <Image 
              src={item.imageUrl} 
              alt={item.title} 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-700 mb-4">{truncateText(item.content, 120)}</p>
            <Link 
              href={`/latest/${item._id}`} 
              className="text-primary-700 font-semibold hover:text-primary-800 inline-flex items-center"
            >
              Read More 
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}