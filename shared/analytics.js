/**
 * ds-algo 學習行為追蹤
 * GA4 評估 ID: G-5RR3445H9D
 *
 * 追蹤的事件：
 *   page_view        — 自動（GA4 內建）
 *   tab_switch       — 學生切換分頁
 *   reflect_submit   — 學生送出反思
 *   reflect_rated    — 學生自評理解程度
 *   quiz_answer      — 學生作答測驗
 *   quiz_complete    — 學生完成整份測驗
 *   sort_start       — 學生啟動排序動畫
 *   sort_step        — 學生單步執行排序
 *   node_insert      — 學生插入節點
 *   node_delete      — 學生刪除節點
 *   term_click       — 學生點擊術語卡片
 *   session_summary  — 離開前記錄本次停留摘要
 */

// ── GA4 載入 ──────────────────────────────────────────
(function loadGA4() {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5RR3445H9D';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-5RR3445H9D', {
    page_title: document.title,
    page_location: location.href,
    // 不收集個人資料
    anonymize_ip: true,
  });
})();


// ── 學習行為追蹤 ──────────────────────────────────────
const DS = {

  // 目前頁面名稱（從 <title> 取）
  page: document.title.replace(' — DS課程', '').trim(),

  // 本次 session 的行為紀錄（離開前一起送出）
  session: {
    tabsSeen:      new Set(),
    reflectsDone:  0,
    quizAnswered:  0,
    interactions:  0,
    startTime:     Date.now(),
  },

  // ── 送出事件 ──
  send(eventName, params = {}) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, {
      page_name: this.page,
      ...params,
    });
    this.session.interactions++;
  },

  // ── Tab 切換 ──
  trackTab(tabName) {
    this.session.tabsSeen.add(tabName);
    this.send('tab_switch', {
      tab_name:   tabName,
      tabs_total: this.session.tabsSeen.size,
    });
  },

  // ── 反思送出 ──
  trackReflect(tabName, charCount) {
    this.session.reflectsDone++;
    this.send('reflect_submit', {
      tab_name:   tabName,
      char_count: charCount,           // 寫了多少字
      total_done: this.session.reflectsDone,
    });
  },

  // ── 自評理解程度 ──
  trackRate(tabName, rating) {
    const labels = { 1: '不太懂', 2: '大概理解', 3: '完全清楚' };
    this.send('reflect_rated', {
      tab_name:    tabName,
      rating:      rating,
      rating_text: labels[rating] || rating,
    });
  },

  // ── 測驗作答 ──
  trackQuizAnswer(questionIndex, isCorrect) {
    this.session.quizAnswered++;
    this.send('quiz_answer', {
      question_index: questionIndex + 1,
      is_correct:     isCorrect,
      answered_count: this.session.quizAnswered,
    });
  },

  // ── 測驗完成 ──
  trackQuizComplete(score, total) {
    this.send('quiz_complete', {
      score:      score,
      total:      total,
      percentage: Math.round(score / total * 100),
    });
  },

  // ── 排序動畫啟動 ──
  trackSortStart(algorithm) {
    this.send('sort_start', { algorithm });
  },

  // ── 排序單步執行 ──
  trackSortStep(algorithm) {
    this.send('sort_step', { algorithm });
  },

  // ── 節點操作（Array / LL）──
  trackNodeOp(structure, operation) {
    // structure: 'array' | 'linked_list'
    // operation: 'insert' | 'delete' | 'access'
    this.send('node_operation', { structure, operation });
  },

  // ── 術語點擊 ──
  trackTerm(termKey) {
    this.send('term_click', { term: termKey });
  },

  // ── 離開前送出 session 摘要 ──
  sendSessionSummary() {
    const duration = Math.round((Date.now() - this.session.startTime) / 1000);
    this.send('session_summary', {
      duration_seconds: duration,
      tabs_seen:        [...this.session.tabsSeen].join(','),
      tabs_count:       this.session.tabsSeen.size,
      reflects_done:    this.session.reflectsDone,
      quiz_answered:    this.session.quizAnswered,
      interactions:     this.session.interactions,
    });
  },
};

// 離開頁面前送出摘要
window.addEventListener('beforeunload', () => DS.sendSessionSummary());
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') DS.sendSessionSummary();
});

// 掛到全域，讓各頁面的 JS 可以呼叫
window.DS = DS;
