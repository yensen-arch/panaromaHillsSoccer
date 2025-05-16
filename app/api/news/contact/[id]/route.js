import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { checkAuth } from '@/lib/auth-server';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status || !['new', 'read', 'responded'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('panorama-hills');

    const result = await db.collection('contactQueries').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating query status:', error);
    return NextResponse.json(
      { error: 'Failed to update query status' },
      { status: 500 }
    );
  }
} 