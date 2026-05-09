/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  shared/utils.js  —  工具函式 + MatchGame 引擎        ║
 * ║                                                      ║
 * ║  【包含什麼】                                         ║
 * ║  1. sleep()        — 動畫計時用                       ║
 * ║  2. highlight()    — 通用元素高亮工具                  ║
 * ║  3. MatchGame      — 可重用連連看遊戲引擎              ║
 * ║                                                      ║
 * ║  【如何在新頁面使用 MatchGame】                        ║
 * ║  ① 準備題目陣列（格式見下方說明）                      ║
 * ║  ② 準備對應的 drop zone HTML（格式見 array-linked.html）║
 * ║  ③ new MatchGame(scenarios, zones, containerId)      ║
 * ║  ④ 呼叫 .init() 啟動                                  ║
 * ╚══════════════════════════════════════════════════════╝
 */

/* ─────────────────────────────────────────────
   § 1. sleep — 動畫暫停工具
   用法：await sleep(400);  // 等 400ms
   ───────────────────────────────────────────── */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ─────────────────────────────────────────────
   § 2. highlightEl — 給元素加 class、等一下再移除
   用法：await highlightEl('my-id', 'highlight', 600);
   ───────────────────────────────────────────── */
async function highlightEl(id, className, duration = 600) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add(className);
  await sleep(duration);
  el.classList.remove(className);
}

/* ─────────────────────────────────────────────
   § 3. MatchGame — 連連看遊戲引擎
   ───────────────────────────────────────────── */

/**
 * 題目格式（scenarios 陣列）：
 * [
 *   {
 *     id:      's1',           // 唯一 ID（字串）
 *     emoji:   '🎵',           // 左側 icon
 *     title:   '音樂播放清單', // 標題
 *     hint:    '常常插入刪除', // 副標（提示）
 *     answer:  'linked',       // 正確答案（要對應 zone 的 key）
 *     explain: '因為...',      // 答對後說明
 *   },
 *   ...
 * ]
 *
 * Drop zone 格式（zones 陣列）：
 * [
 *   {
 *     key:      'array',        // 對應 answer 的值
 *     chipClass: 'arr-chip',   // 答對時 chip 的 CSS class
 *     matchedId: 'dz-array-matched',  // drop zone 裡放 chip 的容器 ID
 *   },
 *   ...
 * ]
 */
class MatchGame {
  /**
   * @param {Array}  scenarios     題目陣列
   * @param {Array}  zones         drop zone 設定陣列
   * @param {string} containerId   scenarios 清單容器的 DOM id
   */
  constructor(scenarios, zones, containerId = 'scenarios-list') {
    this.scenarios   = scenarios;
    this.zones       = zones;
    this.containerId = containerId;

    // 遊戲狀態
    this.selectedCard = null;
    this.score        = 0;
    this.streak       = 0;
    this.answered     = new Set();
    this.draggingId   = null;

    // 綁定 this（讓 event listener 裡的 this 正確）
    this._onCardClick   = this._onCardClick.bind(this);
    this._onDragOver    = this._onDragOver.bind(this);
    this._onDrop        = this._onDrop.bind(this);
    this._onZoneClick   = this._onZoneClick.bind(this);
  }

  /* 初始化 / 重置遊戲 */
  init() {
    // 重置狀態
    this.selectedCard = null;
    this.score        = 0;
    this.streak       = 0;
    this.answered     = new Set();
    this.draggingId   = null;

    // 清空 drop zones
    this.zones.forEach(z => {
      const el = document.getElementById(z.matchedId);
      if (el) el.innerHTML = '';
      // 綁定 zone 事件（重新綁，避免重複）
      const zoneEl = document.getElementById('drop-' + z.key);
      if (zoneEl) {
        zoneEl.ondragover = this._onDragOver;
        zoneEl.ondrop     = (e) => this._onDrop(e, z.key);
        zoneEl.onclick    = () => this._onZoneClick(z.key);
      }
    });

    // 隱藏回饋區
    const fb = document.getElementById('match-feedback');
    const complete = document.getElementById('match-complete');
    if (fb) fb.style.display = 'none';
    if (complete) complete.style.display = 'none';

    // 渲染題目（打亂順序）
    this._renderScenarios();
    this._updateScore();
  }

  /* 渲染題目卡片 */
  _renderScenarios() {
    const list = document.getElementById(this.containerId);
    if (!list) return;
    list.innerHTML = '';

    // 打亂順序
    const shuffled = [...this.scenarios].sort(() => Math.random() - 0.5);

    shuffled.forEach(sc => {
      const card = document.createElement('div');
      card.className  = 'scenario-card';
      card.id         = 'sc-' + sc.id;
      card.draggable  = true;
      card.dataset.id = sc.id;
      card.innerHTML  = `
        <span class="sc-emoji">${sc.emoji}</span>
        <div class="sc-body">
          <div class="sc-title">${sc.title}</div>
          <div class="sc-hint">${sc.hint}</div>
        </div>
        <span class="sc-check" id="check-${sc.id}"></span>
      `;
      card.addEventListener('click',     () => this._onCardClick(sc.id));
      card.addEventListener('dragstart', () => { this.draggingId = sc.id; card.classList.add('dragging'); });
      card.addEventListener('dragend',   () => card.classList.remove('dragging'));
      list.appendChild(card);
    });
  }

  /* 點選題目卡片 */
  _onCardClick(id) {
    if (this.answered.has(id)) return;
    const card = document.getElementById('sc-' + id);

    // 再點一次同一張：取消選取
    if (this.selectedCard === id) {
      card.classList.remove('selected');
      this.selectedCard = null;
      return;
    }

    // 選取新卡
    document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    this.selectedCard = id;
    this._showFeedback('', '');
  }

  /* 拖曳進入 zone */
  _onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }

  /* 放開拖曳 */
  _onDrop(e, zoneKey) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (this.draggingId) this._submitAnswer(this.draggingId, zoneKey);
    this.draggingId = null;
  }

  /* 點選 zone */
  _onZoneClick(zoneKey) {
    if (!this.selectedCard) return;
    this._submitAnswer(this.selectedCard, zoneKey);
  }

  /* 判斷答案 */
  _submitAnswer(id, zoneKey) {
    if (this.answered.has(id)) return;

    const sc   = this.scenarios.find(s => s.id === id);
    const card = document.getElementById('sc-' + id);
    card.classList.remove('selected');
    this.selectedCard = null;

    if (sc.answer === zoneKey) {
      // ── 答對 ──
      this.score++;
      this.streak++;
      this.answered.add(id);
      card.classList.add('correct');
      document.getElementById('check-' + id).textContent = '✅';

      // 在 zone 裡加 chip
      const zone     = this.zones.find(z => z.key === zoneKey);
      const chip     = document.createElement('div');
      chip.className = 'dz-chip ' + zone.chipClass;
      chip.textContent = sc.emoji + ' ' + sc.title;
      document.getElementById(zone.matchedId).appendChild(chip);

      this._showFeedback('correct', `✅ 正確！— ${sc.explain}`);
    } else {
      // ── 答錯 ──
      this.streak = 0;
      card.classList.add('wrong');
      setTimeout(() => card.classList.remove('wrong'), 500);

      const correctZone = this.zones.find(z => z.key === sc.answer);
      this._showFeedback('wrong', `❌ 再想想！這個情境適合 <b>${correctZone ? correctZone.label : sc.answer}</b>。提示：${sc.hint}`);
    }

    this._updateScore();

    // 全部答完
    if (this.answered.size === this.scenarios.length) {
      setTimeout(() => {
        const complete = document.getElementById('match-complete');
        const fb = document.getElementById('match-feedback');
        if (complete) complete.style.display = 'block';
        if (fb) fb.style.display = 'none';
      }, 800);
    }
  }

  /* 顯示回饋訊息 */
  _showFeedback(type, msg) {
    const fb = document.getElementById('match-feedback');
    if (!fb) return;
    if (!msg) { fb.style.display = 'none'; return; }
    fb.style.display = 'block';
    fb.className = 'match-feedback ' + (type === 'correct' ? 'correct-fb' : 'wrong-fb');
    fb.innerHTML = msg;
  }

  /* 更新分數顯示 */
  _updateScore() {
    const scoreEl  = document.getElementById('match-score');
    const streakEl = document.getElementById('match-streak');
    if (scoreEl)  scoreEl.textContent = `${this.score} / ${this.scenarios.length}`;
    if (streakEl) {
      streakEl.textContent = this.streak >= 3
        ? '🔥'.repeat(Math.min(this.streak, 5)) + ` 連對 ${this.streak}！`
        : '';
    }
  }
}
