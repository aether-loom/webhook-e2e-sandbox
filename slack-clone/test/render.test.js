import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChannelListModel, buildMessageListModel, createInitialState, renderApp } from '../src/app.js';

test('sample workspace exposes channels and active messages', () => {
  const state = createInitialState();
  const channels = buildChannelListModel(state);
  const messages = buildMessageListModel(state);

  assert.equal(state.name, 'Acme Product');
  assert.deepEqual(channels.map((channel) => channel.id), ['general', 'design', 'engineering']);
  assert.equal(channels.filter((channel) => channel.isActive).length, 1);
  assert.equal(messages.channelId, 'general');
  assert.equal(messages.messages.length, 3);
});

test('rendered app includes active channel, unread badges, and message text', () => {
  const html = renderApp(createInitialState());

  assert.match(html, /# general/);
  assert.match(html, /data-channel-id="design"/);
  assert.match(html, /class="unread">3<\/strong>/);
  assert.match(html, /Sprint planning starts in 15 minutes/);
  assert.match(html, /placeholder="Type a message as Maya"/);
});
