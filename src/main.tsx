import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AtSign,
  Bell,
  Bold,
  Code2,
  Hash,
  Image,
  Italic,
  Link,
  List,
  Mic,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  Sparkles,
  Star,
  Strikethrough,
  UserPlus,
} from 'lucide-react';
import './styles.css';

type Message = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  reactions?: { emoji: string; count: number; active?: boolean }[];
  replies?: number;
  isNew?: boolean;
};

const messages: Message[] = [
  {
    id: 1,
    author: 'Maya Patel',
    avatar: 'MP',
    time: '9:32 AM',
    text: 'Morning! I tightened the onboarding copy and added the API-token warning state. Could use a second set of eyes before we ship the beta checklist.',
    reactions: [
      { emoji: '🙌', count: 4, active: true },
      { emoji: '👀', count: 2 },
    ],
    replies: 3,
  },
  {
    id: 2,
    author: 'Jon Bell',
    avatar: 'JB',
    time: '9:36 AM',
    text: 'Looks good. One small note: the empty composer state should say “Message #launch-review” instead of the generic placeholder.',
    reactions: [{ emoji: '✅', count: 1 }],
  },
  {
    id: 3,
    author: 'Ari Chen',
    avatar: 'AC',
    time: '9:41 AM',
    text: 'I pushed the thread preview affordance too. Hovering a message reveals quick actions and keeps the thread CTA visible for keyboard users.',
    reactions: [
      { emoji: '🚀', count: 3, active: true },
      { emoji: '💬', count: 5 },
    ],
    replies: 5,
    isNew: true,
  },
];

function App() {
  const [composer, setComposer] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);

  const allMessages = useMemo(() => [...messages, ...sentMessages], [sentMessages]);
  const canSend = composer.trim().length > 0;

  function sendMessage() {
    if (!canSend) return;
    setSentMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: 'You',
        avatar: 'YO',
        time: 'now',
        text: composer.trim(),
        reactions: [{ emoji: '✨', count: 1, active: true }],
        isNew: true,
      },
    ]);
    setComposer('');
  }

  return (
    <main className="slack-shell">
      <aside className="workspace-rail" aria-label="Workspaces">
        <div className="workspace active">L</div>
        <div className="workspace">D</div>
        <button className="rail-button" aria-label="Add workspace"><Plus size={18} /></button>
      </aside>

      <aside className="sidebar" aria-label="Slack navigation">
        <div className="workspace-header">
          <div>
            <p>Launch Co.</p>
            <span>14 members online</span>
          </div>
          <Bell size={18} />
        </div>
        <label className="search-box">
          <Search size={16} />
          <input placeholder="Search Launch Co." />
        </label>
        <nav>
          <p className="nav-title">Channels</p>
          {['product', 'design', 'launch-review', 'support-triage'].map((channel) => (
            <a key={channel} className={channel === 'launch-review' ? 'selected' : ''} href="#">
              <Hash size={16} /> {channel}
              {channel === 'launch-review' && <span className="pill">8</span>}
            </a>
          ))}
          <p className="nav-title">Direct messages</p>
          {['Maya Patel', 'Ari Chen', 'Jon Bell'].map((name) => (
            <a key={name} href="#"><span className="presence" /> {name}</a>
          ))}
        </nav>
      </aside>

      <section className="channel">
        <header className="channel-header">
          <div>
            <h1><Hash size={24} /> launch-review <Star size={18} /></h1>
            <p>Final polish on onboarding, beta invites, and release notes.</p>
          </div>
          <div className="header-actions">
            <button><UserPlus size={17} /> Invite</button>
            <button><MoreHorizontal size={18} /></button>
          </div>
        </header>

        <div className="thread" aria-label="Message thread">
          <div className="date-divider"><span>Today</span></div>
          {allMessages.map((message) => <MessageCard key={message.id} message={message} />)}
        </div>

        <section className={`composer ${isFocused ? 'focused' : ''} ${canSend ? 'ready' : 'empty'}`} aria-label="Message composer">
          <div className="composer-toolbar" aria-label="Formatting tools">
            <button aria-label="Bold"><Bold size={16} /></button>
            <button aria-label="Italic"><Italic size={16} /></button>
            <button aria-label="Strikethrough"><Strikethrough size={16} /></button>
            <button aria-label="Code"><Code2 size={16} /></button>
            <button aria-label="List"><List size={16} /></button>
            <span />
            <button aria-label="Attach file"><Paperclip size={16} /></button>
            <button aria-label="Insert link"><Link size={16} /></button>
          </div>
          <textarea
            value={composer}
            onChange={(event) => setComposer(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') sendMessage();
            }}
            placeholder="Message #launch-review"
            rows={3}
          />
          <div className="composer-footer">
            <div className="composer-left">
              <button><Smile size={17} /> Emoji</button>
              <button><AtSign size={17} /> Mention</button>
              <button><Image size={17} /> Clip</button>
              <button><Mic size={17} /> Huddle</button>
            </div>
            <div className="composer-state">
              <Sparkles size={15} />
              {canSend ? 'Draft ready · ⌘ Enter to send' : isFocused ? 'Typing in #launch-review' : 'No draft'}
              <button className="send" onClick={sendMessage} disabled={!canSend} aria-label="Send message">
                <Send size={17} />
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function MessageCard({ message }: { message: Message }) {
  return (
    <article className={`message ${message.isNew ? 'new' : ''}`}>
      <div className="avatar">{message.avatar}</div>
      <div className="message-body">
        <div className="message-meta">
          <strong>{message.author}</strong>
          <time>{message.time}</time>
          {message.isNew && <span className="new-badge">new</span>}
        </div>
        <p>{message.text}</p>
        <div className="message-affordances" aria-label="Message actions">
          <button>Reply</button>
          <button>React</button>
          <button>Share</button>
          <button><MoreHorizontal size={15} /></button>
        </div>
        <div className="reaction-row">
          {message.reactions?.map((reaction) => (
            <button key={reaction.emoji} className={reaction.active ? 'active-reaction' : ''}>
              {reaction.emoji} <span>{reaction.count}</span>
            </button>
          ))}
          <button className="add-reaction"><Smile size={14} /></button>
          {message.replies && <a className="reply-count" href="#">{message.replies} replies · View thread</a>}
        </div>
      </div>
    </article>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
