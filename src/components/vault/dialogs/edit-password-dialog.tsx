import { updatePasswordItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import prismadb from "@/lib/prismadb";
import { encrypt } from "@/utils/encryption";
import { useUser } from "@clerk/nextjs";
import { Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

interface PasswordEntry {
  id: string;
  name: string;
  username: string;
  website: string;
  password: string;
}

interface EditPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entry: PasswordEntry | null;
}

export function EditPasswordDialog({
  isOpen,
  onClose,
  entry,
}: EditPasswordDialogProps) {
  const [editedEntry, setEditedEntry] = useState<PasswordEntry>({
    id: "",
    name: "",
    username: "",
    website: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const passwordSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be at most 50 characters"),
    username: z
      .string()
      .min(1, "Username is required")
      .max(30, "Username must be at most 30 characters"),
    website: z
      .string()
      .url("Invalid website URL")
      .max(50, "Website URL is too long"),
    password: z
      .string()
      .min(2, "Password must be at least 2 characters long")
      .max(128, "Password must be at most 128 characters"),
  });

  useEffect(() => {
    if (entry) {
      setEditedEntry(entry);
    }
  }, [entry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    const validationResult = passwordSchema.safeParse({
      name: editedEntry.name,
      username: editedEntry.username,
      website: editedEntry.website,
      password: editedEntry.password,
    });

    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.errors[0]?.message || "Validation failed";
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    if (!user) {
      toast.error("User not found");
      setLoading(false);
      return;
    }

    if (!entry) {
      toast.error("Entry not found");
      setLoading(false);
      return;
    }

    try {
      const encryptedUsername = await encrypt(editedEntry.username, user.id);
      const encryptedWebsite = await encrypt(editedEntry.website, user.id);
      const encryptedPassword = await encrypt(editedEntry.password, user.id);

      await updatePasswordItem(
        entry.id,
        encryptedUsername.encryptedData,
        encryptedWebsite.encryptedData,
        encryptedPassword.encryptedData,
        encryptedUsername.iv, 
        encryptedWebsite.iv,
        encryptedPassword.iv
      );

      router.refresh();
      toast.success("Password updated");

      onClose();
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-100 p-2">
              <Globe className="h-5 w-5 text-rose-500" />
            </div>
            <DialogTitle>
              {entry ? "Edit Password Entry" : "Add New Password Entry"}
            </DialogTitle>
          </div>
          <DialogDescription>
            Make changes to your password entry here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Name"
              value={editedEntry.name}
              onChange={handleInputChange}
              maxLength={50}
              name="name"
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {editedEntry.name.length}/50
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Username"
              value={editedEntry.username}
              onChange={handleInputChange}
              maxLength={30}
              name="username"
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {editedEntry.username.length}/30
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Website"
              value={editedEntry.website}
              onChange={handleInputChange}
              maxLength={50}
              name="website"
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {editedEntry.website.length}/50
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Password"
              value={editedEntry.password}
              onChange={handleInputChange}
              type="password"
              maxLength={128}
              name="password"
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {editedEntry.password.length}/128
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
