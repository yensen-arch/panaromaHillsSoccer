import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/registration.model';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'childFirstName',
      'childLastName',
      'parentName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'city',
      'postcode',
      'uniformSize',
      'previousRegistration',
      'newsletterSubscription',
      'emergencyContact',
      'emergencyPhone',
      'liabilityAccepted',
      'agreeTerms',
      'paymentMethod'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        fields: missingFields 
      }, { status: 400 });
    }

    // Validate boolean fields
    if (typeof data.liabilityAccepted !== 'boolean' || 
        typeof data.agreeTerms !== 'boolean' || 
        typeof data.newsletterSubscription !== 'boolean') {
      return NextResponse.json({ 
        error: 'Invalid boolean fields' 
      }, { status: 400 });
    }

    // Validate enum fields
    const validUniformSizes = ['XS', 'S', 'M', 'L', 'XL', 'Don\'t need (has already)'];
    const validPreviousRegistrations = [
      'registered before 2020',
      '2020 SUMMER soccer',
      '2020/2021/2023 SUMMER soccer',
      '2024 SUMMER soccer',
      'first time- never been registered before'
    ];
    const validPaymentMethods = ['online-stripe', 'in-person-cash-cheque'];

    if (!validUniformSizes.includes(data.uniformSize)) {
      return NextResponse.json({ error: 'Invalid uniform size' }, { status: 400 });
    }

    if (!validPreviousRegistrations.includes(data.previousRegistration)) {
      return NextResponse.json({ error: 'Invalid previous registration option' }, { status: 400 });
    }

    if (!validPaymentMethods.includes(data.paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
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