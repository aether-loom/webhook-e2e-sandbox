(function (root) {
  const initialChannels = [
    {
      id: 'general',
      name: 'general',
      topic: 'Company-wide announcements and work-based matters',
      members: 128,
      unread: 0,
      mentions: 0,
      active: true,
      muted: false,
      messages: [
        ['Maya Chen', 'Q3 planning starts in this channel at 10:00.'],
        ['Noah Singh', 'Please add launch risks to the shared canvas before standup.']
      ]
    },
    {
      id: 'product',
      name: 'product',
      topic: 'Roadmap, releases, and customer feedback',
      members: 42,
      unread: 7,
      mentions: 2,
      active: false,
      muted: false,
      messages: [
        ['Priya Shah', 'Two customer interviews are ready for triage.'],
        ['Alex Kim', 'Can someone review the release note draft?']
      ]
    },
    {
      id: 'design',
      name: 'design',
      topic: 'Design critique and system updates',
      members: 18,
      unread: 3,
      mentions: 0,
      active: false,
      muted: false,
      messages: [
        ['Elena Park', 'New button states are in the component library.']
      ]
    },
    {
      id: 'engineering',
      name: 'engineering',
      topic: 'Build health, incidents, and implementation notes',
      members: 64,
      unread: 12,
      mentions: 0,
      active: false,
      muted: false,
      messages: [
        ['Sam Rivera', 'Deploy freeze lifts after the canary burn-in.'],
        ['Jordan Lee', 'API latency is back inside the SLO.']
      ]
    },
    {
      id: 'random',
      name: 'random',
      topic: 'Watercooler chat',
      members: 96,
      unread: 9,
      mentions: 0,
      active: false,
      muted: true,
      messages: [
        ['Taylor Morgan', 'Board game lunch in the cafe today.']
      ]
    }
  ];

  function cloneChannels(channels) {
    return channels.map((channel) => ({
      ...channel,
      messages: channel.messages.map((message) => [...message])
    }));
  }

  function selectChannel(channels, channelId) {
    return channels.map((channel) => {
      const active = channel.id === channelId;
      return {
        ...channel,
        active,
        unread: active ? 0 : channel.unread,
        mentions: active ? 0 : channel.mentions
      };
    });
  }

  function getActiveChannel(channels) {
    return channels.find((channel) => channel.active) || channels[0];
  }

  function formatUnreadLabel(channel) {
    if (channel.mentions > 0) {
      return `${channel.mentions} unread ${channel.mentions === 1 ? 'mention' : 'mentions'}`;
    }

    if (channel.unread > 0) {
      return `${channel.unread} unread ${channel.unread === 1 ? 'message' : 'messages'}`;
    }

    return 'No unread messages';
  }

  root.SidebarState = {
    initialChannels,
    cloneChannels,
    selectChannel,
    getActiveChannel,
    formatUnreadLabel
  };

  if (typeof module !== 'undefined') {
    module.exports = root.SidebarState;
  }
})(typeof window !== 'undefined' ? window : globalThis);
