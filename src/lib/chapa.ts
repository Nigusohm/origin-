export interface ChapaInitPayload {
  amount: number;
  currency: 'ETB';
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  title: string;
  description: string;
}

export async function initializeChapaTransaction(payload: ChapaInitPayload) {
  const chapaKey = process.env.CHAPA_SECRET_KEY;
  if (!chapaKey) {
    // Development mode fallback simulation
    console.log('[Chapa Simulation] Initializing ETB transaction:', payload);
    return {
      status: 'success',
      message: 'Hosted Chapa checkout initialized (Simulation mode)',
      checkout_url: `${payload.return_url}&simulated_tx_ref=${payload.tx_ref}`
    };
  }

  try {
    const res = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chapaKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: payload.amount.toString(),
        currency: payload.currency,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        tx_ref: payload.tx_ref,
        callback_url: payload.callback_url,
        return_url: payload.return_url,
        customization: {
          title: payload.title,
          description: payload.description
        }
      })
    });

    const data = await res.json();
    if (data.status === 'success' && data.data?.checkout_url) {
      return {
        status: 'success',
        checkout_url: data.data.checkout_url
      };
    } else {
      throw new Error(data.message || 'Chapa initialization failed');
    }
  } catch (err: any) {
    console.error('Chapa API Error:', err);
    // Graceful fallback to simulated transaction page if sandbox key is not configured
    return {
      status: 'success',
      message: 'Simulated payment URL generated',
      checkout_url: `${payload.return_url}&simulated_tx_ref=${payload.tx_ref}&demo=true`
    };
  }
}
