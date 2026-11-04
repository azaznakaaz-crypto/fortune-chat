// =============================================================================
// 19_覚醒体験した人、ディセンション恐れすぎ問題 — Premiere Pro 自動編集スクリプト
//
// 実行方法: README.md を参照（ファイル > スクリプト > スクリプトファイルを実行 など）。
// このソースは読みやすさのため日本語を含みます。Premiere で実行するのは
// tools/build.py が生成する dist/episode19_auto_edit.jsx（ASCII のみ）です。
//
// 安全設計:
//   * 最初に「別名で保存」して作業用 .prproj に切り替えるため、元の .prproj は変更されません。
//   * 元シーケンスは clone() で複製し、以降の編集はすべて複製側だけに行います。
//   * 前回プロジェクトのシーケンスは「読み込んだコピー」からサブシーケンスを作るだけです。
//   * 自動処理できなかった項目はマーカー（赤）を置き、レポートに記録します（代替品は作りません）。
//   * SE は追加しません。
// =============================================================================

//@@PLAN@@

(function () {
    var SCRIPT_VERSION = 'v1.4';   // パネル・インストーラーの表示と合わせる
    var TPS = 254016000000;          // Premiere ticks / sec
    var TPF = TPS / PLAN.fps;        // ticks / frame（30fps → 8467200000）

    var LOG = [];          // 実行ログ
    var FAILS = [];        // 自動配置できなかった項目
    var USED = [];         // 使用素材
    var MISSING = [];      // 不足素材
    var QC = [];           // 自動チェック結果

    // ---------------------------------------------------------------- utilities
    function log(s) { LOG.push(s); $.writeln(s); }
    function fail(what, why, atFrame, seq) {
        FAILS.push({ what: what, why: why, at: atFrame });
        log('[未処理] ' + what + ' — ' + why);
        if (seq && atFrame !== undefined && atFrame !== null) {
            addMarker(seq, atFrame, null, '要手動: ' + what, why, 'red');
        }
    }
    function tcToFrames(s) {
        var p = String(s).split(':');
        return Math.round((parseInt(p[0], 10) * 60 + parseFloat(p[1])) * PLAN.fps);
    }
    function pad(n, w) { var s = String(n); while (s.length < w) { s = '0' + s; } return s; }
    function fmt(f) {   // MM:SS:FF
        var fr = f % PLAN.fps, tot = Math.floor(f / PLAN.fps);
        return pad(Math.floor(tot / 60), 2) + ':' + pad(tot % 60, 2) + ':' + pad(fr, 2);
    }
    function fmtHMSF(f, sep) {
        var fr = f % PLAN.fps, tot = Math.floor(f / PLAN.fps);
        return pad(Math.floor(tot / 3600), 2) + sep + pad(Math.floor(tot / 60) % 60, 2) + sep + pad(tot % 60, 2) + sep + pad(fr, 2);
    }
    function sec(f) { return f * TPF / TPS; }
    function T(f) { var t = new Time(); t.ticks = String(f * TPF); return t; }
    // Time オブジェクト（.ticks）と、ticks 文字列（Sequence.end など）の両方を受け付ける
    function framesOf(t) {
        var ticks = (t !== null && typeof t === 'object' && t.ticks !== undefined) ? t.ticks : t;
        return Math.round(Number(ticks) / TPF);
    }
    function trim(s) { return String(s).replace(/^\s+|\s+$/g, ''); }
    function oneLine(s) { return String(s).replace(/\r|\n/g, ' / '); }

    function toJSON(v) {
        var i, out, k;
        if (v === null || v === undefined) { return 'null'; }
        if (typeof v === 'number' || typeof v === 'boolean') { return String(v); }
        if (typeof v === 'string') {
            return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '"';
        }
        if (v instanceof Array) {
            out = [];
            for (i = 0; i < v.length; i++) { out.push(toJSON(v[i])); }
            return '[' + out.join(',') + ']';
        }
        out = [];
        for (k in v) { if (v.hasOwnProperty(k)) { out.push(toJSON(k) + ':' + toJSON(v[k])); } }
        return '{' + out.join(',') + '}';
    }
    function parseJSON(s) { return eval('(' + s + ')'); }

    // macOS のファイル名・前回プロジェクトの名前は NFD（濁点分解）の場合があるため、NFC 相当に寄せて比較する
    function nfc(s) {
        return String(s).replace(/([\s\S])\u3099/g, function (m, c) {
            var code = c.charCodeAt(0);
            if (code === 0x3046 || code === 0x30A6) { return String.fromCharCode(code + 0x4E); }   // う/ウ → ゔ/ヴ
            return String.fromCharCode(code + 1);
        }).replace(/([\s\S])\u309A/g, function (m, c) { return String.fromCharCode(c.charCodeAt(0) + 2); });
    }
    function sameName(a, b) { return nfc(a) === nfc(b); }

    // ---------------------------------------------------------------- timeline mapping
    var OT_END = tcToFrames(PLAN.openingTalkEnd);
    var SRC_END = tcToFrames(PLAN.sourceDuration);
    var HL = [], HL_TOTAL = 0, i;
    for (i = 0; i < PLAN.highlights.length; i++) {
        var h = PLAN.highlights[i];
        var hs = tcToFrames(h.start), he = tcToFrames(h.end);
        HL.push({ def: h, srcStart: hs, srcEnd: he, len: he - hs, dstStart: HL_TOTAL });
        HL_TOTAL += he - hs;
    }
    var OP1_LEN = tcToFrames(PLAN.previousProject.opening1.end) - tcToFrames(PLAN.previousProject.opening1.start);
    var OP2_LEN = tcToFrames(PLAN.previousProject.opening2.end) - tcToFrames(PLAN.previousProject.opening2.start);
    var PRE = HL_TOTAL + OP1_LEN;                 // オープニングトークの開始位置
    var OP1_AT = HL_TOTAL;
    // オープニング②は、オープニングトークの途中（現在 PLAN.opening2At＝「今日はお話ししていきたいと思います」の後、
    // 「こんにちは 意識の専門家」の前）に入れる
    var OP2_SRC = tcToFrames(PLAN.opening2At);
    var OP2_AT = OP2_SRC + PRE;
    var MAIN_SHIFT = PRE + OP2_LEN;                 // OP2_SRC 以降（自己紹介〜本編）のずれ
    var FINAL_END = SRC_END + MAIN_SHIFT;
    var MAIN_AT = OT_END + MAIN_SHIFT;              // 本編の開始位置
    function mapF(srcFrame) { return srcFrame < OP2_SRC ? srcFrame + PRE : srcFrame + MAIN_SHIFT; }

    // ---------------------------------------------------------------- project helpers
    function allItems(root, out) {
        out = out || [];
        var k;
        for (k = 0; k < root.children.numItems; k++) {
            var it = root.children[k];
            out.push(it);
            if (it.type === ProjectItemType.BIN) { allItems(it, out); }
        }
        return out;
    }
    function findItemByName(name, typeFilter) {
        var items = allItems(app.project.rootItem), k;
        for (k = 0; k < items.length; k++) {
            if (sameName(items[k].name, name) && (typeFilter === undefined || items[k].type === typeFilter)) { return items[k]; }
        }
        return null;
    }
    function seqList() {
        var a = [], k;
        for (k = 0; k < app.project.sequences.numSequences; k++) { a.push(app.project.sequences[k]); }
        return a;
    }
    function seqIds() {
        var o = {}, a = seqList(), k;
        for (k = 0; k < a.length; k++) { o[a[k].sequenceID] = true; }
        return o;
    }
    function newSeqSince(before) {
        var a = seqList(), k, res = [];
        for (k = 0; k < a.length; k++) { if (!before[a[k].sequenceID]) { res.push(a[k]); } }
        return res;
    }
    function findSeqByName(name) {
        var a = seqList(), k, res = [];
        for (k = 0; k < a.length; k++) { if (sameName(a[k].name, name)) { res.push(a[k]); } }
        return res;
    }
    function getBin(name) {
        var b = findItemByName(name, ProjectItemType.BIN);
        return b || app.project.rootItem.createBin(name);
    }
    function clipsOf(track) {
        var a = [], k;
        for (k = 0; k < track.clips.numItems; k++) { a.push(track.clips[k]); }
        return a;
    }
    function itemAt(track, startFrame) {
        var a = clipsOf(track), k;
        for (k = 0; k < a.length; k++) { if (framesOf(a[k].start) === startFrame) { return a[k]; } }
        return null;
    }
    function isSpeakerClip(ti) {
        try { return ti.projectItem && /\.mov$/i.test(ti.projectItem.name); } catch (e) { return false; }
    }

    // component / property lookup that works in Japanese and English UI
    function findComponent(ti, names, matchRe) {
        var k, c;
        for (k = 0; k < ti.components.numItems; k++) {
            c = ti.components[k];
            if (matchRe && c.matchName && matchRe.test(c.matchName)) { return c; }
            for (var n = 0; n < names.length; n++) { if (c.displayName === names[n]) { return c; } }
        }
        return null;
    }
    function findProp(comp, names) {
        if (!comp) { return null; }
        var k, n;
        for (k = 0; k < comp.properties.numItems; k++) {
            for (n = 0; n < names.length; n++) {
                if (comp.properties[k].displayName === names[n]) { return comp.properties[k]; }
            }
        }
        return null;
    }
    function motion(ti) { return findComponent(ti, ['モーション', 'Motion'], /ADBE Motion/); }
    function setScale(ti, value) {
        var p = findProp(motion(ti), ['スケール', 'Scale']);
        if (!p) { return false; }
        if (p.isTimeVarying()) { p.setTimeVarying(false); }
        p.setValue(value, true);
        return true;
    }
    // 話者の画角：基準 PLAN.speaker.baseScale%（設計書の108/110%は基準に対する倍率）。
    // 顔の位置 PLAN.speaker.face（元映像のピクセル座標）が PLAN.speaker.target に来るよう位置も合わせる（黒い余白が出ない範囲で）
    function speakerScale(rel) { return PLAN.speaker.baseScale * (rel || 100) / 100; }
    function frameSpeaker(ti, rel) {
        var S = speakerScale(rel), sp = PLAN.speaker, W = 1920, H = 1080;
        var ok = setScale(ti, S);
        if (sp.face) {
            var k = S / 100;
            var px = sp.target[0] - k * (sp.face[0] - W / 2), py = sp.target[1] - k * (sp.face[1] - H / 2);
            var mx = (W * k - W) / 2, my = (H * k - H) / 2;      // はみ出し許容量
            px = Math.max(W / 2 - mx, Math.min(W / 2 + mx, px));
            py = Math.max(H / 2 - my, Math.min(H / 2 + my, py));
            setPosition(ti, px / W, py / H);
        }
        return ok;
    }
    function setPosition(ti, x, y) {
        var p = findProp(motion(ti), ['位置', 'Position']);
        if (!p) { return false; }
        p.setValue([x, y], true);
        return true;
    }
    function keyframe(prop, pairs) {   // pairs: [[seconds, value], ...]
        prop.setTimeVarying(true);
        for (var k = 0; k < pairs.length; k++) {
            prop.addKey(pairs[k][0]);
            prop.setValueAtKey(pairs[k][0], pairs[k][1], true);
        }
    }
    function opacityProp(ti) {
        return findProp(findComponent(ti, ['不透明度', 'Opacity'], /ADBE Opacity/), ['不透明度', 'Opacity']);
    }
    function levelProp(ti) {
        return findProp(findComponent(ti, ['ボリューム', 'Volume'], null), ['レベル', 'Level']);
    }

    var MARKER_COLORS = { green: 0, red: 1, purple: 2, orange: 3, yellow: 4, white: 5, blue: 6, cyan: 7 };
    function addMarker(seq, startFrame, endFrame, name, comment, color) {
        try {
            var m = seq.markers.createMarker(sec(startFrame));
            m.name = name;
            m.comments = comment || '';
            if (endFrame !== null && endFrame !== undefined && endFrame > startFrame) { m.end = sec(endFrame); }
            try { m.setColorByIndex(MARKER_COLORS[color || 'green']); } catch (e1) { }
            return m;
        } catch (e) { log('マーカー作成失敗: ' + name + ' ' + e); return null; }
    }

    // ---------------------------------------------------------------- QE helpers
    var QE_OK = false;
    function qeInit() {
        try { app.enableQE(); QE_OK = (typeof qe !== 'undefined'); } catch (e) { QE_OK = false; }
        return QE_OK;
    }
    function activate(seq) {
        try { app.project.openSequence(seq.sequenceID); } catch (e) { }
        try { app.project.activeSequence = seq; } catch (e2) { }
    }
    function qeSeqOf(seq) {
        if (!QE_OK) { return null; }
        activate(seq);
        try { return qe.project.getActiveSequence(); } catch (e) { return null; }
    }
    function qeItemAt(qeTrack, startFrame) {
        var k, it;
        for (k = 0; k < qeTrack.numItems; k++) {
            it = qeTrack.getItemAt(k);
            if (!it || it.type === 'Empty') { continue; }
            var f = null;
            try { f = Math.round(Number(it.start.ticks) / TPF); } catch (e) { }
            if (f === null || isNaN(f)) { try { f = Math.round(it.start.secs * PLAN.fps); } catch (e2) { } }
            if (f === startFrame) { return it; }
        }
        return null;
    }
    function qeEffect(names) {
        for (var k = 0; k < names.length; k++) {
            try { var fx = qe.project.getVideoEffectByName(names[k]); if (fx) { return fx; } } catch (e) { }
        }
        return null;
    }
    function ensureTracks(seq, nVideo, nAudio) {
        var q = qeSeqOf(seq);
        if (seq.videoTracks.numTracks < nVideo) {
            if (!q) { return false; }
            try { q.addTracks(nVideo - seq.videoTracks.numTracks, seq.videoTracks.numTracks, 0); } catch (e) { }
        }
        if (seq.audioTracks.numTracks < nAudio) {
            if (!q) { return false; }
            try { q.addTracks(0, 0, nAudio - seq.audioTracks.numTracks, 1, seq.audioTracks.numTracks); } catch (e2) { }
        }
        return seq.videoTracks.numTracks >= nVideo && seq.audioTracks.numTracks >= nAudio;
    }
    function razorVideo(seq, trackIndex, frame) {
        var q = qeSeqOf(seq);
        if (!q) { return false; }
        var tr = q.getVideoTrackAt(trackIndex);
        var seps = [':', ';'], k;
        for (k = 0; k < seps.length; k++) {
            try { tr.razor(fmtHMSF(frame, seps[k])); } catch (e) { }
            if (itemAt(seq.videoTracks[trackIndex], frame)) { return true; }
        }
        return false;
    }

    // ---------------------------------------------------------------- 0. preflight
    $.global.EP19_STEP = '0. preflight';
    // EP19_MODE: 'check' = 何も変更せずに準備状況だけ表示 / 'run' = 実行（パネルのボタンが設定）
    var MODE = (typeof EP19_MODE !== 'undefined' && EP19_MODE === 'check') ? 'check' : 'run';
    var CHECKS = [];      // [ok(bool), blocking(bool), text]
    function check(ok, blocking, text) { CHECKS.push([ok, blocking, text]); return ok; }
    function checkText() {
        var out = [], k;
        for (k = 0; k < CHECKS.length; k++) { out.push((CHECKS[k][0] ? '○ ' : (CHECKS[k][1] ? '× ' : '△ ')) + CHECKS[k][2]); }
        return out.join('\n');
    }
    function blocked() { for (var k = 0; k < CHECKS.length; k++) { if (!CHECKS[k][0] && CHECKS[k][1]) { return true; } } return false; }
    function finish(msg) { $.global.EP19_RESULT = msg; alert(msg); }

    if (!app.project || !app.project.path) { finish('Premiereでプロジェクトを開いてから実行してください。'); return; }
    var projFile = new File(app.project.path);
    var projDir = projFile.parent;
    var projName = nfc(decodeURI(projFile.name));

    // 安全装置: 名前に「確認用」を含む複製プロジェクトでしか動かない（元プロジェクトでは絶対に実行しない）
    check(projName.indexOf('確認用') >= 0, true, '開いているのは確認用の複製プロジェクト（' + projName + '）' +
        (projName.indexOf('確認用') >= 0 ? '' : '\n   → 元プロジェクトでは実行しません。Finderで複製して名前に「確認用」を付けたものを開いてください'));
    check(qeInit(), true, 'Premiere内部機能（QE DOM）が使える');

    var srcSeqs = findSeqByName(PLAN.sourceSequenceName);
    check(srcSeqs.length === 1, true, '元シーケンス「' + PLAN.sourceSequenceName + '」が1つだけある（' + srcSeqs.length + '件）');
    var srcSeq = srcSeqs.length === 1 ? srcSeqs[0] : null;
    if (srcSeq) { check(String(srcSeq.timebase) === String(TPF), true, '元シーケンスが30fps'); }
    check(!findSeqByName(PLAN.newSequenceName).length, true, '「' + PLAN.newSequenceName + '」がまだ無い（二重実行防止）');

    var assetDir = new Folder(projDir.fsName + '/episode19_assets');
    check(assetDir.exists, true, 'プロジェクトと同じフォルダに episode19_assets がある');
    var pngCount = 0, csvFound = false;
    if (assetDir.exists) {
        var pf = assetDir.getFiles('*.png'), cf = assetDir.getFiles('*.csv'), k0;
        for (k0 = 0; k0 < pf.length; k0++) { if (/^0[1-6]_/.test(nfc(decodeURI(pf[k0].name)))) { pngCount++; } }
        for (k0 = 0; k0 < cf.length; k0++) { if (/素材配置一覧/.test(nfc(decodeURI(cf[k0].name)))) { csvFound = true; } }
    }
    check(pngCount === 6, true, '写真 01〜06 のPNGが6枚ある（' + pngCount + '枚）');
    check(csvFound, true, '素材配置一覧.csv がある');

    var prevFile = new File(projDir.fsName + '/' + PLAN.previousProject.fileName);
    if (!prevFile.exists && assetDir.exists) { prevFile = new File(assetDir.fsName + '/' + PLAN.previousProject.fileName); }
    check(prevFile.exists, true, '前回プロジェクト「' + PLAN.previousProject.fileName + '」がある（読み込むだけで変更しません）');

    var tplDir = new Folder((assetDir.exists ? assetDir.fsName : projDir.fsName) + '/templates');
    function tpl(name) { var f = new File(tplDir.fsName + '/' + name); return f.exists ? f : null; }
    // MOGRTは任意。無ければ前回プロジェクトのタイトルをそのまま複製して文字だけ差し替える方式を試す
    var TPL_TITLE = tpl('title.mogrt'), TPL_EMPH = tpl('emphasis.mogrt'), TPL_DIAG = tpl('diagram.mogrt');
    check(true, false, 'テンプレート(.mogrt): ' + (TPL_TITLE || TPL_EMPH || TPL_DIAG ? '一部あり（優先して使用）' : 'なし → 前回タイトルの自動複製を試します（不要な準備はありません）'));

    var newProjPath = projDir.fsName + '/' + projName.replace(/\.prproj$/i, '') + '_自動編集案_v1.prproj';
    check(!new File(newProjPath).exists, true, '作業用プロジェクト「' + new File(newProjPath).displayName + '」がまだ無い');

    if (MODE === 'check') {
        finish('【確認のみ・何も変更していません】（スクリプト ' + SCRIPT_VERSION + '）\n\n' + checkText() + '\n\n' +
            (blocked() ? '× の項目を直してから、もう一度「確認」を押してください。' : 'すべて準備OKです。「実行」を押せます。'));
        return;
    }
    if (blocked()) { finish('準備が足りないため中止しました（何も変更していません）。\n\n' + checkText()); return; }

    // 実行の最終確認はパネル側で行う（ボタンを2回押す）。Premiere の confirm() は版によって引数エラーになるため使わない
    if (typeof EP19_CONFIRMED === 'undefined' || EP19_CONFIRMED !== true) {
        var ok = false;
        try { ok = confirm('確認用プロジェクト「' + projName + '」で自動編集を実行しますか？', false, '19 自動編集'); } catch (eCf) { ok = false; }
        if (!ok) { finish('実行を取り消しました（何も変更していません）。'); return; }
    }

    // ---------------------------------------------------------------- 1. save as (keep original project untouched)
    $.global.EP19_STEP = '1. save as (keep original project untouched)';
    app.project.saveAs(newProjPath);
    log('作業用プロジェクトとして保存: ' + newProjPath);
    srcSeq = findSeqByName(PLAN.sourceSequenceName)[0];

    // ---------------------------------------------------------------- 2. clone source sequence
    $.global.EP19_STEP = '2. clone source sequence';
    var before = seqIds();
    srcSeq.clone();
    var created = newSeqSince(before);
    if (created.length !== 1) { alert('シーケンスの複製に失敗しました。'); return; }
    var seq = created[0];
    seq.name = PLAN.newSequenceName;
    log('複製シーケンス作成: ' + seq.name);

    try { seq.projectItem.moveBin(getBin('シーケンス')); } catch (eMv) { }

    // トラック確保（V1話者 / V2基本テロップ / V3写真 / V4〜V7図解文字 / V8タイトル・強調、A2 BGM）
    var needV = Math.max(PLAN.tracks.photo, PLAN.tracks.diagram + PLAN.tracks.diagramCount - 1, PLAN.tracks.emphasis) + 1;
    var needA = PLAN.tracks.bgmAudio + 1;
    if (!ensureTracks(seq, needV, needA)) {
        alert('複製シーケンスに V' + needV + '/A' + needA + ' までトラックを追加できませんでした（QE DOM 無効）。\n' +
            '編集は行わずに中止します。作業用プロジェクト\n' + newProjPath + '\nを削除してから README の「うまく動かないとき」を確認してください。\n元のプロジェクトは変更されていません。');
        try { app.project.save(); } catch (eSv) { }
        return;
    }

    // ---------------------------------------------------------------- 3. CSV markers (before inserting highlights/openings)
    $.global.EP19_STEP = '3. CSV markers (before inserting highlights/openings)';
    var csvMarkers = [];
    (function () {
        var csv = null, files = assetDir.getFiles('*.csv'), k;
        for (k = 0; k < files.length; k++) { if (/素材配置一覧/.test(nfc(decodeURI(files[k].name))) || files.length === 1) { csv = files[k]; } }
        if (!csv) { fail('素材配置一覧.csv のマーカー化', 'CSVが episode19_assets に見つかりません', 0, seq); return; }
        csv.encoding = 'UTF-8';
        csv.open('r');
        var lines = csv.read().split(/\r\n|\n|\r/);
        csv.close();
        for (k = 1; k < lines.length; k++) {
            if (!trim(lines[k])) { continue; }
            var c = lines[k].split(',');
            if (c.length < 6) { continue; }
            var s = tcToFrames(c[1]), e = tcToFrames(c[2]);
            var m = addMarker(seq, s, e, 'CSV' + c[0] + ' ' + c[3], c[4] + ' ／ ' + c[5] + ' ／ 現在TC ' + c[1] + '〜' + c[2], 'cyan');
            if (m) { csvMarkers.push({ marker: m, start: s, end: e }); }
        }
        log('CSVマーカー: ' + csvMarkers.length + ' 件');
    })();

    // ---------------------------------------------------------------- 5. highlight subsequences (from the clone, before shifting)
    $.global.EP19_STEP = '5. highlight subsequences (from the clone, before shifting)';
    var seqBin = getBin('19_自動編集案_ネスト');
    function makeSubsequence(fromSeq, startFrame, endFrame, name) {
        var b = seqIds();
        fromSeq.setInPoint(sec(startFrame));
        fromSeq.setOutPoint(sec(endFrame));
        var sub = null;
        try { sub = fromSeq.createSubsequence(true); } catch (e) { }
        if (!sub) { var n = newSeqSince(b); sub = n.length ? n[0] : null; }
        try { fromSeq.setInPoint(0); fromSeq.setOutPoint(sec(framesOf(fromSeq.end))); } catch (e2) { }
        if (!sub) { return null; }
        sub.name = name;
        try { sub.projectItem.moveBin(seqBin); } catch (e3) { }
        var got = framesOf(sub.end);
        if (Math.abs(got - (endFrame - startFrame)) > 1) { log('注意: ' + name + ' の長さ ' + got + 'f（想定 ' + (endFrame - startFrame) + 'f）'); }
        return sub;
    }
    function removeItems(track) {
        var a = clipsOf(track), k;
        for (k = a.length - 1; k >= 0; k--) { try { a[k].remove(false, false); } catch (e) { } }
    }
    var HL_NAMES = ['HL①_ハイライト', 'HL②_ハイライト', 'HL③_ハイライト'];
    for (i = 0; i < HL.length; i++) {
        var sub = makeSubsequence(seq, HL[i].srcStart, HL[i].srcEnd, HL_NAMES[i] + '（' + HL[i].def.start + '〜' + HL[i].def.end + '）');
        HL[i].seq = sub;
        if (!sub) { fail(HL_NAMES[i] + ' の複製', 'サブシーケンスを作成できませんでした', HL[i].dstStart, null); continue; }
        // 前回デザインに合わせ、ハイライトには基本テロップを入れない（話者映像＋音声のみ）
        for (var vt = 1; vt < sub.videoTracks.numTracks; vt++) { removeItems(sub.videoTracks[vt]); }
        var a = clipsOf(sub.videoTracks[0]);
        for (var q = 0; q < a.length; q++) { if (isSpeakerClip(a[q])) { frameSpeaker(a[q], HL[i].def.scale); } }
        log(sub.name + ' 作成（' + HL[i].len + 'f, 画角' + speakerScale(HL[i].def.scale) + '%）');
    }

    // ---------------------------------------------------------------- 6. previous project → opening ①② (copies only)
    $.global.EP19_STEP = '6. previous project → opening ①② (copies only)';
    var prevSeq = null;
    (function () {
        var b = seqIds(), ok = false;
        try { ok = app.project.importSequences(prevFile.fsName, [PLAN.previousProject.mainSequenceUID]); } catch (e) { }
        var n = newSeqSince(b);
        if (!n.length) {
            log('importSequences 失敗。プロジェクト全体の読み込みに切り替えます。');
            try { app.project.importFiles([prevFile.fsName], true, getBin('前回プロジェクト_読込'), false); } catch (e2) { }
            n = newSeqSince(b);
        }
        var k, best = null;
        for (k = 0; k < n.length; k++) {
            if (sameName(n[k].name, PLAN.previousProject.mainSequenceName) || n[k].sequenceID === PLAN.previousProject.mainSequenceUID) {
                if (!best || n[k].videoTracks.numTracks > best.videoTracks.numTracks) { best = n[k]; }
            }
        }
        prevSeq = best;
    })();
    var OP = [null, null];
    if (!prevSeq) {
        fail('オープニング①②の複製', '前回プロジェクトのシーケンス「' + PLAN.previousProject.mainSequenceName + '」を読み込めませんでした', OP1_AT, null);
    } else {
        log('前回シーケンス読込: ' + prevSeq.name + '（V' + prevSeq.videoTracks.numTracks + '/A' + prevSeq.audioTracks.numTracks + '）');
        var defs = [PLAN.previousProject.opening1, PLAN.previousProject.opening2];
        var names = ['OP①_前回複製', 'OP②_前回複製'];
        for (i = 0; i < 2; i++) {
            var s0 = tcToFrames(defs[i].start), e0 = tcToFrames(defs[i].end);
            OP[i] = makeSubsequence(prevSeq, s0, e0, names[i] + '（前回' + defs[i].start + '〜' + defs[i].end + '）');
            if (!OP[i]) { fail(names[i], 'サブシーケンスを作成できませんでした', i === 0 ? OP1_AT : OP2_AT, null); continue; }
            if (defs[i].dropAudio) {   // BGM は下で一本のベッドとして敷くため、OP①内の音は外す（SEは使わない）
                for (var at2 = 0; at2 < OP[i].audioTracks.numTracks; at2++) { removeItems(OP[i].audioTracks[at2]); }
            }
            log(OP[i].name + ' 作成');
        }
    }

    // BGM info (前回の音量設計を基準)
    var BGM = null;
    if (prevSeq) {
        try {
            var bt = prevSeq.audioTracks[PLAN.previousProject.bgmTrackIndex];
            var bi = itemAt(bt, tcToFrames(PLAN.previousProject.bgmClipStart));
            if (bi && bi.projectItem) {
                var lp = levelProp(bi), lv = null;
                if (lp) {
                    if (lp.isTimeVarying()) { var keys = lp.getKeys(); lv = lp.getValueAtKey(keys[keys.length > 1 ? 1 : 0]); }
                    else { lv = lp.getValue(); }
                }
                BGM = { item: bi.projectItem, inSec: bi.inPoint.seconds, level: lv };
                log('BGM: ' + bi.projectItem.name + ' in=' + bi.inPoint.seconds + 's level=' + lv);
            }
        } catch (eB) { log('BGM情報の取得失敗: ' + eB); }
    }

    // ---------------------------------------------------------------- 8. make room: shift original clips & markers
    $.global.EP19_STEP = '8. make room: shift original clips & markers';
    (function () {
        var groups = [seq.videoTracks, seq.audioTracks], g, k, j, moved = 0, straddle = 0;
        for (g = 0; g < groups.length; g++) {
            for (k = 0; k < groups[g].numTracks; k++) {
                var a = clipsOf(groups[g][k]);
                a.sort(function (x, y) { return Number(y.start.ticks) - Number(x.start.ticks); });
                for (j = 0; j < a.length; j++) {
                    var s = framesOf(a[j].start), e = framesOf(a[j].end);
                    if (s < OP2_SRC && e > OP2_SRC) { straddle++; }
                    var off = new Time();
                    off.ticks = String((s >= OP2_SRC ? MAIN_SHIFT : PRE) * TPF);
                    try { a[j].move(off); moved++; } catch (eM) { log('移動失敗 ' + a[j].name + ' @' + fmt(s) + ': ' + eM); }
                }
            }
        }
        log('既存クリップ移動: ' + moved + ' 件（〜' + PLAN.opening2At + ' は +' + PRE + 'f / ' + PLAN.opening2At + '〜 は +' + MAIN_SHIFT + 'f）');
        if (straddle) { fail('オープニング②の挿入位置', straddle + ' 個のクリップが ' + PLAN.opening2At + ' をまたいでいます', OP2_AT, seq); }
        for (k = 0; k < csvMarkers.length; k++) {
            var cm = csvMarkers[k];
            try { cm.marker.start = sec(mapF(cm.start)); cm.marker.end = sec(mapF(cm.start) + (cm.end - cm.start)); }
            catch (eMk) { log('マーカー移動失敗: ' + cm.marker.name); }
        }
    })();

    // ---------------------------------------------------------------- 9. place highlights and openings on V1
    $.global.EP19_STEP = '9. place highlights and openings on V1';
    function placeNest(nestSeq, atFrame, label) {
        if (!nestSeq) { return null; }
        try { seq.videoTracks[0].overwriteClip(nestSeq.projectItem, sec(atFrame)); } catch (e) { }
        var ti = itemAt(seq.videoTracks[0], atFrame);
        if (!ti) { fail(label + ' の配置', 'V1 に配置できませんでした', atFrame, seq); return null; }
        addMarker(seq, atFrame, atFrame + framesOf(nestSeq.end), label, '', 'yellow');
        log(label + ' 配置 @' + fmt(atFrame));
        return ti;
    }
    var HL_ITEMS = [];
    for (i = 0; i < HL.length; i++) { HL_ITEMS.push(placeNest(HL[i].seq, HL[i].dstStart, ['ハイライト①', 'ハイライト②', 'ハイライト③'][i])); }
    placeNest(OP[0], OP1_AT, 'オープニング①');
    placeNest(OP[1], OP2_AT, 'オープニング②');
    addMarker(seq, PRE, OP2_AT, 'オープニングトーク（前半）', '現在 00:00.00〜' + PLAN.opening2At + '。最初の約3秒はインサートなし', 'yellow');
    addMarker(seq, OP2_AT + OP2_LEN, MAIN_AT, 'オープニングトーク（後半・自己紹介〜）', '現在 ' + PLAN.opening2At + '〜' + PLAN.openingTalkEnd, 'yellow');
    addMarker(seq, MAIN_AT, FINAL_END, '本編', '現在 ' + PLAN.openingTalkEnd + '〜' + PLAN.sourceDuration, 'yellow');

    // short fades between highlights (opacity + audio level, no SE)
    (function () {
        var F = PLAN.highlightFadeFrames, k;
        for (k = 0; k < HL_ITEMS.length; k++) {
            var ti = HL_ITEMS[k];
            if (!ti) { continue; }
            var inS = ti.inPoint.seconds, outS = ti.outPoint.seconds, f = sec(F);
            var fadeIn = k > 0, fadeOut = k < HL_ITEMS.length - 1;
            try {
                var op = opacityProp(ti), pairs = [];
                if (fadeIn) { pairs.push([inS, 0]); pairs.push([inS + f, 100]); }
                if (fadeOut) { pairs.push([outS - f, 100]); pairs.push([outS, 0]); }
                if (op && pairs.length) { keyframe(op, pairs); }
            } catch (e) { fail('ハイライト' + (k + 1) + ' 映像フェード', String(e), HL[k].dstStart, seq); }
            // linked audio on A1
            var au = itemAt(seq.audioTracks[0], HL[k].dstStart);
            try {
                var lp = au ? levelProp(au) : null;
                if (lp) {
                    var v = lp.getValue(), ap = [];
                    if (fadeIn) { ap.push([au.inPoint.seconds, 0]); ap.push([au.inPoint.seconds + f, v]); }
                    if (fadeOut) { ap.push([au.outPoint.seconds - f, v]); ap.push([au.outPoint.seconds, 0]); }
                    if (ap.length) { keyframe(lp, ap); }
                } else { fail('ハイライト' + (k + 1) + ' 音声フェード', 'A1 にネスト音声が見つかりません', HL[k].dstStart, seq); }
            } catch (e2) { fail('ハイライト' + (k + 1) + ' 音声フェード', String(e2), HL[k].dstStart, seq); }
        }
    })();

    // ---------------------------------------------------------------- 10. BGM bed (highlights → end of opening talk)
    $.global.EP19_STEP = '10. BGM bed (highlights → end of opening talk)';
    (function () {
        var aIdx = PLAN.tracks.bgmAudio;
        if (!BGM) { fail('BGM（' + PLAN.previousProject.bgmName + '）', '前回プロジェクトからBGMクリップを取得できませんでした', 0, seq); return; }
        if (seq.audioTracks.numTracks <= aIdx) { fail('BGM', 'A' + (aIdx + 1) + ' がありません', 0, seq); return; }
        // BGMはハイライト〜オープニングトーク前半のみ。オープニング②は前回の専用BGM、
        // 「こんにちは 意識の専門家」（オープニングトーク後半）以降はBGMなし（ご指示）
        function bed(startF, endF, inSec, fadeInF, fadeOutF, label) {
            try {
                BGM.item.setInPoint(inSec, 4);
                seq.audioTracks[aIdx].overwriteClip(BGM.item, sec(startF));
                try { BGM.item.clearInOutPoints(); } catch (eC) { }
                var ti = itemAt(seq.audioTracks[aIdx], startF);
                if (!ti) { throw new Error('配置後のクリップが見つかりません'); }
                if (framesOf(ti.end) > endF) { ti.end = T(endF); }
                if (framesOf(ti.end) < endF) { fail('BGMの長さ（' + label + '）', 'BGM素材が ' + fmt(endF) + ' まで届きません（' + fmt(framesOf(ti.end)) + 'で終了）', framesOf(ti.end), seq); }
                var lp = levelProp(ti);
                if (lp && BGM.level !== null) {
                    var a = ti.inPoint.seconds, b = ti.outPoint.seconds;
                    keyframe(lp, [[a, 0], [a + sec(fadeInF), BGM.level], [b - sec(fadeOutF), BGM.level], [b, 0]]);
                }
                log('BGM 配置（' + label + '） A' + (aIdx + 1) + ' ' + fmt(startF) + '〜' + fmt(endF));
            } catch (e) { fail('BGM 配置（' + label + '）', String(e), startF, seq); }
        }
        bed(0, OP2_AT, BGM.inSec, 10, 15, 'ハイライト〜オープニングトーク前半');
        USED.push(BGM.item.name + '（BGM・前回プロジェクトと同じ音量 ' + BGM.level + '。00:00〜オープニング②の手前まで。「こんにちは」以降はBGMなし）');
    })();

    // ---------------------------------------------------------------- 11. 画角（カット点のみ・途中ズームなし）
    $.global.EP19_STEP = '11. 画角（カット点のみ・途中ズームなし）';
    (function () {
        var k, j;
        // まず全ての話者クリップを基準の画角・位置にする
        var all = clipsOf(seq.videoTracks[0]), nb = 0;
        for (j = 0; j < all.length; j++) { if (isSpeakerClip(all[j]) && frameSpeaker(all[j], 100)) { nb++; } }
        log('話者の基準画角 ' + PLAN.speaker.baseScale + '%' + (PLAN.speaker.face ? '（顔を中央寄せ）' : '（位置は未調整）') + '：' + nb + 'クリップ');
        for (k = 0; k < PLAN.zoom.length; k++) {
            var z = PLAN.zoom[k], s = mapF(tcToFrames(z.start)), e = mapF(tcToFrames(z.end));
            var v1 = seq.videoTracks[0];
            if (!itemAt(v1, s)) {
                if (razorVideo(seq, 0, s)) { log('カット点追加（同一ショット内・内容変更なし）: ' + fmt(s)); }
                else { fail('画角' + z.scale + '%（' + z.reason + '）', fmt(s) + ' にカット点がなく、自動で分割できませんでした', s, seq); continue; }
            }
            if (!itemAt(v1, e) && e < FINAL_END) {
                if (!razorVideo(seq, 0, e)) { fail('画角' + z.scale + '%（' + z.reason + '）終点', fmt(e) + ' にカット点がありません', e, seq); }
            }
            var a = clipsOf(v1), n = 0;
            for (j = 0; j < a.length; j++) {
                var cs = framesOf(a[j].start), ce = framesOf(a[j].end);
                if (cs >= s && ce <= e && isSpeakerClip(a[j])) { if (frameSpeaker(a[j], z.scale)) { n++; } }
            }
            log('画角 ' + speakerScale(z.scale) + '%（基準×' + z.scale + '%） ' + fmt(s) + '〜' + fmt(e) + '（' + n + 'クリップ, ' + z.reason + '）');
            if (!n) { fail('画角' + z.scale + '%（' + z.reason + '）', '対象クリップが見つかりません', s, seq); }
        }
    })();

    // ---------------------------------------------------------------- 12. 写真インサート（episode19_assets の01〜06を直接参照）
    $.global.EP19_STEP = '12. 写真インサート（episode19_assets の01〜06を直接参照）';
    (function () {
        var files = assetDir.getFiles('*.png'), byNo = {}, k;
        for (k = 0; k < files.length; k++) {
            var nm = nfc(decodeURI(files[k].name)), m = nm.match(/^(\d\d)_/);
            if (m) { byNo[m[1]] = files[k]; }
        }
        var photoBin = getBin('19_インサート');
        function childByPrefix(bin, prefix) {
            for (var c = 0; c < bin.children.numItems; c++) {
                if (bin.children[c].name.indexOf(prefix) === 0 && /\.png$/i.test(bin.children[c].name)) { return bin.children[c]; }
            }
            return null;
        }
        var vIdx = PLAN.tracks.photo;
        for (k = 0; k < PLAN.photos.length; k++) {
            var p = PLAN.photos[k], f = byNo[p.file];
            var s = mapF(tcToFrames(p.start)), e = mapF(tcToFrames(p.end));
            if (!f) { MISSING.push(p.file + '_*.png（CSV' + p.no + '）'); fail('写真 CSV' + p.no, p.file + '_*.png が episode19_assets にありません', s, seq); continue; }
            var fname = nfc(decodeURI(f.name));
            var pi = childByPrefix(photoBin, p.file + '_');
            if (!pi) {
                app.project.importFiles([f.fsName], true, photoBin, false);
                pi = childByPrefix(photoBin, p.file + '_');
            }
            if (!pi) { fail('写真 ' + fname, '読み込みできませんでした', s, seq); continue; }
            if (seq.videoTracks.numTracks <= vIdx) { fail('写真 ' + fname, 'V' + (vIdx + 1) + ' がありません', s, seq); continue; }
            try {
                seq.videoTracks[vIdx].overwriteClip(pi, sec(s));
                var ti = itemAt(seq.videoTracks[vIdx], s);
                if (!ti) { throw new Error('配置後のクリップが見つかりません'); }
                ti.end = T(e);
                var fill = 1920 / 1672 * 100;   // 1672x941 → 1920x1080 を埋める倍率（約114.8%）
                var sp = findProp(motion(ti), ['スケール', 'Scale']);
                keyframe(sp, [[ti.inPoint.seconds, fill * p.from / 100], [ti.outPoint.seconds, fill * p.to / 100]]);
                USED.push(fname + '（CSV' + p.no + ' ' + p.start + '〜' + p.end + '）');
                log('写真 ' + fname + ' ' + fmt(s) + '〜' + fmt(e) + ' プッシュ ' + p.from + '→' + p.to + '%');
            } catch (eP) { fail('写真 ' + fname, String(eP), s, seq); }
        }
    })();

    // ---------------------------------------------------------------- 13. テキスト（前回デザインのMOGRT。ポイントテキストのまま編集可能）
    $.global.EP19_STEP = '13. テキスト（前回デザインのMOGRT。ポイントテキストのまま編集可能）';
    // MOGRT の文字差し替え。Premiere の版によって値の形が違うため、いくつかの形を順に試し、必ず読み直して確認する。
    var MGT_DIAG_DONE = false;
    function valueText(v) {   // 値から現在の文字列を取り出す（比較用）
        if (typeof v === 'string') {
            if (v.charAt(0) === '{') { try { var o = parseJSON(v); if (o && o.textEditValue !== undefined) { return String(o.textEditValue); } } catch (e) { } }
            return v;
        }
        if (v && typeof v === 'object' && v.textEditValue !== undefined) { return String(v.textEditValue); }
        return null;
    }
    function sameText(a, b) { return a !== null && String(a).replace(/\r\n|\n/g, '\r') === String(b).replace(/\r\n|\n/g, '\r'); }
    function tryProp(p, text) {
        var v = null;
        try { v = p.getValue(); } catch (e) { return false; }
        var cands = [];
        if (typeof v === 'string' && v.indexOf('textEditValue') >= 0) {
            try { var o = parseJSON(v); o.textEditValue = text; cands.push(toJSON(o)); } catch (e1) { }
        } else if (v && typeof v === 'object' && v.textEditValue !== undefined) {
            v.textEditValue = text; cands.push(toJSON(v)); cands.push(v);
        } else if (typeof v === 'string' && /テキスト|Text|text/.test(String(p.displayName) + '') ) {
            cands.push(text);
        } else if (typeof v === 'string' && v.length > 0 && v.length < 200 && /[぀-ヿ一-鿿]/.test(v)) {
            cands.push(text);   // 日本語の文字列そのもの（テンプレートの元の文言）
        }
        for (var c = 0; c < cands.length; c++) {
            try { p.setValue(cands[c], true); } catch (e2) { continue; }
            var after = null;
            try { after = p.getValue(); } catch (e3) { }
            if (sameText(valueText(after), text)) { return true; }
        }
        return false;
    }
    function dumpMgt(ti) {
        if (MGT_DIAG_DONE) { return; }
        MGT_DIAG_DONE = true;
        var out = ['MOGRT診断（' + ti.name + '）'], k, j, mgt = null;
        try { mgt = ti.getMGTComponent(); } catch (e) { out.push('getMGTComponent エラー: ' + e); }
        function dumpProps(label, comp) {
            for (j = 0; j < comp.properties.numItems; j++) {
                var p = comp.properties[j], v, t;
                try { v = p.getValue(); t = typeof v; } catch (e2) { v = 'ERR ' + e2; t = 'error'; }
                var shown = (t === 'object' && v !== null) ? toJSON(v) : String(v);
                out.push('  [' + label + '] ' + p.displayName + ' : ' + t + ' : ' + shown.substr(0, 300));
            }
        }
        if (mgt) { out.push('MGT: ' + mgt.displayName + '（' + mgt.properties.numItems + '項目）'); dumpProps('MGT', mgt); }
        else { out.push('MGT: なし'); }
        for (k = 0; k < ti.components.numItems; k++) {
            var c = ti.components[k];
            out.push('コンポーネント: ' + c.displayName + ' / ' + c.matchName);
            if (!/Motion|Opacity/.test(c.matchName)) { dumpProps(c.displayName, c); }
        }
        for (k = 0; k < out.length; k++) { log(out[k]); }
    }
    function setMogrtText(ti, text) {
        var mgt = null, k, c;
        try { mgt = ti.getMGTComponent(); } catch (e) { }
        if (mgt) { for (k = 0; k < mgt.properties.numItems; k++) { if (tryProp(mgt.properties[k], text)) { return true; } } }
        for (c = 0; c < ti.components.numItems; c++) {   // 予備：通常のコンポーネント側のテキスト項目
            var comp = ti.components[c];
            if (/Motion|Opacity/.test(comp.matchName)) { continue; }
            for (k = 0; k < comp.properties.numItems; k++) {
                var p = comp.properties[k];
                if (/ソーステキスト|Source Text|テキスト|Text/.test(String(p.displayName)) && tryProp(p, text)) { return true; }
            }
        }
        dumpMgt(ti);
        return false;
    }
    // ---- 方式B: MOGRTが無いとき、前回プロジェクトのタイトル（ポイントテキスト）をそのまま複製し、文字だけ差し替える
    //      各テキストは小さなネスト（中身は前回と同じグラフィック）になり、ダブルクリックで開けば通常どおり編集できる
    var DESIGN = null, NATIVE_OK = null, textBin = null;
    function designSeq() {
        if (DESIGN || !prevSeq) { return DESIGN; }
        var idx = PLAN.previousProject.titleTrackIndex, src = itemAt(prevSeq.videoTracks[idx], tcToFrames(PLAN.previousProject.titleAt));
        if (!src) { log('前回タイトルが見つかりません（V' + (idx + 1) + ' ' + PLAN.previousProject.titleAt + '）'); return null; }
        DESIGN = makeSubsequence(prevSeq, framesOf(src.start), framesOf(src.end), 'デザイン元_前回タイトル');
        if (!DESIGN) { return null; }
        for (var v = 0; v < DESIGN.videoTracks.numTracks; v++) { if (v !== idx) { removeItems(DESIGN.videoTracks[v]); } }
        for (var a = 0; a < DESIGN.audioTracks.numTracks; a++) { removeItems(DESIGN.audioTracks[a]); }
        textBin = getBin('19_自動編集案_テキスト');
        return DESIGN;
    }
    function rewriteNativeText(ti, text) {
        for (var k = 0; k < ti.components.numItems; k++) {
            var p = findProp(ti.components[k], ['ソーステキスト', 'Source Text']);
            if (!p) { continue; }
            var v = null;
            try { v = p.getValue(); } catch (e) { return false; }
            if (typeof v !== 'string' || v.charAt(0) !== '{') { return false; }   // 中身が読めない版では書き換えない
            try {
                var o = parseJSON(v);
                if (o.textEditValue === undefined) { return false; }
                o.textEditValue = text;
                p.setValue(toJSON(o), true);
                var chk = parseJSON(p.getValue());
                return chk.textEditValue === text;
            } catch (e2) { return false; }
        }
        return false;
    }
    function placeTextNative(vIdx, s, e, text, label, pos, scale) {
        if (NATIVE_OK === false || !designSeq()) { return null; }
        var b = seqIds();
        DESIGN.clone();
        var n = newSeqSince(b);
        if (!n.length) { NATIVE_OK = false; return null; }
        var c = n[0], g = clipsOf(c.videoTracks[PLAN.previousProject.titleTrackIndex])[0];
        if (!g || !rewriteNativeText(g, text)) {
            try { app.project.deleteSequence(c); } catch (eD) { }
            if (NATIVE_OK === null) { log('前回タイトルの文字差し替えは、このPremiereでは使えませんでした'); }
            NATIVE_OK = false;
            return null;
        }
        NATIVE_OK = true;
        try { g.end = T(framesOf(g.start) + (e - s)); } catch (eE) { }
        c.name = label + '_' + oneLine(text);
        try { c.projectItem.moveBin(textBin); } catch (eB) { }
        try { seq.videoTracks[vIdx].overwriteClip(c.projectItem, sec(s)); } catch (eO) { }
        var ti = itemAt(seq.videoTracks[vIdx], s);
        if (!ti) { return null; }
        if (framesOf(ti.end) !== e) { try { ti.end = T(e); } catch (eT) { } }
        if (scale) { setScale(ti, scale); }
        if (pos) { setPosition(ti, pos[0], pos[1]); }
        return ti;
    }
    function placeText(tplFile, vIdx, s, e, text, label, pos) {
        if (!tplFile) {
            if (seq.videoTracks.numTracks > vIdx) {
                var nt = placeTextNative(vIdx, s, e, text, label, pos, pos ? PLAN.diagramTextScale : null);
                if (nt) {
                    if (pos) { addMarker(seq, s, null, '確認: ' + label + '「' + oneLine(text) + '」の位置', '前回タイトルを縮小して配置。図形と合わせて位置を微調整', 'white'); }
                    return nt;
                }
            }
            fail(label + '「' + oneLine(text) + '」', '前回デザインのテキストを自動で複製できませんでした（README「テキストを自動で作れなかったとき」参照）。ポイントテキストで手動作成してください', s, seq);
            return null;
        }
        if (seq.videoTracks.numTracks <= vIdx) { fail(label + '「' + oneLine(text) + '」', 'V' + (vIdx + 1) + ' がありません', s, seq); return null; }
        var ti = null;
        try { ti = seq.importMGT(tplFile.fsName, String(s * TPF), vIdx, PLAN.tracks.bgmAudio + 1); } catch (e) { }
        if (!ti) { ti = itemAt(seq.videoTracks[vIdx], s); }
        if (!ti) { fail(label + '「' + oneLine(text) + '」', 'MOGRTを配置できませんでした', s, seq); return null; }
        try { ti.end = T(e); } catch (e2) { }
        if (!setMogrtText(ti, text)) { fail(label + '「' + oneLine(text) + '」', 'テンプレートは置けましたが文字を書き換えられませんでした', s, seq); }
        if (pos) { setPosition(ti, pos[0], pos[1]); }
        try { ti.name = label + '_' + oneLine(text); } catch (e3) { }
        return ti;
    }
    // テキスト用ネストの（空の）音声が話者音声・BGMを上書きしないよう、配置中は音声トラックをロックし、前後で一致を確認する
    function audioSnapshot() {
        var out = [], k, j, a;
        for (k = 0; k < seq.audioTracks.numTracks; k++) {
            a = clipsOf(seq.audioTracks[k]);
            for (j = 0; j < a.length; j++) { out.push(k + ':' + a[j].start.ticks + '-' + a[j].end.ticks); }
        }
        return out.join('|');
    }
    function lockAudio(b) {
        for (var k = 0; k < seq.audioTracks.numTracks; k++) { try { seq.audioTracks[k].setLocked(b); } catch (e) { } }
    }
    var AUDIO_BEFORE = audioSnapshot();
    lockAudio(true);
    (function () {
        var k, j;
        // ハイライトタイトル
        for (k = 0; k < HL.length; k++) {
            placeText(TPL_TITLE, PLAN.tracks.emphasis, HL[k].dstStart, HL[k].dstStart + HL[k].len, HL[k].def.title, 'ハイライト' + (k + 1) + 'タイトル');
        }
        // 強調テロップ
        for (k = 0; k < PLAN.emphasis.length; k++) {
            var em = PLAN.emphasis[k];
            placeText(TPL_EMPH, PLAN.tracks.emphasis, mapF(tcToFrames(em.start)), mapF(tcToFrames(em.end)), em.text, '強調');
        }
        // 図解（文字は段階表示。図形・矢印は手動）
        for (k = 0; k < PLAN.diagrams.length; k++) {
            var d = PLAN.diagrams[k], ds = mapF(tcToFrames(d.start)), de = mapF(tcToFrames(d.end));
            addMarker(seq, ds, de, '図解' + d.id + '｜' + d.title, '図形・矢印・円はPremiereのシェイプで手動作成（スクリプトAPIではシェイプを生成できないため）: ' + d.shapes, 'orange');
            FAILS.push({ what: '図解' + d.id + ' のシェイプ・矢印', why: 'Premiere のスクリプトAPIにシェイプ生成機能がないため。' + d.shapes, at: ds });
            for (j = 0; j < d.items.length; j++) {
                var it = d.items[j];
                // 段階表示で前の項目を残したまま重ねるため、項目ごとに別トラック（V4〜）に置く
                placeText(TPL_DIAG, PLAN.tracks.diagram + (j % PLAN.tracks.diagramCount), mapF(tcToFrames(it.at)), de, it.text, '図解' + d.id, [it.x, it.y]);
            }
        }
    })();
    lockAudio(false);
    (function () {   // 念のため、テキスト用ネストの音声クリップが残っていたら外す
        var k, j, a, removed = 0;
        for (k = 0; k < seq.audioTracks.numTracks; k++) {
            a = clipsOf(seq.audioTracks[k]);
            for (j = a.length - 1; j >= 0; j--) {
                try {
                    if (a[j].projectItem && a[j].projectItem.treePath && textBin && a[j].projectItem.treePath.indexOf(textBin.name) >= 0) { a[j].remove(false, false); removed++; }
                } catch (e) { }
            }
        }
        if (removed) { log('テキスト用ネストの音声 ' + removed + ' 件を除去'); }
        if (audioSnapshot() !== AUDIO_BEFORE) {
            fail('音声の保護チェック', 'テキスト配置の前後で音声トラックの内容が変わりました。話者音声・BGMが上書きされた可能性があります。この確認用プロジェクトは使わず、状況をお知らせください', 0, seq);
            QC.push('× 音声保護チェック: 不一致（要確認）');
        } else { QC.push('○ 音声保護チェック: テキスト配置で音声は変化していません'); }
    })();

    // ---------------------------------------------------------------- 14. 色補正（Lumetri。後から変更可能）
    $.global.EP19_STEP = '14. 色補正（Lumetri。後から変更可能）';
    (function () {
        var c = PLAN.color;
        var targets = [seq];
        for (var k = 0; k < HL.length; k++) { if (HL[k].seq) { targets.push(HL[k].seq); } }
        var fx = QE_OK ? qeEffect(['Lumetri カラー', 'Lumetri Color']) : null;
        if (!fx) { fail('Lumetri カラー適用', 'QE DOM でエフェクトを取得できませんでした。話者クリップにLumetriを手動適用してください（開始目安: ' + c.note + '）', PRE, seq); return; }
        var applied = 0, setOk = 0;
        for (var t = 0; t < targets.length; t++) {
            var sq = targets[t], qs = qeSeqOf(sq);
            if (!qs) { continue; }
            var qTrack = qs.getVideoTrackAt(0), a = clipsOf(sq.videoTracks[0]);
            for (var j = 0; j < a.length; j++) {
                if (!isSpeakerClip(a[j])) { continue; }
                var qi = qeItemAt(qTrack, framesOf(a[j].start));
                if (!qi) { continue; }
                try { qi.addVideoEffect(fx); applied++; } catch (e) { continue; }
                var lc = findComponent(a[j], ['Lumetri カラー', 'Lumetri Color'], /Lumetri/);
                var vals = [[['露光量', 'Exposure'], c.exposure], [['コントラスト', 'Contrast'], c.contrast],
                    [['ハイライト', 'Highlights'], c.highlights], [['白レベル', 'Whites'], c.whites], [['彩度', 'Saturation'], c.saturation]];
                var okAll = !!lc;
                for (var v = 0; v < vals.length && lc; v++) {
                    var p = findProp(lc, vals[v][0]);
                    try { if (p) { p.setValue(vals[v][1], true); } else { okAll = false; } } catch (e2) { okAll = false; }
                }
                if (okAll) { setOk++; }
            }
        }
        activate(seq);
        log('Lumetri 適用: ' + applied + ' クリップ（数値設定成功 ' + setOk + '）');
        addMarker(seq, PRE, null, '色補正：要スコープ確認', '露光量' + c.exposure + ' / コントラスト+' + c.contrast + ' / ハイライト' + c.highlights + ' / 白レベル' + c.whites + ' / 彩度' + c.saturation + '。' + c.note, 'purple');
        if (setOk < applied) { fail('Lumetri 数値設定', (applied - setOk) + ' クリップで一部パラメーターを設定できませんでした', PRE, seq); }
    })();

    // ---------------------------------------------------------------- 15. review markers
    $.global.EP19_STEP = '15. review markers';
    for (i = 0; i < PLAN.review.length; i++) {
        var r = PLAN.review[i];
        addMarker(seq, mapF(tcToFrames(r.at)), mapF(tcToFrames(r.end)), '確認', r.text, 'white');
        FAILS.push({ what: '確認事項', why: r.text, at: mapF(tcToFrames(r.at)) });
    }
    addMarker(seq, mapF(tcToFrames('04:14.67')), mapF(tcToFrames('04:19.50')), '確認：図解Cと強調テロップが重なる', '図解C表示中に強調テロップ「高い次元も 低い次元も／愛である」。レイアウトが干渉しないか確認', 'white');

    // ---------------------------------------------------------------- 16. automatic QC
    $.global.EP19_STEP = '16. automatic QC';
    (function () {
        var k, a, prev, gaps;
        // V1 / A1 continuity
        var names = [['V1（映像）', seq.videoTracks[0]], ['A1（話者音声）', seq.audioTracks[0]]];
        for (k = 0; k < names.length; k++) {
            a = clipsOf(names[k][1]);
            a.sort(function (x, y) { return Number(x.start.ticks) - Number(y.start.ticks); });
            prev = 0; gaps = [];
            for (var j = 0; j < a.length; j++) {
                var s = framesOf(a[j].start);
                if (s > prev) { gaps.push(fmt(prev) + '〜' + fmt(s)); }
                prev = Math.max(prev, framesOf(a[j].end));
            }
            if (prev < FINAL_END) { gaps.push(fmt(prev) + '〜' + fmt(FINAL_END)); }
            QC.push(names[k][0] + ' の空き（黒画面/無音の可能性）: ' + (gaps.length ? gaps.join(', ') : 'なし'));
            for (var g = 0; g < gaps.length; g++) {
                addMarker(seq, tcToFramesFromFmt(gaps[g].split('〜')[0]), null, 'QC: ' + names[k][0] + ' 空き', gaps[g], 'red');
            }
        }
        // offline media
        var items = allItems(app.project.rootItem), off = [];
        for (k = 0; k < items.length; k++) {
            try { if (items[k].type === ProjectItemType.CLIP && items[k].isOffline()) { off.push(items[k].name); } } catch (e) { }
        }
        QC.push('オフライン素材: ' + (off.length ? off.join(', ') : 'なし'));
        for (k = 0; k < off.length; k++) { MISSING.push(off[k] + '（オフライン）'); }
        // order / length
        QC.push('想定全長: ' + fmt(FINAL_END) + ' / 実際: ' + fmt(framesOf(seq.end)));
        QC.push('構成: HL① 00:00:00 → HL② ' + fmt(HL[1].dstStart) + ' → HL③ ' + fmt(HL[2].dstStart) + ' → OP① ' + fmt(OP1_AT) +
            ' → オープニングトーク前半 ' + fmt(PRE) + ' → OP② ' + fmt(OP2_AT) + ' → オープニングトーク後半 ' + fmt(OP2_AT + OP2_LEN) + ' → 本編 ' + fmt(MAIN_AT));
        QC.push('テロップのはみ出し・インサートの文頭/文末・音の切れ: 自動判定できないため、確認用MP4で目視確認してください');
    })();
    function tcToFramesFromFmt(s) { var p = s.split(':'); return (parseInt(p[0], 10) * 60 + parseInt(p[1], 10)) * PLAN.fps + parseInt(p[2], 10); }

    // ---------------------------------------------------------------- 17. review sequence with timecode + MP4
    $.global.EP19_STEP = '17. review sequence with timecode + MP4';
    var mp4Path = projDir.fsName + '/' + PLAN.newSequenceName + '_確認用TC.mp4';
    (function () {
        var rs = null, b = seqIds();
        try { rs = app.project.createNewSequenceFromClips(PLAN.reviewSequenceName, [seq.projectItem], seqBin); } catch (e) { }
        if (!rs) { var n = newSeqSince(b); rs = n.length ? n[0] : null; }
        if (!rs) { fail('確認用シーケンス', '作成できませんでした', null, null); return; }
        var tcOk = false;
        var fx = QE_OK ? qeEffect(['タイムコード', 'Timecode']) : null;
        var qs = qeSeqOf(rs);
        if (fx && qs) {
            var qi = qeItemAt(qs.getVideoTrackAt(0), 0);
            try { if (qi) { qi.addVideoEffect(fx); tcOk = true; } } catch (e2) { }
        }
        if (!tcOk) { fail('確認用MP4のタイムコード焼き込み', 'タイムコードエフェクトを適用できませんでした（README の ffmpeg 手順で代替可）', null, null); }
        // preset
        var preset = null, dirs = Folder('/Applications').getFiles('Adobe Media Encoder*'), k, j;
        for (k = 0; k < dirs.length && !preset; k++) {
            var apps = dirs[k].getFiles('*.app');
            for (j = 0; j < apps.length && !preset; j++) {
                var h264 = new Folder(apps[j].fsName + '/Contents/MediaIO/systempresets/4E49434B_48323634');
                if (!h264.exists) { continue; }
                var eprs = h264.getFiles('*.epr');
                for (var x = 0; x < eprs.length; x++) {
                    var en = decodeURI(eprs[x].name);
                    if (/Match Source - High bitrate|ソースの一致 - 高速ビットレート|ソースの一致 - 高ビットレート/.test(en)) { preset = eprs[x]; break; }
                }
            }
        }
        if (!preset) { fail('確認用MP4の書き出し', 'H.264 プリセットが見つからないため省略しました。確認用シーケンス「' + PLAN.reviewSequenceName + '」を ファイル > 書き出し > メディア で書き出してください', null, null); return; }
        activate(rs);
        var res = null;
        try { res = rs.exportAsMediaDirect(mp4Path, preset.fsName, app.encoder.ENCODE_ENTIRE); } catch (e3) { res = String(e3); }
        if (new File(mp4Path).exists) { log('確認用MP4: ' + mp4Path); }
        else { fail('確認用MP4の書き出し', '書き出し結果: ' + res, null, null); }
    })();

    // ---------------------------------------------------------------- 18. save + report
    $.global.EP19_STEP = '18. save + report';
    activate(seq);
    try { app.project.save(); } catch (eS) { }

    (function () {
        var k, out = [];
        out.push('# 19_ディセンション恐れすぎ問題 自動編集レポート（スクリプト ' + SCRIPT_VERSION + '）');
        out.push('');
        out.push('- 作業用プロジェクト: ' + newProjPath);
        out.push('- 元プロジェクト（未変更）: ' + projFile.fsName);
        out.push('- 編集シーケンス: ' + PLAN.newSequenceName);
        out.push('- 確認用MP4: ' + (new File(mp4Path).exists ? mp4Path : '未書き出し'));
        out.push('');
        out.push('## 使用素材');
        for (k = 0; k < USED.length; k++) { out.push('- ' + USED[k]); }
        out.push('- 前回プロジェクト複製: OP①（前回 ' + PLAN.previousProject.opening1.start + '〜' + PLAN.previousProject.opening1.end + '）, OP②（前回 ' + PLAN.previousProject.opening2.start + '〜' + PLAN.previousProject.opening2.end + '）');
        out.push('- テンプレート: タイトル=' + (TPL_TITLE ? TPL_TITLE.fsName : 'なし') + ' / 強調=' + (TPL_EMPH ? TPL_EMPH.fsName : 'なし') + ' / 図解=' + (TPL_DIAG ? TPL_DIAG.fsName : 'なし'));
        out.push('');
        out.push('## 不足素材');
        if (!MISSING.length) { out.push('- なし'); }
        for (k = 0; k < MISSING.length; k++) { out.push('- ' + MISSING[k]); }
        out.push('');
        out.push('## 自動配置できなかった項目（タイムラインに赤/橙マーカーあり）');
        if (!FAILS.length) { out.push('- なし'); }
        for (k = 0; k < FAILS.length; k++) {
            out.push('- ' + (FAILS[k].at !== null && FAILS[k].at !== undefined ? '[' + fmt(FAILS[k].at) + '] ' : '') + FAILS[k].what + ' — ' + FAILS[k].why);
        }
        out.push('');
        out.push('## 自動チェック');
        for (k = 0; k < QC.length; k++) { out.push('- ' + QC[k]); }
        out.push('');
        out.push('## 実行ログ');
        for (k = 0; k < LOG.length; k++) { out.push('- ' + LOG[k]); }
        var rf = new File(projDir.fsName + '/' + PLAN.newSequenceName + '_レポート.md');
        rf.encoding = 'UTF-8';
        rf.lineFeed = 'Unix';
        rf.open('w');
        rf.write(out.join('\n') + '\n');
        rf.close();
        finish('完了しました（確認用プロジェクトのみ変更）。\n\n未処理/要確認: ' + FAILS.length + ' 件\nレポート: ' + rf.fsName);
    })();
})();
