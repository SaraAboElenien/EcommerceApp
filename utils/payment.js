import Stripe from 'stripe';


export async function payment({
    stripe = new Stripe(process.env.Stripe_key),
    payment_method_types = ["Pay with credit or debit card"],
    mode = "payment",
    customer_email,
    metadata = {},
    success_url,
    cancel_url,
    line_items = [],
    discounts = []
} = {}) {
    stripe = new Stripe(process.env.Stripe_key);
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        line_items,
        discounts
    })
    return session
}