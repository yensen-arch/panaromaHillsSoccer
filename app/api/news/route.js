import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth-server';
import { ObjectId } from 'mongodb';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

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

// GET all news
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const news = await db.collection('news').find({}).sort({ createdAt: -1 }).toArray();
    
    // Convert ObjectIds to strings
    const formattedNews = news.map(item => ({
      ...item,
      _id: item._id.toString()
    }));
    
    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST new news item
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

    const { title, content, imageUrl } = await request.json();
    
    if (!title || !content || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const newsItem = {
      title,
      content,
      imageUrl,
      createdAt: new Date(),
    };

    const result = await db.collection('news').insertOne(newsItem);
    
    return NextResponse.json({
      success: true,
      news: { 
        ...newsItem, 
        _id: result.insertedId.toString() 
      }
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

// PUT update news item
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

    const { _id, title, content, imageUrl } = await request.json();
    
    if (!_id || !title || !content || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('news').updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: { 
          title,
          content,
          imageUrl,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'News updated successfully'
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE news item
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

    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('news').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}