import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/registration.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const registrationId = session.metadata.registrationId;

      await dbConnect();
      await Registration.findByIdAndUpdate(registrationId, {
        paymentStatus: 'paid',
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent
      });
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const registrationId = session.metadata.registrationId;

      await dbConnect();
      await Registration.findByIdAndUpdate(registrationId, {
        stripeSessionId: session.id
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 