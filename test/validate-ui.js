const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const requiredHtml = [
  'data-app="slack-message-thread"',
  'class="message-list"',
  'class="message-affordances"',
  'class="composer"',
  'data-state="draft"',
  'class="thread-panel open"',
  'class="thread-composer composer mini"',
  'aria-live="polite"'
];

for (const marker of requiredHtml) {
  assert(html.includes(marker), `Missing expected HTML marker: ${marker}`);
}

const requiredCss = [
  '.message-affordances',
  '.composer[data-state="sending"]',
  '.thread-panel',
  '.reply.sending',
  '@media (max-width: 1050px)'
];

for (const marker of requiredCss) {
  assert(css.includes(marker), `Missing expected CSS marker: ${marker}`);
}

const requiredJs = ['setComposerState', "data-open-thread", "event.key === 'Enter'", "threadClose?.addEventListener"];
for (const marker of requiredJs) {
  assert(js.includes(marker), `Missing expected JS marker: ${marker}`);
}

const messageCount = (html.match(/<article class="message/g) || []).length;
assert(messageCount >= 5, `Expected at least 5 message articles, found ${messageCount}`);

console.log('UI validation passed: message thread, composer states, and affordances are present.');
