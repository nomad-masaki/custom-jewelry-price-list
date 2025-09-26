# アクセサリー画像ファイル

このフォルダには以下のディレクトリ構造で画像ファイルを配置してください：

## ディレクトリ構造
- `layer_5_default.png` - 背景画像（最背面）
- `layer-1/` - チェーン画像（最前面）
- `layer-2/` - バチカン画像
- `layer-3/` - 本体画像
- `layer-4/` - 石類画像（目、牙、たてがみ、バチカン石）
- `stones/` - 個別石画像（従来の構造）

## レイヤー順序
数字が小さいほど前面に表示されます：
1. **layer-1** - チェーン（最前面）
2. **layer-2** - バチカン
3. **layer-3** - 本体
4. **layer-4** - 石類（目、牙、たてがみ、バチカン石）
5. **background** - 背景画像（最背面）

## ファイル命名規則
- **layer-1**: `layer_1_chain_{素材}.png` (例: `layer_1_chain_SV925.png`)
- **layer-2**: `layer_2_bail_{素材}.png` (例: `layer_2_bail_K18YG.png`)
- **layer-3**: `layer_3_body_{素材}.png` (例: `layer_3_body_K10YG.png`)
- **layer-4**: 
  - たてがみ: `layer_4_mane_{場所}_{石種}.png` (例: `layer_4_mane_A_ruby.png`)
  - 目: `layer_4_eye_L_{石種}.png`, `layer_4_eye_R_{石種}.png`
  - 牙: `layer_4_tooth_L_{石種}.png`, `layer_4_tooth_R_{石種}.png`
  - バチカン石: `layer_4_bail_{番号}_{石種}.png`

## 推奨仕様
- サイズ: 800x600px 以上の高解像度
- 形式: PNG（透明背景推奨）
- レイヤー画像はすべて同じサイズで作成してください

## 注意事項
- 画像ファイルが存在しない場合は、そのレイヤーは表示されません
- ディレクトリ名の数字順序で表示順が決まります