import Stripe from 'stripe';
const client = {
    instance: undefined,
};
export let stripeClient = client.instance ||
    (client.instance = new Stripe(process.env.STRIPE_SECRET_KEY));
