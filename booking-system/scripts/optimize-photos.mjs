/**
 * 首頁照片處理 —— 產生 public/home/ 底下的 webp
 *
 * 只讀原檔，不改也不刪。改了選片或裁切參數就重跑：
 *   node scripts/optimize-photos.mjs
 *
 * 素材分三類：
 *   1. 門市照（DSCF*，相機拍的專業照）—— 頁面主力，質感最好
 *   2. 暮色城市（沐光物件照，iPhone）—— 只留兩張，小詹說大樓照太多
 *   3. 人物去背 PNG + 兩顆 LOGO —— 要保留透明背景，輸出帶 alpha 的 webp
 *
 * 曾經試過崙子頂空拍，整批否決：農田＋鐵皮屋＋正午霧霾，不都市。
 * 沐光資料夾裡 S__ 開頭的是 LINE 傳的，只有 1188x890，不夠大；室內照廣角變形也不用。
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DESKTOP = "C:/Users/a01/Desktop";
const MUGUANG = "D:/微微/物件區/988-沐光高樓海景3房平車/物件照片";
const STORE = `${DESKTOP}/大頭照LOGO/台灣房屋照片`;
const ARCH = `${DESKTOP}/大頭照LOGO/高清建築照`;
const LOGO = `${DESKTOP}/大頭照LOGO`;
const OUT = path.join(process.cwd(), "public", "home");

/** 暮色高樓群＋遠方水域，左上角有一彎月亮。left 380 切掉窗框暗邊 */
/**
 * 主視覺：安平空拍（2026-08-20 小詹指定）
 *
 * 鹽水溪出海口、防波堤、紅樹林、安平高樓群都在畫面裡——這是真的台南，
 * 比先前用的沐光暮色照更有代表性。
 *
 * 原圖 2048x1152（16:9），不裁切也不放大，交給 CSS 的 object-fit: cover 去適應螢幕。
 * 正午拍的天空亮，白色標語壓不住，所以亮度壓到 0.88，其餘靠 CSS 深色漸層。
 */
const HERO = {
  src: `${ARCH}/安平空拍.png`,
  widths: [2048, 1200],
  grade: { saturation: 0.92, brightness: 0.88 },
};

/**
 * 區塊配圖：一律 4:3、寬 1200。
 * 只有「資產配置」還留大樓照（扣置產與區域），其餘全部改門市照。
 */
const BLOCKS = [
  {
    out: "asset",
    src: `${ARCH}/1047186_0.jpg`,
    note: "夜間路口車流俯瞰。城市脈動＝資產在動，扣資產配置",
  },
  {
    out: "tax",
    src: `${ARCH}/1047183_0.jpg`,
    // 原圖偏藍綠，直接放進暖白低彩度的版面會很跳，飽和度要壓重一點
    grade: { saturation: 0.5, brightness: 1.02 },
    note: "玻璃屋頂結構仰角。幾何線條＝結構感、精算感，扣稅務",
  },
  { out: "reno", src: `${STORE}/DSCF2574.jpg`, note: "門市入口植栽牆" },
];

/** 門市區塊的橫幅大圖 */
const STORE_WIDE = {
  out: "store",
  src: `${STORE}/DSCF2573.jpg`,
  width: 1800,
  height: 1013, // 16:9
};

/** 要保留透明背景的：人物去背 + 兩顆 LOGO */
const CUTOUTS = [
  {
    out: "person",
    src: `${LOGO}/新大頭照/成品/IMG_0752-1.png`,
    height: 1500,
    // 小詹 2026-08-16 選的：站姿比坐姿緊實。
    // 坐姿那張（IMG_0763）腿伸出去佔滿寬度，放進直式面板反而讓人顯小。
    note: "棚拍站姿去背，馬甲手插口袋，放在「關於我」的白色面板裡",
  },
  {
    out: "logo-leju",
    src: `${LOGO}/樂居府都logo/圓-04.png`,
    width: 320,
    note: "樂居府都圓形手繪章，個人品牌主識別",
  },
  {
    out: "logo-twh",
    src: `${LOGO}/樂居府都logo/DF-logo.1png.png`,
    width: 520,
    note: "台灣房屋成大東豐店，所屬品牌背書",
  },
];

/** 舊產物先清掉，免得留下已經不用的圖 */
async function clean() {
  let existing = [];
  try {
    existing = await readdir(OUT);
  } catch {
    return;
  }
  for (const f of existing.filter((f) => f.endsWith(".webp"))) {
    await rm(path.join(OUT, f));
  }
}

async function build() {
  await mkdir(OUT, { recursive: true });
  await clean();
  const made = [];
  const push = (name, info) => made.push([name, info.width, info.height, info.size]);

  // 主視覺
  for (const w of HERO.widths) {
    const name = w === HERO.widths[0] ? "hero.webp" : "hero-sm.webp";
    push(
      name,
      await sharp(HERO.src)
        .resize(w)
        .modulate(HERO.grade)
        .webp({ quality: 78 })
        .toFile(path.join(OUT, name)),
    );
  }

  // 區塊配圖
  for (const b of BLOCKS) {
    const name = `${b.out}.webp`;
    push(
      name,
      await sharp(b.src)
        .resize(1200, 900, { fit: "cover", position: "centre" })
        .modulate(b.grade ?? { saturation: 0.88, brightness: 0.98 })
        .webp({ quality: 80 })
        .toFile(path.join(OUT, name)),
    );
  }

  // 門市橫幅
  push(
    "store.webp",
    await sharp(STORE_WIDE.src)
      .resize(STORE_WIDE.width, STORE_WIDE.height, { fit: "cover", position: "centre" })
      .modulate({ saturation: 0.9, brightness: 0.99 })
      .webp({ quality: 80 })
      .toFile(path.join(OUT, "store.webp")),
  );

  // 透明去背：trim 掉四周空白，不然縮完人物會很小
  for (const c of CUTOUTS) {
    const name = `${c.out}.webp`;
    push(
      name,
      await sharp(c.src)
        .trim()
        .resize(c.width ?? null, c.height ?? null, { fit: "inside" })
        .webp({ quality: 84, alphaQuality: 92 })
        .toFile(path.join(OUT, name)),
    );
  }

  console.log(`輸出到 ${OUT}\n`);
  let total = 0;
  for (const [name, w, h, size] of made) {
    total += size;
    const kb = (size / 1024).toFixed(0);
    const warn = size > 300 * 1024 ? "  ⚠️ 超過 300KB" : "";
    console.log(
      `  ${name.padEnd(16)} ${String(w).padStart(4)}x${String(h).padEnd(4)} ${kb.padStart(4)} KB${warn}`,
    );
  }
  console.log(`\n合計 ${(total / 1024 / 1024).toFixed(2)} MB`);
}

build().catch((err) => {
  console.error("處理失敗：", err.message);
  process.exit(1);
});
