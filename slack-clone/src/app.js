import { workspace } from './data.js';

export function createInitialState(seed = workspace) {
  return structuredClone(seed);
}

export function getActiveChannel(state) {
  return state.channels.find((channel) => channel.id === state.activeChannelId) ?? state.channels[0];
}

export function getChannelLastMessage(state, channelId) {
  const messages = state.messages[channelId] ?? [];
  return messages.at(-1) ?? null;
}

export function setActiveChannel(state, channelId) {
  const nextChannel = state.channels.find((channel) => channel.id === channelId);

  if (!nextChannel) {
    return state;
  }

  state.activeChannelId = nextChannel.id;
  nextChannel.unreadCount = 0;
  return state;
}

export function buildChannelListModel(state) {
  const activeChannel = getActiveChannel(state);

  return state.channels.map((channel) => {
    const lastMessage = getChannelLastMessage(state, channel.id);
    const unreadCount = channel.unreadCount ?? 0;

    return {
      id: channel.id,
      label: `# ${channel.name}`,
      topic: channel.topic,
      unreadCount,
      hasUnread: unreadCount > 0,
      lastMessageTime: lastMessage?.time ?? '',
      isActive: channel.id === activeChannel.id,
      ariaLabel: `${channel.name} channel${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`
    };
  });
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
        <button class="channel${channel.isActive ? ' is-active' : ''}${channel.hasUnread ? ' has-unread' : ''}" data-channel-id="${escapeHtml(channel.id)}" aria-current="${channel.isActive ? 'page' : 'false'}" aria-label="${escapeHtml(channel.ariaLabel)}">
          <span class="channel-copy">
            <span class="channel-row">
              <span class="channel-name">${escapeHtml(channel.label)}</span>
              ${channel.lastMessageTime ? `<time class="channel-time">${escapeHtml(channel.lastMessageTime)}</time>` : ''}
            </span>
            <span class="channel-topic">${escapeHtml(channel.topic)}</span>
          </span>
          ${channel.unreadCount > 0 ? `<strong class="unread" aria-label="${channel.unreadCount} unread messages">${channel.unreadCount}</strong>` : ''}
        </button>
      </li>`)
    .join('');

  const messageItems = messageModel.messages
    .map((message) => `
      <article class="message" data-message-id="${escapeHtml(message.id)}">
        <div class="avatar" aria-hidden="true">${escapeHtml(message.author.slice(0, 1))}</div>
        <div>
          <header><strong>${escapeHtml(message.author)}</strong><time datetime="${escapeHtml(message.time)}">${escapeHtml(message.time)}</time></header>
          <p>${escapeHtml(message.text)}</p>
        </div>
      </article>`)
    .join('');

  return `
    <section class="shell">
      <aside class="sidebar">
        <div class="workspace">
          <span class="workspace-name">${escapeHtml(state.name)}</span>
          <span class="workspace-status">Online • ${escapeHtml(state.currentUser)}</span>
        </div>
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

  const render = () => {
    root.innerHTML = renderApp(state);
  };

  root.addEventListener('click', (event) => {
    const channelButton = event.target.closest?.('[data-channel-id]');

    if (!channelButton || !root.contains(channelButton)) {
      return;
    }

    setActiveChannel(state, channelButton.dataset.channelId);
    render();
  });

  render();
}

if (typeof document !== 'undefined') {
  mountApp();
}
