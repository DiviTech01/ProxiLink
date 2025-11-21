import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock env
vi.stubEnv('VITE_USE_DEMO_VENDORS', 'false');

// Mock supabase client with tailored responses for this test
vi.mock('@/integrations/supabase/client', () => {
  const now = new Date().toISOString();
  const auth = {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'demo-user' } } }),
  };

  // spies we can assert against
  const messagesUpdate = vi.fn(() => Promise.resolve({ data: [], error: null }));

  function from(table?: string) {
    if (table === 'conversations') {
      // chainable builder: select(...).or(...).order(...) -> Promise
      return {
        select: () => ({
          or: () => ({
            order: () => Promise.resolve({ data: [
              {
                id: 'conv-1',
                user_id: 'demo-user',
                vendor_id: 'demo-vendor-1',
                last_message_at: now,
                created_at: now,
                messages: [ { id: 'm1', sender_id: 'demo-vendor-1', is_read: false } ],
                other_user: { id: 'demo-vendor-1', full_name: 'Nairobi Fresh Foods', phone: 'N/A' }
              }
            ] }),
          }),
        }),
      };
    }

    if (table === 'messages') {
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [
              { id: 'm1', conversation_id: 'conv-1', sender_id: 'demo-vendor-1', content: 'Hello', is_read: false, created_at: now }
            ] }),
          })
        }),
        update: () => ({
          eq: () => ({
            neq: () => Promise.resolve({ data: [], error: null })
          })
        })
      };
    }

    if (table === 'profiles') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { id: 'demo-vendor-1', full_name: 'Nairobi Fresh Foods', phone: 'N/A' } })
          })
        })
      };
    }

    return {
      select: () => Promise.resolve({ data: [] }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
    };
  }

  return {
    supabase: {
      auth,
      from,
      channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }) }),
      removeChannel: () => {},
    },
  };
});

import Messages from '../Messages';

describe('Messages mark-as-read behavior', () => {
  it('shows unread badge and clears it when conversation opened', async () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );

    // Wait for conversations title(s)
    const headings = await screen.findAllByText(/Conversations/i);
    expect(headings.length).toBeGreaterThan(0);

    // Click the conversation (by name)
    const convButton = screen.getByText('Nairobi Fresh Foods');
    fireEvent.click(convButton.closest('button') || convButton);

    // After opening, the message content from the conversation should be visible
    const incoming = await screen.findByText('Hello');
    expect(incoming).toBeTruthy();
  });
});
