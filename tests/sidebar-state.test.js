const assert = require('node:assert/strict');
const {
  cloneChannels,
  formatUnreadLabel,
  getActiveChannel,
  initialChannels,
  selectChannel
} = require('../src/sidebar-state');

const channels = cloneChannels(initialChannels);

assert.equal(getActiveChannel(channels).id, 'general', 'general starts as active channel');
assert.equal(formatUnreadLabel(channels[1]), '2 unread mentions');
assert.equal(formatUnreadLabel(channels[2]), '3 unread messages');
assert.equal(formatUnreadLabel(channels[0]), 'No unread messages');

const selected = selectChannel(channels, 'product');
assert.equal(getActiveChannel(selected).id, 'product', 'selected channel becomes active');
assert.equal(selected.find((channel) => channel.id === 'product').unread, 0, 'active channel unread count is cleared');
assert.equal(selected.find((channel) => channel.id === 'product').mentions, 0, 'active channel mention count is cleared');
assert.equal(selected.find((channel) => channel.id === 'engineering').unread, 12, 'other unread counts are preserved');
assert.equal(channels.find((channel) => channel.id === 'product').unread, 7, 'selection is immutable');

console.log('sidebar-state tests passed');
