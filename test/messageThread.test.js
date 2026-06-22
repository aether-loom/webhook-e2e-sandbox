import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  addMessage,
  createThreadState,
  getComposerState,
  getDraftForChannel,
  getMessagesForChannel,
  toggleReaction,
  updateDraft,
} from '../src/messageThread.js';

describe('message thread state', () => {
  it('tracks draft text per channel and exposes composer readiness', () => {
    let state = createThreadState({ general: [], product: [] });

    assert.equal(getComposerState(state, 'general'), 'empty');

    state = updateDraft(state, 'general', '  hello team  ');

    assert.equal(getDraftForChannel(state, 'general'), '  hello team  ');
    assert.equal(getDraftForChannel(state, 'product'), '');
    assert.equal(getComposerState(state, 'general'), 'ready');
  });

  it('adds a trimmed message and clears the submitted draft', () => {
    const now = new Date('2026-06-22T14:30:00.000Z');
    const state = updateDraft(createThreadState({ general: [] }), 'general', '  Ship it  ');
    const nextState = addMessage(state, 'general', getDraftForChannel(state, 'general'), now);
    const messages = getMessagesForChannel(nextState, 'general');

    assert.equal(messages.length, 1);
    assert.equal(messages[0].body, 'Ship it');
    assert.equal(messages[0].author, 'You');
    assert.equal(messages[0].timestamp, now.toISOString());
    assert.equal(getDraftForChannel(nextState, 'general'), '');
  });

  it('does not add blank messages', () => {
    const state = createThreadState({ general: [] });

    assert.equal(addMessage(state, 'general', '   '), state);
  });

  it('toggles an existing reaction count and active state', () => {
    const state = createThreadState({
      general: [
        {
          id: 'm1',
          author: 'Maya',
          avatar: 'MC',
          role: 'Lead',
          timestamp: '2026-06-22T09:00:00.000Z',
          body: 'Hi',
          replies: 0,
          pinned: false,
          reactions: [{ emoji: '👍', count: 1, active: false }],
        },
      ],
    });

    const nextState = toggleReaction(state, 'general', 'm1', '👍');
    assert.deepEqual(getMessagesForChannel(nextState, 'general')[0].reactions[0], {
      emoji: '👍',
      count: 2,
      active: true,
    });
  });

  it('adds a new reaction affordance when one does not exist', () => {
    const state = createThreadState({
      general: [
        {
          id: 'm1',
          author: 'Maya',
          avatar: 'MC',
          role: 'Lead',
          timestamp: '2026-06-22T09:00:00.000Z',
          body: 'Hi',
          replies: 0,
          pinned: false,
          reactions: [],
        },
      ],
    });

    const nextState = toggleReaction(state, 'general', 'm1', '🎉');
    assert.deepEqual(getMessagesForChannel(nextState, 'general')[0].reactions, [
      { emoji: '🎉', count: 1, active: true },
    ]);
  });
});
