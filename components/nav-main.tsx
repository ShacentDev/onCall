"use client";

import {
  Users,
  Building2,
  Frame,
  PieChart,
  CalendarRange,
  CircleDollarSign,
  Wallet,
  Tags,
  Image,
  CalendarClock,
  ShoppingBag,
  Salad,
  Package,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "@/lib/client-session";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const icons = {
  Users,
  Building2,
  Frame,
  PieChart,
  CalendarRange,
  CircleDollarSign,
  Wallet,
  Tags,
  Image,
  CalendarClock,
  ShoppingBag,
  Salad,
  Package,
  NotebookPen,
};

interface MenuItem {
  url: string;
  name: string;
  icon: keyof typeof icons;
}

const sidebarData: Record<string, MenuItem[]> = {
  admin: [
    { name: "Dashboard", url: "/dashboard", icon: "PieChart" },
    {
      name: "Manajemen OnCall",
      url: "/dashboard/on-call",
      icon: "NotebookPen",
    },
  ],
};

export function NavMain() {
  const { user, isLoading } = useSession();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const menuItems = sidebarData[user?.role || "user"] || sidebarData.user;

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="h-6 w-32 p-2 mb-2" />
        <Separator />
        <div className="flex flex-col gap-2 mt-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  let filteredMenuItems = menuItems;
  if (user?.role === "user") {
    filteredMenuItems = menuItems.filter(
      (item) => item.name !== "Managemen PMB",
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="uppercase p-2 font-semibold">menu {user?.role}</h2>
      <Separator />
      <div className="flex flex-col gap-2">
        {filteredMenuItems.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons];
          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={() => {
                if (isMobile) setOpenMobile(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 hover:border-b-2 hover:border-main/80",
                pathname === item.url && "border-b-2 font-medium border-main",
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
