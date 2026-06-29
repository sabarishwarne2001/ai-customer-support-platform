/* ═══════════════════════════════════════════════════════════
   script.js — Helply Chat Widget
   ─────────────────────────────────────────────────────────
   ARCHITECTURE:
   ┌─────────────────────────────────────────────────────────┐
   │  1. CONFIG          — easy-to-edit settings             │
   │  2. BOT API LAYER   — swap mock → real FastAPI here     │
   │  3. UI HELPERS      — DOM building, scrolling, timing   │
   │  4. CHAT STATE      — message history & session         │
   │  5. CHAT CONTROLLER — orchestrates send/receive flow    │
   │  6. WIDGET INIT     — toggle, input, suggestion wiring  │
   └─────────────────────────────────────────────────────────┘
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   1. CONFIG
═══════════════════════════════════════════ */
const CONFIG = {
  botName:        'Helply',
  botInitial:     '◈',
  userInitial:    'You',

  /** 
   * Toggle between mock and real API.
   * Set to true once your FastAPI backend is ready.
   */
  useRealApi:     true,

  /** Your FastAPI endpoint (used when useRealApi === true) */
  apiEndpoint:    'https://sabarish22122-ai-customer-support-platform.hf.space/chat',

  /** Simulated bot "thinking" time in ms (mock only) */
  mockMinDelay:   700,
  mockMaxDelay:   1800,

  /** How many messages before hiding quick-reply chips */
  hideSuggestionsAfter: 2,
};


/* ═══════════════════════════════════════════
   2. BOT API LAYER
   ─────────────────────────────────────────
   To connect your FastAPI backend:
     1. Set CONFIG.useRealApi = true
     2. Set CONFIG.apiEndpoint to your URL
     3. Adjust the request body / response parsing
        inside `callRealApi` to match your schema.
═══════════════════════════════════════════ */

/**
 * Primary entry point called by the chat controller.
 * Returns a promise that resolves with the bot's reply string.
 *
 * @param {string} userMessage  - the raw user input
 * @param {Array}  history      - [{role, content}] conversation history
 * @returns {Promise<string>}
 */
async function getBotReply(userMessage, history) {
  if (CONFIG.useRealApi) {
    return callRealApi(userMessage, history);
  }
  return callMockApi(userMessage, history);
}

/* ── Real API (FastAPI) ──────────────────── */

/**
 * Calls your FastAPI backend.
 * Adjust the request body and response parsing to match your API schema.
 */
async function callRealApi(userMessage, history) {
  const response = await fetch(CONFIG.apiEndpoint, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      history: history,       // pass full history for multi-turn context
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // ── Adjust this line to match your API's response shape ──
  // e.g. data.reply | data.answer | data.message | data.content
  return data.response;
}

/* ── Mock API ────────────────────────────── */

const MOCK_RESPONSES = {
  greeting: [
    "Hey there! 👋 Great to meet you. What can I help you with today?",
    "Hi! I'm happy to help. What's on your mind?",
  ],
  pricing: [
    "We have three plans:\n\n**Starter** — Free, up to 500 messages/mo\n**Pro** — $29/mo, unlimited messages + analytics\n**Enterprise** — Custom pricing, dedicated support\n\nWant a link to the full pricing page?",
  ],
  started: [
    "Getting started is easy! Just add this one line to your site:\n\n`<script src=\"https://cdn.helply.io/widget.js\"></script>`\n\nWe auto-detect your brand colours. Full docs at docs.helply.io 🚀",
  ],
  account: [
    "Sure! I can help with account questions. Are you trying to reset your password, update billing, or something else?",
  ],
  default: [
    "Good question! That's something our team can dive deeper on. I've flagged this for a human agent — expect a reply within a few minutes. 🙌",
    "I want to make sure I give you the right answer. Could you share a bit more detail about your issue?",
    "Thanks for reaching out! I'll look into that for you right now.",
    "Noted! I'm pulling up the relevant docs for you. Give me just a second…",
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Simulates a network round-trip with varied delay.
 * Replace CONFIG.mockMinDelay / mockMaxDelay in CONFIG to tune feel.
 */
function callMockApi(userMessage, _history) {
  const delay =
    CONFIG.mockMinDelay +
    Math.random() * (CONFIG.mockMaxDelay - CONFIG.mockMinDelay);

  const lower = userMessage.toLowerCase();

  let reply;
  if (/\b(hi|hello|hey|howdy|sup)\b/.test(lower))   reply = pickRandom(MOCK_RESPONSES.greeting);
  else if (/pric|plan|cost|how much/.test(lower))    reply = pickRandom(MOCK_RESPONSES.pricing);
  else if (/start|setup|install|begin|how do/.test(lower)) reply = pickRandom(MOCK_RESPONSES.started);
  else if (/account|password|billing|login/.test(lower))   reply = pickRandom(MOCK_RESPONSES.account);
  else                                                      reply = pickRandom(MOCK_RESPONSES.default);

  return new Promise((resolve) => setTimeout(() => resolve(reply), delay));
}


/* ═══════════════════════════════════════════
   3. UI HELPERS
═══════════════════════════════════════════ */

const $ = (sel) => document.querySelector(sel);
const msgList = () => $('#chatMessages');

/** Format a Date as "h:mm AM/PM" */
function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Build and insert a message bubble row */
function appendMessage({ role, text, time }) {
  const isUser = role === 'user';
  const list   = msgList();

  // Detect stacking (same role as previous visible message)
  const prev = list.querySelector('.msg-row:last-child');
  const stacked = prev && prev.classList.contains(role);

  const row = document.createElement('div');
  row.className = `msg-row ${role}${stacked ? ' stacked' : ''}`;
  row.innerHTML = `
    <div class="msg-avatar">${isUser ? CONFIG.userInitial[0] : CONFIG.botInitial}</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
      <div class="msg-time">${formatTime(time)}</div>
    </div>
  `;

  list.appendChild(row);
  scrollToBottom();
  return row;
}

/** Show animated typing indicator */
function showTyping() {
  removeTyping();
  const list = msgList();
  const row  = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typingIndicator';
  row.innerHTML = `
    <div class="msg-avatar">${CONFIG.botInitial}</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  list.appendChild(row);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

/** Smooth scroll chat to bottom */
function scrollToBottom() {
  const list = msgList();
  list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
}

/** Insert a centered timestamp divider */
function appendTimeDivider(label = 'Today') {
  const el = document.createElement('div');
  el.className = 'time-divider';
  el.textContent = label;
  msgList().appendChild(el);
}

/** Naive HTML escape to prevent XSS */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Inject welcome card on first open */
function insertWelcomeCard() {
  if (document.getElementById('welcomeCard')) return;
  const card = document.createElement('div');
  card.className = 'welcome-card';
  card.id = 'welcomeCard';
  card.innerHTML = `
    <div class="welcome-card-logo">◈</div>
    <h4>Hi there 👋</h4>
    <p>Welcome to ${CONFIG.botName} Support. Ask anything — we usually reply in under a minute.</p>
  `;
  msgList().prepend(card);
}

/** Auto-resize textarea to fit content (up to CSS max-height) */
function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}


/* ═══════════════════════════════════════════
   4. CHAT STATE
═══════════════════════════════════════════ */
const ChatState = {
  history:    [],          // [{role: 'user'|'assistant', content: string}]
  msgCount:   0,           // total messages sent/received
  isLoading:  false,       // true while waiting for bot reply
  isOpen:     false,
  hasOpened:  false,       // first-open flag

  addMessage(role, content) {
    // 'assistant' matches OpenAI/FastAPI conventions; 'bot' is UI-side
    const apiRole = role === 'bot' ? 'assistant' : role;
    this.history.push({ role: apiRole, content });
    this.msgCount++;
  },
};


/* ═══════════════════════════════════════════
   5. CHAT CONTROLLER
═══════════════════════════════════════════ */

async function handleSend(text) {
  text = text.trim();
  if (!text || ChatState.isLoading) return;

  // Hide suggestions after first real message
  if (ChatState.msgCount >= CONFIG.hideSuggestionsAfter) {
    hideSuggestions();
  }

  // Render user bubble
  ChatState.addMessage('user', text);
  appendMessage({ role: 'user', text });

  // Lock input
  setInputLocked(true);
  showTyping();

  try {
    const reply = await getBotReply(text, ChatState.history);
    removeTyping();
    ChatState.addMessage('bot', reply);
    appendMessage({ role: 'bot', text: reply });
  } catch (err) {
    removeTyping();
    const errMsg = "Sorry, something went wrong. Please try again in a moment.";
    appendMessage({ role: 'bot', text: errMsg });
    console.error('[Helply] Bot API error:', err);
  } finally {
    setInputLocked(false);
    document.getElementById('chatInput').focus();
  }
}

function setInputLocked(locked) {
  ChatState.isLoading = locked;
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  input.disabled   = locked;
  sendBtn.disabled = locked || input.value.trim() === '';
}

function hideSuggestions() {
  const el = document.getElementById('chatSuggestions');
  if (el) {
    el.style.transition = 'opacity .2s, max-height .25s';
    el.style.opacity    = '0';
    el.style.maxHeight  = '0';
    el.style.overflow   = 'hidden';
    el.style.padding    = '0';
  }
}


/* ═══════════════════════════════════════════
   6. WIDGET INIT
═══════════════════════════════════════════ */
(function init() {
  const toggleBtn = document.getElementById('chatToggle');
  const chatWin   = document.getElementById('chatWindow');
  const unreadDot = document.getElementById('unreadDot');
  const input     = document.getElementById('chatInput');
  const sendBtn   = document.getElementById('sendBtn');
  const miniBtn   = document.getElementById('minimizeBtn');

  /* ── Open / close ── */
  function openChat() {
    ChatState.isOpen = true;
    chatWin.classList.add('is-open');
    chatWin.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.add('is-open');
    toggleBtn.setAttribute('aria-label', 'Close support chat');
    unreadDot.classList.remove('visible');

    if (!ChatState.hasOpened) {
      ChatState.hasOpened = true;
      insertWelcomeCard();
      appendTimeDivider('Today');
      // First bot greeting
      const greeting = "Hey! 👋 What can I help you with today?";
      ChatState.addMessage('bot', greeting);
      appendMessage({ role: 'bot', text: greeting });
    }

    // Focus input after animation
    setTimeout(() => input.focus(), 280);
  }

  function closeChat() {
    ChatState.isOpen = false;
    chatWin.classList.remove('is-open');
    chatWin.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-label', 'Open support chat');
  }

  toggleBtn.addEventListener('click', () => {
    ChatState.isOpen ? closeChat() : openChat();
  });

  miniBtn.addEventListener('click', closeChat);

  /* ── Close on Escape key ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ChatState.isOpen) closeChat();
  });

  /* ── Send button ── */
  sendBtn.addEventListener('click', () => {
    const val = input.value;
    input.value = '';
    autoResizeTextarea(input);
    sendBtn.disabled = true;
    handleSend(val);
  });

  /* ── Textarea: resize + enable send + Enter to send ── */
  input.addEventListener('input', () => {
    autoResizeTextarea(input);
    sendBtn.disabled = input.value.trim() === '' || ChatState.isLoading;
  });

  input.addEventListener('keydown', (e) => {
    // Shift+Enter inserts newline; plain Enter sends
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendBtn.click();
    }
  });

  /* ── Quick-reply chips ── */
  document.querySelectorAll('.suggestion-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const msg = chip.dataset.msg;
      hideSuggestions();
      handleSend(msg);
    });
  });

  /* ── Show unread dot after short delay (first visit feel) ── */
  setTimeout(() => {
    if (!ChatState.hasOpened) unreadDot.classList.add('visible');
  }, 2500);

})();
