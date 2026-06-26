export const initialChannels = [
  {
    id: 'general',
    name: 'general',
    description: 'Company-wide announcements and updates.',
    unread: 0,
    muted: false,
    section: 'Channels',
  },
  {
    id: 'product',
    name: 'product',
    description: 'Roadmap decisions, launches, and customer feedback.',
    unread: 8,
    muted: false,
    section: 'Channels',
  },
  {
    id: 'design',
    name: 'design',
    description: 'Design reviews, critique, and UI polish.',
    unread: 2,
    muted: false,
    section: 'Channels',
  },
  {
    id: 'engineering',
    name: 'engineering',
    description: 'Builds, incidents, code reviews, and release coordination.',
    unread: 13,
    muted: false,
    section: 'Channels',
  },
  {
    id: 'support-triage',
    name: 'support-triage',
    description: 'Incoming customer issues that need an owner.',
    unread: 104,
    muted: false,
    section: 'Priority',
  },
  {
    id: 'random',
    name: 'random',
    description: 'Non-work chat and team celebrations.',
    unread: 4,
    muted: true,
    section: 'Channels',
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

export function getUnreadTotal(state, { includeMuted = false } = {}) {
  return state.channels.reduce((total, channel) => {
    if (!includeMuted && channel.muted) return total;
    return total + channel.unread;
  }, 0);
}

export function getUnreadChannelCount(state, { includeMuted = false } = {}) {
  return state.channels.filter((channel) => channel.unread > 0 && (includeMuted || !channel.muted)).length;
}

export function formatUnreadCount(count) {
  if (count <= 0) return '';
  return count > 99 ? '99+' : String(count);
}
