const channelList = document.querySelector('#channel-list');
const activeChannelName = document.querySelector('#active-channel-name');
const activeChannelTopic = document.querySelector('#active-channel-topic');
const activeChannelMeta = document.querySelector('#active-channel-meta');
const messageList = document.querySelector('#message-list');

let channels = SidebarState.cloneChannels(SidebarState.initialChannels);

function createBadge(channel) {
  if (channel.mentions > 0) {
    return `<span class="badge mention" aria-label="${SidebarState.formatUnreadLabel(channel)}">${channel.mentions}</span>`;
  }

  if (channel.unread > 0) {
    return `<span class="badge" aria-label="${SidebarState.formatUnreadLabel(channel)}">${channel.unread}</span>`;
  }

  return '';
}

function renderChannels() {
  channelList.innerHTML = channels
    .map((channel) => {
      const stateClasses = [
        'channel-row',
        channel.active ? 'active' : '',
        channel.unread > 0 || channel.mentions > 0 ? 'unread' : '',
        channel.mentions > 0 ? 'has-mention' : '',
        channel.muted ? 'muted' : ''
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <button
          class="${stateClasses}"
          data-channel-id="${channel.id}"
          aria-current="${channel.active ? 'page' : 'false'}"
          aria-label="#${channel.name}, ${SidebarState.formatUnreadLabel(channel)}"
        >
          <span class="hash" aria-hidden="true">#</span>
          <span class="channel-name">${channel.name}</span>
          ${channel.muted ? '<span class="mute-dot" aria-label="Muted">z</span>' : ''}
          ${createBadge(channel)}
        </button>`;
    })
    .join('');
}

function renderConversation() {
  const active = SidebarState.getActiveChannel(channels);
  activeChannelName.textContent = `# ${active.name}`;
  activeChannelTopic.textContent = active.topic;
  activeChannelMeta.textContent = `${active.members} members`;
  messageList.innerHTML = active.messages
    .map(
      ([author, text]) => `
        <article class="message-card">
          <div class="avatar" aria-hidden="true">${author.charAt(0)}</div>
          <div>
            <h3>${author}</h3>
            <p>${text}</p>
          </div>
        </article>`
    )
    .join('');
}

function render() {
  renderChannels();
  renderConversation();
}

channelList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-channel-id]');
  if (!button) return;

  channels = SidebarState.selectChannel(channels, button.dataset.channelId);
  render();
});

render();
