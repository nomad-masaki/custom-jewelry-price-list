# 石画像ファイル

このフォルダには各石設置箇所ごとに4種類の石画像ファイルを配置してください：

## A〜T (本体外輪) - 20箇所 × 4種類 = 80ファイル
- `A_cz.png`, `A_ruby.png`, `A_sapphire.png`, `A_emerald.png`
- `B_cz.png`, `B_ruby.png`, `B_sapphire.png`, `B_emerald.png`
- ... (C〜Tも同様)

## a〜d (本体中央) - 4箇所 × 4種類 = 16ファイル  
- `a_cz.png`, `a_ruby.png`, `a_sapphire.png`, `a_emerald.png`
- `b_cz.png`, `b_ruby.png`, `b_sapphire.png`, `b_emerald.png`
- `c_cz.png`, `c_ruby.png`, `c_sapphire.png`, `c_emerald.png`
- `d_cz.png`, `d_ruby.png`, `d_sapphire.png`, `d_emerald.png`

## 1〜6 (バチカン) - 6箇所 × 4種類 = 24ファイル
- `1_cz.png`, `1_ruby.png`, `1_sapphire.png`, `1_emerald.png`
- `2_cz.png`, `2_ruby.png`, `2_sapphire.png`, `2_emerald.png`
- ... (3〜6も同様)

## 合計: 120ファイル

## 推奨仕様
- サイズ: 32x32px または 64x64px
- 形式: PNG（透明背景推奨）
- ファイル名: `{位置}_{石種}.png` (例: `A_ruby.png`)

## 注意事項
- 画像ファイルが存在しない場合は、CSSの色で石が表示されます
- 各箇所ごとに異なる石画像を使用することで、実際のアクセサリーの見た目を正確に再現できます
