import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth-server';

// Helper function to verify admin token
async function verifyAdminToken(request) {
  const cookies = request.cookies;
  const token = cookies.get('token')?.value;
  
  if (!token) {
    return false;
  }
  
  const payload = await verifyToken(token);
  return payload?.role === 'admin';
}

export async function POST(request) {
  try {
    // Verify admin token
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { startDate, endDate, heading, description, bannerImage, isActive } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    const season = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      heading,
      description,
      bannerImage,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('seasons').insertOne(season);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Season created successfully',
      season: { ...season, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create season' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const seasons = await db.collection('seasons')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, seasons });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch seasons' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verify admin token
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { _id, startDate, endDate, heading, description, bannerImage, isActive } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    const updateData = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      heading,
      description,
      bannerImage,
      isActive,
      updatedAt: new Date()
    };

    await db.collection('seasons').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Season updated successfully' 
    });
  } catch (error) {
    console.error('Error updating season:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update season' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verify admin token
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Season ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('seasons').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Season deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting season:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete season' },
      { status: 500 }
    );
  }
} 