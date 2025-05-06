import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_your_key';

const stripe = new Stripe(stripeSecretKey);

export default stripe;