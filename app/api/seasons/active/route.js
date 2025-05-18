import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const activeSeason = await db.collection('seasons')
      .findOne({ isActive: true });
    
    if (!activeSeason) {
      return NextResponse.json({ 
        success: false, 
        message: 'No active season found' 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      season: activeSeason 
    });
  } catch (error) {
    console.error('Error fetching active season:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch active season' },
      { status: 500 }
    );
  }
} 