/**
 * next-auth 的 HTTP 端點（登入、登出、OAuth callback、session 查詢）。
 *
 * 2026-08-12 補上：原範本有 src/auth.ts（定義好 Google provider 與白名單）
 * 並匯出 handlers，但沒有任何檔案去接它 —— 少了這個 route，
 * /api/auth/signin 與 /api/auth/callback/google 全部 404，
 * 後台永遠登不進去（不管 AUTH_* 環境變數設得多正確）。
 *
 * Google Cloud Console 的「已授權的重新導向 URI」要填：
 *   https://<你的網域>/api/auth/callback/google
 * 那個路徑就是由這個檔案提供的。
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
