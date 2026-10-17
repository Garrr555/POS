import type { LucideIcon } from "lucide-react";
import { LayoutGridIcon, ListOrdered, SquareMenu, UserIcon, Warehouse } from "lucide-react";

export type NavItemsType = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const navItems = (role: string): NavItemsType[] => [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
  ...(role === "admin"
    ? [{ name: "Employee", href: "/employees", icon: UserIcon }]
    : []),
  { name: "Menus", href: "/menus", icon: SquareMenu },
  { name: "Orders", href: "/orders", icon: ListOrdered },
  { name: "Stock", href: "/stock", icon: Warehouse },
];
