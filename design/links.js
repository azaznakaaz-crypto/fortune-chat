/*
 * Arcis サイトの外部リンク設定
 *
 * Square の管理画面でコピーした「公開用のURL」だけを書きます。
 * パスワード・アクセストークン・APIキーなどの秘密の情報は、絶対にここへ書かないでください。
 * 空欄（""）のボタンは「準備中」と表示され、押せない状態になります。
 */
window.ARCIS_LINKS = {
  // 貸切プライベートレッスン：1人あたりの本番の料金（税込・円）。未定の間は null のまま
  pricePerPerson: null,
  // 見本の画面だけで使う仮の金額（本番の料金ではありません。Squareにも設定しません）
  samplePricePerPerson: 3000,
  // Square 予約：人数別メニューの予約ページ（1名用〜4名用）
  private1: "",
  private2: "",
  private3: "",
  private4: "",
  // Square 予約：オンライン予約サイトのURL（予約 → オンライン予約 → チャネル → URLを入手）
  booking: "",
  // Square オンラインビジネス：ショップのトップページ
  shop: "",
  // Square オンラインビジネス：ヨガパンツの商品ページ（未設定なら shop を使います）
  yogaPants: "",
  // 公式LINE（確認済み）
  line: "https://line.me/R/ti/p/@317tvtys",
  // Instagram（URL確認後に設定）
  instagram: ""
};
