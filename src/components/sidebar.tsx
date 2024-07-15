/**
 * v0 by Vercel.
 * @see https://v0.dev/t/lcKXKTbtpkn
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { AsteriskIcon, ChevronRightIcon, CreditCardIcon, HomeIcon, KeyIcon, LayoutDashboardIcon, LineChartIcon, MenuIcon, NotepadText, Package2Icon, PackageIcon, PinIcon, ShoppingCartIcon, UserIcon, UsersIcon, XIcon } from "lucide-react"

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
    <div className="flex min-h-screen w-full">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Package2Icon className="h-6 w-6" />
            </Link>
          </div>
          <nav className="flex flex-col items-start gap-2 px-4 py-2">
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
              prefetch={false}
              onClick={() => handleTabChange("credentials")}
            >
              <KeyIcon className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
              prefetch={false}
              onClick={() => handleTabChange("cards")}
            >
              <CreditCardIcon className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-primary transition-colors hover:text-primary"
              prefetch={false}
              onClick={() => handleTabChange("pins")}
            >
              <AsteriskIcon className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
              prefetch={false}
              onClick={() => handleTabChange("notes")}
            >
              <NotepadText className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex flex-col lg:hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-background shadow-lg">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <div className="text-lg font-semibold">Menu</div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <XIcon className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <Collapsible className="space-y-1">
                  <CollapsibleTrigger className="flex items-center justify-between gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted [&[data-state=open]>svg]:rotate-90">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-5 w-5" />
                      Home
                    </div>
                    <ChevronRightIcon className="h-5 w-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-8">
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      prefetch={false}
                    >
                      <LayoutDashboardIcon className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      prefetch={false}
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      Orders
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      prefetch={false}
                    >
                      <PackageIcon className="h-5 w-5" />
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-1">
                  <CollapsibleTrigger className="flex items-center justify-between gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted [&[data-state=open]>svg]:rotate-90">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                    <ChevronRightIcon className="h-5 w-5 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-8">
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      prefetch={false}
                    >
                      <UserIcon className="h-5 w-5" />
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  )
}

export default Sidebar;