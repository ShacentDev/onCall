import {
  CalendarClock,
  Network,
  type LucideIcon,
} from "lucide-react";

export type NavItemStatus = "stable" | "new" | "beta";

export interface NavItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status?: NavItemStatus;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "On-Call Schedule",
    description: "Weekly rotation viewer and assignment manager.",
    href: "/oncall",
    icon: CalendarClock,
  },
  {
    title: "Network Monitor",
    description: "Real-time connectivity status for all network switches.",
    href: "/network",
    icon: Network,
    status: "new",
  },
];