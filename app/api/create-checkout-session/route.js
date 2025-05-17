import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { registrationId, amount, email, name } = await request.json();
    
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Panorama Hills Soccer Registration',
              description: `Registration for ${name}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/register?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/register?canceled=true`,
      customer_email: email,
      metadata: {
        registrationId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 