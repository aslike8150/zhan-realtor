/**
 * 房地合一稅 2.0（個人・境內居住者）—— 客戶自助試算用
 *
 * ⚠️ 稅率表、自用優惠、實拿公式全部在 ./calc-core.js。
 *    那個檔是 D:\估價建議書\src\calc\calc-core.js 自動複製過來的副本，
 *    **不要直接改這個資料夾裡的 calc-core.js**——下次同步就被蓋掉了。
 *    要改稅率：改估價建議書那邊的正本，再跑 `node tools/同步算法.mjs`。
 *
 * 這個檔只放官網自己要的：客戶手上多半沒有謄本，所以這裡是「粗估」版本
 * ——土地漲價總數額做成選填，土增稅不算。精算仍然要走估價建議書。
 */

import { RATE_TABLE, SELF_USE, rateFor, round, holdingFrom, taxScenario } from "./calc-core.js";

// 沿用原本的匯出介面，既有的 import 不用動
export { RATE_TABLE, SELF_USE, rateFor };

export type Holding = {
  持有年限: number;
  現行稅率: number;
  現行稅率說明: string;
  降稅節點: { years: number; 民國: string; rate: number; 還要多久: string } | null;
  可用自用優惠: boolean;
  自用優惠說明: string;
};

/**
 * 持有期間與下一個降稅節點
 *
 * ⚠️ 取得日一律用「完成所有權移轉登記之日」。
 *    預售屋轉成屋不可併計預售期間，要從成屋登記日重新起算。
 */
export function holdingStatus(取得年: number, 取得月: number, asOf = new Date()): Holding {
  const h = holdingFrom(new Date(取得年, 取得月 - 1, 1), asOf);
  const n = h.降稅節點;

  let 降稅節點: Holding["降稅節點"] = null;
  if (n) {
    const months = n.monthsAway;
    降稅節點 = {
      years: n.years,
      民國: n.dateLabel,
      rate: n.rate,
      還要多久: months >= 12 ? `約 ${Math.floor(months / 12)} 年 ${months % 12} 個月` : `約 ${months} 個月`,
    };
  }

  // 🔴 持有未滿 6 年物理上不可能符合自用優惠（要設籍＋持有＋實際居住連續滿 6 年）。
  //    不擋的話會讓屋主以為「勾一下就能省稅」，是會害人的錯誤期待。
  //    比大小用未捨入的年限，不然差幾天的案子會被捨進去。
  const 可用自用優惠 = h.年限原始 >= SELF_USE.minYears;

  return {
    持有年限: h.持有年限,
    現行稅率: h.現行稅率,
    現行稅率說明: h.現行稅率說明,
    降稅節點,
    可用自用優惠,
    自用優惠說明: 可用自用優惠
      ? "需同時符合：本人或配偶、未成年子女設有戶籍，且持有並實際居住連續滿 6 年，6 年內未出租、營業或執行業務使用。"
      : `本案持有 ${round(h.年限原始, 1)} 年，未滿 6 年，不適用自用住宅優惠。`,
  };
}

export type TaxInput = {
  售價: number;
  取得成本: number;
  服務費率?: number;
  代書費?: number;
  裝潢修繕?: number;
  /** 沒有謄本就留空，結果會標示「未計入」 */
  土地漲價總數額?: number | null;
  稅率: number;
  自用優惠?: boolean;
};

/**
 * 客戶自助版的稅務試算
 *
 * 算法整個走 calc-core 的 taxScenario（跟估價報告同一支函式），
 * 這裡只挑官網畫面用得到的欄位出來——土增稅、貸款餘額那幾欄客戶填不出來，
 * 留在畫面上只會讓人以為算過了。
 */
export function computeTax(p: TaxInput) {
  const s = taxScenario(p);
  return {
    服務費: s.服務費,
    代書費: s.代書費,
    裝潢修繕: s.裝潢修繕,
    必要費用: s.必要費用,
    課稅所得: s.課稅所得,
    稅率: s.稅率,
    稅率顯示: s.稅率顯示,
    自用優惠: s.自用優惠,
    房地合一稅: s.房地合一稅,
    稅後實拿: s.稅後實拿,
    毛利: s.毛利,
    土增稅已計入: p.土地漲價總數額 != null,
  };
}
