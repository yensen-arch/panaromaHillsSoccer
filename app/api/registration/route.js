import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/registration.model';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    // Validate required fields (basic)
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.dateOfBirth || !data.gender || !data.address || !data.city || !data.postcode || !data.membershipType || !data.emergencyContact || !data.emergencyPhone || typeof data.liabilityAccepted !== 'boolean' || typeof data.agreeTerms !== 'boolean' || !data.paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const registration = new Registration({
      ...data,
      paymentStatus: data.paymentStatus || 'unpaid',
      createdAt: new Date(),
    });
    await registration.save();
    return NextResponse.json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { _id, paymentStatus } = await request.json();
    if (!_id || !['paid', 'unpaid'].includes(paymentStatus)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }
    const updated = await Registration.findByIdAndUpdate(_id, { paymentStatus }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
} 