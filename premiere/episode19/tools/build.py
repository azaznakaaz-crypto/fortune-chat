#!/usr/bin/env python3
"""Build dist/episode19_auto_edit.jsx (ASCII only) and docs/タイムライン計画.md from src + plan.

ExtendScript may misread UTF-8 without a BOM, so every non-ASCII character is
escaped as \\uXXXX. The plan file is inlined so the script runs from any folder.
"""
import json, os, re, sys

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
    op2_at = ot_end + pre
    shift = pre + op2
    final_end = src_end + shift
    mp = lambda tc: (frames(tc, fps) + (pre if frames(tc, fps) < ot_end else shift))
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
    L.append('| 5 | オープニングトーク | %s | %s | %df | 現在 00:00.00〜%s |' % (F(pre), F(op2_at), ot_end, plan['openingTalkEnd']))
    L.append('| 6 | オープニング② | %s | %s | %df | 前回 %s〜%s を複製（前回のBGM込み） |' % (F(op2_at), F(op2_at + op2), op2, pp['opening2']['start'], pp['opening2']['end']))
    L.append('| 7 | 本編 | %s | %s | %df | 現在 %s〜%s |' % (F(op2_at + op2), F(final_end), src_end - ot_end, plan['openingTalkEnd'], plan['sourceDuration']))
    L.append('')
    L.append('完成尺：**%s**（%d フレーム）。BGM「%s」：%s〜%s（A2）。' % (F(final_end), final_end, pp['bgmName'], F(0), F(op2_at)))
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
    tf = plan['telopFix']
    L.append('## 肩書修正')
    L.append('')
    L.append('- 完成 %s〜%s：「%s」→「%s」（複製シーケンスのみ）' % (F(mp(tf['start'])), F(mp(tf['end'])), tf['from'], tf['to']))
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
    print('built dist/episode19_auto_edit.jsx and docs/タイムライン計画.md')


if __name__ == '__main__':
    main()
