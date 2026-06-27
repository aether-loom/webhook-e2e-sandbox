export const initialMessages = [
  {
    id: 'm1',
    author: 'Maya Chen',
    handle: 'maya',
    avatar: 'MC',
    time: '9:38 AM',
    text: 'Morning team — I pushed the onboarding polish branch. Can someone sanity check the composer behavior before standup?',
    reactions: [
      { emoji: '👀', count: 3, active: true },
      { emoji: '🚀', count: 1, active: false }
    ],
    replies: 4,
    lastReply: '9:52 AM',
    status: 'edited'
  },
  {
    id: 'm2',
    author: 'Jordan Lee',
    handle: 'jordan',
    avatar: 'JL',
    time: '9:45 AM',
    text: 'The empty state now matches the desktop spec. I left a note in the thread about keyboard focus on send.',
    reactions: [{ emoji: '✅', count: 2, active: false }],
    replies: 2,
    lastReply: '9:57 AM'
  },
  {
    id: 'm3',
    author: 'Priya Shah',
    handle: 'priya',
    avatar: 'PS',
    time: '10:03 AM',
    text: 'I can verify. The attachment affordance should remain visible even when the message box expands to multiple lines.',
    reactions: [],
    replies: 0,
    lastReply: null
  }
];

const state = {
  messages: structuredClone(initialMessages),
  selectedThreadId: 'm1',
  composerText: '',
  threadText: '',
  attachmentQueued: false,
  formattingOpen: true,
  typingUsers: ['Alex', 'Sam']
};

export function getComposerState(text, attachmentQueued = false) {
  const trimmed = text.trim();
  return {
    canSend: trimmed.length > 0 || attachmentQueued,
    isMultiline: text.includes('\n') || text.length > 96,
    helperText: trimmed.length > 0 ? `${trimmed.length} characters ready to send` : 'Shift + Enter for a new line. Enter to send.',
    placeholder: attachmentQueued ? 'Add a note about this attachment…' : 'Message #product-design'
  };
}

export function createMessage(text, attachmentQueued = false) {
  return {
    id: `m${Date.now()}`,
    author: 'You',
    handle: 'you',
    avatar: 'YO',
    time: 'now',
    text: text.trim() || 'Shared an attachment',
    reactions: [],
    replies: 0,
    lastReply: null,
    attachment: attachmentQueued ? 'design-review.png' : null
  };
}

function selectedThread() {
  return state.messages.find((message) => message.id === state.selectedThreadId) || state.messages[0];
}

function reactionButton(reaction, messageId) {
  const activeClass = reaction.active ? ' reaction--active' : '';
  return `<button class="reaction${activeClass}" data-action="toggle-reaction" data-message-id="${messageId}" data-emoji="${reaction.emoji}" aria-pressed="${reaction.active}">${reaction.emoji} <span>${reaction.count}</span></button>`;
}

function renderMessage(message) {
  const replies = message.replies > 0
    ? `<button class="reply-pill" data-action="open-thread" data-message-id="${message.id}">${message.replies} replies <span>Last reply ${message.lastReply}</span></button>`
    : `<button class="reply-pill reply-pill--empty" data-action="open-thread" data-message-id="${message.id}">Reply in thread</button>`;
  const attachment = message.attachment ? `<div class="attachment-card"><span class="file-icon">▧</span><div><strong>${message.attachment}</strong><small>Uploaded just now</small></div></div>` : '';
  const status = message.status ? `<span class="message-status">${message.status}</span>` : '';

  return `
    <article class="message" data-message-id="${message.id}">
      <div class="avatar" aria-hidden="true">${message.avatar}</div>
      <div class="message__body">
        <header><strong>${message.author}</strong><span>@${message.handle}</span><time>${message.time}</time>${status}</header>
        <p>${escapeHtml(message.text)}</p>
        ${attachment}
        <div class="message__actions" aria-label="Message actions">
          <button data-action="react" data-message-id="${message.id}">😊 React</button>
          <button data-action="open-thread" data-message-id="${message.id}">💬 Thread</button>
          <button>⋯ More</button>
        </div>
        <div class="reaction-row">${message.reactions.map((reaction) => reactionButton(reaction, message.id)).join('')}</div>
        ${replies}
      </div>
    </article>`;
}

function renderComposer(kind = 'channel') {
  const text = kind === 'thread' ? state.threadText : state.composerText;
  const composer = getComposerState(text, kind === 'channel' && state.attachmentQueued);
  const placeholder = kind === 'thread' ? 'Reply to thread…' : composer.placeholder;
  return `
    <form class="composer composer--${kind}${composer.isMultiline ? ' composer--expanded' : ''}" data-composer="${kind}">
      <div class="composer__toolbar ${state.formattingOpen ? '' : 'is-collapsed'}" aria-label="Formatting toolbar">
        <button type="button"><strong>B</strong></button>
        <button type="button"><em>I</em></button>
        <button type="button">Link</button>
        <button type="button">Code</button>
        <button type="button">List</button>
      </div>
      ${state.attachmentQueued && kind === 'channel' ? '<div class="queued-file"><span>▧ design-review.png</span><button type="button" data-action="remove-attachment">Remove</button></div>' : ''}
      <label class="sr-only" for="${kind}-composer-input">${placeholder}</label>
      <textarea id="${kind}-composer-input" name="message" rows="${composer.isMultiline ? 4 : 2}" placeholder="${placeholder}">${escapeHtml(text)}</textarea>
      <footer>
        <div class="composer__left">
          <button type="button" data-action="toggle-formatting" aria-pressed="${state.formattingOpen}">Aa</button>
          <button type="button" data-action="queue-attachment">＋</button>
          <button type="button">😀</button>
          <span>${kind === 'channel' ? composer.helperText : 'Thread replies notify followers.'}</span>
        </div>
        <button class="send-button" type="submit" ${composer.canSend ? '' : 'disabled'}>Send</button>
      </footer>
    </form>`;
}

function renderThreadPanel() {
  const thread = selectedThread();
  const replies = [
    { author: 'Alex Kim', avatar: 'AK', time: '9:49 AM', text: 'Focus ring looks good in Chrome and Safari.' },
    { author: 'Sam Patel', avatar: 'SP', time: '9:52 AM', text: 'I added a tiny delay to keep the typing state from flickering.' }
  ];

  return `
    <aside class="thread-panel" aria-label="Thread panel">
      <header class="thread-panel__header"><div><span>Thread</span><strong>#product-design</strong></div><button data-action="close-thread" aria-label="Close thread">×</button></header>
      <div class="thread-root">${renderMessage(thread)}</div>
      <div class="thread-replies">
        ${replies.map((reply) => `<article class="thread-reply"><div class="avatar avatar--small">${reply.avatar}</div><div><header><strong>${reply.author}</strong><time>${reply.time}</time></header><p>${reply.text}</p></div></article>`).join('')}
      </div>
      <div class="typing-indicator"><span></span><span></span><span></span>${state.typingUsers.join(' and ')} are typing…</div>
      ${renderComposer('thread')}
    </aside>`;
}

export function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <main class="slack-shell">
      <nav class="workspace-rail" aria-label="Workspace switcher"><div class="workspace-logo">S</div><button>＋</button></nav>
      <aside class="sidebar">
        <div class="workspace-name">Acme Product <span>⌄</span></div>
        <button class="compose-shortcut">✎ New message</button>
        <section><h2>Channels</h2><a class="active"># product-design</a><a># engineering</a><a># launches</a></section>
        <section><h2>Direct messages</h2><a>● Maya Chen</a><a>○ Jordan Lee</a></section>
      </aside>
      <section class="channel-view">
        <header class="channel-header"><div><h1># product-design</h1><p>42 members · Canvas · Huddle</p></div><button>Start huddle</button></header>
        <div class="message-list" aria-live="polite">
          <div class="date-divider"><span>Today</span></div>
          ${state.messages.map(renderMessage).join('')}
        </div>
        ${renderComposer('channel')}
      </section>
      ${renderThreadPanel()}
    </main>`;
}

function updateTextFromForm(form) {
  const kind = form.dataset.composer;
  const value = form.querySelector('textarea').value;
  if (kind === 'thread') state.threadText = value;
  else state.composerText = value;
}

export function attachHandlers() {
  if (document.body.dataset.handlersAttached === 'true') return;
  document.body.dataset.handlersAttached = 'true';

  document.addEventListener('input', (event) => {
    const form = event.target.closest('[data-composer]');
    if (!form) return;
    updateTextFromForm(form);
    renderApp();
    document.querySelector(`#${form.dataset.composer}-composer-input`)?.focus();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-composer]');
    if (!form) return;
    event.preventDefault();
    updateTextFromForm(form);
    if (form.dataset.composer === 'thread') {
      const thread = selectedThread();
      thread.replies += 1;
      thread.lastReply = 'now';
      state.threadText = '';
    } else if (getComposerState(state.composerText, state.attachmentQueued).canSend) {
      state.messages.push(createMessage(state.composerText, state.attachmentQueued));
      state.composerText = '';
      state.attachmentQueued = false;
    }
    renderApp();
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'open-thread') state.selectedThreadId = button.dataset.messageId;
    if (action === 'toggle-formatting') state.formattingOpen = !state.formattingOpen;
    if (action === 'queue-attachment') state.attachmentQueued = true;
    if (action === 'remove-attachment') state.attachmentQueued = false;
    if (action === 'toggle-reaction') {
      const message = state.messages.find((item) => item.id === button.dataset.messageId);
      const reaction = message?.reactions.find((item) => item.emoji === button.dataset.emoji);
      if (reaction) {
        reaction.active = !reaction.active;
        reaction.count += reaction.active ? 1 : -1;
      }
    }
    if (action) renderApp();
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

if (typeof document !== 'undefined') {
  renderApp();
  attachHandlers();
}
