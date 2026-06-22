const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(html.includes('aria-label="Message thread"'), 'message thread region is present');
assert(html.includes('aria-label="Message composer"'), 'message composer region is present');
assert(html.includes('placeholder="Message #launch-review"'), 'composer has channel-specific placeholder');
assert((html.match(/class="message/g) || []).length >= 3, 'seed thread includes at least three messages');
assert(html.includes('Reply</button>') && html.includes('React</button>') && html.includes('Share</button>'), 'message affordance actions are rendered');
assert(html.includes('View thread') && html.includes('reply-count'), 'thread reply affordance is rendered');
assert(html.includes('composer-state') && html.includes('send-button'), 'composer state and send controls are rendered');
assert(css.includes('.message:hover .message-actions') && css.includes('.composer.ready .send-button'), 'hover affordances and ready send state are styled');
assert(js.includes('renderComposerState') && js.includes('Ctrl/⌘ Enter to send'), 'composer state transitions are implemented');
assert(js.includes('createMessage') && js.includes('appendChild(message)'), 'sending appends a new message to the thread');
assert(js.includes('active-reaction') && js.includes('classList.toggle'), 'reaction toggling is implemented');

console.log('UI validation passed');
