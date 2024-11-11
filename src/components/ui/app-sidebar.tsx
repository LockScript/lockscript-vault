"use client";

import {
  Asterisk,
  CreditCard,
  KeySquare,
  Notebook,
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
import { UserButton, useUser } from "@clerk/nextjs";
import { Icons } from "./icons";
import { Separator } from "./separator";

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
  const { user } = useUser();

  return (
    <Sidebar className="flex flex-col justify-between min-h-screen bg-gray-800 text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-10 flex items-center justify-between p-4">
            <UserButton />
            <span>{user?.username}</span>
            <div className="flex items-center space-x-3">
              <Separator orientation="vertical" className="bg-gray-600 h-8" />
              <Icons.logo className="h-6 w-6 text-primary" />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => sidebar.setTab(item.title)}
                    className={`${
                      sidebar.tab === item.title
                        ? "bg-primary/20 text-primary"
                        : "text-gray-400"
                    } hover:bg-primary/10 rounded-lg p-2 flex items-center space-x-3`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
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
