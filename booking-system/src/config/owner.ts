/**
 * 👤 這個系統是誰的 —— 從這裡改，只改這一個檔
 *
 * 名片頁、預約表單、通知信、日曆邀請、官網首頁 全都讀這裡。
 *
 * ⚠️ 這個檔會進 Git。手機與 Email 寫在這裡，repo 設公開後就等於公開在網路上
 *    （名片本來就是要給人看的；若日後想避免被爬蟲收割，可改讀環境變數）。
 */

const PHONE = "0972-016-065";
const EMAIL = "aslike8150@gmail.com";
const LINE_ID = "like8150";

export const OWNER = {
  /** 你的名字（正式全名，出現在通知信署名與日曆邀請） */
  name: "詹衒志",
  /** 慣用稱呼（客戶怎麼叫你，出現在文案裡：「衒志會與您聯繫」） */
  alias: "衒志",
  /** 頭銜（品牌店名放 company，這裡不重複，名片上會是「店名」+「頭銜」兩行） */
  title: "房地產顧問",
  /** 手機（顯示用，含分隔線） */
  phone: PHONE,
  /** 手機（純數字，撥號連結用）← 由 phone 去掉非數字自動產生 */
  phoneRaw: PHONE.replace(/\D/g, ""),
  /** 聯絡信箱（客戶回信會到這裡） */
  email: EMAIL,
  /** 公司地址（「公司面談」這個選項會顯示它） */
  address: "台南市安平區",
  /** 公司／品牌名（含店別） */
  company: "台灣房屋成大東豐店",
  /** 大頭照放 public/card/ 底下 */
  photoUrl: "/card/owner.jpg",
  /** 一句話介紹自己 */
  slogan: "不只是媒合物件，我是您不動產資產的守護者。深耕台南安平，專精資產配置、房地產稅務諮詢與簡易裝潢。",
} as const;

/** 社群連結 —— 用不到的留空字串，畫面會自動不顯示 */
export const SOCIAL = {
  line: LINE_ID ? `https://line.me/ti/p/~${LINE_ID}` : "",
  fb: "",
  yt: "",
  ig: "",
} as const;

/** LINE ID 純文字（名片與官網要顯示「LINE ID：xxx」時用） */
export const LINE_ID_TEXT = LINE_ID;

/** LINE 加好友 QR 圖（放 public/card/ 底下）。null = 不顯示 QR 區 */
export const LINE_QR: string | null = null;

/**
 * 網站網址（通知信裡的連結、Open Graph、JSON-LD 用）
 *
 * 優先序：手動設定 > Vercel 正式網域 > 本次部署網址 > 本機。
 * 中間兩個是 Vercel 自動注入的，所以第一次部署不用先知道網址就能正確運作
 * （否則會變成「要填網址才能部署，但要部署完才知道網址」的死結）。
 */
export const SITE_URL =
  process.env.APPOINTMENT_BASE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
