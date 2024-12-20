"use client";

import {usePasswordModal} from "@/hooks/use-password-modal";
import {useUser} from "@clerk/nextjs";
import {PasswordItem,Prisma} from "@prisma/client";
import CryptoJS from "crypto-js";
import {Loader,Plus,Search} from "lucide-react";
import {useEffect,useState} from "react";
import {Button} from "../button";
import {Card} from "../card";
import {ScrollArea} from "../scroll-area";
import {Sheet,SheetContent} from "../sheet";
import {DetailsPanel} from "./password/details-panel";

interface PasswordVaultProps {
  user: Prisma.UserGetPayload<{
    include: {
      passwordItems: true;
      cardItems: true;
      pinItems: true;
      noteItems: true;
    };
  }>;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ user }) => {
  const passwordModal = usePasswordModal();
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<
    PasswordItem | null | undefined
  >(undefined);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDetailsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!clerkUser) {
      return;
    }

    const decrypt = (encryptedData: string) => {
      const encryptionPassword = generateEncryptionPassword();
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionPassword);
      return bytes.toString(CryptoJS.enc.Utf8);
    };

    const decryptedItems = user.passwordItems.map((item) => ({
      ...item,
      username: decrypt(item.username),
      password: decrypt(item.password),
      website: decrypt(item.website),
    }));

    setData(decryptedItems);

    if (decryptedItems.length > 0) {
      setSelectedVault(decryptedItems[0]);
    }

    setLoading(false);
  }, [clerkUser, user.passwordItems]);

  const generateEncryptionPassword = () => {
    return `${clerkUser!.id}-${
      clerkUser!.createdAt
    }-${clerkUser!.createdAt?.getTime()}-${clerkUser!.id.charCodeAt(
      clerkUser!.id.length - 1
    )}-${clerkUser!.createdAt?.getDate()}-${clerkUser!.id.charCodeAt(
      0
    )}-${clerkUser!.createdAt?.getUTCFullYear()}-${clerkUser!.id.charCodeAt(
      1
    )}-${clerkUser!.createdAt?.getUTCHours()}-${
      clerkUser!.id.length
    }-${clerkUser!.createdAt?.getUTCMinutes()}`;
  };

  const encrypt = (data: string) => {
    const encryptionPassword = generateEncryptionPassword();
    return CryptoJS.AES.encrypt(data, encryptionPassword).toString();
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="text-black animate-spin" />
        <h1 className="text-black font-semibold">Decrypting your data..</h1>
      </div>
    );
  }

  const toggleDetails = () => setIsDetailsOpen(!isDetailsOpen);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b md:hidden">
        <div className="font-semibold">Password Manager</div>
        <Button variant="ghost" size="icon" onClick={passwordModal.onOpen}>
          <Plus className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-[1rem] h-4 w-4 text-muted-foreground" />
              <input
                className="w-full rounded-md border bg-background px-9 py-3 text-sm"
                placeholder="Search in all vaults..."
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 hidden md:flex"
                onClick={passwordModal.onOpen}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {data.map((item: PasswordItem) => (
                <Card
                  key={item.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedVault?.id === item.id ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedVault(item);
                    if (window.innerWidth < 768) {
                      setIsDetailsOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.website && item.website[0]
                        ? item.website[0].toUpperCase()
                        : "?"}{" "}
                    </div>
                    <div>
                      <div className="font-medium">{item.website}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.username}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}{" "}
            </div>
          </ScrollArea>
        </main>

        <aside
          className={`hidden md:block border-l ${
            data.length > 0 ? "w-2/3" : "w-0"
          }`}
        >
          {data.length > 0 && (
            <DetailsPanel
              selectedVault={selectedVault!}
              onClose={() => setIsDetailsOpen(false)}
              encrypt={encrypt}
              setData={setSelectedVault}
            />
          )}
        </aside>

        {/* Details panel for mobile */}
        {isDetailsOpen && (
          <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <SheetContent side="right" className="w-full p-0 md:hidden">
              <DetailsPanel
                selectedVault={selectedVault!}
                onClose={() => setIsDetailsOpen(false)}
                encrypt={encrypt}
                setData={setSelectedVault}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default PasswordVault;
