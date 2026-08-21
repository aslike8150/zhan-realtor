/**
 * /card — 詹衒志電子名片
 *
 * 2026-08-21 第三期改版：從舊的橘色圓角名片風，改成跟首頁同一套建設公司質感
 * （明體標題、直角、低彩度、橘色只留給主按鈕）。
 *
 * ⚠️ 只改這一頁的視覺。`_cis.ts` 那套橘色 CIS 還在給 /card/booking 的表單、
 *    成功頁、後台與通知信用，動它會波及正在收客戶預約的流程。
 *
 * 這頁是客戶加 LINE 之後點進來看的第一眼，所以：
 *   · 內容一律讀 src/config/owner.ts（透過 _links.ts 的 ABIN），不在這裡寫死
 *   · robots noindex —— 名片頁不需要被搜尋引擎收錄，SEO 靠首頁
 *   · 帶上營業員證號（法規要求對外揭露）
 *   · 結尾要能通到官網與試算工具，不要讓客戶看完聯絡方式就沒路走
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL, ABIN } from "./_links";
import { OWNER, SITE_URL, LINE_ID_TEXT } from "@/config/owner";
import {
  FacebookIcon,
  YoutubeIcon,
  LineIcon,
  InstagramIcon,
  PhoneIcon,
  MailIcon,
  PinIcon,
  CalendarIcon,
} from "./_icons";
import "../site.css";
import "./card.css";

const OG_IMAGE = `${SITE_URL}${ABIN.photoUrl}`;

export const metadata: Metadata = {
  title: `${ABIN.name}（${ABIN.alias}）‧ ${ABIN.title} | 預約諮詢`,
  description: `${ABIN.slogan} 線上預約${ABIN.alias}：買房 / 賣房 / 租賃 / 稅務諮詢，一對一為你服務。`,
  robots: { index: false, follow: false },
  // OG 鐵律：名片要放本人高光照，不可 fallback 品牌促銷圖
  openGraph: {
    title: `${ABIN.name}（${ABIN.alias}）‧ ${ABIN.title}`,
    description: `${ABIN.slogan} 線上預約${ABIN.alias}、加 LINE 諮詢買賣租賃。`,
    url: `${SITE_URL}/card`,
    siteName: `${ABIN.name} ‧ ${ABIN.company}`,
    type: "profile",
    locale: "zh_TW",
    images: [{ url: OG_IMAGE, width: 460, height: 460, alt: ABIN.name }],
  },
  twitter: {
    card: "summary",
    title: `${ABIN.name}（${ABIN.alias}）‧ ${ABIN.title}`,
    description: `${ABIN.slogan}`,
    images: [OG_IMAGE],
  },
};

/** 名片頁帶三個試算工具，讓客戶看完名片還有事可做 */
const TOOLS = [
  { href: "/tools/tax", title: "房地合一稅試算", desc: "賣掉要繳多少稅，先算清楚" },
  { href: "/tools/loan", title: "房貸試算", desc: "含青安 3.0 一鍵套用" },
  { href: "/tools/school", title: "台南學區查詢", desc: "設籍前先確認學區" },
];

export default function CardPage() {
  return (
    <div className="pv card-page">
      {/* 明體標題是這一版質感的來源。載不到就退回系統字型，版面不會壞 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@500;700&display=swap"
      />

      <main className="card-wrap">
        <div className="card-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/logo-twh.webp" alt={ABIN.company} />
          <span>{ABIN.company}</span>
        </div>

        {/* 頁面上用去背版（跟首頁同一張），OG 縮圖仍用 owner.jpg ——
            LINE 的預覽縮圖吃白底 JPEG 比較穩，透明 webp 會變成黑底。 */}
        <div className="card-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/person.webp" alt={ABIN.name} />
        </div>

        <p className="pv-eyebrow">Profile</p>
        <h1 className="card-name">{ABIN.name}</h1>
        <p className="card-role">
          {ABIN.title}｜{ABIN.company}
          <br />
          服務區域　{OWNER.serviceArea}
        </p>

        <blockquote className="card-quote">
          「最美的路，永遠是回家的路。」
          <br />
          先把數字算清楚，再談價格。
        </blockquote>

        <div className="card-cta">
          <Link href="/card/booking" className="pv-btn pv-btn--brand">
            <CalendarIcon size={19} color="#fff" />
            線上預約諮詢
          </Link>
          {SOCIAL.line ? (
            <a
              href={SOCIAL.line}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-btn card-btn--line"
            >
              <LineIcon size={21} />加 {ABIN.alias} LINE
            </a>
          ) : null}
        </div>

        <section className="card-sec">
          <p className="card-sec__title">Contact</p>
          <div className="card-contact">
            <a href={`tel:${ABIN.phoneRaw}`}>
              <PhoneIcon size={17} />
              {ABIN.phone}
            </a>
            <a href={`mailto:${ABIN.email}`}>
              <MailIcon size={17} />
              {ABIN.email}
            </a>
            <div>
              <PinIcon size={17} />
              {ABIN.address}
            </div>
          </div>
        </section>

        <section className="card-sec">
          <p className="card-sec__title">Tools</p>
          <div className="card-tools">
            {TOOLS.map((t) => (
              <Link className="card-tool" href={t.href} key={t.href}>
                <strong>
                  {t.title}
                  <small>{t.desc}</small>
                </strong>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 社群 —— 三個都留空就整塊不顯示，不要留一條空的分隔線 */}
        {SOCIAL.fb || SOCIAL.yt || SOCIAL.ig ? (
          <section className="card-sec">
            <p className="card-sec__title">Follow</p>
            <div className="card-social">
              {SOCIAL.fb ? (
                <a href={SOCIAL.fb} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon size={24} />
                </a>
              ) : null}
              {SOCIAL.yt ? (
                <a href={SOCIAL.yt} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <YoutubeIcon size={24} />
                </a>
              ) : null}
              {SOCIAL.ig ? (
                <a href={SOCIAL.ig} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon size={24} />
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        <div className="card-foot">
          <Link href="/">看完整官網．在售物件與服務內容 →</Link>
          <br />
          {/* 不動產經紀營業員證號：法規要求對外揭露，不要拿掉 */}
          營業員證號 {OWNER.licenseNo}
          <br />
          LINE {LINE_ID_TEXT}
          <br />© {ABIN.name}・{ABIN.company}
        </div>
      </main>
    </div>
  );
}
