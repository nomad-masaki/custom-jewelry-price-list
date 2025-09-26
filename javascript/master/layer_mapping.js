/**
 * レイヤーマッピングマスターデータ
 * ディレクトリ構造ベースのレイヤー管理
 * layer-1が最前面、layer-4が背面、layer_5_default.pngが背景
 */

// レイヤー番号定義（数字が小さいほど前面）
const LAYER_ORDER = {
  LAYER_1: 1,          // 最前面（チェーンなど）
  LAYER_2: 2,          // バチカン
  LAYER_3: 3,          // 本体
  LAYER_4: 4,          // 石類（目、牙、たてがみ、バチカン石）
  BACKGROUND: 5        // 背景（layer_5_default.png）
};

// パーツ・石のレイヤーマッピング（ディレクトリ構造ベース）
const LAYER_MAPPING = {
  // 背景レイヤー（最背面）
  background: {
    layer: LAYER_ORDER.BACKGROUND,
    image: "images/layer_5_default.png"
  },
  
  // layer-3: 本体素材
  bodies: {
    "1": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_SV925.png" },
    "2": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_K10YG.png" },
    "3": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_K10PG.png" },
    "4": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_K10WG.png" },
    "5": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_K18YG.png" },
    "6": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_K18PG.png" },
    "7": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_K18WG.png" },
    "8": { layer: LAYER_ORDER.LAYER_3, image: "images/layer-3/layer_3_body_Pt900.png" }
  },
  
  // layer-1: チェーン（最前面）
  chains: {
    "1": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_SV925.png" },
    "2": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_K10YG.png" },
    "3": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_K10PG.png" },
    "4": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_K10WG.png" },
    "5": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_K18YG.png" },
    "6": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_K18PG.png" },
    "7": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_K18WG.png" },
    "9": { layer: LAYER_ORDER.LAYER_1, image: "images/layer-1/layer_1_chain_Pt850.png" }
  },
  
  // layer-2: バチカン
  bails: {
    "1": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_SV925.png" },
    "2": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_K10YG.png" },
    "3": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_K10PG.png" },
    "4": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_K10WG.png" },
    "5": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_K18YG.png" },
    "6": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_K18PG.png" },
    "7": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_K18WG.png" },
    "8": { layer: LAYER_ORDER.LAYER_2, image: "images/layer-2/layer_2_bail_Pt900.png" }
  },
  
  // layer-4: 石類（目、牙、たてがみ、バチカン石）
  stonesAT: {
    // たてがみ（A〜T）- layer-4
    "A": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_A.png" },
    "B": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_B.png" },
    "C": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_C.png" },
    "D": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_D.png" },
    "E": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_E.png" },
    "F": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_F.png" },
    "G": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_G.png" },
    "H": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_H.png" },
    "I": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_I.png" },
    "J": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_J.png" },
    "K": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_K.png" },
    "L": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_L.png" },
    "M": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_M.png" },
    "N": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_N.png" },
    "O": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_O.png" },
    "P": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_P.png" },
    "Q": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_Q.png" },
    "R": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_R.png" },
    "S": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_S.png" },
    "T": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_mane_T.png" }
  },
  
  // layer-4: 目（a〜d）
  stonesAd: {
    "a": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_eye_L.png" },
    "b": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_eye_R.png" },
    "c": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_teeth_L.png" },
    "d": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_teeth_R.png" }
  },
  
  // layer-4: バチカンの石（1〜6）
  stones16: {
    "1": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_bail1.png" },
    "2": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_bail2.png" },
    "3": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_bail3.png" },
    "4": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_bail4.png" },
    "5": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_bail5.png" },
    "6": { layer: LAYER_ORDER.LAYER_4, image: "images/layer-4/layer_4_bail6.png" }
  }
};

// レイヤー順序でソートする関数
function sortLayersByOrder(layers) {
  return layers.sort((a, b) => a.layer - b.layer);
}

// アクティブなレイヤーを取得する関数
function getActiveLayers(selections) {
  const activeLayers = [];
  
  // 背景レイヤーは常に追加
  activeLayers.push(LAYER_MAPPING.background);
  
  // 本体素材レイヤー
  if (selections.body && LAYER_MAPPING.bodies[selections.body]) {
    activeLayers.push(LAYER_MAPPING.bodies[selections.body]);
  }
  
  // チェーンレイヤー
  if (selections.chain && LAYER_MAPPING.chains[selections.chain]) {
    activeLayers.push(LAYER_MAPPING.chains[selections.chain]);
  }
  
  // バチカンレイヤー
  if (selections.bail && LAYER_MAPPING.bails[selections.bail]) {
    activeLayers.push(LAYER_MAPPING.bails[selections.bail]);
  }
  
  // layer-4: 本体外輪の石レイヤー（A〜T）
  if (selections.stonesAT) {
    Object.keys(selections.stonesAT).forEach(letter => {
      const stoneType = selections.stonesAT[letter];
      if (stoneType && LAYER_MAPPING.stonesAT[letter]) {
        // 石の種類に応じて画像パスを変更（layer-4ディレクトリ）
        const stoneLayer = {
          ...LAYER_MAPPING.stonesAT[letter],
          image: `images/layer-4/layer_4_mane_${stoneType.toLowerCase()}.png`
        };
        activeLayers.push(stoneLayer);
      }
    });
  }
  
  // layer-4: 本体中央の石レイヤー（a〜d）
  if (selections.stonesAd) {
    Object.keys(selections.stonesAd).forEach(letter => {
      const stoneType = selections.stonesAd[letter];
      if (stoneType && LAYER_MAPPING.stonesAd[letter]) {
        // 位置に応じて画像名を決定
        let imageName = '';
        if (letter === 'a') imageName = 'eye_L';
        else if (letter === 'b') imageName = 'eye_R';
        else if (letter === 'c') imageName = 'teeth_L';
        else if (letter === 'd') imageName = 'teeth_R';
        
        const stoneLayer = {
          ...LAYER_MAPPING.stonesAd[letter],
          image: `images/layer-4/layer_4_${imageName}_${stoneType.toLowerCase()}.png`
        };
        activeLayers.push(stoneLayer);
      }
    });
  }
  
  // layer-4: バチカンの石レイヤー（1〜6）
  if (selections.stones16) {
    Object.keys(selections.stones16).forEach(num => {
      const stoneType = selections.stones16[num];
      if (stoneType && LAYER_MAPPING.stones16[num]) {
        const stoneLayer = {
          ...LAYER_MAPPING.stones16[num],
          image: `images/layer-4/layer_4_bail${num}_${stoneType.toLowerCase()}.png`
        };
        activeLayers.push(stoneLayer);
      }
    });
  }
  
  return sortLayersByOrder(activeLayers);
}
