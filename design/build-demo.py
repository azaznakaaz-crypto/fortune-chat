#!/usr/bin/env python3
"""見本（top-page-mockup.html）から、スマホで操作できるデモ用ページ（demo.html）を作る。

デモでは、予約・購入・LINE・メールなどの外部へのリンクはすべて止め、
押したときに「本番ではどこへ移動するか」を画面内で案内するだけにする。
"""
import pathlib
import re

HERE = pathlib.Path(__file__).parent
src = (HERE / "top-page-mockup.html").read_text(encoding="utf-8")

style = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
icons = re.search(r'(<svg width="0" height="0".*?</svg>)', src, re.S).group(1)
site = re.search(r'<template id="site-tpl">(.*?)</template>', src, re.S).group(1)
fonts = "\n".join(l for l in src.splitlines()[:5] if l.startswith("<link"))

# デモ用のメニュー（スマホのメニューボタンで開く）
site = site.replace(
    '<button class="menu-btn" type="button" aria-label="メニューを開く"><span></span><span></span><span></span></button>',
    '<button class="menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="m-nav"><span></span><span></span><span></span></button>',
)
site = site.replace(
    "  </header>\n\n  <main>",
    """  </header>
  <nav class="m-nav" id="m-nav" aria-label="メニュー" hidden>
    <a href="#about">Arcisとは</a><a href="#programs">できること</a><a href="#reserve">レッスンのご予約</a>
    <a href="#price">料金</a><a href="#shop">商品</a><a href="#access">アクセス・お問い合わせ</a>
  </nav>

  <main>""",
    1,
)

demo_css = """
/* ===== デモ用 ===== */
html{background:var(--ivory);scroll-padding-top:120px}
body{margin:0;padding:0;background:var(--ivory)}
.demo-bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 12px;min-height:36px;padding:6px 12px;background:#5B2E22;color:#fff;font-size:13px;line-height:1.5;text-align:center}
.demo-bar b{letter-spacing:.08em}
.demo-bar label{display:inline-flex;align-items:center;gap:6px;cursor:pointer;opacity:.95}
.demo-bar input{width:16px;height:16px;accent-color:#fff}
.site .s-head{top:calc(env(safe-area-inset-top,0px) + var(--demo-h,36px))}
.m-nav{position:sticky;top:calc(env(safe-area-inset-top,0px) + var(--demo-h,36px) + 60px);z-index:4;display:grid;background:var(--ivory);border-bottom:1px solid var(--line);box-shadow:0 8px 16px rgba(73,55,41,.08)}
.m-nav a{padding:14px 20px;border-top:1px solid var(--line);text-decoration:none;font-size:16px}
.demo-modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:20px;background:rgba(40,30,22,.5)}
.demo-modal[hidden]{display:none!important}
.demo-card{width:min(100%,420px);background:var(--ivory);border-radius:14px;padding:24px 22px;display:grid;gap:14px;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.demo-card h2{font-family:var(--f-head);font-weight:500;font-size:19px;margin:0}
.demo-card p{margin:0;font-size:15px;line-height:1.8}
.demo-card .dest{background:var(--white);border:1px solid var(--line);border-radius:8px;padding:10px 12px;font-weight:700}
.demo-card button{min-height:48px;border-radius:8px;border:1.5px solid var(--brown);background:var(--brown);color:#fff;font:700 16px var(--f-body);cursor:pointer}
@container site (min-width: 860px){.m-nav{display:none!important}}
"""

demo_js = r"""
<script>
(function(){
  var L=window.ARCIS_LINKS||{};
  var board=document.getElementById('board');
  var bar=document.querySelector('.demo-bar');
  function setBarH(){document.documentElement.style.setProperty('--demo-h',bar.offsetHeight+'px');}
  setBarH();window.addEventListener('resize',setBarH);

  // 移動先の説明（デモでは実際には移動しない）
  var DEST={
    private1:'Squareの予約画面（プライベートレッスン・1名）',private2:'Squareの予約画面（プライベートレッスン・2名）',
    private3:'Squareの予約画面（プライベートレッスン・3名）',private4:'Squareの予約画面（プライベートレッスン・4名）',
    booking:'Squareの予約画面',shop:'Squareのオンラインショップ',yogaPants:'Squareのオンラインショップ（ヨガパンツの商品ページ）',
    line:'Arcisの公式LINE',instagram:'ArcisのInstagram',mail:'メールアプリ（arcis.yoga.1013@gmail.com 宛て）'
  };
  // 外部へのリンクを、すべてデモの案内に置き換える
  document.querySelectorAll('.site [data-link]').forEach(function(a){
    a.setAttribute('href','#');a.removeAttribute('target');a.classList.remove('is-pending');a.removeAttribute('aria-disabled');a.dataset.demo='1';
  });
  document.querySelectorAll('.site a[href^="mailto:"],.site a[href^="http"]').forEach(function(a){
    a.dataset.link=a.dataset.link||(a.href.indexOf('mailto:')===0?'mail':'');a.setAttribute('href','#');a.removeAttribute('target');a.dataset.demo='1';
  });

  var modal=document.getElementById('demo-modal'),destEl=document.getElementById('demo-dest'),closeBtn=document.getElementById('demo-close'),last=null;
  function open(key){last=document.activeElement;destEl.textContent=DEST[key]||'外部のページ';modal.hidden=false;closeBtn.focus();}
  function close(){modal.hidden=true;if(last)last.focus();}
  closeBtn.addEventListener('click',close);
  modal.addEventListener('click',function(e){if(e.target===modal)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close();});

  document.addEventListener('click',function(e){
    var a=e.target.closest('a[data-demo]');
    if(a){e.preventDefault();open(a.dataset.link);return;}
    var n=e.target.closest('.m-nav a');
    if(n){toggleMenu(false);}
  });

  // 人数の選択と合計金額（見本用の仮の金額）
  function yen(n){return n.toLocaleString('ja-JP');}
  var real=Number(L.pricePerPerson)||0,sample=Number(L.samplePricePerPerson)||0,price=real||sample;
  var radios=document.querySelectorAll('[data-people]');
  radios.forEach(function(r){r.name='people';r.id='people-'+r.value;});
  var calc=document.querySelector('[data-calc]'),sum=document.querySelector('[data-sum]'),go=document.querySelector('[data-private]'),smp=document.querySelector('[data-sample]');
  if(smp&&real)smp.remove();
  function upd(){
    var n=Number(document.querySelector('[data-people]:checked').value);
    if(price>0){calc.textContent=n+'名 × '+yen(price)+'円';sum.textContent=yen(price*n);}else{calc.textContent=n+'名';sum.textContent='—';}
    go.dataset.link='private'+n;
  }
  radios.forEach(function(r){r.addEventListener('change',upd);});upd();

  // スマホのメニュー
  var mbtn=document.querySelector('.menu-btn'),mnav=document.getElementById('m-nav');
  function toggleMenu(on){mnav.hidden=!on;mbtn.setAttribute('aria-expanded',on?'true':'false');mbtn.setAttribute('aria-label',on?'メニューを閉じる':'メニューを開く');}
  mbtn.addEventListener('click',function(){toggleMenu(mnav.hidden);});

  // 画面下の固定ボタン：予約・購入ボタンやフッターが見えている間は隠す
  var dock=document.querySelector('.dock'),zones=document.querySelectorAll('[data-hide-dock]');
  if('IntersectionObserver' in window){
    var seen=new Map();
    var io=new IntersectionObserver(function(es){es.forEach(function(en){seen.set(en.target,en.isIntersecting);});var any=false;seen.forEach(function(v){if(v)any=true;});dock.classList.toggle('show',!any);},{threshold:0});
    zones.forEach(function(z){io.observe(z);});
  }else{dock.classList.add('show');}

  // 確認用の印の表示切り替え
  var t=document.getElementById('t-draft');
  t.addEventListener('change',function(){board.classList.toggle('public',!t.checked);});
})();
</script>
"""

page = f"""<title>Arcis デモサイト</title>
{fonts}
<style>{style}{demo_css}</style>
{icons}
<div class="board" id="board" style="display:block;max-width:none;gap:0">
  <div class="demo-bar" role="note">
    <span><b>デモ版</b>　実際の予約・決済・送信は行われません</span>
    <label for="t-draft"><input type="checkbox" id="t-draft" checked> 確認用の印を表示</label>
  </div>
{site}
</div>
<div class="demo-modal" id="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" hidden>
  <div class="demo-card">
    <h2 id="demo-title">デモ版のため、移動しません</h2>
    <p>本番のサイトでは、ここから次の画面へ移動します。</p>
    <p class="dest" id="demo-dest"></p>
    <p>デモでは、予約・お支払い・メッセージやお名前などの送信は一切行われません。</p>
    <button type="button" id="demo-close">閉じる</button>
  </div>
</div>
<script src="links.js"></script>
{demo_js}"""

(HERE / "demo.html").write_text(page, encoding="utf-8")
print("demo.html を作成しました")
