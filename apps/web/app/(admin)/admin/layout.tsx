import { auth } from "@/auth";
import { config } from "@/config";
import { TriangleAlertIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/modules/admin/dashboard/ui/components/app-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await auth();

  if (!session) {
    redirect(config.loginRoute);
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <TriangleAlertIcon className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Akses ditolak</h1>
        <p className="text-lg">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-x-auto overflow-y-hidden">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 12 + 1px)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset className="hide-scrollbar flex-1 overflow-auto">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
