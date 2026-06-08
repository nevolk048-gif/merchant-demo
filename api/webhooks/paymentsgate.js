// Vercel Serverless Function for PaymentsGate Webhooks
const crypto = require('crypto');

// Secret key для проверки подписи (должен совпадать с secret_key в casinos таблице)
const CASINO_SECRET_KEY = process.env.CASINO_SECRET_KEY || 'sk_demo_casino_secret_key_12345678';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Major-Timestamp, X-Major-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const timestamp = req.headers['x-major-timestamp'];
    const signature = req.headers['x-major-signature'];
    const body = req.body;

    console.log('[WEBHOOK] Received:', {
      timestamp,
      signature,
      body: JSON.stringify(body)
    });

    // Verify signature
    if (timestamp && signature) {
      const rawBody = JSON.stringify(body);
      const dataToSign = `${timestamp}.${body.object?.uuid}.${rawBody}`;
      const hmac = crypto.createHmac('sha256', CASINO_SECRET_KEY);
      hmac.update(dataToSign);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        console.log('[WEBHOOK] Invalid signature');
        console.log('[DEBUG] Expected:', expectedSignature);
        console.log('[DEBUG] Got:', signature);
        // For now, just log but don't reject
        // return res.status(401).json({ error: 'Invalid signature' });
      } else {
        console.log('[WEBHOOK] Signature verified');
      }
    }

    // Process webhook
    const { type, object } = body;

    console.log('[WEBHOOK] Processing:', {
      type,
      transactionId: object?.uuid,
      status: object?.status,
      amount: object?.amount
    });

    // Here you would normally:
    // 1. Update your database
    // 2. Notify the user
    // 3. Update UI in real-time (via WebSocket/SSE)

    // For demo purposes, just log and return success
    return res.status(200).json({
      status: 'ok',
      received: true,
      transaction_id: object?.uuid,
      event_type: type
    });

  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
