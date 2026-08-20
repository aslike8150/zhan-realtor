/**
 * /tools/school —— 台南國中小學區查詢
 *
 * ⚠️ 這頁刻意「不」在站內做學區查詢。
 *
 * 原因：學區以里鄰劃分、每年由教育局公告、且會調整。臺南市的學區開放資料
 * （data.tainan.gov.tw/dataset/zones-query）已經下架，沒有可靠的資料來源可以內建。
 * 客戶是為了學區買房，資料錯了後果很嚴重，寧可導到官方系統也不要自己猜。
 *
 * 如果之後拿到教育局的正式學區表，再改成站內查詢。
 */
import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, SITE_URL } from "@/config/owner";

export const metadata: Metadata = {
  title: `台南國中小學區查詢｜怎麼查才不會查錯｜${OWNER.name}`,
  description:
    "台南市國中小學區查詢的正確做法：官方查詢系統連結、以里鄰劃分的查法，以及為了學區買房一定要先確認的三件事。",
  alternates: { canonical: `${SITE_URL}/tools/school` },
};

const OFFICIAL = "https://std.tn.edu.tw/sis/anonyquery/SchoolDistrict.aspx";
const SCHOOL_DIR = "https://school.tn.edu.tw/";

export default function SchoolToolPage() {
  return (
    <section className="tool-page">
      <div className="pv-wrap">
        <Link href="/tools" className="tool-back">
          ← 實用工具
        </Link>
        <div className="tool-head">
          <p className="pv-eyebrow">Tool 03</p>
          <h1>台南國中小學區查詢</h1>
          <p>
            為了學區買房，一定要查到官方公告才算數。仲介口頭說的、社區廣告寫的、
            網路上抄來抄去的，都不能當依據。這頁告訴你正確的查法，以及三個最容易踩到的坑。
          </p>
        </div>

        <div className="calc">
          <div className="calc__form">
            <div className="calc__field">
              <label>查詢步驟</label>
              <ol className="tool-steps">
                <li>
                  先確認物件的<strong>行政區、里、鄰</strong>。學區是用「里鄰」劃的，
                  不是用路名或門牌號碼——同一條路兩側分屬不同學區是常有的事。
                </li>
                <li>
                  打開教育局的學區查詢系統，<strong>先選學校</strong>，
                  系統會列出那所學校涵蓋哪些里鄰。這個系統是「學校 → 里鄰」的方向，
                  不是輸入地址就跳出學校，所以第 1 步不能跳過。
                </li>
                <li>
                  比對第 1 步查到的里鄰有沒有在名單裡。<strong>有，才叫在學區內。</strong>
                </li>
                <li>
                  最後<strong>打電話到那所學校的教務處確認</strong>。
                  尤其是額滿學校，另外會有設籍期間的規定，各校不同。
                </li>
              </ol>
            </div>

            <a href={OFFICIAL} target="_blank" rel="noreferrer" className="pv-btn pv-btn--brand">
              開啟教育局學區查詢系統 ↗
            </a>
            <a href={SCHOOL_DIR} target="_blank" rel="noreferrer" className="pv-btn">
              臺南市學校基本資料網 ↗
            </a>
          </div>

          <div className="calc__result">
            <span className="calc__badge calc__badge--warn">為了學區買房前必看</span>

            <div className="calc__headline">
              <span>三個最容易踩的坑</span>
            </div>

            <dl className="calc__lines">
              <div className="is-strong">
                <dt>01</dt>
                <dd>學區看里鄰，不看路名</dd>
              </div>
            </dl>
            <p className="calc__note" style={{ marginTop: 12 }}>
              同一條路、甚至同一個社區的不同棟，都可能分屬不同里。
              一定要查到「里」跟「鄰」，只憑地址在心裡對是不準的。
            </p>

            <dl className="calc__lines">
              <div className="is-strong">
                <dt>02</dt>
                <dd>學區每年公告，會調整</dd>
              </div>
            </dl>
            <p className="calc__note" style={{ marginTop: 12 }}>
              以買賣當年度教育局公告的版本為準。
              你在網路上找到的整理文章可能是好幾年前的，別拿舊資料下決定。
            </p>

            <dl className="calc__lines">
              <div className="is-strong">
                <dt>03</dt>
                <dd>額滿學校另有設籍期間規定</dd>
              </div>
            </dl>
            <p className="calc__note" style={{ marginTop: 12 }}>
              熱門學校報名人數超過名額時，會按設籍先後順序錄取，各校規定不同。
              買了房子才發現設籍時間來不及，那就白買了——
              <strong style={{ color: "#fff" }}>要買之前就先問學校</strong>。
            </p>

            <p className="calc__note">
              交屋到入學之間的時程怎麼抓、哪些社區實際上跨學區，
              <Link href="/card/booking" style={{ color: "#fff", textDecoration: "underline" }}>
                約個時間
              </Link>
              我用在地經驗直接幫你確認。
            </p>
          </div>
        </div>

        <div className="tool-disclaimer">
          <strong>為什麼這裡不直接做站內查詢？</strong>
          <br />
          因為臺南市的學區開放資料已經下架，沒有可靠的來源可以內建；
          而學區資料一旦過期或抄錯，害的是為了學區買房的家庭。
          與其給你一個看起來方便但可能是舊的答案，不如直接把你帶到官方系統，再教你怎麼看。
        </div>

        <div className="tool-cta">
          <p>
            <strong>要看學區宅？</strong>
            台南各區的學區與生活機能我熟，直接跟我說小孩幾歲、想讀哪一所，我幫你篩物件。
          </p>
          <Link href="/card/booking" className="pv-btn pv-btn--brand">
            線上預約諮詢
          </Link>
        </div>
      </div>
    </section>
  );
}
