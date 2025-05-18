import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/registration.model';
import { verifyToken } from '@/lib/auth-server';
import { ObjectId } from 'mongodb';

// Helper function to verify admin token
async function verifyAdminToken(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return false;
  }
  return await verifyToken(token);
}

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
      'paymentMethod',
      'seasonId',
      'seasonName'
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

    // Validate season information
    if (!data.seasonId || !data.seasonName) {
      return NextResponse.json(
        { success: false, message: 'Season information is required' },
        { status: 400 }
      );
    }

    // Create registration with all fields including season information
    const registrationData = {
      ...data,
      paymentStatus: data.paymentStatus || 'unpaid',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Ensure seasonId is an ObjectId
    if (typeof registrationData.seasonId === 'string') {
      registrationData.seasonId = new ObjectId(registrationData.seasonId);
    }

    // Log the data being used to create the registration
    console.log('Registration data:', registrationData);

    const registration = new Registration(registrationData);

    // Log the registration object before saving
    console.log('Creating registration with data:', registration.toObject());

    const savedRegistration = await registration.save();

    // Log the saved registration
    console.log('Saved registration:', savedRegistration);

    // Send confirmation email with season information
    try {
      await fetch('/api/send-registration-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          childName: `${data.childFirstName} ${data.childLastName}`,
          parentName: data.parentName,
          seasonName: data.seasonName
        })
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }

    // Convert the registration to a plain object and include all fields
    const registrationResponse = savedRegistration.toObject();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration created successfully',
      registration: registrationResponse
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Verify admin token for GET request
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Verify admin token for PUT request
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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