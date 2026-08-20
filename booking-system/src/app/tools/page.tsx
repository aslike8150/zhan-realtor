/**
 * /tools —— 實用工具總覽
 *
 * 給客戶自己算、自己查的小工具。目的是「先幫上忙，再談生意」，
 * 所以每個工具最後都有一個低調的預約入口，而不是一開始就要人留資料。
 */
import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, SITE_URL } from "@/config/owner";

export const metadata: Metadata = {
  title: `實用工具｜房地合一稅試算・房貸試算・學區查詢｜${OWNER.name}`,
  description:
    "免費線上工具：房地合一稅 2.0 試算、房貸月付金與利率敏感度試算、台南國中小學區查詢。買房賣房前先把數字算清楚。",
  alternates: { canonical: `${SITE_URL}/tools` },
};

const TOOLS = [
  {
    no: "01",
    href: "/tools/tax",
    title: "房地合一稅試算",
    body: "輸入取得日期與售價，自動判斷適用稅率（45%／35%／20%／15%），算出課稅所得、應納稅額與稅後實拿，並提醒下一個降稅節點是哪一天。",
    go: "開始試算",
  },
  {
    no: "02",
    href: "/tools/loan",
    title: "房貸試算",
    body: "算月付金、寬限期差異、總利息與進場資金。附利率升降 0.5% 的月付變化——這是買方最該先看清楚的一件事。",
    go: "開始試算",
  },
  {
    no: "03",
    href: "/tools/school",
    title: "台南國中小學區查詢",
    body: "為了學區買房，一定要查到官方公告才算數。這裡整理了正確的查詢路徑與必看的三個陷阱。",
    go: "查詢方式",
  },
];

export default function ToolsIndexPage() {
  return (
    <section className="tool-page">
      <div className="pv-wrap">
        <div className="tool-head">
          <p className="pv-eyebrow">Tools</p>
          <h1>實用工具</h1>
          <p>
            買房賣房前，先把數字算清楚。這幾個工具的算法跟我給客戶的估價建議書是同一套，
            你自己先算一遍，談的時候我們對的是同一組數字。
          </p>
        </div>

        <div className="tool-grid">
          {TOOLS.map((t) => (
            <Link key={t.no} href={t.href} className="tool-card">
              <span className="tool-card__no">{t.no}</span>
              <h2>{t.title}</h2>
              <p>{t.body}</p>
              <span className="tool-card__go">{t.go} →</span>
            </Link>
          ))}
        </div>

        <div className="tool-disclaimer">
          <strong>這些工具是「粗估」，不是稅務或財務意見。</strong>
          實際稅額會受土地漲價總數額、必要費用單據、重購退稅、非自願因素等條件影響；
          貸款條件則由銀行依個案核定。要精算請直接找我，我用謄本跑完整版本給你。
        </div>
      </div>
    </section>
  );
}
