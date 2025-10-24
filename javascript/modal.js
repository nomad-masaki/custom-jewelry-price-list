/**
 * モーダル管理機能
 * ストーン設定モーダルの表示・制御を担当
 */

// ============================================================================
// モーダル表示・非表示関数
// ============================================================================

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

// ============================================================================
// モーダル設定コピー関数
// ============================================================================

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
    const img = createLayerImage(layer, index);
    container.appendChild(img);
  });
}

// ============================================================================
// モーダル内石選択初期化関数
// ============================================================================

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
  
  // 初期プレビューを更新
  updateModalPreviewFromStones();
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
        // stoneManagerの状態を更新
        if (group === 'AT') {
          stoneManager.state.groupAT = e.target.checked;
        } else if (group === 'Ad') {
          stoneManager.state.groupAd = e.target.checked;
        } else if (group === '16') {
          stoneManager.state.group16 = e.target.checked;
        }
        
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
        // stoneManagerの状態を更新
        if (group === 'AT') {
          stoneManager.state.groupStoneAT = e.target.value;
        } else if (group === 'Ad') {
          stoneManager.state.groupStoneAd = e.target.value;
        } else if (group === '16') {
          stoneManager.state.groupStone16 = e.target.value;
        }
        
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
        // stoneManagerの状態を更新
        stoneManager.state.stonesAT[letter] = e.target.value;
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
        // stoneManagerの状態を更新
        stoneManager.state.stonesAd[letter] = e.target.value;
        updateModalPreviewFromStones();
      });
    }
  });
  
  // 1〜6の個別選択
  [1,2,3,4,5,6].forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select) {
      select.addEventListener('change', (e) => {
        // stoneManagerの状態を更新
        stoneManager.state.stones16[num] = e.target.value;
        updateModalPreviewFromStones();
      });
    }
  });
}

// ============================================================================
// モーダル内石選択オプション更新関数
// ============================================================================

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
        }
      }
    });
  }
}

// ============================================================================
// モーダル設定コピー・復元関数
// ============================================================================

// 現在の設定をモーダルにコピー
function copyCurrentSettingsToModal() {
  // 現在の個別石設定をモーダルにコピー
  // A〜Tの個別選択
  'ABCDEFGHIJKLMNOPQRST'.split('').forEach(letter => {
    const select = document.getElementById(`modalStoneAT_${letter}`);
    if (select) {
      select.value = stoneManager.state.stonesAT[letter] || '';
    }
  });
  
  // a〜dの個別選択
  'abcd'.split('').forEach(letter => {
    const select = document.getElementById(`modalStoneAd_${letter}`);
    if (select) {
      select.value = stoneManager.state.stonesAd[letter] || '';
    }
  });
  
  // 1〜6の個別選択
  [1,2,3,4,5,6].forEach(num => {
    const select = document.getElementById(`modalStone16_${num}`);
    if (select) {
      select.value = stoneManager.state.stones16[num] || '';
    }
  });
  
  // 現在のグループ設定を反映
  const groupToggles = [
    { id: 'modalGroupToggleAT', state: stoneManager.state.groupAT || false },
    { id: 'modalGroupToggleAd', state: stoneManager.state.groupAd || false },
    { id: 'modalGroupToggle16', state: stoneManager.state.group16 || false }
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
    { id: 'modalGroupStoneAT', value: stoneManager.state.groupStoneAT || '' },
    { id: 'modalGroupStoneAd', value: stoneManager.state.groupStoneAd || '' },
    { id: 'modalGroupStone16', value: stoneManager.state.groupStone16 || '' }
  ];
  
  groupSelects.forEach(({ id, value }) => {
    const select = document.getElementById(id);
    if (select) {
      select.value = value;
    }
  });
}

// ============================================================================
// モーダル内グループ・個別制御関数
// ============================================================================

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
      // stoneManagerの状態も更新
      stoneManager.state.stonesAT[letter] = value;
    });
  } else if (group === 'Ad') {
    'abcd'.split('').forEach(letter => {
      const select = document.getElementById(`modalStoneAd_${letter}`);
      if (select) {
        select.value = value;
      }
      // stoneManagerの状態も更新
      stoneManager.state.stonesAd[letter] = value;
    });
  } else if (group === '16') {
    [1,2,3,4,5,6].forEach(num => {
      const select = document.getElementById(`modalStone16_${num}`);
      if (select) {
        select.value = value;
      }
      // stoneManagerの状態も更新
      stoneManager.state.stones16[num] = value;
    });
  }
  
  // プレビューを更新
  updateModalPreviewFromStones();
}

// モーダル内の石選択からプレビューを更新
function updateModalPreviewFromStones() {
  // 現在の選択状態を取得
  const currentSelections = {
    body: $("bodySel") ? $("bodySel").value : '',
    chain: $("chainSel") ? $("chainSel").value : '',
    bail: $("bailSel") ? $("bailSel").value : '',
    stone: $("stoneSel") ? $("stoneSel").value : ''
  };
  
  // グループ設定を考慮した石設定を取得
  const stonesAT = {};
  const stonesAd = {};
  const stones16 = {};
  
  // グループ設定が有効な場合の処理
  if (stoneManager.state.groupAT && stoneManager.state.groupStoneAT) {
    CONSTANTS.STONE_LETTERS.AT.forEach(letter => {
      stonesAT[letter] = stoneManager.state.groupStoneAT;
    });
  } else {
    Object.assign(stonesAT, stoneManager.state.stonesAT || {});
  }
  
  if (stoneManager.state.groupAd && stoneManager.state.groupStoneAd) {
    CONSTANTS.STONE_LETTERS.Ad.forEach(letter => {
      stonesAd[letter] = stoneManager.state.groupStoneAd;
    });
  } else {
    Object.assign(stonesAd, stoneManager.state.stonesAd || {});
  }
  
  if (stoneManager.state.group16 && stoneManager.state.groupStone16) {
    CONSTANTS.STONE_LETTERS['16'].forEach(num => {
      stones16[num] = stoneManager.state.groupStone16;
    });
  } else {
    Object.assign(stones16, stoneManager.state.stones16 || {});
  }
  
  const selections = {
    ...currentSelections,
    stonesAT,
    stonesAd,
    stones16
  };
  
  // モーダルのレイヤーを更新
  updateModalLayers(selections);
}

// ============================================================================
// モーダルボタンイベント設定関数
// ============================================================================

// モーダルのボタンイベントを設定
function setupModalButtons() {
  const saveBtn = document.getElementById('saveStoneSettings');
  const resetBtn = document.getElementById('resetStoneSettings');
  const cancelBtn = document.getElementById('cancelStoneSettings');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveStoneSettings);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetModalStoneSettings);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelStoneSettings);
  }
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

// ============================================================================
// モーダル操作関数（保存・リセット・キャンセル）
// ============================================================================

// ストーン設定を保存
function saveStoneSettings() {
  // モーダル内の設定をメインの設定にコピー
  copyModalSettingsToMain();
  
  // メインのプレビューを更新
  updateLayers();
  
  // モーダルを非表示
  hideStoneModal();
}

// モーダル内のストーン設定をリセット
function resetModalStoneSettings() {
  // モーダル内の個別石選択をすべてクリア
  clearModalStoneSettings();
  
  // モーダル内のstoneManager状態をリセット（プレビュー更新のため）
  stoneManager.state.stonesAT = {};
  stoneManager.state.stonesAd = {};
  stoneManager.state.stones16 = {};
  stoneManager.state.groupAT = false;
  stoneManager.state.groupAd = false;
  stoneManager.state.group16 = false;
  stoneManager.state.groupStoneAT = '';
  stoneManager.state.groupStoneAd = '';
  stoneManager.state.groupStone16 = '';
  
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

// ============================================================================
// モーダル設定コピー・クリア関数
// ============================================================================

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
