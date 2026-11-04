#target premierepro
// =============================================================================
// 19_\u899A\u9192\u4F53\u9A13\u3057\u305F\u4EBA\u3001\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C \u2014 Premiere Pro \u81EA\u52D5\u7DE8\u96C6\u30B9\u30AF\u30EA\u30D7\u30C8
//
// \u5B9F\u884C\u65B9\u6CD5: README.md \u3092\u53C2\u7167\uFF08\u30D5\u30A1\u30A4\u30EB > \u30B9\u30AF\u30EA\u30D7\u30C8 > \u30B9\u30AF\u30EA\u30D7\u30C8\u30D5\u30A1\u30A4\u30EB\u3092\u5B9F\u884C \u306A\u3069\uFF09\u3002
// \u3053\u306E\u30BD\u30FC\u30B9\u306F\u8AAD\u307F\u3084\u3059\u3055\u306E\u305F\u3081\u65E5\u672C\u8A9E\u3092\u542B\u307F\u307E\u3059\u3002Premiere \u3067\u5B9F\u884C\u3059\u308B\u306E\u306F
// tools/build.py \u304C\u751F\u6210\u3059\u308B dist/episode19_auto_edit.jsx\uFF08ASCII \u306E\u307F\uFF09\u3067\u3059\u3002
//
// \u5B89\u5168\u8A2D\u8A08:
//   * \u6700\u521D\u306B\u300C\u5225\u540D\u3067\u4FDD\u5B58\u300D\u3057\u3066\u4F5C\u696D\u7528 .prproj \u306B\u5207\u308A\u66FF\u3048\u308B\u305F\u3081\u3001\u5143\u306E .prproj \u306F\u5909\u66F4\u3055\u308C\u307E\u305B\u3093\u3002
//   * \u5143\u30B7\u30FC\u30B1\u30F3\u30B9\u306F clone() \u3067\u8907\u88FD\u3057\u3001\u4EE5\u964D\u306E\u7DE8\u96C6\u306F\u3059\u3079\u3066\u8907\u88FD\u5074\u3060\u3051\u306B\u884C\u3044\u307E\u3059\u3002
//   * \u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u30B7\u30FC\u30B1\u30F3\u30B9\u306F\u300C\u8AAD\u307F\u8FBC\u3093\u3060\u30B3\u30D4\u30FC\u300D\u304B\u3089\u30B5\u30D6\u30B7\u30FC\u30B1\u30F3\u30B9\u3092\u4F5C\u308B\u3060\u3051\u3067\u3059\u3002
//   * \u81EA\u52D5\u51E6\u7406\u3067\u304D\u306A\u304B\u3063\u305F\u9805\u76EE\u306F\u30DE\u30FC\u30AB\u30FC\uFF08\u8D64\uFF09\u3092\u7F6E\u304D\u3001\u30EC\u30DD\u30FC\u30C8\u306B\u8A18\u9332\u3057\u307E\u3059\uFF08\u4EE3\u66FF\u54C1\u306F\u4F5C\u308A\u307E\u305B\u3093\uFF09\u3002
//   * SE \u306F\u8FFD\u52A0\u3057\u307E\u305B\u3093\u3002
// =============================================================================

// 19_\u899A\u9192\u4F53\u9A13\u3057\u305F\u4EBA\u3001\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C \u2014 \u81EA\u52D5\u7DE8\u96C6\u30D7\u30E9\u30F3\uFF08\u5358\u4E00\u306E\u60C5\u5831\u6E90\uFF09
// \u6642\u523B\u306F\u3059\u3079\u3066\u300C\u30CF\u30A4\u30E9\u30A4\u30C8\u30FB\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u633F\u5165\u524D\u306E\u30AB\u30C3\u30C8\u6E08\u307F\u30B7\u30FC\u30B1\u30F3\u30B9\u300D\u306E\u6642\u523B\uFF08MM:SS.ss, 30fps\uFF09\u3002
// episode19_auto_edit.jsx \u3068 tools/build_plan_doc.py \u306E\u4E21\u65B9\u304C\u3053\u306E\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u307E\u3059\u3002
var PLAN = {
  "fps": 30,
  "newSequenceName": "19_\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C_\u81EA\u52D5\u7DE8\u96C6\u6848_v1",
  "reviewSequenceName": "19_\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C_\u81EA\u52D5\u7DE8\u96C6\u6848_v1_\u78BA\u8A8D\u7528TC",
  "sourceSequenceName": "\u899A\u9192\u4F53\u9A13\u3057\u305F\u4EBA\u3001\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C",
  "sourceDuration": "06:17.60",
  "openingTalkEnd": "01:01.53",

  "previousProject": {
    "fileName": "\u4E8C\u6975\u5316\u306E\u6642\u4EE3\u3078\uFF01\u899A\u9192\u3059\u308B\u4EBA\u304C\u624B\u653E\u3057\u305F5\u3064\u306E\u3082\u306E_\u4FEE\u6B63 1.prproj",
    "mainSequenceName": "10_\u4E8C\u6975\u5316\u306E\u6642\u4EE3\u3078\uFF01\u899A\u9192\u3059\u308B\u4EBA\u304C\u624B\u653E\u3057\u305F5\u3064\u306E\u3082\u306E",
    "mainSequenceUID": "6ef5ea01-b14b-4dac-933e-d5010f65b0d7",
    "opening1": { "start": "00:16.17", "end": "00:21.20", "dropAudio": true },
    "opening2": { "start": "01:03.60", "end": "01:10.47", "dropAudio": false },
    "bgmName": "\u5168\u3066\u306F\u4E00\u3064\u65E5\u672C\u8A9E (1).m4a",
    "bgmTrackIndex": 2,
    "bgmClipStart": "00:16.17",
    "titleTrackIndex": 3,
    "titleAt": "00:00.00"
  },

  "highlights": [
    { "id": "HL1", "start": "00:20.90", "end": "00:26.67", "scale": 110,
      "title": "\u300C\u6050\u308C\u306A\u3044\u81EA\u5206\u300D\u3092\r\u76EE\u6307\u3059\u843D\u3068\u3057\u7A74" },
    { "id": "HL2", "start": "02:57.57", "end": "03:01.00", "scale": 110,
      "title": "\u9AD8\u6B21\u5143\u306B\u5C45\u7D9A\u3051\u305F\u3044\u306E\u306F\r\u201C\u81EA\u6211\u201D\u306A\u306E\u304B" },
    { "id": "HL3", "start": "04:51.93", "end": "04:58.60", "scale": 110,
      "title": "\u300C\u899A\u9192\u3057\u3066\u3044\u305F\u3044\u300D\u306B\r\u96A0\u308C\u305F\u7F60\u3068\u306F" }
  ],
  "highlightFadeFrames": 4,

  "emphasis": [
    { "start": "00:20.90", "end": "00:26.67", "text": "\u6050\u308C\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u3044\u308B\u6642\u70B9\u3067\r\u5B8C\u5168\u306B\u6050\u308C\u3066\u3044\u308B" },
    { "start": "00:26.67", "end": "00:33.10", "text": "\u899A\u9192\u4F53\u9A13\u3092\u3057\u305F\u4EBA\u307B\u3069\r\u9665\u308A\u3084\u3059\u3044\u7F60\u306B\u3064\u3044\u3066", "note": "\u8A2D\u8A08\u66F8\u300C\u6700\u5927\u5F37\u8ABF\u300D\u6307\u5B9A" },
    { "start": "01:21.83", "end": "01:24.93", "text": "\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C" },
    { "start": "02:54.03", "end": "03:01.00", "text": "\u305D\u3053\u306B\u5C45\u5EA7\u308A\u305F\u304F\u306A\u308B\r\u3067\u3082 \u5B9F\u306F\u305D\u308C\u3053\u305D\u304C\u81EA\u6211" },
    { "start": "03:45.63", "end": "03:55.03", "text": "\u9AD8\u6B21\u5143\u306B\u57F7\u7740\u3057\u305F\u6642\u70B9\u3067\r\u30EF\u30F3\u30CD\u30B9\u306E\u8996\u70B9\u3067\u306F\u306A\u3044" },
    { "start": "04:14.67", "end": "04:19.50", "text": "\u9AD8\u3044\u6B21\u5143\u3082 \u4F4E\u3044\u6B21\u5143\u3082\r\u611B\u3067\u3042\u308B" },
    { "start": "04:51.93", "end": "04:58.60", "text": "\u899A\u9192\u3057\u3066\u3044\u305F\u3044\u3068\u601D\u3046\u6642\u70B9\u3067\r\u7D76\u5BFE\u306B\u899A\u9192\u3057\u306A\u3044" },
    { "start": "05:31.80", "end": "05:40.47", "text": "\u4F55\u3092\u5931\u3046\u3068\u601D\u3063\u3066\u3044\u3066\r\u4F55\u304C\u6016\u3044\u3093\u3060\u308D\u3046" }
  ],

  "zoom": [
    { "start": "00:20.90", "end": "00:26.67", "scale": 110, "reason": "\u5192\u982D\u306E\u9006\u8AAC" },
    { "start": "01:21.83", "end": "01:24.93", "scale": 108, "reason": "\u4ECA\u56DE\u306E\u554F\u984C\u63D0\u8D77" },
    { "start": "02:54.03", "end": "03:01.00", "scale": 110, "reason": "\u81EA\u6211\u3068\u3044\u3046\u6838\u5FC3" },
    { "start": "03:45.63", "end": "03:55.03", "scale": 108, "reason": "\u30EF\u30F3\u30CD\u30B9\u3068\u306E\u77DB\u76FE" },
    { "start": "04:51.93", "end": "04:58.60", "scale": 110, "reason": "\u6700\u5927\u306E\u9006\u8AAC" },
    { "start": "05:31.80", "end": "05:40.47", "scale": 108, "reason": "\u8996\u8074\u8005\u3078\u306E\u554F\u3044\u304B\u3051" }
  ],

  "photos": [
    { "no": "05", "file": "01", "start": "01:47.37", "end": "01:52.17", "from": 100, "to": 103 },
    { "no": "06", "file": "02", "start": "01:52.17", "end": "02:00.17", "from": 100, "to": 103 },
    { "no": "07", "file": "03", "start": "02:00.17", "end": "02:05.90", "from": 100, "to": 103 },
    { "no": "08", "file": "04", "start": "02:05.90", "end": "02:09.77", "from": 100, "to": 103 },
    { "no": "09", "file": "05", "start": "02:40.97", "end": "02:54.03", "from": 101, "to": 105 },
    { "no": "10", "file": "06", "start": "03:01.00", "end": "03:17.13", "from": 100, "to": 102 }
  ],

  "diagrams": [
    { "id": "A", "title": "\u30A2\u30BB\u30F3\u30B7\u30E7\u30F3\u3068\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3", "start": "01:01.53", "end": "01:12.60",
      "items": [
        { "at": "01:01.53", "text": "3\u6B21\u5143\u30FB\u4EBA\u9593\u610F\u8B58", "x": 0.30, "y": 0.76 },
        { "at": "01:01.53", "text": "\u9AD8\u6B21\u5143\u610F\u8B58\u30FB\u899A\u9192\u4F53\u9A13", "x": 0.30, "y": 0.24 },
        { "at": "01:05.40", "text": "\u30A2\u30BB\u30F3\u30B7\u30E7\u30F3", "x": 0.60, "y": 0.42 },
        { "at": "01:07.30", "text": "\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3", "x": 0.60, "y": 0.58 }
      ],
      "shapes": "01:05.40 \u4E0A\u5411\u304D\u77E2\u5370\uFF08\u30A2\u30BB\u30F3\u30B7\u30E7\u30F3\uFF09\uFF0F01:07.30 \u4E0B\u5411\u304D\u77E2\u5370\uFF08\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\uFF09\u3002\u9AD8\u4F4E\u3067\u5584\u60AA\u306E\u8272\u5206\u3051\u3092\u3057\u306A\u3044\u3002" },
    { "id": "B", "title": "\u6050\u308C\u3092\u6D88\u305D\u3046\u3068\u3059\u308B\u30EB\u30FC\u30D7", "start": "03:29.73", "end": "03:45.63",
      "items": [
        { "at": "03:29.73", "text": "\u4E0D\u5B89\u30FB\u30CD\u30AC\u30C6\u30A3\u30D6\u304C\u51FA\u308B", "x": 0.50, "y": 0.22 },
        { "at": "03:32.57", "text": "\u7791\u60F3\u306A\u3069\u3067\u304B\u304D\u6D88\u305D\u3046\u3068\u3059\u308B", "x": 0.74, "y": 0.50 },
        { "at": "03:37.50", "text": "\u4F4E\u6CE2\u52D5\u306A\u81EA\u5206\u3092\u5426\u5B9A\u3059\u308B", "x": 0.50, "y": 0.78 },
        { "at": "03:40.37", "text": "\u65B0\u305F\u306A\u81EA\u6211\u30FB\u30B8\u30E3\u30C3\u30B8", "x": 0.26, "y": 0.50 }
      ],
      "shapes": "\u5404\u9805\u76EE\u306E\u51FA\u73FE\u306B\u5408\u308F\u305B\u3066\u6642\u8A08\u56DE\u308A\u306E\u77E2\u5370\u3092\u8FFD\u52A0\u3057\u300103:42.23 \u3067\u300C\u6700\u521D\u3078\u623B\u308B\u300D\u5186\u5F62\u30EB\u30FC\u30D7\u3092\u9589\u3058\u308B\u3002" },
    { "id": "C", "title": "\u9AD8\u6B21\u5143\u3082\u4F4E\u6B21\u5143\u3082\u7B49\u4FA1\u5024", "start": "03:55.03", "end": "04:26.07",
      "items": [
        { "at": "03:59.30", "text": "\u9AD8\u6B21\u5143", "x": 0.27, "y": 0.50 },
        { "at": "03:59.30", "text": "\u4F4E\u6B21\u5143", "x": 0.73, "y": 0.50 },
        { "at": "04:03.53", "text": "\u4FA1\u5024\u30FB\u512A\u52A3\u306F\u306A\u3044", "x": 0.50, "y": 0.60 },
        { "at": "04:17.00", "text": "\u3069\u3061\u3089\u3082\u611B", "x": 0.50, "y": 0.44 }
      ],
      "shapes": "\u5DE6\u53F3\u306E\u5186\uFF08\u307E\u305F\u306F\u67A0\uFF09\u3092\u540C\u3058\u9AD8\u3055\u30FB\u540C\u3058\u5927\u304D\u3055\u3067\u914D\u7F6E\u3002\u5929\u79E4\u306E\u3088\u3046\u306A\u4E0A\u4E0B\u5DEE\u3092\u3064\u3051\u306A\u3044\u3002" },
    { "id": "D", "title": "\u899A\u9192\u4F53\u9A13\u306F\u6240\u6709\u3067\u304D\u306A\u3044", "start": "04:26.07", "end": "04:51.93",
      "items": [
        { "at": "04:30.40", "text": "\u4F53\u9A13\u3092\u6240\u6709\u3059\u308B", "x": 0.22, "y": 0.50 },
        { "at": "04:34.97", "text": "\u305D\u3053\u306B\u5C45\u5EA7\u308D\u3046\u3068\u3059\u308B", "x": 0.50, "y": 0.50 },
        { "at": "04:46.37", "text": "\u6D41\u308C\u30FB\u5F69\u308A\u30FB\u6FC3\u5EA6\u306E\u4E00\u90E8", "x": 0.78, "y": 0.50 }
      ],
      "shapes": "04:30.40\u300C\u4F53\u9A13\u3092\u6240\u6709\u3059\u308B\u300D\u306B\u7D30\u3044\u00D7\u300204:46.37 \u5DE6\u2192\u53F3\u3078\u6C34\u3084\u5149\u304C\u6D41\u308C\u308B\u3088\u3046\u306A\u67D4\u3089\u304B\u3044\u77E2\u5370\u3002" }
  ],

  "diagramTextScale": 60,

  "color": {
    "exposure": -0.2, "contrast": 8, "highlights": -30, "whites": -15, "saturation": 95,
    "note": "\u8A2D\u8A08\u66F8\u306E\u958B\u59CB\u76EE\u5B89\u3002\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306BLumetri\u304C\u5B58\u5728\u3057\u306A\u3044\u305F\u3081\u6570\u5024\u30B3\u30D4\u30FC\u4E0D\u53EF\u3002\u6CE2\u5F62\u30FB\u30D9\u30AF\u30C8\u30EB\u30B9\u30B3\u30FC\u30D7\u3067\u6700\u7D42\u8ABF\u6574\u3059\u308B\u3053\u3068\u3002"
  },

  "tracks": { "photo": 2, "diagram": 3, "diagramCount": 4, "emphasis": 7, "bgmAudio": 1 },

  "review": [
    { "at": "00:37.80", "end": "01:01.53", "text": "\u52D5\u753B\u3092\u898B\u308B\u30E1\u30EA\u30C3\u30C8\uFF1A\u753B\u50CF\u3092\u5897\u3084\u3055\u305A\u8981\u70B9\u3060\u3051\u8EFD\u304F\u5F37\u8ABF\uFF08\u5F37\u8ABF\u8A9E\u306F\u672A\u6307\u5B9A\u306E\u305F\u3081\u81EA\u52D5\u914D\u7F6E\u306A\u3057\uFF09" }
  ]
};

(function () {
    var TPS = 254016000000;          // Premiere ticks / sec
    var TPF = TPS / PLAN.fps;        // ticks / frame\uFF0830fps \u2192 8467200000\uFF09

    var LOG = [];          // \u5B9F\u884C\u30ED\u30B0
    var FAILS = [];        // \u81EA\u52D5\u914D\u7F6E\u3067\u304D\u306A\u304B\u3063\u305F\u9805\u76EE
    var USED = [];         // \u4F7F\u7528\u7D20\u6750
    var MISSING = [];      // \u4E0D\u8DB3\u7D20\u6750
    var QC = [];           // \u81EA\u52D5\u30C1\u30A7\u30C3\u30AF\u7D50\u679C

    // ---------------------------------------------------------------- utilities
    function log(s) { LOG.push(s); $.writeln(s); }
    function fail(what, why, atFrame, seq) {
        FAILS.push({ what: what, why: why, at: atFrame });
        log('[\u672A\u51E6\u7406] ' + what + ' \u2014 ' + why);
        if (seq && atFrame !== undefined && atFrame !== null) {
            addMarker(seq, atFrame, null, '\u8981\u624B\u52D5: ' + what, why, 'red');
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
    // Time \u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\uFF08.ticks\uFF09\u3068\u3001ticks \u6587\u5B57\u5217\uFF08Sequence.end \u306A\u3069\uFF09\u306E\u4E21\u65B9\u3092\u53D7\u3051\u4ED8\u3051\u308B
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

    // macOS \u306E\u30D5\u30A1\u30A4\u30EB\u540D\u30FB\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u540D\u524D\u306F NFD\uFF08\u6FC1\u70B9\u5206\u89E3\uFF09\u306E\u5834\u5408\u304C\u3042\u308B\u305F\u3081\u3001NFC \u76F8\u5F53\u306B\u5BC4\u305B\u3066\u6BD4\u8F03\u3059\u308B
    function nfc(s) {
        return String(s).replace(/([\s\S])\u3099/g, function (m, c) {
            var code = c.charCodeAt(0);
            if (code === 0x3046 || code === 0x30A6) { return String.fromCharCode(code + 0x4E); }   // \u3046/\u30A6 \u2192 \u3094/\u30F4
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
    var PRE = HL_TOTAL + OP1_LEN;                 // \u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u30C8\u30FC\u30AF\u306E\u958B\u59CB\u4F4D\u7F6E
    var OP1_AT = HL_TOTAL;
    var OP2_AT = OT_END + PRE;
    var MAIN_SHIFT = PRE + OP2_LEN;
    var FINAL_END = SRC_END + MAIN_SHIFT;
    function mapF(srcFrame) { return srcFrame < OT_END ? srcFrame + PRE : srcFrame + MAIN_SHIFT; }

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
    function motion(ti) { return findComponent(ti, ['\u30E2\u30FC\u30B7\u30E7\u30F3', 'Motion'], /ADBE Motion/); }
    function setScale(ti, value) {
        var p = findProp(motion(ti), ['\u30B9\u30B1\u30FC\u30EB', 'Scale']);
        if (!p) { return false; }
        if (p.isTimeVarying()) { p.setTimeVarying(false); }
        p.setValue(value, true);
        return true;
    }
    function setPosition(ti, x, y) {
        var p = findProp(motion(ti), ['\u4F4D\u7F6E', 'Position']);
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
        return findProp(findComponent(ti, ['\u4E0D\u900F\u660E\u5EA6', 'Opacity'], /ADBE Opacity/), ['\u4E0D\u900F\u660E\u5EA6', 'Opacity']);
    }
    function levelProp(ti) {
        return findProp(findComponent(ti, ['\u30DC\u30EA\u30E5\u30FC\u30E0', 'Volume'], null), ['\u30EC\u30D9\u30EB', 'Level']);
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
        } catch (e) { log('\u30DE\u30FC\u30AB\u30FC\u4F5C\u6210\u5931\u6557: ' + name + ' ' + e); return null; }
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
    // EP19_MODE: 'check' = \u4F55\u3082\u5909\u66F4\u305B\u305A\u306B\u6E96\u5099\u72B6\u6CC1\u3060\u3051\u8868\u793A / 'run' = \u5B9F\u884C\uFF08\u30D1\u30CD\u30EB\u306E\u30DC\u30BF\u30F3\u304C\u8A2D\u5B9A\uFF09
    var MODE = (typeof EP19_MODE !== 'undefined' && EP19_MODE === 'check') ? 'check' : 'run';
    var CHECKS = [];      // [ok(bool), blocking(bool), text]
    function check(ok, blocking, text) { CHECKS.push([ok, blocking, text]); return ok; }
    function checkText() {
        var out = [], k;
        for (k = 0; k < CHECKS.length; k++) { out.push((CHECKS[k][0] ? '\u25CB ' : (CHECKS[k][1] ? '\u00D7 ' : '\u25B3 ')) + CHECKS[k][2]); }
        return out.join('\n');
    }
    function blocked() { for (var k = 0; k < CHECKS.length; k++) { if (!CHECKS[k][0] && CHECKS[k][1]) { return true; } } return false; }
    function finish(msg) { $.global.EP19_RESULT = msg; alert(msg); }

    if (!app.project || !app.project.path) { finish('Premiere\u3067\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3092\u958B\u3044\u3066\u304B\u3089\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002'); return; }
    var projFile = new File(app.project.path);
    var projDir = projFile.parent;
    var projName = nfc(decodeURI(projFile.name));

    // \u5B89\u5168\u88C5\u7F6E: \u540D\u524D\u306B\u300C\u78BA\u8A8D\u7528\u300D\u3092\u542B\u3080\u8907\u88FD\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u3057\u304B\u52D5\u304B\u306A\u3044\uFF08\u5143\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u306F\u7D76\u5BFE\u306B\u5B9F\u884C\u3057\u306A\u3044\uFF09
    check(projName.indexOf('\u78BA\u8A8D\u7528') >= 0, true, '\u958B\u3044\u3066\u3044\u308B\u306E\u306F\u78BA\u8A8D\u7528\u306E\u8907\u88FD\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\uFF08' + projName + '\uFF09' +
        (projName.indexOf('\u78BA\u8A8D\u7528') >= 0 ? '' : '\n   \u2192 \u5143\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067\u306F\u5B9F\u884C\u3057\u307E\u305B\u3093\u3002Finder\u3067\u8907\u88FD\u3057\u3066\u540D\u524D\u306B\u300C\u78BA\u8A8D\u7528\u300D\u3092\u4ED8\u3051\u305F\u3082\u306E\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044'));
    check(qeInit(), true, 'Premiere\u5185\u90E8\u6A5F\u80FD\uFF08QE DOM\uFF09\u304C\u4F7F\u3048\u308B');

    var srcSeqs = findSeqByName(PLAN.sourceSequenceName);
    check(srcSeqs.length === 1, true, '\u5143\u30B7\u30FC\u30B1\u30F3\u30B9\u300C' + PLAN.sourceSequenceName + '\u300D\u304C1\u3064\u3060\u3051\u3042\u308B\uFF08' + srcSeqs.length + '\u4EF6\uFF09');
    var srcSeq = srcSeqs.length === 1 ? srcSeqs[0] : null;
    if (srcSeq) { check(String(srcSeq.timebase) === String(TPF), true, '\u5143\u30B7\u30FC\u30B1\u30F3\u30B9\u304C30fps'); }
    check(!findSeqByName(PLAN.newSequenceName).length, true, '\u300C' + PLAN.newSequenceName + '\u300D\u304C\u307E\u3060\u7121\u3044\uFF08\u4E8C\u91CD\u5B9F\u884C\u9632\u6B62\uFF09');

    var assetDir = new Folder(projDir.fsName + '/episode19_assets');
    check(assetDir.exists, true, '\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3068\u540C\u3058\u30D5\u30A9\u30EB\u30C0\u306B episode19_assets \u304C\u3042\u308B');
    var pngCount = 0, csvFound = false;
    if (assetDir.exists) {
        var pf = assetDir.getFiles('*.png'), cf = assetDir.getFiles('*.csv'), k0;
        for (k0 = 0; k0 < pf.length; k0++) { if (/^0[1-6]_/.test(nfc(decodeURI(pf[k0].name)))) { pngCount++; } }
        for (k0 = 0; k0 < cf.length; k0++) { if (/\u7D20\u6750\u914D\u7F6E\u4E00\u89A7/.test(nfc(decodeURI(cf[k0].name)))) { csvFound = true; } }
    }
    check(pngCount === 6, true, '\u5199\u771F 01\u301C06 \u306EPNG\u304C6\u679A\u3042\u308B\uFF08' + pngCount + '\u679A\uFF09');
    check(csvFound, true, '\u7D20\u6750\u914D\u7F6E\u4E00\u89A7.csv \u304C\u3042\u308B');

    var prevFile = new File(projDir.fsName + '/' + PLAN.previousProject.fileName);
    if (!prevFile.exists && assetDir.exists) { prevFile = new File(assetDir.fsName + '/' + PLAN.previousProject.fileName); }
    check(prevFile.exists, true, '\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u300C' + PLAN.previousProject.fileName + '\u300D\u304C\u3042\u308B\uFF08\u8AAD\u307F\u8FBC\u3080\u3060\u3051\u3067\u5909\u66F4\u3057\u307E\u305B\u3093\uFF09');

    var tplDir = new Folder((assetDir.exists ? assetDir.fsName : projDir.fsName) + '/templates');
    function tpl(name) { var f = new File(tplDir.fsName + '/' + name); return f.exists ? f : null; }
    // MOGRT\u306F\u4EFB\u610F\u3002\u7121\u3051\u308C\u3070\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u30BF\u30A4\u30C8\u30EB\u3092\u305D\u306E\u307E\u307E\u8907\u88FD\u3057\u3066\u6587\u5B57\u3060\u3051\u5DEE\u3057\u66FF\u3048\u308B\u65B9\u5F0F\u3092\u8A66\u3059
    var TPL_TITLE = tpl('title.mogrt'), TPL_EMPH = tpl('emphasis.mogrt'), TPL_DIAG = tpl('diagram.mogrt');
    check(true, false, '\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8(.mogrt): ' + (TPL_TITLE || TPL_EMPH || TPL_DIAG ? '\u4E00\u90E8\u3042\u308A\uFF08\u512A\u5148\u3057\u3066\u4F7F\u7528\uFF09' : '\u306A\u3057 \u2192 \u524D\u56DE\u30BF\u30A4\u30C8\u30EB\u306E\u81EA\u52D5\u8907\u88FD\u3092\u8A66\u3057\u307E\u3059\uFF08\u4E0D\u8981\u306A\u6E96\u5099\u306F\u3042\u308A\u307E\u305B\u3093\uFF09'));

    var newProjPath = projDir.fsName + '/' + projName.replace(/\.prproj$/i, '') + '_\u81EA\u52D5\u7DE8\u96C6\u6848_v1.prproj';
    check(!new File(newProjPath).exists, true, '\u4F5C\u696D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u300C' + new File(newProjPath).displayName + '\u300D\u304C\u307E\u3060\u7121\u3044');

    if (MODE === 'check') {
        finish('\u3010\u78BA\u8A8D\u306E\u307F\u30FB\u4F55\u3082\u5909\u66F4\u3057\u3066\u3044\u307E\u305B\u3093\u3011\n\n' + checkText() + '\n\n' +
            (blocked() ? '\u00D7 \u306E\u9805\u76EE\u3092\u76F4\u3057\u3066\u304B\u3089\u3001\u3082\u3046\u4E00\u5EA6\u300C\u78BA\u8A8D\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002' : '\u3059\u3079\u3066\u6E96\u5099OK\u3067\u3059\u3002\u300C\u5B9F\u884C\u300D\u3092\u62BC\u305B\u307E\u3059\u3002'));
        return;
    }
    if (blocked()) { finish('\u6E96\u5099\u304C\u8DB3\u308A\u306A\u3044\u305F\u3081\u4E2D\u6B62\u3057\u307E\u3057\u305F\uFF08\u4F55\u3082\u5909\u66F4\u3057\u3066\u3044\u307E\u305B\u3093\uFF09\u3002\n\n' + checkText()); return; }

    // \u5B9F\u884C\u306E\u6700\u7D42\u78BA\u8A8D\u306F\u30D1\u30CD\u30EB\u5074\u3067\u884C\u3046\uFF08\u30DC\u30BF\u30F3\u30922\u56DE\u62BC\u3059\uFF09\u3002Premiere \u306E confirm() \u306F\u7248\u306B\u3088\u3063\u3066\u5F15\u6570\u30A8\u30E9\u30FC\u306B\u306A\u308B\u305F\u3081\u4F7F\u308F\u306A\u3044
    if (typeof EP19_CONFIRMED === 'undefined' || EP19_CONFIRMED !== true) {
        var ok = false;
        try { ok = confirm('\u78BA\u8A8D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u300C' + projName + '\u300D\u3067\u81EA\u52D5\u7DE8\u96C6\u3092\u5B9F\u884C\u3057\u307E\u3059\u304B\uFF1F', false, '19 \u81EA\u52D5\u7DE8\u96C6'); } catch (eCf) { ok = false; }
        if (!ok) { finish('\u5B9F\u884C\u3092\u53D6\u308A\u6D88\u3057\u307E\u3057\u305F\uFF08\u4F55\u3082\u5909\u66F4\u3057\u3066\u3044\u307E\u305B\u3093\uFF09\u3002'); return; }
    }

    // ---------------------------------------------------------------- 1. save as (keep original project untouched)
    $.global.EP19_STEP = '1. save as (keep original project untouched)';
    app.project.saveAs(newProjPath);
    log('\u4F5C\u696D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3068\u3057\u3066\u4FDD\u5B58: ' + newProjPath);
    srcSeq = findSeqByName(PLAN.sourceSequenceName)[0];

    // ---------------------------------------------------------------- 2. clone source sequence
    $.global.EP19_STEP = '2. clone source sequence';
    var before = seqIds();
    srcSeq.clone();
    var created = newSeqSince(before);
    if (created.length !== 1) { alert('\u30B7\u30FC\u30B1\u30F3\u30B9\u306E\u8907\u88FD\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002'); return; }
    var seq = created[0];
    seq.name = PLAN.newSequenceName;
    log('\u8907\u88FD\u30B7\u30FC\u30B1\u30F3\u30B9\u4F5C\u6210: ' + seq.name);

    try { seq.projectItem.moveBin(getBin('\u30B7\u30FC\u30B1\u30F3\u30B9')); } catch (eMv) { }

    // \u30C8\u30E9\u30C3\u30AF\u78BA\u4FDD\uFF08V1\u8A71\u8005 / V2\u57FA\u672C\u30C6\u30ED\u30C3\u30D7 / V3\u5199\u771F / V4\u301CV7\u56F3\u89E3\u6587\u5B57 / V8\u30BF\u30A4\u30C8\u30EB\u30FB\u5F37\u8ABF\u3001A2 BGM\uFF09
    var needV = Math.max(PLAN.tracks.photo, PLAN.tracks.diagram + PLAN.tracks.diagramCount - 1, PLAN.tracks.emphasis) + 1;
    var needA = PLAN.tracks.bgmAudio + 1;
    if (!ensureTracks(seq, needV, needA)) {
        alert('\u8907\u88FD\u30B7\u30FC\u30B1\u30F3\u30B9\u306B V' + needV + '/A' + needA + ' \u307E\u3067\u30C8\u30E9\u30C3\u30AF\u3092\u8FFD\u52A0\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08QE DOM \u7121\u52B9\uFF09\u3002\n' +
            '\u7DE8\u96C6\u306F\u884C\u308F\u305A\u306B\u4E2D\u6B62\u3057\u307E\u3059\u3002\u4F5C\u696D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\n' + newProjPath + '\n\u3092\u524A\u9664\u3057\u3066\u304B\u3089 README \u306E\u300C\u3046\u307E\u304F\u52D5\u304B\u306A\u3044\u3068\u304D\u300D\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n\u5143\u306E\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306F\u5909\u66F4\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002');
        try { app.project.save(); } catch (eSv) { }
        return;
    }

    // ---------------------------------------------------------------- 3. CSV markers (before inserting highlights/openings)
    $.global.EP19_STEP = '3. CSV markers (before inserting highlights/openings)';
    var csvMarkers = [];
    (function () {
        var csv = null, files = assetDir.getFiles('*.csv'), k;
        for (k = 0; k < files.length; k++) { if (/\u7D20\u6750\u914D\u7F6E\u4E00\u89A7/.test(nfc(decodeURI(files[k].name))) || files.length === 1) { csv = files[k]; } }
        if (!csv) { fail('\u7D20\u6750\u914D\u7F6E\u4E00\u89A7.csv \u306E\u30DE\u30FC\u30AB\u30FC\u5316', 'CSV\u304C episode19_assets \u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093', 0, seq); return; }
        csv.encoding = 'UTF-8';
        csv.open('r');
        var lines = csv.read().split(/\r\n|\n|\r/);
        csv.close();
        for (k = 1; k < lines.length; k++) {
            if (!trim(lines[k])) { continue; }
            var c = lines[k].split(',');
            if (c.length < 6) { continue; }
            var s = tcToFrames(c[1]), e = tcToFrames(c[2]);
            var m = addMarker(seq, s, e, 'CSV' + c[0] + ' ' + c[3], c[4] + ' \uFF0F ' + c[5] + ' \uFF0F \u73FE\u5728TC ' + c[1] + '\u301C' + c[2], 'cyan');
            if (m) { csvMarkers.push({ marker: m, start: s, end: e }); }
        }
        log('CSV\u30DE\u30FC\u30AB\u30FC: ' + csvMarkers.length + ' \u4EF6');
    })();

    // ---------------------------------------------------------------- 5. highlight subsequences (from the clone, before shifting)
    $.global.EP19_STEP = '5. highlight subsequences (from the clone, before shifting)';
    var seqBin = getBin('19_\u81EA\u52D5\u7DE8\u96C6\u6848_\u30CD\u30B9\u30C8');
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
        if (Math.abs(got - (endFrame - startFrame)) > 1) { log('\u6CE8\u610F: ' + name + ' \u306E\u9577\u3055 ' + got + 'f\uFF08\u60F3\u5B9A ' + (endFrame - startFrame) + 'f\uFF09'); }
        return sub;
    }
    function removeItems(track) {
        var a = clipsOf(track), k;
        for (k = a.length - 1; k >= 0; k--) { try { a[k].remove(false, false); } catch (e) { } }
    }
    var HL_NAMES = ['HL\u2460_\u30CF\u30A4\u30E9\u30A4\u30C8', 'HL\u2461_\u30CF\u30A4\u30E9\u30A4\u30C8', 'HL\u2462_\u30CF\u30A4\u30E9\u30A4\u30C8'];
    for (i = 0; i < HL.length; i++) {
        var sub = makeSubsequence(seq, HL[i].srcStart, HL[i].srcEnd, HL_NAMES[i] + '\uFF08' + HL[i].def.start + '\u301C' + HL[i].def.end + '\uFF09');
        HL[i].seq = sub;
        if (!sub) { fail(HL_NAMES[i] + ' \u306E\u8907\u88FD', '\u30B5\u30D6\u30B7\u30FC\u30B1\u30F3\u30B9\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', HL[i].dstStart, null); continue; }
        // \u524D\u56DE\u30C7\u30B6\u30A4\u30F3\u306B\u5408\u308F\u305B\u3001\u30CF\u30A4\u30E9\u30A4\u30C8\u306B\u306F\u57FA\u672C\u30C6\u30ED\u30C3\u30D7\u3092\u5165\u308C\u306A\u3044\uFF08\u8A71\u8005\u6620\u50CF\uFF0B\u97F3\u58F0\u306E\u307F\uFF09
        for (var vt = 1; vt < sub.videoTracks.numTracks; vt++) { removeItems(sub.videoTracks[vt]); }
        var a = clipsOf(sub.videoTracks[0]);
        for (var q = 0; q < a.length; q++) { if (isSpeakerClip(a[q])) { setScale(a[q], HL[i].def.scale); } }
        log(sub.name + ' \u4F5C\u6210\uFF08' + HL[i].len + 'f, \u753B\u89D2' + HL[i].def.scale + '%\uFF09');
    }

    // ---------------------------------------------------------------- 6. previous project \u2192 opening \u2460\u2461 (copies only)
    $.global.EP19_STEP = '6. previous project \u2192 opening \u2460\u2461 (copies only)';
    var prevSeq = null;
    (function () {
        var b = seqIds(), ok = false;
        try { ok = app.project.importSequences(prevFile.fsName, [PLAN.previousProject.mainSequenceUID]); } catch (e) { }
        var n = newSeqSince(b);
        if (!n.length) {
            log('importSequences \u5931\u6557\u3002\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u5168\u4F53\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5207\u308A\u66FF\u3048\u307E\u3059\u3002');
            try { app.project.importFiles([prevFile.fsName], true, getBin('\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8_\u8AAD\u8FBC'), false); } catch (e2) { }
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
        fail('\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u2460\u2461\u306E\u8907\u88FD', '\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u30B7\u30FC\u30B1\u30F3\u30B9\u300C' + PLAN.previousProject.mainSequenceName + '\u300D\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F', OP1_AT, null);
    } else {
        log('\u524D\u56DE\u30B7\u30FC\u30B1\u30F3\u30B9\u8AAD\u8FBC: ' + prevSeq.name + '\uFF08V' + prevSeq.videoTracks.numTracks + '/A' + prevSeq.audioTracks.numTracks + '\uFF09');
        var defs = [PLAN.previousProject.opening1, PLAN.previousProject.opening2];
        var names = ['OP\u2460_\u524D\u56DE\u8907\u88FD', 'OP\u2461_\u524D\u56DE\u8907\u88FD'];
        for (i = 0; i < 2; i++) {
            var s0 = tcToFrames(defs[i].start), e0 = tcToFrames(defs[i].end);
            OP[i] = makeSubsequence(prevSeq, s0, e0, names[i] + '\uFF08\u524D\u56DE' + defs[i].start + '\u301C' + defs[i].end + '\uFF09');
            if (!OP[i]) { fail(names[i], '\u30B5\u30D6\u30B7\u30FC\u30B1\u30F3\u30B9\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', i === 0 ? OP1_AT : OP2_AT, null); continue; }
            if (defs[i].dropAudio) {   // BGM \u306F\u4E0B\u3067\u4E00\u672C\u306E\u30D9\u30C3\u30C9\u3068\u3057\u3066\u6577\u304F\u305F\u3081\u3001OP\u2460\u5185\u306E\u97F3\u306F\u5916\u3059\uFF08SE\u306F\u4F7F\u308F\u306A\u3044\uFF09
                for (var at2 = 0; at2 < OP[i].audioTracks.numTracks; at2++) { removeItems(OP[i].audioTracks[at2]); }
            }
            log(OP[i].name + ' \u4F5C\u6210');
        }
    }

    // BGM info (\u524D\u56DE\u306E\u97F3\u91CF\u8A2D\u8A08\u3092\u57FA\u6E96)
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
        } catch (eB) { log('BGM\u60C5\u5831\u306E\u53D6\u5F97\u5931\u6557: ' + eB); }
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
                    if (s < OT_END && e > OT_END) { straddle++; }
                    var off = new Time();
                    off.ticks = String((s >= OT_END ? MAIN_SHIFT : PRE) * TPF);
                    try { a[j].move(off); moved++; } catch (eM) { log('\u79FB\u52D5\u5931\u6557 ' + a[j].name + ' @' + fmt(s) + ': ' + eM); }
                }
            }
        }
        log('\u65E2\u5B58\u30AF\u30EA\u30C3\u30D7\u79FB\u52D5: ' + moved + ' \u4EF6\uFF08\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u30C8\u30FC\u30AF +' + PRE + 'f / \u672C\u7DE8 +' + MAIN_SHIFT + 'f\uFF09');
        if (straddle) { fail('\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u30C8\u30FC\u30AF/\u672C\u7DE8\u306E\u5883\u754C', straddle + ' \u500B\u306E\u30AF\u30EA\u30C3\u30D7\u304C ' + PLAN.openingTalkEnd + ' \u3092\u307E\u305F\u3044\u3067\u3044\u307E\u3059', OP2_AT, seq); }
        for (k = 0; k < csvMarkers.length; k++) {
            var cm = csvMarkers[k];
            try { cm.marker.start = sec(mapF(cm.start)); cm.marker.end = sec(mapF(cm.start) + (cm.end - cm.start)); }
            catch (eMk) { log('\u30DE\u30FC\u30AB\u30FC\u79FB\u52D5\u5931\u6557: ' + cm.marker.name); }
        }
    })();

    // ---------------------------------------------------------------- 9. place highlights and openings on V1
    $.global.EP19_STEP = '9. place highlights and openings on V1';
    function placeNest(nestSeq, atFrame, label) {
        if (!nestSeq) { return null; }
        try { seq.videoTracks[0].overwriteClip(nestSeq.projectItem, sec(atFrame)); } catch (e) { }
        var ti = itemAt(seq.videoTracks[0], atFrame);
        if (!ti) { fail(label + ' \u306E\u914D\u7F6E', 'V1 \u306B\u914D\u7F6E\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', atFrame, seq); return null; }
        addMarker(seq, atFrame, atFrame + framesOf(nestSeq.end), label, '', 'yellow');
        log(label + ' \u914D\u7F6E @' + fmt(atFrame));
        return ti;
    }
    var HL_ITEMS = [];
    for (i = 0; i < HL.length; i++) { HL_ITEMS.push(placeNest(HL[i].seq, HL[i].dstStart, ['\u30CF\u30A4\u30E9\u30A4\u30C8\u2460', '\u30CF\u30A4\u30E9\u30A4\u30C8\u2461', '\u30CF\u30A4\u30E9\u30A4\u30C8\u2462'][i])); }
    placeNest(OP[0], OP1_AT, '\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u2460');
    placeNest(OP[1], OP2_AT, '\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u2461');
    addMarker(seq, PRE, OP2_AT, '\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u30C8\u30FC\u30AF', '\u73FE\u5728 00:00.00\u301C' + PLAN.openingTalkEnd + '\u3002\u6700\u521D\u306E\u7D043\u79D2\u306F\u30A4\u30F3\u30B5\u30FC\u30C8\u306A\u3057', 'yellow');
    addMarker(seq, OP2_AT + OP2_LEN, FINAL_END, '\u672C\u7DE8', '\u73FE\u5728 ' + PLAN.openingTalkEnd + '\u301C' + PLAN.sourceDuration, 'yellow');

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
            } catch (e) { fail('\u30CF\u30A4\u30E9\u30A4\u30C8' + (k + 1) + ' \u6620\u50CF\u30D5\u30A7\u30FC\u30C9', String(e), HL[k].dstStart, seq); }
            // linked audio on A1
            var au = itemAt(seq.audioTracks[0], HL[k].dstStart);
            try {
                var lp = au ? levelProp(au) : null;
                if (lp) {
                    var v = lp.getValue(), ap = [];
                    if (fadeIn) { ap.push([au.inPoint.seconds, 0]); ap.push([au.inPoint.seconds + f, v]); }
                    if (fadeOut) { ap.push([au.outPoint.seconds - f, v]); ap.push([au.outPoint.seconds, 0]); }
                    if (ap.length) { keyframe(lp, ap); }
                } else { fail('\u30CF\u30A4\u30E9\u30A4\u30C8' + (k + 1) + ' \u97F3\u58F0\u30D5\u30A7\u30FC\u30C9', 'A1 \u306B\u30CD\u30B9\u30C8\u97F3\u58F0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093', HL[k].dstStart, seq); }
            } catch (e2) { fail('\u30CF\u30A4\u30E9\u30A4\u30C8' + (k + 1) + ' \u97F3\u58F0\u30D5\u30A7\u30FC\u30C9', String(e2), HL[k].dstStart, seq); }
        }
    })();

    // ---------------------------------------------------------------- 10. BGM bed (highlights \u2192 end of opening talk)
    $.global.EP19_STEP = '10. BGM bed (highlights \u2192 end of opening talk)';
    (function () {
        var aIdx = PLAN.tracks.bgmAudio;
        if (!BGM) { fail('BGM\uFF08' + PLAN.previousProject.bgmName + '\uFF09', '\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u304B\u3089BGM\u30AF\u30EA\u30C3\u30D7\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', 0, seq); return; }
        if (seq.audioTracks.numTracks <= aIdx) { fail('BGM', 'A' + (aIdx + 1) + ' \u304C\u3042\u308A\u307E\u305B\u3093', 0, seq); return; }
        var endF = OP2_AT;
        try {
            BGM.item.setInPoint(BGM.inSec, 4);
            seq.audioTracks[aIdx].overwriteClip(BGM.item, 0);
            try { BGM.item.clearInOutPoints(); } catch (eC) { }
            var ti = itemAt(seq.audioTracks[aIdx], 0);
            if (!ti) { throw new Error('\u914D\u7F6E\u5F8C\u306E\u30AF\u30EA\u30C3\u30D7\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093'); }
            if (framesOf(ti.end) > endF) { ti.end = T(endF); }
            if (framesOf(ti.end) < endF) { fail('BGM\u306E\u9577\u3055', 'BGM\u7D20\u6750\u304C\u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u30C8\u30FC\u30AF\u7D42\u4E86\u307E\u3067\u5C4A\u304D\u307E\u305B\u3093\uFF08' + fmt(framesOf(ti.end)) + '\u3067\u7D42\u4E86\uFF09', framesOf(ti.end), seq); }
            var lp = levelProp(ti);
            if (lp && BGM.level !== null) {
                var a = ti.inPoint.seconds, b = ti.outPoint.seconds;
                keyframe(lp, [[a, 0], [a + sec(10), BGM.level], [b - sec(30), BGM.level], [b, 0]]);
            }
            USED.push(BGM.item.name + '\uFF08BGM\u30FB\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3068\u540C\u3058\u97F3\u91CF ' + BGM.level + '\uFF09');
            log('BGM \u914D\u7F6E A' + (aIdx + 1) + ' 00:00:00\u301C' + fmt(endF));
        } catch (e) { fail('BGM \u914D\u7F6E', String(e), 0, seq); }
    })();

    // ---------------------------------------------------------------- 11. \u753B\u89D2\uFF08\u30AB\u30C3\u30C8\u70B9\u306E\u307F\u30FB\u9014\u4E2D\u30BA\u30FC\u30E0\u306A\u3057\uFF09
    $.global.EP19_STEP = '11. \u753B\u89D2\uFF08\u30AB\u30C3\u30C8\u70B9\u306E\u307F\u30FB\u9014\u4E2D\u30BA\u30FC\u30E0\u306A\u3057\uFF09';
    (function () {
        var k, j;
        for (k = 0; k < PLAN.zoom.length; k++) {
            var z = PLAN.zoom[k], s = mapF(tcToFrames(z.start)), e = mapF(tcToFrames(z.end));
            var v1 = seq.videoTracks[0];
            if (!itemAt(v1, s)) {
                if (razorVideo(seq, 0, s)) { log('\u30AB\u30C3\u30C8\u70B9\u8FFD\u52A0\uFF08\u540C\u4E00\u30B7\u30E7\u30C3\u30C8\u5185\u30FB\u5185\u5BB9\u5909\u66F4\u306A\u3057\uFF09: ' + fmt(s)); }
                else { fail('\u753B\u89D2' + z.scale + '%\uFF08' + z.reason + '\uFF09', fmt(s) + ' \u306B\u30AB\u30C3\u30C8\u70B9\u304C\u306A\u304F\u3001\u81EA\u52D5\u3067\u5206\u5272\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', s, seq); continue; }
            }
            if (!itemAt(v1, e) && e < FINAL_END) {
                if (!razorVideo(seq, 0, e)) { fail('\u753B\u89D2' + z.scale + '%\uFF08' + z.reason + '\uFF09\u7D42\u70B9', fmt(e) + ' \u306B\u30AB\u30C3\u30C8\u70B9\u304C\u3042\u308A\u307E\u305B\u3093', e, seq); }
            }
            var a = clipsOf(v1), n = 0;
            for (j = 0; j < a.length; j++) {
                var cs = framesOf(a[j].start), ce = framesOf(a[j].end);
                if (cs >= s && ce <= e && isSpeakerClip(a[j])) { if (setScale(a[j], z.scale)) { n++; } }
            }
            log('\u753B\u89D2 ' + z.scale + '% ' + fmt(s) + '\u301C' + fmt(e) + '\uFF08' + n + '\u30AF\u30EA\u30C3\u30D7, ' + z.reason + '\uFF09');
            if (!n) { fail('\u753B\u89D2' + z.scale + '%\uFF08' + z.reason + '\uFF09', '\u5BFE\u8C61\u30AF\u30EA\u30C3\u30D7\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093', s, seq); }
        }
    })();

    // ---------------------------------------------------------------- 12. \u5199\u771F\u30A4\u30F3\u30B5\u30FC\u30C8\uFF08episode19_assets \u306E01\u301C06\u3092\u76F4\u63A5\u53C2\u7167\uFF09
    $.global.EP19_STEP = '12. \u5199\u771F\u30A4\u30F3\u30B5\u30FC\u30C8\uFF08episode19_assets \u306E01\u301C06\u3092\u76F4\u63A5\u53C2\u7167\uFF09';
    (function () {
        var files = assetDir.getFiles('*.png'), byNo = {}, k;
        for (k = 0; k < files.length; k++) {
            var nm = nfc(decodeURI(files[k].name)), m = nm.match(/^(\d\d)_/);
            if (m) { byNo[m[1]] = files[k]; }
        }
        var photoBin = getBin('19_\u30A4\u30F3\u30B5\u30FC\u30C8');
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
            if (!f) { MISSING.push(p.file + '_*.png\uFF08CSV' + p.no + '\uFF09'); fail('\u5199\u771F CSV' + p.no, p.file + '_*.png \u304C episode19_assets \u306B\u3042\u308A\u307E\u305B\u3093', s, seq); continue; }
            var fname = nfc(decodeURI(f.name));
            var pi = childByPrefix(photoBin, p.file + '_');
            if (!pi) {
                app.project.importFiles([f.fsName], true, photoBin, false);
                pi = childByPrefix(photoBin, p.file + '_');
            }
            if (!pi) { fail('\u5199\u771F ' + fname, '\u8AAD\u307F\u8FBC\u307F\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', s, seq); continue; }
            if (seq.videoTracks.numTracks <= vIdx) { fail('\u5199\u771F ' + fname, 'V' + (vIdx + 1) + ' \u304C\u3042\u308A\u307E\u305B\u3093', s, seq); continue; }
            try {
                seq.videoTracks[vIdx].overwriteClip(pi, sec(s));
                var ti = itemAt(seq.videoTracks[vIdx], s);
                if (!ti) { throw new Error('\u914D\u7F6E\u5F8C\u306E\u30AF\u30EA\u30C3\u30D7\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093'); }
                ti.end = T(e);
                var fill = 1920 / 1672 * 100;   // 1672x941 \u2192 1920x1080 \u3092\u57CB\u3081\u308B\u500D\u7387\uFF08\u7D04114.8%\uFF09
                var sp = findProp(motion(ti), ['\u30B9\u30B1\u30FC\u30EB', 'Scale']);
                keyframe(sp, [[ti.inPoint.seconds, fill * p.from / 100], [ti.outPoint.seconds, fill * p.to / 100]]);
                USED.push(fname + '\uFF08CSV' + p.no + ' ' + p.start + '\u301C' + p.end + '\uFF09');
                log('\u5199\u771F ' + fname + ' ' + fmt(s) + '\u301C' + fmt(e) + ' \u30D7\u30C3\u30B7\u30E5 ' + p.from + '\u2192' + p.to + '%');
            } catch (eP) { fail('\u5199\u771F ' + fname, String(eP), s, seq); }
        }
    })();

    // ---------------------------------------------------------------- 13. \u30C6\u30AD\u30B9\u30C8\uFF08\u524D\u56DE\u30C7\u30B6\u30A4\u30F3\u306EMOGRT\u3002\u30DD\u30A4\u30F3\u30C8\u30C6\u30AD\u30B9\u30C8\u306E\u307E\u307E\u7DE8\u96C6\u53EF\u80FD\uFF09
    $.global.EP19_STEP = '13. \u30C6\u30AD\u30B9\u30C8\uFF08\u524D\u56DE\u30C7\u30B6\u30A4\u30F3\u306EMOGRT\u3002\u30DD\u30A4\u30F3\u30C8\u30C6\u30AD\u30B9\u30C8\u306E\u307E\u307E\u7DE8\u96C6\u53EF\u80FD\uFF09';
    function setMogrtText(ti, text) {
        var mgt = null;
        try { mgt = ti.getMGTComponent(); } catch (e) { }
        if (!mgt) { return false; }
        for (var k = 0; k < mgt.properties.numItems; k++) {
            var p = mgt.properties[k], v = null;
            try { v = p.getValue(); } catch (e2) { continue; }
            if (typeof v === 'string' && v.indexOf('textEditValue') >= 0) {
                var o = parseJSON(v);
                o.textEditValue = text;
                p.setValue(toJSON(o), true);
                return true;
            }
        }
        return false;
    }
    // ---- \u65B9\u5F0FB: MOGRT\u304C\u7121\u3044\u3068\u304D\u3001\u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u30BF\u30A4\u30C8\u30EB\uFF08\u30DD\u30A4\u30F3\u30C8\u30C6\u30AD\u30B9\u30C8\uFF09\u3092\u305D\u306E\u307E\u307E\u8907\u88FD\u3057\u3001\u6587\u5B57\u3060\u3051\u5DEE\u3057\u66FF\u3048\u308B
    //      \u5404\u30C6\u30AD\u30B9\u30C8\u306F\u5C0F\u3055\u306A\u30CD\u30B9\u30C8\uFF08\u4E2D\u8EAB\u306F\u524D\u56DE\u3068\u540C\u3058\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF\uFF09\u306B\u306A\u308A\u3001\u30C0\u30D6\u30EB\u30AF\u30EA\u30C3\u30AF\u3067\u958B\u3051\u3070\u901A\u5E38\u3069\u304A\u308A\u7DE8\u96C6\u3067\u304D\u308B
    var DESIGN = null, NATIVE_OK = null, textBin = null;
    function designSeq() {
        if (DESIGN || !prevSeq) { return DESIGN; }
        var idx = PLAN.previousProject.titleTrackIndex, src = itemAt(prevSeq.videoTracks[idx], tcToFrames(PLAN.previousProject.titleAt));
        if (!src) { log('\u524D\u56DE\u30BF\u30A4\u30C8\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\uFF08V' + (idx + 1) + ' ' + PLAN.previousProject.titleAt + '\uFF09'); return null; }
        DESIGN = makeSubsequence(prevSeq, framesOf(src.start), framesOf(src.end), '\u30C7\u30B6\u30A4\u30F3\u5143_\u524D\u56DE\u30BF\u30A4\u30C8\u30EB');
        if (!DESIGN) { return null; }
        for (var v = 0; v < DESIGN.videoTracks.numTracks; v++) { if (v !== idx) { removeItems(DESIGN.videoTracks[v]); } }
        for (var a = 0; a < DESIGN.audioTracks.numTracks; a++) { removeItems(DESIGN.audioTracks[a]); }
        textBin = getBin('19_\u81EA\u52D5\u7DE8\u96C6\u6848_\u30C6\u30AD\u30B9\u30C8');
        return DESIGN;
    }
    function rewriteNativeText(ti, text) {
        for (var k = 0; k < ti.components.numItems; k++) {
            var p = findProp(ti.components[k], ['\u30BD\u30FC\u30B9\u30C6\u30AD\u30B9\u30C8', 'Source Text']);
            if (!p) { continue; }
            var v = null;
            try { v = p.getValue(); } catch (e) { return false; }
            if (typeof v !== 'string' || v.charAt(0) !== '{') { return false; }   // \u4E2D\u8EAB\u304C\u8AAD\u3081\u306A\u3044\u7248\u3067\u306F\u66F8\u304D\u63DB\u3048\u306A\u3044
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
            if (NATIVE_OK === null) { log('\u524D\u56DE\u30BF\u30A4\u30C8\u30EB\u306E\u6587\u5B57\u5DEE\u3057\u66FF\u3048\u306F\u3001\u3053\u306EPremiere\u3067\u306F\u4F7F\u3048\u307E\u305B\u3093\u3067\u3057\u305F'); }
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
                    if (pos) { addMarker(seq, s, null, '\u78BA\u8A8D: ' + label + '\u300C' + oneLine(text) + '\u300D\u306E\u4F4D\u7F6E', '\u524D\u56DE\u30BF\u30A4\u30C8\u30EB\u3092\u7E2E\u5C0F\u3057\u3066\u914D\u7F6E\u3002\u56F3\u5F62\u3068\u5408\u308F\u305B\u3066\u4F4D\u7F6E\u3092\u5FAE\u8ABF\u6574', 'white'); }
                    return nt;
                }
            }
            fail(label + '\u300C' + oneLine(text) + '\u300D', '\u524D\u56DE\u30C7\u30B6\u30A4\u30F3\u306E\u30C6\u30AD\u30B9\u30C8\u3092\u81EA\u52D5\u3067\u8907\u88FD\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08README\u300C\u30C6\u30AD\u30B9\u30C8\u3092\u81EA\u52D5\u3067\u4F5C\u308C\u306A\u304B\u3063\u305F\u3068\u304D\u300D\u53C2\u7167\uFF09\u3002\u30DD\u30A4\u30F3\u30C8\u30C6\u30AD\u30B9\u30C8\u3067\u624B\u52D5\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044', s, seq);
            return null;
        }
        if (seq.videoTracks.numTracks <= vIdx) { fail(label + '\u300C' + oneLine(text) + '\u300D', 'V' + (vIdx + 1) + ' \u304C\u3042\u308A\u307E\u305B\u3093', s, seq); return null; }
        var ti = null;
        try { ti = seq.importMGT(tplFile.fsName, String(s * TPF), vIdx, PLAN.tracks.bgmAudio + 1); } catch (e) { }
        if (!ti) { ti = itemAt(seq.videoTracks[vIdx], s); }
        if (!ti) { fail(label + '\u300C' + oneLine(text) + '\u300D', 'MOGRT\u3092\u914D\u7F6E\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', s, seq); return null; }
        try { ti.end = T(e); } catch (e2) { }
        if (!setMogrtText(ti, text)) { fail(label + '\u300C' + oneLine(text) + '\u300D', '\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u306F\u7F6E\u3051\u307E\u3057\u305F\u304C\u6587\u5B57\u3092\u66F8\u304D\u63DB\u3048\u3089\u308C\u307E\u305B\u3093\u3067\u3057\u305F', s, seq); }
        if (pos) { setPosition(ti, pos[0], pos[1]); }
        try { ti.name = label + '_' + oneLine(text); } catch (e3) { }
        return ti;
    }
    // \u30C6\u30AD\u30B9\u30C8\u7528\u30CD\u30B9\u30C8\u306E\uFF08\u7A7A\u306E\uFF09\u97F3\u58F0\u304C\u8A71\u8005\u97F3\u58F0\u30FBBGM\u3092\u4E0A\u66F8\u304D\u3057\u306A\u3044\u3088\u3046\u3001\u914D\u7F6E\u4E2D\u306F\u97F3\u58F0\u30C8\u30E9\u30C3\u30AF\u3092\u30ED\u30C3\u30AF\u3057\u3001\u524D\u5F8C\u3067\u4E00\u81F4\u3092\u78BA\u8A8D\u3059\u308B
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
        // \u30CF\u30A4\u30E9\u30A4\u30C8\u30BF\u30A4\u30C8\u30EB
        for (k = 0; k < HL.length; k++) {
            placeText(TPL_TITLE, PLAN.tracks.emphasis, HL[k].dstStart, HL[k].dstStart + HL[k].len, HL[k].def.title, '\u30CF\u30A4\u30E9\u30A4\u30C8' + (k + 1) + '\u30BF\u30A4\u30C8\u30EB');
        }
        // \u5F37\u8ABF\u30C6\u30ED\u30C3\u30D7
        for (k = 0; k < PLAN.emphasis.length; k++) {
            var em = PLAN.emphasis[k];
            placeText(TPL_EMPH, PLAN.tracks.emphasis, mapF(tcToFrames(em.start)), mapF(tcToFrames(em.end)), em.text, '\u5F37\u8ABF');
        }
        // \u56F3\u89E3\uFF08\u6587\u5B57\u306F\u6BB5\u968E\u8868\u793A\u3002\u56F3\u5F62\u30FB\u77E2\u5370\u306F\u624B\u52D5\uFF09
        for (k = 0; k < PLAN.diagrams.length; k++) {
            var d = PLAN.diagrams[k], ds = mapF(tcToFrames(d.start)), de = mapF(tcToFrames(d.end));
            addMarker(seq, ds, de, '\u56F3\u89E3' + d.id + '\uFF5C' + d.title, '\u56F3\u5F62\u30FB\u77E2\u5370\u30FB\u5186\u306FPremiere\u306E\u30B7\u30A7\u30A4\u30D7\u3067\u624B\u52D5\u4F5C\u6210\uFF08\u30B9\u30AF\u30EA\u30D7\u30C8API\u3067\u306F\u30B7\u30A7\u30A4\u30D7\u3092\u751F\u6210\u3067\u304D\u306A\u3044\u305F\u3081\uFF09: ' + d.shapes, 'orange');
            FAILS.push({ what: '\u56F3\u89E3' + d.id + ' \u306E\u30B7\u30A7\u30A4\u30D7\u30FB\u77E2\u5370', why: 'Premiere \u306E\u30B9\u30AF\u30EA\u30D7\u30C8API\u306B\u30B7\u30A7\u30A4\u30D7\u751F\u6210\u6A5F\u80FD\u304C\u306A\u3044\u305F\u3081\u3002' + d.shapes, at: ds });
            for (j = 0; j < d.items.length; j++) {
                var it = d.items[j];
                // \u6BB5\u968E\u8868\u793A\u3067\u524D\u306E\u9805\u76EE\u3092\u6B8B\u3057\u305F\u307E\u307E\u91CD\u306D\u308B\u305F\u3081\u3001\u9805\u76EE\u3054\u3068\u306B\u5225\u30C8\u30E9\u30C3\u30AF\uFF08V4\u301C\uFF09\u306B\u7F6E\u304F
                placeText(TPL_DIAG, PLAN.tracks.diagram + (j % PLAN.tracks.diagramCount), mapF(tcToFrames(it.at)), de, it.text, '\u56F3\u89E3' + d.id, [it.x, it.y]);
            }
        }
    })();
    lockAudio(false);
    (function () {   // \u5FF5\u306E\u305F\u3081\u3001\u30C6\u30AD\u30B9\u30C8\u7528\u30CD\u30B9\u30C8\u306E\u97F3\u58F0\u30AF\u30EA\u30C3\u30D7\u304C\u6B8B\u3063\u3066\u3044\u305F\u3089\u5916\u3059
        var k, j, a, removed = 0;
        for (k = 0; k < seq.audioTracks.numTracks; k++) {
            a = clipsOf(seq.audioTracks[k]);
            for (j = a.length - 1; j >= 0; j--) {
                try {
                    if (a[j].projectItem && a[j].projectItem.treePath && textBin && a[j].projectItem.treePath.indexOf(textBin.name) >= 0) { a[j].remove(false, false); removed++; }
                } catch (e) { }
            }
        }
        if (removed) { log('\u30C6\u30AD\u30B9\u30C8\u7528\u30CD\u30B9\u30C8\u306E\u97F3\u58F0 ' + removed + ' \u4EF6\u3092\u9664\u53BB'); }
        if (audioSnapshot() !== AUDIO_BEFORE) {
            fail('\u97F3\u58F0\u306E\u4FDD\u8B77\u30C1\u30A7\u30C3\u30AF', '\u30C6\u30AD\u30B9\u30C8\u914D\u7F6E\u306E\u524D\u5F8C\u3067\u97F3\u58F0\u30C8\u30E9\u30C3\u30AF\u306E\u5185\u5BB9\u304C\u5909\u308F\u308A\u307E\u3057\u305F\u3002\u8A71\u8005\u97F3\u58F0\u30FBBGM\u304C\u4E0A\u66F8\u304D\u3055\u308C\u305F\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u3053\u306E\u78BA\u8A8D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306F\u4F7F\u308F\u305A\u3001\u72B6\u6CC1\u3092\u304A\u77E5\u3089\u305B\u304F\u3060\u3055\u3044', 0, seq);
            QC.push('\u00D7 \u97F3\u58F0\u4FDD\u8B77\u30C1\u30A7\u30C3\u30AF: \u4E0D\u4E00\u81F4\uFF08\u8981\u78BA\u8A8D\uFF09');
        } else { QC.push('\u25CB \u97F3\u58F0\u4FDD\u8B77\u30C1\u30A7\u30C3\u30AF: \u30C6\u30AD\u30B9\u30C8\u914D\u7F6E\u3067\u97F3\u58F0\u306F\u5909\u5316\u3057\u3066\u3044\u307E\u305B\u3093'); }
    })();

    // ---------------------------------------------------------------- 14. \u8272\u88DC\u6B63\uFF08Lumetri\u3002\u5F8C\u304B\u3089\u5909\u66F4\u53EF\u80FD\uFF09
    $.global.EP19_STEP = '14. \u8272\u88DC\u6B63\uFF08Lumetri\u3002\u5F8C\u304B\u3089\u5909\u66F4\u53EF\u80FD\uFF09';
    (function () {
        var c = PLAN.color;
        var targets = [seq];
        for (var k = 0; k < HL.length; k++) { if (HL[k].seq) { targets.push(HL[k].seq); } }
        var fx = QE_OK ? qeEffect(['Lumetri \u30AB\u30E9\u30FC', 'Lumetri Color']) : null;
        if (!fx) { fail('Lumetri \u30AB\u30E9\u30FC\u9069\u7528', 'QE DOM \u3067\u30A8\u30D5\u30A7\u30AF\u30C8\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u8A71\u8005\u30AF\u30EA\u30C3\u30D7\u306BLumetri\u3092\u624B\u52D5\u9069\u7528\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u958B\u59CB\u76EE\u5B89: ' + c.note + '\uFF09', PRE, seq); return; }
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
                var lc = findComponent(a[j], ['Lumetri \u30AB\u30E9\u30FC', 'Lumetri Color'], /Lumetri/);
                var vals = [[['\u9732\u5149\u91CF', 'Exposure'], c.exposure], [['\u30B3\u30F3\u30C8\u30E9\u30B9\u30C8', 'Contrast'], c.contrast],
                    [['\u30CF\u30A4\u30E9\u30A4\u30C8', 'Highlights'], c.highlights], [['\u767D\u30EC\u30D9\u30EB', 'Whites'], c.whites], [['\u5F69\u5EA6', 'Saturation'], c.saturation]];
                var okAll = !!lc;
                for (var v = 0; v < vals.length && lc; v++) {
                    var p = findProp(lc, vals[v][0]);
                    try { if (p) { p.setValue(vals[v][1], true); } else { okAll = false; } } catch (e2) { okAll = false; }
                }
                if (okAll) { setOk++; }
            }
        }
        activate(seq);
        log('Lumetri \u9069\u7528: ' + applied + ' \u30AF\u30EA\u30C3\u30D7\uFF08\u6570\u5024\u8A2D\u5B9A\u6210\u529F ' + setOk + '\uFF09');
        addMarker(seq, PRE, null, '\u8272\u88DC\u6B63\uFF1A\u8981\u30B9\u30B3\u30FC\u30D7\u78BA\u8A8D', '\u9732\u5149\u91CF' + c.exposure + ' / \u30B3\u30F3\u30C8\u30E9\u30B9\u30C8+' + c.contrast + ' / \u30CF\u30A4\u30E9\u30A4\u30C8' + c.highlights + ' / \u767D\u30EC\u30D9\u30EB' + c.whites + ' / \u5F69\u5EA6' + c.saturation + '\u3002' + c.note, 'purple');
        if (setOk < applied) { fail('Lumetri \u6570\u5024\u8A2D\u5B9A', (applied - setOk) + ' \u30AF\u30EA\u30C3\u30D7\u3067\u4E00\u90E8\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u3092\u8A2D\u5B9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', PRE, seq); }
    })();

    // ---------------------------------------------------------------- 15. review markers
    $.global.EP19_STEP = '15. review markers';
    for (i = 0; i < PLAN.review.length; i++) {
        var r = PLAN.review[i];
        addMarker(seq, mapF(tcToFrames(r.at)), mapF(tcToFrames(r.end)), '\u78BA\u8A8D', r.text, 'white');
        FAILS.push({ what: '\u78BA\u8A8D\u4E8B\u9805', why: r.text, at: mapF(tcToFrames(r.at)) });
    }
    addMarker(seq, mapF(tcToFrames('04:14.67')), mapF(tcToFrames('04:19.50')), '\u78BA\u8A8D\uFF1A\u56F3\u89E3C\u3068\u5F37\u8ABF\u30C6\u30ED\u30C3\u30D7\u304C\u91CD\u306A\u308B', '\u56F3\u89E3C\u8868\u793A\u4E2D\u306B\u5F37\u8ABF\u30C6\u30ED\u30C3\u30D7\u300C\u9AD8\u3044\u6B21\u5143\u3082 \u4F4E\u3044\u6B21\u5143\u3082\uFF0F\u611B\u3067\u3042\u308B\u300D\u3002\u30EC\u30A4\u30A2\u30A6\u30C8\u304C\u5E72\u6E09\u3057\u306A\u3044\u304B\u78BA\u8A8D', 'white');

    // ---------------------------------------------------------------- 16. automatic QC
    $.global.EP19_STEP = '16. automatic QC';
    (function () {
        var k, a, prev, gaps;
        // V1 / A1 continuity
        var names = [['V1\uFF08\u6620\u50CF\uFF09', seq.videoTracks[0]], ['A1\uFF08\u8A71\u8005\u97F3\u58F0\uFF09', seq.audioTracks[0]]];
        for (k = 0; k < names.length; k++) {
            a = clipsOf(names[k][1]);
            a.sort(function (x, y) { return Number(x.start.ticks) - Number(y.start.ticks); });
            prev = 0; gaps = [];
            for (var j = 0; j < a.length; j++) {
                var s = framesOf(a[j].start);
                if (s > prev) { gaps.push(fmt(prev) + '\u301C' + fmt(s)); }
                prev = Math.max(prev, framesOf(a[j].end));
            }
            if (prev < FINAL_END) { gaps.push(fmt(prev) + '\u301C' + fmt(FINAL_END)); }
            QC.push(names[k][0] + ' \u306E\u7A7A\u304D\uFF08\u9ED2\u753B\u9762/\u7121\u97F3\u306E\u53EF\u80FD\u6027\uFF09: ' + (gaps.length ? gaps.join(', ') : '\u306A\u3057'));
            for (var g = 0; g < gaps.length; g++) {
                addMarker(seq, tcToFramesFromFmt(gaps[g].split('\u301C')[0]), null, 'QC: ' + names[k][0] + ' \u7A7A\u304D', gaps[g], 'red');
            }
        }
        // offline media
        var items = allItems(app.project.rootItem), off = [];
        for (k = 0; k < items.length; k++) {
            try { if (items[k].type === ProjectItemType.CLIP && items[k].isOffline()) { off.push(items[k].name); } } catch (e) { }
        }
        QC.push('\u30AA\u30D5\u30E9\u30A4\u30F3\u7D20\u6750: ' + (off.length ? off.join(', ') : '\u306A\u3057'));
        for (k = 0; k < off.length; k++) { MISSING.push(off[k] + '\uFF08\u30AA\u30D5\u30E9\u30A4\u30F3\uFF09'); }
        // order / length
        QC.push('\u60F3\u5B9A\u5168\u9577: ' + fmt(FINAL_END) + ' / \u5B9F\u969B: ' + fmt(framesOf(seq.end)));
        QC.push('\u69CB\u6210: HL\u2460 00:00:00 \u2192 HL\u2461 ' + fmt(HL[1].dstStart) + ' \u2192 HL\u2462 ' + fmt(HL[2].dstStart) + ' \u2192 OP\u2460 ' + fmt(OP1_AT) +
            ' \u2192 \u30AA\u30FC\u30D7\u30CB\u30F3\u30B0\u30C8\u30FC\u30AF ' + fmt(PRE) + ' \u2192 OP\u2461 ' + fmt(OP2_AT) + ' \u2192 \u672C\u7DE8 ' + fmt(OP2_AT + OP2_LEN));
        QC.push('\u30C6\u30ED\u30C3\u30D7\u306E\u306F\u307F\u51FA\u3057\u30FB\u30A4\u30F3\u30B5\u30FC\u30C8\u306E\u6587\u982D/\u6587\u672B\u30FB\u97F3\u306E\u5207\u308C: \u81EA\u52D5\u5224\u5B9A\u3067\u304D\u306A\u3044\u305F\u3081\u3001\u78BA\u8A8D\u7528MP4\u3067\u76EE\u8996\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044');
    })();
    function tcToFramesFromFmt(s) { var p = s.split(':'); return (parseInt(p[0], 10) * 60 + parseInt(p[1], 10)) * PLAN.fps + parseInt(p[2], 10); }

    // ---------------------------------------------------------------- 17. review sequence with timecode + MP4
    $.global.EP19_STEP = '17. review sequence with timecode + MP4';
    var mp4Path = projDir.fsName + '/' + PLAN.newSequenceName + '_\u78BA\u8A8D\u7528TC.mp4';
    (function () {
        var rs = null, b = seqIds();
        try { rs = app.project.createNewSequenceFromClips(PLAN.reviewSequenceName, [seq.projectItem], seqBin); } catch (e) { }
        if (!rs) { var n = newSeqSince(b); rs = n.length ? n[0] : null; }
        if (!rs) { fail('\u78BA\u8A8D\u7528\u30B7\u30FC\u30B1\u30F3\u30B9', '\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F', null, null); return; }
        var tcOk = false;
        var fx = QE_OK ? qeEffect(['\u30BF\u30A4\u30E0\u30B3\u30FC\u30C9', 'Timecode']) : null;
        var qs = qeSeqOf(rs);
        if (fx && qs) {
            var qi = qeItemAt(qs.getVideoTrackAt(0), 0);
            try { if (qi) { qi.addVideoEffect(fx); tcOk = true; } } catch (e2) { }
        }
        if (!tcOk) { fail('\u78BA\u8A8D\u7528MP4\u306E\u30BF\u30A4\u30E0\u30B3\u30FC\u30C9\u713C\u304D\u8FBC\u307F', '\u30BF\u30A4\u30E0\u30B3\u30FC\u30C9\u30A8\u30D5\u30A7\u30AF\u30C8\u3092\u9069\u7528\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08README \u306E ffmpeg \u624B\u9806\u3067\u4EE3\u66FF\u53EF\uFF09', null, null); }
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
                    if (/Match Source - High bitrate|\u30BD\u30FC\u30B9\u306E\u4E00\u81F4 - \u9AD8\u901F\u30D3\u30C3\u30C8\u30EC\u30FC\u30C8|\u30BD\u30FC\u30B9\u306E\u4E00\u81F4 - \u9AD8\u30D3\u30C3\u30C8\u30EC\u30FC\u30C8/.test(en)) { preset = eprs[x]; break; }
                }
            }
        }
        if (!preset) { fail('\u78BA\u8A8D\u7528MP4\u306E\u66F8\u304D\u51FA\u3057', 'H.264 \u30D7\u30EA\u30BB\u30C3\u30C8\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u305F\u3081\u7701\u7565\u3057\u307E\u3057\u305F\u3002\u78BA\u8A8D\u7528\u30B7\u30FC\u30B1\u30F3\u30B9\u300C' + PLAN.reviewSequenceName + '\u300D\u3092 \u30D5\u30A1\u30A4\u30EB > \u66F8\u304D\u51FA\u3057 > \u30E1\u30C7\u30A3\u30A2 \u3067\u66F8\u304D\u51FA\u3057\u3066\u304F\u3060\u3055\u3044', null, null); return; }
        activate(rs);
        var res = null;
        try { res = rs.exportAsMediaDirect(mp4Path, preset.fsName, app.encoder.ENCODE_ENTIRE); } catch (e3) { res = String(e3); }
        if (new File(mp4Path).exists) { log('\u78BA\u8A8D\u7528MP4: ' + mp4Path); }
        else { fail('\u78BA\u8A8D\u7528MP4\u306E\u66F8\u304D\u51FA\u3057', '\u66F8\u304D\u51FA\u3057\u7D50\u679C: ' + res, null, null); }
    })();

    // ---------------------------------------------------------------- 18. save + report
    $.global.EP19_STEP = '18. save + report';
    activate(seq);
    try { app.project.save(); } catch (eS) { }

    (function () {
        var k, out = [];
        out.push('# 19_\u30C7\u30A3\u30BB\u30F3\u30B7\u30E7\u30F3\u6050\u308C\u3059\u304E\u554F\u984C \u81EA\u52D5\u7DE8\u96C6\u30EC\u30DD\u30FC\u30C8');
        out.push('');
        out.push('- \u4F5C\u696D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8: ' + newProjPath);
        out.push('- \u5143\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\uFF08\u672A\u5909\u66F4\uFF09: ' + projFile.fsName);
        out.push('- \u7DE8\u96C6\u30B7\u30FC\u30B1\u30F3\u30B9: ' + PLAN.newSequenceName);
        out.push('- \u78BA\u8A8D\u7528MP4: ' + (new File(mp4Path).exists ? mp4Path : '\u672A\u66F8\u304D\u51FA\u3057'));
        out.push('');
        out.push('## \u4F7F\u7528\u7D20\u6750');
        for (k = 0; k < USED.length; k++) { out.push('- ' + USED[k]); }
        out.push('- \u524D\u56DE\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u8907\u88FD: OP\u2460\uFF08\u524D\u56DE ' + PLAN.previousProject.opening1.start + '\u301C' + PLAN.previousProject.opening1.end + '\uFF09, OP\u2461\uFF08\u524D\u56DE ' + PLAN.previousProject.opening2.start + '\u301C' + PLAN.previousProject.opening2.end + '\uFF09');
        out.push('- \u30C6\u30F3\u30D7\u30EC\u30FC\u30C8: \u30BF\u30A4\u30C8\u30EB=' + (TPL_TITLE ? TPL_TITLE.fsName : '\u306A\u3057') + ' / \u5F37\u8ABF=' + (TPL_EMPH ? TPL_EMPH.fsName : '\u306A\u3057') + ' / \u56F3\u89E3=' + (TPL_DIAG ? TPL_DIAG.fsName : '\u306A\u3057'));
        out.push('');
        out.push('## \u4E0D\u8DB3\u7D20\u6750');
        if (!MISSING.length) { out.push('- \u306A\u3057'); }
        for (k = 0; k < MISSING.length; k++) { out.push('- ' + MISSING[k]); }
        out.push('');
        out.push('## \u81EA\u52D5\u914D\u7F6E\u3067\u304D\u306A\u304B\u3063\u305F\u9805\u76EE\uFF08\u30BF\u30A4\u30E0\u30E9\u30A4\u30F3\u306B\u8D64/\u6A59\u30DE\u30FC\u30AB\u30FC\u3042\u308A\uFF09');
        if (!FAILS.length) { out.push('- \u306A\u3057'); }
        for (k = 0; k < FAILS.length; k++) {
            out.push('- ' + (FAILS[k].at !== null && FAILS[k].at !== undefined ? '[' + fmt(FAILS[k].at) + '] ' : '') + FAILS[k].what + ' \u2014 ' + FAILS[k].why);
        }
        out.push('');
        out.push('## \u81EA\u52D5\u30C1\u30A7\u30C3\u30AF');
        for (k = 0; k < QC.length; k++) { out.push('- ' + QC[k]); }
        out.push('');
        out.push('## \u5B9F\u884C\u30ED\u30B0');
        for (k = 0; k < LOG.length; k++) { out.push('- ' + LOG[k]); }
        var rf = new File(projDir.fsName + '/' + PLAN.newSequenceName + '_\u30EC\u30DD\u30FC\u30C8.md');
        rf.encoding = 'UTF-8';
        rf.lineFeed = 'Unix';
        rf.open('w');
        rf.write(out.join('\n') + '\n');
        rf.close();
        finish('\u5B8C\u4E86\u3057\u307E\u3057\u305F\uFF08\u78BA\u8A8D\u7528\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u307F\u5909\u66F4\uFF09\u3002\n\n\u672A\u51E6\u7406/\u8981\u78BA\u8A8D: ' + FAILS.length + ' \u4EF6\n\u30EC\u30DD\u30FC\u30C8: ' + rf.fsName);
    })();
})();
