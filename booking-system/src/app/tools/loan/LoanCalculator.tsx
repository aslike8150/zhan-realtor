"use client";

/**
 * 房貸試算（客戶自助版）
 *
 * 公式走 src/lib/calc/loan.ts，跟估價建議書買方版同一套。
 *
 * 設計取捨：
 *   - 自備款、利率、年期都給滑桿，手機上用手指拉比打字快得多
 *   - 結果面板一定要出現「利率 +0.5% 月付變多少」——買方最該先知道的一件事
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeLoan, monthlyPayment, 青安3 } from "@/lib/calc/loan";

const num = (v: string, fallback = 0) => {
  const n = Number(v.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : fallback;
};

const money = (n: number) => Math.round(n).toLocaleString("zh-TW");

export function LoanCalculator() {
  const [總價, set總價] = useState("1200");
  const [自備款率, set自備款率] = useState(20);
  const [利率, set利率] = useState("2.1");
  const [年期, set年期] = useState(30);
  const [寬限期年, set寬限期年] = useState(0);
  // 只影響「要不要顯示補貼遞減提醒」，不參與計算
  const [青安, set青安] = useState(false);

  const 套用青安 = () => {
    set利率(String(青安3.優惠利率));
    set年期(青安3.年期);
    set寬限期年(青安3.寬限期年);
    set青安(true);
  };

  const r = useMemo(
    () =>
      computeLoan({
        總價: num(總價),
        自備款率: 自備款率 / 100,
        利率: num(利率, 2.1) / 100,
        年期,
        寬限期年,
      }),
    [總價, 自備款率, 利率, 年期, 寬限期年],
  );

  // 🔴 青安的陷阱：拿前 3 年的優惠利率去算 40 年會嚴重低估。
  //    補貼第 7 年歸零，這時候的月付一定要讓客戶先看到。
  const 期滿月付 = useMemo(
    () => monthlyPayment(r.貸款額, 青安3.期滿利率 / 100, Math.max(年期 - 寬限期年, 1)),
    [r.貸款額, 年期, 寬限期年],
  );
  const 超過額度 = 青安 && r.貸款額 > 青安3.額度上限萬.一般;
  const 超過房價上限 = 青安 && num(總價) > 青安3.房價上限萬_台南;

  return (
    <div className="calc">
      <div className="calc__form">
        <div className="calc__field">
          <label htmlFor="loan-price">房屋總價</label>
          <div className="calc__unit">
            <input
              id="loan-price"
              className="calc__input"
              inputMode="decimal"
              value={總價}
              onChange={(e) => set總價(e.target.value)}
            />
            <span>萬</span>
          </div>
        </div>

        <div className="calc__field">
          <label htmlFor="loan-down">自備款比例：{自備款率}%（{r.自備款} 萬）</label>
          <input
            id="loan-down"
            className="calc__range"
            type="range"
            min={10}
            max={50}
            step={5}
            value={自備款率}
            onChange={(e) => set自備款率(Number(e.target.value))}
          />
          <span className="calc__hint">
            自住通常抓 2～3 成。第二戶以上、或屬於管制區域，成數會被壓低，實際以銀行核定為準。
          </span>
        </div>

        <div className="calc__field">
          <label htmlFor="loan-rate">年利率</label>
          <div className="calc__unit">
            <input
              id="loan-rate"
              className="calc__input"
              inputMode="decimal"
              value={利率}
              onChange={(e) => {
                set利率(e.target.value);
                set青安(false);
              }}
            />
            <span>%</span>
          </div>
          <button type="button" className="calc__preset" onClick={套用青安}>
            套用青安 3.0（{青安3.優惠利率}%・{青安3.年期} 年・寬限 {青安3.寬限期年} 年）
          </button>
          <span className="calc__hint">
            新青安 {青安3.適用期間}。利率隨郵局定儲利率浮動，實際以承貸銀行公告為準。
          </span>
        </div>

        <div className="calc__field">
          <label htmlFor="loan-years">貸款年期：{年期} 年</label>
          <input
            id="loan-years"
            className="calc__range"
            type="range"
            min={10}
            max={40}
            step={5}
            value={年期}
            onChange={(e) => set年期(Number(e.target.value))}
          />
        </div>

        <div className="calc__field">
          <label htmlFor="loan-grace">
            寬限期：{寬限期年 === 0 ? "不使用" : `${寬限期年} 年`}
          </label>
          <input
            id="loan-grace"
            className="calc__range"
            type="range"
            min={0}
            max={5}
            step={1}
            value={寬限期年}
            onChange={(e) => set寬限期年(Number(e.target.value))}
          />
          <span className="calc__hint">
            寬限期只繳利息不還本金。期滿之後本金要在剩下的年數裡還完，
            <strong>月付會跳一階</strong>，先看清楚跳完是多少再決定。
          </span>
        </div>
      </div>

      <div className="calc__result">
        <span className={`calc__badge ${青安 ? "calc__badge--warn" : ""}`}>
          {青安
            ? `青安 3.0・前 ${青安3.補貼年數} 年 ${青安3.優惠利率}%`
            : 寬限期年 > 0
              ? `寬限 ${寬限期年} 年後的月付`
              : "本息平均攤還"}
        </span>

        <div className="calc__headline">
          <span>每月應繳</span>
          <strong>
            {money(r.月付)}
            <small>元</small>
          </strong>
        </div>

        <dl className="calc__lines">
          {寬限期年 > 0 ? (
            <div className="is-strong">
              <dt>寬限期內月付</dt>
              <dd>{money(r.寬限期月付)} 元</dd>
            </div>
          ) : null}
          <div>
            <dt>貸款金額</dt>
            <dd>{r.貸款額} 萬</dd>
          </div>
          <div>
            <dt>自備款</dt>
            <dd>{r.自備款} 萬</dd>
          </div>
          <div>
            <dt>仲介服務費（2%）</dt>
            <dd>{r.仲介服務費} 萬</dd>
          </div>
          <div>
            <dt>代書費・規費概估</dt>
            <dd>{r.代書費} 萬</dd>
          </div>
          <div className="is-strong is-total">
            <dt>進場資金合計</dt>
            <dd>{r.進場資金} 萬</dd>
          </div>
          <div>
            <dt>總利息支出</dt>
            <dd>{money(r.總利息 / 10000)} 萬</dd>
          </div>
          <div>
            <dt>建議月收入</dt>
            <dd>{money(r.建議月收入)} 元</dd>
          </div>
        </dl>

        {青安 ? (
          <p className="calc__note">
            <strong style={{ color: "#fff" }}>補貼會遞減，別用前 3 年的數字規劃 40 年。</strong>
            <br />
            前 {青安3.補貼年數} 年 {青安3.優惠利率}%；第 4 年起補貼每年減半碼；
            第 7 年起補貼歸零、回到 {青安3.期滿利率}%，屆時月付約{" "}
            <strong style={{ color: "#fff" }}>{money(期滿月付)} 元</strong>
            （比現在多 {money(期滿月付 - r.月付)} 元）。
            {超過額度 ? (
              <>
                <br />
                <br />
                ⚠️ 貸款額 {r.貸款額} 萬已超過一般戶上限 {青安3.額度上限萬.一般} 萬。
                新婚 2 年內可到 {青安3.額度上限萬.新婚} 萬、育有未成年子女可到{" "}
                {青安3.額度上限萬.育兒} 萬，超出部分要另外用一般房貸承作。
              </>
            ) : null}
            {超過房價上限 ? (
              <>
                <br />
                <br />
                ⚠️ 總價 {num(總價)} 萬超過台南適用的房價上限 {青安3.房價上限萬_台南} 萬，
                本案可能不符青安資格。
              </>
            ) : null}
            <br />
            <br />
            資格：{青安3.資格}
          </p>
        ) : null}

        <table className="calc__table">
          <thead>
            <tr>
              <th>利率</th>
              <th>月付</th>
              <th>與現在差</th>
            </tr>
          </thead>
          <tbody>
            {r.敏感度.map((s) => (
              <tr key={s.利率} className={s.差額 === 0 ? "is-now" : undefined}>
                <td>{s.利率.toFixed(2)}%</td>
                <td>{money(s.月付)}</td>
                <td>
                  {s.差額 === 0 ? "—" : `${s.差額 > 0 ? "+" : ""}${money(s.差額)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="calc__note">
          <strong style={{ color: "#fff" }}>「建議月收入」是銀行的習慣門檻</strong>
          ——月付不超過家庭月收入的三分之一。超過的話不是不能貸，是生活會很緊。
        </p>

        <p className="calc__note">
          實際成數與利率由銀行依個案核定（信用、收入、屋齡、區域都會影響）。
          <Link href="/card/booking" style={{ color: "#fff", textDecoration: "underline" }}>
            預約諮詢
          </Link>
          我可以幫你評估合理的進場預算。
        </p>
      </div>
    </div>
  );
}
