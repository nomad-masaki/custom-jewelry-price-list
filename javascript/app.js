/**
 * アクセサリー価格表アプリケーション
 * マスターデータは外部ファイルから読み込み
 */

// ============================================================================
// 定数とユーティリティ関数
// ============================================================================

// PRICE_TABLEは外部ファイル(price_table.js)から読み込み
const $ = (id) => document.getElementById(id);
const fmtJPY = (n) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);

// 定数
const CONSTANTS = {
  STONE_LETTERS: {
    AT: 'ABCDEFGHIJKLMNOPQRST'.split(''),
    Ad: 'abcd'.split(''),
    '16': [1, 2, 3, 4, 5, 6]
  },
  LAYER_Z_INDEX_BASE: 1000,
  MODAL_STONE_GROUPS: ['AT', 'Ad', '16']
};

// ユーティリティ関数
const Utils = {
  // 深いコピーを作成
  deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
  
  // 要素が存在するかチェック
  exists: (element) => element !== null && element !== undefined,
  
  // 空のオブジェクトかチェック
  isEmpty: (obj) => Object.keys(obj).length === 0,
  
  // 配列を空にする
  clearArray: (arr) => arr.length = 0,
  
  // オブジェクトを空にする
  clearObject: (obj) => Object.keys(obj).forEach(key => delete obj[key])
};


// ============================================================================
// 石選択管理クラス
// ============================================================================

class StoneManager {
  constructor() {
    this.state = {
      groupAT: false,
      groupAd: false,
      group16: false,
      stonesAT: {},
      stonesAd: {},
      stones16: {},
      groupStoneAT: '',
      groupStoneAd: '',
      groupStone16: ''
    };
    this.modalOriginalState = null;
  }

  // 石選択をクリア
  clearStoneSettings() {
    Utils.clearObject(this.state.stonesAT);
    Utils.clearObject(this.state.stonesAd);
    Utils.clearObject(this.state.stones16);
    this.state.groupAT = false;
    this.state.groupAd = false;
    this.state.group16 = false;
    this.state.groupStoneAT = '';
    this.state.groupStoneAd = '';
    this.state.groupStone16 = '';
  }

  // モーダル表示前の状態を保存
  saveModalOriginalState() {
    this.modalOriginalState = Utils.deepClone(this.state);
  }

  // モーダル表示前の状態に復元
  restoreModalOriginalState() {
    if (this.modalOriginalState) {
      Object.assign(this.state, this.modalOriginalState);
    }
  }

  // 石選択の状態を取得
  getStoneSelections() {
    return {
      body: $("bodySel")?.value || '',
      chain: $("chainSel")?.value || '',
      bail: $("bailSel")?.value || '',
      stone: $("stoneSel")?.value || '',
      stonesAT: this.state.stonesAT,
      stonesAd: this.state.stonesAd,
      stones16: this.state.stones16
    };
  }
}

// 石選択管理のインスタンス
const stoneManager = new StoneManager();

// ============================================================================
// ユーティリティ関数
// ============================================================================

function fillSelect(el, items) {
  el.innerHTML = `<option value="">選択してください</option>` + items.map(it => `<option value="${it.value}">${it.label}</option>`).join("");
}

// レイヤー画像を作成する共通関数
function createLayerImage(layer, index) {
  const img = document.createElement('img');
  img.src = layer.image;
  img.alt = 'アクセサリーレイヤー';
  img.className = 'layer-image';
  img.style.position = 'absolute';
  img.style.top = '0';
  img.style.left = '0';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  // レイヤー番号が小さいほど前面に表示（z-indexを逆順にする）
  img.style.zIndex = CONSTANTS.LAYER_Z_INDEX_BASE - layer.layer;
  
  // 石の画像の場合は透過度を調整（背景画像は不透明）
  if (layer.layer === 4) { // layer-4は石類
    img.style.opacity = '0.8'; // 少し透過させる
  } else {
    img.style.opacity = '1.0'; // 完全に不透明
  }
  
  // 画像読み込みエラーの処理
  img.onerror = function() {
    this.style.display = 'none';
  };
  
  return img;
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
    stoneManager.state.groupAT = e.target.checked;
    updateGroupMode('AT', e.target.checked);
  });

  // a〜dグループのトグル
  const toggleAd = $('groupToggleAd');
  toggleAd.addEventListener('change', (e) => {
    stoneManager.state.groupAd = e.target.checked;
    updateGroupMode('Ad', e.target.checked);
  });

  // 1〜6グループのトグル
  const toggle16 = $('groupToggle16');
  toggle16.addEventListener('change', (e) => {
    stoneManager.state.group16 = e.target.checked;
    updateGroupMode('16', e.target.checked);
  });
}

// グループモードの更新
function updateGroupMode(group, isGroupMode) {
  const groupElement = document.querySelector(`#groupControl${group}`);
  const individualElement = document.querySelector(`#individualControl${group}`);
  if (!groupElement) return;
  
  // タイトル要素を探す（新しい構造に対応）
  let titleElement = null;
  if (group === 'AT') {
    titleElement = document.querySelector('.stone-selection-content h4:first-child');
  } else if (group === 'Ad') {
    titleElement = document.querySelector('.stone-selection-content h4:nth-child(2)');
  } else if (group === '16') {
    titleElement = document.querySelector('.stone-selection-content h4:last-child');
  }

  if (isGroupMode) {
    groupElement.style.display = 'block';
    if (individualElement) {
    individualElement.style.display = 'none';
    }
    
    // グループモード時のタイトルを設定
    if (titleElement) {
      const groupTitles = {
        'AT': 'たてがみグループ',
        'Ad': '目＆牙グループ',
        '16': 'バチカングループ'
      };
      titleElement.setAttribute('data-group-title', groupTitles[group] || titleElement.textContent);
    }
  } else {
    groupElement.style.display = 'none';
    if (individualElement) {
    individualElement.style.display = 'block';
  }
    
    // 個別モード時はタイトルを元に戻す
    if (titleElement) {
      titleElement.removeAttribute('data-group-title');
    }
  }
  
  // レイヤー表示を更新
  updateLayers();
}

// グループ石選択の制御
function setupGroupStoneSelects() {
  // グループ石選択の初期化
  fillSelect($('groupStoneAT'), MASTER_STONES.individualStones);
  fillSelect($('groupStoneAd'), MASTER_STONES.individualStones);
  fillSelect($('groupStone16'), MASTER_STONES.individualStones);

  // グループ石選択のイベントリスナー
  $('groupStoneAT').addEventListener('change', (e) => {
    stoneManager.state.groupStoneAT = e.target.value;
    updateIndividualStones();
    updateLayers(); // レイヤー表示を即座に更新
  });

  $('groupStoneAd').addEventListener('change', (e) => {
    stoneManager.state.groupStoneAd = e.target.value;
    updateIndividualStones();
    updateLayers(); // レイヤー表示を即座に更新
  });

  $('groupStone16').addEventListener('change', (e) => {
    console.log('バチカングループ石選択が変更されました:', e.target.value);
    stoneManager.state.groupStone16 = e.target.value;
    updateIndividualStones();
    updateLayers(); // レイヤー表示を即座に更新
  });
}

// 個別石選択のイベントリスナー設定
function setupIndividualStoneSelects() {
  // A〜Tの個別選択
  CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
    const select = $(`stoneAT_${letter}`);
    if (select) {
      select.addEventListener('change', (e) => {
        stoneManager.state.stonesAT[letter] = e.target.value;
        updateIndividualStones();
        updateLayers(); // レイヤー表示を即座に更新
      });
    }
  });

  // a〜dの個別選択
  CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
    const select = $(`stoneAd_${letter}`);
    if (select) {
      select.addEventListener('change', (e) => {
        stoneManager.state.stonesAd[letter] = e.target.value;
        updateIndividualStones();
        updateLayers(); // レイヤー表示を即座に更新
      });
    }
  });

  // 1〜6の個別選択
  CONSTANTS.STONE_LETTERS['16'].forEach(num => {
    const select = $(`stone16_${num}`);
    if (select) {
      select.addEventListener('change', (e) => {
        console.log(`バチカン個別石${num}選択が変更されました:`, e.target.value);
        stoneManager.state.stones16[num] = e.target.value;
        updateIndividualStones();
        updateLayers(); // レイヤー表示を即座に更新
      });
    }
  });
}

// 石選択フォームの表示制御
function updateStoneFormVisibility() {
  const mainStoneValue = $('stoneSel') ? $('stoneSel').value : '';
  const stoneForm = document.querySelector('.stone-selection-component');
  const stoneModalBtn = document.getElementById('stoneModalBtn');
  
  if (stoneForm) {
    // デフォルトは非表示
    stoneForm.style.display = 'none';
  }
  
  if (stoneModalBtn) {
    // CZ + 天然石（B）または天然石（C）が選択されている場合はボタンを表示
    if (mainStoneValue === 'B' || mainStoneValue === 'C') {
      stoneModalBtn.style.display = 'block';
    } else {
      stoneModalBtn.style.display = 'none';
    }
  }
}

// ストーン設定モーダルを表示
function showStoneModal() {
  const modal = document.getElementById('stoneModal');
  if (modal) {
    // 現在の石選択状態を保存
    stoneManager.saveModalOriginalState();
    
    // 現在の設定をモーダルにコピー
    copySettingsToModal();
    
    // モーダルを表示
    modal.style.display = 'flex';
    
    // モーダル内の石選択を初期化
    initializeModalStoneSettings();
  }
}

// ストーン設定モーダルを非表示
function hideStoneModal() {
  const modal = document.getElementById('stoneModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// 現在の設定をモーダルにコピー
function copySettingsToModal() {
  // 現在の選択状態を取得
  const currentSelections = {
    body: $("bodySel") ? $("bodySel").value : '',
    chain: $("chainSel") ? $("chainSel").value : '',
    bail: $("bailSel") ? $("bailSel").value : '',
    stone: $("stoneSel") ? $("stoneSel").value : ''
  };
  
  // モーダルのプレビューを更新
  updateModalPreview(currentSelections);
}

// モーダルのプレビューを更新
function updateModalPreview(selections) {
  const modalAccessoryLayers = document.getElementById('modalAccessoryLayers');
  const modalBadges = document.getElementById('modalBadges');
  
  if (modalAccessoryLayers) {
    // レイヤー画像を更新
    updateModalLayers(selections);
  }
  
  if (modalBadges) {
    // バッジを更新
    updateModalBadges(selections);
  }
}

// モーダルのレイヤーを更新
function updateModalLayers(selections) {
  const container = document.getElementById('modalAccessoryLayers');
  if (!container) return;
  
  // 現在の選択状態に基づいてレイヤーを取得
  const activeLayers = getActiveLayers({
    body: selections.body,
    chain: selections.chain,
    bail: selections.bail,
    stonesAT: selections.stonesAT || {},
    stonesAd: selections.stonesAd || {},
    stones16: selections.stones16 || {}
  });
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // レイヤー画像を追加（レイヤー番号の小さい順にソート）
  activeLayers.sort((a, b) => a.layer - b.layer).forEach((layer, index) => {
    const img = this.createLayerImage(layer, index);
    container.appendChild(img);
  });
}

// モーダルのバッジを更新
function updateModalBadges(selections) {
  const modalBadges = document.getElementById('modalBadges');
  if (!modalBadges) return;
  
  modalBadges.innerHTML = '';
  
  // 選択されたパーツのバッジを表示
  if (selections.body) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `本体: ${selections.body}`;
    modalBadges.appendChild(badge);
  }
  
  if (selections.chain) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `チェーン: ${selections.chain}`;
    modalBadges.appendChild(badge);
  }
  
  if (selections.bail) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `バチカン: ${selections.bail}`;
    modalBadges.appendChild(badge);
  }
  
  // 選択された石のバッジを表示
  const selectedStones = [];
  
  // A〜Tの石選択
  Object.keys(selections.stonesAT || {}).forEach(letter => {
    if (selections.stonesAT[letter]) {
      selectedStones.push(`${letter}:${selections.stonesAT[letter]}`);
    }
  });
  
  // a〜dの石選択
  Object.keys(selections.stonesAd || {}).forEach(letter => {
    if (selections.stonesAd[letter]) {
      selectedStones.push(`${letter}:${selections.stonesAd[letter]}`);
    }
  });
  
  // 1〜6の石選択
  Object.keys(selections.stones16 || {}).forEach(num => {
    if (selections.stones16[num]) {
      selectedStones.push(`${num}:${selections.stones16[num]}`);
    }
  });
  
  // 石選択のバッジを表示（最大5個まで）
  selectedStones.slice(0, 5).forEach(stone => {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = stone;
    modalBadges.appendChild(badge);
  });
  
  // 5個を超える場合は「...」を表示
  if (selectedStones.length > 5) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `+${selectedStones.length - 5}個`;
    modalBadges.appendChild(badge);
  }
}

// モーダル内の石選択を初期化
function initializeModalStoneSettings() {
  const mainStoneValue = $('stoneSel') ? $('stoneSel').value : '';
  
  // モーダル内の個別石選択要素を動的に生成
  generateModalStoneElements();
  
  // モーダル内のグループ設定を初期化
  setupModalGroupToggles();
  setupModalGroupStoneSelects();
  setupModalIndividualStoneSelects();
  
  // 選択肢を更新
  updateModalStoneSelectOptions(mainStoneValue);
  
  // 現在の設定をモーダルに反映
  copyCurrentSettingsToModal();
}

// モーダル内の個別石選択要素を動的に生成
function generateModalStoneElements() {
  // A〜Tの個別選択を生成
  const maneGrid = document.querySelector('#modalIndividualControlAT .stone-grid');
  if (maneGrid) {
    maneGrid.innerHTML = '';
    CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
      const stoneItem = document.createElement('div');
      stoneItem.className = 'stone-item';
      
      const label = document.createElement('label');
      label.textContent = letter;
      
      const select = document.createElement('select');
      select.id = `modalStoneAT_${letter}`;
      
      stoneItem.appendChild(label);
      stoneItem.appendChild(select);
      maneGrid.appendChild(stoneItem);
    });
  }
  
  // a〜dの個別選択を生成
  const eyeToothGrid = document.querySelector('#modalIndividualControlAd .stone-grid');
  if (eyeToothGrid) {
    eyeToothGrid.innerHTML = '';
    CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
      const stoneItem = document.createElement('div');
      stoneItem.className = 'stone-item';
      
      const label = document.createElement('label');
      label.textContent = letter;
      
      const select = document.createElement('select');
      select.id = `modalStoneAd_${letter}`;
      
      stoneItem.appendChild(label);
      stoneItem.appendChild(select);
      eyeToothGrid.appendChild(stoneItem);
    });
  }
  
  // 1〜6の個別選択を生成
  const vaticanGrid = document.querySelector('#modalIndividualControl16 .stone-grid');
  if (vaticanGrid) {
    vaticanGrid.innerHTML = '';
    CONSTANTS.STONE_LETTERS['16'].forEach(num => {
      const stoneItem = document.createElement('div');
      stoneItem.className = 'stone-item';
      
      const label = document.createElement('label');
      label.textContent = num;
      
      const select = document.createElement('select');
      select.id = `modalStone16_${num}`;
      
      stoneItem.appendChild(label);
      stoneItem.appendChild(select);
      vaticanGrid.appendChild(stoneItem);
    });
  }
}

// モーダル内のグループ設定を初期化
function setupModalGroupToggles() {
  const toggles = [
    { id: 'modalGroupToggleAT', group: 'AT' },
    { id: 'modalGroupToggleAd', group: 'Ad' },
    { id: 'modalGroupToggle16', group: '16' }
  ];
  
  toggles.forEach(({ id, group }) => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.addEventListener('change', (e) => {
        updateModalGroupMode(group, e.target.checked);
      });
    }
  });
}

// モーダル内のグループ石選択を初期化
function setupModalGroupStoneSelects() {
  const groupSelects = [
    { id: 'modalGroupStoneAT', group: 'AT' },
    { id: 'modalGroupStoneAd', group: 'Ad' },
    { id: 'modalGroupStone16', group: '16' }
  ];
  
  groupSelects.forEach(({ id, group }) => {
    const select = document.getElementById(id);
    if (select) {
      select.addEventListener('change', (e) => {
        // モーダル内の個別石選択を更新
        updateModalIndividualStones(group, e.target.value);
      });
    }
  });
}

// モーダル内の個別石選択を初期化
function setupModalIndividualStoneSelects() {
  // A〜Tの個別選択
  'ABCDEFGHIJKLMNOPQRST'.split('').forEach(letter => {
    const select = document.getElementById(`modalStoneAT_${letter}`);
    if (select) {
      select.addEventListener('change', (e) => {
        // モーダル内のプレビューを更新
        updateModalPreviewFromStones();
      });
    }
  });
  
  // a〜dの個別選択
  'abcd'.split('').forEach(letter => {
    const select = document.getElementById(`modalStoneAd_${letter}`);
    if (select) {
      select.addEventListener('change', (e) => {
        updateModalPreviewFromStones();
      });
    }
  });
  
  // 1〜6の個別選択
  [1,2,3,4,5,6].forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select) {
      select.addEventListener('change', (e) => {
        updateModalPreviewFromStones();
      });
    }
  });
}

// モーダル内の石選択オプションを更新
function updateModalStoneSelectOptions(mainStoneValue) {
  // すべてのモーダル内の石選択を取得
  const allModalStoneSelects = [
    // A〜Tの個別選択
    ...'ABCDEFGHIJKLMNOPQRST'.split('').map(letter => ({
      element: document.getElementById(`modalStoneAT_${letter}`),
      type: 'AT',
      position: letter
    })),
    // a〜dの個別選択
    ...'abcd'.split('').map(letter => ({
      element: document.getElementById(`modalStoneAd_${letter}`),
      type: 'Ad', 
      position: letter
    })),
    // 1〜6の個別選択
    ...[1,2,3,4,5,6].map(num => ({
      element: document.getElementById(`modalStone16_${num}`),
      type: '16',
      position: num
    }))
  ];
  
  // グループ設定のセレクトボックス
  const groupSelects = [
    { element: document.getElementById('modalGroupStoneAT'), type: 'groupAT' },
    { element: document.getElementById('modalGroupStoneAd'), type: 'groupAd' },
    { element: document.getElementById('modalGroupStone16'), type: 'group16' }
  ];
  
  // CZ以外（天然石 + CZ または 天然石）が選択されている場合
  if (mainStoneValue && mainStoneValue !== 'A') {
    // 個別石選択の更新
    allModalStoneSelects.forEach(({element, type, position}) => {
      if (element) {
        // オプションをクリア
        element.innerHTML = '';
        
        // プレースホルダーを追加
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '選択してください';
        element.appendChild(placeholderOption);
        
        // メインストーン選択に応じて選択肢を追加
        if (mainStoneValue === 'B') {
          // 天然石 + CZ選択時はすべての石を表示
          MASTER_STONES.individualStones.forEach(stone => {
            const option = document.createElement('option');
            option.value = stone.value;
            option.textContent = stone.label;
            element.appendChild(option);
          });
        } else if (mainStoneValue === 'C') {
          // 天然石選択時は天然石のみ（CZ以外）
          MASTER_STONES.individualStones.forEach(stone => {
            if (stone.value !== 'CZ') {
              const option = document.createElement('option');
              option.value = stone.value;
              option.textContent = stone.label;
              element.appendChild(option);
            }
          });
        }
      }
    });
    
    // グループ設定の更新
    groupSelects.forEach(({element, type}) => {
      if (element) {
        element.innerHTML = '<option value="">選択してください</option>';
        
        if (mainStoneValue === 'B') {
          MASTER_STONES.individualStones.forEach(stone => {
            const option = document.createElement('option');
            option.value = stone.value;
            option.textContent = stone.label;
            element.appendChild(option);
          });
        } else if (mainStoneValue === 'C') {
          MASTER_STONES.individualStones.forEach(stone => {
            if (stone.value !== 'CZ') {
              const option = document.createElement('option');
              option.value = stone.value;
              option.textContent = stone.label;
              element.appendChild(option);
            }
          });
        }
      }
    });
  }
}

// 現在の設定をモーダルにコピー
function copyCurrentSettingsToModal() {
  // 現在の個別石設定をモーダルにコピー
  Object.keys(stoneManager.state.stonesAT || {}).forEach(letter => {
    const select = document.getElementById(`modalStoneAT_${letter}`);
    if (select) {
      select.value = stoneManager.state.stonesAT[letter] || '';
    }
  });
  
  Object.keys(stoneManager.state.stonesAd || {}).forEach(letter => {
    const select = document.getElementById(`modalStoneAd_${letter}`);
    if (select) {
      select.value = stoneManager.state.stonesAd[letter] || '';
    }
  });
  
  Object.keys(stoneManager.state.stones16 || {}).forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select) {
      select.value = stoneManager.state.stones16[num] || '';
    }
  });
  
  // グループ設定をデフォルトでオフに設定
  const groupToggles = [
    { id: 'modalGroupToggleAT', state: false },
    { id: 'modalGroupToggleAd', state: false },
    { id: 'modalGroupToggle16', state: false }
  ];
  
  groupToggles.forEach(({ id, state }) => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.checked = state;
      // グループモードを更新
      const group = id.replace('modalGroupToggle', '');
      updateModalGroupMode(group, state);
    }
  });
  
  const groupSelects = [
    { id: 'modalGroupStoneAT', value: '' },
    { id: 'modalGroupStoneAd', value: '' },
    { id: 'modalGroupStone16', value: '' }
  ];
  
  groupSelects.forEach(({ id, value }) => {
    const select = document.getElementById(id);
    if (select) {
      select.value = value;
    }
  });
}

// モーダル内のグループモードを更新
function updateModalGroupMode(group, isGroupMode) {
  const groupElement = document.getElementById(`modalGroupControl${group}`);
  const individualElement = document.getElementById(`modalIndividualControl${group}`);
  
  if (!groupElement || !individualElement) return;
  
  if (isGroupMode) {
    groupElement.style.display = 'block';
    individualElement.style.display = 'none';
  } else {
    groupElement.style.display = 'none';
    individualElement.style.display = 'block';
  }
  
  // プレビューを更新
  updateModalPreviewFromStones();
}

// モーダル内の個別石選択を更新
function updateModalIndividualStones(group, value) {
  // グループ選択に応じて個別選択を更新
  if (group === 'AT') {
    'ABCDEFGHIJKLMNOPQRST'.split('').forEach(letter => {
      const select = document.getElementById(`modalStoneAT_${letter}`);
      if (select) {
        select.value = value;
      }
    });
  } else if (group === 'Ad') {
    'abcd'.split('').forEach(letter => {
      const select = document.getElementById(`modalStoneAd_${letter}`);
      if (select) {
        select.value = value;
      }
    });
  } else if (group === '16') {
    [1,2,3,4,5,6].forEach(num => {
      const select = document.getElementById(`modalStone16_${num}`);
      if (select) {
        select.value = value;
      }
    });
  }
  
  // プレビューを更新
  updateModalPreviewFromStones();
}

// モーダル内の石選択からプレビューを更新
function updateModalPreviewFromStones() {
  // モーダル内の石選択を取得
  const modalStones = {
    stonesAT: {},
    stonesAd: {},
    stones16: {}
  };
  
  // A〜Tの個別選択
  'ABCDEFGHIJKLMNOPQRST'.split('').forEach(letter => {
    const select = document.getElementById(`modalStoneAT_${letter}`);
    if (select) {
      modalStones.stonesAT[letter] = select.value;
    }
  });
  
  // a〜dの個別選択
  'abcd'.split('').forEach(letter => {
    const select = document.getElementById(`modalStoneAd_${letter}`);
    if (select) {
      modalStones.stonesAd[letter] = select.value;
    }
  });
  
  // 1〜6の個別選択
  [1,2,3,4,5,6].forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select) {
      modalStones.stones16[num] = select.value;
    }
  });
  
  // 現在の選択状態を取得
  const currentSelections = {
    body: $("bodySel") ? $("bodySel").value : '',
    chain: $("chainSel") ? $("chainSel").value : '',
    bail: $("bailSel") ? $("bailSel").value : '',
    stone: $("stoneSel") ? $("stoneSel").value : ''
  };
  
  // モーダルのレイヤーを更新
  updateModalLayers({
    ...currentSelections,
    ...modalStones
  });
  
  // モーダルのバッジも更新
  updateModalBadges({
    ...currentSelections,
    ...modalStones
  });
}

// 個別石選択のセレクトボックスを更新する関数
function updateStoneSelectOptions() {
  const mainStoneValue = $('stoneSel') ? $('stoneSel').value : '';
  console.log('updateStoneSelectOptions呼び出し - mainStoneValue:', mainStoneValue);
  
  // すべての個別石選択を取得
  const allStoneSelects = [
    // A〜Tの個別選択
    ...'ABCDEFGHIJKLMNOPQRST'.split('').map(letter => ({
      element: $(`stoneAT_${letter}`),
      type: 'AT',
      position: letter
    })),
    // a〜dの個別選択
    ...'abcd'.split('').map(letter => ({
      element: $(`stoneAd_${letter}`),
      type: 'Ad', 
      position: letter
    })),
    // 1〜6の個別選択
    ...[1,2,3,4,5,6].map(num => ({
      element: $(`stone16_${num}`),
      type: '16',
      position: num
    }))
  ];
  
  // グループ設定のセレクトボックス
  const groupSelects = [
    { element: $('groupStoneAT'), type: 'groupAT' },
    { element: $('groupStoneAd'), type: 'groupAd' },
    { element: $('groupStone16'), type: 'group16' }
  ];
  
  // CZ以外（天然石 + CZ または 天然石）が選択されている場合
  if (mainStoneValue && mainStoneValue !== 'A') {
    console.log('天然石選択時 - CZ以外の選択肢のみ表示');
    
    // 個別石選択の更新
    allStoneSelects.forEach(({element, type, position}) => {
      if (element) {
        // 現在の選択値を保存
        const currentValue = element.value;
        console.log(`個別石選択更新 - ${type}_${position}, 現在の値: ${currentValue}`);
        
        // オプションをクリア
        element.innerHTML = '';
        
        // プレースホルダーを追加
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '選択してください';
        element.appendChild(placeholderOption);
        
        // メインストーン選択に応じて選択肢を追加
        if (mainStoneValue === 'B') {
          // 天然石 + CZ選択時はすべての石を表示
          console.log('天然石 + CZ選択時 - すべての選択肢を追加');
          MASTER_STONES.individualStones.forEach(stone => {
            const option = document.createElement('option');
            option.value = stone.value;
            option.textContent = stone.label;
            element.appendChild(option);
          });
        } else if (mainStoneValue === 'C') {
          // 天然石選択時は天然石のみ（CZ以外）
          console.log('天然石選択時 - CZ以外の選択肢を追加');
          MASTER_STONES.individualStones.forEach(stone => {
            if (stone.value !== 'CZ') {
              console.log('選択肢を追加:', stone.value, stone.label);
              const option = document.createElement('option');
              option.value = stone.value;
              option.textContent = stone.label;
              element.appendChild(option);
            }
          });
        }
        
        // 現在の値を復元（可能な場合）
        if (currentValue && element.querySelector(`option[value="${currentValue}"]`)) {
          element.value = currentValue;
        } else {
          element.value = '';
        }
        
        // 天然石選択時にCZが選択されている場合はクリア
        if (mainStoneValue === 'C' && currentValue === 'CZ') {
          element.value = '';
        }
      }
    });
    
    // グループ設定の更新
    groupSelects.forEach(({element, type}) => {
      if (element) {
        // 現在の選択値を保存
        const currentValue = element.value;
        
        // オプションをクリア
        element.innerHTML = '';
        
        // プレースホルダーを追加
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '選択してください';
        element.appendChild(placeholderOption);
        
        // メインストーン選択に応じて選択肢を追加
        if (mainStoneValue === 'B') {
          // 天然石 + CZ選択時はすべての石を表示
          MASTER_STONES.individualStones.forEach(stone => {
            const option = document.createElement('option');
            option.value = stone.value;
            option.textContent = stone.label;
            element.appendChild(option);
          });
        } else if (mainStoneValue === 'C') {
          // 天然石選択時は天然石のみ（CZ以外）
          MASTER_STONES.individualStones.forEach(stone => {
            if (stone.value !== 'CZ') {
              const option = document.createElement('option');
              option.value = stone.value;
              option.textContent = stone.label;
              element.appendChild(option);
            }
          });
        }
        
        // 現在の値を復元（可能な場合）
        if (currentValue && element.querySelector(`option[value="${currentValue}"]`)) {
          element.value = currentValue;
        } else {
          element.value = '';
        }
        
        // 天然石選択時にCZが選択されている場合はクリア
        if (mainStoneValue === 'C' && currentValue === 'CZ') {
          element.value = '';
        }
      }
    });
    
  } else {
    console.log('CZ選択時または未選択時 - すべての選択肢を表示');
    
    // すべての選択肢を表示
    [...allStoneSelects, ...groupSelects].forEach(({element}) => {
      if (element) {
        // 現在の選択値を保存
        const currentValue = element.value;
        
        // オプションをクリア
        element.innerHTML = '';
        
        // プレースホルダーを追加
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '選択してください';
        element.appendChild(placeholderOption);
        
        // すべての石の選択肢を追加
        MASTER_STONES.individualStones.forEach(stone => {
          const option = document.createElement('option');
          option.value = stone.value;
          option.textContent = stone.label;
          element.appendChild(option);
        });
        
        // 現在の値を復元
        element.value = currentValue;
      }
    });
  }
}

// CZ制限チェック関数
function checkCZRestriction() {
  // メインストーン選択を取得
  const mainStoneSelect = $('stoneSel');
  const mainStoneValue = mainStoneSelect ? mainStoneSelect.value : '';
  
  console.log('メインストーン選択:', mainStoneValue);
  
  // CZ選択時は制限チェックをスキップ
  if (mainStoneValue === 'A') {
    console.log('CZ選択時は制限チェックをスキップ');
    return;
  }
  
  // すべての個別石選択を取得
  const allStoneSelects = [
    // A〜Tの個別選択
    ...'ABCDEFGHIJKLMNOPQRST'.split('').map(letter => ({
      element: $(`stoneAT_${letter}`),
      type: 'AT',
      position: letter
    })),
    // a〜dの個別選択
    ...'abcd'.split('').map(letter => ({
      element: $(`stoneAd_${letter}`),
      type: 'Ad', 
      position: letter
    })),
    // 1〜6の個別選択
    ...[1,2,3,4,5,6].map(num => ({
      element: $(`stone16_${num}`),
      type: '16',
      position: num
    }))
  ];
  
  // 石選択フォームの表示制御
  updateStoneFormVisibility();
  
  // セレクトボックスの選択肢を更新
  updateStoneSelectOptions();
  
  // CZが選択されている場合
  if (mainStoneValue === 'CZ') {
    console.log('CZが選択されています - すべての石をCZに設定');
    
    // すべての個別石選択をCZに設定
    allStoneSelects.forEach(({element, type, position}) => {
      if (element) {
        element.value = 'CZ';
        element.disabled = true; // 選択を無効化
        
        // 状態を更新
        if (type === 'AT') {
          individualStoneState.stonesAT[position] = 'CZ';
        } else if (type === 'Ad') {
          individualStoneState.stonesAd[position] = 'CZ';
        } else if (type === '16') {
          individualStoneState.stones16[position] = 'CZ';
        }
      }
    });
    
    // グループ設定もCZに設定
    if ($('groupStoneAT')) {
      $('groupStoneAT').value = 'CZ';
      individualStoneState.groupStoneAT = 'CZ';
    }
    if ($('groupStoneAd')) {
      $('groupStoneAd').value = 'CZ';
      individualStoneState.groupStoneAd = 'CZ';
    }
    if ($('groupStone16')) {
      $('groupStone16').value = 'CZ';
      individualStoneState.groupStone16 = 'CZ';
    }
    
  } else if (mainStoneValue && mainStoneValue !== 'CZ') {
    console.log('天然石が選択されています - CZ以外の石のみ選択可能');
    
    // すべての個別石選択を有効化（CZ以外）
    allStoneSelects.forEach(({element, type, position}) => {
      if (element) {
        element.disabled = false; // 選択を有効化
        
        // 現在CZが選択されている場合は最初の天然石に変更
        if (element.value === 'CZ') {
          element.value = 'RUBY'; // デフォルトでルビーに設定
          
          // 状態を更新
          if (type === 'AT') {
            individualStoneState.stonesAT[position] = 'RUBY';
          } else if (type === 'Ad') {
            individualStoneState.stonesAd[position] = 'RUBY';
          } else if (type === '16') {
            individualStoneState.stones16[position] = 'RUBY';
          }
        }
      }
    });
    
    // グループ設定もCZ以外に設定
    if ($('groupStoneAT') && $('groupStoneAT').value === 'CZ') {
      $('groupStoneAT').value = 'RUBY';
      individualStoneState.groupStoneAT = 'RUBY';
    }
    if ($('groupStoneAd') && $('groupStoneAd').value === 'CZ') {
      $('groupStoneAd').value = 'RUBY';
      individualStoneState.groupStoneAd = 'RUBY';
    }
    if ($('groupStone16') && $('groupStone16').value === 'CZ') {
      $('groupStone16').value = 'RUBY';
      individualStoneState.groupStone16 = 'RUBY';
    }
    
  } else {
    console.log('ストーンが選択されていません - すべての選択を有効化');
    
    // すべての個別石選択を有効化
    allStoneSelects.forEach(({element}) => {
      if (element) {
        element.disabled = false;
      }
    });
  }
}

// 個別石設定の更新
function updateIndividualStones() {
  // グループ設定が有効な場合、個別設定をグループ設定で上書き
  if (stoneManager.state.groupAT && stoneManager.state.groupStoneAT) {
    CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
      const select = $(`stoneAT_${letter}`);
      if (select) {
        select.value = stoneManager.state.groupStoneAT;
        stoneManager.state.stonesAT[letter] = stoneManager.state.groupStoneAT;
      }
    });
  }

  if (stoneManager.state.groupAd && stoneManager.state.groupStoneAd) {
    CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
      const select = $(`stoneAd_${letter}`);
      if (select) {
        select.value = stoneManager.state.groupStoneAd;
        stoneManager.state.stonesAd[letter] = stoneManager.state.groupStoneAd;
      }
    });
  }

  if (stoneManager.state.group16 && stoneManager.state.groupStone16) {
    CONSTANTS.STONE_LETTERS['16'].forEach(num => {
      const select = $(`stone16_${num}`);
      if (select) {
        select.value = stoneManager.state.groupStone16;
        stoneManager.state.stones16[num] = stoneManager.state.groupStone16;
      }
    });
  }

  // CZ制限チェック
  checkCZRestriction();

  // 石の表示を更新
  updateStoneVisualization();
  
  // レイヤー表示を更新
  updateLayers();
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
  if (stoneManager.state.groupAT && stoneManager.state.groupStoneAT) {
    CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
      currentStones.AT[letter] = stoneManager.state.groupStoneAT;
    });
  } else {
    // 個別設定
    currentStones.AT = stoneManager.state.stonesAT;
  }

  if (stoneManager.state.groupAd && stoneManager.state.groupStoneAd) {
    CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
      currentStones.Ad[letter] = stoneManager.state.groupStoneAd;
    });
  } else {
    currentStones.Ad = stoneManager.state.stonesAd;
  }

  if (stoneManager.state.group16 && stoneManager.state.groupStone16) {
    CONSTANTS.STONE_LETTERS['16'].forEach(num => {
      currentStones['16'][num] = stoneManager.state.groupStone16;
    });
  } else {
    currentStones['16'] = stoneManager.state.stones16;
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
  stoneManager.clearStoneSettings();

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
  
  // 個別石設定の表示制御
  updateStoneFormVisibility();
  
  // レイヤー表示を更新
  updateLayers();

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
  
  // メインストーン選択の特別な処理
  const stoneSelect = $('stoneSel');
  if (stoneSelect) {
    stoneSelect.addEventListener('change', (e) => {
      console.log('メインストーン選択が変更されました:', e.target.value);
      // CZ制限チェックを実行
      checkCZRestriction();
      // 個別石選択のオプションを更新
      updateStoneSelectOptions();
      // 個別石設定を更新
      updateIndividualStones();
      // レイヤー表示を更新
      updateLayers();
      // 価格計算を更新
      update();
    });
  }

  // 個別石設定の初期化
  createIndividualStoneControls();
  setupGroupToggles();
  setupGroupStoneSelects();
  setupIndividualStoneSelects();
  setupStonePlaceholderEvents();

  // 初期表示を更新
  
  // グループ設定の初期状態を設定（チェックボックスがオフなのでグループプルダウンを非表示）
  updateGroupMode('AT', false);
  updateGroupMode('Ad', false);
  updateGroupMode('16', false);
  
  // CZ制限チェックを実行
  checkCZRestriction();
  
  // 石選択フォームの表示制御を実行
  updateStoneFormVisibility();
  
  updateStoneVisualization();
  updateLayers();
  update();
  
  // 確実に背景画像を表示するためのフォールバック
  setTimeout(() => {
    const container = document.getElementById('accessoryLayers');
    
    if (!container) {
      // コンテナが見つからない場合は新しく作成
      const newContainer = document.createElement('div');
      newContainer.id = 'accessoryLayers';
      newContainer.className = 'accessory-layers-container';
      
      // 適切な場所に挿入
      const parentElement = document.querySelector('.accessoryBox') || document.querySelector('.main') || document.body;
      parentElement.appendChild(newContainer);
      
      const backgroundImg = document.createElement('img');
      backgroundImg.src = 'images/layer_5_Original.png';
      backgroundImg.alt = 'アクセサリー背景';
      backgroundImg.className = 'layer-image';
      backgroundImg.style.zIndex = 5;
      newContainer.appendChild(backgroundImg);
      
    } else if (container.children.length === 0) {
      const backgroundImg = document.createElement('img');
      backgroundImg.src = 'images/layer_5_Original.png';
      backgroundImg.alt = 'アクセサリー背景';
      backgroundImg.className = 'layer-image';
      backgroundImg.style.zIndex = 5;
      container.appendChild(backgroundImg);
    }
  }, 100);
  
  
  // スマホ用スクロール機能の初期化
  setupMobileScrollPreview();
  
  // 個別石設定の表示制御を初期化
  updateStoneFormVisibility();
  
  // モーダルのボタンイベントを設定
  setupModalButtons();
  
  // ストーンモーダルボタンのイベントを設定
  setupStoneModalButton();
}

// モーダルのボタンイベントを設定
function setupModalButtons() {
  const saveBtn = document.getElementById('saveStoneSettings');
  const resetBtn = document.getElementById('resetStoneSettings');
  const cancelBtn = document.getElementById('cancelStoneSettings');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveStoneSettings);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetStoneSettings);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelStoneSettings);
  }
}

// ストーン設定を保存
function saveStoneSettings() {
  // モーダル内の設定をメインの設定にコピー
  copyModalSettingsToMain();
  
  // メインのプレビューを更新
  updateLayers();
  
  // モーダルを非表示
  hideStoneModal();
}

// ストーン設定をリセット
function resetStoneSettings() {
  // モーダル内の個別石選択をすべてクリア
  clearModalStoneSettings();
  
  // モーダルのプレビューを更新
  updateModalPreviewFromStones();
}

// ストーン設定をキャンセル
function cancelStoneSettings() {
  // 元の状態に復元
  stoneManager.restoreModalOriginalState();
  
  // メインのプレビューを更新
  updateLayers();
  
  // モーダルを非表示
  hideStoneModal();
}

// モーダル内の設定をメインの設定にコピー
function copyModalSettingsToMain() {
  // 個別石設定をコピー
  stoneManager.state.stonesAT = {};
  stoneManager.state.stonesAd = {};
  stoneManager.state.stones16 = {};
  
  // A〜Tの個別選択
  CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
    const select = document.getElementById(`modalStoneAT_${letter}`);
    if (select && select.value) {
      stoneManager.state.stonesAT[letter] = select.value;
    }
  });
  
  // a〜dの個別選択
  CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
    const select = document.getElementById(`modalStoneAd_${letter}`);
    if (select && select.value) {
      stoneManager.state.stonesAd[letter] = select.value;
    }
  });
  
  // 1〜6の個別選択
  CONSTANTS.STONE_LETTERS['16'].forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select && select.value) {
      stoneManager.state.stones16[num] = select.value;
    }
  });
  
  // グループ設定をコピー
  stoneManager.state.groupAT = document.getElementById('modalGroupToggleAT')?.checked || false;
  stoneManager.state.groupAd = document.getElementById('modalGroupToggleAd')?.checked || false;
  stoneManager.state.group16 = document.getElementById('modalGroupToggle16')?.checked || false;
  
  stoneManager.state.groupStoneAT = document.getElementById('modalGroupStoneAT')?.value || '';
  stoneManager.state.groupStoneAd = document.getElementById('modalGroupStoneAd')?.value || '';
  stoneManager.state.groupStone16 = document.getElementById('modalGroupStone16')?.value || '';
}

// 石設定のデータをクリア
function clearStoneSettings() {
  stoneManager.clearStoneSettings();
}

// モーダル内の石選択をクリア
function clearModalStoneSettings() {
  // A〜Tの個別選択をクリア
  CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
    const select = document.getElementById(`modalStoneAT_${letter}`);
    if (select) {
      select.value = '';
    }
  });
  
  // a〜dの個別選択をクリア
  CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
    const select = document.getElementById(`modalStoneAd_${letter}`);
    if (select) {
      select.value = '';
    }
  });
  
  // 1〜6の個別選択をクリア
  CONSTANTS.STONE_LETTERS['16'].forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select) {
      select.value = '';
    }
  });
  
  // グループ設定をオフに設定
  const groupToggles = [
    { id: 'modalGroupToggleAT', state: false },
    { id: 'modalGroupToggleAd', state: false },
    { id: 'modalGroupToggle16', state: false }
  ];
  
  groupToggles.forEach(({ id, state }) => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.checked = state;
      // グループモードを更新
      const group = id.replace('modalGroupToggle', '');
      updateModalGroupMode(group, state);
    }
  });
  
  // グループ選択をクリア
  const groupSelects = [
    { id: 'modalGroupStoneAT', value: '' },
    { id: 'modalGroupStoneAd', value: '' },
    { id: 'modalGroupStone16', value: '' }
  ];
  
  groupSelects.forEach(({ id, value }) => {
    const select = document.getElementById(id);
    if (select) {
      select.value = value;
    }
  });
}

// ストーンモーダルボタンのイベントを設定
function setupStoneModalButton() {
  const stoneModalBtn = document.getElementById('stoneModalBtn');
  
  if (stoneModalBtn) {
    stoneModalBtn.addEventListener('click', () => {
      showStoneModal();
    });
  }
}

// スマホ用スクロール機能
function setupMobileScrollPreview() {
  // 複数の方法でpreview要素を取得
  let preview = document.querySelector('.preview');
  let priceBox = document.querySelector('.priceBox');
  
  if (!preview) {
    preview = document.querySelector('.grid > div:first-child');
  }
  
  if (!priceBox) {
    priceBox = document.querySelector('.priceBox, [class*="price"]');
  }
  
  if (!preview) {
    return;
  }
  
  let isScrolled = false;
  const thresholdEnter = 80;  // フローティングに入る閾値
  
  
  // スクロールイベントリスナー
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    
    // スマホ・タブレットサイズ（1024px以下）で動作
    if (screenWidth <= 1024) {
      if (scrollY >= thresholdEnter && !isScrolled) {
        preview.classList.add('scrolled');
        if (priceBox) {
          priceBox.classList.add('scrolled');
        }
        isScrolled = true;
      } else if (scrollY === 0 && isScrolled) {
        preview.classList.remove('scrolled');
        if (priceBox) {
          priceBox.classList.remove('scrolled');
        }
        isScrolled = false;
      }
    } else {
      // デスクトップ・iPad以上のサイズではクラスとスタイルを削除
      if (isScrolled) {
        preview.classList.remove('scrolled');
        if (priceBox) {
          priceBox.classList.remove('scrolled');
        }
        isScrolled = false;
      }
    }
  }
  
  // スクロールイベントリスナーを追加
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 初期状態を確認
  handleScroll();
}

// レイヤー表示を更新
function updateLayers() {
  const container = document.getElementById('accessoryLayers');
  if (!container) {
    return;
  }

  // 現在の選択状態を取得
  const selections = stoneManager.getStoneSelections();

  // グループ設定が有効な場合の処理
  if (stoneManager.state.groupAT && stoneManager.state.groupStoneAT) {
    selections.stonesAT = {};
    CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
      selections.stonesAT[letter] = stoneManager.state.groupStoneAT;
    });
  }

  if (stoneManager.state.groupAd && stoneManager.state.groupStoneAd) {
    selections.stonesAd = {};
    CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
      selections.stonesAd[letter] = stoneManager.state.groupStoneAd;
    });
  }

  if (stoneManager.state.group16 && stoneManager.state.groupStone16) {
    selections.stones16 = {};
    CONSTANTS.STONE_LETTERS['16'].forEach(num => {
      selections.stones16[num] = stoneManager.state.groupStone16;
    });
  }

  // アクティブなレイヤーを取得
  const activeLayers = getActiveLayers(selections);
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // レイヤー画像を追加（レイヤー番号の小さい順にソート）
  activeLayers.sort((a, b) => a.layer - b.layer).forEach((layer, index) => {
    const img = createLayerImage(layer, index);
    container.appendChild(img);
  });
  
}


document.addEventListener("DOMContentLoaded", function() {
  init();
});
