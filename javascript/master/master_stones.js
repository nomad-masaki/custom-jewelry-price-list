/**
 * 石の種類と画像マッピングマスターデータ
 * 石の種類定義、個別石設定、画像パス管理を担当
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

// 各石設置箇所の画像マッピングテーブル
const STONE_POSITION_IMAGES = {
  // A〜T (本体外輪) の各箇所ごとの石画像
  "A": {
    "CZ": "images/stones/A_cz.png",
    "RUBY": "images/stones/A_ruby.png", 
    "SAPPHIRE": "images/stones/A_sapphire.png",
    "EMERALD": "images/stones/A_emerald.png"
  },
  "B": {
    "CZ": "images/stones/B_cz.png",
    "RUBY": "images/stones/B_ruby.png",
    "SAPPHIRE": "images/stones/B_sapphire.png", 
    "EMERALD": "images/stones/B_emerald.png"
  },
  "C": {
    "CZ": "images/stones/C_cz.png",
    "RUBY": "images/stones/C_ruby.png",
    "SAPPHIRE": "images/stones/C_sapphire.png",
    "EMERALD": "images/stones/C_emerald.png"
  },
  "D": {
    "CZ": "images/stones/D_cz.png",
    "RUBY": "images/stones/D_ruby.png",
    "SAPPHIRE": "images/stones/D_sapphire.png",
    "EMERALD": "images/stones/D_emerald.png"
  },
  "E": {
    "CZ": "images/stones/E_cz.png",
    "RUBY": "images/stones/E_ruby.png",
    "SAPPHIRE": "images/stones/E_sapphire.png",
    "EMERALD": "images/stones/E_emerald.png"
  },
  "F": {
    "CZ": "images/stones/F_cz.png",
    "RUBY": "images/stones/F_ruby.png",
    "SAPPHIRE": "images/stones/F_sapphire.png",
    "EMERALD": "images/stones/F_emerald.png"
  },
  "G": {
    "CZ": "images/stones/G_cz.png",
    "RUBY": "images/stones/G_ruby.png",
    "SAPPHIRE": "images/stones/G_sapphire.png",
    "EMERALD": "images/stones/G_emerald.png"
  },
  "H": {
    "CZ": "images/stones/H_cz.png",
    "RUBY": "images/stones/H_ruby.png",
    "SAPPHIRE": "images/stones/H_sapphire.png",
    "EMERALD": "images/stones/H_emerald.png"
  },
  "I": {
    "CZ": "images/stones/I_cz.png",
    "RUBY": "images/stones/I_ruby.png",
    "SAPPHIRE": "images/stones/I_sapphire.png",
    "EMERALD": "images/stones/I_emerald.png"
  },
  "J": {
    "CZ": "images/stones/J_cz.png",
    "RUBY": "images/stones/J_ruby.png",
    "SAPPHIRE": "images/stones/J_sapphire.png",
    "EMERALD": "images/stones/J_emerald.png"
  },
  "K": {
    "CZ": "images/stones/K_cz.png",
    "RUBY": "images/stones/K_ruby.png",
    "SAPPHIRE": "images/stones/K_sapphire.png",
    "EMERALD": "images/stones/K_emerald.png"
  },
  "L": {
    "CZ": "images/stones/L_cz.png",
    "RUBY": "images/stones/L_ruby.png",
    "SAPPHIRE": "images/stones/L_sapphire.png",
    "EMERALD": "images/stones/L_emerald.png"
  },
  "M": {
    "CZ": "images/stones/M_cz.png",
    "RUBY": "images/stones/M_ruby.png",
    "SAPPHIRE": "images/stones/M_sapphire.png",
    "EMERALD": "images/stones/M_emerald.png"
  },
  "N": {
    "CZ": "images/stones/N_cz.png",
    "RUBY": "images/stones/N_ruby.png",
    "SAPPHIRE": "images/stones/N_sapphire.png",
    "EMERALD": "images/stones/N_emerald.png"
  },
  "O": {
    "CZ": "images/stones/O_cz.png",
    "RUBY": "images/stones/O_ruby.png",
    "SAPPHIRE": "images/stones/O_sapphire.png",
    "EMERALD": "images/stones/O_emerald.png"
  },
  "P": {
    "CZ": "images/stones/P_cz.png",
    "RUBY": "images/stones/P_ruby.png",
    "SAPPHIRE": "images/stones/P_sapphire.png",
    "EMERALD": "images/stones/P_emerald.png"
  },
  "Q": {
    "CZ": "images/stones/Q_cz.png",
    "RUBY": "images/stones/Q_ruby.png",
    "SAPPHIRE": "images/stones/Q_sapphire.png",
    "EMERALD": "images/stones/Q_emerald.png"
  },
  "R": {
    "CZ": "images/stones/R_cz.png",
    "RUBY": "images/stones/R_ruby.png",
    "SAPPHIRE": "images/stones/R_sapphire.png",
    "EMERALD": "images/stones/R_emerald.png"
  },
  "S": {
    "CZ": "images/stones/S_cz.png",
    "RUBY": "images/stones/S_ruby.png",
    "SAPPHIRE": "images/stones/S_sapphire.png",
    "EMERALD": "images/stones/S_emerald.png"
  },
  "T": {
    "CZ": "images/stones/T_cz.png",
    "RUBY": "images/stones/T_ruby.png",
    "SAPPHIRE": "images/stones/T_sapphire.png",
    "EMERALD": "images/stones/T_emerald.png"
  },
  
  // a〜d (本体中央) の各箇所ごとの石画像
  "a": {
    "CZ": "images/stones/a_cz.png",
    "RUBY": "images/stones/a_ruby.png",
    "SAPPHIRE": "images/stones/a_sapphire.png",
    "EMERALD": "images/stones/a_emerald.png"
  },
  "b": {
    "CZ": "images/stones/b_cz.png",
    "RUBY": "images/stones/b_ruby.png",
    "SAPPHIRE": "images/stones/b_sapphire.png",
    "EMERALD": "images/stones/b_emerald.png"
  },
  "c": {
    "CZ": "images/stones/c_cz.png",
    "RUBY": "images/stones/c_ruby.png",
    "SAPPHIRE": "images/stones/c_sapphire.png",
    "EMERALD": "images/stones/c_emerald.png"
  },
  "d": {
    "CZ": "images/stones/d_cz.png",
    "RUBY": "images/stones/d_ruby.png",
    "SAPPHIRE": "images/stones/d_sapphire.png",
    "EMERALD": "images/stones/d_emerald.png"
  },
  
  // 1〜6 (バチカン) の各箇所ごとの石画像
  "1": {
    "CZ": "images/stones/1_cz.png",
    "RUBY": "images/stones/1_ruby.png",
    "SAPPHIRE": "images/stones/1_sapphire.png",
    "EMERALD": "images/stones/1_emerald.png"
  },
  "2": {
    "CZ": "images/stones/2_cz.png",
    "RUBY": "images/stones/2_ruby.png",
    "SAPPHIRE": "images/stones/2_sapphire.png",
    "EMERALD": "images/stones/2_emerald.png"
  },
  "3": {
    "CZ": "images/stones/3_cz.png",
    "RUBY": "images/stones/3_ruby.png",
    "SAPPHIRE": "images/stones/3_sapphire.png",
    "EMERALD": "images/stones/3_emerald.png"
  },
  "4": {
    "CZ": "images/stones/4_cz.png",
    "RUBY": "images/stones/4_ruby.png",
    "SAPPHIRE": "images/stones/4_sapphire.png",
    "EMERALD": "images/stones/4_emerald.png"
  },
  "5": {
    "CZ": "images/stones/5_cz.png",
    "RUBY": "images/stones/5_ruby.png",
    "SAPPHIRE": "images/stones/5_sapphire.png",
    "EMERALD": "images/stones/5_emerald.png"
  },
  "6": {
    "CZ": "images/stones/6_cz.png",
    "RUBY": "images/stones/6_ruby.png",
    "SAPPHIRE": "images/stones/6_sapphire.png",
    "EMERALD": "images/stones/6_emerald.png"
  }
};
