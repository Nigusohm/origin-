export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@originandeverlasting.com';

  if (!apiKey) {
    console.log('[Resend Simulation] Email logged:', {
      to: payload.to,
      subject: payload.subject,
      from: payload.from || fromEmail
    });
    return { success: true, id: `msg_mock_${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: payload.from || fromEmail,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html
      })
    });

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err) {
    console.error('Resend Error:', err);
    return { success: false, error: err };
  }
}
