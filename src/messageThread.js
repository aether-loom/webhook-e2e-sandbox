export const initialMessages = {
  general: [
    {
      id: 'm-general-1',
      author: 'Maya Chen',
      avatar: 'MC',
      role: 'Product Lead',
      timestamp: '2026-06-22T09:12:00.000Z',
      body: 'Morning! Please drop launch blockers in this thread before standup.',
      reactions: [{ emoji: '✅', count: 4, active: false }],
      replies: 3,
      pinned: true,
    },
    {
      id: 'm-general-2',
      author: 'Jordan Lee',
      avatar: 'JL',
      role: 'Engineering',
      timestamp: '2026-06-22T09:18:00.000Z',
      body: 'API smoke tests are green. I am watching the deploy window now.',
      reactions: [{ emoji: '🚀', count: 2, active: true }],
      replies: 1,
      pinned: false,
    },
  ],
  product: [
    {
      id: 'm-product-1',
      author: 'Priya Shah',
      avatar: 'PS',
      role: 'PM',
      timestamp: '2026-06-22T10:03:00.000Z',
      body: 'Updated the onboarding checklist with the new trial plan decision.',
      reactions: [{ emoji: '👀', count: 6, active: false }],
      replies: 5,
      pinned: false,
    },
  ],
  design: [
    {
      id: 'm-design-1',
      author: 'Avery Kim',
      avatar: 'AK',
      role: 'Design',
      timestamp: '2026-06-22T11:27:00.000Z',
      body: 'Shared the composer empty, focus, and sending states in Figma.',
      reactions: [{ emoji: '🎨', count: 3, active: false }],
      replies: 2,
      pinned: true,
    },
  ],
  engineering: [
    {
      id: 'm-engineering-1',
      author: 'Sam Rivera',
      avatar: 'SR',
      role: 'Backend',
      timestamp: '2026-06-22T12:46:00.000Z',
      body: 'Incident review notes are ready. Please add remediation owners by EOD.',
      reactions: [{ emoji: '🛠️', count: 7, active: false }],
      replies: 8,
      pinned: false,
    },
  ],
  random: [
    {
      id: 'm-random-1',
      author: 'Nico Hart',
      avatar: 'NH',
      role: 'People Ops',
      timestamp: '2026-06-22T13:05:00.000Z',
      body: 'Reminder: rooftop snacks at 3pm. Bring your best trivia team name.',
      reactions: [{ emoji: '🍿', count: 9, active: false }],
      replies: 4,
      pinned: false,
    },
  ],
};

function copyMessages(messagesByChannel) {
  return Object.fromEntries(
    Object.entries(messagesByChannel).map(([channelId, messages]) => [
      channelId,
      messages.map((message) => ({
        ...message,
        reactions: message.reactions.map((reaction) => ({ ...reaction })),
      })),
    ]),
  );
}

export function createThreadState(messagesByChannel = initialMessages) {
  return {
    messagesByChannel: copyMessages(messagesByChannel),
    draftsByChannel: {},
    sendingChannelIds: [],
  };
}

export function getMessagesForChannel(state, channelId) {
  return state.messagesByChannel[channelId] ?? [];
}

export function getDraftForChannel(state, channelId) {
  return state.draftsByChannel[channelId] ?? '';
}

export function getComposerState(state, channelId) {
  if (state.sendingChannelIds.includes(channelId)) return 'sending';
  return getDraftForChannel(state, channelId).trim() ? 'ready' : 'empty';
}

export function updateDraft(state, channelId, draft) {
  return {
    ...state,
    draftsByChannel: {
      ...state.draftsByChannel,
      [channelId]: draft,
    },
  };
}

export function addMessage(state, channelId, draft, now = new Date()) {
  const body = draft.trim();
  if (!body) return state;

  const message = {
    id: `m-${channelId}-${now.getTime()}`,
    author: 'You',
    avatar: 'YO',
    role: 'Member',
    timestamp: now.toISOString(),
    body,
    reactions: [],
    replies: 0,
    pinned: false,
    own: true,
  };

  return {
    messagesByChannel: {
      ...state.messagesByChannel,
      [channelId]: [...getMessagesForChannel(state, channelId), message],
    },
    draftsByChannel: {
      ...state.draftsByChannel,
      [channelId]: '',
    },
    sendingChannelIds: state.sendingChannelIds.filter((id) => id !== channelId),
  };
}

export function toggleReaction(state, channelId, messageId, emoji) {
  return {
    ...state,
    messagesByChannel: {
      ...state.messagesByChannel,
      [channelId]: getMessagesForChannel(state, channelId).map((message) => {
        if (message.id !== messageId) return message;
        const existing = message.reactions.find((reaction) => reaction.emoji === emoji);
        const reactions = existing
          ? message.reactions.map((reaction) =>
              reaction.emoji === emoji
                ? { ...reaction, active: !reaction.active, count: reaction.count + (reaction.active ? -1 : 1) }
                : reaction,
            )
          : [...message.reactions, { emoji, count: 1, active: true }];
        return { ...message, reactions };
      }),
    },
  };
}

export function formatTimestamp(value) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}
