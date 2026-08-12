/**
 * / — 詹衒志個人形象官網（首頁）
 *
 * 2026-08-12：原本這裡只是 redirect 到 /card。改成完整的形象官網，
 * 把原先獨立的靜態站 realtor-website/ 整合進來，變成同一個專案、同一個網址：
 *   /              形象官網（這頁）
 *   /card          電子名片
 *   /card/booking  線上預約
 *
 * 文案與 SEO 沿用靜態站版本；預約區塊的假 mailto 表單已換成直接導向 /card/booking。
 */
import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, SOCIAL, SITE_URL } from "@/config/owner";
import "./home.css";

const DESCRIPTION = `${OWNER.name}，台南安平房地產顧問，${OWNER.company}在地專業房仲。從安平區買房、資產配置到房地產稅務諮詢，提供全方位不動產顧問服務。加LINE：like8150 預約諮詢。`;

export const metadata: Metadata = {
  title: `${OWNER.name}｜台南房地產顧問｜安平區買房・資產配置・房地產稅務諮詢｜${OWNER.company}`,
  description: DESCRIPTION,
  keywords: [
    "台南房地產",
    "安平區買房",
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
    title: `${OWNER.name}｜台南房地產顧問｜安平區買房・資產配置・房地產稅務諮詢`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: `${OWNER.name}｜台南房地產顧問`,
    images: [{ url: `${SITE_URL}${OWNER.photoUrl}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER.name}｜台南房地產顧問・安平區買房專家`,
    description: "台南安平房地產顧問，資產配置・房地產稅務諮詢・簡易裝潢，全方位不動產顧問服務。",
    images: [`${SITE_URL}${OWNER.photoUrl}`],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: OWNER.name,
  description: `台南安平房地產顧問，${OWNER.company}在地專業房仲，提供安平區買房、資產配置、房地產稅務諮詢等全方位不動產顧問服務。`,
  image: `${SITE_URL}${OWNER.photoUrl}`,
  telephone: "+886-972-016-065",
  areaServed: { "@type": "Place", name: "台南市安平區" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "安平區",
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <header className="nav" id="top">
        <div className="container nav__inner">
          <a href="#top" className="nav__brand">
            {OWNER.name}
            <span>・台南安平房仲</span>
          </a>
          <nav className="nav__links">
            <a href="#area">服務區域</a>
            <a href="#record">戰績</a>
            <a href="#services">服務項目</a>
            <a href="#booking">預約諮詢</a>
          </nav>
          <Link href="/card/booking" className="btn btn--primary btn--sm">
            立即預約
          </Link>
        </div>
      </header>

      <main>
        {/* 1. Hero / 個人形象 */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__photo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero__photo" src={OWNER.photoUrl} alt={`${OWNER.name} - 台南安平房仲`} />
            </div>
            <div className="hero__content">
              <p className="eyebrow">
                台南安平・{OWNER.company} {OWNER.title}
              </p>
              <h1>{OWNER.name}</h1>
              <p className="hero__tagline">不只是媒合物件，我是您不動產資產的守護者。</p>
              <p className="hero__desc">
                深耕台南安平房地產市場，以精準的行情分析與談判策略，陪您在安平區買房、資產配置到房地產稅務規劃的每一個環節，做出最有把握的決定。
              </p>
              <div className="hero__cta">
                <Link href="/card/booking" className="btn btn--primary">
                  線上預約諮詢
                </Link>
                <a href={`tel:${OWNER.phoneRaw}`} className="btn btn--outline">
                  {OWNER.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 服務區域 */}
        <section id="area" className="area">
          <div className="container">
            <p className="eyebrow eyebrow--center">服務區域</p>
            <h2 className="section-title">深耕台南安平房地產，在地經驗就是您的優勢</h2>
            <div className="area__grid">
              <div className="area__map-card">
                <div className="area__pin">📍</div>
                <p className="area__place">台南市・安平區</p>
                <p className="area__org">所屬門市｜{OWNER.company}</p>
              </div>
              <div className="area__points">
                <div className="area__point">
                  <h3>安平區買房，資訊不落差</h3>
                  <p>長期蹲點台南安平，掌握街廓行情、生活機能與物件流動狀況，讓您的每一次出價都有數據依據。</p>
                </div>
                <div className="area__point">
                  <h3>品牌通路 × 在地深耕</h3>
                  <p>
                    結合台灣房屋的全國通路與成交資料庫，加上成大東豐店的第一線在地經驗，讓您的物件曝光與行情判斷都有依據，而不是憑感覺開價。
                  </p>
                </div>
                <div className="area__point">
                  <h3>買方・屋主都適用</h3>
                  <p>無論您是想在台南房地產市場置產的買方，還是準備出售、出租的屋主，都能得到對應的專業建議。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 戰績 */}
        <section id="record" className="record">
          <div className="container">
            <p className="eyebrow eyebrow--center eyebrow--light">戰績</p>
            <h2 className="section-title section-title--light">用成績說話</h2>
            <p className="record__intro">
              年度500萬成交實績，不是拿來說嘴的數字，而是我持續為每一位客戶在時效與價格上，談出最有利結果的證明。
            </p>
            <div className="record__grid">
              <div className="record__card record__card--highlight">
                <p className="record__number">
                  500<span>萬</span>
                </p>
                <p className="record__label">年度成交實績（新台幣）</p>
              </div>
              <div className="record__card">
                <p className="record__number">台南安平</p>
                <p className="record__label">深耕服務區域</p>
              </div>
              <div className="record__card">
                <p className="record__number record__number--brand">
                  台灣房屋
                  <br />
                  成大東豐店
                </p>
                <p className="record__label">所屬品牌門市</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 服務項目 */}
        <section id="services" className="services">
          <div className="container">
            <p className="eyebrow eyebrow--center">服務項目</p>
            <h2 className="section-title">全方位房地產顧問服務，不只是買賣仲介</h2>
            <p className="services__intro">
              買賣房子從來不只是簽約蓋章。我把資產配置、房地產稅務諮詢、裝潢建議整合成一套完整顧問服務，用市場數據取代直覺判斷。
            </p>
            <div className="services__grid">
              <div className="service-card">
                <div className="service-card__icon">📊</div>
                <h3>資產配置</h3>
                <p>從置產時機、資金槓桿到區域增值潛力，用市場數據協助您規劃不動產在整體資產配置中的角色，而非一次性的買賣決策。</p>
              </div>
              <div className="service-card">
                <div className="service-card__icon">🧾</div>
                <h3>房地產稅務諮詢</h3>
                <p>房地合一稅、土地增值稅、遺產贈與稅——不動產從持有到移轉的每個稅務關卡，事先掌握才能守住您應得的利潤。</p>
              </div>
              <div className="service-card">
                <div className="service-card__icon">🛠️</div>
                <h3>簡易裝潢</h3>
                <p>交屋前後的輕裝修、格局微調與屋況修繕建議，用合理預算讓物件在最短時間內達到最佳銷售或自住狀態。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 預約 —— 直接導向真正的預約系統，不再是假表單 */}
        <section id="booking" className="booking">
          <div className="container booking__inner">
            <div className="booking__info">
              <p className="eyebrow eyebrow--light">預約諮詢</p>
              <h2 className="section-title section-title--light">
                把握台南房地產進場時機，選個時間直接跟我談
              </h2>
              <p className="booking__desc">
                不管是想了解安平區買房行情、評估物件，還是想聊聊資產配置與房地產稅務諮詢，線上挑一個你方便的時段就好，不用來回敲時間。
              </p>
              <ul className="booking__contact-list">
                <li>
                  <span className="booking__contact-label">LINE ID</span>
                  <span>like8150</span>
                </li>
                <li>
                  <span className="booking__contact-label">電話</span>
                  <span>{OWNER.phone}</span>
                </li>
                <li>
                  <span className="booking__contact-label">服務區域</span>
                  <span>台南市安平區</span>
                </li>
              </ul>
            </div>

            <div className="booking__panel">
              <h3>線上預約，30 秒完成</h3>
              <ol className="booking__steps">
                <li>選你要談的事：買房、賣房、租賃或稅務</li>
                <li>挑見面方式：公司面談、電話或視訊</li>
                <li>從我的空檔裡挑一個時段</li>
              </ol>
              <p className="booking__panel-note">送出後預約即刻成立，你會收到確認信，隨時可以自己改期或取消。</p>
              <Link href="/card/booking" className="btn btn--primary btn--full">
                立即線上預約
              </Link>
              <a
                href={SOCIAL.line}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--line btn--full"
              >
                <span className="btn--line__icon">LINE</span> 或先加 LINE 聊聊
              </a>
              <Link href="/card" className="booking__card-link">
                查看電子名片 →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>
            {OWNER.name}｜台南安平房仲・{OWNER.company}
          </p>
          <p>
            {OWNER.phone}｜LINE：like8150
          </p>
        </div>
      </footer>
    </>
  );
}
