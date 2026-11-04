#!/usr/bin/env node
// Dry-run harness: runs dist/episode19_auto_edit.jsx against a minimal mock of the
// Premiere Pro ExtendScript + QE object model, built from timeline fixtures.
//
//   node tools/mock_premiere_test.js <cur.json> <prev.json> <work-dir-with-episode19_assets> [--no-templates] [--no-qe]
//
// Fixtures: {name, uid, video:[[{s,e,name,text}]], audio:[[...]]} in frames (30fps).
// This only checks the script's own logic (ordering, timing, fallbacks, report);
// it cannot prove real Premiere API behaviour.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const [curPath, prevPath, workDir] = process.argv.slice(2);
const NO_TPL = process.argv.includes('--no-templates');
const NO_QE = process.argv.includes('--no-qe');
const JSON_TEXT = process.argv.includes('--json-text');   // ソーステキストがJSONで読める版を想定
const MODE = process.argv.includes('--check') ? 'check' : 'run';
const TPS = 254016000000, TPF = TPS / 30;
const cur = JSON.parse(fs.readFileSync(curPath, 'utf8'));
const prev = JSON.parse(fs.readFileSync(prevPath, 'utf8'));

// ------------------------------------------------------------------ Time
class Time {
  constructor() { this._t = 0; }
  get ticks() { return String(this._t); }
  set ticks(v) { this._t = Number(v); }
  get seconds() { return this._t / TPS; }
  set seconds(v) { this._t = Math.round(v * TPS); }
}
const T = (ticks) => { const t = new Time(); t._t = ticks; return t; };
const toTicks = (v) => (v instanceof Time ? v._t : typeof v === 'string' ? Number(v) : Math.round(v * TPS));

// ------------------------------------------------------------------ properties / components
class Prop {
  constructor(name, value) { this.displayName = name; this.value = value; this.keys = null; }
  getValue() { return this.value; }
  setValue(v) { this.value = v; return 0; }
  isTimeVarying() { return !!this.keys; }
  setTimeVarying(b) { this.keys = b ? [] : null; }
  addKey(t) { this.keys.push([t, this.value]); }
  setValueAtKey(t, v) { const k = this.keys.find((x) => x[0] === t); if (!k) throw new Error('no key'); k[1] = v; }
  getKeys() { return (this.keys || []).map((k) => k[0]); }
  getValueAtKey(t) { return this.keys.find((x) => x[0] === t)[1]; }
}
const coll = (arr) => { const o = arr.slice(); o.numItems = arr.length; return o; };
function comp(displayName, matchName, props) {
  return { displayName, matchName, properties: coll(props) };
}
function videoComponents(kind, text) {
  const c = [
    comp('不透明度', 'AE.ADBE Opacity', [new Prop('不透明度', 100)]),
    comp('モーション', 'AE.ADBE Motion', [new Prop('位置', [0.5, 0.5]), new Prop('スケール', 100)]),
  ];
  if (kind === 'graphic') c.push(comp('テキスト', 'AE.ADBE Text', [new Prop('ソーステキスト', JSON_TEXT ? JSON.stringify({ textEditValue: text || '' }) : text)]));
  return c;
}
const audioComponents = () => [comp('ボリューム', 'Internal Volume', [new Prop('レベル', 0.1778)])];

// ------------------------------------------------------------------ project items
let uid = 0;
class ProjectItem {
  get treePath() { let p = this, out = []; while (p) { out.unshift(p.name); p = p.parent; } return '\\' + out.join('\\'); }
  constructor(name, type, extra) {
    this.name = name; this.type = type; this.nodeId = 'n' + (++uid);
    this.children = coll([]); Object.assign(this, extra || {});
  }
  createBin(name) { const b = new ProjectItem(name, 2); b.parent = this; this._add(b); return b; }
  _add(it) { const a = Array.from(this.children); a.push(it); this.children = coll(a); it.parent = this; }
  moveBin(bin) { const a = Array.from(this.parent.children).filter((x) => x !== this); this.parent.children = coll(a); bin._add(this); }
  isOffline() { return !!this.offline; }
  setInPoint(s) { this.inPoint = toTicks(s); }
  clearInOutPoints() { this.inPoint = 0; }
}
const ProjectItemType = { CLIP: 1, BIN: 2, ROOT: 3, FILE: 4 };

// ------------------------------------------------------------------ track items / tracks / sequences
class TrackItem {
  constructor(track, s, e, opts) {
    this.track = track; this._s = s; this._e = e; this.name = opts.name;
    this.projectItem = opts.projectItem || null; this._in = opts.inTicks || 0;
    this.components = coll(opts.components || []); this.mgt = opts.mgt || null;
  }
  get start() { return T(this._s); }
  get end() { return T(this._e); }
  set end(v) { this._e = toTicks(v); }
  get inPoint() { return T(this._in); }
  get outPoint() { return T(this._in + this._e - this._s); }
  move(off) {
    const d = toTicks(off), ns = this._s + d, ne = this._e + d;
    for (const o of this.track.items) {
      if (o !== this && o._s < ne && o._e > ns) throw new Error('overlap on move ' + this.name);
    }
    this._s = ns; this._e = ne;
  }
  remove() { this.track.items = this.track.items.filter((x) => x !== this); return 0; }
  getMGTComponent() { return this.mgt; }
}
class Track {
  constructor(seq, kind) { this.seq = seq; this.kind = kind; this.items = []; this.locked = false; }
  setLocked(b) { this.locked = !!b; }
  get clips() { return coll(this.items.slice().sort((a, b) => a._s - b._s)); }
  _overwrite(it) {
    const out = [];
    for (const o of this.items) {
      if (o._e <= it._s || o._s >= it._e) out.push(o);
      else {
        if (o._s < it._s) { const l = Object.create(o); Object.assign(l, o); l._e = it._s; out.push(l); }
        if (o._e > it._e) { const r = Object.create(o); Object.assign(r, o); r._in += it._e - o._s; r._s = it._e; out.push(r); }
      }
    }
    out.push(it); this.items = out;
  }
  overwriteClip(pi, t) {
    const s = toTicks(t);
    let len = pi.seq ? pi.seq._end() : pi.isStill ? 5 * TPS : pi.duration;
    const inT = pi.inPoint || 0;
    if (!pi.isStill && !pi.seq) len -= inT;
    if (this.kind === 'video') {
      this._overwrite(new TrackItem(this, s, s + len, { name: pi.name, projectItem: pi, components: videoComponents('clip') }));
      if ((pi.seq || pi.hasAudio) && !this.seq.audioTracks[0].locked) {
        this.seq.audioTracks[0]._overwrite(new TrackItem(this.seq.audioTracks[0], s, s + len, { name: pi.name, projectItem: pi, components: audioComponents() }));
      }
    } else {
      this._overwrite(new TrackItem(this, s, s + len, { name: pi.name, projectItem: pi, inTicks: inT, components: audioComponents() }));
    }
    return true;
  }
}
const trackColl = (arr) => { const o = arr.slice(); o.numTracks = arr.length; return o; };
class Sequence {
  get name() { return this._name; }
  set name(v) { this._name = v; if (this.projectItem) this.projectItem.name = v; }
  constructor(name, id) {
    this._name = name; this.sequenceID = id; this.timebase = String(TPF);
    this.videoTracks = trackColl([]); this.audioTracks = trackColl([]);
    this.markerList = []; const self = this;
    this.markers = {
      createMarker(s) {
        const m = { start: s, end: s, name: '', comments: '', setColorByIndex() {}, setTypeAsComment() {} };
        self.markerList.push(m); return m;
      },
    };
    this.projectItem = new ProjectItem(name, 1, { seq: this });
    this._in = 0; this._out = null;
  }
  _end() { let m = 0; for (const g of [this.videoTracks, this.audioTracks]) for (const t of g) for (const i of t.items) m = Math.max(m, i._e); return m; }
  get end() { return T(this._end()); }
  setInPoint(s) { this._in = toTicks(s); }
  setOutPoint(s) { this._out = toTicks(s); }
  addTracks(nv, na) {
    const v = Array.from(this.videoTracks), a = Array.from(this.audioTracks);
    for (let i = 0; i < nv; i++) v.push(new Track(this, 'video'));
    for (let i = 0; i < na; i++) a.push(new Track(this, 'audio'));
    this.videoTracks = trackColl(v); this.audioTracks = trackColl(a);
  }
  _copyRange(name, a, b) {
    const s = newSeq(name);
    s.addTracks(this.videoTracks.length, this.audioTracks.length);
    [['videoTracks'], ['audioTracks']].forEach(([g]) => this[g].forEach((t, k) => {
      for (const it of t.items) {
        const ns = Math.max(it._s, a), ne = Math.min(it._e, b);
        if (ne <= ns) continue;
        const c = new TrackItem(s[g][k], ns - a, ne - a, { name: it.name, projectItem: it.projectItem, inTicks: it._in + (ns - it._s),
          components: g === 'videoTracks' ? videoComponents(it.components.some((x) => x.displayName === 'テキスト') ? 'graphic' : 'clip', it._text) : audioComponents() });
        c._text = it._text; s[g][k].items.push(c);
      }
    }));
    return s;
  }
  clone() { const s = this._copyRange(this.name + ' のコピー', 0, 1e18); s.markerList = []; return true; }
  createSubsequence() { return this._copyRange(this.name + ' サブシーケンス', this._in, this._out == null ? this._end() : this._out); }
  importMGT(p, ticks, v) {
    if (!fs.existsSync(p)) throw new Error('mogrt missing');
    const s = Number(ticks);
    const prop = new Prop('テキスト', JSON.stringify({ textEditValue: 'TEMPLATE', fontEditValue: ['YuMin-Medium'] }));
    const it = new TrackItem(this.videoTracks[v], s, s + 5 * TPS, { name: path.basename(p), components: videoComponents('mogrt'), mgt: comp('グラフィックのパラメーター', 'mgt', [prop]) });
    this.videoTracks[v]._overwrite(it); return it;
  }
  exportAsMediaDirect(out) { fs.writeFileSync(out, 'mock'); return 'ok'; }
}

// ------------------------------------------------------------------ project
const root = new ProjectItem('Root Bin', 3);
const sequences = [];
function newSeq(name) {
  const s = new Sequence(name, 'seq-' + (++uid));
  sequences.push(s); root._add(s.projectItem); return s;
}
function buildSeq(fx, mediaName, isMovRe) {
  const s = newSeq(fx.name);
  s.sequenceID = fx.uid;
  s.addTracks(fx.video.length, fx.audio.length);
  const media = {};
  const pi = (n) => media[n] || (media[n] = (() => { const p = new ProjectItem(n, 1, { duration: 1e18, hasAudio: /\.(mov|mp4)$/i.test(n), isStill: /\.(png|jpg)$/i.test(n) }); root._add(p); return p; })());
  fx.video.forEach((tr, k) => tr.forEach((c) => {
    const graphic = !!c.text || c.name === 'グラフィック' || !/\.\w{3,4}$|^(01|LINE|白|調整レイヤー)$/.test(c.name);
    const it = new TrackItem(s.videoTracks[k], c.s * TPF, c.e * TPF, { name: c.name, projectItem: graphic ? null : pi(c.name),
      components: videoComponents(graphic ? 'graphic' : 'clip', c.text) });
    it._text = c.text; s.videoTracks[k].items.push(it);
  }));
  fx.audio.forEach((tr, k) => tr.forEach((c) => {
    s.audioTracks[k].items.push(new TrackItem(s.audioTracks[k], c.s * TPF, c.e * TPF, { name: c.name, projectItem: pi(c.name), components: audioComponents() }));
  }));
  return s;
}
const curSeq = buildSeq(cur);
const projPath = path.join(workDir, '覚醒体験した人、ディセンション恐れすぎ問題_確認用.prproj');
fs.writeFileSync(projPath, 'mock');
const prevFile = path.join(workDir, '二極化の時代へ！覚醒する人が手放した5つのもの_修正 1.prproj');
fs.writeFileSync(prevFile, 'mock');

let active = curSeq;
const project = {
  path: projPath, rootItem: root,
  get sequences() { const a = sequences.slice(); a.numSequences = a.length; return a; },
  saveAs(p) { this.path = p; fs.writeFileSync(p, 'mock'); },
  save() {},
  deleteSequence(s) { sequences.splice(sequences.indexOf(s), 1); s.projectItem.parent && s.projectItem.moveBin(new ProjectItem('trash', 2)); return true; },
  importSequences(p, ids) { buildSeq(prev); return true; },
  importFiles(paths, ui, bin) {
    for (const p of paths) bin._add(new ProjectItem(path.basename(p), 1, { isStill: true, file: p }));
    return true;
  },
  openSequence(id) { active = sequences.find((s) => s.sequenceID === id); },
  set activeSequence(s) { active = s; },
  get activeSequence() { return active; },
  createNewSequenceFromClips(name, items) {
    const s = newSeq(name); s.addTracks(3, 2);
    s.videoTracks[0].overwriteClip(items[0], 0); return s;
  },
};
// ------------------------------------------------------------------ QE
const qeLog = [];
function qeSeqFor(seq) {
  return {
    addTracks(nv, afterV, na) { seq.addTracks(nv, na); qeLog.push('addTracks ' + nv + ' ' + na); },
    getVideoTrackAt(i) {
      const t = seq.videoTracks[i];
      const items = t.clips;
      return {
        numItems: items.length,
        getItemAt(k) {
          const it = items[k];
          return { type: 'Clip', start: { ticks: String(it._s), secs: it._s / TPS },
            addVideoEffect(fx) {
              const a = Array.from(it.components);
              if (fx === 'Lumetri') a.push(comp('Lumetri カラー', 'AE.ADBE Lumetri', ['露光量', 'コントラスト', 'ハイライト', '白レベル', '彩度'].map((n) => new Prop(n, 0))));
              else a.push(comp('タイムコード', 'tc', []));
              it.components = coll(a);
            } };
        },
        razor(tc) {
          const p = tc.split(/[:;]/).map(Number);
          const f = ((p[0] * 60 + p[1]) * 60 + p[2]) * 30 + p[3];
          const at = f * TPF;
          const it = t.items.find((x) => x._s < at && x._e > at);
          if (!it) return;
          const r = Object.create(Object.getPrototypeOf(it)); Object.assign(r, it);
          r._in += at - it._s; r._s = at; it._e = at; r.components = coll(videoComponents('clip')); t.items.push(r);
          qeLog.push('razor ' + tc);
        },
      };
    },
  };
}
const qe = { project: {
  getActiveSequence: () => qeSeqFor(active),
  getVideoEffectByName: (n) => (/Lumetri/.test(n) ? 'Lumetri' : /タイムコード|Timecode/.test(n) ? 'TC' : null),
} };

// ------------------------------------------------------------------ File / Folder
class FsEntry {
  constructor(p) { this.fsName = path.resolve(String(p)); }
  get exists() { return fs.existsSync(this.fsName); }
  get name() { return encodeURI(path.basename(this.fsName)); }
  get displayName() { return path.basename(this.fsName); }
  get parent() { return new Folder(path.dirname(this.fsName)); }
}
class File extends FsEntry {
  open(mode) { this.mode = mode; this.buf = ''; return true; }
  read() { return fs.readFileSync(this.fsName, 'utf8'); }
  write(s) { this.buf += s; }
  close() { if (this.mode === 'w') fs.writeFileSync(this.fsName, this.buf); }
  static openDialog() { return null; }
}
class Folder extends FsEntry {
  getFiles(mask) {
    if (!this.exists) return [];
    const re = mask ? new RegExp('^' + mask.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$', 'i') : /.*/;
    return fs.readdirSync(this.fsName).filter((n) => re.test(n)).map((n) => {
      const p = path.join(this.fsName, n);
      return fs.statSync(p).isDirectory() ? new Folder(p) : new File(p);
    });
  }
  static selectDialog() { return null; }
}
const fnFile = function (p) { return new File(p); }; Object.assign(fnFile, { openDialog: File.openDialog });
const fnFolder = function (p) { return new Folder(p); }; Object.assign(fnFolder, { selectDialog: Folder.selectDialog });

// ------------------------------------------------------------------ run
const alerts = [];
const ctx = {
  app: { project, enableQE() { if (NO_QE) throw new Error('no qe'); }, encoder: { ENCODE_ENTIRE: 0 } },
  qe: NO_QE ? undefined : qe,
  Time, ProjectItemType, File: fnFile, Folder: fnFolder,
  alert: (m) => alerts.push(m), confirm: () => true,
  $: { writeln: () => {}, global: {} },
  EP19_MODE: MODE,
};
if (NO_QE) delete ctx.qe;
if (NO_TPL) { /* templates folder simply absent */ }
const src = fs.readFileSync(path.join(__dirname, '..', 'dist', 'episode19_auto_edit.jsx'), 'utf8').replace(/^#target.*\n/, '');
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: 'episode19_auto_edit.jsx' });

// ------------------------------------------------------------------ report
if (MODE === 'check') { console.log(alerts.join('\n---\n')); console.log('sequences:', sequences.length); process.exit(0); }
const seq = sequences.find((s) => s.name === '19_ディセンション恐れすぎ問題_自動編集案_v1');
const F = (t) => { const f = Math.round(t / TPF); return `${String(Math.floor(f / 1800)).padStart(2, '0')}:${String(Math.floor(f / 30) % 60).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`; };
console.log('alerts:', alerts.map((a) => a.split('\n')[0]));
if (!seq) { console.log('NO SEQUENCE'); process.exit(1); }
console.log('original untouched:', curSeq.name, curSeq.videoTracks[0].items.length, curSeq.markerList.length === 0 && curSeq.videoTracks[0].items[0]._s === 0);
seq.videoTracks.forEach((t, k) => {
  const c = t.clips; const head = c.slice(0, 8).map((i) => `${F(i._s)}-${F(i._e)} ${i.name}` + (i.mgt ? ` [${JSON.parse(i.mgt.properties[0].value).textEditValue.replace(/\r/g, '/')}]` : '') + (i.components[1].properties[1].value !== 100 ? ` scale=${i.components[1].properties[1].value}` : ''));
  console.log(`V${k + 1} (${c.length})`); head.forEach((h) => console.log('   ', h));
});
seq.audioTracks.forEach((t, k) => { const c = t.clips; console.log(`A${k + 1} (${c.length})`, c.slice(0, 5).map((i) => `${F(i._s)}-${F(i._e)} ${i.name}`).join(' | ')); });
const fix = seq.videoTracks[1].items.find((i) => /覚醒起動者/.test(i._text || ''));
const fixProp = fix && fix.components.find((c) => c.displayName === 'テキスト').properties[0];
console.log('basic telop untouched:', fix && F(fix._s), fixProp && fixProp.value);
console.log('end:', F(seq._end()), 'markers:', seq.markerList.length, 'qe:', qeLog.length);
const z = seq.videoTracks[0].clips.filter((i) => i.components[1].properties[1].value !== 100);
console.log('zoomed V1 clips:', z.map((i) => `${F(i._s)}-${F(i._e)}=${i.components[1].properties[1].value}`).join(', '));
