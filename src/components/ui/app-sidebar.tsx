"use client";

import {
  Asterisk,
  CreditCard,
  KeySquare,
  LayoutGrid,
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
import { Button } from "./button";
import { Popover, PopoverTrigger } from "./popover";
import { PopoverContent } from "@radix-ui/react-popover";
import {Label} from "./label";
import {Input} from "./input";

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
          <SidebarGroupLabel className="mb-10 flex items-center justify-between p-4 mt-4">
            <div className="flex items-center space-x-5">
              <UserButton />
              <span className="text-muted-foreground text-xl">
                {user?.username}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Separator orientation="vertical" className="bg-gray-600 h-8" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <LayoutGrid className="h-6 w-6" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 z-[100] p-5 rounded-md shadow-xl bg-white">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Apps</h4>
                      <p className="text-sm text-muted-foreground">
                        Explore our other applications!
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <a href="https://www.lockscript.dev" className="text-primary font-bold hover:underline">LockScript</a>
                        <a href="https://www.lockscript.dev" className="text-primary font-bold hover:underline">Spectra</a>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
