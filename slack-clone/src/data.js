export const workspace = {
  name: 'Acme Product',
  currentUser: 'Maya',
  activeChannelId: 'general',
  channels: [
    {
      id: 'general',
      name: 'general',
      topic: 'Company-wide announcements and team updates',
      unreadCount: 0
    },
    {
      id: 'design',
      name: 'design',
      topic: 'Critiques, prototypes, and UX notes',
      unreadCount: 3
    },
    {
      id: 'engineering',
      name: 'engineering',
      topic: 'Build status and implementation chat',
      unreadCount: 1
    }
  ],
  messages: {
    general: [
      {
        id: 'm-100',
        author: 'Ari',
        time: '9:12 AM',
        text: 'Good morning! Sprint planning starts in 15 minutes.'
      },
      {
        id: 'm-101',
        author: 'Maya',
        time: '9:18 AM',
        text: 'I shared the launch checklist in the canvas.'
      },
      {
        id: 'm-102',
        author: 'Noah',
        time: '9:24 AM',
        text: 'Thanks — I will add QA notes before standup.'
      }
    ],
    design: [
      {
        id: 'm-200',
        author: 'Lina',
        time: '10:02 AM',
        text: 'The new onboarding wireframes are ready for review.'
      }
    ],
    engineering: [
      {
        id: 'm-300',
        author: 'Sam',
        time: '10:35 AM',
        text: 'CI is green on the notification branch.'
      }
    ]
  }
};
