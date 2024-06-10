/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SAqzUqktarh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import CreateCardModal from "@/components/create-card-modal";
import CreatePasswordModal from "@/components/create-password-modal";
import PasswordCard from "@/components/password-card";
import PaymentCard from "@/components/payment-card";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { SearchIcon } from "lucide-react";
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
    throw new Error("Failed to add password to vault.");
  }

  return response.json();
};

const addCardToVault = async (
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  cardHolderName: string
) => {
  const response = await fetch("/api/vault", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "card",
      data: {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        cardHolderName: cardHolderName,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add card to vault.");
  }

  return response.json();
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("credentials");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  const [cardFormData, setCardFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const queryClient = useQueryClient();
  const savePasswordMutation = useMutation(
    () =>
      addPasswordToVault(
        passwordFormData.website,
        passwordFormData.username,
        passwordFormData.password
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vaultItems");
      },
    }
  );

  const saveCardMutation = useMutation(
    () =>
      addCardToVault(
        cardFormData.cardNumber,
        cardFormData.expiryDate,
        cardFormData.cvv,
        cardFormData.cardHolderName
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

  const handlePasswordSave = () => {
    if (
      passwordFormData.website.trim() !== "" &&
      passwordFormData.username.trim() !== "" &&
      passwordFormData.password.trim() !== ""
    ) {
      savePasswordMutation.mutate();
      setPasswordFormData({ website: "", username: "", password: "" });
    } else {
      toast({
        title: "Empty Fields!",
        description: `All fields are required. Please fill in all fields.`,
      });
    }
  };

  const handleCardSave = () => {
    if (
      cardFormData.cardNumber.trim() !== "" &&
      cardFormData.expiryDate.trim() !== "" &&
      cardFormData.cvv.trim() !== "" &&
      cardFormData.cardHolderName.trim() !== ""
    ) {
      saveCardMutation.mutate();
      setCardFormData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolderName: "",
      });
    } else {
      toast({
        title: "Empty Fields!",
        description: `All fields are required. Please fill in all fields.`,
      });
    }
  };

  const filteredPasswordItems = searchTerm
    ? vaultItems?.passwordItems.filter((item: PasswordItem) =>
        item.website.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : vaultItems?.passwordItems;

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
              placeholder={`Search ${
                activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
              }`}
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

          {activeTab === "credentials" && (
            <CreatePasswordModal
              formData={passwordFormData}
              setFormData={setPasswordFormData}
              handleSave={handlePasswordSave}
              activeTab={activeTab}
            />
          )}
          {activeTab === "cards" && (
            <CreateCardModal
              formData={cardFormData}
              setFormData={setCardFormData}
              handleSave={handleCardSave}
              activeTab={activeTab}
            />
          )}
        </div>
        <div>
          {activeTab === "credentials" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPasswordItems &&
                filteredPasswordItems.map((item: PasswordItem) => (
                  <PasswordCard item={item} key={item.id} />
                ))}
            </div>
          )}

          {activeTab === "cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vaultItems &&
                vaultItems.cardItems.map((item: CardItem) => (
                  <PaymentCard item={item} key={item.id} />
                ))}
            </div>
          )}
        </div>
        {activeTab === "notes" && <></>}
        {activeTab === "pins" && <></>}
      </div>
    </div>
  );
}
