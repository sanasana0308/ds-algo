# DS課程互動教學網站 — Cowork 工作脈絡

> 這份文件放在 ds-algo 根目錄，讓 Cowork 每次開啟時都能立刻了解這個專案是什麼。

---

## 我是誰

**姓名**：蘇于瑄老師  
**工作**：高中資訊科技教師  
**GitHub 帳號**：sanasana0308  
**網站網址**：https://sanasana0308.github.io/ds-algo/

---

## 這個資料夾是什麼

這是一個**高中資料結構演算法互動教學網站**的完整專案。  
學生可以在網頁上直接操作資料結構（插入、刪除、搜尋），看動畫、猜測、反思。  
所有頁面都用純靜態 HTML/CSS/JS，部署在 GitHub Pages。

---

## 目前完成的頁面

| 頁面 | 檔案 | 狀態 |
|------|------|------|
| 課程地圖首頁 | `index.html` | ✅ 完成 |
| 序章：為什麼要學？ | `pages/why-learn.html` | ✅ 完成 |
| 單元一：Array & Linked List | `pages/array-linked.html` | ✅ 完成 |
| 單元二：Stack & Queue | `pages/stack-queue.html` | ✅ 完成 |
| 單元三：Tree & BST | `pages/tree.html` | ✅ 完成（最新版，有進階程式碼+學習紀錄） |
| 單元四：排序演算法 | — | ⏳ 尚未開始 |

---

## 檔案架構

```
ds-algo/
├── COWORK_CONTEXT.md       ← 你現在在看的這份文件
├── index.html              ← 課程地圖首頁
├── favicon_512.png         ← favicon（疊疊怪吉祥物）
├── favicon.ico
├── pages/
│   ├── why-learn.html
│   ├── array-linked.html
│   ├── stack-queue.html
│   └── tree.html
└── shared/
    ├── style.css           ← 全站設計系統（v3，內文 16px）
    ├── nav.js              ← 導覽列（BASE='/ds-algo'）
    └── utils.js            ← MatchGame 引擎、sleep() 等工具函式
```

---

## 設計系統核心

```css
/* 背景層次 */
--bg: #0A0F1A          /* 最底層深藍黑 */
--surface: #111827     /* 卡片背景 */
--surface2: #182030    /* 二級背景 */
--border: #1E2D45

/* 文字 */
--text: #C8D0E0
--text-dim: #5A6580
--text-mid: #8A96AE

/* 語意色（只在回饋時出現）*/
--yellow: #F5C400      /* 預測框/強調 */
--green: #22C55E       /* 成功 */
--red: #EF4444         /* 錯誤 */

/* 各單元主題色（降飽和版）*/
--array-color: #38BDF8    /* Array 冰藍 */
--linked-color: #FB923C   /* Linked List 暖橘 */
--stack-color: #A78BFA    /* Stack 薰衣草紫 */
--queue-color: #34D399    /* Queue 薄荷綠 */
--tree-color: #34D399     /* Tree 薄荷綠 */
--adv-color: #818CF8      /* 進階內容 靛紫 */

/* 字型 */
--font-mono: 'JetBrains Mono', monospace
--font-ui: 'Noto Sans TC', sans-serif

/* 字體大小（v3 全面放大）*/
--text-xs: 12px
--text-sm: 14px
--text-base: 16px   ← 全站基礎內文
--text-lg: 18px
--text-xl: 22px
```

---

## 教育心理學設計原則（每頁都要有）

| 代號 | 理論 | 實作方式 |
|------|------|---------|
| **P1** | 有益困難（Bjork 1994）| 操作前預測框，猜對/錯立即對比回饋 |
| **P2** | 後設認知（Flavell 1979）| Tab 底部反思問答 + 3段差異化鼓勵文字 |
| **P3** | 鷹架理論（Wood et al 1976）| Onboarding 三步驟引導，點旁邊空白可關閉 |
| **P4** | 概念轉變（Posner et al 1982）| 開場選邊站 + 連連看後前後對比 |

---

## 學習流程標準（每個單元 Tab 順序）

```
P4 開場選邊站（30秒）
↓
P3 Onboarding 三步驟
↓
Tab① 互動操作（P1 預測框 → 動畫 → 立即回饋）
↓
Tab② 效能比較
↓
Tab③ 生活應用 / 術語圖解
↓
Tab④ 連連看挑戰
↓
每個 Tab 底部 P2 反思自評（差異化鼓勵）
↓
右下角學習紀錄浮動面板（我的紀錄 / 分享摘要 / 老師看板）
```

---

## 新增單元的標準流程

### 1. 更新 nav.js
在 `NAV_PAGES` 陣列加一行：
```js
{ id: 'tree', label: 'Tree & BST', icon: '🌳', href: BASE + '/pages/tree.html' },
```

### 2. 更新 index.html
把對應卡片從 `class="coming"` 改成 `class="available"`，`<div>` 改成 `<a href="pages/xxx.html">`

### 3. 建立頁面
複製 `pages/stack-queue.html`，改主題色和內容，加入 P1–P4 設計

---

## 進階學習者功能

每個單元都有「進階模式」按鈕（靛紫色，`.adv-toggle`），展開後顯示：
- Python/JavaScript 程式碼實作
- 時間複雜度分析（O(1) / O(log n) / O(n)）
- 進階挑戰題（可隱藏的提示）

---

## 常見 Bug 快速解法

| Bug | 原因 | 解法 |
|-----|------|------|
| JS 按鈕完全沒反應 | script 裡有真正換行符 | 改成 `\\n` 跳脫字元 |
| Favicon 沒更新 | 瀏覽器快取 | Ctrl+Shift+R |
| GitHub Desktop 找不到資料夾 | Google Drive 未掛載 | 確認 G: 槽可見，用 Locate... 重新指定路徑 |
| 圓圈裡文字跑出 | SVG circle r 太小 | 改用 rect（44×32 圓角方形）|

---

## 部署 Checklist

```
□ 修改檔案存檔
□ GitHub Desktop → 確認變動 → 填 Summary → Commit to main
□ Push origin
□ 等 30 秒
□ 瀏覽器 Ctrl+Shift+R 強制重整
□ 開 DevTools Console 確認沒有 JS 錯誤（F12 → Console）
```

---

## 吉祥物

**疊疊怪（Stack Gang）**：三隻藍色疊疊怪、三角尖耳、大紅嘴、圓眼睛。  
Favicon 已有 6 種配色版本，目前使用 `favicon_512.png`。

---

*最後更新：2026-05 / 由 Claude 與蘇于瑄老師共同維護*
