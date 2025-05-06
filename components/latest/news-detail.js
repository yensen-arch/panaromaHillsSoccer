'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, FacebookIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';

export function NewsDetail({ id }) {
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNewsItem() {
      try {
        // In a real app, fetch from API
        // const response = await fetch(`/api/news/${id}`);
        // if (!response.ok) throw new Error('Failed to fetch news item');
        // const data = await response.json();
        // setNewsItem(data);
        
        // Mock data for development
        const mockNewsItems = [
          {
            _id: '1',
            title: 'Summer Training Camp Announced',
            content: 'Join us for our annual summer training camp. Open to all age groups, this intensive week-long camp focuses on skill development, tactical understanding, and fitness. The camp will run from July 15-22 and will feature guest coaches from professional clubs.\n\nEach day will include technical training sessions, tactical workshops, and fun-filled matches and competitions. Lunch and refreshments will be provided. This is a fantastic opportunity for players to improve their skills and make new friends in a supportive environment.\n\nRegistration is now open and spaces are limited. Early bird discounts are available until June 30th.',
            imageUrl: 'https://images.pexels.com/photos/3459979/pexels-photo-3459979.jpeg',
            createdAt: new Date('2023-06-15'),
            author: 'Coach Michael Stevens'
          },
          {
            _id: '2',
            title: 'Team Wins Regional Championship',
            content: 'Congratulations to our senior team for winning the regional championship! After a nail-biting final match that went to penalties, our team emerged victorious.\n\nThe match was tied 2-2 after full time, with goals from our captain Mark Johnson and striker David Lee. The team showed incredible resilience after going behind twice in the match.\n\nIn the penalty shootout, our goalkeeper Sarah Williams made two crucial saves, allowing us to win 4-2 on penalties.\n\nThis victory means we qualify for the national tournament, which will take place in August. Thank you to all the supporters who came to cheer on the team!',
            imageUrl: 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg',
            createdAt: new Date('2023-06-05'),
            author: 'Team Manager Andrew Wilson'
          },
          {
            _id: '3',
            title: 'New Youth Coach Joins the Club',
            content: 'We\'re excited to welcome James Thompson to our coaching staff. James brings 15 years of experience working with youth players and will lead our U14 team.\n\nJames has previously worked with several professional academies and holds a UEFA B coaching license. His philosophy focuses on developing technical skills while ensuring players enjoy the game.\n\n"I\'m thrilled to join FC Green Valley," says James. "The club has a fantastic reputation for youth development, and I can\'t wait to work with the talented young players here."\n\nJames will begin training sessions next week, and we\'re confident that our U14 players will benefit enormously from his expertise and passion for the game.',
            imageUrl: 'https://images.pexels.com/photos/8224721/pexels-photo-8224721.jpeg',
            createdAt: new Date('2023-05-28'),
            author: 'Club Director Emma Peterson'
          },
          {
            _id: '4',
            title: 'Club Facilities Upgrade Completed',
            content: 'We\'re pleased to announce that the renovation of our club facilities has been completed. The project, which began three months ago, includes a completely refurbished clubhouse, improved changing rooms, and a new medical treatment room.\n\nThe clubhouse now features a larger social area with new furniture, an improved bar area, and better audiovisual equipment for match viewings and presentations. The changing rooms have been modernized with new showers, benches, and lockers.\n\nThe new medical treatment room is equipped with state-of-the-art equipment to ensure our players receive the best possible care for injuries and recovery.\n\nWe\'d like to thank all members for their patience during the renovation period. We believe these improvements will significantly enhance the experience for all players and visitors to the club.',
            imageUrl: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
            createdAt: new Date('2023-05-15'),
            author: 'Facilities Manager Robert Chen'
          },
          {
            _id: '5',
            title: 'Youth Tournament Success',
            content: 'Our U12 and U16 teams both reached the finals of the Regional Youth Tournament last weekend, with the U12s bringing home the trophy after a convincing 3-0 win!\n\nThe U12 team, coached by Emma Peterson, dominated throughout the tournament, scoring 14 goals and conceding only 2 across their five matches. The final saw outstanding performances from the entire team, with goals from Ryan Smith (2) and Olivia Chen.\n\nThe U16s narrowly missed out on their trophy, losing 2-1 in a hard-fought final. Despite the disappointment, coach Michael Andrews praised the team\'s effort and sportsmanship throughout the competition.\n\nSpecial thanks to all the parents who supported the teams and helped with transportation and logistics. These tournaments provide invaluable experience for our young players and help build team spirit.',
            imageUrl: 'https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg',
            createdAt: new Date('2023-05-02'),
            author: 'Youth Coordinator Jessica Lin'
          },
          {
            _id: '6',
            title: 'Annual Club Fundraising Gala',
            content: 'Save the date! Our Annual Club Fundraising Gala will take place on Saturday, September 16th at the Grand Park Hotel.\n\nThe evening will include a three-course dinner, live music, a silent auction, and speeches from special guests. All proceeds will go towards funding new equipment for our youth teams and subsidizing tournament entry fees.\n\nTickets are priced at $75 per person or $700 for a table of 10. The dress code is formal, and the event will run from 7pm until midnight.\n\nWe\'re currently seeking donations for our silent auction. If you or your business would like to contribute an item or service, please contact our events coordinator, Lisa Johnson.\n\nThis is our biggest fundraising event of the year and a wonderful opportunity to socialize with fellow club members while supporting a great cause. We hope to see you there!',
            imageUrl: 'https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg',
            createdAt: new Date('2023-04-20'),
            author: 'Events Coordinator Lisa Johnson'
          }
        ];
        
        const foundItem = mockNewsItems.find(item => item._id === id);
        if (!foundItem) throw new Error('News item not found');
        setNewsItem(foundItem);
      } catch (error) {
        console.error('Error fetching news item:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsItem();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="w-full h-96 bg-gray-300 rounded-md mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'News item not found'}
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
  const paragraphs = newsItem.content.split('\n\n');

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-[400px] w-full">
        <Image 
          src={newsItem.imageUrl} 
          alt={newsItem.title} 
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {newsItem.title}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">{formatDate(newsItem.createdAt)}</span>
          <span>By {newsItem.author}</span>
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