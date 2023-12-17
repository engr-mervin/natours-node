import Stripe from 'stripe';

type StripeClient = {
  instance: Stripe | undefined;
};

const client: StripeClient = {
  instance: undefined,
};

export let stripeClient =
  client.instance ||
  (client.instance = new Stripe(process.env.STRIPE_SECRET_KEY!));
