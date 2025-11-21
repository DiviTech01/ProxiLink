import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Vercel serverless function to send Web Push notifications using Supabase push_subscriptions table

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).send('OK');
  }

  try {
    const { userId, title, body, data } = req.body || {};
    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'userId, title and body are required' });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL as string;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY as string;
    const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY as string;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.status(500).json({ error: 'Missing required environment variables' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Configure web-push
    webpush.setVapidDetails('mailto:support@proxilink.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    // Fetch active subscriptions for the user
    const { data: subs, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (subError) throw subError;
    if (!subs || subs.length === 0) {
      return res.status(404).json({ success: false, message: 'No active subscriptions' });
    }

    const results: Array<{ success: boolean; subscriptionId: string; error?: string }> = [];

    for (const s of subs) {
      try {
        const subscription = s.subscription as { endpoint: string; keys: { p256dh: string; auth: string } };
        const payload = JSON.stringify({ title, body, icon: '/logo.png', badge: '/logo.png', data: data || {} });

        await webpush.sendNotification(subscription, payload);
        results.push({ success: true, subscriptionId: s.id });
      } catch (err: any) {
        // Mark invalid subscriptions inactive (404 / 410)
        const status = err?.statusCode || err?.status || null;
        if (status === 404 || status === 410) {
          await supabase.from('push_subscriptions').update({ is_active: false }).eq('id', s.id);
        }
        results.push({ success: false, subscriptionId: s.id, error: String(err?.message || err) });
      }
    }

    const sent = results.filter((r) => r.success).length;
    return res.status(200).json({ success: true, sent, total: subs.length, results });
  } catch (error) {
    console.error('send-push-notification error:', error);
    return res.status(500).json({ error: String(error) });
  }
}
