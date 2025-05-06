import { NextResponse } from 'next/server';
import { createToken, setSession } from '@/lib/auth-server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate credentials against environment variables
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create and set session
    await setSession({ email, role: 'admin' });

    // Return success response
    return NextResponse.json({ 
      success: true
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 