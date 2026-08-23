## ⚠️ 這個專案不要單獨開對話，去 `D:\Agent-OS` 開

小詹所有的長期記憶、公告欄、待辦、指令都在 **`D:\Agent-OS`**，不在這裡。
在這個資料夾開對話視窗，你會看不到那些東西，然後憑空回答。

**正確做法：關掉，改到 `D:\Agent-OS` 開。** 官網的原始碼從那裡一樣改得到。

---

## 如果你已經在這裡了，動手之前先讀這三個

1. `D:\Agent-OS\.claude\memory\MEMORY.md` —— 長期記憶索引（只有索引，內容要自己開檔）
2. `D:\Agent-OS\.claude\memory\SYNC_BOARD.md` —— 別的視窗做了什麼
3. `D:\Agent-OS\.claude\memory\TODO_BOARD.md` —— 未完成的事

⚠️ **要存記憶、貼公告、記待辦，一律寫到 `D:\Agent-OS\.claude\memory\`**，
**不要寫到這個專案底下**。這裡的 `.claude/memory/` 被 `.gitignore` 排除掉了，
寫在這裡等於寫進一個沒有人會讀的第二個記憶庫。

規矩本身（什麼時候該讀、什麼時候該貼公告）在 `D:\Agent-OS\CLAUDE.md`。

---

## 這個專案是什麼

`zhan-realtor` = 小詹的個人官網 **https://zhanhouse.com**（Next.js，部署在 Vercel）。
原始碼在 `booking-system/`。包含預約系統、名片頁 `/card`、客戶自助試算 `/tools`。

⚠️ `booking-system/src/lib/calc/calc-core.js` 是**從 `D:\估價建議書` 複製過來的副本**，
不要直接改。要改稅率或貸款公式，改那邊的正本再跑 `node tools/同步算法.mjs`。
