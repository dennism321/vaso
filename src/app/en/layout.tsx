import type { ReactNode } from "react";
import SiteShell from "@/components/SiteShell";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='en'" }} />
      <SiteShell locale="en">{children}</SiteShell>
    </>
  );
}
