const composer = document.querySelector('.composer');
const input = document.querySelector('#message-input');
const state = document.querySelector('#composer-state');
const sendButton = document.querySelector('.send-button');
const thread = document.querySelector('[data-testid="message-thread"]');

function getDraftState() {
  const hasDraft = input.value.trim().length > 0;
  if (hasDraft) return 'ready';
  if (document.activeElement === input) return 'focused';
  return 'empty';
}

function renderComposerState() {
  const draftState = getDraftState();
  composer.classList.toggle('ready', draftState === 'ready');
  composer.classList.toggle('focused', draftState === 'focused' || draftState === 'ready');
  composer.classList.toggle('empty', draftState === 'empty');
  sendButton.disabled = draftState !== 'ready';

  if (draftState === 'ready') {
    state.textContent = 'Draft ready · Ctrl/⌘ Enter to send';
  } else if (draftState === 'focused') {
    state.textContent = 'Typing in #launch-review';
  } else {
    state.textContent = 'No draft';
  }
}

function createMessage(text) {
  const article = document.createElement('article');
  article.className = 'message new sent';
  article.dataset.messageId = String(Date.now());
  article.innerHTML = `
    <div class="avatar green">YO</div>
    <div class="message-body">
      <header class="message-meta"><strong>You</strong><time>now</time><span class="new-badge">new</span></header>
      <p></p>
      <div class="message-actions" aria-label="Message actions">
        <button>Reply</button><button>React</button><button>Share</button><button aria-label="More actions">•••</button>
      </div>
      <div class="reaction-row">
        <button class="active-reaction">✨ <span>1</span></button>
        <button class="add-reaction" aria-label="Add reaction">＋</button>
        <a href="#" class="reply-count">Start a thread</a>
      </div>
    </div>`;
  article.querySelector('p').textContent = text;
  return article;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  const message = createMessage(text);
  thread.appendChild(message);
  input.value = '';
  renderComposerState();
  message.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

input.addEventListener('input', renderComposerState);
input.addEventListener('focus', renderComposerState);
input.addEventListener('blur', renderComposerState);
input.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

composer.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage();
});

thread.addEventListener('click', (event) => {
  const button = event.target.closest('.reaction-row button:not(.add-reaction)');
  if (!button) return;
  button.classList.toggle('active-reaction');
  const count = button.querySelector('span');
  if (count) {
    const current = Number(count.textContent || '0');
    count.textContent = String(button.classList.contains('active-reaction') ? current + 1 : Math.max(0, current - 1));
  }
});

renderComposerState();
