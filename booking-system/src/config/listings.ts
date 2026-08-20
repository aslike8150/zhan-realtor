/**
 * 🏠 首頁「精選物件」要怎麼挑 —— 要調整只改這個檔
 *
 * 預設是「完全自動」：台灣房屋那邊上下架，官網跟著動，你什麼都不用做。
 * 下面每一項都是「想手動控一點」時才用的，全部留空也能正常運作。
 */

import type { Listing } from "@/lib/twhg";

/** 首頁要顯示幾筆 */
export const COUNT = 6;

/**
 * 排序方式
 *
 *  - "api"       台灣房屋回傳的原順序。實測看起來是「最近有異動的排前面」，
 *                所以這是最接近「最新動態」的選擇。預設用這個。
 *  - "priceDown" 降最多的排前面。買方導向、最吸睛，
 *                但整排都掛降價標會讓屋主覺得「東西在你手上都要降價才賣得掉」。
 *  - "priceHigh" 總價高的排前面。撐格調，適合想接高總價委託。
 *  - "priceLow"  總價低的排前面。首購導向。
 */
export const SORT: "api" | "priceDown" | "priceHigh" | "priceLow" = "api";

/**
 * 要不要在卡片上顯示「已降 OO 萬」的標籤。
 *
 * 預設關掉，理由不是美觀問題：
 * 台灣房屋回傳的預設順序會把「最近調過價」的排前面，所以六張卡很容易
 * 整排都掛降價標。這對買方是誘因，但對屋主是反效果 ——「案子放你手上
 * 都要降價才賣得掉」。你的官網買方屋主都會看到，所以預設不顯示。
 *
 * 想開就改成 true，價格照樣是最新的，只是不強調降了多少。
 */
export const SHOW_PRICE_DROP = false;

/**
 * 釘選：想固定出現在最前面的物件編號（例如主推案）。
 * 留空 = 完全自動，不用每個月維護。
 * 例：["TD02156971", "TD02441614"]
 */
export const PINNED: string[] = [];

/**
 * 隱藏：不想出現在個人官網上的物件編號。
 * 例如屋主交代低調處理的、或跟個人定位不搭的案子。
 */
export const HIDDEN: string[] = [];

/**
 * 選配的一句話觀點 —— 有寫就顯示，沒寫卡片一樣完整。
 *
 * 這是「精選」跟「資料庫倒出來」的差別：同樣六張卡，有你的一句話，
 * 客戶讀到的是判斷；沒有的話就只是列表。但也不強迫，空著不會壞。
 *
 * 例：
 *   "TD02156971": "露台戶在世界巨星本來就少，這間的座向又是整排最好的。",
 */
export const NOTES: Record<string, string> = {};

/** 依上面的規則，把台灣房屋撈回來的清單挑成首頁要用的幾筆 */
export function pickFeatured(all: Listing[]): Listing[] {
  const hidden = new Set(HIDDEN);
  const visible = all.filter((l) => !hidden.has(l.oid));

  const sorted = [...visible];
  if (SORT === "priceDown") sorted.sort((a, b) => b.priceDown - a.priceDown);
  else if (SORT === "priceHigh") sorted.sort((a, b) => b.price - a.price);
  else if (SORT === "priceLow") sorted.sort((a, b) => a.price - b.price);
  // "api" 就是不排序，維持台灣房屋回傳的原順序

  // 釘選的往前提，且照 PINNED 裡寫的順序
  const pinned = PINNED.map((oid) => sorted.find((l) => l.oid === oid)).filter(
    (x): x is Listing => x !== undefined,
  );
  const pinnedIds = new Set(pinned.map((l) => l.oid));
  const rest = sorted.filter((l) => !pinnedIds.has(l.oid));

  return [...pinned, ...rest].slice(0, COUNT);
}
