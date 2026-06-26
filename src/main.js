import {
  createSidebarState,
  formatUnreadCount,
  getActiveChannel,
  getUnreadTotal,
  selectChannel,
} from './sidebarState.js';
import {
  addMessage,
  beginSending,
  createThreadState,
  formatTimestamp,
  getComposerState,
  getDraftForChannel,
  getMessagesForChannel,
  toggleReaction,
  updateDraft,
} from './messageThread.js';

let sidebarState = createSidebarState();
let threadState = createThreadState();
const app = document.querySelector('#app');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderChannelButton(channel) {
  const isActive = channel.id === sidebarState.activeChannelId;
  const unreadLabel = formatUnreadCount(channel.unread);
  const classNames = [
    'channel-row',
    isActive && 'channel-row--active',
    channel.unread > 0 && 'channel-row--unread',
    channel.muted && 'channel-row--muted',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <button
      class="${classNames}"
      data-channel-id="${channel.id}"
      aria-current="${isActive ? 'page' : 'false'}"
      aria-label="#${channel.name}${channel.unread ? `, ${channel.unread} unread` : ''}${channel.muted ? ', muted' : ''}"
    >
      <span class="channel-row__hash" aria-hidden="true">#</span>
      <span class="channel-row__name">${channel.name}</span>
      ${channel.muted ? '<span class="channel-row__muted" aria-label="Muted">⌁</span>' : ''}
      ${unreadLabel ? `<span class="unread-badge" aria-label="${channel.unread} unread">${unreadLabel}</span>` : ''}
    </button>
  `;
}

function renderReaction(channelId, message, reaction) {
  return `
    <button
      class="reaction ${reaction.active ? 'reaction--active' : ''}"
      data-reaction-message-id="${message.id}"
      data-reaction-channel-id="${channelId}"
      data-reaction-emoji="${reaction.emoji}"
      aria-label="React ${reaction.emoji}, ${reaction.count} reactions"
    >${reaction.emoji} <span>${reaction.count}</span></button>
  `;
}

function renderMessage(channelId, message) {
  return `
    <article class="message ${message.own ? 'message--own' : ''}">
      <div class="message__avatar" aria-hidden="true">${message.avatar}</div>
      <div class="message__content">
        <div class="message__meta">
          <strong>${escapeHtml(message.author)}</strong>
          <span>${escapeHtml(message.role)}</span>
          <time datetime="${message.timestamp}">${formatTimestamp(message.timestamp)}</time>
          ${message.pinned ? '<span class="message__pin">Pinned</span>' : ''}
        </div>
        <p>${escapeHtml(message.body)}</p>
        <div class="message__footer">
          <div class="reaction-list">
            ${message.reactions.map((reaction) => renderReaction(channelId, message, reaction)).join('')}
            <button class="reaction reaction--add" data-reaction-message-id="${message.id}" data-reaction-channel-id="${channelId}" data-reaction-emoji="👍">＋</button>
          </div>
          <button class="reply-link" aria-label="${message.replies} replies">${message.replies ? `${message.replies} replies` : 'Reply in thread'}</button>
        </div>
      </div>
      <div class="message__actions" aria-label="Message actions">
        <button aria-label="Add reaction">😊</button>
        <button aria-label="Reply">↩</button>
        <button aria-label="More actions">⋯</button>
      </div>
    </article>
  `;
}

function render() {
  const activeChannel = getActiveChannel(sidebarState);
  const unreadTotal = getUnreadTotal(sidebarState);
  const messages = getMessagesForChannel(threadState, activeChannel.id);
  const draft = getDraftForChannel(threadState, activeChannel.id);
  const composerState = getComposerState(threadState, activeChannel.id);

  app.innerHTML = `
    <main class="slack-shell">
      <aside class="sidebar" aria-label="Slack channels">
        <section class="workspace-card">
          <div>
            <p class="eyebrow">Workspace</p>
            <h1>Acme Team</h1>
          </div>
          ${unreadTotal ? `<span class="workspace-badge" aria-label="${unreadTotal} unread messages">${formatUnreadCount(unreadTotal)}</span>` : ''}
        </section>

        <nav class="channel-list" aria-label="Channels">
          <div class="channel-list__header">
            <span>Channels</span>
            <span class="channel-list__count">${sidebarState.channels.length}</span>
          </div>
          ${sidebarState.channels.map(renderChannelButton).join('')}
        </nav>
      </aside>

      <section class="conversation" aria-labelledby="channel-title">
        <header class="conversation__header">
          <div>
            <p class="eyebrow">Active channel</p>
            <h2 id="channel-title">#${activeChannel.name}</h2>
            <p>${activeChannel.description}</p>
          </div>
          <span class="channel-status">${activeChannel.muted ? 'Muted' : 'Live'}</span>
        </header>

        <div class="thread" role="log" aria-label="Messages in ${activeChannel.name}">
          <div class="thread__day-divider"><span>Today</span></div>
          ${messages.map((message) => renderMessage(activeChannel.id, message)).join('')}
        </div>

        <form class="composer composer--${composerState}" data-composer-form>
          <div class="composer__toolbar" aria-label="Formatting actions">
            <button type="button" aria-label="Bold">B</button>
            <button type="button" aria-label="Italic"><em>I</em></button>
            <button type="button" aria-label="Attach file">📎</button>
            <button type="button" aria-label="Mention teammate">@</button>
          </div>
          <label class="sr-only" for="message-draft">Message #${activeChannel.name}</label>
          <textarea id="message-draft" rows="3" placeholder="Message #${activeChannel.name}" data-composer-input ${composerState === 'sending' ? 'disabled' : ''}>${escapeHtml(draft)}</textarea>
          <div class="composer__footer">
            <span class="composer__state">${composerState === 'ready' ? 'Ready to send' : composerState === 'sending' ? 'Sending…' : 'Draft a message'}</span>
            <button class="send-button" type="submit" ${composerState !== 'ready' ? 'disabled' : ''}>${composerState === 'sending' ? 'Sending…' : 'Send'}</button>
          </div>
        </form>
      </section>
    </main>
  `;

  app.querySelectorAll('[data-channel-id]').forEach((button) => {
    button.addEventListener('click', () => {
      sidebarState = selectChannel(sidebarState, button.dataset.channelId);
      render();
    });
  });

  app.querySelector('[data-composer-input]').addEventListener('input', (event) => {
    threadState = updateDraft(threadState, activeChannel.id, event.target.value);
    render();
    const input = app.querySelector('[data-composer-input]');
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;
  });

  app.querySelector('[data-composer-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const channelId = activeChannel.id;
    const draft = getDraftForChannel(threadState, channelId);
    const nextState = beginSending(threadState, channelId);

    if (nextState === threadState) return;

    threadState = nextState;
    render();

    window.setTimeout(() => {
      threadState = addMessage(threadState, channelId, draft);
      render();
    }, 350);
  });

  app.querySelectorAll('[data-reaction-message-id]').forEach((button) => {
    button.addEventListener('click', () => {
      threadState = toggleReaction(
        threadState,
        button.dataset.reactionChannelId,
        button.dataset.reactionMessageId,
        button.dataset.reactionEmoji,
      );
      render();
    });
  });
}

render();
