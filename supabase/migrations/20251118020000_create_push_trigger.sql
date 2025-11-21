-- Create trigger to automatically send push notifications
-- This trigger fires after a new notification is inserted and calls the Edge Function

CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  function_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get the Supabase project URL and service role key from app settings
  -- These should be set using: ALTER DATABASE postgres SET app.supabase_url = 'your_url';
  function_url := current_setting('app.supabase_url', true) || '/functions/v1/send-push-notification';
  service_role_key := current_setting('app.service_role_key', true);

  -- Only send push notifications for certain types
  IF NEW.notification_type IN ('message', 'review', 'proximity', 'request') THEN
    -- Call the Edge Function asynchronously using pg_net extension
    -- Note: pg_net extension must be enabled first
    PERFORM
      net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object(
          'userId', NEW.user_id,
          'title', NEW.title,
          'body', NEW.content,
          'data', jsonb_build_object(
            'notificationId', NEW.id::text,
            'notificationType', NEW.notification_type,
            'relatedId', NEW.related_id::text,
            'actionUrl', '/notifications'
          )
        )
      );
  END IF;

  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS send_push_on_notification_insert ON public.notifications;

-- Create the trigger
CREATE TRIGGER send_push_on_notification_insert
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_push_notification();

-- NOTE: To enable this trigger, you must:
-- 1. Enable the pg_net extension: CREATE EXTENSION IF NOT EXISTS pg_net;
-- 2. Set configuration variables:
--    ALTER DATABASE postgres SET app.supabase_url = 'https://your-project.supabase.co';
--    ALTER DATABASE postgres SET app.service_role_key = 'your_service_role_key';

COMMENT ON FUNCTION public.trigger_push_notification() IS 
'Automatically sends push notifications via Edge Function when a notification is created';
