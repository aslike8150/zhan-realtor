"use client";

/**
 * 首頁的兩個小互動 —— 只有首頁用得到，所以不放進共用元件。
 *
 * Reveal：捲到畫面內才淡入上移。參考站都有這個效果，少了它整頁會很「平」。
 * Nav：一開始透明疊在主視覺上，捲過去之後轉白底。
 *
 * 兩者都做成「JS 沒跑起來也看得到內容」：
 * Reveal 在沒有 IntersectionObserver 時直接顯示，不會留下一片空白。
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** 秒。同一區塊內多個元素依序進場時用 */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 舊瀏覽器沒有這個 API，直接顯示，不要讓內容消失
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect(); // 只進場一次，往回捲不要重播
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pv-reveal ${shown ? "is-in" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

export function Nav({
  children,
  /** 沒有滿版主視覺的頁面（例如工具頁）要一開始就白底，不然白字看不見 */
  alwaysSolid = false,
}: {
  children: ReactNode;
  alwaysSolid?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (alwaysSolid) return;
    // 門檻設 72px：比導覽列本身高一點，捲一下就會變色
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll(); // 重新整理時停在頁面中間也要是對的狀態
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  const solid = alwaysSolid || scrolled;
  return (
    <header className={`pv-nav ${solid ? "is-solid" : ""}`}>
      <div className="pv-wrap pv-nav__inner">{children}</div>
    </header>
  );
}
