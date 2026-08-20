import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, SITE_URL } from "@/config/owner";
import { TaxCalculator } from "./TaxCalculator";

export const metadata: Metadata = {
  title: `房地合一稅試算｜賣房前先算清楚要繳多少｜${OWNER.name}`,
  description:
    "房地合一稅 2.0 線上試算：輸入取得日期與售價，自動判斷 45%／35%／20%／15% 適用稅率，算出課稅所得、應納稅額與稅後實拿，並提醒下一個降稅節點。",
  alternates: { canonical: `${SITE_URL}/tools/tax` },
};

export default function TaxToolPage() {
  return (
    <section className="tool-page">
      <div className="pv-wrap">
        <Link href="/tools" className="tool-back">
          ← 實用工具
        </Link>
        <div className="tool-head">
          <p className="pv-eyebrow">Tool 01</p>
          <h1>房地合一稅試算</h1>
          <p>
            賣房子最怕的不是價格談不好，是稅算錯。稅率完全由「持有多久」決定，
            差一個月可能就差一級。先把數字算出來，再決定現在賣還是等一等。
          </p>
        </div>

        <TaxCalculator />

        <div className="tool-disclaimer">
          <strong>三個最常算錯的地方：</strong>
          <br />
          1. <strong>預售屋轉成屋，持有期間不能併計</strong>
          ——要從成屋完成移轉登記那天重新起算。很多人以為從簽預售約那天算，結果稅率整整差一級。
          <br />
          2. <strong>自用住宅優惠要「設籍＋持有＋實際居住」連續滿 6 年</strong>
          ，而且 6 年內不能出租、營業或執行業務使用。持有本身沒滿 6 年就不用想了。
          <br />
          3. <strong>土地漲價總數額可以從課稅所得扣掉</strong>
          ，但金額要看土地謄本。沒扣的話，上面算出來的稅會比實際高。
        </div>

        <div className="tool-cta">
          <p>
            <strong>要精算？</strong>
            調謄本之後我可以算出含土地增值稅的完整版本，連「賣掉真正入袋多少」都一起給你。
          </p>
          <Link href="/card/booking" className="pv-btn pv-btn--brand">
            線上預約諮詢
          </Link>
        </div>
      </div>
    </section>
  );
}
