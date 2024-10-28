"use client";

import {
  Asterisk,
  Calendar,
  CreditCard,
  Home,
  Inbox,
  Key,
  KeySquare,
  Notebook,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/use-sidebar-tab";
import { UserButton } from "@clerk/nextjs";

// Menu items.
const items = [
  {
    title: "Passwords",
    icon: KeySquare,
  },
  {
    title: "Notes",
    icon: Notebook,
  },
  {
    title: "Cards",
    icon: CreditCard,
  },
  {
    title: "Pins",
    icon: Asterisk,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const sidebar = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-10">
            <UserButton />

            <span className="flex justify-end ml-auto font-semibold">
              LockScript Vault
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => sidebar.setTab(item.title)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
