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
let aiResponseWidgetCounter = 0;
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

  // B안 ②: 별도의 AI 답변 영역은 만들지 않는다.
  // 검색 결과를 바로 '우리 위젯' 하나로 표시한다.
  const msg = document.createElement('div');
  msg.className = 'message ai-widget-message';

  const body = document.createElement('div');
  body.className = 'ai-widget-grid';
  body.innerHTML = '<div class="ai-widget-loading"><span></span><span></span><span></span></div>';
  msg.appendChild(body);
  if (chatContent) chatContent.appendChild(msg);
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

  await sleep(350);

  // 현재 1차 연결 대상: 삼성전자 → 기존에 만든 우리 위젯 1개.
  const normalized = text.replace(/\s+/g, '').toLowerCase();
  const stockName = normalized.includes('삼성전자') || normalized.includes('samsung') ? '삼성전자'
    : (normalized.includes('하이닉스') || normalized.includes('skhynix')) ? 'SK하이닉스' : '';
  const widget = stockName && typeof WidgetEngine !== 'undefined'
    ? WidgetEngine.create('samsung-move', stockName)
    : null;

  body.innerHTML = '';
  if (widget) {
    body.appendChild(widget);
  } else {
    const empty = document.createElement('div');
    empty.className = 'ai-widget-empty';
    empty.textContent = '이 종목의 위젯을 준비 중입니다.';
    body.appendChild(empty);
  }

  body.style.opacity = '0';
  body.style.transition = 'opacity 0.25s';
  requestAnimationFrame(() => { body.style.opacity = '1'; });

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
  const available = document.getElementById('widgetStoreList');
  const installedSection = document.getElementById('widgetInstalledSection');
  const installedList = document.getElementById('widgetInstalledList');
  const STORAGE = 'gaemi-installed-widgets';

  function getInstalled() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE) || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }

  function saveInstalled(items) {
    localStorage.setItem(STORAGE, JSON.stringify([...new Set(items)]));
  }

  function isInstalled(type) {
    return getInstalled().includes(type);
  }

  function open() {
    if (!store) return;
    renderInstalled();
    store.classList.add('open');
    store.setAttribute('aria-hidden', 'false');
    if (search) setTimeout(() => search.focus(), 0);
  }

  function close() {
    if (!store) return;
    store.classList.remove('open');
    store.setAttribute('aria-hidden', 'true');
  }

  function renderInstalled() {
    if (!installedList || !installedSection) return;
    const installed = getInstalled();
    installedList.innerHTML = '';

    installed.forEach(type => {
      const source = available?.querySelector(`[data-add-widget="${type}"]`)?.closest('.widget-store-card');
      if (!source) return;
      const clone = source.cloneNode(true);
      clone.classList.add('is-installed-card');
      const btn = clone.querySelector('.widget-install-btn');
      if (btn) {
        btn.textContent = '설치됨';
        btn.classList.add('is-installed');
        btn.disabled = false;
        btn.dataset.removeWidget = type;
        btn.removeAttribute('data-add-widget');
      }
      installedList.appendChild(clone);
    });

    installedSection.hidden = installedList.children.length === 0;

    available?.querySelectorAll('.widget-store-card').forEach(card => {
      const btn = card.querySelector('[data-add-widget]');
      if (!btn) return;
      const type = btn.dataset.addWidget;
      const on = installed.includes(type);
      card.classList.toggle('is-installed-source', on);
      btn.disabled = on;
      btn.textContent = on ? '설치됨' : '+';
      btn.classList.toggle('is-installed', on);
    });
  }

  function install(type) {
    const installed = getInstalled();
    if (!installed.includes(type)) {
      installed.push(type);
      saveInstalled(installed);
    }
    renderInstalled();
  }

  function uninstall(type) {
    saveInstalled(getInstalled().filter(x => x !== type));
    renderInstalled();
  }

  function filter(value) {
    const q = String(value || '').trim().toLowerCase();
    available?.querySelectorAll('.widget-store-card').forEach(card => {
      const hay = (card.dataset.widgetSearch || '').toLowerCase();
      card.classList.toggle('is-hidden', !!q && !hay.includes(q));
    });
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-close-widget-store]')) {
      close();
      return;
    }

    const add = e.target.closest('[data-add-widget]');
    if (add && !add.disabled) {
      install(add.dataset.addWidget);
      // 설치는 페이지 이동이 아니라 '설치됨' 영역으로만 이동한다.
      return;
    }

    const remove = e.target.closest('[data-remove-widget]');
    if (remove) uninstall(remove.dataset.removeWidget);
  });

  if (search) search.addEventListener('input', () => filter(search.value));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  renderInstalled();

  return { open, close, getInstalled, isInstalled };
})();

const WidgetEngine = (() => {
  const definitions = {
    'samsung-move': {
      title: '왜 빨간불일까?',
      stock: '삼성전자',
      lead: ['#삼성전자 +0.37%', '오늘 신났네 ㅎㅎ'],
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
    },
    'big-money': {
      title: '큰손들은 뭐하고 있어?',
      stock: '삼성전자',
      lead: ['외국인 +48만 · 기관 +21만 · 개인 -69만', '외국인·기관은 담고, 개인은 팔고 있어.'],
      rows: [
        ['외국인', '+48만 순매수'],
        ['기관', '+21만 순매수'],
        ['개인', '-69만 순매도'],
        ['같이 움직인', 'SK하이닉스 +2.1%'],
        ['같이 움직인', '한미반도체 +1.8%']
      ],
      tags: '#수급 #외국인 #기관 #관련주'
    },
    'calendar': {
      title: '다가오는 일정',
      stock: '삼성전자',
      lead: ['오늘 밤', '조용함'],
      rows: [
        ['09/17(목)', '미국 FOMC 기준금리 결정 (03:00)'],
        ['09/18(금)', '주요 경제지표 발표'],
        ['이번 주', '반도체 업종 주요 이벤트 확인']
      ],
      tags: '#일정 #FOMC #이벤트'
    },
    'volume': {
      title: '거래대금 폭발',
      stock: '삼성전자',
      lead: ['거래대금 순위', '삼성전자 4.2배'],
      rows: [
        ['1', '삼성전자 · 4.2배'],
        ['2', 'SK하이닉스 · 3.1배'],
        ['3', '우리로 · 2.8배']
      ],
      tags: '#거래대금 #순위 #수급'
    },
    'vote': {
      title: '내일 어디로 튈까?',
      stock: '삼성전자',
      lead: ['상승 68%', '하락 32%'],
      rows: [
        ['현재', '상승 전망 68%'],
        ['현재', '하락 전망 32%']
      ],
      tags: '#투표 #상승전망 #하락전망'
    }
  };

  let counter = 0;

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function create(type, stockNameOverride = '') {
    const base = definitions[type];
    if (!base) return null;
    const stockName = stockNameOverride || base.stock || '삼성전자';
    const market = stockData[stockName];
    const def = market ? { ...base, stock: stockName } : base;
    if (market) {
      if (type === 'samsung-move') {
        def.lead = [`#${stockName} ${market.change || ''}`.trim(), market.why_title];
        def.rows = [[market.why_time1, market.why_text1], [market.why_time2, market.why_text2]];
        def.tags = `#${stockName} #거래대금 #시장움직임`;
      } else if (type === 'big-money') {
        def.lead = [`외국인 ${market.big_foreign_val} · 기관 ${market.big_inst_val} · 개인 ${market.big_retail_val}`, market.big_memo.replace(/<br>/g, ' ')];
        def.rows = [['외국인', `${market.big_foreign_val} 순매수`], ['기관', `${market.big_inst_val} 순매수`], ['개인', `${market.big_retail_val} 순매도`], ['같이 움직인', `${market.related1_name} ${market.related1_change}`], ['같이 움직인', `${market.related2_name} ${market.related2_change}`]];
        def.tags = `#${stockName} #수급 #외국인 #기관`;
      } else if (type === 'calendar') {
        def.lead = [market.cal_date1.replace(/^🌙|^🔥|^📌/,'').trim(), market.cal_event1];
        def.rows = [[market.cal_date1, market.cal_event1], [market.cal_date2, market.cal_event2]];
        def.tags = `#${stockName} #일정 #이벤트`;
      } else if (type === 'volume') {
        def.lead = ['거래대금 순위', market.vol_rank1];
        def.rows = [['1', market.vol_rank1], ['2', market.vol_rank2], ['3', market.vol_rank3]];
        def.tags = `#${stockName} #거래대금 #순위`;
      } else if (type === 'vote') {
        def.lead = [`상승 ${market.vote_up}`, `하락 ${market.vote_down}`];
        def.rows = [['현재', `상승 전망 ${market.vote_up}`], ['현재', `하락 전망 ${market.vote_down}`]];
        def.tags = `#${stockName} #투표`;
      }
    }

    const article = document.createElement('article');
    article.className = 'strategy-widget';
    article.dataset.widgetId = 'response-widget-' + (++counter);
    article.dataset.widgetType = type;
    article.dataset.stock = stockName;

    const rows = def.rows.map(row => `
      <div class="widget-timeline-row">
        <span class="widget-time">${escapeHTML(row[0])}</span>
        <span class="widget-event">${escapeHTML(row[1])}</span>
      </div>`).join('');

    article.innerHTML = `
      <div class="strategy-widget-head">
        <button type="button" class="widget-drag-handle" aria-label="위젯 이동" title="드래그하여 이동">⋮⋮</button>
        <div class="strategy-widget-title">${escapeHTML(def.title)}</div>
        <div class="widget-head-actions">
          <button type="button" data-widget-add-tab title="위젯 추가">+</button>
          <button type="button" data-widget-refresh title="새로고침">↻</button>
          <button type="button" data-widget-remove title="위젯 삭제">×</button>
        </div>
      </div>
      <div class="widget-picker" hidden></div>
      <div class="strategy-widget-body">
        <div class="widget-lead">
          <div class="widget-lead-line">${escapeHTML(def.lead[0]).replace(/([+-]\d+(?:\.\d+)?%)/g, '<span class="widget-up">$1</span>')}</div>
          <div class="widget-lead-line">${escapeHTML(def.lead[1])}</div>
        </div>
        <div class="widget-timeline">${rows}</div>
        <div class="widget-tagline">${escapeHTML(def.tags)}</div>
      </div>
      <div class="widget-foot">
        <button type="button" class="widget-icon-action" data-widget-copy title="복사" aria-label="복사">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
        <button type="button" class="widget-icon-action" data-widget-refresh-action title="새로고침" aria-label="새로고침">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
        <button type="button" class="widget-icon-action" data-widget-like title="좋아요" aria-label="좋아요">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
        </button>
        <button type="button" class="widget-icon-action" data-widget-dislike title="싫어요" aria-label="싫어요">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
          </svg>
        </button>
        <button type="button" class="widget-icon-action" data-widget-share title="공유" aria-label="공유">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
      </div>
      <div class="widget-resize" role="separator" aria-label="위젯 크기 조절"></div>
    `;

    wireWidget(article);
    return article;
  }

  function renderInstalledForStock(container, stockName) {
    if (!container || !stockName || typeof WidgetStore === 'undefined') return;
    const installed = WidgetStore.getInstalled();
    const wrap = document.createElement('div');
    wrap.className = 'widget-response-wrap';

    installed.forEach(type => {
      const def = definitions[type];
      if (!def || def.stock !== stockName) return;
      const widget = create(type);
      if (widget) wrap.appendChild(widget);
    });

    if (wrap.children.length) container.appendChild(wrap);
  }

  function add(type) {
    // 하위 호환: 기존 호출이 있어도 별도 페이지를 만들지 않는다.
    WidgetStore?.install?.(type);
  }

  function wireWidget(widget) {
    const handle = widget.querySelector('.widget-drag-handle');
    const resize = widget.querySelector('.widget-resize');

    handle?.addEventListener('pointerdown', e => startDrag(e, widget));
    resize?.addEventListener('pointerdown', e => startResize(e, widget));

    widget.querySelector('[data-widget-add-tab]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWidgetPicker(widget);
    });

    widget.querySelector('[data-widget-remove]')?.addEventListener('click', () => {
      widget.remove();
    });

    const refreshWidget = () => {
      widget.animate([{opacity:.55},{opacity:1}], {duration:180,easing:'ease-out'});
    };
    widget.querySelector('[data-widget-refresh]')?.addEventListener('click', refreshWidget);
    widget.querySelector('[data-widget-refresh-action]')?.addEventListener('click', refreshWidget);

    widget.querySelector('[data-widget-copy]')?.addEventListener('click', async () => {
      const text = getShareText(widget);
      try {
        await navigator.clipboard.writeText(text);
        showToast('복사됨');
      } catch { window.prompt('아래 내용을 복사하세요.', text); }
    });

    widget.querySelector('[data-widget-share]')?.addEventListener('click', async () => {
      const text=getShareText(widget);
      if (navigator.share) {
        try { await navigator.share({title:'gaemiGTP', text}); } catch {}
      } else {
        try { await navigator.clipboard.writeText(text); alert('공유용 문구를 복사했습니다.'); }
        catch { window.prompt('공유용 문구', text); }
      }
    });

    widget.querySelector('[data-widget-like]')?.addEventListener('click', e => {
      e.currentTarget.textContent=e.currentTarget.textContent==='♥'?'♡':'♥';
    });
    widget.querySelector('[data-widget-dislike]')?.addEventListener('click', e => {
      e.currentTarget.textContent=e.currentTarget.textContent==='♧'?'♤':'♧';
    });
  }

  function getDefinition(type, stockName) {
    const base = definitions[type];
    if (!base) return null;
    const market = stockData[stockName];
    const def = market ? { ...base, stock: stockName } : { ...base };
    if (!market) return def;
    if (type === 'samsung-move') {
      def.lead = [`#${stockName} ${market.change || ''}`.trim(), market.why_title];
      def.rows = [[market.why_time1, market.why_text1], [market.why_time2, market.why_text2]];
      def.tags = `#${stockName} #거래대금 #시장움직임`;
    } else if (type === 'big-money') {
      def.lead = [`외국인 ${market.big_foreign_val} · 기관 ${market.big_inst_val} · 개인 ${market.big_retail_val}`, market.big_memo.replace(/<br>/g, ' ')];
      def.rows = [['외국인', `${market.big_foreign_val} 순매수`], ['기관', `${market.big_inst_val} 순매수`], ['개인', `${market.big_retail_val} 순매도`], ['같이 움직인', `${market.related1_name} ${market.related1_change}`], ['같이 움직인', `${market.related2_name} ${market.related2_change}`]];
      def.tags = `#${stockName} #수급 #외국인 #기관`;
    } else if (type === 'calendar') {
      def.lead = [market.cal_date1.replace(/^🌙|^🔥|^📌/,'').trim(), market.cal_event1];
      def.rows = [[market.cal_date1, market.cal_event1], [market.cal_date2, market.cal_event2]];
      def.tags = `#${stockName} #일정 #이벤트`;
    } else if (type === 'volume') {
      def.lead = ['거래대금 순위', market.vol_rank1];
      def.rows = [['1', market.vol_rank1], ['2', market.vol_rank2], ['3', market.vol_rank3]];
      def.tags = `#${stockName} #거래대금 #순위`;
    } else if (type === 'vote') {
      def.lead = [`상승 ${market.vote_up}`, `하락 ${market.vote_down}`];
      def.rows = [['현재', `상승 전망 ${market.vote_up}`], ['当前', `하락 전망 ${market.vote_down}`]];
      def.rows[1][0] = '현재';
      def.tags = `#${stockName} #투표`;
    }
    return def;
  }

  function panelHTML(def) {
    const rows = def.rows.map(row => `
      <div class="widget-timeline-row">
        <span class="widget-time">${escapeHTML(row[0])}</span>
        <span class="widget-event">${escapeHTML(row[1])}</span>
      </div>`).join('');
    const lead0 = escapeHTML(def.lead[0]).replace(/([+-]\d+(?:\.\d+)?%)/g, '<span class="widget-up">$1</span>');
    return `
      <div class="widget-lead">
        <div class="widget-lead-line">${lead0}</div>
        <div class="widget-lead-line">${escapeHTML(def.lead[1])}</div>
      </div>
      <div class="widget-timeline">${rows}</div>
      <div class="widget-tagline">${escapeHTML(def.tags)}</div>`;
  }

  function ensureTabs(widget) {
    let tabs = widget.querySelector('.widget-tabs');
    let panels = widget.querySelector('.widget-tab-panels');
    if (tabs && panels) return { tabs, panels };

    const def = getDefinition(widget.dataset.widgetType, widget.dataset.stock || '삼성전자');
    const body = widget.querySelector('.strategy-widget-body');
    const title = widget.querySelector('.strategy-widget-title');
    if (!def || !body || !title) return {};

    tabs = document.createElement('div');
    tabs.className = 'widget-tabs';
    tabs.innerHTML = `<button type="button" class="widget-tab active" data-widget-tab="${escapeHTML(widget.dataset.widgetType)}"><span class="widget-tab-label">${escapeHTML(def.title)}</span><span class="widget-tab-close" data-tab-close aria-label="삭제">×</span></button>`;

    panels = document.createElement('div');
    panels.className = 'widget-tab-panels';
    const first = document.createElement('div');
    first.className = 'widget-tab-panel active';
    first.dataset.widgetType = widget.dataset.widgetType;
    first.innerHTML = body.innerHTML;
    panels.appendChild(first);

    body.replaceWith(panels);
    title.replaceWith(tabs);
    wireTabButtons(widget);
    return { tabs, panels };
  }

  function wireTabButtons(widget) {
    const tabs = widget.querySelector('.widget-tabs');
    const panels = widget.querySelector('.widget-tab-panels');
    if (!tabs || !panels) return;
    tabs.querySelectorAll('.widget-tab').forEach(tab => {
      if (tab.dataset.wired) return;
      tab.dataset.wired = '1';
      tab.addEventListener('click', e => {
        if (e.target.closest('[data-tab-close]')) return;
        activateTab(widget, tab);
      });
      tab.querySelector('[data-tab-close]')?.addEventListener('click', e => {
        e.stopPropagation();
        removeTab(widget, tab.dataset.widgetTab);
      });
    });
  }

  function activateTab(widget, tab) {
    const type = tab.dataset.widgetTab;
    widget.querySelectorAll('.widget-tab').forEach(t => t.classList.toggle('active', t === tab));
    widget.querySelectorAll('.widget-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.widgetType === type));
  }

  function removeTab(widget, type) {
    const tabs = widget.querySelector('.widget-tabs');
    const panels = widget.querySelector('.widget-tab-panels');
    if (!tabs || !panels) return;
    const tab = tabs.querySelector(`.widget-tab[data-widget-tab="${CSS.escape(type)}"]`);
    const panel = panels.querySelector(`.widget-tab-panel[data-widget-type="${CSS.escape(type)}"]`);
    const count = tabs.querySelectorAll('.widget-tab').length;
    if (count <= 1) {
      widget.remove();
      return;
    }
    const wasActive = tab?.classList.contains('active');
    tab?.remove();
    panel?.remove();
    if (wasActive) activateTab(widget, tabs.querySelector('.widget-tab'));
  }

  function toggleWidgetPicker(widget) {
    let picker = widget.querySelector('.widget-picker');
    if (!picker) return;
    const isOpen = !picker.hidden;
    document.querySelectorAll('.widget-picker').forEach(p => p.hidden = true);
    if (isOpen) return;
    const current = new Set([...widget.querySelectorAll('.widget-tab')].map(t => t.dataset.widgetTab));
    if (!current.size) current.add(widget.dataset.widgetType);
    picker.innerHTML = Object.entries(definitions).map(([type, def]) => `
      <button type="button" class="widget-picker-item" data-picker-widget="${type}" ${current.has(type) ? 'disabled' : ''}>
        <span>${escapeHTML(def.title)}</span>
        <small>${current.has(type) ? '추가됨' : '추가'}</small>
      </button>`).join('');
    picker.hidden = false;
    picker.querySelectorAll('[data-picker-widget]').forEach(btn => btn.addEventListener('click', () => {
      addTabToWidget(widget, btn.dataset.pickerWidget);
      picker.hidden = true;
    }));
  }

  function addTabToWidget(widget, type) {
    const def = getDefinition(type, widget.dataset.stock || '삼성전자');
    if (!def) return;
    const { tabs, panels } = ensureTabs(widget);
    if (!tabs || !panels || tabs.querySelector(`[data-widget-tab="${CSS.escape(type)}"]`)) return;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'widget-tab';
    tab.dataset.widgetTab = type;
    tab.innerHTML = `<span class="widget-tab-label">${escapeHTML(def.title)}</span><span class="widget-tab-close" data-tab-close aria-label="삭제">×</span>`;

    const panel = document.createElement('div');
    panel.className = 'widget-tab-panel';
    panel.dataset.widgetType = type;
    panel.innerHTML = panelHTML(def);
    tabs.appendChild(tab);
    panels.appendChild(panel);
    wireTabButtons(widget);
    activateTab(widget, tab);
  }

  function getShareText(widget) {
    const title=widget.querySelector('.strategy-widget-title')?.textContent||'';
    const lead=widget.querySelector('.widget-lead')?.textContent||'';
    const rows=[...widget.querySelectorAll('.widget-timeline-row')].map(r =>
      `${r.querySelector('.widget-time')?.textContent}  ${r.querySelector('.widget-event')?.textContent}`).join('\n');
    const tags=widget.querySelector('.widget-tagline')?.textContent||'';
    return [title,'',lead,'',rows,'',tags].join('\n').replace(/\n{3,}/g,'\n\n');
  }

  function startDrag(e, widget) {
    e.preventDefault(); e.stopPropagation();
    widget.classList.add('is-dragging');
    const rect=widget.getBoundingClientRect();
    widget.style.position='fixed';
    widget.style.width=rect.width+'px';
    widget.style.height=rect.height+'px';
    widget.style.left=rect.left+'px';
    widget.style.top=rect.top+'px';
    widget.style.zIndex='200';
    const ox=e.clientX-rect.left, oy=e.clientY-rect.top;

    const move=ev=>{
      widget.style.left=(ev.clientX-ox)+'px';
      widget.style.top=(ev.clientY-oy)+'px';
    };
    const finish=()=>{
      widget.classList.remove('is-dragging');
      widget.style.position=''; widget.style.width=''; widget.style.height='';
      widget.style.left=''; widget.style.top=''; widget.style.zIndex='';
      document.removeEventListener('pointermove',move);
      document.removeEventListener('pointerup',finish);
    };
    document.addEventListener('pointermove',move);
    document.addEventListener('pointerup',finish,{once:true});
  }

  function startResize(e, widget) {
    e.preventDefault(); e.stopPropagation();
    const rect=widget.getBoundingClientRect();
    const startW=rect.width, startH=rect.height;
    const startX=e.clientX, startY=e.clientY;
    const move=ev=>{
      widget.style.width=Math.max(320,startW+ev.clientX-startX)+'px';
      widget.style.height=Math.max(280,startH+ev.clientY-startY)+'px';
    };
    const up=()=>{
      document.removeEventListener('pointermove',move);
      document.removeEventListener('pointerup',up);
    };
    document.addEventListener('pointermove',move);
    document.addEventListener('pointerup',up,{once:true});
  }

  return { create, renderInstalledForStock, add };
})();

