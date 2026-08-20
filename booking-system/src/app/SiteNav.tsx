/**
 * 共用導覽列內容 —— 首頁與工具頁共用。
 *
 * `solid` = true 時（工具頁這種沒有滿版主視覺的頁面）一開始就白底，
 * 不然灰白字壓在白背景上會看不見。
 */
import Link from "next/link";
import { OWNER } from "@/config/owner";
import { Nav } from "./Reveal";

export function SiteNav({ solid = false }: { solid?: boolean }) {
  return (
    <Nav alwaysSolid={solid}>
      <Link href="/" className="pv-nav__brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pv-nav__mark" src="/home/logo-leju.webp" alt="樂居府都" />
        <span>
          {OWNER.name}
          <small>{OWNER.company}</small>
        </span>
      </Link>
      <nav className="pv-nav__links">
        <Link href="/#about">關於</Link>
        <Link href="/#service">服務</Link>
        <Link href="/tools">實用工具</Link>
        <Link href="/#area">區域</Link>
        <Link href="/card/booking">預約</Link>
      </nav>
    </Nav>
  );
}
