import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';


export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('panorama-hills');
    
    const contactQuery = {
      name,
      email,
      phone,
      subject: subject || '',
      message,
      createdAt: new Date(),
      status: 'new', // new, read, responded
    };

    await db.collection('contactQueries').insertOne(contactQuery);

    return NextResponse.json({ message: 'Contact query submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact query:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact query' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('panorama-hills');
    const contactQueries = await db.collection('contactQueries')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(contactQueries);
  } catch (error) {
    console.error('Error fetching contact queries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact queries' },
      { status: 500 }
    );
  }
} 