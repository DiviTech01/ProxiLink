import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { demoNotifications, incomingDemoNotifications } from '@/data/demoNotifications';

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  related_id?: string | null;
  notification_type: string;
  is_read?: boolean | null;
  created_at?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationIndexRef = useRef(0);
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Add demo notifications if empty or use data from database
      const allNotifications = (data as NotificationRow[]) || [];
      if (allNotifications.length === 0) {
        setNotifications([...demoNotifications]);
      } else {
        setNotifications(allNotifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      // Still show demo notifications on error
      setNotifications([...demoNotifications]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Simulate incoming demo notifications
  const startDemoNotifications = useCallback(() => {
    // Clear any existing timer
    if (demoTimerRef.current) {
      clearInterval(demoTimerRef.current);
    }

    // Generate a new notification every 30-60 seconds
    const scheduleNextNotification = () => {
      const delay = Math.floor(Math.random() * 30000) + 30000; // 30-60 seconds
      
      demoTimerRef.current = setTimeout(() => {
        const nextNotification = incomingDemoNotifications[notificationIndexRef.current % incomingDemoNotifications.length];
        const newNotification: NotificationRow = {
          ...nextNotification,
          id: `demo-incoming-${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        setNotifications((prev) => [newNotification, ...prev]);
        toast(
          <div className="flex flex-col">
            <span className="font-semibold">{newNotification.title}</span>
            <span className="text-sm text-muted-foreground">{newNotification.content}</span>
          </div>,
          {
            duration: 4000,
          }
        );

        notificationIndexRef.current += 1;
        scheduleNextNotification(); // Schedule the next one
      }, delay);
    };

    scheduleNextNotification();
  }, []);

  useEffect(() => {
    let mounted = true;
    let cleanupFn: (() => void) | undefined;

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        await fetchNotifications();

        if (!session?.user) {
          setLoading(false);
          // Start demo notifications for non-authenticated users
          startDemoNotifications();
          return;
        }
        const userId = session.user.id;

        // Use Supabase v2 Realtime `channel` API to subscribe to notifications for the user
        const channel = supabase
          .channel(`notifications:${userId}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
            (payload: any) => {
              const newRow = payload.new as NotificationRow;
              if (!mounted || !newRow) return;
              setNotifications((prev) => [newRow, ...prev]);
              toast(
                <div className="flex flex-col">
                  <span className="font-semibold">{newRow.title}</span>
                  <span className="text-sm text-muted-foreground">{newRow.content}</span>
                </div>,
                {
                  duration: 4000,
                }
              );
            }
          )
          .subscribe();

        // Also start demo notifications for authenticated users (fallback)
        startDemoNotifications();

        cleanupFn = () => {
          mounted = false;
          if (demoTimerRef.current) {
            clearTimeout(demoTimerRef.current);
            demoTimerRef.current = null;
          }
          try {
            // supabase.removeChannel is the correct way to remove v2 channels
            if (typeof supabase.removeChannel === 'function') {
              // removeChannel may be async; call it but don't await in cleanup
              // @ts-ignore
              supabase.removeChannel(channel);
            } else if (typeof channel?.unsubscribe === 'function') {
              // fallback for older client implementations
              channel.unsubscribe();
            }
          } catch (e) {
            console.warn('Failed to unsubscribe from notifications channel', e);
          }
        };
      } catch (e) {
        console.error('useNotifications setup failed', e);
        setLoading(false);
        // Start demo notifications on error
        startDemoNotifications();
      }
    })();

    return () => {
      mounted = false;
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
        demoTimerRef.current = null;
      }
      if (typeof cleanupFn === 'function') cleanupFn();
    };
  }, [fetchNotifications, startDemoNotifications]);

  const markAsRead = async (id: string) => {
    // Optimistically update UI
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    
    // Don't attempt database update for demo notifications
    if (id.startsWith('demo')) {
      return;
    }

    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  const markAllRead = async () => {
    // Optimistically update UI
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      const unreadIds = notifications.filter((n) => !n.is_read && !n.id.startsWith('demo')).map((n) => n.id);
      if (unreadIds.length === 0) return;
      await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    } catch (e) {
      console.error('Failed to mark all read', e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, loading, unreadCount, markAsRead, markAllRead, refetch: fetchNotifications };
}

export default useNotifications;
