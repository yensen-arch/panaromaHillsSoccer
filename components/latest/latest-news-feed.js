'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

export function LatestNewsFeed() {
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
            content: 'Join us for our annual summer training camp. Open to all age groups, this intensive week-long camp focuses on skill development, tactical understanding, and fitness. The camp will run from July 15-22 and will feature guest coaches from professional clubs.\n\nEach day will include technical training sessions, tactical workshops, and fun-filled matches and competitions. Lunch and refreshments will be provided. This is a fantastic opportunity for players to improve their skills and make new friends in a supportive environment.\n\nRegistration is now open and spaces are limited. Early bird discounts are available until June 30th.',
            imageUrl: 'https://images.pexels.com/photos/3459979/pexels-photo-3459979.jpeg',
            createdAt: new Date('2023-06-15')
          },
          {
            _id: '2',
            title: 'Team Wins Regional Championship',
            content: 'Congratulations to our senior team for winning the regional championship! After a nail-biting final match that went to penalties, our team emerged victorious.\n\nThe match was tied 2-2 after full time, with goals from our captain Mark Johnson and striker David Lee. The team showed incredible resilience after going behind twice in the match.\n\nIn the penalty shootout, our goalkeeper Sarah Williams made two crucial saves, allowing us to win 4-2 on penalties.\n\nThis victory means we qualify for the national tournament, which will take place in August. Thank you to all the supporters who came to cheer on the team!',
            imageUrl: 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg',
            createdAt: new Date('2023-06-05')
          },
          {
            _id: '3',
            title: 'New Youth Coach Joins the Club',
            content: 'We\'re excited to welcome James Thompson to our coaching staff. James brings 15 years of experience working with youth players and will lead our U14 team.\n\nJames has previously worked with several professional academies and holds a UEFA B coaching license. His philosophy focuses on developing technical skills while ensuring players enjoy the game.\n\n"I\'m thrilled to join Panaroma Hills Soccer Club," says James. "The club has a fantastic reputation for youth development, and I can\'t wait to work with the talented young players here."\n\nJames will begin training sessions next week, and we\'re confident that our U14 players will benefit enormously from his expertise and passion for the game.',
            imageUrl: 'https://images.pexels.com/photos/8224721/pexels-photo-8224721.jpeg',
            createdAt: new Date('2023-05-28')
          },
          {
            _id: '4',
            title: 'Club Facilities Upgrade Completed',
            content: 'We\'re pleased to announce that the renovation of our club facilities has been completed. The project, which began three months ago, includes a completely refurbished clubhouse, improved changing rooms, and a new medical treatment room.\n\nThe clubhouse now features a larger social area with new furniture, an improved bar area, and better audiovisual equipment for match viewings and presentations. The changing rooms have been modernized with new showers, benches, and lockers.\n\nThe new medical treatment room is equipped with state-of-the-art equipment to ensure our players receive the best possible care for injuries and recovery.\n\nWe\'d like to thank all members for their patience during the renovation period. We believe these improvements will significantly enhance the experience for all players and visitors to the club.',
            imageUrl: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
            createdAt: new Date('2023-05-15')
          },
          {
            _id: '5',
            title: 'Youth Tournament Success',
            content: 'Our U12 and U16 teams both reached the finals of the Regional Youth Tournament last weekend, with the U12s bringing home the trophy after a convincing 3-0 win!\n\nThe U12 team, coached by Emma Peterson, dominated throughout the tournament, scoring 14 goals and conceding only 2 across their five matches. The final saw outstanding performances from the entire team, with goals from Ryan Smith (2) and Olivia Chen.\n\nThe U16s narrowly missed out on their trophy, losing 2-1 in a hard-fought final. Despite the disappointment, coach Michael Andrews praised the team\'s effort and sportsmanship throughout the competition.\n\nSpecial thanks to all the parents who supported the teams and helped with transportation and logistics. These tournaments provide invaluable experience for our young players and help build team spirit.',
            imageUrl: 'https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg',
            createdAt: new Date('2023-05-02')
          },
          {
            _id: '6',
            title: 'Annual Club Fundraising Gala',
            content: 'Save the date! Our Annual Club Fundraising Gala will take place on Saturday, September 16th at the Grand Park Hotel.\n\nThe evening will include a three-course dinner, live music, a silent auction, and speeches from special guests. All proceeds will go towards funding new equipment for our youth teams and subsidizing tournament entry fees.\n\nTickets are priced at $75 per person or $700 for a table of 10. The dress code is formal, and the event will run from 7pm until midnight.\n\nWe\'re currently seeking donations for our silent auction. If you or your business would like to contribute an item or service, please contact our events coordinator, Lisa Johnson.\n\nThis is our biggest fundraising event of the year and a wonderful opportunity to socialize with fellow club members while supporting a great cause. We hope to see you there!',
            imageUrl: 'https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg',
            createdAt: new Date('2023-04-20')
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
      <div className="space-y-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/3 h-60 bg-gray-300 rounded-md mb-4 md:mb-0"></div>
              <div className="md:w-2/3 md:pl-6">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {newsItems.map((item) => (
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