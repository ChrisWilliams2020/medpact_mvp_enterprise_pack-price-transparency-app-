import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/db/supabase';

// Initialize Stripe only if the key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // Check if Stripe is configured
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.' },
      { status: 503 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organization_id;

      if (session.subscription && organizationId) {
        await supabase.from('payment_subscriptions').insert({
          organization_id: organizationId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('payment_subscriptions')
        .update({ status: subscription.status })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('payment_subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}