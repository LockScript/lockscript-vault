import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { CreditCard, Key, Pin, Settings, StickyNote, X } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
}) => (
  <div className="flex h-full flex-col bg-gray-50/50 p-4">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <UserButton />
        <span className="text-lg font-semibold text-gray-900">
          LockScript Vault
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
    <nav className="space-y-2">
      {[
        { name: "Passwords", icon: Key },
        { name: "Notes", icon: StickyNote },
        { name: "Pins", icon: Pin },
        { name: "Cards", icon: CreditCard },
      ].map(({ name, icon: Icon }) => (
        <Button
          key={name}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700",
            activeTab === name.toLowerCase() && "bg-rose-50 text-rose-700"
          )}
          onClick={() => {
            setActiveTab(name.toLowerCase());
            setIsSidebarOpen(false);
          }}
        >
          <Icon className="h-5 w-5" />
          {name}
        </Button>
      ))}
    </nav>
    <div className="mt-auto pt-6">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all hover:bg-rose-100 hover:text-rose-700",
          activeTab === "settings" && "bg-rose-50 text-rose-700"
        )}
        onClick={() => {
          setActiveTab("settings");
          setIsSidebarOpen(false);
        }}
      >
        <Settings className="h-5 w-5" />
        Settings
      </Button>
    </div>
  </div>
);
