"use client";

/**
 * 房地合一稅試算（客戶自助版）
 *
 * 規則全部走 src/lib/calc/tax.ts，跟估價建議書同一套，不要在這裡另外寫邏輯。
 *
 * 🔴 兩個一定要守住的地方：
 *   1. 持有未滿 6 年 → 自用優惠的勾選框直接鎖住並說明原因。
 *      不擋的話屋主會以為「勾一下就能省稅」，那是會害人的錯誤期待。
 *   2. 土地漲價總數額沒填 → 結果要標「未扣除」，不能讓人以為這就是最終稅額。
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { holdingStatus, computeTax } from "@/lib/calc/tax";

const num = (v: string, fallback = 0) => {
  const n = Number(v.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : fallback;
};

const wan = (n: number) => n.toLocaleString("zh-TW", { maximumFractionDigits: 1 });

export function TaxCalculator() {
  // 用民國年，房仲跟屋主講的都是民國
  const [取得年, set取得年] = useState("110");
  const [取得月, set取得月] = useState("1");
  const [售價, set售價] = useState("1200");
  const [取得成本, set取得成本] = useState("900");
  const [服務費率, set服務費率] = useState("4");
  const [代書費, set代書費] = useState("0");
  const [裝潢修繕, set裝潢修繕] = useState("0");
  const [土地漲價, set土地漲價] = useState("");
  const [自用, set自用] = useState(false);

  // 伺服器與瀏覽器的「今天」可能差一天，直接在 render 時算會 hydration 不一致，
  // 所以掛載後才取現在時間
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const holding = useMemo(() => {
    if (!now) return null;
    const y = num(取得年, 110) + 1911;
    const m = Math.min(Math.max(num(取得月, 1), 1), 12);
    return holdingStatus(y, m, now);
  }, [now, 取得年, 取得月]);

  // 持有未滿 6 年就不可能適用自用優惠，勾了也要強制關掉
  const 可自用 = holding?.可用自用優惠 ?? false;
  useEffect(() => {
    if (!可自用 && 自用) set自用(false);
  }, [可自用, 自用]);

  const result = useMemo(() => {
    if (!holding) return null;
    return computeTax({
      售價: num(售價),
      取得成本: num(取得成本),
      服務費率: num(服務費率, 4) / 100,
      代書費: num(代書費),
      裝潢修繕: num(裝潢修繕),
      土地漲價總數額: 土地漲價.trim() === "" ? null : num(土地漲價),
      稅率: holding.現行稅率,
      自用優惠: 自用 && 可自用,
    });
  }, [holding, 售價, 取得成本, 服務費率, 代書費, 裝潢修繕, 土地漲價, 自用, 可自用]);

  return (
    <div className="calc">
      <div className="calc__form">
        <div className="calc__field">
          <label htmlFor="tax-buy">取得日期（完成所有權移轉登記之日）</label>
          <div className="calc__row">
            <div className="calc__unit">
              <input
                id="tax-buy"
                className="calc__input"
                inputMode="numeric"
                value={取得年}
                onChange={(e) => set取得年(e.target.value)}
              />
              <span>年</span>
            </div>
            <div className="calc__unit">
              <input
                className="calc__input"
                inputMode="numeric"
                aria-label="取得月份"
                value={取得月}
                onChange={(e) => set取得月(e.target.value)}
              />
              <span>月</span>
            </div>
          </div>
          <span className="calc__hint">
            填民國年。⚠️ 預售屋轉成屋<strong>不能併計預售期間</strong>，要填成屋的登記日期。
          </span>
        </div>

        <div className="calc__field">
          <label htmlFor="tax-price">預計售價</label>
          <div className="calc__unit">
            <input
              id="tax-price"
              className="calc__input"
              inputMode="decimal"
              value={售價}
              onChange={(e) => set售價(e.target.value)}
            />
            <span>萬</span>
          </div>
        </div>

        <div className="calc__field">
          <label htmlFor="tax-cost">當初取得總價</label>
          <div className="calc__unit">
            <input
              id="tax-cost"
              className="calc__input"
              inputMode="decimal"
              value={取得成本}
              onChange={(e) => set取得成本(e.target.value)}
            />
            <span>萬</span>
          </div>
          <span className="calc__hint">買賣契約上的成交價，不含當時的仲介費與規費。</span>
        </div>

        <div className="calc__row">
          <div className="calc__field">
            <label htmlFor="tax-fee">仲介服務費</label>
            <div className="calc__unit">
              <input
                id="tax-fee"
                className="calc__input"
                inputMode="decimal"
                value={服務費率}
                onChange={(e) => set服務費率(e.target.value)}
              />
              <span>%</span>
            </div>
          </div>
          <div className="calc__field">
            <label htmlFor="tax-deed">代書費</label>
            <div className="calc__unit">
              <input
                id="tax-deed"
                className="calc__input"
                inputMode="decimal"
                value={代書費}
                onChange={(e) => set代書費(e.target.value)}
              />
              <span>萬</span>
            </div>
          </div>
        </div>

        <div className="calc__field">
          <label htmlFor="tax-reno">裝潢修繕（有單據才能列）</label>
          <div className="calc__unit">
            <input
              id="tax-reno"
              className="calc__input"
              inputMode="decimal"
              value={裝潢修繕}
              onChange={(e) => set裝潢修繕(e.target.value)}
            />
            <span>萬</span>
          </div>
        </div>

        <div className="calc__field">
          <label htmlFor="tax-land">土地漲價總數額（選填）</label>
          <div className="calc__unit">
            <input
              id="tax-land"
              className="calc__input"
              inputMode="decimal"
              placeholder="沒有謄本就留空"
              value={土地漲價}
              onChange={(e) => set土地漲價(e.target.value)}
            />
            <span>萬</span>
          </div>
          <span className="calc__hint">
            這筆可以從課稅所得裡扣掉，金額要看土地謄本才算得出來。留空的話下面算出來的稅會偏高。
          </span>
        </div>

        <label className={`calc__check ${可自用 ? "" : "calc__check--off"}`}>
          <input
            type="checkbox"
            checked={自用 && 可自用}
            disabled={!可自用}
            onChange={(e) => set自用(e.target.checked)}
          />
          <span>
            套用自用住宅優惠（免稅額 400 萬、超過部分 10%）
            <span className="calc__hint">{holding?.自用優惠說明 ?? "計算中…"}</span>
          </span>
        </label>
      </div>

      <div className="calc__result">
        {!holding || !result ? (
          <p className="calc__note" style={{ margin: 0, border: 0, padding: 0 }}>
            計算中…
          </p>
        ) : (
          <>
            <span className={`calc__badge ${自用 && 可自用 ? "" : "calc__badge--warn"}`}>
              {自用 && 可自用
                ? "自用住宅優惠 10%"
                : `${holding.現行稅率說明}・稅率 ${Math.round(holding.現行稅率 * 100)}%`}
            </span>

            <div className="calc__headline">
              <span>預估房地合一稅</span>
              <strong>
                {wan(result.房地合一稅)}
                <small>萬</small>
              </strong>
            </div>

            <dl className="calc__lines">
              <div>
                <dt>持有期間</dt>
                <dd>{holding.持有年限} 年</dd>
              </div>
              <div>
                <dt>必要費用</dt>
                <dd>{wan(result.必要費用)} 萬</dd>
              </div>
              <div>
                <dt>土地漲價總數額</dt>
                <dd>{result.土增稅已計入 ? `${wan(num(土地漲價))} 萬` : "未填，未扣除"}</dd>
              </div>
              <div className="is-strong">
                <dt>課稅所得</dt>
                <dd>{wan(result.課稅所得)} 萬</dd>
              </div>
              <div>
                <dt>適用稅率</dt>
                <dd>{result.稅率顯示}</dd>
              </div>
              <div className="is-strong is-total">
                <dt>賣掉後實拿</dt>
                <dd>{wan(result.稅後實拿)} 萬</dd>
              </div>
              <div>
                <dt>相對取得成本</dt>
                <dd>
                  {result.毛利 >= 0 ? "+" : ""}
                  {wan(result.毛利)} 萬
                </dd>
              </div>
            </dl>

            {holding.降稅節點 ? (
              <p className="calc__note">
                <strong style={{ color: "#fff" }}>再等一下稅率會降。</strong>
                <br />
                持有滿 {holding.降稅節點.years} 年（民國 {holding.降稅節點.民國}，
                {holding.降稅節點.還要多久}）之後，稅率降到{" "}
                {Math.round(holding.降稅節點.rate * 100)}%。要不要等，要看你的資金安排與市場走向。
              </p>
            ) : (
              <p className="calc__note">已持有超過 10 年，適用最低稅率 15%，沒有下一個降稅節點了。</p>
            )}

            <p className="calc__note">
              以上為粗估。實際稅額還會受必要費用單據、重購退稅、非自願因素等影響，
              <Link href="/card/booking" style={{ color: "#fff", textDecoration: "underline" }}>
                預約一次諮詢
              </Link>
              我用謄本幫你算精確版本。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
