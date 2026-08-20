/**
 * / — 詹衒志個人形象官網（首頁）
 *
 * 2026-08-19 換版：從「名片式」改成建設公司質感版（參考華友聯／國泰紅／富都建設）。
 *   滿版暮色大圖 → 引言 → 關於我 → 三項服務 → 數字實績 → 精選物件 → 門市與區域 → 預約
 *
 * 舊版備份在 src/app/_backup/page-old.tsx（`_` 開頭不會被當成路由），
 * 要退回去就把它搬回這裡、CSS import 改回 "./home.css"。
 *
 * 聯絡資訊與服務區域一律讀 src/config/owner.ts，不要在這裡寫死。
 *   OWNER.address     = 門市地址（台南市北區東豐路 219 號）
 *   OWNER.serviceArea = 服務區域（大台南地區）
 */
import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, SOCIAL, SITE_URL, LINE_ID_TEXT } from "@/config/owner";
import { Reveal } from "./Reveal";
import { FeaturedListings } from "./FeaturedListings";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import "./site.css";

/**
 * 每 30 分鐘重新產生一次首頁。
 *
 * 精選物件那段要即時去台灣房屋撈資料，如果不設這個，
 * 要嘛整頁變成每次請求都動態算（每個訪客都打對方一次，很沒禮貌也很慢），
 * 要嘛在 build 時固定住（物件永遠不會更新）。
 *
 * ⚠️ Next 的 fetch 快取不吃 POST，所以快取只能做在頁面這一層，不要改成
 *    在 fetch 上加 next.revalidate ── 那個對 POST 沒有作用。
 */
export const revalidate = 1800;

const DESCRIPTION = `${OWNER.name}，台南房地產顧問，${OWNER.company}在地專業房仲。從大台南買房、資產配置到房地產稅務諮詢，提供全方位不動產顧問服務。加LINE：${LINE_ID_TEXT} 預約諮詢。`;

export const metadata: Metadata = {
  title: `${OWNER.name}｜台南房地產顧問｜大台南買房・資產配置・房地產稅務諮詢｜${OWNER.company}`,
  description: DESCRIPTION,
  keywords: [
    "台南房地產",
    "大台南買房",
    "資產配置",
    "房地產稅務諮詢",
    "台南房仲",
    "台南買房",
    "台南賣房",
    "簡易裝潢",
    OWNER.company,
    OWNER.name,
  ],
  authors: [{ name: OWNER.name }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: `${OWNER.name}｜台南房地產顧問｜大台南買房・資產配置・房地產稅務諮詢`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: `${OWNER.name}｜台南房地產顧問`,
    images: [{ url: `${SITE_URL}/home/hero.webp` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER.name}｜台南房地產顧問・大台南買房專家`,
    description: "台南房地產顧問，資產配置・房地產稅務諮詢・簡易裝潢，全方位不動產顧問服務。",
    images: [`${SITE_URL}/home/hero.webp`],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: OWNER.name,
  description: `台南房地產顧問，${OWNER.company}在地專業房仲，提供大台南買房、資產配置、房地產稅務諮詢等全方位不動產顧問服務。`,
  image: `${SITE_URL}/home/person.webp`,
  telephone: OWNER.phone,
  areaServed: { "@type": "Place", name: "台南市" },
  address: {
    "@type": "PostalAddress",
    streetAddress: OWNER.address,
    addressLocality: "北區",
    addressRegion: "台南市",
    addressCountry: "TW",
  },
  worksFor: { "@type": "Organization", name: OWNER.company },
  url: SITE_URL,
  sameAs: [SOCIAL.line],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "資產配置諮詢" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "不動產稅務諮詢" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "簡易裝潢規劃" } },
  ],
};

const BLOCKS = [
  {
    no: "01",
    en: "Asset Planning",
    img: "/home/asset.webp",
    alt: "夜間城市路口車流俯瞰",
    title: "資產配置",
    body: "從置產時機、資金槓桿到區域增值潛力，用市場數據協助您規劃不動產在整體資產配置中的角色，而不是把它當成一次性的買賣決策。",
  },
  {
    no: "02",
    en: "Tax Consulting",
    img: "/home/tax.webp",
    alt: "建築玻璃屋頂結構",
    title: "房地產稅務諮詢",
    body: "房地合一稅、土地增值稅、遺產贈與稅。不動產從持有到移轉的每一個稅務關卡，事先算清楚，才守得住您應得的利潤。",
  },
  {
    no: "03",
    en: "Renovation",
    img: "/home/reno.webp",
    alt: "成大東豐店入口植栽牆",
    title: "簡易裝潢",
    body: "交屋前後的輕裝修、格局微調與屋況修繕建議。用合理預算，讓物件在最短時間內達到最好的銷售或自住狀態。",
  },
];

/** 小詹本人給的經歷，2026-08-16。改這裡就好，版面會自動跑 */
const CREDENTIALS = [
  {
    label: "專業身分",
    body: "深耕台南房產，兼具房仲、買方投資人與包租屋主三重實務視角。",
  },
  {
    label: "經歷殊榮",
    body: "現任成大東豐店店長，曾榮獲單月業績冠軍及年度冠軍肯定",
  },
  {
    label: "核心專長",
    body: "房市數據行情分析、房地合一稅、資產配置、租賃店面服務",
  },
  {
    label: "服務理念",
    body: "專業做到全面、服務做到感動",
  },
];

const AREA_POINTS = [
  {
    title: "大台南買房，資訊不落差",
    body: "長期蹲點大台南各區，掌握街廓行情、生活機能與物件流動狀況，讓您的每一次出價都有數據依據。",
  },
  {
    title: "品牌通路 × 在地深耕",
    body: `結合台灣房屋的全國通路與成交資料庫，加上${OWNER.company.replace("台灣房屋", "")}的第一線在地經驗，讓物件曝光與行情判斷都有依據，不是憑感覺開價。`,
  },
  {
    title: "買方・屋主都適用",
    body: "無論您是想在台南房地產市場置產的買方，還是準備出售、出租的屋主，都能得到對應的專業建議。",
  },
];

export default function HomePage() {
  return (
    <div className="pv">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* 明體標題是這一版質感的來源。載不到就退回系統字型，版面不會壞 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@500;700&display=swap"
      />

      <SiteNav />

      <main>
        {/* 1. 主視覺 */}
        <section className="pv-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="pv-hero__img"
            src="/home/hero.webp"
            srcSet="/home/hero-sm.webp 1200w, /home/hero.webp 2048w"
            sizes="100vw"
            alt="台南安平空拍－鹽水溪出海口與安平高樓群"
            fetchPriority="high"
          />
          <div className="pv-wrap pv-hero__inner">
            <div className="pv-hero__copy">
              <p className="pv-hero__eyebrow">TAINAN REAL ESTATE</p>
              <h1>
                先把數字算清楚，
                <br />
                再談價格。
              </h1>
              <div className="pv-hero__sign">
                <strong>{OWNER.name}</strong>
                <span>
                  {OWNER.title}｜{OWNER.company}
                </span>
              </div>
            </div>
          </div>
          <div className="pv-hero__cue">SCROLL</div>
        </section>

        {/* 2. 引言 —— 大圖下面那段介紹文字 */}
        <section id="about-intro" className="pv-intro">
          <div className="pv-wrap pv-narrow">
            <Reveal>
              <p className="pv-eyebrow pv-eyebrow--center">Philosophy</p>
              {/* 2026-08-20：主視覺改講專業定位（先把數字算清楚），
                  座右銘整句移到這裡，成為這一段的主標。 */}
              <blockquote className="pv-intro__quote">
                「最美的路，永遠是回家的路。」
              </blockquote>
              <p className="pv-intro__body">
                家是唯一能吐露心聲也能讓疲憊的身心靈，獲得慰藉的地方。
                <br />
                別讓這座城市留下您的青春，卻留不下您。
              </p>
              <div className="pv-intro__rule" />
            </Reveal>
          </div>
        </section>

        {/* 3. 關於我 —— 房仲賣的是人，形象照擺這裡，緊接在引言之後 */}
        <section id="about" className="pv-about">
          <div className="pv-wrap pv-about__grid">
            <Reveal className="pv-about__figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/person.webp"
                alt={`${OWNER.name}－台南房地產顧問`}
                decoding="async"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="pv-eyebrow">About</p>
                <h2 className="pv-h2">{OWNER.name}</h2>
                <dl className="pv-cred">
                  {CREDENTIALS.map((c) => (
                    <div className="pv-cred__row" key={c.label}>
                      <dt>{c.label}</dt>
                      <dd>{c.body}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="pv-about__meta">
                  <div>
                    <dt>服務區域</dt>
                    <dd>大台南地區</dd>
                  </div>
                  <div>
                    <dt>所屬門市</dt>
                    <dd>
                      {OWNER.company}
                      <br />
                      {OWNER.address}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. 三個服務區塊：大圖在上、文字在下 */}
        <section id="service" className="pv-blocks">
          <div className="pv-wrap">
            {BLOCKS.map((b) => (
              <article className="pv-block" key={b.no}>
                <Reveal>
                  <div className="pv-block__figure">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.img} alt={b.alt} loading="lazy" decoding="async" />
                    <span className="pv-block__no">{b.no}</span>
                  </div>
                </Reveal>
                <Reveal delay={0.12}>
                  <div className="pv-block__text">
                    <p className="pv-eyebrow">{b.en}</p>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </section>

        {/* 4. 數字實績 */}
        <section id="record" className="pv-stats">
          <div className="pv-wrap">
            <Reveal>
              <div className="pv-stats__head">
                <p className="pv-eyebrow pv-eyebrow--center">Track Record</p>
                <h2 className="pv-h2">用成績說話</h2>
                <p className="pv-lead">
                  年度 500 萬成交實績，不是拿來說嘴的數字，而是我持續為每一位客戶在時效與價格上，
                  談出最有利結果的證明。
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {/* 2026-08-20 從三格加到四格：補上「150+ 家庭成家」。
                  「500 萬」單看容易被誤讀成一年只賣掉 500 萬的房子，
                  旁邊擺服務家庭數，量體感才對得起來。 */}
              <div className="pv-stats__grid pv-stats__grid--4">
                <div className="pv-stat">
                  <span className="pv-stat__num">
                    500<small>萬</small>
                  </span>
                  <span className="pv-stat__label">年度成交實績</span>
                </div>
                <div className="pv-stat">
                  <span className="pv-stat__num">
                    150<small>+</small>
                  </span>
                  <span className="pv-stat__label">家庭成家</span>
                </div>
                <div className="pv-stat">
                  <span className="pv-stat__num">台南全區</span>
                  <span className="pv-stat__label">深耕服務區域</span>
                </div>
                <div className="pv-stat">
                  <span className="pv-stat__num pv-stat__num--text">
                    台灣房屋
                    <br />
                    成大東豐店
                  </span>
                  <span className="pv-stat__label">所屬品牌門市</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4.5 精選物件 —— 即時撈自台灣房屋（員編 OWNER.twhgAgentId）。
             撈不到會自己整段消失，不會把首頁弄壞。 */}
        <FeaturedListings />

        {/* 5. 服務區域 */}
        <section id="area" className="pv-area">
          <div className="pv-wrap">
            <Reveal className="pv-area__banner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/store.webp"
                alt={`${OWNER.company}門市空間`}
                loading="lazy"
                decoding="async"
              />
            </Reveal>
            <div className="pv-area__grid">
              <Reveal>
                <div>
                  <p className="pv-eyebrow">Service Area</p>
                  <h2 className="pv-h2">
                    大台南地區
                    <br />
                    在地經驗就是您的優勢
                  </h2>
                  <div className="pv-area__points">
                    {AREA_POINTS.map((p) => (
                      <div className="pv-area__point" key={p.title}>
                        <h4>{p.title}</h4>
                        <p>{p.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="pv-brand-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/home/logo-twh.webp" alt={OWNER.company} loading="lazy" />
                  <p className="pv-brand-card__label">所屬門市</p>
                  <p className="pv-brand-card__name">{OWNER.company}</p>
                  <p className="pv-brand-card__addr">{OWNER.address}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 7. 預約 */}
        <section id="contact" className="pv-cta">
          <div className="pv-wrap">
            <Reveal>
              <p className="pv-eyebrow pv-eyebrow--center">Contact</p>
              <h2 className="pv-cta__title">
                選個時間，
                <br />
                直接跟我談。
              </h2>
              <p className="pv-cta__desc">
                想了解台南買房行情、評估手上的物件，或是聊聊資產配置與稅務規劃，
                線上挑一個您方便的時段就好，不用來回敲時間。
              </p>
              <div className="pv-cta__actions">
                <Link href="/card/booking" className="pv-btn pv-btn--brand">
                  線上預約諮詢
                </Link>
                <a href={`tel:${OWNER.phoneRaw}`} className="pv-btn">
                  {OWNER.phone}
                </a>
              </div>
              <div className="pv-cta__contact">
                <div>
                  <span>PHONE</span>
                  <strong>{OWNER.phone}</strong>
                </div>
                <div>
                  <span>LINE</span>
                  <strong>{LINE_ID_TEXT}</strong>
                </div>
                <div>
                  <span>AREA</span>
                  <strong>{OWNER.serviceArea}</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />

    </div>
  );
}
