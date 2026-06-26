import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createSidebarState,
  formatUnreadCount,
  getActiveChannel,
  getUnreadTotal,
  selectChannel,
} from '../src/sidebarState.js';

describe('sidebar state', () => {
  it('tracks the active channel', () => {
    const state = createSidebarState(undefined, 'product');

    assert.equal(getActiveChannel(state).id, 'product');
  });

  it('clears unread count for the selected channel only', () => {
    const state = createSidebarState();
    const nextState = selectChannel(state, 'engineering');

    assert.equal(nextState.activeChannelId, 'engineering');
    assert.equal(nextState.channels.find((channel) => channel.id === 'engineering').unread, 0);
    assert.equal(nextState.channels.find((channel) => channel.id === 'product').unread, 8);
  });

  it('leaves state unchanged for an unknown channel', () => {
    const state = createSidebarState();

    assert.equal(selectChannel(state, 'missing'), state);
  });

  it('does not count muted unread messages in workspace total', () => {
    const state = createSidebarState();

    assert.equal(getUnreadTotal(state), 23);
  });

  it('formats unread badges for empty, normal, and capped counts', () => {
    assert.equal(formatUnreadCount(0), '');
    assert.equal(formatUnreadCount(12), '12');
    assert.equal(formatUnreadCount(125), '99+');
  });
});
