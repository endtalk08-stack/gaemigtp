// ==========================================
// 1. 데이터 창고
// ==========================================
const stockData = {
  "삼성전자": {
    why_time: "30초",
    why_title: "삼성전자 오늘 신났네 ㅎㅎ",
    why_time1: "08:00", why_text1: "프리마켓 +1.5% 상승 출발",
    why_time2: "09:15", why_text2: "거래대금 4.2배 폭발",
    currentPrice: "259,500원", change: "+3.2%",
    news1: "📰 HBM 공급 확대 뉴스",
    news2: "📌 외국인 100만 주 순매수",

    big_foreign_pct: "40%", big_foreign_val: "+48만",
    big_inst_pct: "18%", big_inst_val: "+21만",
    big_retail_pct: "58%", big_retail_val: "-69만",
    big_memo: "외놈들이랑 기관 아찌들은 쌍끌이로 담고 있어.<br>우리 개미는 반대로 팔고 있고 ㅠㅠ",
    related1_name: "SK하이닉스", related1_change: "+2.1%",
    related2_name: "한미반도체", related2_change: "+1.8%",

    cal_date1: "🌙 오늘 밤", cal_event1: "조용함",
    cal_date2: "🔥 09/17(목)", cal_event2: "미국 FOMC 기준금리 결정 (03:00)",
    cal_memo: "지표 발표 전후로는 호가창 얇아짐.<br>뇌동매매 금지!",

    vol_rank1: "삼성전자 · 4.2배",
    vol_rank2: "SK하이닉스 · 3.1배",
    vol_rank3: "우리로 · 2.8배",

    vote_up: "68%", vote_down: "32%"
  },
  
  "SK하이닉스": {
    why_time: "20초",
    why_title: "엔비디아 실적 발표 대기 중!",
    why_time1: "08:30", why_text1: "장전 동시호가 강세",
    why_time2: "09:00", why_text2: "외국인 매수세 유입",
    currentPrice: "205,000원", change: "+2.1%",
    news1: "📰 AI 반도체 수요 급증 뉴스",
    news2: "📌 기관 집중 매수",

    big_foreign_pct: "55%", big_foreign_val: "+72만",
    big_inst_pct: "25%", big_inst_val: "+31만",
    big_retail_pct: "20%", big_retail_val: "-15만",
    big_memo: "외국인이 쓸어 담고 있네!<br>실적 기대감이 엄청난 듯.",
    related1_name: "한미반도체", related1_change: "+4.5%",
    related2_name: "이수페타시스", related2_change: "+3.2%",

    cal_date1: "🔥 내일 새벽", cal_event1: "엔비디아 2분기 실적 발표",
    cal_date2: "📌 09/25(금)", cal_event2: "미국 마이크론 실적 발표",
    cal_memo: "엔비디아 실적에 따라 내일 갭상승/하락 결정됨!",

    vol_rank1: "SK하이닉스 · 5.5배",
    vol_rank2: "한미반도체 · 4.1배",
    vol_rank3: "삼성전자 · 2.2배",

    vote_up: "85%", vote_down: "15%"
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
    avatar.textContent = 'AI';
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
    return `
      <div class="section" id="section-why">
        <div class="section-header">
          <div class="section-title">${stockName} 왜 빨간불일까? <span class="section-time">· ${data.why_time}</span></div>
        </div>
        <div class="cal-note">${data.why_title}</div>
        <div class="report-line"><span class="report-time">${data.why_time1}</span><span class="report-text">${data.why_text1}</span></div>
        <div class="report-line"><span class="report-time">${data.why_time2}</span><span class="report-text">${data.why_text2}</span></div>
        <div class="report-current">
          <span class="report-current-label">현재가</span>
          <span class="report-current-value">${data.currentPrice} <span class="up-color">${data.change}</span></span>
        </div>
        <div class="report-sources">
          <div class="report-sources-item">${data.news1}</div>
          <div class="report-sources-item">${data.news2}</div>
        </div>
        ${sectionFooter('section-why')}
      </div>

      <div class="section" id="section-big">
        <div class="section-header">
          <div class="section-title">큰손들은 뭐하고 있어? <span class="section-time">· 20초</span></div>
        </div>
        <div class="stock-name-sub">${stockName}</div>
        <div class="bar-chart">
          <div class="bar-row">
            <div class="bar-label">외국인</div>
            <div class="bar-track"><div class="bar-zero"></div><div class="bar-fill-right" style="width:${data.big_foreign_pct};"></div></div>
            <div class="bar-value buy">${data.big_foreign_val}</div>
          </div>
          <div class="bar-row">
            <div class="bar-label">기관</div>
            <div class="bar-track"><div class="bar-zero"></div><div class="bar-fill-right" style="width:${data.big_inst_pct};"></div></div>
            <div class="bar-value buy">${data.big_inst_val}</div>
          </div>
          <div class="bar-row">
            <div class="bar-label">개인</div>
            <div class="bar-track"><div class="bar-zero"></div><div class="bar-fill-left" style="width:${data.big_retail_pct};"></div></div>
            <div class="bar-value sell">${data.big_retail_val}</div>
          </div>
        </div>
        <div class="cal-note">${data.big_memo}</div>
        <div class="related-stocks" style="border-top: none; margin-top: 10px;">
          <div class="related-stocks-title">같이 움직인 종목</div>
          <div class="related-stock-row"><span class="related-stock-name">${data.related1_name}</span><span class="related-stock-change up-color">${data.related1_change}</span></div>
          <div class="related-stock-row"><span class="related-stock-name">${data.related2_name}</span><span class="related-stock-change up-color">${data.related2_change}</span></div>
        </div>
        ${sectionFooter('section-big')}
      </div>

      <div class="section" id="section-cal">
        <div class="section-header">
          <div class="section-title">📅 다가오는 일정 <span class="section-time">· 15초</span></div>
        </div>
        <div class="calendar-list">
          <div class="cal-row"><span class="cal-date">${data.cal_date1}</span><span class="cal-event">${data.cal_event1}</span></div>
          <div class="cal-row"><span class="cal-date">${data.cal_date2}</span><span class="cal-event">${data.cal_event2}</span></div>
        </div>
        <div class="cal-note">${data.cal_memo}</div>
        ${sectionFooter('section-cal')}
      </div>

      <div class="section" id="section-vol">
        <div class="section-header"><div class="section-title">거래대금 폭발 <span class="section-time">· 10초</span></div></div>
        <div class="report-line"><span class="report-time">1</span><span class="report-text"><strong>${data.vol_rank1}</strong></span></div>
        <div class="report-line"><span class="report-time">2</span><span class="report-text"><strong>${data.vol_rank2}</strong></span></div>
        <div class="report-line"><span class="report-time">3</span><span class="report-text"><strong>${data.vol_rank3}</strong></span></div>
        ${sectionFooter('section-vol')}
      </div>

      <div class="section" id="section-vote">
        <div class="section-header">
          <div class="section-title">내일 어디로 튈까?</div>
        </div>
        <div class="vote-wrap">
          <div class="vote-stats">
            <span class="up-color">상승 ${data.vote_up}</span>
            <span class="down-color">하락 ${data.vote_down}</span>
          </div>
          <div class="vote-bar">
            <div class="vote-bar-up" id="voteUp" style="width:${data.vote_up};"></div>
            <div class="vote-bar-down" id="voteDown" style="width:${data.vote_down};"></div>
          </div>
          <div class="vote-buttons">
            <button class="vote-btn up" onclick="castVote('up')">상승 전망</button>
            <button class="vote-btn down" onclick="castVote('down')">하락 전망</button>
          </div>
        </div>
        ${sectionFooter('section-vote')}
      </div>
    `;
  }

  return `
    <div class="section" id="section-default">
      <div class="section-header">
        <div class="section-title">${userText}</div>
      </div>
      <div class="report-note">아직 데이터 창고에 없는 종목입니다. '삼성전자' 또는 'SK하이닉스'를 검색해보세요!</div>
      ${sectionFooter('section-default')}
    </div>
  `;
}

let voted = false;
function castVote(type) {
  if (voted) return;
  voted = true;
  const up = document.getElementById('voteUp');
  const down = document.getElementById('voteDown');
  if (up && down) {
    if (type === 'up') { up.style.width = '74%'; down.style.width = '26%'; }
    else { up.style.width = '61%'; down.style.width = '39%'; }
  }
}

async function sendMessage() {
  const text = input ? input.value.trim() : '';
  if (!text || isStreaming) return;

  document.body.classList.remove('welcome-mode');
  if (welcome && welcome.parentNode === chatContent) welcome.style.display = 'none';

  addMessage('user', text);
  if (input) {
    input.value = '';
    input.style.height = 'auto';
  }
  if (sendBtn) sendBtn.disabled = true;
  isStreaming = true;

  const msg = document.createElement('div');
  msg.className = 'message';
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar ai';
  avatar.textContent = 'G';
  const body = document.createElement('div');
  body.className = 'msg-body';
  body.innerHTML = '<div style="display:inline-flex;gap:4px;padding:8px 0;"><span style="width:8px;height:8px;border-radius:50%;background:var(--text-dim);animation:bounce 1.4s infinite;"></span><span style="width:8px;height:8px;border-radius:50%;background:var(--text-dim);animation:bounce 1.4s infinite 0.2s;"></span><span style="width:8px;height:8px;border-radius:50%;background:var(--text-dim);animation:bounce 1.4s infinite 0.4s;"></span></div>';
  msg.appendChild(avatar);
  msg.appendChild(body);
  if (chatContent) chatContent.appendChild(msg);
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

  const fullResponse = getDemoResponse(text);
  await sleep(400);
  body.innerHTML = fullResponse;
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


/* ==========================================
   3. gaemiGTP 위젯 엔진 v1
   - 12-column grid
   - drag / resize
   - add / remove
   - common widget actions
   ========================================== */
const WidgetStore = (() => {
  const store = document.getElementById('widgetStore');
  const search = document.getElementById('widgetStoreSearch');

  function open() {
    if (!store) return;
    store.classList.add('open');
    store.setAttribute('aria-hidden', 'false');
    if (search) setTimeout(() => search.focus(), 0);
  }
  function close() {
    if (!store) return;
    store.classList.remove('open');
    store.setAttribute('aria-hidden', 'true');
  }

  function filter(value) {
    const q = String(value || '').trim().toLowerCase();
    document.querySelectorAll('.widget-store-card').forEach(card => {
      const hay = (card.dataset.widgetSearch || '').toLowerCase();
      card.classList.toggle('is-hidden', q && !hay.includes(q));
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-widget-store]')) close();
    const add = e.target.closest('[data-add-widget]');
    if (add && !add.disabled) {
      WidgetEngine.add(add.dataset.addWidget);
      close();
    }
  });

  if (search) search.addEventListener('input', () => filter(search.value));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  return { open, close };
})();

const WidgetEngine = (() => {
  const grid = document.getElementById('widgetGrid');
  const workspace = document.getElementById('widgetWorkspace');
  if (!grid || !workspace) return { add: () => {} };

  let counter = 0;

  const definitions = {
    'samsung-move': {
      icon: '🔮',
      title: '삼성전자 왜 빨간불일까?',
      lead: '#삼성전자 +0.37% · 오늘 신났네 ㅎㅎ',
      price: '259,500원',
      change: '+3.2%',
      rows: [
        ['09:00', '시초가 +1.5% 상승 출발'],
        ['09:15', '1분봉 거래대금 평소 대비 4.2배 폭발'],
        ['09:15', '5분봉 거래대금 평소 대비 4.2배 폭발'],
        ['09:15', '개미들 인기 종목 순위 1위 등극'],
        ['09:15', '20일선 돌파 / 이탈'],
        ['09:15', '60일선 돌파 / 이탈'],
        ['09:15', '60분봉 거래대금 2.1배 폭발'],
        ['09:15', '60분봉 볼린저밴드 상단 돌파'],
        ['09:15', '거래대금 순위 1위 등극!'],
        ['09:15', '상승률 1위 등극! 상한가 터짐!']
      ],
      tags: '#삼성전자 #국장살려 #거래대금폭발 #상한가'
    }
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function add(type) {
    const def = definitions[type];
    if (!def) return;

    workspace.classList.add('active');
    document.getElementById('welcome')?.style.setProperty('display', 'none');

    const id = 'widget-' + (++counter);
    const article = document.createElement('article');
    article.className = 'strategy-widget';
    article.dataset.widgetId = id;
    article.dataset.widgetType = type;
    article.style.gridColumn = 'span 6';
    article.style.gridRow = 'span 25';

    const rows = def.rows.map((row, i) => `
      <div class="widget-timeline-row">
        <span class="widget-time">${escapeHTML(row[0])}</span>
        <span class="widget-event ${i >= 6 ? 'widget-highlight' : ''}">${escapeHTML(row[1])}</span>
      </div>`).join('');

    article.innerHTML = `
      <div class="strategy-widget-head">
        <button type="button" class="widget-drag-handle" aria-label="위젯 이동" title="드래그하여 이동">⋮⋮</button>
        <div class="strategy-widget-title">${escapeHTML(def.title)}</div>
        <div class="widget-head-actions">
          <button type="button" data-widget-add-tab title="이 위젯 안에 추가">+</button>
          <button type="button" data-widget-refresh title="새로고침">↻</button>
          <button type="button" data-widget-remove title="삭제">×</button>
        </div>
      </div>
      <div class="strategy-widget-body">
        <div class="widget-lead">
          <div class="widget-lead-line">#삼성전자 <span class="widget-up">+0.37%</span></div>
          <div class="widget-lead-line">오늘 신났네 ㅎㅎ</div>
        </div>
        <div class="widget-timeline">${rows}</div>
        <div class="widget-tagline">${escapeHTML(def.tags)}</div>
      </div>
      <div class="widget-foot">
        <button type="button" data-widget-copy>복사</button>
        <button type="button" data-widget-like>♡</button>
        <button type="button" data-widget-dislike>♧</button>
        <button type="button" data-widget-share>공유</button>
      </div>
      <div class="widget-resize" role="separator" aria-label="위젯 크기 조절" title="드래그하여 크기 조절"></div>
    `;

    grid.appendChild(article);
    wireWidget(article);
  }


  function addTabToWidget(widget) {
    const def = definitions[widget.dataset.widgetType];
    if (!def) return;
    let tabs = widget.querySelector('.widget-tabs');
    let panels = widget.querySelector('.widget-tab-panels');

    if (!tabs) {
      const body = widget.querySelector('.strategy-widget-body');
      tabs = document.createElement('div');
      tabs.className = 'widget-tabs';
      tabs.innerHTML = '<button type="button" class="widget-tab active">삼성전자 분석</button>';
      panels = document.createElement('div');
      panels.className = 'widget-tab-panels';
      const first = document.createElement('div');
      first.className = 'widget-tab-panel active';
      first.innerHTML = body.innerHTML;
      panels.appendChild(first);
      body.replaceWith(panels);
      widget.querySelector('.strategy-widget-head').insertAdjacentElement('afterend', tabs);
    }

    const n = tabs.querySelectorAll('.widget-tab').length + 1;
    const tab = document.createElement('button');
    tab.type='button'; tab.className='widget-tab'; tab.textContent=`분석 ${n}`;
    const panel=document.createElement('div');
    panel.className='widget-tab-panel';
    panel.innerHTML=`<div class="widget-lead"><div class="widget-lead-line">#삼성전자 <span class="widget-up">+0.37%</span></div><div class="widget-lead-line">오늘 신났네 ㅎㅎ</div></div>
      <div class="widget-timeline">${def.rows.map((r,i)=>`<div class="widget-timeline-row"><span class="widget-time">${r[0]}</span><span class="widget-event ${i>=6?'widget-highlight':''}">${r[1]}</span></div>`).join('')}</div>
      <div class="widget-tagline">${def.tags}</div>`;
    tabs.appendChild(tab); panels.appendChild(panel);

    tab.addEventListener('click',()=>{
      tabs.querySelectorAll('.widget-tab').forEach(x=>x.classList.remove('active'));
      panels.querySelectorAll('.widget-tab-panel').forEach(x=>x.classList.remove('active'));
      tab.classList.add('active'); panel.classList.add('active');
    });
    tab.click();
  }

  function wireWidget(widget) {
    const handle = widget.querySelector('.widget-drag-handle');
    const resize = widget.querySelector('.widget-resize');

    handle?.addEventListener('pointerdown', e => startDrag(e, widget));
    resize?.addEventListener('pointerdown', e => startResize(e, widget));

    widget.querySelector('[data-widget-remove]')?.addEventListener('click', () => {
      widget.remove();
      if (!grid.children.length) workspace.classList.remove('active');
    });

    widget.querySelector('[data-widget-add-tab]')?.addEventListener('click', () => addTabToWidget(widget));

    widget.querySelector('[data-widget-refresh]')?.addEventListener('click', () => {
      widget.animate(
        [{ opacity: .55 }, { opacity: 1 }],
        { duration: 180, easing: 'ease-out' }
      );
    });

    widget.querySelector('[data-widget-copy]')?.addEventListener('click', async () => {
      const text = getShareText(widget);
      try {
        await navigator.clipboard.writeText(text);
        const btn = widget.querySelector('[data-widget-copy]');
        const old = btn.textContent;
        btn.textContent = '복사됨';
        setTimeout(() => btn.textContent = old, 1000);
      } catch {
        window.prompt('아래 내용을 복사하세요.', text);
      }
    });

    widget.querySelector('[data-widget-share]')?.addEventListener('click', async () => {
      const text = getShareText(widget);
      if (navigator.share) {
        try { await navigator.share({ title: 'gaemiGTP', text }); } catch {}
      } else {
        try { await navigator.clipboard.writeText(text); alert('공유용 문구를 복사했습니다.'); }
        catch { window.prompt('공유용 문구', text); }
      }
    });

    widget.querySelector('[data-widget-like]')?.addEventListener('click', e => {
      e.currentTarget.textContent = e.currentTarget.textContent === '♥' ? '♡' : '♥';
    });
    widget.querySelector('[data-widget-dislike]')?.addEventListener('click', e => {
      e.currentTarget.textContent = e.currentTarget.textContent === '♧' ? '♤' : '♧';
    });
  }

  function getShareText(widget) {
    const title = widget.querySelector('.strategy-widget-title')?.textContent || '';
    const lead = widget.querySelector('.widget-lead')?.textContent || '';
    const price = widget.querySelector('.widget-price-line')?.textContent || '';
    const rows = [...widget.querySelectorAll('.widget-timeline-row')]
      .map(r => `${r.querySelector('.widget-time')?.textContent}  ${r.querySelector('.widget-event')?.textContent}`)
      .join('\n');
    const tags = widget.querySelector('.widget-tagline')?.textContent || '';
    return [title, '', lead, '', rows, '', price.trim(), '', tags].join('\n').replace(/\n{3,}/g, '\n\n');
  }

  function startDrag(e, widget) {
    e.preventDefault();
    e.stopPropagation();

    widget.classList.add('is-dragging');
    const placeholder = document.createElement('div');
    placeholder.className = 'widget-drag-placeholder';
    placeholder.style.gridColumn = widget.style.gridColumn || 'span 6';
    placeholder.style.gridRow = widget.style.gridRow || 'span 25';
    grid.insertBefore(placeholder, widget);
    widget.style.position = 'fixed';
    const rect = widget.getBoundingClientRect();
    widget.style.width = rect.width + 'px';
    widget.style.height = rect.height + 'px';
    widget.style.left = rect.left + 'px';
    widget.style.top = rect.top + 'px';
    widget.style.zIndex = '200';

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const move = ev => {
      widget.style.left = (ev.clientX - offsetX) + 'px';
      widget.style.top = (ev.clientY - offsetY) + 'px';

      const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.strategy-widget');
      if (!target || target === widget || !grid.contains(target)) return;

      const targetRect = target.getBoundingClientRect();
      const before = ev.clientY < targetRect.top + targetRect.height / 2;
      if (before) grid.insertBefore(placeholder, target);
      else grid.insertBefore(placeholder, target.nextSibling);
    };

    const finish = () => {
      widget.classList.remove('is-dragging');
      widget.style.position = '';
      widget.style.width = '';
      widget.style.height = '';
      widget.style.left = '';
      widget.style.top = '';
      widget.style.zIndex = '';
      grid.insertBefore(widget, placeholder);
      placeholder.remove();

      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', finish);
      document.removeEventListener('pointercancel', finish);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', finish, { once: true });
    document.addEventListener('pointercancel', finish, { once: true });
  }

  function startResize(e, widget) {
    e.preventDefault();
    e.stopPropagation();
    handlePointerCapture(e, widget);

    const rect = widget.getBoundingClientRect();
    const startW = rect.width;
    const startH = rect.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const move = ev => {
      const colWidth = grid.clientWidth / 12;
      const span = Math.max(3, Math.min(12, Math.round((startW + ev.clientX - startX) / colWidth)));
      const rows = Math.max(12, Math.min(80, Math.round((startH + ev.clientY - startY) / 22)));
      widget.style.gridColumn = `span ${span}`;
      widget.style.gridRow = `span ${rows}`;
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up, { once: true });
  }

  function handlePointerCapture(e, widget) {
    try { e.target.setPointerCapture(e.pointerId); } catch {}
  }

  return { add };
})();
