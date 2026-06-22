import {
  createSidebarState,
  formatUnreadCount,
  getActiveChannel,
  getUnreadChannelCount,
  getUnreadTotal,
  selectChannel,
} from './sidebarState.js';

let state = createSidebarState();
const app = document.querySelector('#app');

function renderChannelButton(channel) {
  const isActive = channel.id === state.activeChannelId;
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
      ${channel.muted ? '<span class="channel-row__muted" title="Muted" aria-label="Muted">⌁</span>' : ''}
      ${unreadLabel ? `<span class="unread-badge" aria-label="${channel.unread} unread">${unreadLabel}</span>` : ''}
    </button>
  `;
}

function renderChannelSection(title, channels) {
  return `
    <section class="channel-section" aria-labelledby="${title.toLowerCase().replaceAll(' ', '-')}-heading">
      <div class="channel-list__header" id="${title.toLowerCase().replaceAll(' ', '-')}-heading">
        <span>${title}</span>
        <span class="channel-list__count">${channels.length}</span>
      </div>
      ${channels.map(renderChannelButton).join('')}
    </section>
  `;
}

function render() {
  const activeChannel = getActiveChannel(state);
  const unreadTotal = getUnreadTotal(state);
  const unreadChannelCount = getUnreadChannelCount(state);
  const priorityChannels = state.channels.filter((channel) => channel.section === 'Priority');
  const regularChannels = state.channels.filter((channel) => channel.section !== 'Priority');

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

        <div class="sidebar-summary" aria-live="polite">
          <strong>${unreadChannelCount}</strong> channels with unread messages
        </div>

        <nav class="channel-list" aria-label="Channels">
          ${priorityChannels.length ? renderChannelSection('Priority', priorityChannels) : ''}
          ${renderChannelSection('Channels', regularChannels)}
        </nav>
      </aside>

      <section class="conversation" aria-labelledby="channel-title">
        <header class="conversation__header">
          <div>
            <p class="eyebrow">Active channel</p>
            <h2 id="channel-title">#${activeChannel.name}</h2>
          </div>
          <span class="channel-status">${activeChannel.muted ? 'Muted' : 'Live'}</span>
        </header>
        <div class="conversation__body">
          <p>${activeChannel.description}</p>
          <p class="hint">Selecting a channel makes it active and clears that channel's unread count.</p>
        </div>
      </section>
    </main>
  `;

  app.querySelectorAll('[data-channel-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state = selectChannel(state, button.dataset.channelId);
      render();
    });
  });
}

render();
