'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, FacebookIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';

export function NewsDetail({ news }) {
  if (!news) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          News item not found
        </h2>
        <p className="text-gray-700 mb-6">
          We couldn't find the news article you were looking for.
        </p>
        <Link 
          href="/latest" 
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md inline-flex items-center"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Latest News
        </Link>
      </div>
    );
  }

  // Split the content by paragraphs
  const paragraphs = news.content.split('\n\n');

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-[400px] w-full">
        <Image 
          src={news.imageUrl} 
          alt={news.title} 
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {news.title}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">{formatDate(news.createdAt)}</span>
          <span>By {news.author || 'Club Staff'}</span>
        </div>
        
        <div className="prose max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link 
              href="/latest" 
              className="text-primary-700 hover:text-primary-800 inline-flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Latest News
            </Link>
            
            <div className="flex space-x-3">
              <button className="text-gray-600 hover:text-blue-600" aria-label="Share on Facebook">
                <FacebookIcon className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-400" aria-label="Share on Twitter">
                <TwitterIcon className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-700" aria-label="Share on LinkedIn">
                <LinkedinIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}