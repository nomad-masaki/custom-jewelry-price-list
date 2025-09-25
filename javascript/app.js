/**
 * アクセサリー価格表アプリケーション
 * マスターデータは外部ファイルから読み込み
 */

// PRICE_TABLEは外部ファイル(price_table.js)から読み込み
const $ = (id) => document.getElementById(id);
const fmtJPY = (n) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);

// 個別石設定の状態管理
const individualStoneState = {
  // グループ設定の状態
  groupAT: false,
  groupAd: false,
  group16: false,
  
  // 個別石の設定
  stonesAT: {}, // A〜Tの石設定
  stonesAd: {}, // a〜dの石設定
  stones16: {}, // 1〜6の石設定
  
  // グループ石の設定
  groupStoneAT: '',
  groupStoneAd: '',
  groupStone16: ''
};

// ============================================================================
// ユーティリティ関数
// ============================================================================

function fillSelect(el, items) {
  el.innerHTML = `<option value="">選択してください</option>` + items.map(it => `<option value="${it.value}">${it.label}</option>`).join("");
}

function keyOf(b, k, c, s) { 
  return `${b}${k}${c}${s}`; 
}

// ============================================================================
// 個別石設定UI制御関数
// ============================================================================

// 個別石設定のUI生成
function createIndividualStoneControls() {
  // A〜Tの個別設定を生成
  const atGrid = document.querySelector('#individualControlAT .stone-grid');
  const atLetters = 'ABCDEFGHIJKLMNOPQRST'.split('');
  atGrid.innerHTML = atLetters.map(letter => `
    <div class="stone-item">
      <label>${letter}</label>
      <select id="stoneAT_${letter}" class="individual-stone-select">
        <option value="">選択してください</option>
        ${MASTER_STONES.individualStones.map(stone => `<option value="${stone.value}">${stone.label}</option>`).join('')}
      </select>
    </div>
  `).join('');

  // a〜dの個別設定を生成
  const adGrid = document.querySelector('#individualControlAd .stone-grid');
  const adLetters = 'abcd'.split('');
  adGrid.innerHTML = adLetters.map(letter => `
    <div class="stone-item">
      <label>${letter}</label>
      <select id="stoneAd_${letter}" class="individual-stone-select">
        <option value="">選択してください</option>
        ${MASTER_STONES.individualStones.map(stone => `<option value="${stone.value}">${stone.label}</option>`).join('')}
      </select>
    </div>
  `).join('');

  // 1〜6の個別設定を生成
  const numGrid = document.querySelector('#individualControl16 .stone-grid');
  const numbers = [1, 2, 3, 4, 5, 6];
  numGrid.innerHTML = numbers.map(num => `
    <div class="stone-item">
      <label>${num}</label>
      <select id="stone16_${num}" class="individual-stone-select">
        <option value="">選択してください</option>
        ${MASTER_STONES.individualStones.map(stone => `<option value="${stone.value}">${stone.label}</option>`).join('')}
      </select>
    </div>
  `).join('');
}

// グループ設定のトグル制御
function setupGroupToggles() {
  // A〜Tグループのトグル
  const toggleAT = $('groupToggleAT');
  toggleAT.addEventListener('change', (e) => {
    individualStoneState.groupAT = e.target.checked;
    updateGroupMode('AT', e.target.checked);
  });

  // a〜dグループのトグル
  const toggleAd = $('groupToggleAd');
  toggleAd.addEventListener('change', (e) => {
    individualStoneState.groupAd = e.target.checked;
    updateGroupMode('Ad', e.target.checked);
  });

  // 1〜6グループのトグル
  const toggle16 = $('groupToggle16');
  toggle16.addEventListener('change', (e) => {
    individualStoneState.group16 = e.target.checked;
    updateGroupMode('16', e.target.checked);
  });
}

// グループモードの更新
function updateGroupMode(group, isGroupMode) {
  const groupElement = document.querySelector(`#groupControl${group}`);
  const individualElement = document.querySelector(`#individualControl${group}`);
  const stoneGroup = groupElement.closest('.stone-group');

  if (isGroupMode) {
    stoneGroup.classList.add('group-mode');
    groupElement.style.display = 'block';
    individualElement.style.display = 'none';
  } else {
    stoneGroup.classList.remove('group-mode');
    groupElement.style.display = 'none';
    individualElement.style.display = 'block';
  }
}

// グループ石選択の制御
function setupGroupStoneSelects() {
  // グループ石選択の初期化
  fillSelect($('groupStoneAT'), MASTER_STONES.individualStones);
  fillSelect($('groupStoneAd'), MASTER_STONES.individualStones);
  fillSelect($('groupStone16'), MASTER_STONES.individualStones);

  // グループ石選択のイベントリスナー
  $('groupStoneAT').addEventListener('change', (e) => {
    individualStoneState.groupStoneAT = e.target.value;
    updateIndividualStones();
  });

  $('groupStoneAd').addEventListener('change', (e) => {
    individualStoneState.groupStoneAd = e.target.value;
    updateIndividualStones();
  });

  $('groupStone16').addEventListener('change', (e) => {
    individualStoneState.groupStone16 = e.target.value;
    updateIndividualStones();
  });
}

// 個別石選択のイベントリスナー設定
function setupIndividualStoneSelects() {
  // A〜Tの個別選択
  const atLetters = 'ABCDEFGHIJKLMNOPQRST'.split('');
  atLetters.forEach(letter => {
    const select = $(`stoneAT_${letter}`);
    if (select) {
      select.addEventListener('change', (e) => {
        individualStoneState.stonesAT[letter] = e.target.value;
        updateIndividualStones();
      });
    }
  });

  // a〜dの個別選択
  const adLetters = 'abcd'.split('');
  adLetters.forEach(letter => {
    const select = $(`stoneAd_${letter}`);
    if (select) {
      select.addEventListener('change', (e) => {
        individualStoneState.stonesAd[letter] = e.target.value;
        updateIndividualStones();
      });
    }
  });

  // 1〜6の個別選択
  const numbers = [1, 2, 3, 4, 5, 6];
  numbers.forEach(num => {
    const select = $(`stone16_${num}`);
    if (select) {
      select.addEventListener('change', (e) => {
        individualStoneState.stones16[num] = e.target.value;
        updateIndividualStones();
      });
    }
  });
}

// 個別石設定の更新
function updateIndividualStones() {
  // グループ設定が有効な場合、個別設定をグループ設定で上書き
  if (individualStoneState.groupAT && individualStoneState.groupStoneAT) {
    const atLetters = 'ABCDEFGHIJKLMNOPQRST'.split('');
    atLetters.forEach(letter => {
      const select = $(`stoneAT_${letter}`);
      if (select) {
        select.value = individualStoneState.groupStoneAT;
        individualStoneState.stonesAT[letter] = individualStoneState.groupStoneAT;
      }
    });
  }

  if (individualStoneState.groupAd && individualStoneState.groupStoneAd) {
    const adLetters = 'abcd'.split('');
    adLetters.forEach(letter => {
      const select = $(`stoneAd_${letter}`);
      if (select) {
        select.value = individualStoneState.groupStoneAd;
        individualStoneState.stonesAd[letter] = individualStoneState.groupStoneAd;
      }
    });
  }

  if (individualStoneState.group16 && individualStoneState.groupStone16) {
    const numbers = [1, 2, 3, 4, 5, 6];
    numbers.forEach(num => {
      const select = $(`stone16_${num}`);
      if (select) {
        select.value = individualStoneState.groupStone16;
        individualStoneState.stones16[num] = individualStoneState.groupStone16;
      }
    });
  }

  // 石の表示を更新
  updateStoneVisualization();
}

// 石の視覚化を更新
function updateStoneVisualization() {
  // 現在選択されている石の設定を取得
  const currentStones = {
    AT: {},
    Ad: {},
    '16': {}
  };

  // グループ設定が有効な場合
  if (individualStoneState.groupAT && individualStoneState.groupStoneAT) {
    const atLetters = 'ABCDEFGHIJKLMNOPQRST'.split('');
    atLetters.forEach(letter => {
      currentStones.AT[letter] = individualStoneState.groupStoneAT;
    });
  } else {
    // 個別設定
    currentStones.AT = individualStoneState.stonesAT;
  }

  if (individualStoneState.groupAd && individualStoneState.groupStoneAd) {
    const adLetters = 'abcd'.split('');
    adLetters.forEach(letter => {
      currentStones.Ad[letter] = individualStoneState.groupStoneAd;
    });
  } else {
    currentStones.Ad = individualStoneState.stonesAd;
  }

  if (individualStoneState.group16 && individualStoneState.groupStone16) {
    const num16 = '123456'.split('');
    num16.forEach(num => {
      currentStones['16'][num] = individualStoneState.groupStone16;
    });
  } else {
    currentStones['16'] = individualStoneState.stones16;
  }

  // A〜Tの石表示を更新
  const atLetters = 'ABCDEFGHIJKLMNOPQRST'.split('');
  atLetters.forEach(letter => {
    updateStoneDisplay(`stone_${letter}`, currentStones.AT[letter], letter);
  });

  // a〜dの石表示を更新
  const adLetters = 'abcd'.split('');
  adLetters.forEach(letter => {
    updateStoneDisplay(`stone_${letter}`, currentStones.Ad[letter], letter);
  });

  // 1〜6の石表示を更新
  const num16 = '123456'.split('');
  num16.forEach(num => {
    updateStoneDisplay(`stone_${num}`, currentStones['16'][num], num);
  });
}

// 個別の石表示を更新（各箇所ごとの個別画像対応）
function updateStoneDisplay(stoneId, stoneType, position) {
  const stoneElement = $(stoneId);
  if (!stoneElement) return;

  if (stoneType && STONE_TYPES[stoneType]) {
    const stoneData = STONE_TYPES[stoneType];
    
    // 石の種類と位置を設定
    stoneElement.setAttribute('data-stone', stoneType);
    stoneElement.setAttribute('data-position', position);
    
    // 該当箇所の石画像パスを取得
    const positionImages = STONE_POSITION_IMAGES[position];
    if (positionImages && positionImages[stoneType]) {
      const imagePath = positionImages[stoneType];
      
      let img = stoneElement.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        stoneElement.innerHTML = '';
        stoneElement.appendChild(img);
      }
      
      img.src = imagePath;
      img.alt = stoneData.label;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      
      img.onerror = function() {
        // 画像が読み込めない場合は色で表示
        this.style.display = 'none';
        stoneElement.style.backgroundColor = stoneData.color;
        stoneElement.innerHTML = '';
      };
      
      img.onload = function() {
        // 画像が読み込めた場合は背景色をクリア
        stoneElement.style.backgroundColor = '';
      };
    } else {
      // 画像パスが見つからない場合、色で表示
      stoneElement.innerHTML = '';
      stoneElement.style.backgroundColor = stoneData.color;
    }
    
    // 石が見えるように表示
    stoneElement.style.opacity = '1';
    stoneElement.style.visibility = 'visible';
  } else {
    // 石が選択されていない場合はデフォルト表示
    stoneElement.removeAttribute('data-stone');
    stoneElement.removeAttribute('data-position');
    stoneElement.innerHTML = '';
    stoneElement.style.backgroundColor = '#ddd';
    stoneElement.style.borderColor = '#bbb';
    stoneElement.style.opacity = '0.5';
  }
}

// 石のプレースホルダーにクリックイベントを追加
function setupStonePlaceholderEvents() {
  // 全ての石プレースホルダーにイベントリスナーを追加
  const stonePlaceholders = document.querySelectorAll('.stone-placeholder');
  stonePlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', function() {
      const position = this.getAttribute('data-position');
      if (position) {
        // 対応するセレクトボックスをハイライト
        highlightCorrespondingSelect(position);
      }
    });
  });
}

// 対応するセレクトボックスをハイライト
function highlightCorrespondingSelect(position) {
  // まず全てのハイライトを解除
  document.querySelectorAll('.individual-stone-select').forEach(select => {
    select.style.border = '';
    select.style.boxShadow = '';
  });

  // 対応するセレクトボックスを特定
  let selectId = '';
  if (position.match(/^[A-T]$/)) {
    selectId = `stoneAT_${position}`;
  } else if (position.match(/^[a-d]$/)) {
    selectId = `stoneAd_${position}`;
  } else if (position.match(/^[1-6]$/)) {
    selectId = `stone16_${position}`;
  }

  const select = $(selectId);
  if (select) {
    select.style.border = '2px solid #007bff';
    select.style.boxShadow = '0 0 8px rgba(0, 123, 255, 0.3)';
    
    // スクロールして見えるようにする
    select.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 3秒後にハイライトを解除
    setTimeout(() => {
      select.style.border = '';
      select.style.boxShadow = '';
    }, 3000);
  }
}

// ============================================================================
// メイン機能関数
// ============================================================================

function updateBadges(b, k, c, s) {
  const wrap = $("badges");
  wrap.innerHTML = "";

  const findLabel = (items, value) => {
    const f = items.find(it => it.value === value);
    return f ? f.label : value;
  };

  if (b) wrap.insertAdjacentHTML("beforeend", `<span class="badge">本体:${findLabel(MASTER_MATERIALS.bodies, b)}</span>`);
  if (k) wrap.insertAdjacentHTML("beforeend", `<span class="badge">バチカン:${findLabel(MASTER_MATERIALS.bails, k)}</span>`);
  if (c) wrap.insertAdjacentHTML("beforeend", `<span class="badge">チェーン:${findLabel(MASTER_MATERIALS.chains, c)}</span>`);
  if (s) wrap.insertAdjacentHTML("beforeend", `<span class="badge">石:${findLabel(MASTER_MATERIALS.stones, s)}</span>`);
}

// CZ選択時の個別石設定制限
function checkCZRestriction(stoneType) {
  const individualStoneSection = $('individualStoneSection');
  
  if (stoneType === 'A') {
    // CZが選択された場合は個別石設定を無効化
    individualStoneSection.style.display = 'none';
    // 個別石設定をリセット
    resetIndividualStoneSettings();
  } else {
    // CZ以外が選択された場合は個別石設定を有効化
    individualStoneSection.style.display = 'block';
  }
}

// 個別石設定のリセット
function resetIndividualStoneSettings() {
  // 状態をリセット
  individualStoneState.groupAT = false;
  individualStoneState.groupAd = false;
  individualStoneState.group16 = false;
  individualStoneState.stonesAT = {};
  individualStoneState.stonesAd = {};
  individualStoneState.stones16 = {};
  individualStoneState.groupStoneAT = '';
  individualStoneState.groupStoneAd = '';
  individualStoneState.groupStone16 = '';

  // UIをリセット
  $('groupToggleAT').checked = false;
  $('groupToggleAd').checked = false;
  $('groupToggle16').checked = false;
  $('groupStoneAT').value = '';
  $('groupStoneAd').value = '';
  $('groupStone16').value = '';

  // グループモードをリセット
  updateGroupMode('AT', false);
  updateGroupMode('Ad', false);
  updateGroupMode('16', false);

  // 個別石選択をリセット
  const individualSelects = document.querySelectorAll('.individual-stone-select');
  individualSelects.forEach(select => {
    select.value = '';
  });
}

function update() {
  const b = $("bodySel").value;
  const k = $("bailSel").value;
  const c = $("chainSel").value;
  const s = $("stoneSel").value;

  updateBadges(b,k,c,s);
  
  // CZ選択時の制限チェック
  checkCZRestriction(s);

  const priceEl = $("priceText");
  const skuEl = $("skuText");
  const taxEl = $("taxText");

  if (!b || !k || !c || !s) {
    priceEl.textContent = "パーツを選択すると金額が表示されます";
    if (skuEl) skuEl.textContent = "-";
    if (taxEl) taxEl.textContent = "-";
    return;
  }

  const rec = PRICE_TABLE[keyOf(b,k,c,s)];
  if (!rec) {
    priceEl.textContent = "価格未登録";
    if (skuEl) skuEl.textContent = "-";
    if (taxEl) taxEl.textContent = "-";
    return;
  }

  priceEl.textContent = fmtJPY(rec.price);
  if (skuEl) skuEl.textContent = rec.sku || keyOf(b,k,c,s);
  if (taxEl) taxEl.textContent = "-";
}

function init() {
  fillSelect($("bodySel"), MASTER_MATERIALS.bodies);
  fillSelect($("bailSel"), MASTER_MATERIALS.bails);
  fillSelect($("chainSel"), MASTER_MATERIALS.chains);
  fillSelect($("stoneSel"), MASTER_MATERIALS.stones);

  ["bodySel","bailSel","chainSel","stoneSel"].forEach(id => {
    $(id).addEventListener("change", update);
  });

  // 個別石設定の初期化
  createIndividualStoneControls();
  setupGroupToggles();
  setupGroupStoneSelects();
  setupIndividualStoneSelects();
  setupStonePlaceholderEvents();

  // 初期表示を更新
  updateStoneVisualization();
  update();
}

document.addEventListener("DOMContentLoaded", init);
