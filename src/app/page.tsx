/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SAqzUqktarh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decryptVault, updateVault } from "@/vault";
import { User } from "@prisma/client";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const fetchUser = async () => {
  const res = await fetch("/api/user");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("credentials");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const mutation = useMutation(updateVault);

  const { data: user, isLoading, isError } = useQuery<User>("user", fetchUser);

  const [vault, setVault] = useState<VaultItem[]>([]);


  useEffect(() => {
    setVault(
      JSON.parse(
        JSON.stringify(decryptVault(user?.vault ?? "", user?.vaultKey ?? ""))
      )
    );
  }, [user]);

  const addVaultItem = (item: VaultItem) => {
    setVault(JSON.parse(JSON.stringify([...vault, item])));
    mutation.mutate(vault);
  };

  if (vault) console.log(JSON.parse(JSON.stringify(vault)));

  return (
    <div className="grid grid-cols-[240px_1fr] h-screen">
      <Sidebar
        isMobileNavOpen={isMobileNavOpen}
        toggleMobileNav={toggleMobileNav}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <Button
            onClick={() =>
              addVaultItem({
                type: "password",
                website: "www.newsite.com",
                username: "newUser",
                password: "newPassword123",
              })
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Password
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      </div>
    </div>
  );
}