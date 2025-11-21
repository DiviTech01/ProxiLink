# Send Push Notification Edge Function

This Supabase Edge Function handles server-side delivery of Web Push notifications.

## Setup

### 1. Set Environment Variables

In your Supabase project dashboard, go to Settings > Edge Functions and add the following secrets:

```bash
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 2. Generate VAPID Keys

You can generate VAPID keys using the `web-push` npm package:

```bash
npx web-push generate-vapid-keys
```

This will output:
```
=======================================
Public Key:
BIhpXSFCHWaCsIrqdcyqFUmNTYwBSQfy0V1bI1w8elyQB4ZmfTWOfbOt9QxzTskI8dS2_ck4pN-fMSXMaiQCX0M

Private Key:
YOUR_PRIVATE_KEY_HERE
=======================================
```

### 3. Deploy the Function

```bash
supabase functions deploy send-push-notification
```

### 4. Set Secrets

```bash
supabase secrets set VAPID_PUBLIC_KEY="your_public_key"
supabase secrets set VAPID_PRIVATE_KEY="your_private_key"
```

## Usage

### From Database Trigger

Create a trigger that calls this function when a notification is created:

```sql
CREATE OR REPLACE FUNCTION notify_user_via_push()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the Edge Function
  PERFORM
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'userId', NEW.user_id,
        'title', NEW.title,
        'body', NEW.content,
        'data', jsonb_build_object('notificationId', NEW.id::text)
      )
    );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER push_notification_on_insert
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_via_push();
```

### Direct API Call

```typescript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/send-push-notification',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      userId: 'user-uuid',
      title: 'New Message',
      body: 'You have a new message!',
      data: {
        actionUrl: '/messages',
      },
    }),
  }
);
```

## Payload Format

```typescript
{
  userId: string;        // The user to send the notification to
  title: string;         // Notification title
  body: string;          // Notification body text
  data?: {               // Optional data to include
    [key: string]: any;
  };
}
```

## Response Format

```typescript
{
  success: boolean;
  sent: number;          // Number of successfully sent notifications
  total: number;         // Total number of subscription attempts
  results: Array<{
    success: boolean;
    subscriptionId: string;
    error?: string;
  }>;
}
```

## Notes

- The function automatically deactivates subscriptions that return 404 or 410 (gone/not found)
- Push notifications are sent to all active subscriptions for the user
- Uses VAPID for authentication with push services
- Implements Web Push Protocol (RFC 8030)

## Production Considerations

1. **Encryption**: The current implementation has a placeholder encryption function. For production, implement proper aes128gcm encryption using a library or the Web Push encryption spec.

2. **JWT Signing**: The VAPID JWT should be properly signed using ES256. Use a JWT library that supports ES256 with VAPID keys.

3. **Rate Limiting**: Implement rate limiting to prevent abuse.

4. **Monitoring**: Add logging and monitoring for failed deliveries.

5. **Retry Logic**: Implement exponential backoff for failed deliveries.

6. **Batch Processing**: For high volume, batch notifications to the same user.
