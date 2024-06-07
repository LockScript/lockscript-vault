/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SAqzUqktarh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateVault } from "@/vault";
import { User } from "@prisma/client";
import { CopyIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const fetchUser = async () => {
  const res = await fetch("/api/user");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

const fetchVaultItems = async () => {
  const res = await fetch("/api/vault");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

const addDummyDataToVault = async () => {
  const response = await fetch("/api/vault", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "password",
      data: {
        website: "example.com",
        username: "dummyuser",
        password: "dummypassword123",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add dummy data");
  }

  return response.json();
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("credentials");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(addDummyDataToVault, {
    onSuccess: () => {
      queryClient.invalidateQueries("vaultItems");
    },
  });

  const { data: user, isLoading, isError } = useQuery<User>("user", fetchUser);
  const {
    data: vaultItems,
    isLoading: isLoadingVaultItems,
    isError: isErrorVaultItems,
  } = useQuery("vaultItems", fetchVaultItems);

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
          <Button onClick={() => mutation.mutate()}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Password
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "credentials" &&
            vaultItems &&
            vaultItems.passwordItems.map((item: PasswordItem) => (
              <Card key={item.password}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">Spotify</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {item.username}
                    </div>
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
            ))}
          {activeTab === "cards" &&
            vaultItems &&
            vaultItems.passwordItems.map((item: CardItem) => (
              <Card key={item.cardNumber}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium pt-4">{item.expiryDate}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {item.cardHolderName}
                    </div>
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
            ))}
          {activeTab === "notes" && <></>}
          {activeTab === "pins" && <></>}
        </div>
      </div>
    </div>
  );
}
