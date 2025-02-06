"use client";

import { createPasswordItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { encrypt } from "@/utils/encryption";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export const CreatePasswordDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user: clerkuser } = useUser();

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

  const handleSave = async () => {
    setLoading(true);
  
    const formattedWebsite = website.startsWith("https://")
      ? website
      : `https://${website}`;
  
    const validationResult = passwordSchema.safeParse({
      name,
      username,
      website: formattedWebsite,
      password,
    });
  
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.errors[0]?.message || "Validation failed";
      toast.error(errorMessage);
      setLoading(false);
      return;
    }
  
    try {
      await createPasswordItem(
        encrypt(username, clerkuser),
        encrypt(formattedWebsite, clerkuser),
        encrypt(password, clerkuser)
      );
      toast.success("Password created");
      onClose();
    } catch (error) {
      toast.error("Failed to create password");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {name.length}/50
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {username.length}/30
            </div>
          </div>
          <div className="flex relative rounded-lg">
            <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
              https://
            </span>
            <Input
              placeholder="Website"
              className="-ms-px h-12 rounded-tl-none rounded-bl-none"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={50}
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {website.length}/50
            </div>
          </div>
          <div className="relative">
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              maxLength={128}
            />
            <div
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {password.length}/128
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
};
