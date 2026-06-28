import { workspace } from './data.js';

export function createInitialState(seed = workspace) {
  return structuredClone(seed);
}

export function getActiveChannel(state) {
  return state.channels.find((channel) => channel.id === state.activeChannelId) ?? state.channels[0];
}

export function buildChannelListModel(state) {
  return state.channels.map((channel) => ({
    id: channel.id,
    label: `# ${channel.name}`,
    topic: channel.topic,
    unreadCount: channel.unreadCount,
    isActive: channel.id === getActiveChannel(state).id
  }));
}

export function buildMessageListModel(state) {
  const activeChannel = getActiveChannel(state);
  return {
    channelId: activeChannel.id,
    channelName: activeChannel.name,
    topic: activeChannel.topic,
    messages: state.messages[activeChannel.id] ?? []
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderApp(state = createInitialState()) {
  const channels = buildChannelListModel(state);
  const messageModel = buildMessageListModel(state);

  const channelItems = channels
    .map((channel) => `
      <li>
        <button class="channel${channel.isActive ? ' is-active' : ''}" data-channel-id="${escapeHtml(channel.id)}" aria-current="${channel.isActive ? 'page' : 'false'}">
          <span>${escapeHtml(channel.label)}</span>
          ${channel.unreadCount > 0 ? `<strong class="unread">${channel.unreadCount}</strong>` : ''}
        </button>
      </li>`)
    .join('');

  const messageItems = messageModel.messages
    .map((message) => `
      <article class="message" data-message-id="${escapeHtml(message.id)}">
        <div class="avatar" aria-hidden="true">${escapeHtml(message.author.slice(0, 1))}</div>
        <div>
          <header><strong>${escapeHtml(message.author)}</strong><time>${escapeHtml(message.time)}</time></header>
          <p>${escapeHtml(message.text)}</p>
        </div>
      </article>`)
    .join('');

  return `
    <section class="shell">
      <aside class="sidebar">
        <div class="workspace">${escapeHtml(state.name)}</div>
        <nav aria-label="Channels">
          <h2>Channels</h2>
          <ul>${channelItems}</ul>
        </nav>
      </aside>
      <section class="conversation" aria-live="polite">
        <header class="conversation-header">
          <h1># ${escapeHtml(messageModel.channelName)}</h1>
          <p>${escapeHtml(messageModel.topic)}</p>
        </header>
        <div class="messages">${messageItems}</div>
        <form class="composer">
          <label for="draft">Message #${escapeHtml(messageModel.channelName)}</label>
          <input id="draft" type="text" placeholder="Type a message as ${escapeHtml(state.currentUser)}" />
        </form>
      </section>
    </section>`;
}

export function mountApp(root = document.querySelector('#app'), state = createInitialState()) {
  if (!root) return;
  root.innerHTML = renderApp(state);
}

if (typeof document !== 'undefined') {
  mountApp();
}
