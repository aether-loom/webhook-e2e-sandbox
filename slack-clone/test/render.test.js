import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChannelListModel,
  buildMessageListModel,
  createInitialState,
  getChannelLastMessage,
  renderApp,
  setActiveChannel
} from '../src/app.js';

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

test('channel list model includes unread state and last message timestamps', () => {
  const state = createInitialState();
  const channels = buildChannelListModel(state);
  const design = channels.find((channel) => channel.id === 'design');

  assert.equal(design.hasUnread, true);
  assert.equal(design.unreadCount, 3);
  assert.equal(design.lastMessageTime, '10:02 AM');
  assert.equal(design.ariaLabel, 'design channel, 3 unread');
  assert.equal(getChannelLastMessage(state, 'engineering').time, '10:35 AM');
});

test('setActiveChannel switches messages and clears unread count', () => {
  const state = createInitialState();

  setActiveChannel(state, 'design');

  const channels = buildChannelListModel(state);
  const messages = buildMessageListModel(state);
  const design = channels.find((channel) => channel.id === 'design');

  assert.equal(messages.channelId, 'design');
  assert.equal(messages.messages[0].id, 'm-200');
  assert.equal(design.isActive, true);
  assert.equal(design.unreadCount, 0);
  assert.equal(design.hasUnread, false);
});

test('rendered app includes active channel, unread badges, timestamps, and message text', () => {
  const html = renderApp(createInitialState());

  assert.match(html, /# general/);
  assert.match(html, /data-channel-id="design"/);
  assert.match(html, /class="unread" aria-label="3 unread messages">3<\/strong>/);
  assert.match(html, /class="channel-time">10:02 AM<\/time>/);
  assert.match(html, /Sprint planning starts in 15 minutes/);
  assert.match(html, /placeholder="Type a message as Maya"/);
});
