/**
 * 🏠 把台灣房屋的在售物件抓下來，存成 src/data/listings.json
 *
 * 為什麼要這樣繞一圈（2026-08-20 實測結論，不要again踩）：
 *   台灣房屋的 API 前面有 Cloudflare，**只接受台灣的一般網路**。
 *   從小詹家的電腦打 → 200；從 Vercel 機房打 → 403（美國 IAD 機房，
 *   加什麼 header 都沒用，那是 IP 的問題不是請求長相的問題）。
 *   所以改成「在這台電腦抓好、存成檔案、推上去」，官網執行時完全不對外連線。
 *
 * 用法：雙擊桌面的「更新物件.bat」，或在這個資料夾下 `node scripts/sync-listings.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "..", "src", "data", "listings.json");

const AGENT_ID = "TD1171"; // 小詹的員編。換人就改這裡（要跟 owner.ts 的 twhgAgentId 一致）
const API = "https://store.twhg.com.tw/houseApi/ajax/salesobj.php";

/**
 * 照片網址修正 —— 這段不能省。
 * API 回的是 http://house.nhg.tw/...，那台**沒有 https**（TLS 根本沒開）。
 * 官網是 https，插 http 圖片會被瀏覽器擋成混合內容 → 圖全破。
 * 同一個路徑放 img.twhg.com.tw 上是通的，換掉主機、路徑不動。
 */
const toHttps = (u) =>
  typeof u === "string" && u ? u.replace(/^https?:\/\/[^/]+/, "https://img.twhg.com.tw") : "";

const num = (v) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
};

async function main() {
  console.log(`正在跟台灣房屋要資料（員編 ${AGENT_ID}）…`);

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ agid: AGENT_ID, type: "1" }).toString(),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(
      `台灣房屋回 HTTP ${res.status}。` +
        `如果是 403，多半是你人不在台灣的一般網路上（VPN／公司網路／手機熱點都可能）。`,
    );
  }

  const json = await res.json();
  if (!json || !Array.isArray(json.data)) {
    throw new Error(`查不到員編 ${AGENT_ID} 的資料（對方回 ${JSON.stringify(json).slice(0, 80)}）`);
  }

  const listings = json.data
    .filter((r) => r?.oid && r?.name)
    .map((r) => ({
      oid: String(r.oid).trim(),
      name: String(r.name).trim(),
      city: String(r.search_city ?? "").trim(),
      district: String(r.search_area ?? "").trim(),
      type: String(r.type ?? "").trim(),
      ping: num(r.ping),
      price: num(r.price),
      priceDown: num(r.priceDown),
      bedroom: num(r.cBedroom),
      livingroom: num(r.cLivingroom),
      bathroom: num(r.cBathroom),
      photo: toHttps(r.img_url1),
      href: `https://www.twhg.com.tw/buy/${String(r.oid).trim()}`,
    }));

  // 一筆都沒有八成是對方改版了。這時候**不要**覆蓋掉舊檔，
  // 不然官網會從「有物件」變成「整段消失」，比資料舊還糟。
  if (listings.length === 0) {
    throw new Error("抓到 0 筆，判定異常，保留原本的 listings.json 不覆蓋。");
  }

  // 物件內容沒變就不要重寫檔案。
  // ⚠️ 這段不能省：syncedAt 每次都不一樣，照寫的話 git 每天都會看到「檔案有變」，
  //    於是每天多一個沒意義的 commit、多觸發一次 Vercel 部署。要比的是物件本身。
  const before = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : null;
  if (before && JSON.stringify(before.listings) === JSON.stringify(listings)) {
    console.log(`物件沒有異動（${listings.length} 件），檔案不動。`);
    return;
  }

  const payload = {
    syncedAt: new Date().toISOString(),
    agentId: AGENT_ID,
    agentName: json.name ?? "",
    listings,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`✅ 抓到 ${listings.length} 件，已寫入 src/data/listings.json`);
  for (const l of listings.slice(0, 6)) {
    console.log(`   ${l.district}　${l.name}　${l.price} 萬`);
  }
  if (listings.length > 6) console.log(`   …其餘 ${listings.length - 6} 件`);
}

main().catch((e) => {
  console.error("❌ 更新失敗：" + e.message);
  process.exit(1);
});
