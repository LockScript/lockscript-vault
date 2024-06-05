/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SAqzUqktarh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SVGProps, useState } from "react"
import { CopyIcon, CreditCardIcon, KeyIcon, MenuIcon, PinIcon, PlusIcon, SearchIcon, StickyNoteIcon } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("credentials")
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }
  return (
    <div className="grid grid-cols-[240px_1fr] h-screen">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 space-y-6 relative">
        <div className="flex items-center justify-between">
          <UserButton />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 via-purple-400 to-purple-600 text-transparent bg-clip-text">LockScript</h1>
          <div className="block md:hidden">
            <Button variant="ghost" size="icon" className="absolute top-6 right-6" onClick={toggleMobileNav}>
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
      <div className="p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2">
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Password
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "credentials" && (
            <>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">GitHub</div>
                    <div className="text-gray-500 dark:text-gray-400">jdoe@example.com</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">Amazon</div>
                    <div className="text-gray-500 dark:text-gray-400">jdoe@example.com</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">Twitter</div>
                    <div className="text-gray-500 dark:text-gray-400">jdoe@example.com</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">Facebook</div>
                    <div className="text-gray-500 dark:text-gray-400">jdoe@example.com</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">Instagram</div>
                    <div className="text-gray-500 dark:text-gray-400">jdoe@example.com</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">Spotify</div>
                    <div className="text-gray-500 dark:text-gray-400">jdoe@example.com</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
          {activeTab === "cards" && <></>}
          {activeTab === "notes" && <></>}
          {activeTab === "pins" && <></>}
        </div>
      </div>
    </div>
  )
}