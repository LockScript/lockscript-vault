/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SAqzUqktarh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import PasswordCard from "@/components/password-card";
import PaymentCard from "@/components/payment-card";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { PlusIcon, SearchIcon } from "lucide-react";
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

const addPasswordToVault = async (
  website: string,
  username: string,
  password: string
) => {
  const response = await fetch("/api/vault", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "password",
      data: {
        website: website,
        username: username,
        password: password,
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
  const mutation = useMutation(
    () =>
      addPasswordToVault(
        formData.website,
        formData.username,
        formData.password
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vaultItems");
      },
    }
  );

  const { data: user, isLoading, isError } = useQuery<User>("user", fetchUser);
  const {
    data: vaultItems,
    isLoading: isLoadingVaultItems,
    isError: isErrorVaultItems,
  } = useQuery("vaultItems", fetchVaultItems);

  const handleSave = () => {
    if (
      formData.website.trim() !== "" &&
      formData.username.trim() !== "" &&
      formData.password.trim() !== ""
    ) {
      mutation.mutate();
      setIsModalOpen(false);
      setFormData({ website: "", username: "", password: "" });
    } else {
      alert("All fields are required");
      console.log("[FORMDATA]: " + formData.website.trim(), formData.username.trim(), formData.password.trim())
    }
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Website
                  </Label>
                  <Input
                    id="website"
                    defaultValue="https://lockscript.dev"
                    className="col-span-3"
                    required
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="cvs0"
                    className="col-span-3"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    defaultValue="hopefullysomethingsecure"
                    className="col-span-3"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "credentials" &&
            vaultItems &&
            vaultItems.passwordItems.map((item: PasswordItem) => (
              <PasswordCard item={item} key={`${item.type}-${item.password}`} />
            ))}
          {activeTab === "cards" &&
            vaultItems &&
            vaultItems.cardItems.map((item: CardItem) => (
              <PaymentCard
                item={item}
                key={`${item.type}-${item.cardNumber}`}
              />
            ))}
          {activeTab === "notes" && <></>}
          {activeTab === "pins" && <></>}
        </div>
      </div>
    </div>
  );
}
