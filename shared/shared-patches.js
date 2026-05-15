/**
 * shared-patches.js
 * 複製此檔案內容，貼到 array-linked.html 和 stack-queue.html
 * 的 </body> 之前（在現有 <script> 區塊末尾加入）
 *
 * 功能：
 * 1. Onboarding 點空白關閉
 * 2. 反思差異化鼓勵文字（3評分 × 各3種隨機）
 * 3. 學習紀錄浮動面板（我的紀錄 / 分享摘要 / 老師看板）
 */

/* ══════════════════════════════════════
   1. Onboarding 點空白關閉
   把 onboard-overlay 加上 onclick
════════════════════════════════════ */
(function(){
  const overlay = document.getElementById('onboard-overlay');
  if(!overlay) return;
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) {
      // 呼叫各頁面現有的 onboardSkip()
      if(typeof onboardSkip === 'function') onboardSkip();
    }
  });
  // 同時讓 skip 文字更明顯
  const skipBtn = overlay.querySelector('.onboard-skip');
  if(skipBtn){
    skipBtn.textContent = '跳過 / 點旁邊空白也可關閉';
    skipBtn.style.fontSize = '13px';
    skipBtn.style.color = 'var(--text-mid)';
  }
})();

/* ══════════════════════════════════════
   2. 差異化鼓勵訊息系統
   覆寫 setRate() 函式（array-linked 用的名字）
   或補充 selectRate()（tree 頁用的名字）
════════════════════════════════════ */
const MOTIVATE_MSGS = {
  1: [
    '別擔心，遇到困難才代表在真正學習！回到操作區再試一次看看。',
    '還不懂沒關係——把最困惑的地方寫下來，問老師或同學！',
    '試著再操作一次動畫，帶著「為什麼」的問題去觀察。'
  ],
  2: [
    '你已經抓到核心了！再想一個生活中的例子來鞏固理解。',
    '差一點就全懂了——試著用自己的話再說一遍給自己聽！',
    '快到了！把那個不確定的地方寫下來，針對性地複習一次。'
  ],
  3: [
    '太棒了！完全掌握了這個概念，可以去挑戰進階題了 🚀',
    '完全掌握！試著教給同學聽——教別人是最強的記憶方式。',
    '出色的理解！你已經準備好進到下一個單元了 🎉'
  ]
};

function getMotivateMsg(r){
  const arr = MOTIVATE_MSGS[r] || MOTIVATE_MSGS[2];
  return arr[Math.floor(Math.random() * arr.length)];
}

/* 覆寫 array-linked 用的 setRate */
if(typeof setRate === 'function'){
  const _origSetRate = setRate;
  window.setRate = function(tab, r){
    _origSetRate(tab, r); // 先執行原本邏輯（更新按鈕樣式）
    const msg = getMotivateMsg(r);
    const doneEl = document.getElementById('reflect-done-' + tab);
    if(doneEl){
      doneEl.textContent = msg;
      doneEl.style.color = r===1 ? 'var(--red)' : r===2 ? 'var(--yellow)' : 'var(--green)';
      doneEl.style.display = 'block';
    }
    // 記錄到學習紀錄
    const tabNames = {
      playground: '插入操作差異',
      compare:    '效能比較',
      memory:     '記憶體示意',
      usecase:    '連連看挑戰'
    };
    learningRecord.push({
      topic: tabNames[tab] || tab,
      r, time: new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})
    });
    renderRecordPanel();
  };
}

/* ══════════════════════════════════════
   3. 學習紀錄浮動面板
════════════════════════════════════ */
const learningRecord = [];

// 注入 CSS
(function(){
  const style = document.createElement('style');
  style.textContent = `
  .rec-float-btn {
    position: fixed; bottom: 24px; right: 24px; z-index: 81;
    padding: 8px 16px; border-radius: 20px;
    background: var(--adv-glow, rgba(129,140,248,0.1));
    border: 1px solid var(--adv-border, rgba(129,140,248,0.25));
    color: var(--adv-color, #818cf8);
    cursor: pointer; font-size: 12px; font-family: var(--font-mono);
    letter-spacing: 1px; display: flex; align-items: center; gap: 6px;
    transition: all 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
  .rec-float-btn:hover { background: rgba(129,140,248,0.2); }
  .rec-float-btn .rdot { width:6px;height:6px;border-radius:50%;background:var(--adv-color,#818cf8); }
  .rec-panel {
    position: fixed; bottom: 24px; right: 24px; z-index: 80;
    width: 320px; background: var(--surface,#111827);
    border: 1px solid var(--adv-border,rgba(129,140,248,0.25));
    border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.45);
    overflow: hidden; transition: transform 0.3s;
  }
  .rec-panel.hidden { transform: translateY(calc(100% + 40px)); pointer-events:none; }
  .rec-tabbar { display:flex; border-bottom:1px solid var(--border,#1E2D45); }
  .rec-tab {
    flex:1; padding:9px 4px; font-size:11px; font-family:var(--font-mono);
    text-align:center; cursor:pointer; color:var(--text-dim,#5A6580);
    border:none; background:none; transition:all 0.2s; letter-spacing:0.5px;
  }
  .rec-tab.active { color:var(--adv-color,#818cf8); border-bottom:2px solid var(--adv-color,#818cf8); }
  .rec-body { padding:14px; max-height:260px; overflow-y:auto; }
  .rec-empty { font-size:12px; color:var(--text-dim,#5A6580); font-family:var(--font-mono); }
  .rec-row { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid var(--border,#1E2D45); font-size:12px; }
  .rec-row:last-child { border-bottom:none; }
  .rec-emoji { font-size:15px; flex-shrink:0; }
  .rec-label { flex:1; color:var(--text-mid,#8A96AE); }
  .rec-rating { font-weight:700; font-size:11px; font-family:var(--font-mono); }
  .rec-rating.r1{color:var(--red,#EF4444);} .rec-rating.r2{color:var(--yellow,#F5C400);} .rec-rating.r3{color:var(--green,#22C55E);}
  .rec-time { font-size:10px; color:var(--text-dim,#5A6580); flex-shrink:0; }
  .share-pre { background:var(--surface2,#182030); border-radius:8px; padding:12px; font-size:11px; font-family:var(--font-mono); color:var(--text-mid,#8A96AE); line-height:2; white-space:pre-wrap; margin-bottom:10px; }
  .share-copy-btn { width:100%; padding:8px; border-radius:8px; border:1px solid var(--adv-border,rgba(129,140,248,0.25)); background:var(--adv-glow,rgba(129,140,248,0.1)); color:var(--adv-color,#818cf8); cursor:pointer; font-size:12px; font-family:var(--font-mono); }
  .teacher-row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid var(--border,#1E2D45); font-size:12px; }
  .teacher-row:last-child { border-bottom:none; }
  `;
  document.head.appendChild(style);
})();

// 注入 HTML
(function(){
  const btn = document.createElement('button');
  btn.className = 'rec-float-btn'; btn.id = 'rec-float-btn';
  btn.innerHTML = '<span class="rdot"></span> 學習紀錄';
  btn.onclick = toggleRecPanel;
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'rec-panel hidden'; panel.id = 'rec-panel';
  panel.innerHTML = `
    <div class="rec-tabbar">
      <button class="rec-tab active" onclick="switchRecTab(this,'log')">📋 我的紀錄</button>
      <button class="rec-tab" onclick="switchRecTab(this,'share')">📤 分享摘要</button>
      <button class="rec-tab" onclick="switchRecTab(this,'teacher')">👩‍🏫 老師看板</button>
      <button style="padding:8px 12px;background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:14px;flex-shrink:0" onclick="toggleRecPanel()">✕</button>
    </div>
    <div class="rec-body">
      <div id="rec-pane-log"><div id="rec-list-items" class="rec-empty">完成反思後，紀錄會出現在這裡。</div></div>
      <div id="rec-pane-share" style="display:none"><div class="share-pre" id="rec-share-text">完成反思後產生摘要。</div><button class="share-copy-btn" onclick="copyRecShare()">📋 複製摘要</button></div>
      <div id="rec-pane-teacher" style="display:none"><p style="font-size:12px;color:var(--text-dim);margin-bottom:10px">學生各主題的自評狀況：</p><div id="rec-teacher-rows"></div></div>
    </div>`;
  document.body.appendChild(panel);
})();

let recPanelOpen = false;
function toggleRecPanel(){
  recPanelOpen = !recPanelOpen;
  document.getElementById('rec-panel').classList.toggle('hidden', !recPanelOpen);
  document.getElementById('rec-float-btn').style.display = recPanelOpen ? 'none' : 'flex';
}
function switchRecTab(btn, pane){
  document.querySelectorAll('.rec-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  ['log','share','teacher'].forEach(p=>document.getElementById('rec-pane-'+p).style.display=p===pane?'block':'none');
}
function renderRecordPanel(){
  const items = document.getElementById('rec-list-items');
  if(learningRecord.length===0){ items.innerHTML='<span class="rec-empty">完成反思後，紀錄會出現在這裡。</span>'; return; }
  const emoji = r => r===1?'😵':r===2?'🤔':'🎉';
  const rText = r => r===1?'還在霧中':r===2?'差一點懂':'完全掌握';
  const rCls  = r => r===1?'r1':r===2?'r2':'r3';
  items.innerHTML = learningRecord.map(l=>`
    <div class="rec-row">
      <span class="rec-emoji">${emoji(l.r)}</span>
      <span class="rec-label">${l.topic}</span>
      <span class="rec-rating ${rCls(l.r)}">${rText(l.r)}</span>
      <span class="rec-time">${l.time}</span>
    </div>`).join('');
  // 分享摘要
  const avg = Math.round(learningRecord.reduce((a,b)=>a+b.r,0)/learningRecord.length);
  const lines = learningRecord.map(l=>`${emoji(l.r)} ${l.topic}：${rText(l.r)}`).join('\n');
  document.getElementById('rec-share-text').textContent =
    `📚 學習摘要\n${new Date().toLocaleDateString('zh-TW')}\n${'─'.repeat(20)}\n${lines}\n${'─'.repeat(20)}\n整體自評：${'⭐'.repeat(avg)}（${avg}/3）`;
  // 老師看板
  document.getElementById('rec-teacher-rows').innerHTML = learningRecord.map(l=>`
    <div class="teacher-row"><span>${l.topic}</span><span class="rec-rating ${rCls(l.r)}">${emoji(l.r)} ${rText(l.r)}</span></div>`).join('');
}
function copyRecShare(){
  navigator.clipboard.writeText(document.getElementById('rec-share-text').textContent).then(()=>{
    const btn = document.querySelector('.share-copy-btn');
    btn.textContent='✅ 已複製！'; setTimeout(()=>btn.textContent='📋 複製摘要',2000);
  });
}
