import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/db/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

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