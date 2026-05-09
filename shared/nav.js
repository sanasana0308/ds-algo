/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  shared/nav.js  —  全站導覽列                        ║
 * ║                                                      ║
 * ║  【如何擴充】                                         ║
 * ║  新增頁面時，只要在下方 NAV_PAGES 陣列加一筆即可。    ║
 * ║  不需要去每個頁面的 HTML 手動加連結。                 ║
 * ╚══════════════════════════════════════════════════════╝
 */

/**
 * 課程頁面清單
 * 【擴充位置】— 新增單元時，在這個陣列加一個物件
 *
 * 欄位說明：
 *   id    : 唯一識別碼（用來比對目前在哪一頁）
 *   label : 顯示在導覽列的文字
 *   icon  : emoji 圖示
 *   href  : 連結路徑（相對於 pages/ 資料夾）
 *
 * 範例（未來加 Stack/Queue 時）：
 *   { id: 'stack-queue', label: 'Stack & Queue', icon: '📦', href: 'stack-queue.html' },
 */
// ── 設定你的 GitHub Pages 根路徑 ──────────────────
// 【重要】如果換 repo 名稱，只需修改這一行
const BASE = '/ds-algo';

const NAV_PAGES = [
  { id: 'home',         label: '課程地圖',      icon: '🗺️', href: BASE + '/index.html' },
  { id: 'why-learn',    label: '為什麼要學？',  icon: '💡', href: BASE + '/pages/why-learn.html' },
  { id: 'array-linked', label: 'Array & Linked', icon: '📋', href: BASE + '/pages/array-linked.html' },
  // ↓ 新增單元時，在這裡加一行，格式一樣
  // { id: 'stack-queue', label: 'Stack & Queue', icon: '📦', href: BASE + '/pages/stack-queue.html' },
  // { id: 'tree',        label: 'Tree',           icon: '🌲', href: BASE + '/pages/tree.html' },
];

/**
 * 判斷目前在哪一頁
 * 從 URL 路徑的最後一段檔名來比對
 */
function getCurrentPageId() {
  const filename = window.location.pathname.split('/').pop();
  // index.html 或根路徑 → 首頁
  if (filename === '' || filename === 'index.html') return 'home';
  // 去掉 .html 後比對 id
  const base = filename.replace('.html', '');
  const found = NAV_PAGES.find(p => p.href.includes(base));
  return found ? found.id : '';
}

/**
 * 建立並插入導覽列
 * 自動在 <body> 最前面插入 <nav class="site-nav">
 */
function initNav() {
  const currentId = getCurrentPageId();

  const nav = document.createElement('nav');
  nav.className = 'site-nav';

  // Logo
  const logo = document.createElement('a');
  logo.className = 'nav-logo';
  logo.href      = '../index.html';
  logo.textContent = '◈ DS課程';
  nav.appendChild(logo);

  // 連結列
  const links = document.createElement('div');
  links.className = 'nav-links';

  NAV_PAGES.forEach(page => {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href      = page.href;

    // 標記目前頁面
    if (page.id === currentId) a.classList.add('active');

    // 進度點
    const dot = document.createElement('span');
    dot.className = 'nav-dot';
    a.appendChild(dot);

    // 文字
    const text = document.createTextNode(`${page.icon} ${page.label}`);
    a.appendChild(text);

    links.appendChild(a);
  });

  nav.appendChild(links);

  // 插入到 body 最前面
  document.body.insertBefore(nav, document.body.firstChild);
}

// 頁面載入後自動執行
document.addEventListener('DOMContentLoaded', initNav);
