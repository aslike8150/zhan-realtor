/**
 * 共用頁尾 —— 首頁與工具頁都用這個，改一次兩邊一起變。
 *
 * 首頁的區塊連結是同頁錨點，工具頁在別的路由上點了會沒反應，
 * 所以錨點一律帶上 "/" 前綴，從工具頁點會先回首頁再跳到該段。
 */
import Link from "next/link";
import { OWNER, SOCIAL, LINE_ID_TEXT } from "@/config/owner";

export function SiteFooter() {
  return (
    <footer className="pv-footer">
      <div className="pv-wrap">
        <div className="pv-footer__top">
          <div>
            <div className="pv-footer__marks">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="is-invert" src="/home/logo-leju.webp" alt="樂居府都" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/logo-twh.webp" alt={OWNER.company} loading="lazy" />
            </div>
            <div className="pv-footer__brand">
              {OWNER.name}
              <small>
                {OWNER.title}｜{OWNER.company}
              </small>
            </div>
          </div>
          <nav className="pv-footer__links">
            <Link href="/#about">關於</Link>
            <Link href="/#service">服務</Link>
            <Link href="/#record">實績</Link>
            <Link href="/tools">實用工具</Link>
            <Link href="/card">電子名片</Link>
            <Link href="/card/booking">線上預約</Link>
            {SOCIAL.line ? (
              <a href={SOCIAL.line} target="_blank" rel="noreferrer">
                LINE
              </a>
            ) : null}
          </nav>
        </div>
        <div className="pv-footer__bottom">
          <span>
            © {new Date().getFullYear()} {OWNER.name}・{OWNER.company}
          </span>
          {/* 不動產經紀營業員證號：法規要求對外揭露，不要拿掉 */}
          <span>營業員證號 {OWNER.licenseNo}</span>
          <span>
            {OWNER.phone}｜LINE {LINE_ID_TEXT}
          </span>
        </div>
      </div>
    </footer>
  );
}
