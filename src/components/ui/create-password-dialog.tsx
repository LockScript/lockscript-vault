import { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { createPasswordItem } from "@/app/actions";
import { encrypt } from "./password-manager";
import { useUser } from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";

const websiteSchema = z.string().url();

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
  const { user: clerkuser } = useUser();
  const router = useRouter();

  const handleSave = () => {
    const websiteValidation = websiteSchema.safeParse(website);
  
    if (!websiteValidation.success) {
      toast.error("Invalid website URL");
      return;
    }
  
    createPasswordItem(
      encrypt(username, clerkuser),
      encrypt(website, clerkuser),
      encrypt(password, clerkuser)
    );
    toast.success("Password created");
    onClose();
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
