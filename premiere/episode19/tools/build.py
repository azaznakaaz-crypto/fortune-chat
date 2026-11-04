#!/usr/bin/env python3
"""Build dist/episode19_auto_edit.jsx (ASCII only) and docs/タイムライン計画.md from src + plan.

ExtendScript may misread UTF-8 without a BOM, so every non-ASCII character is
escaped as \\uXXXX. The plan file is inlined so the script runs from any folder.
"""
import json, os, re, shutil, stat, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load_plan():
    src = open(os.path.join(ROOT, 'episode19_plan.jsxinc'), encoding='utf8').read()
    body = src[src.index('var PLAN = ') + len('var PLAN = '):].rstrip().rstrip(';')
    return src, json.loads(body)


def ascii_escape(text):
    out = []
    for ch in text:
        cp = ord(ch)
        if cp < 128:
            out.append(ch)
        elif cp <= 0xFFFF:
            out.append('\\u%04X' % cp)
        else:  # surrogate pair
            cp -= 0x10000
            out.append('\\u%04X\\u%04X' % (0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF)))
    return ''.join(out)


def frames(tc, fps):
    m, s = tc.split(':')
    return round((int(m) * 60 + float(s)) * fps)


def fmt(f, fps):
    return '%02d:%02d:%02d' % (f // fps // 60, f // fps % 60, f % fps)


def build_doc(plan):
    fps = plan['fps']
    ot_end = frames(plan['openingTalkEnd'], fps)
    src_end = frames(plan['sourceDuration'], fps)
    hls, t = [], 0
    for h in plan['highlights']:
        n = frames(h['end'], fps) - frames(h['start'], fps)
        hls.append((h, t, n)); t += n
    pp = plan['previousProject']
    op1 = frames(pp['opening1']['end'], fps) - frames(pp['opening1']['start'], fps)
    op2 = frames(pp['opening2']['end'], fps) - frames(pp['opening2']['start'], fps)
    pre = t + op1
    op2_src = frames(plan['opening2At'], fps)
    op2_at = op2_src + pre
    talk2 = pre + op2
    shift = pre + 2 * op2
    final_end = src_end + shift
    op2b_at = ot_end + talk2
    main_at = ot_end + shift
    def mp(tc):
        f = frames(tc, fps)
        return f + (pre if f < op2_src else talk2 if f < ot_end else shift)
    F = lambda f: fmt(f, fps)
    L = []
    L.append('# タイムライン計画（自動生成：tools/build.py）')
    L.append('')
    L.append('時刻表記は 分:秒:フレーム（30fps）。「現在」は挿入前のカット済みシーケンス、「完成」は複製シーケンス上の位置です。')
    L.append('')
    L.append('## 構成')
    L.append('')
    L.append('| 順 | 区間 | 完成 開始 | 完成 終了 | 長さ | 中身 |')
    L.append('|---|---|---|---|---|---|')
    names = ['ハイライト①', 'ハイライト②', 'ハイライト③']
    for i, (h, s, n) in enumerate(hls):
        L.append('| %d | %s | %s | %s | %df | 現在 %s〜%s・話者%d%%・タイトル「%s」 |' % (
            i + 1, names[i], F(s), F(s + n), n, h['start'], h['end'], h['scale'], h['title'].replace('\r', ' / ')))
    L.append('| 4 | オープニング① | %s | %s | %df | 前回 %s〜%s を複製（BGMは下のベッドに統合） |' % (F(t), F(pre), op1, pp['opening1']['start'], pp['opening1']['end']))
    L.append('| 5 | オープニングトーク前半 | %s | %s | %df | 現在 00:00.00〜%s（〜「今日はお話ししていきたいと思います」） |' % (F(pre), F(op2_at), op2_src, plan['opening2At']))
    L.append('| 6 | オープニング② | %s | %s | %df | 前回 %s〜%s を複製（前回のOP②専用BGM込み） |' % (F(op2_at), F(op2_at + op2), op2, pp['opening2']['start'], pp['opening2']['end']))
    L.append('| 7 | オープニングトーク後半 | %s | %s | %df | 現在 %s〜%s（「こんにちは 意識の専門家」〜「最後までご覧ください」） |' % (F(op2_at + op2), F(op2b_at), ot_end - op2_src, plan['opening2At'], plan['openingTalkEnd']))
    L.append('| 8 | オープニング②（2回目） | %s | %s | %df | 同じOP②をもう一度（前回のOP②専用BGM込み） |' % (F(op2b_at), F(main_at), op2))
    L.append('| 9 | 本編 | %s | %s | %df | 現在 %s〜%s |' % (F(main_at), F(final_end), src_end - ot_end, plan['openingTalkEnd'], plan['sourceDuration']))
    L.append('')
    L.append('完成尺：**%s**（%d フレーム）。BGM「%s」（A2）：%s〜%s のみ。オープニング②の間は前回のOP②専用BGM。「こんにちは 意識の専門家」（%s）以降はBGMなし。' % (F(final_end), final_end, pp['bgmName'], F(0), F(op2_at), F(op2_at + op2)))
    L.append('')
    L.append('## 尺の計算根拠')
    L.append('')
    L.append('表記の注意：「%s」は **分:秒:フレーム**（%d分%d秒＋%dフレーム＝%d分%.2f秒）です。「06:17.60」のような小数の秒ではありません。' % (F(final_end), final_end // fps // 60, final_end // fps % 60, final_end % fps, final_end // fps // 60, final_end / fps % 60))
    L.append('')
    L.append('| 項目 | フレーム | 秒 | 出どころ |')
    L.append('|---|---:|---:|---|')
    rows = [('ハイライト①', hls[0][2], '現在 %s〜%s（本編側にも残す＝意図した重複）' % (hls[0][0]['start'], hls[0][0]['end'])),
            ('ハイライト②', hls[1][2], '現在 %s〜%s（同上）' % (hls[1][0]['start'], hls[1][0]['end'])),
            ('ハイライト③', hls[2][2], '現在 %s〜%s（同上）' % (hls[2][0]['start'], hls[2][0]['end'])),
            ('オープニング①', op1, '前回プロジェクト'),
            ('オープニングトーク前半', op2_src, '現在 00:00.00〜%s' % plan['opening2At']),
            ('オープニング②', op2, '前回プロジェクト'),
            ('オープニングトーク後半', ot_end - op2_src, '現在 %s〜%s' % (plan['opening2At'], plan['openingTalkEnd'])),
            ('オープニング②（2回目）', op2, '前回プロジェクト（同じものを2か所）'),
            ('本編', src_end - ot_end, '現在 %s〜%s' % (plan['openingTalkEnd'], plan['sourceDuration']))]
    for name, n, src in rows:
        L.append('| %s | %d | %.3f | %s |' % (name, n, n / fps, src))
    L.append('| **合計** | **%d** | **%.3f** | = %d分%06.3f秒 |' % (final_end, final_end / fps, final_end // fps // 60, final_end / fps % 60))
    L.append('')
    L.append('検算：元のカット後動画 %d f（%s）＋ ハイライト %d f ＋ オープニング① %d f ＋ オープニング② %d f × 2 ＝ %d f。' % (src_end, plan['sourceDuration'], t, op1, op2, src_end + t + op1 + 2 * op2))
    L.append('')
    L.append('重複の確認：オープニングトーク前半（0〜%d f）・後半（%d〜%d f）・本編（%d〜%d f）は境目 %s と %s で接しており、重なりも欠けもありません。意図的な重複は、ハイライト3本（「本編側から削除しない」指示どおり、同じセリフが冒頭と本来の位置で2回流れる）と、オープニング②の2回使用（ご指示どおり）です。' % (op2_src, op2_src, ot_end, ot_end, src_end, plan['opening2At'], plan['openingTalkEnd']))
    L.append('')
    L.append('## 強調テロップ・タイトル（V8）')
    L.append('')
    L.append('| 現在 | 完成 | 文言 |')
    L.append('|---|---|---|')
    for h, s, n in hls:
        L.append('| （ハイライト） | %s〜%s | %s |' % (F(s), F(s + n), h['title'].replace('\r', ' / ')))
    for e in plan['emphasis']:
        L.append('| %s〜%s | %s〜%s | %s |' % (e['start'], e['end'], F(mp(e['start'])), F(mp(e['end'])), e['text'].replace('\r', ' / ')))
    L.append('')
    L.append('## 写真インサート（V3）')
    L.append('')
    L.append('| CSV | 素材 | 現在 | 完成 | 動き |')
    L.append('|---|---|---|---|---|')
    for p in plan['photos']:
        L.append('| %s | %s_*.png | %s〜%s | %s〜%s | スケール %d%%→%d%%（画面フィル基準） |' % (
            p['no'], p['file'], p['start'], p['end'], F(mp(p['start'])), F(mp(p['end'])), p['from'], p['to']))
    L.append('')
    L.append('## 図解（文字＝V4〜V7 段階表示／シェイプ＝手動）')
    L.append('')
    for d in plan['diagrams']:
        L.append('### 図解%s｜%s（完成 %s〜%s）' % (d['id'], d['title'], F(mp(d['start'])), F(mp(d['end']))))
        L.append('')
        for it in d['items']:
            L.append('- %s（現在 %s）「%s」 位置 (%.2f, %.2f)' % (F(mp(it['at'])), it['at'], it['text'], it['x'], it['y']))
        L.append('- シェイプ：' + d['shapes'])
        L.append('')
    L.append('## 画角（V1・カット点のみ）')
    L.append('')
    L.append('| 現在 | 完成 | 画角 | 理由 |')
    L.append('|---|---|---:|---|')
    for z in plan['zoom']:
        L.append('| %s〜%s | %s〜%s | %d%% | %s |' % (z['start'], z['end'], F(mp(z['start'])), F(mp(z['end'])), z['scale'], z['reason']))
    L.append('')
    L.append('## 基本テロップ')
    L.append('')
    L.append('- 基本テロップは一切変更しません（位置が後ろへずれるだけ）。肩書「神聖→神性」は最後に手作業で修正します（スクリプトは触れません）。')
    L.append('')
    return '\n'.join(L) + '\n'


def main():
    plan_src, plan = load_plan()
    src = open(os.path.join(ROOT, 'src', 'episode19_auto_edit.src.jsx'), encoding='utf8').read()
    assert '//@@PLAN@@' in src
    merged = src.replace('//@@PLAN@@', plan_src.strip())
    out = '#target premierepro\n' + ascii_escape(merged)
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    open(os.path.join(ROOT, 'dist', 'episode19_auto_edit.jsx'), 'w', encoding='ascii', newline='\n').write(out)
    os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
    open(os.path.join(ROOT, 'docs', 'タイムライン計画.md'), 'w', encoding='utf8').write(build_doc(plan))
    # panel gets the same script
    pj = os.path.join(ROOT, 'panel', 'jp.az.episode19.autoedit', 'jsx')
    os.makedirs(pj, exist_ok=True)
    shutil.copyfile(os.path.join(ROOT, 'dist', 'episode19_auto_edit.jsx'), os.path.join(pj, 'episode19_auto_edit.jsx'))
    # beginner kit zip
    kit = os.path.join(ROOT, 'dist', 'episode19_premiere_kit.zip')
    entries = [('panel/install_panel.command', 'install_panel.command'),
               ('はじめに_手順書.md', 'はじめに_手順書.md'),
               ('docs/タイムライン計画.md', 'docs/タイムライン計画.md'),
               ('docs/素材と未対応項目.md', 'docs/素材と未対応項目.md'),
               ('dist/episode19_auto_edit.jsx', 'episode19_auto_edit.jsx')]
    pdir = os.path.join(ROOT, 'panel', 'jp.az.episode19.autoedit')
    for dp, _, fns in os.walk(pdir):
        for fn in sorted(fns):
            full = os.path.join(dp, fn)
            entries.append((os.path.relpath(full, ROOT), os.path.join('jp.az.episode19.autoedit', os.path.relpath(full, pdir))))
    with zipfile.ZipFile(kit, 'w', zipfile.ZIP_DEFLATED) as z:
        for src_rel, arc in entries:
            info = zipfile.ZipInfo('episode19_premiere_kit/' + arc, date_time=(2026, 11, 4, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            mode = 0o755 if arc.endswith('.command') else 0o644
            info.external_attr = (stat.S_IFREG | mode) << 16
            z.writestr(info, open(os.path.join(ROOT, src_rel), 'rb').read())
    print('built dist/episode19_auto_edit.jsx, panel jsx, dist/episode19_premiere_kit.zip and docs/タイムライン計画.md')


if __name__ == '__main__':
    main()
