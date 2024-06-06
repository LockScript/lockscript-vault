/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SAqzUqktarh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";
import axios from "axios";
import {
  CopyIcon,
  CreditCardIcon,
  KeyIcon,
  MenuIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  StickyNoteIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import CryptoJS from 'crypto-js';

const fetchUser = async () => {
  const res = await fetch("/api/user");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

interface PasswordItem {
  type: "password";
  website: string;
  username: string;
  password: string;
}

interface CardItem {
  type: "card";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

interface PinItem {
  type: "pin";
  pin: string;
}

interface NoteItem {
  type: "note";
  note: string;
}

type VaultItem = PasswordItem | CardItem | PinItem | NoteItem;

const updateVault = async (vault: VaultItem[]) => {
  const response = await axios.post("/api/vault/update", { vault });
  if (response.status !== 200) {
    throw new Error("Failed to update vault");
  }
  return response.data;
};

const decryptVault = (encryptedVault: string, vaultKey: string) => {
  const decryptedData = CryptoJS.AES.decrypt(encryptedVault, vaultKey).toString(CryptoJS.enc.Utf8);

  console.log(decryptedData);

  try {
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decrypted data is not valid JSON:', decryptedData);
    return null;
  }
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

  const { data: user, isLoading, isError } = useQuery<User>("user", fetchUser);''

  console.log("[ENCRYPTED VAULT: ", user?.vault)

  const [vault, setVault] = useState(decryptVault(user?.vault ?? "", user?.vaultKey ?? ""));

  const addVaultItem = (item: VaultItem) => {
    setVault([...vault, item]);
    mutation.mutate(vault);
  };

  useEffect(() => {
    if (vault) {
      vault.forEach(
        (item: {
          type: any;
          website: any;
          username: any;
          cardNumber: any;
          expiryDate: any;
          pin: any;
          note: any;
        }) => {
          switch (item.type) {
            case "password":
              console.log(`Password item: ${item.website}, ${item.username}`);
              break;
            case "card":
              console.log(`Card item: ${item.cardNumber}, ${item.expiryDate}`);
              break;
            case "pin":
              console.log(`Pin item: ${item.pin}`);
              break;
            case "note":
              console.log(`Note item: ${item.note}`);
              break;
            default:
              console.log("Unknown item type");
          }
        }
      );
    }
  }, [vault]);

  return (
    <div className="grid grid-cols-[240px_1fr] h-screen">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "credentials" &&
            vault.map((item: PasswordItem, index: number) => {
              if (item.type === "password") {
                return (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <div className="font-medium pt-4">{item.website}</div>
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
                );
              }
            })}
        </div>
      </div>
    </div>
  );
}
