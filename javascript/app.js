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
  const titleElement = stoneGroup.querySelector('h4');

  if (isGroupMode) {
    stoneGroup.classList.add('group-mode');
    groupElement.style.display = 'block';
    individualElement.style.display = 'none';
    
    // グループモード時のタイトルを設定
    if (titleElement) {
      const groupTitles = {
        'AT': 'たてがみグループ',
        'Ad': '目 ＆ 牙グループ',
        '16': 'バチカングループ'
      };
      titleElement.setAttribute('data-group-title', groupTitles[group] || titleElement.textContent);
    }
  } else {
    stoneGroup.classList.remove('group-mode');
    groupElement.style.display = 'none';
    individualElement.style.display = 'block';
    
    // 通常モードに戻す
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
    individualStoneState.groupStoneAT = e.target.value;
    updateIndividualStones();
    updateLayers(); // レイヤー表示を即座に更新
  });

  $('groupStoneAd').addEventListener('change', (e) => {
    individualStoneState.groupStoneAd = e.target.value;
    updateIndividualStones();
    updateLayers(); // レイヤー表示を即座に更新
  });

  $('groupStone16').addEventListener('change', (e) => {
    console.log('バチカングループ石選択が変更されました:', e.target.value);
    individualStoneState.groupStone16 = e.target.value;
    updateIndividualStones();
    updateLayers(); // レイヤー表示を即座に更新
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
        updateLayers(); // レイヤー表示を即座に更新
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
        updateLayers(); // レイヤー表示を即座に更新
      });
    }
  });

  // 1〜6の個別選択
  const numbers = [1, 2, 3, 4, 5, 6];
  numbers.forEach(num => {
    const select = $(`stone16_${num}`);
    if (select) {
      select.addEventListener('change', (e) => {
        console.log(`バチカン個別石${num}選択が変更されました:`, e.target.value);
        individualStoneState.stones16[num] = e.target.value;
        updateIndividualStones();
        updateLayers(); // レイヤー表示を即座に更新
      });
    }
  });
}

// 石選択フォームの表示制御
function updateStoneFormVisibility() {
  const mainStoneValue = $('stoneSel') ? $('stoneSel').value : '';
  const stoneForm = document.querySelector('.stone-settings');
  
  if (stoneForm) {
    if (mainStoneValue && mainStoneValue !== 'CZ') {
      // 天然石が選択されている場合は表示
      stoneForm.style.display = 'block';
      console.log('石選択フォームを表示');
    } else {
      // CZ選択時または未選択時は非表示
      stoneForm.style.display = 'none';
      console.log('石選択フォームを非表示');
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
  
  // 天然石が選択されている場合、CZ以外の選択肢のみを表示
  if (mainStoneValue && mainStoneValue !== 'CZ') {
    console.log('天然石選択時 - CZ以外の選択肢のみ表示');
    
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
        
        // 天然石の選択肢のみを追加
        MASTER_STONES.individualStones.forEach(stone => {
          if (stone.value !== 'CZ') {
            const option = document.createElement('option');
            option.value = stone.value;
            option.textContent = stone.label;
            element.appendChild(option);
          }
        });
        
        // 現在の値がCZ以外の場合は復元
        if (currentValue && currentValue !== 'CZ') {
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
        
        // 天然石の選択肢のみを追加
        MASTER_STONES.individualStones.forEach(stone => {
          if (stone.value !== 'CZ') {
            const option = document.createElement('option');
            option.value = stone.value;
            option.textContent = stone.label;
            element.appendChild(option);
          }
        });
        
        // 現在の値がCZ以外の場合は復元
        if (currentValue && currentValue !== 'CZ') {
          element.value = currentValue;
        } else {
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
  console.log('init関数が呼び出されました');
  
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
  console.log('初期表示を更新中...');
  
  // グループ設定の初期状態を設定（チェックボックスがオフなのでグループプルダウンを非表示）
  updateGroupMode('AT', false);
  updateGroupMode('Ad', false);
  updateGroupMode('16', false);
  
  // CZ制限チェックを実行
  checkCZRestriction();
  
  // 石選択フォームの表示制御を実行
  updateStoneFormVisibility();
  
  updateStoneVisualization();
  console.log('updateLayersを呼び出し中...');
  updateLayers();
  update();
  
  // 確実に背景画像を表示するためのフォールバック
  setTimeout(() => {
    console.log('フォールバック処理開始');
    const container = document.getElementById('accessoryLayers');
    console.log('フォールバック内でのコンテナ検索結果:', container);
    
    if (!container) {
      console.log('フォールバック: コンテナが見つからないため、新しく作成');
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
      
      console.log('フォールバック: 新しいコンテナと背景画像を作成');
    } else if (container.children.length === 0) {
      console.log('フォールバック: 背景画像を直接追加');
      const backgroundImg = document.createElement('img');
      backgroundImg.src = 'images/layer_5_Original.png';
      backgroundImg.alt = 'アクセサリー背景';
      backgroundImg.className = 'layer-image';
      backgroundImg.style.zIndex = 5;
      container.appendChild(backgroundImg);
    }
  }, 100);
  
  console.log('init完了');
}

// レイヤー表示を更新
function updateLayers() {
  console.log('updateLayers関数が呼び出されました');
  
  const container = document.getElementById('accessoryLayers');
  if (!container) {
    console.log('accessoryLayersコンテナが見つかりません');
    return;
  }

  console.log('コンテナが見つかりました:', container);

  // 現在の選択状態を取得
  const selections = {
    body: $("bodySel") ? $("bodySel").value : '',
    chain: $("chainSel") ? $("chainSel").value : '',
    bail: $("bailSel") ? $("bailSel").value : '',
    stonesAT: individualStoneState.stonesAT || {},
    stonesAd: individualStoneState.stonesAd || {},
    stones16: individualStoneState.stones16 || {}
  };

  console.log('現在の選択状態:', selections);

  // グループ設定が有効な場合の処理
  if (individualStoneState.groupAT && individualStoneState.groupStoneAT) {
    const atLetters = 'ABCDEFGHIJKLMNOPQRST'.split('');
    selections.stonesAT = {};
    atLetters.forEach(letter => {
      selections.stonesAT[letter] = individualStoneState.groupStoneAT;
    });
  }

  if (individualStoneState.groupAd && individualStoneState.groupStoneAd) {
    const adLetters = 'abcd'.split('');
    selections.stonesAd = {};
    adLetters.forEach(letter => {
      selections.stonesAd[letter] = individualStoneState.groupStoneAd;
    });
  }

  if (individualStoneState.group16 && individualStoneState.groupStone16) {
    const num16 = '123456'.split('');
    selections.stones16 = {};
    num16.forEach(num => {
      selections.stones16[num] = individualStoneState.groupStone16;
    });
    console.log('バチカングループ設定適用:', selections.stones16);
  }

  // アクティブなレイヤーを取得
  const activeLayers = getActiveLayers(selections);
  
  console.log('Active layers:', activeLayers);
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // レイヤー画像を追加
  activeLayers.forEach((layer, index) => {
    console.log(`レイヤー${index + 1}を追加:`, layer);
    
    const img = document.createElement('img');
    img.src = layer.image;
    img.alt = 'アクセサリーレイヤー';
    img.className = 'layer-image';
    // layer番号が小さいほど前面に表示（z-indexを逆転）
    img.style.zIndex = 10 - layer.layer;
    
    // 石の画像の場合は透過度を調整（背景画像は不透明）
    if (layer.layer === 4) { // layer-4は石類
      img.style.opacity = '0.8'; // 少し透過させる
    } else {
      img.style.opacity = '1.0'; // 完全に不透明
    }
    
    // 画像読み込みエラーの処理
    img.onerror = function() {
      console.log('画像読み込みエラー:', this.src);
      // 画像が読み込めない場合は非表示にする
      this.style.display = 'none';
    };
    
    // 画像読み込み成功時のログ
    img.onload = function() {
      console.log('画像読み込み成功:', this.src);
    };
    
    container.appendChild(img);
  });
  
  console.log('レイヤー追加完了。総数:', activeLayers.length);
}

console.log('スクリプトが読み込まれました');
document.addEventListener("DOMContentLoaded", function() {
  console.log('DOMContentLoadedイベントが発火しました');
  init();
});
