/**
 * 首頁「精選物件」區塊 —— 資料是即時從台灣房屋撈的，不是寫死的。
 *
 * 挑選規則全在 src/config/listings.ts；資料來源在 src/lib/twhg.ts。
 * 資料來自 src/data/listings.json（由小詹電腦上的 scripts/sync-listings.mjs 產生），
 * 執行時不對外連線 —— 原因見 src/lib/twhg.ts 檔頭。
 * 檔案空的話整段消失，官網照常運作。
 */

import Link from "next/link";
import { OWNER } from "@/config/owner";
import { NOTES, SHOW_PRICE_DROP, pickFeatured } from "@/config/listings";
import { loadListings, type Listing } from "@/lib/twhg";
import { Reveal } from "./Reveal";

/** 2430 -> "2,430" */
const wan = (n: number) => n.toLocaleString("zh-TW");

/** 3房2廳2衛。土地、農地這種房廳衛全是 0 的就不顯示 */
function rooms(l: Listing): string | null {
  if (!l.bedroom && !l.livingroom && !l.bathroom) return null;
  const parts: string[] = [];
  if (l.bedroom) parts.push(`${l.bedroom}房`);
  if (l.livingroom) parts.push(`${l.livingroom}廳`);
  if (l.bathroom) parts.push(`${l.bathroom}衛`);
  return parts.join("");
}

export function FeaturedListings() {
  const all = loadListings();
  const featured = pickFeatured(all);

  // 一筆都沒有就整段不出現。缺一塊比破一塊好看。
  if (featured.length === 0) return null;

  return (
    <section id="listings" className="pv-listings">
      <div className="pv-wrap">
        <Reveal>
          <div className="pv-listings__head">
            <p className="pv-eyebrow pv-eyebrow--center">Selected Listings</p>
            <h2 className="pv-h2">手上的案子</h2>
            <p className="pv-lead">
              以下是我目前親自經手的物件。每一件都看過現場、算過稅、跟屋主談過底線，
              不是列表上多一筆的數字。
            </p>
          </div>
        </Reveal>

        <div className="pv-listings__grid">
          {featured.map((l, i) => (
            <Reveal key={l.oid} delay={0.06 * (i % 3)}>
              <a
                className="pv-card"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="pv-card__figure">
                  {l.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.photo} alt={l.name} loading="lazy" decoding="async" />
                  ) : (
                    <div className="pv-card__noimg" aria-hidden="true" />
                  )}
                  {SHOW_PRICE_DROP && l.priceDown > 0 && (
                    <span className="pv-card__down">已降 {wan(l.priceDown)} 萬</span>
                  )}
                </div>

                <div className="pv-card__body">
                  <p className="pv-card__where">
                    {l.city}
                    {l.district}
                    <span className="pv-card__dot">·</span>
                    {l.type}
                  </p>
                  <h3 className="pv-card__name">{l.name}</h3>
                  <p className="pv-card__meta">
                    {[rooms(l), `${l.ping} 坪`].filter(Boolean).join("　·　")}
                  </p>
                  {NOTES[l.oid] && <p className="pv-card__note">{NOTES[l.oid]}</p>}
                  <p className="pv-card__price">
                    {wan(l.price)}
                    <small>萬</small>
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="pv-listings__foot">
            {/* 資料是別人家的，講清楚點進去會離開本站，這是基本誠實 */}
            <p className="pv-listings__note">
              目前在售共 {all.length} 件，資料與價格同步自台灣房屋官網，
              點物件會前往台灣房屋查看完整資料。
            </p>
            <div className="pv-listings__btns">
              <Link href="/card/booking" className="pv-btn pv-btn--brand">
                預約看屋
              </Link>
              <a
                href={`https://store.twhg.com.tw/${OWNER.twhgStoreId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pv-btn"
              >
                看全部物件
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
