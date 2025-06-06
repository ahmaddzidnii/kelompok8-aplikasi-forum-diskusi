"use client";

import * as React from "react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "@/modules/admin/dashboard/ui/components/nav-main";

import { NavUser } from "@/modules/admin/dashboard/ui/components/nav-user";
import { MdReport } from "react-icons/md";
// import { AiFillDashboard } from "react-icons/ai";
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  const data = {
    user:
      status === "authenticated"
        ? {
            name: session?.user?.name || "Admin",
            email: session?.user?.email || "",
            avatar:
              session?.user?.image ||
              "https://ui-avatars.com/api/?name=Admin&background=random",
          }
        : undefined,
    navMain: [
      // {
      //   title: "Dashboard",
      //   url: "/admin",
      //   icon: AiFillDashboard,
      // },
      {
        title: "Kelola Laporan",
        url: "/admin/reports",
        icon: MdReport,
      },
    ],
  };

  return (
    <Sidebar
      collapsible="none"
      className="h-auto border-r"
      style={{
        zIndex: 20,
      }}
      {...props}
    >
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <span className="text-base font-semibold">
                  Forumdiskusi.{" "}
                  <span className="rounded-md border bg-secondary px-2 py-1 text-[10px]">
                    Admin area
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
