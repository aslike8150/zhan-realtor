/**
 * 房地合一稅 2.0（個人・境內居住者）—— 客戶自助試算用
 *
 * ⚠️ 規則與 D:\估價建議書 的 src/calc/tax.js 同一套，兩邊算出來必須一樣。
 *    那邊改了這邊也要跟著改，否則官網跟估價報告會給客戶兩個答案。
 *
 * 這裡是「粗估」版本：土地漲價總數額做成選填，因為客戶手上多半沒有謄本。
 * 精算仍然要走估價建議書（有官方物價指數表可以自動算土增稅）。
 */

/** 持有年限 → 稅率 */
export const RATE_TABLE = [
  { maxYears: 2, rate: 0.45, label: "持有未滿 2 年" },
  { maxYears: 5, rate: 0.35, label: "持有 2 ～ 5 年" },
  { maxYears: 10, rate: 0.2, label: "持有 5 ～ 10 年" },
  { maxYears: Infinity, rate: 0.15, label: "持有超過 10 年" },
] as const;

/** 自用住宅優惠：課稅所得超過 400 萬的部分課 10% */
export const SELF_USE = { rate: 0.1, exemptionWan: 400, minYears: 6 } as const;

const round = (n: number, d = 1) => {
  const p = 10 ** d;
  return Math.round(n * p) / p;
};

export function rateFor(years: number) {
  return RATE_TABLE.find((r) => years < r.maxYears) ?? RATE_TABLE[RATE_TABLE.length - 1];
}

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
  const start = new Date(取得年, 取得月 - 1, 1);
  const years = (asOf.getTime() - start.getTime()) / (365.2425 * 24 * 3600 * 1000);
  const current = rateFor(years);

  const nextYears = [2, 5, 10].find((m) => years < m) ?? null;
  let 降稅節點: Holding["降稅節點"] = null;
  if (nextYears != null) {
    const nd = new Date(start);
    nd.setFullYear(nd.getFullYear() + nextYears);
    const months = Math.max(
      Math.round((nd.getTime() - asOf.getTime()) / (30.44 * 24 * 3600 * 1000)),
      0,
    );
    降稅節點 = {
      years: nextYears,
      民國: `${nd.getFullYear() - 1911} 年 ${nd.getMonth() + 1} 月`,
      rate: rateFor(nextYears + 0.01).rate,
      還要多久: months >= 12 ? `約 ${Math.floor(months / 12)} 年 ${months % 12} 個月` : `約 ${months} 個月`,
    };
  }

  // 🔴 持有未滿 6 年物理上不可能符合自用優惠（要設籍＋持有＋實際居住連續滿 6 年）。
  //    不擋的話會讓屋主以為「勾一下就能省稅」，是會害人的錯誤期待。
  const 可用自用優惠 = years >= SELF_USE.minYears;

  return {
    持有年限: round(years, 2),
    現行稅率: current.rate,
    現行稅率說明: current.label,
    降稅節點,
    可用自用優惠,
    自用優惠說明: 可用自用優惠
      ? "需同時符合：本人或配偶、未成年子女設有戶籍，且持有並實際居住連續滿 6 年，6 年內未出租、營業或執行業務使用。"
      : `本案持有 ${round(years, 1)} 年，未滿 6 年，不適用自用住宅優惠。`,
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

export function computeTax(p: TaxInput) {
  const 服務費 = round(p.售價 * (p.服務費率 ?? 0.04), 1);
  const 代書費 = p.代書費 ?? 0;
  const 裝潢修繕 = p.裝潢修繕 ?? 0;
  const 土地漲價 = p.土地漲價總數額 ?? 0;

  const 必要費用 = round(服務費 + 代書費 + 裝潢修繕, 1);
  const 課稅所得 = round(Math.max(p.售價 - p.取得成本 - 必要費用 - 土地漲價, 0), 1);

  const 自用 = p.自用優惠 === true;
  const 稅率 = 自用 ? SELF_USE.rate : p.稅率;
  const 房地合一稅 = round(
    自用
      ? Math.max(課稅所得 - SELF_USE.exemptionWan, 0) * SELF_USE.rate
      : 課稅所得 * 稅率,
    1,
  );

  const 稅後實拿 = round(p.售價 - 服務費 - 代書費 - 房地合一稅, 1);

  return {
    服務費,
    代書費,
    裝潢修繕,
    必要費用,
    課稅所得,
    稅率,
    稅率顯示: `${round(稅率 * 100, 0)}%`,
    自用優惠: 自用,
    房地合一稅,
    稅後實拿,
    毛利: round(稅後實拿 - p.取得成本, 1),
    土增稅已計入: p.土地漲價總數額 != null,
  };
}
