# 換電腦 / 重建開發環境

> 只是要「用」網站（看預約、給客戶網址）**完全不需要看這份文件**——
> 開瀏覽器登入就好，見文末「日常使用」。
>
> 這份是給「要修改網站程式」時用的。

---

## 這套系統跑在哪裡

| 東西 | 放在哪 | 綁哪個帳號 |
|---|---|---|
| 網站主機 | Vercel | GitHub 登入 |
| 資料庫 | TiDB Cloud | GitHub 登入 |
| 程式碼 | GitHub `aslike8150/zhan-realtor` | GitHub |
| 後台登入 | Google OAuth | aslike8150@gmail.com |

**全部在雲端，不依賴任何一台電腦。** 電腦壞掉、換新的，網站照常運作。

---

## 新電腦要裝什麼

### 1. Homebrew（macOS 套件管理器）

到 [brew.sh](https://brew.sh) 照首頁指令安裝。

### 2. Node.js

```bash
brew install node
```

需要 Node 20 以上。

### 3. GitHub Desktop（不想用終端機的話）

```bash
brew install --cask github
```

裝好後登入 GitHub 帳號，選 **Clone a repository** → 找 `zhan-realtor`。

### 4. 本機資料庫（選配）

只有想在本機測試預約功能才需要。純改文案、改版面不用裝。

```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE IF NOT EXISTS card_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 建立設定檔

專案拉下來之後，`booking-system/` 底下要自己建兩個檔（它們刻意不進版控，因為含密鑰）。

### `booking-system/.env`

只放這一個，因為 Prisma CLI 只讀 `.env`，Next.js 兩個都讀。

```env
# 本機測試用（要裝 MySQL）。不裝的話填 TiDB 的連線字串，
# 但注意那會直接動到正式資料，測試請小心。
DATABASE_URL="mysql://root@localhost:3306/card_booking"
```

### `booking-system/.env.local`

```env
APPOINTMENT_BASE_URL="http://localhost:3000"
APPOINTMENT_ADMIN_EMAIL="aslike8150@gmail.com"
ADMIN_EMAILS="aslike8150@gmail.com"

# 下面兩個是隨機密鑰，本機用的不必跟線上相同，重新產生即可：
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
APPOINTMENT_TOKEN_SECRET=""
AUTH_SECRET=""

# 後台 Google 登入（本機要測後台才需要，值在 Google Cloud Console）
# ⚠️ 本機登入還需要去 Google Console 多加一組重新導向 URI：
#      http://localhost:3000/api/auth/callback/google
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

其餘選配（寄信、防機器人、行事曆、分析）留空即可，功能會自動關閉，不影響開發。
完整清單見 `booking-system/.env.example`。

> ⚠️ **不要把 `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` 隨便填。**
> 一旦填了，系統會認為行事曆整合已啟用；若沒有完成綁定（沒有 refresh token），
> 前台會判定「無法確認行事曆」而**關閉所有可預約時段**。

---

## 啟動

```bash
cd booking-system
npm install
npm run dev
```

打開 http://localhost:3000

| 路徑 | 內容 |
|---|---|
| `/` | 形象官網 |
| `/card` | 電子名片 |
| `/card/booking` | 線上預約 |
| `/admin/appointments` | 後台（需 Google 登入） |

---

## 改完怎麼上線

1. GitHub Desktop 左下角填一行說明 → **Commit to main**
2. 上方 **Push origin**
3. Vercel 偵測到 GitHub 有新版本，**自動重新部署**（2～3 分鐘）

**只改環境變數、沒改程式碼**的話 Vercel 不會被觸發，要去 Vercel 的
Deployments 頁手動 **Redeploy**。

---

## 常改的地方

| 想改什麼 | 改哪個檔 |
|---|---|
| 姓名、電話、店名、照片、slogan | `src/config/owner.ts` |
| 官網文案、區塊 | `src/app/page.tsx` |
| 官網樣式 | `src/app/home.css` |
| 名片頁 | `src/app/card/page.tsx` |
| 品牌配色 | `src/app/card/_cis.ts` |
| 營業時間、時段長度、可預約天數 | `src/lib/appointment-constants.ts` 的 `BOOKING_RULES` |
| 預約表單的選項與問題 | `src/lib/appointment-constants.ts` / `src/app/card/booking/BookingForm.tsx` |
| 大頭照 | 換掉 `public/card/owner.jpg` |

---

## 日常使用（不用裝任何東西）

| 用途 | 網址 |
|---|---|
| 給客戶的網站 | https://zhan-realtor.vercel.app |
| 看預約 | https://zhan-realtor.vercel.app/admin/appointments |
| 主機管理 | https://vercel.com |
| 資料庫 | https://tidbcloud.com |
| 程式碼 | https://github.com/aslike8150/zhan-realtor |

手機瀏覽器也能用。

---

## 尚未完成的項目

- **防機器人（Turnstile）**：未設定。網址公開流傳前建議補上，否則可能收到大量假預約。
- **確認信（Resend）**：未設定。目前客戶預約成功不會收到信，你也不會收到通知，需自行查看後台。
  要讓客戶收得到信，需先有自己的網域並在 Resend 完成驗證。
- **Google 行事曆整合**：未綁定。預約不會自動寫進日曆。
