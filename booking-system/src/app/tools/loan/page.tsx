import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, SITE_URL } from "@/config/owner";
import { LoanCalculator } from "./LoanCalculator";

export const metadata: Metadata = {
  title: `房貸試算｜月付金・寬限期・利率敏感度｜${OWNER.name}`,
  description:
    "房貸線上試算：算出每月應繳、自備款與進場資金、總利息，以及利率升降 0.5% 對月付的影響。買房前先確認負擔得起。",
  alternates: { canonical: `${SITE_URL}/tools/loan` },
};

export default function LoanToolPage() {
  return (
    <section className="tool-page">
      <div className="pv-wrap">
        <Link href="/tools" className="tool-back">
          ← 實用工具
        </Link>
        <div className="tool-head">
          <p className="pv-eyebrow">Tool 02</p>
          <h1>房貸試算</h1>
          <p>
            買房的門檻有兩道：一道是進場資金夠不夠，另一道是往後二三十年月付撐不撐得住。
            很多人只算了第一道。這裡兩道一起算給你看。
          </p>
        </div>

        <LoanCalculator />

        <div className="tool-disclaimer">
          <strong>三件買方常忽略的事：</strong>
          <br />
          1. <strong>進場資金不只自備款</strong>——仲介服務費、代書費、規費、印花稅、
          再加上裝潢與家電，實際要準備的錢通常比自備款多一到兩成。
          <br />
          2. <strong>寬限期是把壓力往後推，不是省錢</strong>
          ——期滿後本金要在剩下的年數還完，月付會明顯跳一階，總利息也比較高。
          <br />
          3. <strong>利率不會永遠停在今天</strong>——升息 0.5% 對三十年期的房貸，
          月付差好幾千元。上面的表就是給你看這個。
        </div>

        <div className="tool-cta">
          <p>
            <strong>不確定自己買得起什麼價位？</strong>
            把預算與收入狀況告訴我，我從可負擔月付回推合理的總價區間，再帶你看對的物件。
          </p>
          <Link href="/card/booking" className="pv-btn pv-btn--brand">
            線上預約諮詢
          </Link>
        </div>
      </div>
    </section>
  );
}
