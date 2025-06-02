'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export function LatestNewsFeed({ initialNews }) {
  return (
    <div className="space-y-8">
      {initialNews.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/3 relative h-60">
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                fill
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-700 mb-4">
                {item.content.split('\n\n')[0]}
              </p>
              <Link 
                href={`/latest/${item._id}`} 
                className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md inline-flex items-center transition-all duration-300"
              >
                Read Full Story 
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}