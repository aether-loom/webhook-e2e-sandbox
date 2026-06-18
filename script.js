const mainComposer = document.querySelector('.conversation .composer');
const mainInput = mainComposer?.querySelector('.composer-input');
const sendButton = document.querySelector('#send-message');
const statusLine = mainComposer?.querySelector('.composer-status');
const threadPanel = document.querySelector('.thread-panel');
const threadClose = document.querySelector('.thread-header button');
const threadLinks = document.querySelectorAll('[data-open-thread]');

function setComposerState(state, message) {
  if (!mainComposer || !statusLine || !sendButton) return;
  mainComposer.dataset.state = state;
  statusLine.textContent = message;
  sendButton.textContent = state === 'sending' ? 'Sending…' : 'Send ▾';
  sendButton.disabled = state === 'sending';
}

sendButton?.addEventListener('click', () => {
  const value = mainInput?.textContent?.trim();
  if (!value) {
    setComposerState('empty', 'Add a message before sending.');
    mainInput?.classList.add('empty');
    return;
  }
  setComposerState('sending', 'Sending your message to #product-launch…');
  window.setTimeout(() => {
    setComposerState('sent', 'Message sent. Draft cleared.');
    if (mainInput) mainInput.textContent = '';
    mainInput?.classList.add('empty');
  }, 900);
});

mainInput?.addEventListener('input', () => {
  const hasText = Boolean(mainInput.textContent?.trim());
  mainInput.classList.toggle('empty', !hasText);
  setComposerState(hasText ? 'draft' : 'empty', hasText ? 'Draft saved locally.' : 'Press Enter to send, Shift+Enter for a new line.');
});

mainInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendButton?.click();
  }
});

threadLinks.forEach((link) => {
  link.addEventListener('click', () => {
    threadPanel?.classList.add('open');
    document.querySelector('[data-message-id="m2"]')?.classList.add('selected');
  });
});

threadClose?.addEventListener('click', () => {
  threadPanel?.classList.remove('open');
  document.querySelector('[data-message-id="m2"]')?.classList.remove('selected');
});
