import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Globe } from 'lucide-react'
import {updatePasswordItem} from "@/app/actions"
import {useUser} from "@clerk/nextjs"
import {useState} from "react"
import {useRouter} from "next/navigation"
import { z } from "zod";
import toast from "react-hot-toast"
import {encrypt} from "@/utils/encryption"

interface PasswordEntry {
  id: string
  name: string
  username: string
  website: string
  password: string
}

const websiteSchema = z.string().url();

interface EditPasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  entry: PasswordEntry | null
}

export function EditPasswordDialog({ isOpen, onClose, entry }: EditPasswordDialogProps) {
  const [editedEntry, setEditedEntry] = useState<PasswordEntry>({
    id: '',
    name: '',
    username: '',
    website: '',
    password: '',
  })
  const { user: clerkuser } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (entry) {
      setEditedEntry(entry)
    }
  }, [entry])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEntry(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const websiteValidation = websiteSchema.safeParse(editedEntry.website);
  
    if (!websiteValidation.success) {
      toast.error("Invalid website URL");
      return;
    }

    updatePasswordItem(entry!.id,encrypt(editedEntry.username, clerkuser), encrypt(editedEntry.website, clerkuser), encrypt(editedEntry.password, clerkuser))
    router.refresh();
    toast.success("Password updated");
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-100 p-2">
              <Globe className="h-5 w-5 text-rose-500" />
            </div>
            <DialogTitle>{entry ? 'Edit Password Entry' : 'Add New Password Entry'}</DialogTitle>
          </div>
          <DialogDescription>
            Make changes to your password entry here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedEntry.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={editedEntry.username}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              value={editedEntry.website}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={editedEntry.password}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

