/**
 * 🏠 從台灣房屋撈「小詹自己的」在售物件
 *
 * 資料來源是台灣房屋店網前端自己在打的公開介面，不需要金鑰、不需要登入：
 *
 *   POST https://store.twhg.com.tw/houseApi/ajax/salesobj.php
 *   body: agid=<員編>&type=<1全部|2房屋|3土地|4店面>
 *
 * ⚠️ 用「員編」而不是「店號」是刻意的。
 *    店號 (sid) 撈回來的是整店 300 多筆，放在個人官網上等於幫全店做曝光，
 *    客戶點進來會以為是台灣房屋的頁面。員編撈回來的只有自己接的案子。
 *
 * ⚠️ 這是台灣房屋的內部介面，沒有版本承諾，他們改版就可能壞掉。
 *    所以壞掉時一律回空陣列，讓首頁那一段整個不顯示 —— 官網其他部分照常。
 *    絕對不要讓它把整頁弄掛。
 *
 * 快取：用 unstable_cache 包住整個函式，30 分鐘一次。
 *
 * ⚠️ 這裡踩過一個坑，不要「簡化」掉：
 *    Next 的 fetch 快取只認 GET，這支 API 只吃 POST（實測 GET 回 null），
 *    所以 `next: { revalidate }` 對它沒用。而只要 fetch 被標成不可快取，
 *    首頁就會從靜態掉成動態（build log 會看到 `ƒ /` 而不是 `○ /`）——
 *    那代表「每一個訪客進站都打台灣房屋一次」，又慢又沒禮貌。
 *
 *    unstable_cache 快取的是「函式的回傳值」不是 fetch 本身，所以繞得過去，
 *    首頁也才能維持 ISR。
 */

import { unstable_cache } from "next/cache";

const API = "https://store.twhg.com.tw/houseApi/ajax/salesobj.php";

/** 快取多久（秒）。30 分鐘：物件不會分鐘級變動，這個頻率對雙方都合理 */
const TTL = 1800;

/** 物件詳細頁（台灣房屋官網）。我們站上不做內頁，點了就導過去。 */
const DETAIL = (oid: string) => `https://www.twhg.com.tw/buy/${oid}`;

export type Listing = {
  /** 物件編號，例如 TD02156971。當 key 用，也是釘選／隱藏的依據 */
  oid: string;
  name: string;
  /** 台南市 */
  city: string;
  /** 東區 */
  district: string;
  /** 大樓／透天別墅／華廈／農地… */
  type: string;
  /** 坪 */
  ping: number;
  /** 萬元 */
  price: number;
  /** 萬元。已從原價降了多少，0 = 沒降過 */
  priceDown: number;
  bedroom: number;
  livingroom: number;
  bathroom: number;
  /** 已轉成 https 的封面照 */
  photo: string;
  /** 台灣房屋官方物件頁 */
  href: string;
};

/** 台灣房屋回傳的原始單筆（只列我們會用到的欄位） */
type RawObj = {
  oid?: string;
  name?: string;
  search_city?: string;
  search_area?: string;
  type?: string;
  ping?: string | number;
  price?: string | number;
  priceDown?: string | number;
  cBedroom?: string | number;
  cLivingroom?: string | number;
  cBathroom?: string | number;
  img_url1?: string;
};

/**
 * 照片網址修正 —— 這段不能省
 *
 * API 回傳的是 `http://house.nhg.tw/...`，有兩個問題：
 *   1. house.nhg.tw 沒有 https（實測 TLS 連不上，不是憑證錯，是根本沒開）
 *   2. 我們的站是 https，插 http 圖片會被瀏覽器擋成混合內容 → 圖全破
 *
 * 解法：同一個路徑放在 img.twhg.com.tw 上是通的，而且有 https。
 * 換掉主機就好，路徑不動。（實測 20 筆全部 200）
 */
function toHttps(url: string | undefined): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/[^/]+/, "https://img.twhg.com.tw");
}

function num(v: string | number | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

function normalize(raw: RawObj): Listing | null {
  const oid = String(raw.oid ?? "").trim();
  const name = String(raw.name ?? "").trim();
  // 沒編號或沒名字的資料不要，寧可少一筆也不要出現空卡片
  if (!oid || !name) return null;

  return {
    oid,
    name,
    city: String(raw.search_city ?? "").trim(),
    district: String(raw.search_area ?? "").trim(),
    type: String(raw.type ?? "").trim(),
    ping: num(raw.ping),
    price: num(raw.price),
    priceDown: num(raw.priceDown),
    bedroom: num(raw.cBedroom),
    livingroom: num(raw.cLivingroom),
    bathroom: num(raw.cBathroom),
    photo: toHttps(raw.img_url1),
    href: DETAIL(oid),
  };
}

/**
 * 撈某位經紀人目前在售的全部物件。
 *
 * 失敗一律回空陣列（不 throw）—— 呼叫端只要 `if (!listings.length) return null`
 * 就能讓整段消失，官網不會因為台灣房屋掛掉而壞掉。
 */
async function fetchFresh(agentId: string): Promise<Listing[]> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // 帶 Referer 是禮貌，也讓對方 log 看得出流量從哪來，不是偽裝
        Referer: "https://zhan-realtor.vercel.app/",
      },
      // type=1：全部（房屋＋土地＋店面）
      body: new URLSearchParams({ agid: agentId, type: "1" }).toString(),
      // 對方沒回應時不要卡住整個頁面產生流程
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[twhg] salesobj 回 HTTP ${res.status}，本次不顯示物件`);
      return [];
    }

    const json: unknown = await res.json();
    // 員編打錯時對方會回 null（不是錯誤碼），要自己擋
    if (!json || typeof json !== "object") {
      console.warn(`[twhg] 員編 ${agentId} 查無資料`);
      return [];
    }

    const data = (json as { data?: unknown }).data;
    if (!Array.isArray(data)) return [];

    return data.map((r) => normalize(r as RawObj)).filter((x): x is Listing => x !== null);
  } catch (err) {
    console.warn("[twhg] 撈物件失敗，本次不顯示物件：", err);
    return [];
  }
}

/**
 * 對外用這個。同一個員編 30 分鐘內只會真的去打一次台灣房屋，
 * 其餘都吃快取。
 */
export function fetchAgentListings(agentId: string): Promise<Listing[]> {
  return unstable_cache(() => fetchFresh(agentId), ["twhg-salesobj", agentId], {
    revalidate: TTL,
    tags: ["twhg-listings"],
  })();
}
