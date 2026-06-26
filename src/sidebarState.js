export const initialChannels = [
  {
    id: 'general',
    name: 'general',
    description: 'Company-wide announcements and updates',
    unread: 0,
    muted: false,
  },
  {
    id: 'product',
    name: 'product',
    description: 'Roadmap, launches, and product feedback',
    unread: 8,
    muted: false,
  },
  {
    id: 'design',
    name: 'design',
    description: 'Design reviews and UI polish',
    unread: 2,
    muted: false,
  },
  {
    id: 'engineering',
    name: 'engineering',
    description: 'Builds, incidents, and code reviews',
    unread: 13,
    muted: false,
  },
  {
    id: 'random',
    name: 'random',
    description: 'Non-work chat and team celebrations',
    unread: 4,
    muted: true,
  },
];

export function createSidebarState(channels = initialChannels, activeChannelId = 'general') {
  const copiedChannels = channels.map((channel) => ({ ...channel }));
  const activeExists = copiedChannels.some((channel) => channel.id === activeChannelId);

  return {
    channels: copiedChannels,
    activeChannelId: activeExists ? activeChannelId : copiedChannels[0]?.id,
  };
}

export function getActiveChannel(state) {
  return state.channels.find((channel) => channel.id === state.activeChannelId) ?? state.channels[0];
}

export function selectChannel(state, channelId) {
  const channelExists = state.channels.some((channel) => channel.id === channelId);

  if (!channelExists) {
    return state;
  }

  return {
    activeChannelId: channelId,
    channels: state.channels.map((channel) =>
      channel.id === channelId ? { ...channel, unread: 0 } : { ...channel },
    ),
  };
}

export function getUnreadTotal(state) {
  return state.channels.reduce((total, channel) => total + (channel.muted ? 0 : channel.unread), 0);
}

export function formatUnreadCount(count) {
  if (count <= 0) return '';
  return count > 99 ? '99+' : String(count);
}
