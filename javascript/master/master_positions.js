/**
 * 石設置箇所マスターデータ
 * アクセサリーの各部位における石の配置位置情報を管理
 */

// 石配置箇所のマッピング
const STONE_POSITIONS = {
  // A〜T (本体外輪) - 20箇所
  AT: [
    { id: "stone_A", letter: "A", x: 50, y: 10 },
    { id: "stone_B", letter: "B", x: 70, y: 15 },
    { id: "stone_C", letter: "C", x: 85, y: 30 },
    { id: "stone_D", letter: "D", x: 90, y: 50 },
    { id: "stone_E", letter: "E", x: 85, y: 70 },
    { id: "stone_F", letter: "F", x: 70, y: 85 },
    { id: "stone_G", letter: "G", x: 50, y: 90 },
    { id: "stone_H", letter: "H", x: 30, y: 85 },
    { id: "stone_I", letter: "I", x: 15, y: 70 },
    { id: "stone_J", letter: "J", x: 10, y: 50 },
    { id: "stone_K", letter: "K", x: 15, y: 30 },
    { id: "stone_L", letter: "L", x: 30, y: 15 },
    { id: "stone_M", letter: "M", x: 45, y: 25 },
    { id: "stone_N", letter: "N", x: 60, y: 20 },
    { id: "stone_O", letter: "O", x: 75, y: 40 },
    { id: "stone_P", letter: "P", x: 80, y: 60 },
    { id: "stone_Q", letter: "Q", x: 75, y: 80 },
    { id: "stone_R", letter: "R", x: 60, y: 85 },
    { id: "stone_S", letter: "S", x: 45, y: 80 },
    { id: "stone_T", letter: "T", x: 25, y: 60 }
  ],
  
  // a〜d (本体中央) - 4箇所  
  Ad: [
    { id: "stone_a", letter: "a", x: 40, y: 45 },
    { id: "stone_b", letter: "b", x: 60, y: 45 },
    { id: "stone_c", letter: "c", x: 50, y: 60 },
    { id: "stone_d", letter: "d", x: 50, y: 40 }
  ],
  
  // 1〜6 (バチカン) - 6箇所
  "16": [
    { id: "stone_1", number: 1, x: 50, y: 5 },
    { id: "stone_2", number: 2, x: 50, y: 15 },
    { id: "stone_3", number: 3, x: 50, y: 25 },
    { id: "stone_4", number: 4, x: 50, y: 35 },
    { id: "stone_5", number: 5, x: 50, y: 45 },
    { id: "stone_6", number: 6, x: 50, y: 55 }
  ]
};
