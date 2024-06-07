import { UserButton } from "@clerk/nextjs";
import {
  MenuIcon,
  KeyIcon,
  CreditCardIcon,
  StickyNoteIcon,
  PinIcon,
} from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = ({
  isMobileNavOpen,
  toggleMobileNav,
  activeTab,
  handleTabChange,
}: {
  isMobileNavOpen: any;
  toggleMobileNav: any;
  activeTab: any;
  handleTabChange: any;
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-8s00 p-6 space-y-6 relative">
      <div className="flex items-center justify-between">
        <UserButton />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 via-purple-400 to-purple-600 text-transparent bg-clip-text">
          LockScript
        </h1>
        <div className="block md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6"
            onClick={toggleMobileNav}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle mobile navigation</span>
          </Button>
          {isMobileNavOpen && (
            <div className="absolute top-16 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-6 space-y-2">
              <Button
                variant={activeTab === "credentials" ? "link" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("credentials")}
              >
                <KeyIcon className="mr-2 h-4 w-4" />
                Credentials
              </Button>
              <Button
                variant={activeTab === "cards" ? "link" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("cards")}
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Cards
              </Button>
              <Button
                variant={activeTab === "notes" ? "link" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("notes")}
              >
                <StickyNoteIcon className="mr-2 h-4 w-4" />
                Secure Notes
              </Button>
              <Button
                variant={activeTab === "pins" ? "link" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("pins")}
              >
                <PinIcon className="mr-2 h-4 w-4" />
                Pins
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="space-y-2 hidden md:block">
        <Button
          variant={activeTab === "credentials" ? "link" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabChange("credentials")}
        >
          <KeyIcon className="mr-2 h-4 w-4" />
          Credentials
        </Button>
        <Button
          variant={activeTab === "cards" ? "link" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabChange("cards")}
        >
          <CreditCardIcon className="mr-2 h-4 w-4" />
          Cards
        </Button>
        <Button
          variant={activeTab === "notes" ? "link" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabChange("notes")}
        >
          <StickyNoteIcon className="mr-2 h-4 w-4" />
          Secure Notes
        </Button>
        <Button
          variant={activeTab === "pins" ? "link" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleTabChange("pins")}
        >
          <PinIcon className="mr-2 h-4 w-4" />
          Pins
        </Button>
      </nav>
    </div>
  );
};

export default Sidebar;
