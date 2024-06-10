import { Checkbox, Slider } from "@mui/material";
import { PlusIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function generatePassword(
  length: number,
  includeSpecialChars: boolean,
  includeNumbers: boolean,
  includeUppercase: boolean
) {
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
  let allChars = lowerChars;

  if (includeUppercase) allChars += upperChars;
  if (includeNumbers) allChars += numberChars;
  if (includeSpecialChars) allChars += specialChars;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

const CreatePasswordModal = ({
  formData,
  setFormData,
  handleSave,
  activeTab,
}: {
  formData: { website: string; username: string; password: string };
  setFormData: (value: {
    website: string;
    username: string;
    password: string;
  }) => void;
  handleSave: () => void;
  activeTab: string;
}) => {
  const [length, setLength] = useState(12);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Password</DialogTitle>
            <DialogDescription>
              Enter the credentials for the new password below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <div className="col-span-1 text-left">
                <Label htmlFor="website">Website</Label>
              </div>
              <div className="col-span-3">
                <Input
                  id="website"
                  className="w-full"
                  required
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://www.lockscript.dev"
                />
              </div>
            </div>

            <div>
              <div className="col-span-1 text-left">
                <Label htmlFor="username">Username</Label>
              </div>
              <div className="col-span-3">
                <Input
                  id="username"
                  className="w-full"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="cvs0"
                />
              </div>
            </div>

            <div>
              <div className="col-span-1 text-left">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="col-span-3 flex items-center gap-4">
                <Input
                  id="password"
                  className="flex-grow"
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                />

                {/* Dialog component for generating password */}
                <Dialog>
                  {/* DialogTrigger */}
                  <DialogTrigger asChild>
                    <Button className="w-10 p-2">
                      <RefreshCcw />
                    </Button>
                  </DialogTrigger>

                  {/* DialogContent */}
                  <DialogContent>
                    <DialogTitle>Generate Password</DialogTitle>
                    <DialogDescription>
                      Generate a secure password.
                    </DialogDescription>

                    {/* Password generation options */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <Label>Password Length: {length}</Label>
                        <Slider
                          min={6}
                          max={24}
                          value={length}
                          onChange={(e, val) => setLength(val as number)}
                          valueLabelDisplay="auto"
                        />
                      </div>

                      {/* Other password generation options */}
                      <div>
                        <Label>Include special characters</Label>
                        <Checkbox
                          checked={includeSpecialChars}
                          onChange={() =>
                            setIncludeSpecialChars(!includeSpecialChars)
                          }
                        />
                      </div>

                      <div>
                        <Label>Include numbers</Label>
                        <Checkbox
                          checked={includeNumbers}
                          onChange={() => setIncludeNumbers(!includeNumbers)}
                        />
                      </div>

                      <div>
                        <Label>Include uppercase letters</Label>
                        <Checkbox
                          checked={includeUppercase}
                          onChange={() =>
                            setIncludeUppercase(!includeUppercase)
                          }
                        />
                      </div>
                    </div>

                    {/* DialogFooter */}
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          onClick={() => {
                            const newPassword = generatePassword(
                              length,
                              includeSpecialChars,
                              includeNumbers,
                              includeUppercase
                            );
                            setFormData({ ...formData, password: newPassword });
                          }}
                        >
                          Generate Password
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="w-full" onClick={handleSave}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePasswordModal;
