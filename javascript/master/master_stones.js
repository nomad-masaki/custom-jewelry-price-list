/**
 * 石の種類と画像マッピングマスターデータ
 * 石の種類定義、個別石設定、画像パス管理を担当
 * layer-4ディレクトリ構造に対応
 */

// 石の種類定義
const STONE_TYPES = {
  "CZ": { label: "CZ", color: "#ffffff" },
  "RUBY": { label: "ルビー", color: "#e0115f" },
  "SAPPHIRE": { label: "サファイア", color: "#0f52ba" },
  "EMERALD": { label: "エメラルド", color: "#50c878" }
};

// 個別石設定用の石の種類
const MASTER_STONES = {
  individualStones: [
    { value: "CZ", label: "CZ" },
    { value: "RUBY", label: "ルビー" },
    { value: "SAPPHIRE", label: "サファイア" },
    { value: "EMERALD", label: "エメラルド" },
  ]
};

// 各石設置箇所の画像マッピングテーブル（layer-4ディレクトリ構造）
const STONE_POSITION_IMAGES = {
  // A〜T (たてがみ) の各箇所ごとの石画像
  "A": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png", 
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "B": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png", 
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "C": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "D": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "E": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "F": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "G": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "H": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "I": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "J": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "K": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "L": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "M": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "N": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "O": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "P": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "Q": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "R": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "S": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  "T": {
    "CZ": "images/layer-4/layer_4_mane_cz.png",
    "RUBY": "images/layer-4/layer_4_mane_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_mane_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_mane_emerald.png"
  },
  
  // a〜d (目と牙) の各箇所ごとの石画像
  "a": {
    "CZ": "images/layer-4/layer_4_eye_L_cz.png",
    "RUBY": "images/layer-4/layer_4_eye_L_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_eye_L_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_eye_L_emerald.png"
  },
  "b": {
    "CZ": "images/layer-4/layer_4_eye_R_cz.png",
    "RUBY": "images/layer-4/layer_4_eye_R_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_eye_R_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_eye_R_emerald.png"
  },
  "c": {
    "CZ": "images/layer-4/layer_4_teeth_L_cz.png",
    "RUBY": "images/layer-4/layer_4_teeth_L_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_teeth_L_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_teeth_L_emerald.png"
  },
  "d": {
    "CZ": "images/layer-4/layer_4_teeth_R_cz.png",
    "RUBY": "images/layer-4/layer_4_teeth_R_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_teeth_R_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_teeth_R_emerald.png"
  },
  
  // 1〜6 (バチカンの石) の各箇所ごとの石画像
  "1": {
    "CZ": "images/layer-4/layer_4_vatican1_cz.png",
    "RUBY": "images/layer-4/layer_4_vatican1_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_vatican1_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_vatican1_emerald.png"
  },
  "2": {
    "CZ": "images/layer-4/layer_4_vatican2_cz.png",
    "RUBY": "images/layer-4/layer_4_vatican2_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_vatican2_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_vatican2_emerald.png"
  },
  "3": {
    "CZ": "images/layer-4/layer_4_vatican3_cz.png",
    "RUBY": "images/layer-4/layer_4_vatican3_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_vatican3_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_vatican3_emerald.png"
  },
  "4": {
    "CZ": "images/layer-4/layer_4_vatican4_cz.png",
    "RUBY": "images/layer-4/layer_4_vatican4_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_vatican4_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_vatican4_emerald.png"
  },
  "5": {
    "CZ": "images/layer-4/layer_4_vatican5_cz.png",
    "RUBY": "images/layer-4/layer_4_vatican5_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_vatican5_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_vatican5_emerald.png"
  },
  "6": {
    "CZ": "images/layer-4/layer_4_vatican6_cz.png",
    "RUBY": "images/layer-4/layer_4_vatican6_ruby.png",
    "SAPPHIRE": "images/layer-4/layer_4_vatican6_sapphire.png",
    "EMERALD": "images/layer-4/layer_4_vatican6_emerald.png"
  }
};
