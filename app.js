// ==========================================
// 1. 데이터 창고
// ==========================================
const stockData = {
  "삼성전자": {
    why_title: "삼성전자 오늘 신났네 ㅎㅎ"
  },
  "SK하이닉스": {
    why_title: "엔비디아 실적 발표 대기 중!"
  }
};

// ==========================================
// 2. 화면 및 기능 코드
// ==========================================

const themeToggle = document.getElementById('themeToggle');
const themeKnob = document.getElementById('themeKnob');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeKnob) themeKnob.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
  applyTheme(localStorage.getItem('theme') || 'dark');
}

const Sidebar = (() => {
  const sidebar = document.getElementById('sidebar');
  const STORAGE = 'sidebar-expanded';
  if (sidebar && localStorage.getItem(STORAGE) === 'true' && window.innerWidth > 768) {
    sidebar.classList.add('expanded');
  }
  function toggle() {
    if (!sidebar) return;
    if (window.innerWidth <= 768) {
      document.body.classList.toggle('sidebar-mobile-open');
      return;
    }
    sidebar.classList.toggle('expanded');
    localStorage.setItem(STORAGE, sidebar.classList.contains('expanded'));
  }
  function openMobile() { document.body.classList.add('sidebar-mobile-open'); }
  function closeMobile() { document.body.classList.remove('sidebar-mobile-open'); }
  return { toggle, openMobile, closeMobile };
})();

function goHome() {
  newChat();
}

let currentMode = 'gaemi';
function togglePopup(e, where) {
  if (e) e.stopPropagation();
  if (where === 'main') {
    const popup = document.getElementById('gaemiPopup');
    const btn = document.getElementById('gaemiBtn');
    const ip = document.getElementById('inputPopup');
    const ib = document.getElementById('inputGaemiBtn');
    if (ip) ip.classList.remove('open');
    if (ib) ib.classList.remove('open');
    if (popup) popup.classList.toggle('open');
    if (btn) btn.classList.toggle('open');
  } else {
    const popup = document.getElementById('inputPopup');
    const btn = document.getElementById('inputGaemiBtn');
    const gp = document.getElementById('gaemiPopup');
    const gb = document.getElementById('gaemiBtn');
    if (gp) gp.classList.remove('open');
    if (gb) gb.classList.remove('open');
    if (popup) popup.classList.toggle('open');
    if (btn) btn.classList.toggle('open');
  }
}

function selectMode(mode, where) {
  currentMode = mode;
  const gt = document.getElementById('gaemiBtnText');
  const igt = document.getElementById('inputGaemiBtnText');
  if (gt) gt.textContent = mode;
  if (igt) igt.textContent = mode;
  ['gaemi', 'info', 'pro'].forEach(m => {
    const cm = document.getElementById('check-' + m + '-main');
    const ci = document.getElementById('check-' + m + '-input');
    if (cm) cm.style.visibility = (m === mode) ? 'visible' : 'hidden';
    if (ci) ci.style.visibility = (m === mode) ? 'visible' : 'hidden';
  });
  ['gaemiPopup', 'gaemiBtn', 'inputPopup', 'inputGaemiBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
}

document.addEventListener('click', (e) => {
  const mainPopup = document.getElementById('gaemiPopup');
  const mainBtn = document.getElementById('gaemiBtn');
  const inputPopup = document.getElementById('inputPopup');
  const inputBtn = document.getElementById('inputGaemiBtn');
  if (mainPopup && mainBtn && !mainPopup.contains(e.target) && !mainBtn.contains(e.target)) {
    mainPopup.classList.remove('open');
    mainBtn.classList.remove('open');
  }
  if (inputPopup && inputBtn && !inputPopup.contains(e.target) && !inputBtn.contains(e.target)) {
    inputPopup.classList.remove('open');
    inputBtn.classList.remove('open');
  }
});

const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatContent = document.getElementById('chatContent');
const welcome = document.getElementById('welcome');
const chatContainer = document.getElementById('chatContainer');
let isStreaming = false;

if (input) {
  input.addEventListener('input', () => {
    if (sendBtn) sendBtn.disabled = input.value.trim() === '' || isStreaming;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
}

function mainSearchGo() {
  const ms = document.getElementById('mainSearch');
  if (!ms) return;
  const v = ms.value.trim();
  if (!v) return;
  quickSearch(v);
}
const msEl = document.getElementById('mainSearch');
if (msEl) {
  msEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); mainSearchGo(); }
  });
}

function quickSearch(name) {
  if (!input) return;
  input.value = name;
  if (sendBtn) sendBtn.disabled = false;
  sendMessage();
}

function newChat() {
  if (!chatContent) return;
  chatContent.innerHTML = '';
  if (welcome) {
    chatContent.appendChild(welcome);
    welcome.style.display = 'flex';
  }
  document.body.classList.add('welcome-mode');
  if (input) {
    input.value = '';
    input.style.height = 'auto';
  }
  if (sendBtn) sendBtn.disabled = true;
  isStreaming = false;
  if (typeof Panel !== 'undefined') Panel.close();
  Sidebar.closeMobile();
}

function addMessage(role, content, isHTML = false) {
  if (!chatContent) return;
  const msg = document.createElement('div');
  if (role === 'user') {
    msg.className = 'message user-msg-row';
    const pill = document.createElement('div');
    pill.className = 'user-pill';
    pill.textContent = content;
    msg.appendChild(pill);
    chatContent.appendChild(msg);
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    return pill;
  } else {
    msg.className = 'message';
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar ai';
    avatar.textContent = 'G';
    const body = document.createElement('div');
    body.className = 'msg-body';
    if (isHTML) body.innerHTML = content;
    else body.textContent = content;
    msg.appendChild(avatar);
    msg.appendChild(body);
    chatContent.appendChild(msg);
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    return body;
  }
}

function sectionFooter(sectionId) {
  return `
    <div class="section-footer">
      <button class="icon-action" onclick="copySection('${sectionId}')" title="복사">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button class="icon-action" onclick="refreshSection('${sectionId}')" title="새로고침">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
      <button class="icon-action" onclick="toggleLike('${sectionId}', this, 'like')" title="좋아요">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
      </button>
      <button class="icon-action" onclick="toggleLike('${sectionId}', this, 'dislike')" title="싫어요">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
        </svg>
      </button>
      <button class="icon-action" onclick="shareSection('${sectionId}')" title="공유">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      </button>
    </div>
  `;
}

function copySection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => { showToast('복사됨'); });
}
function refreshSection(id) { showToast('새로고침'); }

function toggleLike(id, btn, type) {
  const footer = btn.closest('.section-footer');
  if (!footer) return;
  const actionButtons = footer.querySelectorAll('.icon-action');
  const likeBtn = actionButtons[2];
  const dislikeBtn = actionButtons[3];
  if (!likeBtn || !dislikeBtn) return;

  if (type === 'like') {
    const isLiked = likeBtn.classList.contains('liked');
    likeBtn.classList.toggle('liked');
    dislikeBtn.classList.remove('disliked');
    showToast(isLiked ? '좋아요 취소' : '좋아요');
  } else {
    const isDisliked = dislikeBtn.classList.contains('disliked');
    dislikeBtn.classList.toggle('disliked');
    likeBtn.classList.remove('liked');
    showToast(isDisliked ? '싫어요 취소' : '싫어요');
  }
}

function shareSection(id) { showToast('공유 준비 중'); }

function showToast(msg) {
  let toast = document.getElementById('gtp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'gtp-toast';
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--text);color:var(--bg);padding:10px 20px;border-radius:20px;font-size:13px;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.2s;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 1500);
}

function getDemoResponse(userText) {
  const t = userText.toLowerCase();

  let stockName = "";
  if (t.includes('삼성') || t.includes('삼전')) stockName = "삼성전자";
  else if (t.includes('하이닉스')) stockName = "SK하이닉스";

  const data = stockData[stockName];

  if (data) {
    // 내용은 초보자도 직접 수정하기 쉽도록 두 줄짜리 텍스트만 남긴다.
    return `
      <div class="section" id="section-why">
        <div class="section-header">
          <div class="section-title">왜 빨간불일까?</div>
        </div>
        <div class="simple-line">${data.why_title}</div>
        <div class="simple-line">오늘 주가 움직임과 주요 재료를 확인해볼게.</div>
        ${sectionFooter('section-why')}
      </div>

      <div class="section" id="section-big">
        <div class="section-header">
          <div class="section-title">큰손들은 뭐하고 있어?</div>
        </div>
        <div class="simple-line">외국인과 기관의 수급 흐름을 살펴볼게.</div>
        <div class="simple-line">오늘 누가 사고팔고 있는지 쉽게 정리해줄게.</div>
        ${sectionFooter('section-big')}
      </div>

      <div class="section" id="section-cal">
        <div class="section-header">
          <div class="section-title">다가오는 일정</div>
        </div>
        <div class="simple-line">앞으로 예정된 중요한 일정을 확인해볼게.</div>
        <div class="simple-line">주가에 영향을 줄 수 있는 일정만 골라볼게.</div>
        ${sectionFooter('section-cal')}
      </div>

      <div class="section" id="section-vol">
        <div class="section-header">
          <div class="section-title">거래대금 폭발</div>
        </div>
        <div class="simple-line">오늘 거래대금이 크게 움직인 종목을 볼게.</div>
        <div class="simple-line">평소보다 거래가 얼마나 늘었는지도 확인할게.</div>
        ${sectionFooter('section-vol')}
      </div>

      <div class="section" id="section-vote">
        <div class="section-header">
          <div class="section-title">내일 어디로 튈까?</div>
        </div>
        <div class="simple-line">내일 주가 흐름에 대한 의견을 모아볼게.</div>
        <div class="simple-line">상승과 하락 전망을 직접 선택해볼 수 있어.</div>
        ${sectionFooter('section-vote')}
      </div>
    `;
  }

  return `
    <div class="section" id="section-default">
      <div class="section-header">
        <div class="section-title">${escapeHTML(userText)}</div>
      </div>
      <div class="simple-line">아직 준비된 분석 데이터가 없어요.</div>
      <div class="simple-line">삼성전자 또는 SK하이닉스를 검색해보세요.</div>
      ${sectionFooter('section-default')}
    </div>
  `;
}



function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));
}

function activateWidgetTab(body, index) {
  const sections = Array.from(body.querySelectorAll('.widget-content > .section'));
  const tabs = Array.from(body.querySelectorAll('.widget-tab'));
  sections.forEach((section, i) => section.classList.toggle('widget-section-active', i === index));
  tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
}

function removeWidgetTab(body, index) {
  const sections = Array.from(body.querySelectorAll('.widget-content > .section'));
  const tabs = Array.from(body.querySelectorAll('.widget-tab'));
  if (sections.length <= 1) {
    showToast('마지막 위젯은 삭제할 수 없어요');
    return;
  }
  if (!sections[index]) return;
  sections[index].remove();
  tabs[index].remove();

  const remaining = Array.from(body.querySelectorAll('.widget-tab'));
  const nextIndex = Math.min(index, remaining.length - 1);
  activateWidgetTab(body, nextIndex);
  populateWidgetAddMenu(body);
}

function populateWidgetAddMenu(body) {
  const menu = body.querySelector('.widget-add-menu');
  if (!menu) return;
  menu.innerHTML = '';

  const titles = [
    '왜 빨간불일까?',
    '큰손들은 뭐하고 있어?',
    '다가오는 일정',
    '거래대금 폭발',
    '내일 어디로 튈까?'
  ];
  const existingKeys = new Set(
    Array.from(body.querySelectorAll('.widget-content > .section'))
      .map(section => section.dataset.widgetKey)
  );

  titles.forEach((title, i) => {
    const exists = existingKeys.has(String(i));
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'widget-add-item';
    item.innerHTML = `<span>${escapeHTML(title)}</span><span class="widget-add-state">${exists ? '추가됨' : '추가'}</span>`;
    item.disabled = exists;
    item.addEventListener('click', () => {
      if (exists) return;
      addWidgetSection(body, i, title);
      menu.hidden = true;
    });
    menu.appendChild(item);
  });
}

function addWidgetSection(body, index, title) {
  const stockText = body.dataset.query || '';
  const html = getDemoResponse(stockText);
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const source = temp.querySelectorAll('.section')[index];
  if (!source) return;

  const content = body.querySelector('.widget-content');
  const section = source.cloneNode(true);
  const header = section.querySelector('.section-header');
  if (header) header.remove();
  section.dataset.widgetKey = String(index);
  section.classList.remove('widget-section-active');
  content.appendChild(section);
  setupWidgetDrag(body);

  const tabs = body.querySelector('.widget-tabs');
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'widget-tab';
  tab.setAttribute('role', 'tab');
  tab.innerHTML = `<span class="widget-tab-label">${escapeHTML(title)}</span><span class="widget-tab-close" title="삭제">×</span>`;
  tab.addEventListener('click', (e) => {
    const currentIndex = Array.from(body.querySelectorAll('.widget-content > .section')).indexOf(section);
    if (e.target.classList.contains('widget-tab-close')) removeWidgetTab(body, currentIndex);
    else activateWidgetTab(body, currentIndex);
  });
  tabs.appendChild(tab);

  activateWidgetTab(body, Array.from(content.querySelectorAll('.section')).indexOf(section));
  populateWidgetAddMenu(body);
}

function toggleWidgetAddMenu(btn) {
  const body = btn.closest('.ai-widget-shell');
  if (!body) return;
  const menu = body.querySelector('.widget-add-menu');
  if (!menu) return;
  menu.hidden = !menu.hidden;
  if (!menu.hidden) {
    populateWidgetAddMenu(body);
    const close = (e) => {
      if (!body.contains(e.target)) {
        menu.hidden = true;
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
  }
}

function setupWidgetDrag(body) {
  const content = body.querySelector('.widget-content');
  if (!content) return;

  const bind = (section) => {
    if (section.dataset.dragReady === '1') return;
    section.dataset.dragReady = '1';
    section.classList.add('widget-draggable');

    let handle = section.querySelector('.widget-drag-handle');
    if (!handle) {
      handle = document.createElement('span');
      handle.className = 'widget-drag-handle';
      handle.setAttribute('role', 'button');
      handle.setAttribute('aria-label', '위젯 이동');
      handle.setAttribute('title', '드래그해서 위젯 순서 변경');
      handle.draggable = true;
      handle.textContent = '⋮⋮';
      section.prepend(handle);
    }

    handle.addEventListener('dragstart', (e) => {
      body.dataset.draggingWidget = '1';
      section.classList.add('widget-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', section.dataset.widgetKey || 'widget');
    });

    handle.addEventListener('dragend', () => {
      body.dataset.draggingWidget = '0';
      section.classList.remove('widget-dragging');
      content.querySelectorAll('.widget-drag-over').forEach(el => el.classList.remove('widget-drag-over'));
    });

    section.addEventListener('dragover', (e) => {
      if (body.dataset.draggingWidget !== '1') return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const dragging = content.querySelector('.widget-dragging');
      if (!dragging || dragging === section) return;
      content.querySelectorAll('.widget-drag-over').forEach(el => el.classList.remove('widget-drag-over'));
      section.classList.add('widget-drag-over');
    });

    section.addEventListener('dragleave', () => section.classList.remove('widget-drag-over'));

    section.addEventListener('drop', (e) => {
      if (body.dataset.draggingWidget !== '1') return;
      e.preventDefault();
      const dragging = content.querySelector('.widget-dragging');
      if (!dragging || dragging === section) return;
      const rect = section.getBoundingClientRect();
      const insertBefore = e.clientY < rect.top + rect.height / 2;
      if (insertBefore) content.insertBefore(dragging, section);
      else content.insertBefore(dragging, section.nextSibling);
      section.classList.remove('widget-drag-over');
      content.querySelectorAll('.widget-dragging').forEach(el => el.classList.remove('widget-dragging'));
      body.dataset.draggingWidget = '0';
    });
  };

  content.querySelectorAll(':scope > .section').forEach(bind);
}

async function sendMessage() {
  const text = input ? input.value.trim() : '';
  if (!text || isStreaming) return;

  document.body.classList.remove('welcome-mode');
  if (welcome && welcome.parentNode === chatContent) welcome.style.display = 'none';

  addMessage('user', text);

  if (!chatContent.querySelector('.first-ai-message')) {
    let currentStockName = '';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('삼성') || lowerText.includes('삼전')) currentStockName = '삼성전자';
    else if (lowerText.includes('하이닉스')) currentStockName = 'SK하이닉스';
    const firstAiText = currentStockName ? `${currentStockName} 현재 +5.3% 상승중이야!` : '현재 +5.3% 상승중이야!';
    const firstAi = addMessage('ai', firstAiText);
    if (firstAi) firstAi.parentElement.classList.add('first-ai-message');
  }
  if (input) {
    input.value = '';
    input.style.height = 'auto';
  }
  if (sendBtn) sendBtn.disabled = true;
  isStreaming = true;

  const msg = document.createElement('div');
  msg.className = 'message widget-message';
  const body = document.createElement('div');
  body.className = 'msg-body ai-widget-shell';
  body.dataset.query = text;
  body.innerHTML = `
    <div class="widget-thinking" aria-live="polite">
      <div class="widget-thinking-avatar">G</div>
      <div class="widget-thinking-copy">
        <span class="thinking-dot">●</span>
        <span class="thinking-dot">●</span>
        <span class="thinking-dot">●</span>
        <span class="thinking-dot">●</span>
        <span class="thinking-dot">●</span>
        <span class="thinking-dot">●</span>
        <span class="thinking-label">생각 중</span>
      </div>
    </div>
  `;
  msg.appendChild(body);
  if (chatContent) chatContent.appendChild(msg);
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

  const fullResponse = getDemoResponse(text);
  await sleep(1200);

  // STEP 1: render every analysis as an independent widget section.
  body.innerHTML = `<div class="widget-content">${fullResponse}</div>`;

  const content = body.querySelector('.widget-content');
  const sections = Array.from(content.querySelectorAll(':scope > .section'));

  sections.forEach((section, index) => {
    section.dataset.widgetKey = String(index);
    // Each section is now its own visible analysis widget.
    section.classList.add('widget-section-active');
  });
  setupWidgetDrag(body);

  body.style.opacity = '0';
  body.style.transition = 'opacity 0.3s';
  await sleep(50);
  body.style.opacity = '1';

  isStreaming = false;
  if (sendBtn && input) sendBtn.disabled = input.value.trim() === '';
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const Panel = (() => {
  const STORAGE_WIDTH = 'panel-width';
  const panel = document.getElementById('panel');
  const grip = document.getElementById('panelGrip');

  if (!panel || !grip) return { close: () => {}, toggle: () => {} };

  let savedWidth = parseInt(localStorage.getItem(STORAGE_WIDTH)) || 400;
  document.documentElement.style.setProperty('--panel-width', savedWidth + 'px');

  grip.addEventListener('mousedown', (e) => {
    e.preventDefault();
    panel.classList.add('resizing');
    grip.classList.add('active');
    const startX = e.clientX;
    const startWidth = panel.offsetWidth;
    const onMove = (ev) => {
      const delta = startX - ev.clientX;
      let newWidth = startWidth + delta;
      newWidth = Math.max(300, Math.min(window.innerWidth * 0.7, newWidth));
      document.documentElement.style.setProperty('--panel-width', newWidth + 'px');
      savedWidth = newWidth;
    };
    const onUp = () => {
      panel.classList.remove('resizing');
      grip.classList.remove('active');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      localStorage.setItem(STORAGE_WIDTH, savedWidth);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  grip.addEventListener('dblclick', () => {
    savedWidth = 400;
    document.documentElement.style.setProperty('--panel-width', savedWidth + 'px');
    localStorage.setItem(STORAGE_WIDTH, savedWidth);
  });

  function close() { panel.classList.remove('open'); }
  function toggle() {
    if (panel.classList.contains('open')) close();
    else panel.classList.add('open');
  }

  return { close, toggle };
})();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.body.classList.remove('sidebar-mobile-open');
    if (typeof Panel !== 'undefined') Panel.close();
    ['gaemiPopup', 'gaemiBtn', 'inputPopup', 'inputGaemiBtn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('open');
    });
  }
});
