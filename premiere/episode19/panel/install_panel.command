#!/bin/bash
# 「19 自動編集」パネルを Premiere Pro に追加します。
# 行うこと: パネルのフォルダを ~/Library/Application Support/Adobe/CEP/extensions にコピーし、
#           署名なしパネルの読み込みを許可する設定（PlayerDebugMode）をオンにするだけです。
# プロジェクトや動画には一切触れません。
cd "$(dirname "$0")" || exit 1
EXT_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions"
mkdir -p "$EXT_DIR"
rm -rf "$EXT_DIR/jp.az.episode19.autoedit"
cp -R "./jp.az.episode19.autoedit" "$EXT_DIR/"
xattr -dr com.apple.quarantine "$EXT_DIR/jp.az.episode19.autoedit" 2>/dev/null
for v in 9 10 11 12 13 14; do defaults write "com.adobe.CSXS.$v" PlayerDebugMode 1; done
echo ""
if grep -q "SCRIPT_VERSION = 'v1.4'" "$EXT_DIR/jp.az.episode19.autoedit/jsx/episode19_auto_edit.jsx"; then
  echo "インストールした版: v1.4"
else
  echo "注意: 新しい版（v1.4）になっていません。このキットのフォルダ名を確認してください: $(pwd)"
fi
echo "完了しました。Premiere Pro を開いている場合は、一度終了してから開き直してください。"
echo "このウィンドウは閉じてかまいません。"
