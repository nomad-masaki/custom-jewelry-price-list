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
// 画像プリロード・キャッシュ管理クラス
// ============================================================================

class ImageCache {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.preloadedImages = new Set();
    this.cacheKey = 'imageCache_v1';
    this.maxCacheSize = 200; // 最大キャッシュサイズ
    this.loadCacheFromStorage();
  }

  // キャッシュをローカルストレージから読み込み
  loadCacheFromStorage() {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (parsed && parsed.preloadedImages) {
          this.preloadedImages = new Set(parsed.preloadedImages);
        }
      }
    } catch (error) {
      // ローカルストレージの読み込みに失敗した場合は無視
    }
  }

  // キャッシュをローカルストレージに保存
  saveCacheToStorage() {
    try {
      const cacheData = {
        preloadedImages: Array.from(this.preloadedImages),
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      // ローカルストレージの保存に失敗した場合は無視
    }
  }

  // 画像をプリロード
  async preloadImage(src) {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      // ブラウザキャッシュを活用するための設定
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // キャッシュサイズ制限
        if (this.cache.size >= this.maxCacheSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        
        this.cache.set(src, img);
        this.preloadedImages.add(src);
        
        // ローカルストレージにキャッシュ情報を保存
        this.saveCacheToStorage();
        
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // キャッシュバスティングを避けるため、タイムスタンプを追加しない
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // 複数画像を並列プリロード
  async preloadImages(srcs) {
    const promises = srcs.map(src => 
      this.preloadImage(src).catch(error => {
        // エラーをコンソールに出力せずに無視
        return null;
      })
    );
    return Promise.all(promises);
  }

  // 画像を取得（キャッシュから）
  getImage(src) {
    return this.cache.get(src);
  }

  // 画像がプリロード済みかチェック
  isPreloaded(src) {
    return this.preloadedImages.has(src);
  }

  // よく使用される画像をプリロード
  async preloadCommonImages() {
    const commonImages = [
      // 背景画像
      "images/layer_5_Original.png",
      // よく使用される本体素材
      "images/layer-3/layer_3_body_K18YG.png",
      "images/layer-3/layer_3_body_K18PG.png",
      "images/layer-3/layer_3_body_SV925.png",
      // よく使用されるチェーン
      "images/layer-1/layer_1_chain_K18YG.png",
      "images/layer-1/layer_1_chain_K18PG.png",
      "images/layer-1/layer_1_chain_SV925.png",
      // よく使用されるバチカン
      "images/layer-2/layer_2_bail_K18YG.png",
      "images/layer-2/layer_2_bail_K18PG.png",
      "images/layer-2/layer_2_bail_SV925.png",
      // 石画像（よく使用される）- 実際のファイル名に修正
      "images/layer-4/layer_4_mane_A_cz.png",
      "images/layer-4/layer_4_mane_plain.png",
      "images/layer-4/layer_4_eye_L_cz.png",
      "images/layer-4/layer_4_eye_R_cz.png",
      "images/layer-4/layer_4_tooth_L_cz.png",
      "images/layer-4/layer_4_tooth_R_cz.png"
    ];

    // プリロードを実行（エラーは無視）
    await this.preloadImages(commonImages);
  }

  // 全画像を事前プリロード（より包括的なキャッシュ）
  async preloadAllImages() {
    const allImages = [];
    
    // 本体素材画像を追加
    MASTER_MATERIALS.forEach(material => {
      if (material.layer3Image) {
        allImages.push(material.layer3Image);
      }
    });
    
    // チェーン画像を追加
    MASTER_MATERIALS.forEach(material => {
      if (material.layer1Image) {
        allImages.push(material.layer1Image);
      }
    });
    
    // バチカン画像を追加
    MASTER_MATERIALS.forEach(material => {
      if (material.layer2Image) {
        allImages.push(material.layer2Image);
      }
    });
    
    // 石画像を追加
    MASTER_STONES.individualStones.forEach(stone => {
      if (stone.layer4Images) {
        stone.layer4Images.forEach(img => {
          if (img.image) {
            allImages.push(img.image);
          }
        });
      }
    });
    
    // 重複を除去
    const uniqueImages = [...new Set(allImages)];
    
    // バッチサイズで分割してプリロード（メモリ使用量を制限）
    const batchSize = 20;
    for (let i = 0; i < uniqueImages.length; i += batchSize) {
      const batch = uniqueImages.slice(i, i + batchSize);
      await this.preloadImages(batch);
      
      // バッチ間に短い遅延を追加（ブラウザの負荷を軽減）
      if (i + batchSize < uniqueImages.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
}

// グローバル画像キャッシュインスタンス
const imageCache = new ImageCache();


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

// レイヤー画像を作成する共通関数（最適化版）
function createLayerImage(layer, index) {
  const container = document.createElement('div');
  container.className = 'layer-container';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = CONSTANTS.LAYER_Z_INDEX_BASE - layer.layer;

  // ローディングインジケーター
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;
  container.appendChild(loadingIndicator);

  const img = document.createElement('img');
  img.alt = 'アクセサリーレイヤー';
  img.className = 'layer-image';
  img.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;

  // 石の画像の場合は透過度を調整
  if (layer.layer === 4) {
    img.style.opacity = '0.8';
  } else {
    img.style.opacity = '1.0';
  }

  container.appendChild(img);

  // 画像読み込み処理（キャッシュ活用）
  const loadImage = async () => {
    try {
      // キャッシュから取得を試行
      const cachedImg = imageCache.getImage(layer.image);
      if (cachedImg) {
        img.src = cachedImg.src;
        img.onload();
        return;
      }

      // プリロード済みかチェック
      if (imageCache.isPreloaded(layer.image)) {
        img.src = layer.image;
        return;
      }

      // プリロードを試行（非同期で実行）
      imageCache.preloadImage(layer.image).then(() => {
        img.src = layer.image;
      }).catch(() => {
        // プリロードに失敗した場合は直接読み込み
        img.src = layer.image;
      });
      
      // プリロードを待たずに直接読み込みも実行（フォールバック）
      img.src = layer.image;
    } catch (error) {
      // エラーが発生した場合は直接読み込み
      img.src = layer.image;
    }
  };

  // 画像読み込み完了時の処理
  img.onload = function() {
    loadingIndicator.style.display = 'none';
    img.style.opacity = layer.layer === 4 ? '0.8' : '1.0';
  };

  // 画像読み込みエラーの処理
  img.onerror = function() {
    loadingIndicator.style.display = 'none';
    container.style.display = 'none';
  };

  // 画像読み込み開始
  loadImage();

  return container;
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
  updateLayers().catch(() => {}); // エラーは無視
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
    updateLayers().catch(() => {}); // エラーは無視 // レイヤー表示を即座に更新
  });

  $('groupStoneAd').addEventListener('change', (e) => {
    stoneManager.state.groupStoneAd = e.target.value;
    updateIndividualStones();
    updateLayers().catch(() => {}); // エラーは無視 // レイヤー表示を即座に更新
  });

  $('groupStone16').addEventListener('change', (e) => {
    stoneManager.state.groupStone16 = e.target.value;
    updateIndividualStones();
    updateLayers().catch(() => {}); // エラーは無視 // レイヤー表示を即座に更新
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
        updateLayers().catch(() => {}); // エラーは無視 // レイヤー表示を即座に更新
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
        updateLayers().catch(() => {}); // エラーは無視 // レイヤー表示を即座に更新
      });
    }
  });

  // 1〜6の個別選択
  CONSTANTS.STONE_LETTERS['16'].forEach(num => {
    const select = $(`stone16_${num}`);
    if (select) {
      select.addEventListener('change', (e) => {
        stoneManager.state.stones16[num] = e.target.value;
        updateIndividualStones();
        updateLayers().catch(() => {}); // エラーは無視 // レイヤー表示を即座に更新
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
    // CZ + 天然石（B）が選択されている場合はボタンを表示
    if (mainStoneValue === 'B') {
      stoneModalBtn.style.display = 'block';
    } else {
      stoneModalBtn.style.display = 'none';
    }
  }
}



// 個別石選択のセレクトボックスを更新する関数
function updateStoneSelectOptions() {
  const mainStoneValue = $('stoneSel') ? $('stoneSel').value : '';
  
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
    
    // 個別石選択の更新
    allStoneSelects.forEach(({element, type, position}) => {
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
        }
        
        // 現在の値を復元（可能な場合）
        if (currentValue && element.querySelector(`option[value="${currentValue}"]`)) {
          element.value = currentValue;
        } else {
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
        }
        
        // 現在の値を復元（可能な場合）
        if (currentValue && element.querySelector(`option[value="${currentValue}"]`)) {
          element.value = currentValue;
        } else {
          element.value = '';
        }
        
      }
    });
    
  } else if (mainStoneValue === 'A') {
    
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
        
        // CZ選択時は個別石選択を無効化
        if (allStoneSelects.some(s => s.element === element)) {
          element.disabled = true;
        }
        
        // 現在の値を復元
        element.value = currentValue;
      }
    });
  } else {
    
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
        
        // 個別石選択を有効化
        if (allStoneSelects.some(s => s.element === element)) {
          element.disabled = false;
        }
        
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
  
  // CZ(A)が選択されている場合
  if (mainStoneValue === 'A') {
    
    // すべての個別石選択をCZに設定
    allStoneSelects.forEach(({element, type, position}) => {
      if (element) {
        element.value = 'CZ';
        element.disabled = true; // 選択を無効化
        
        // 状態を更新
        if (type === 'AT') {
          stoneManager.state.stonesAT[position] = 'CZ';
        } else if (type === 'Ad') {
          stoneManager.state.stonesAd[position] = 'CZ';
        } else if (type === '16') {
          stoneManager.state.stones16[position] = 'CZ';
        }
      }
    });
    
    // グループ設定もCZに設定
    if ($('groupStoneAT')) {
      $('groupStoneAT').value = 'CZ';
      stoneManager.state.groupStoneAT = 'CZ';
    }
    if ($('groupStoneAd')) {
      $('groupStoneAd').value = 'CZ';
      stoneManager.state.groupStoneAd = 'CZ';
    }
    if ($('groupStone16')) {
      $('groupStone16').value = 'CZ';
      stoneManager.state.groupStone16 = 'CZ';
    }
    
    // レイヤー表示を更新
    updateLayers().catch(() => {}); // エラーは無視
    
  } else if (mainStoneValue === 'B') {
    
    // すべての個別石選択を有効化
    allStoneSelects.forEach(({element}) => {
      if (element) {
        element.disabled = false; // 選択を有効化
      }
    });
    
  } else {
    
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
  updateLayers().catch(() => {}); // エラーは無視
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
  
  // CZ制限チェック
  checkCZRestriction();
  
  // 個別石設定の表示制御
  updateStoneFormVisibility();
  
  // レイヤー表示を更新
  updateLayers().catch(() => {}); // エラーは無視

  const priceEl = $("priceText");
  const skuEl = $("skuText");
  const taxEl = $("taxText");

  if (!b || !k || !c || !s) {
    priceEl.textContent = "パーツを選択すると金額が表示されます";
    if (skuEl) skuEl.textContent = "-";
    if (taxEl) taxEl.textContent = "-";
    return;
  }

  const key = keyOf(b,k,c,s);
  const rec = PRICE_TABLE[key];
  if (!rec) {
    priceEl.textContent = "価格未登録";
    if (skuEl) skuEl.textContent = "-";
    if (taxEl) taxEl.textContent = "-";
    return;
  }

  // 価格表示（数値チェック付き）
  if (typeof rec.price === 'number' && rec.price >= 0) {
    priceEl.textContent = fmtJPY(rec.price);
  } else {
    priceEl.textContent = "価格データエラー";
  }

  // SKU表示（フォールバック付き）
  if (skuEl) {
    if (rec.sku && typeof rec.sku === 'string') {
      skuEl.textContent = rec.sku;
    } else {
      skuEl.textContent = key; // キーをフォールバックとして使用
    }
  }

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
      // CZ制限チェックを実行
      checkCZRestriction();
      // 個別石選択のオプションを更新
      updateStoneSelectOptions();
      // 個別石設定を更新
      updateIndividualStones();
      // レイヤー表示を更新
      updateLayers().catch(() => {}); // エラーは無視
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

  // グループ設定の初期状態を設定（チェックボックスがオフなのでグループプルダウンを非表示）
  updateGroupMode('AT', false);
  updateGroupMode('Ad', false);
  updateGroupMode('16', false);
  
  // CZ制限チェックを実行
  checkCZRestriction();
  
  // 石選択フォームの表示制御を実行
  updateStoneFormVisibility();
  
  // 画像プリロードを開始（非同期）
  // まず基本的な画像をプリロードして初期表示を更新
  imageCache.preloadCommonImages().then(() => {
    // プリロード完了後に初期表示を更新
    updateStoneVisualization();
    updateLayers().catch(() => {}); // エラーは無視
    update();
    
    // バックグラウンドで全画像をプリロード
    imageCache.preloadAllImages().catch(() => {
      // 全画像プリロードに失敗してもエラーを出力しない
    });
  }).catch(() => {
    // プリロードに失敗しても初期表示を更新
    updateStoneVisualization();
    updateLayers().catch(() => {}); // エラーは無視
    update();
  });
  
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

// レイヤー表示を更新（最適化版）
async function updateLayers() {
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
  
  // 現在のレイヤーと比較して変更があるかチェック
  const currentLayerKeys = Array.from(container.children).map(child => {
    const img = child.querySelector('.layer-image');
    return img ? img.src : '';
  }).sort();
  
  const newLayerKeys = activeLayers.map(layer => layer.image).sort();
  
  // レイヤーが変更されていない場合は何もしない
  if (JSON.stringify(currentLayerKeys) === JSON.stringify(newLayerKeys)) {
    return;
  }
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // レイヤー画像を並列で作成・追加
  const layerPromises = activeLayers
    .sort((a, b) => a.layer - b.layer)
    .map(async (layer, index) => {
      const img = createLayerImage(layer, index);
      container.appendChild(img);
      return img;
    });
  
  // すべてのレイヤーが追加されるまで待機
  await Promise.all(layerPromises);
}


document.addEventListener("DOMContentLoaded", function() {
  init();
});
