import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Season ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const season = await db.collection('seasons').findOne({ _id: new ObjectId(id) });
    
    if (!season) {
      return NextResponse.json(
        { success: false, message: 'Season not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      season 
    });
  } catch (error) {
    console.error('Error fetching season:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch season' },
      { status: 500 }
    );
  }
} 