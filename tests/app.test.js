import test from 'node:test';
import assert from 'node:assert/strict';
import { createMessage, getComposerState, initialMessages } from '../src/app.js';

test('composer requires content or queued attachment before send', () => {
  assert.equal(getComposerState('').canSend, false);
  assert.equal(getComposerState('   ').canSend, false);
  assert.equal(getComposerState('', true).canSend, true);
  assert.equal(getComposerState('Looks good').canSend, true);
});

test('composer exposes multiline state for long or line-broken content', () => {
  assert.equal(getComposerState('short').isMultiline, false);
  assert.equal(getComposerState('first line\nsecond line').isMultiline, true);
  assert.equal(getComposerState('x'.repeat(97)).isMultiline, true);
});

test('new messages preserve attachment affordance metadata', () => {
  const message = createMessage('  Review this please  ', true);
  assert.equal(message.author, 'You');
  assert.equal(message.text, 'Review this please');
  assert.equal(message.attachment, 'design-review.png');
});

test('seed messages include thread and reaction affordances', () => {
  assert.ok(initialMessages.some((message) => message.replies > 0));
  assert.ok(initialMessages.some((message) => message.reactions.length > 0));
});
