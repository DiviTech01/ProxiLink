import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { userId, title, body, data }: PushPayload = await req.json();

    // Get all active push subscriptions for this user
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (subError) throw subError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No active subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('VAPID keys not configured');
    }

    // Send push notification to all active subscriptions
    const pushPromises = subscriptions.map(async (sub) => {
      try {
        const subscription = sub.subscription as {
          endpoint: string;
          keys: { auth: string; p256dh: string };
        };

        // Create the push message payload
        const pushPayload = JSON.stringify({
          title,
          body,
          icon: '/logo.png',
          badge: '/logo.png',
          data: data || {},
        });

        // Send push notification using Web Push protocol
        const response = await sendWebPush(
          subscription.endpoint,
          pushPayload,
          subscription.keys,
          vapidPublicKey,
          vapidPrivateKey
        );

        if (!response.ok) {
          console.error(`Push failed for subscription ${sub.id}:`, response.statusText);
          
          // Deactivate subscription if it's invalid
          if (response.status === 404 || response.status === 410) {
            await supabaseClient
              .from('push_subscriptions')
              .update({ is_active: false })
              .eq('id', sub.id);
          }
        }

        return { success: response.ok, subscriptionId: sub.id };
      } catch (error) {
        console.error(`Error sending push to subscription ${sub.id}:`, error);
        return { success: false, subscriptionId: sub.id, error: String(error) };
      }
    });

    const results = await Promise.all(pushPromises);
    const successCount = results.filter((r) => r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: subscriptions.length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in send-push-notification function:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to send Web Push notification
async function sendWebPush(
  endpoint: string,
  payload: string,
  keys: { auth: string; p256dh: string },
  vapidPublicKey: string,
  vapidPrivateKey: string
): Promise<Response> {
  // Create VAPID authorization header
  const vapidHeaders = createVapidHeaders(endpoint, vapidPublicKey, vapidPrivateKey);

  // Encrypt payload
  const encryptedPayload = await encryptPayload(payload, keys);

  // Send push request
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'TTL': '86400', // 24 hours
      'Content-Encoding': 'aes128gcm',
      'Authorization': vapidHeaders.Authorization,
      ...vapidHeaders,
    },
    body: encryptedPayload,
  });

  return response;
}

// Create VAPID authorization header
function createVapidHeaders(
  endpoint: string,
  publicKey: string,
  privateKey: string
): Record<string, string> {
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;
  
  // Create JWT for VAPID
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // 12 hours
  
  const jwt = {
    aud: audience,
    exp: exp,
    sub: 'mailto:support@proxilink.com',
  };

  // For production, use a proper JWT library
  // This is a simplified version
  const authHeader = `vapid t=${btoa(JSON.stringify(jwt))}, k=${publicKey}`;

  return {
    'Authorization': authHeader,
  };
}

// Encrypt payload using Web Push encryption
async function encryptPayload(
  payload: string,
  keys: { auth: string; p256dh: string }
): Promise<Uint8Array> {
  // For production, implement proper Web Push encryption (aes128gcm)
  // This is a placeholder that returns the payload as-is
  // In production, use a library like 'web-push' or implement the encryption spec
  
  const encoder = new TextEncoder();
  return encoder.encode(payload);
}
