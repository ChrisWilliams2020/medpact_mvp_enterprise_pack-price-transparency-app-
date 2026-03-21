import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const PLANS = {
  basic: {
    name: 'Basic',
    price: 99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    features: [
      'Up to 10 practices',
      'Basic analytics',
      'Email support',
      'Contract management'
    ]
  },
  professional: {
    name: 'Professional',
    price: 299,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    features: [
      'Up to 50 practices',
      'Advanced analytics',
      'Priority support',
      'AI-powered insights',
      'Price transparency data',
      'Referral network'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 999,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Unlimited practices',
      'Custom analytics',
      '24/7 dedicated support',
      'Advanced AI/ML predictions',
      'Full API access',
      'Custom integrations',
      'White-label options'
    ]
  }
};

export async function createCheckoutSession(
  organizationId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      organization_id: organizationId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // Update database with subscription info
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      // Update subscription status in database
      break;
    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      // Handle subscription cancellation
      break;
  }
}