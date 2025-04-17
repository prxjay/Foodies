import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key from Stripe dashboard
const stripePromise = loadStripe('pk_test_your_publishable_key');

export default stripePromise; 