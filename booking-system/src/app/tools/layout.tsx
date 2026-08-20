/**
 * /tools 底下所有工具頁的共用外框：導覽列 + 頁尾 + 樣式。
 *
 * 工具頁沒有滿版主視覺，導覽列一開始就要白底，所以 solid 給 true。
 */
import type { ReactNode } from "react";
import { SiteNav } from "../SiteNav";
import { SiteFooter } from "../SiteFooter";
import "../site.css";
import "./tools.css";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pv">
      <SiteNav solid />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
