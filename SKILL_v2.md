---
name: ds-course-website
description: 蘇于瑄老師的「資料結構演算法」高中互動教學網站的完整開發 skill。當老師說「繼續做網站」、「修投影片」、「做下一個單元」、「更新頁面」、「修 bug」、「做 favicon」等任何和這個課程網站相關的任務時，都應該觸發這個 skill。包含網站架構、設計系統、投影片腳本、教育心理學設計原則的所有背景知識。
---

# DS課程互動教學網站 — 開發 Skill v2

## 專案身份

**老師**：蘇于瑄（sanasana0308）  
**課程**：高中資訊科技 — 資料結構演算法  
**網址**：https://sanasana0308.github.io/ds-algo/  
**本地路徑**：`G:\我的雲端硬碟\AILeran\GitHub\ds-algo`  
**GitHub**：https://github.com/sanasana0308/ds-algo

---

## 目前完成頁面

| 頁面 | 狀態 | 備註 |
|------|------|------|
| `index.html` | ✅ | 課程地圖，Tree 卡片已 available |
| `pages/why-learn.html` | ✅ | 序章 |
| `pages/array-linked.html` | ✅ | 單元一，含 P1–P4 |
| `pages/stack-queue.html` | ✅ | 單元二，含 P1–P4 |
| `pages/tree.html` | ✅ | 單元三，含進階程式碼+學習紀錄+圓角方形節點 |
| `shared/style.css` | ✅ | v3，16px 基礎字體，含 .adv-* 進階元件 |
| `shared/nav.js` | ✅ | 含 Tree 項目 |

---

## 檔案架構

```
ds-algo/
├── COWORK_CONTEXT.md       ← Cowork 工作脈絡文件
├── index.html
├── favicon_512.png         ← 疊疊怪 favicon
├── favicon.ico
├── pages/
│   ├── why-learn.html
│   ├── array-linked.html
│   ├── stack-queue.html
│   └── tree.html
└── shared/
    ├── style.css           ← 設計系統 v3
    ├── nav.js              ← BASE='/ds-algo'
    └── utils.js
```

---

## 設計系統（style.css v3）

```css
--bg: #0A0F1A; --surface: #111827; --surface2: #182030; --border: #1E2D45;
--text: #C8D0E0; --text-dim: #5A6580; --text-mid: #8A96AE;
--yellow: #F5C400; --green: #22C55E; --red: #EF4444;

/* 單元主題色（降飽和版）*/
--array-color: #38BDF8; --array-glow: rgba(56,189,248,0.12);
--linked-color: #FB923C; --linked-glow: rgba(251,146,60,0.12);
--stack-color: #A78BFA;  --stack-glow: rgba(167,139,250,0.12);
--queue-color: #34D399;  --queue-glow: rgba(52,211,153,0.12);
--tree-color: #34D399;   --tree-glow: rgba(52,211,153,0.12);
--adv-color: #818CF8;    --adv-glow: rgba(129,140,248,0.10); --adv-border: rgba(129,140,248,0.25);

--font-mono: 'JetBrains Mono', monospace;
--font-ui: 'Noto Sans TC', sans-serif;
--text-base: 16px; --text-sm: 14px; --text-xs: 12px;
--text-lg: 18px; --text-xl: 22px;
```

---

## 教育心理學設計原則（P1–P4）

| 代號 | 理論 | 實作 |
|------|------|------|
| P1 | 有益困難 Bjork (1994) | `.predict-box` 操作前預測 |
| P2 | 後設認知 Flavell (1979) | `.reflect-box` 三段差異化鼓勵文字 |
| P3 | 鷹架理論 Wood (1976) | `.onboard-overlay` 三步驟引導，點空白關閉 |
| P4 | 概念轉變 Posner (1982) | `.prior-banner` 開場選邊站 |

---

## tree.html 特有功能

- **推薦數列展開列**（`.seq-bar`）：三個預設數列，點擊展開顯示每個數字 chip
- **自訂批量輸入**：用逗號或空格分隔
- **SVG 動態高度**：`resizeSvgForTree()` 依樹深自動調整 viewBox
- **節點用圓角方形**（44×32 rect）：不再用 circle，確保兩位數不跑出去
- **走訪 stamp 編號**：走訪動畫時節點旁顯示 #1 #2...
- **術語 Level 顯示**：點「高度」術語時 SVG 疊加 Level 0/1/2 水平線
- **進階程式碼**（`.adv-section`）：Python BST 實作，按鈕在內容正上方
- **學習紀錄浮動面板**：右下角，含「我的紀錄 / 分享摘要 / 老師看板」三個 Tab
- **`countStepsToInsert(val)`**：計算插入步數不真正插入，給預測框用

---

## 進階元件（style.css § 24）

```html
<!-- 進階按鈕 -->
<button class="adv-toggle" id="adv-btn" onclick="toggleAdv()">
  <span class="adv-dot"></span> 展開進階程式碼
</button>

<!-- 進階內容區（預設隱藏）-->
<div class="adv-section" id="adv-xxx">
  <div class="adv-header">...</div>
  <div class="adv-body">
    <div class="code-block">程式碼...</div>
    <div class="adv-complexity-row">
      <span class="op-name">搜尋</span>
      <span class="big-o Ologn">O(log n)</span>
      <span class="reason">說明</span>
    </div>
  </div>
</div>
```

---

## 學習紀錄系統

```js
// 差異化鼓勵（每評分3種隨機）
const MOTIVATE = {
  1: ['還在霧中訊息...', ...],
  2: ['差一點訊息...', ...],
  3: ['完全掌握訊息...', ...]
};

// 記錄格式
learningLog.push({ topic, r, emoji, rCls, rText, time });
```

---

## 投影片製作規範

**工具**：pptxgenjs，腳本在 Claude 工作環境 `/home/claude/make_merged.mjs`  
**最新版本**：`merged_slides_v4.pptx`（35張）

```js
const C = {
  bg:"0A0F1A", surface:"111827", surface2:"182030",
  text:"C8D0E0", textDim:"5A6580",
  arr:"00D4E8", lnk:"F5622A", gold:"F5C400",
  stack:"A78BFA", queue:"34D399", border:"1E2D45",
};
const F = { head:"Trebuchet MS", body:"Calibri" };
```

---

## 新增教學單元流程

1. `nav.js` 的 `NAV_PAGES` 加一筆
2. `index.html` 把卡片 `coming` → `available`
3. 建立 `pages/xxx.html`（複製 `stack-queue.html`，改主題色）
4. 加入 P1–P4 設計
5. 加入進階模式區塊

---

## 常見 Bug

| Bug | 解法 |
|-----|------|
| JS 按鈕沒反應 | script 內真正換行符改成 `\\n` |
| Favicon 沒更新 | Ctrl+Shift+R |
| GitHub Desktop 找不到路徑 | 確認 G: 槽，用 Locate... 重新指定 |
| 節點文字跑出圓圈 | 改用 `<rect>` 44×32 圓角方形 |
| 不平衡樹超出畫面 | `resizeSvgForTree()` 動態調整 viewBox 高度 |
| 預測框無法按 | 用 `countStepsToInsert()` 不破壞樹 |

---

## 部署 Checklist

```
□ 存檔
□ GitHub Desktop → Commit to main → Push origin
□ 等 30 秒
□ Ctrl+Shift+R 強制重整
□ F12 → Console 確認無 JS 錯誤
```

---

## 吉祥物

疊疊怪（Stack Gang）：三隻藍色疊疊怪、三角尖耳、大紅嘴、圓眼睛。  
favicon 已有 6 版配色，目前使用 `favicon_512.png`。

---
*v2 更新：2026-05 — 加入 tree.html 完整規格、進階元件、學習紀錄系統*
