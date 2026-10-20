import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAdminCounts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Διαχείριση",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const counts = await getAdminCounts();

  return (
    <div className="min-h-screen bg-cream-100 lg:flex">
      <AdminSidebar counts={counts} />
      <div className="min-w-0 flex-1">
        <div className="flex justify-end px-5 pt-4 lg:hidden">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 text-sm text-ink-500">
              <LogOut className="size-4" /> Αποσύνδεση
            </button>
          </form>
        </div>
        <div className="mx-auto max-w-6xl p-5 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
