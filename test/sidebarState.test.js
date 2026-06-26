import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createSidebarState,
  formatUnreadCount,
  getActiveChannel,
  getUnreadChannelCount,
  getUnreadTotal,
  selectChannel,
} from '../src/sidebarState.js';

describe('sidebar state', () => {
  it('tracks the active channel', () => {
    const state = createSidebarState(undefined, 'product');

    assert.equal(getActiveChannel(state).id, 'product');
  });

  it('falls back to the first channel when the requested active channel is missing', () => {
    const state = createSidebarState(undefined, 'missing');

    assert.equal(state.activeChannelId, 'general');
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

  it('does not count muted unread messages in workspace totals by default', () => {
    const state = createSidebarState();

    assert.equal(getUnreadTotal(state), 127);
    assert.equal(getUnreadChannelCount(state), 4);
  });

  it('can include muted channels in unread totals', () => {
    const state = createSidebarState();

    assert.equal(getUnreadTotal(state, { includeMuted: true }), 131);
    assert.equal(getUnreadChannelCount(state, { includeMuted: true }), 5);
  });

  it('formats unread badges for empty, normal, and capped counts', () => {
    assert.equal(formatUnreadCount(0), '');
    assert.equal(formatUnreadCount(12), '12');
    assert.equal(formatUnreadCount(125), '99+');
  });
});
