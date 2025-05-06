import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // In a real app, connect to MongoDB and fetch news items
    // const client = await clientPromise;
    // const db = client.db();
    // const newsCollection = db.collection('news');
    // const news = await newsCollection.find({}).sort({ createdAt: -1 }).toArray();
    
    // For this demo, return mock data
    const mockNews = [
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
      },
      {
        _id: '4',
        title: 'Club Facilities Upgrade Completed',
        content: 'We\'re pleased to announce that the renovation of our club facilities has been completed. The project, which began three months ago, includes a completely refurbished clubhouse, improved changing rooms, and a new medical treatment room.',
        imageUrl: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
        createdAt: new Date('2023-05-15')
      },
      {
        _id: '5',
        title: 'Youth Tournament Success',
        content: 'Our U12 and U16 teams both reached the finals of the Regional Youth Tournament last weekend, with the U12s bringing home the trophy after a convincing 3-0 win!',
        imageUrl: 'https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg',
        createdAt: new Date('2023-05-02')
      },
      {
        _id: '6',
        title: 'Annual Club Fundraising Gala',
        content: 'Save the date! Our Annual Club Fundraising Gala will take place on Saturday, September 16th at the Grand Park Hotel.',
        imageUrl: 'https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg',
        createdAt: new Date('2023-04-20')
      }
    ];
    
    return NextResponse.json(mockNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}