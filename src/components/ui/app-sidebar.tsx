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
import { Icons } from "./icons";
import {Separator} from "./separator";

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
            <Separator orientation="vertical" className="ml-3 bg-primary/10" />
            <div className="flex justify-end ml-3 items-center">
              <span className="font-bold text-lg text-gray-900 mr-2">LockScript Vault</span>

              <Icons.logo className="h-5 w-5" />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => sidebar.setTab(item.title)}
                    className={`${
                      sidebar.tab === item.title ? "bg-primary/10" : ""
                    } hover:bg-primary/10`}
                  >
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
