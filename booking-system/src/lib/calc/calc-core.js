/**
 * 算法核心 —— 官網與估價建議書共用的唯一一份
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ 🔴 這個檔案在硬碟上有兩份實體，內容必須「逐字元相同」：              ║
 * ║                                                                      ║
 * ║   正本  D:\估價建議書\src\calc\calc-core.js            ← 只改這裡    ║
 * ║   副本  D:\zhan-realtor\booking-system\src\lib\calc\calc-core.js     ║
 * ║                                                                      ║
 * ║ 改完正本，一定要跑：  node tools/同步算法.mjs                        ║
 * ║                                                                      ║
 * ║ 為什麼要有副本：官網是部署到 Vercel 的，它只讀得到自己 repo 裡的檔， ║
 * ║ 讀不到 D:\估價建議書。所以只能用「一份正本 ＋ 一份自動複製的副本」。 ║
 * ║                                                                      ║
 * ║ 忘了同步會怎樣：同一個屋主，在官網試算頁看到一個稅額、在你給他的     ║
 * ║ 估價報告上看到另一個稅額。這種錯客戶會當場抓到。                     ║
 * ║                                                                      ║
 * ║ 兩道防線（都不用你記）：                                             ║
 * ║   · 中控台首頁 localhost:3100 會比對這兩個檔，不一樣就亮紅燈         ║
 * ║   · 估價建議書 npm test 會直接失敗                                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * 這裡只放「兩邊都要一樣」的東西：稅法參數、稅率級距、實拿公式、房貸月付公式。
 * 只有單邊會用到的（青安 3.0、土增稅、持有成本、報告算式）留在各自的檔案裡。
 */

// ──────────────────────────── 共用工具 ────────────────────────────

/**
 * 四捨五入到指定小數位（先加 EPSILON 避開浮點誤差）
 *
 * 不加的話 0.145 會被算成 0.14 —— 二進位存不下 0.145，實際值略小於它。
 * 屋主拿計算機驗算會對不起來。
 *
 * @param {number} n
 * @param {number} [digits=0]
 * @returns {number}
 */
export function round(n, digits = 0) {
  const f = 10 ** digits;
  return Math.round((n + Number.EPSILON) * f) / f;
}

// ──────────────────────── 房地合一稅 2.0 參數 ────────────────────────
//
// 個人・境內居住者。修法時只改這一段。
//
// ⚠️ 已知的下一次變動：115/10/13 之後「簽約」的案件，持有 2～5 年由 45% 降到 35%。
//    真的要改的時候，稅率會變成「跟簽約日有關」，不再只看持有年限，
//    到時候 rateFor() 要多吃一個簽約日參數，不是只把數字換掉就好。

/** 持有年限 → 稅率 */
export const RATE_TABLE = [
  { maxYears: 2,        rate: 0.45, label: '持有未滿 2 年' },
  { maxYears: 5,        rate: 0.35, label: '持有 2 ～ 5 年' },
  { maxYears: 10,       rate: 0.20, label: '持有 5 ～ 10 年' },
  { maxYears: Infinity, rate: 0.15, label: '持有超過 10 年' },
];

/**
 * 自用住宅優惠：課稅所得超過 400 萬的部分課 10%
 *
 * minYears = 6：要設籍＋持有＋實際居住「連續滿 6 年」。
 * 持有本身沒滿 6 年的案子物理上不可能符合，兩邊都要擋掉，
 * 不擋的話屋主會以為「勾一下就能省稅」——那是會害人的錯誤期待。
 */
export const SELF_USE = { rate: 0.10, exemptionWan: 400, minYears: 6 };

/** 必要費用未提示證明時的推計上限（成交價 5%，上限 30 萬） */
export const IMPUTED_COST = { rate: 0.05, capWan: 30 };

/** 降稅節點：持有滿這幾年會跳一級 */
export const MILESTONES = [2, 5, 10];

/** 仲介服務費預設費率：賣方 4%、買方 2% */
export const 服務費率預設 = { 賣方: 0.04, 買方: 0.02 };

/**
 * 依持有年限取稅率級距
 * @param {number} years 持有年限（含小數）
 */
export function rateFor(years) {
  return RATE_TABLE.find((r) => years < r.maxYears) ?? RATE_TABLE[RATE_TABLE.length - 1];
}

/**
 * 持有期間與下一個降稅節點
 *
 * ⚠️ 取得日一律用「完成所有權移轉登記之日」。
 *    預售屋轉成屋不可併計預售期間，要從成屋登記日重新起算（財政部令）。
 *
 * 回傳的是中性結構，兩邊各自再包成自己要的欄位名稱。
 *
 * @param {Date} 取得日
 * @param {Date} asOf 基準日
 */
export function holdingFrom(取得日, asOf) {
  const years = (asOf.getTime() - 取得日.getTime()) / (365.2425 * 24 * 3600 * 1000);
  const current = rateFor(years);

  const nextYears = MILESTONES.find((m) => years < m) ?? null;
  let 降稅節點 = null;
  if (nextYears != null) {
    const nd = new Date(取得日);
    nd.setFullYear(nd.getFullYear() + nextYears);
    降稅節點 = {
      years: nextYears,
      date: nd,
      dateLabel: `${nd.getFullYear() - 1911} 年 ${nd.getMonth() + 1} 月`,
      rate: rateFor(nextYears + 0.01).rate,
      monthsAway: Math.max(round((nd.getTime() - asOf.getTime()) / (30.44 * 24 * 3600 * 1000), 0), 0),
    };
  }

  return {
    取得日,
    年限原始: years,          // 未捨入。判斷「滿 N 年」一律用這個，不要用下面那個顯示值
    持有年限: round(years, 2),
    現行稅率: current.rate,
    現行稅率說明: current.label,
    降稅節點,
  };
}

/**
 * @typedef {Object} 稅務情境
 * @property {number}       售價           成交價（萬）
 * @property {number}       取得成本        取得總價（萬）
 * @property {number}      [服務費率]       預設 4%（賣方）
 * @property {number}      [服務費]         直接給則覆寫服務費率算出來的值（萬）
 * @property {number}      [代書費]         萬
 * @property {number}      [裝潢修繕]       萬
 * @property {number|null} [土地漲價總數額]  萬；null 表示待查
 * @property {number|null} [土地增值稅]      萬；null 表示待查
 * @property {number|null} [貸款餘額]       萬；null 表示未提供
 * @property {number}      [稅率]           0.45 / 0.35 / 0.20 / 0.15
 * @property {boolean}     [自用優惠]       true 時改套 10% 並扣 400 萬免稅額
 */

/**
 * 房地合一稅與實拿試算 —— 完整模型
 *
 * 所有金額單位：萬元
 *
 * @param {稅務情境} p
 *   售價          成交價（萬）
 *   取得成本       取得總價（萬）
 *   服務費率       預設 4%（賣方）
 *   服務費         直接給則覆寫服務費率算出來的值（萬）
 *   代書費         萬，預設 0
 *   裝潢修繕       有單據可列必要費用（萬），預設 0
 *   土地漲價總數額  萬；null 表示待查（不扣，結果要標「未計入」）
 *   土地增值稅      萬；null 表示待查
 *   貸款餘額       萬；null 表示未提供
 *   稅率           0.45 / 0.35 / 0.20 / 0.15
 *   自用優惠        true 時改套 10% 並扣 400 萬免稅額
 */
export function taxScenario(p) {
  const 售價 = p.售價;
  const 服務費 = p.服務費 ?? round(售價 * (p.服務費率 ?? 服務費率預設.賣方), 1);
  const 代書費 = p.代書費 ?? 0;
  const 裝潢修繕 = p.裝潢修繕 ?? 0;
  const 土地漲價 = p.土地漲價總數額 ?? 0;
  const 土增稅 = p.土地增值稅 ?? 0;

  const 必要費用 = round(服務費 + 代書費 + 裝潢修繕, 1);
  const 課稅所得 = round(Math.max(售價 - p.取得成本 - 必要費用 - 土地漲價, 0), 1);

  const 自用 = p.自用優惠 === true;
  const 稅率 = 自用 ? SELF_USE.rate : p.稅率;
  // 每一步都先收斂到報告顯示的精度（萬元一位小數），屋主拿計算機驗算才對得起來
  const 房地合一稅 = round(自用
    ? Math.max(課稅所得 - SELF_USE.exemptionWan, 0) * SELF_USE.rate
    : 課稅所得 * 稅率, 1);

  const 稅後實拿 = round(售價 - 服務費 - 代書費 - 房地合一稅 - 土增稅, 1);
  const 真正入袋 = p.貸款餘額 != null ? round(稅後實拿 - p.貸款餘額, 1) : null;

  return {
    售價: round(售價, 1),
    取得成本: round(p.取得成本, 1),
    服務費: round(服務費, 1),
    代書費: round(代書費, 1),
    裝潢修繕: round(裝潢修繕, 1),
    必要費用: round(必要費用, 1),
    土地漲價總數額: p.土地漲價總數額 == null ? null : round(土地漲價, 1),
    課稅所得: round(課稅所得, 1),
    稅率,
    稅率顯示: `${round(稅率 * 100, 0)}%`,
    自用優惠: 自用,
    房地合一稅: round(房地合一稅, 1),
    土地增值稅: p.土地增值稅 == null ? null : round(土增稅, 1),
    稅後實拿: round(稅後實拿, 1),
    貸款餘額: p.貸款餘額 ?? null,
    真正入袋: 真正入袋 == null ? null : round(真正入袋, 1),
    夠清償貸款: 真正入袋 == null ? null : 真正入袋 >= 0,
    毛利: round(稅後實拿 - p.取得成本, 1),
    算式: `${round(售價)} − 取得 ${round(p.取得成本)} − 必要費用 ${round(必要費用, 1)}`
        + (p.土地漲價總數額 != null ? ` − 土地漲價 ${round(土地漲價, 1)}` : '')
        + ` ＝ 課稅所得 ${round(課稅所得, 1)} 萬`,
  };
}

// ──────────────────────────── 房貸 ────────────────────────────

/**
 * 本息平均攤還月付金
 *
 * @param {number} 本金萬 貸款金額（萬元）
 * @param {number} 年利率 例 0.021
 * @param {number} 年期   例 30
 * @returns {number} 月付金（元）
 */
export function monthlyPayment(本金萬, 年利率, 年期) {
  const P = 本金萬 * 10000;
  const r = 年利率 / 12;
  const n = 年期 * 12;
  if (n <= 0) return 0;
  if (r === 0) return P / n;
  return (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}
