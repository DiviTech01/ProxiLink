// Demo conversations and messages for offline/demo mode
import demoVendors from './demoVendors';

export interface DemoConversation {
  id: string;
  user_id: string;
  vendor_id: string;
  last_message_at: string;
  other_user: { id: string; full_name?: string; phone?: string };
}

export interface DemoMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function generateDemoConversations(currentUserId: string) {
  const vendors = demoVendors.slice(0, 3);
  const now = Date.now();
  return vendors.map((v, i) => ({
    id: `demo-conv-${i + 1}`,
    user_id: currentUserId || 'demo-user',
    vendor_id: v.id,
    last_message_at: new Date(now - i * 60000).toISOString(),
    other_user: { id: v.id, full_name: v.profiles?.full_name, phone: 'N/A' },
  }));
}

export function generateDemoMessages(conversationId: string, currentUserId: string) {
  const now = Date.now();
  return [
    {
      id: `${conversationId}-m1`,
      conversation_id: conversationId,
      sender_id: conversationId.includes('1') ? 'demo-vendor-1' : 'demo-vendor-2',
      content: 'Hello! How can I help you today?',
      is_read: true,
      created_at: new Date(now - 600000).toISOString(),
    },
    {
      id: `${conversationId}-m2`,
      conversation_id: conversationId,
      sender_id: currentUserId || 'demo-user',
      content: 'I am interested in your service.',
      is_read: true,
      created_at: new Date(now - 300000).toISOString(),
    },
  ];
}

export default { generateDemoConversations, generateDemoMessages };
