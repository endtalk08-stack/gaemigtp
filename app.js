// ==========================================
// 1. 데이터 창고 (이 부분만 수정하면 됩니다!)
// ==========================================
const stockData = {
  "삼성전자": {
    time: "30초",
    title: "삼성전자 오늘 신났네 ㅎㅎ",
    time1: "08:00", text1: "프리마켓 +1.5% 상승 출발",
    time2: "09:15", text2: "거래대금 4.2배 폭발",
    currentPrice: "259,500원", change: "+3.2%",
    news1: "📰 HBM 공급 확대 뉴스",
    news2: "📌 외국인 100만 주 순매수"
  },
  "SK하이닉스": {
    time: "20초",
    title: "엔비디아 실적 발표 대기 중!",
    time1: "08:30", text1: "장전 동시호가 강세",
    time2: "09:00", text2: "외국인 매수세 유입",
    currentPrice: "205,000원", change: "+2.1%",
    news1: "📰 AI 반도체 수요 급증 뉴스",
    news2: "📌 기관 집중 매수"
  }
};

// ==========================================
// 2. 화면 및 기능 코드 (여기부터는 건드리지 않아도 됩니다)
// ==========================================

/* ============ 테마 ============ */
const themeToggle = document.getElementById('themeToggle');
const themeKnob = document.getElementById('themeKnob');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeKnob.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('theme') || 'dark');

/* ============ 사이드바 ============ */
const Sidebar = (() => {
  const sidebar = document.getElementById('sidebar');
  const STORAGE = 'sidebar-expanded';
  if (localStorage.getItem(STORAGE) === 'true' && window.innerWidth > 768) {
    sidebar.classList.add('expanded');
  }
  function toggle() {
    if (window.innerWidth <= 768) {
      if (document.body.classList.contains('sidebar-mobile-open')) {
        document.body.classList.remove('sidebar-mobile-open');
      } else {
        document.body.classList.add('sidebar-mobile-open');
      }
      return;
    }
    sidebar.classList.toggle('expanded');
    localStorage.setItem(STORAGE, sidebar.classList.contains('expanded'));
  }
  function openMobile() { document.body.classList.add('sidebar-mobile-open'); }
  function closeMobile() { document.body.classList.remove('sidebar-mobile-open'); }
  return { toggle, openMobile, closeMobile };
})();

/* ============ 홈으로 ============ */
function goHome() {
  newChat();
}

/* ============ gaemi 팝업 ============ */
let currentMode = 'gaemi';

function togglePopup(e, where) {
  e.stopPropagation();
  if (where === 'main') {
    const popup = document.getElementById('gaemiPopup');
    const btn = document.getElementById('gaemiBtn');
    document.getElementById('inputPopup').classList.remove('open');
    document.getElementById('inputGaemiBtn').classList.remove('open');
    popup.classList.toggle('open');
    btn.classList.toggle('open');
  } else {
    const popup = document.getElementById('inputPopup');
    const btn = document.getElementById('inputGaemiBtn');
    document.getElementById('gaemiPopup').classList.remove('open');
    document.getElementById('gaemiBtn').classList.remove('open');
    popup.classList.toggle('open');
    btn.classList.toggle('open');
  }
}

function selectMode(mode, where) {
  currentMode = mode;
  document.getElementById('gaemiBtnText').textContent = mode;
  document.getElementById('inputGaemiBtnText').textContent = mode;
  ['gaemi', 'info', 'pro'].forEach(m => {
    document.getElementById('check-' + m + '-main').style.visibility = (m === mode) ? 'visible' : 'hidden';
    document.getElementById('check-' + m + '-input').style.visibility = (m === mode) ? 'visible' : 'hidden';
  });
  document.getElementById('gaemiPopup').classList.remove('open');
  document.getElementById('gaemiBtn').classList.remove('open');
  document.getElementById('inputPopup').classList.remove('open');
  document.getElementById('inputGaemiBtn').classList.remove('open');
}

document.addEventListener('click', (e) => {
  const mainPopup = document.getElementById('gaemiPopup');
  const mainBtn = document.getElementById('gaemiBtn');
  const inputPopup = document.getElementById('inputPopup');
  const inputBtn = document.getElementById('inputGaemiBtn');
  if (mainPopup && !mainPopup.contains(e.target) && !mainBtn.contains(e.target)) {
    mainPopup.classList.remove('open');
    mainBtn.classList.remove('open');
  }
  if (inputPopup && !inputPopup.contains(e.target) && !inputBtn.contains(e.target)) {
    inputPopup.classList.remove('open');
    inputBtn.classList.remove('open');
  }
});

/* ============ 채팅 ============ */
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatContent = document.getElementById('chatContent');
const welcome = document.getElementById('welcome');
const chatContainer = document.getElementById('chatContainer');
let isStreaming = false;

input.addEventListener('input', () => {
  sendBtn.disabled = input.value.trim() === '' || isStreaming;
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 200) + 'px';
});
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

function mainSearchGo() {
  const v = document.getElementById('mainSearch').value.trim();
  if (!v) return;
  quickSearch(v);
}
document.getElementById('mainSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); mainSearchGo(); }
});

function quickSearch(name) {
  input.value = name + ' 왜 빨간불일까?';
  input.dispatchEvent(new Event('input'));
  sendMessage();
}

function newChat() {
  chatContent.innerHTML = '';
  chatContent.appendChild(welcome);
  welcome.style.display = 'flex';
  document.body.classList.add('welcome-mode');
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;
  isStreaming = false;
  Panel.close();
  Sidebar.closeMobile();
}

function addMessage(role, content, isHTML = false) {
  const msg = document.createElement('div');
  if (role === 'user') {
    msg.className = 'message user-msg-row';
    const displayWord = content.replace(' 왜 빨간불일까?', '').trim();
    const pill = document.createElement('div');
    pill.className = 'user-pill';
    pill.textContent = displayWord;
    msg.appendChild(pill);
    chatContent.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
    chatContainer.scrollTop = chatContainer.scrollHeight;
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

// ==== 데이터 창고와 연동되도록 수정된 부분 ====
function getDemoResponse(userText) {
  const t = userText.toLowerCase();

  // 기존 데모 기능 유지 (큰손, 일정, 거래대금 검색)
  if (t.includes('큰손')) {
    return `
      <div class="section" id="section-big">
        <div class="section-header">
          <div class="section-title">큰손들은 뭐하고 있어? <span class="section-time">· 20초</span></div>
        </div>
        <div class="stock-name-sub">삼성전자</div>
        <div class="bar-chart">
          <div class="bar-row">
            <div class="bar-label">외국인</div>
            <div class="bar-track"><div class="bar-zero"></div><div class="bar-fill-right" style="width:40%;"></div></div>
            <div class="bar-value buy">+48만</div>
          </div>
          <div class="bar-row">
            <div class="bar-label">기관</div>
            <div class="bar-track"><div class="bar-zero"></div><div class="bar-fill-right" style="width:18%;"></div></div>
            <div class="bar-value buy">+21만</div>
          </div>
          <div class="bar-row">
            <div class="bar-label">개인</div>
            <div class="bar-track"><div class="bar-zero"></div><div class="bar-fill-left" style="width:58%;"></div></div>
            <div class="bar-value sell">-69만</div>
          </div>
        </div>
        <div class="cal-note">외놈들이랑 기관 아찌들은 쌍끌이로 담고 있어.<br>우리 개미는 반대로 팔고 있고</div>
        ${sectionFooter('section-big')}
      </div>
    `;
  }
  if (t.includes('일정') || t.includes('캘린더')) {
    return `
      <div class="section" id="section-cal">
        <div class="section-header">
          <div class="section-title">📅 다가오는 일정 <span class="section-time">· 15초</span></div>
        </div>
        <div class="calendar-list">
          <div class="cal-row"><span class="cal-date">🔥 09/17(목)</span><span class="cal-event">미국 FOMC 기준금리 결정 <span class="cal-time">03:00</span></span></div>
        </div>
        ${sectionFooter('section-cal')}
      </div>
    `;
  }
  if (t.includes('거래대금')) {
    return `
      <div class="section" id="section-vol">
        <div class="section-header"><div class="section-title">거래대금 폭발</div></div>
        <div class="report-line"><span class="report-time">1</span><span class="report-text"><strong>삼성전자</strong> · 4.2배</span></div>
        ${sectionFooter('section-vol')}
      </div>
    `;
  }

  // 사용자가 입력한 종목(삼성전자, SK하이닉스) 판별
  let stockName = "";
  if (t.includes('삼성') || t.includes('삼전')) stockName = "삼성전자";
  else if (t.includes('하이닉스')) stockName = "SK하이닉스";

  // 데이터 창고에서 종목 데이터 꺼내오기
  const data = stockData[stockName];

  // 창고에 종목 데이터가 있다면, 껍데기에 입혀서 보여주기
  if (data) {
    return `
      <div class="section" id="section-why">
        <div class="section-header">
          <div class="section-title">${stockName} 왜 빨간불일까? <span class="section-time">· ${data.time}</span></div>
        </div>
        <div class="cal-note">${data.title}<br></div>
        <div class="report-line"><span class="report-time">${data.time1}</span><span class="report-text">${data.text1}</span></div>
        <div class="report-line"><span class="report-time">${data.time2}</span><span class="report-text">${data.text2}</span></div>
        
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
    `;
  }

  // 창고에 없는 내용물을 검색했을 때 나오는 화면
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

function voteWidget() {
  return `
    <div class="section" id="section-vote">
      <div class="section-header">
        <div class="section-title">내일 어디로 튈까?</div>
      </div>
      <div class="vote-wrap">
        <div class="vote-stats">
          <span class="up-color">상승 68%</span>
          <span class="down-color">하락 32%</span>
        </div>
        <div class="vote-bar">
          <div class="vote-bar-up" id="voteUp" style="width:68%;"></div>
          <div class="vote-bar-down" id="voteDown" style="width:32%;"></div>
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

let voted = false;
function castVote(type) {
  if (voted) return;
  voted = true;
  const up = document.getElementById('voteUp');
  const down = document.getElementById('voteDown');
  if (type === 'up') { up.style.width = '74%'; down.style.width = '26%'; }
  else { up.style.width = '61%'; down.style.width = '39%'; }
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || isStreaming) return;

  document.body.classList.remove('welcome-mode');

  if (welcome.parentNode === chatContent) welcome.style.display = 'none';

  addMessage('user', text);
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;
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
  chatContent.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const fullResponse = getDemoResponse(text);
  await sleep(400);
  body.innerHTML = fullResponse + voteWidget();
  body.style.opacity = '0';
  body.style.transition = 'opacity 0.3s';
  await sleep(50);
  body.style.opacity = '1';

  isStreaming = false;
  sendBtn.disabled = input.value.trim() === '';
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const Panel = (() => {
  const STORAGE_WIDTH = 'panel-width';
  const panel = document.getElementById('panel');
  const grip = document.getElementById('panelGrip');

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
    Panel.close();
    document.getElementById('gaemiPopup').classList.remove('open');
    document.getElementById('gaemiBtn').classList.remove('open');
    document.getElementById('inputPopup').classList.remove('open');
    document.getElementById('inputGaemiBtn').classList.remove('open');
  }
});
