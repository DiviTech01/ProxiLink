import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Messages from '../Messages';

// Mock env to enable demo mode
import { vi } from 'vitest';
vi.stubEnv('VITE_USE_DEMO_VENDORS', 'true');

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => {
  const auth = {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'demo-user' } } }),
  };

  function from() {
    // Provide resolved results for select so the component can render conversations/messages
    return {
      select: () => Promise.resolve({ data: [] }),
      insert: () => Promise.reject(new Error('db unavailable')),
      update: () => Promise.reject(new Error('db unavailable')),
    };
  }

  return {
    supabase: {
      auth,
      from,
      channel: () => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      }),
      removeChannel: () => {},
    },
  };
});

describe('Messages page (demo mode)', () => {
  it('renders demo conversations and allows sending a demo message with auto-reply', async () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );

    // Wait for Conversations header
    expect(await screen.findByText(/Conversations/i)).toBeTruthy();

    // Wait for demo conversation button(s) to appear
    await waitFor(() => {
      const convButtons = screen.getAllByRole('button');
      expect(convButtons.length).toBeGreaterThan(0);
    });

    // Click the first conversation by its name
    const convButton = screen.getByText('Nairobi Fresh Foods');
    // get the closest button ancestor and click it
    fireEvent.click(convButton.closest('button') || convButton);

    // Wait for message input
    const input = await screen.findByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello demo' } });

    // Press Enter to send (component handles Enter key)
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Our demo message should appear
    expect(await screen.findByText('Hello demo')).toBeTruthy();

    // Then the auto-reply should appear after a short delay
    await waitFor(() => expect(screen.queryByText(/Vendor is typing/i)).not.toBeNull());
    await waitFor(() => {
      const replies = screen.queryAllByText(/Thanks|Sure|Can you share/i);
      expect(replies.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});
