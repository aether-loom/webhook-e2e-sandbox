const channels = [
  {
    id: 'team-announcements',
    type: 'channel',
    name: 'team-announcements',
    topic: 'Company news, launch notes, and executive updates.',
    members: '1,284 members',
    unread: 0,
    muted: false,
    messages: [
      ['Lena', '9:14 AM', 'Q3 launch brief is published. Please review the rollout checklist before Friday.'],
      ['Marco', '9:22 AM', 'Customer enablement decks are linked in the canvas.'],
      ['Priya', '9:30 AM', 'Reminder: all-hands starts in 30 minutes.'],
    ],
  },
  {
    id: 'design-review',
    type: 'channel',
    name: 'design-review',
    topic: 'Critiques, design QA, and prototype feedback.',
    members: '248 members',
    unread: 12,
    muted: false,
    messages: [
      ['Ari', '10:04 AM', 'Dropped updated sidebar states in Figma with hover and active specs.'],
      ['Noah', '10:08 AM', 'Can we make unread badges more prominent for mentions?'],
      ['Mina', '10:11 AM', 'Yes — mention badges now use the yellow treatment from the design system.'],
    ],
  },
  {
    id: 'proj-atlas',
    type: 'channel',
    name: 'proj-atlas',
    topic: 'Planning and execution for the Atlas migration.',
    members: '86 members',
    unread: 4,
    muted: false,
    messages: [
      ['Sam', '11:01 AM', 'Migration dry run passed for the east cluster.'],
      ['Iris', '11:07 AM', 'I added risk notes to the release plan.'],
    ],
  },
  {
    id: 'random',
    type: 'channel',
    name: 'random',
    topic: 'Social chatter and delightful distractions.',
    members: '1,011 members',
    unread: 0,
    muted: true,
    messages: [
      ['Jess', 'Yesterday', 'Friday playlist thread is open. Add your favorites!'],
    ],
  },
];

const directMessages = [
  {
    id: 'maya-chen',
    type: 'dm',
    name: 'Maya Chen',
    topic: 'Product lead • local time 10:42 AM',
    members: 'Direct message',
    unread: 2,
    online: true,
    messages: [
      ['Maya', '10:35 AM', 'Can you sanity-check the unread count behavior before standup?'],
      ['You', '10:38 AM', 'On it — active conversations will clear their badge when opened.'],
    ],
  },
  {
    id: 'daniel-kim',
    type: 'dm',
    name: 'Daniel Kim',
    topic: 'Engineering manager • away',
    members: 'Direct message',
    unread: 0,
    online: false,
    messages: [
      ['Daniel', 'Yesterday', 'The sidebar interaction branch is ready for review.'],
    ],
  },
];

const allConversations = [...channels, ...directMessages];
let activeConversationId = channels[0].id;

const channelList = document.querySelector('#channel-list');
const dmList = document.querySelector('#dm-list');
const activeTitle = document.querySelector('#active-title');
const activeTopic = document.querySelector('#active-topic');
const activeMeta = document.querySelector('#active-meta');
const channelKind = document.querySelector('#channel-kind');
const messageList = document.querySelector('#message-list');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');

function getIcon(conversation) {
  if (conversation.type === 'dm') {
    return `<span class="presence ${conversation.online ? 'online' : ''}" aria-label="${conversation.online ? 'Online' : 'Offline'}">●</span>`;
  }
  return conversation.muted ? '○' : '#';
}

function renderConversationButton(conversation) {
  const button = document.createElement('button');
  const isActive = conversation.id === activeConversationId;
  button.className = [
    'sidebar-row',
    conversation.unread > 0 ? 'has-unreads' : '',
    conversation.muted ? 'muted' : '',
  ].filter(Boolean).join(' ');
  button.type = 'button';
  button.dataset.conversationId = conversation.id;
  button.setAttribute('aria-label', `${conversation.name}${conversation.unread ? `, ${conversation.unread} unread` : ''}`);
  if (isActive) button.setAttribute('aria-current', 'page');

  const label = conversation.type === 'channel' ? conversation.name : conversation.name;
  button.innerHTML = `
    <span class="row-icon">${getIcon(conversation)}</span>
    <span class="row-label">${label}</span>
    ${conversation.unread > 0 ? `<span class="badge">${conversation.unread}</span>` : ''}
  `;

  button.addEventListener('click', () => setActiveConversation(conversation.id));
  return button;
}

function renderSidebar() {
  channelList.replaceChildren(...channels.map(renderConversationButton));
  dmList.replaceChildren(...directMessages.map(renderConversationButton));
}

function renderMessages(conversation) {
  messageList.replaceChildren(...conversation.messages.map(([author, time, body]) => {
    const article = document.createElement('article');
    article.className = 'message';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = author[0];

    const content = document.createElement('div');
    const meta = document.createElement('div');
    const name = document.createElement('strong');
    const timestamp = document.createElement('time');
    const paragraph = document.createElement('p');

    name.textContent = author;
    timestamp.textContent = time;
    paragraph.textContent = body;

    meta.append(name, timestamp);
    content.append(meta, paragraph);
    article.append(avatar, content);
    return article;
  }));
}

function setActiveConversation(id) {
  activeConversationId = id;
  const conversation = allConversations.find((item) => item.id === id);
  if (!conversation) return;

  // Opening a channel marks it read, matching Slack's active-channel behavior.
  conversation.unread = 0;

  channelKind.textContent = conversation.type === 'dm' ? 'Direct message' : 'Channel';
  activeTitle.textContent = conversation.type === 'dm' ? conversation.name : `# ${conversation.name}`;
  activeTopic.textContent = conversation.topic;
  activeMeta.textContent = conversation.members;
  messageInput.placeholder = `Message ${conversation.type === 'dm' ? conversation.name : `#${conversation.name}`}`;

  renderSidebar();
  renderMessages(conversation);
}

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const body = messageInput.value.trim();
  if (!body) return;

  const conversation = allConversations.find((item) => item.id === activeConversationId);
  conversation.messages.push(['You', 'Now', body]);
  messageInput.value = '';
  renderMessages(conversation);
  messageList.scrollTop = messageList.scrollHeight;
});

renderSidebar();
setActiveConversation(activeConversationId);
