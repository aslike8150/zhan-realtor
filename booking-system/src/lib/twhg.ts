/**
 * 🏠 官網要顯示的在售物件 —— 讀本地 JSON，不對外連線
 *
 * ⚠️ 為什麼不是即時去台灣房屋撈（2026-08-20 實測，不要再走回頭路）：
 *
 *    台灣房屋的 API 前面有 Cloudflare，**只接受台灣的一般網路**。
 *      · 小詹家的電腦打 → HTTP 200
 *      · Vercel 機房打  → HTTP 403（cf-ray 尾碼 IAD＝華盛頓；建置與執行都在那）
 *    試過補上完整的瀏覽器 header（UA / Accept / Referer / Origin / X-Requested-With），
 *    照樣 403 —— 這是 IP 來源的問題，不是請求長相的問題，加 header 沒有用。
 *    也確認過改 Vercel 執行區域沒用：建置仍在美國，而且會動到預約系統的資料庫連線。
 *
 *    所以改成：在小詹的電腦上跑 scripts/sync-listings.mjs 抓好 → 存成
 *    src/data/listings.json → 進版控 → Vercel 直接讀檔。
 *    官網執行時完全不對外連線，台灣房屋掛掉、改版、擋 IP 都影響不到官網。
 *
 * 要更新資料：雙擊桌面的「更新物件.bat」。
 */

import data from "@/data/listings.json";

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
  /** 已轉成 https 的封面照（原始網址的主機沒有 https，同步時就換掉了） */
  photo: string;
  /** 台灣房屋官方物件頁 */
  href: string;
};

/** 全部在售物件 */
export function loadListings(): Listing[] {
  return (data.listings ?? []) as Listing[];
}

/** 上次同步時間。畫面上不顯示，但排查「資料怎麼是舊的」時很有用 */
export function syncedAt(): Date | null {
  const t = data.syncedAt ? new Date(data.syncedAt) : null;
  return t && !Number.isNaN(t.getTime()) ? t : null;
}
