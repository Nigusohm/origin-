export interface StripeInitPayload {
  amount: number; // in USD cents
  currency: 'usd';
  email: string;
  orderId: string;
}

export async function initializeStripePayment(payload: StripeInitPayload) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.log('[Stripe Simulation] Initializing USD payment intent:', payload);
    return {
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      status: 'simulated'
    };
  }

  try {
    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: Math.round(payload.amount * 100).toString(),
        currency: payload.currency,
        'receipt_email': payload.email,
        'metadata[order_id]': payload.orderId
      })
    });

    const data = await res.json();
    return {
      clientSecret: data.client_secret,
      status: 'created'
    };
  } catch (err) {
    console.error('Stripe API Error:', err);
    return {
      clientSecret: `pi_simulated_${Date.now()}`,
      status: 'simulated'
    };
  }
}
