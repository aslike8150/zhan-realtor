/**
 * 前台亮色 CIS（/card 名片頁 / 預約表單 / 成功頁，給客戶看）
 * 2026-08-12：改套詹衒志品牌 CIS —— 橘 #FF7403 系，與主網站 realtor-website 同一套色。
 *
 * 對應主網站的 CSS 變數：
 *   --twh-primary #FF7403 / --twh-primary-dark #C35B07 / --twh-primary-light #FFF0E5
 *   --twh-accent-red #E84A1B / --twh-text #3B261B / --twh-text-muted #746158
 *   --twh-border #F0D2BF
 *
 * ⚠️ 變數名沿用原本的 sky / orange（改名要動十幾個檔），語意已改成品牌主色。
 */
export const RCIS = {
  sky: "#FF7403", // 品牌主色（封面漸層起點）
  skyDeep: "#C35B07", // 主色深（封面漸層終點）
  skySoft: "#FFF0E5", // 淺色底
  orange: "#FF7403", // CTA / 強調
  orangeDeep: "#C35B07",
  orangeSoft: "#FFF0E5",
  ink: "#3B261B", // 深字（主文字）
  inkSoft: "#5A4438", // 次深字
  muted: "#746158", // 弱字
  bg: "#FFFFFF",
  bgSoft: "#FFF9F5",
  border: "#F0D2BF",
  line: "#F7E5D8",
  green: "#06C755", // LINE 綠 / 成功
  font: "'Noto Sans TC','PingFang TC','Microsoft JhengHei',-apple-system,BlinkMacSystemFont,sans-serif",
  radius: 16,
  radiusSm: 10,
  shadow: "0 4px 20px rgba(59,38,27,0.08)",
  shadowLg: "0 12px 44px rgba(59,38,27,0.14)",
} as const;

// 業績溫度色（後台 + 通知共用判讀）
export const HEAT_TONE: Record<string, { label: string; emoji: string; color: string }> = {
  high: { label: "高溫", emoji: "🔥", color: "#E84A1B" },
  mid: { label: "中溫", emoji: "🟡", color: "#FF7403" },
  low: { label: "低溫", emoji: "⚪", color: "#746158" },
};
