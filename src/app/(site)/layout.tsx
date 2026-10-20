import type { ReactNode } from "react";
import SiteShell from "@/components/SiteShell";

export default function GreekLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="el">{children}</SiteShell>;
}
