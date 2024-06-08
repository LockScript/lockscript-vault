import { useToast } from "@/components/ui/use-toast";
import {
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  EditIcon,
  ClipboardIcon,
  SaveIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";

const PasswordCard = ({ item }: { item: PasswordItem }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState(item.password);
  const [website, setWebsite] = useState(item.website);
  const [username, setUsername] = useState(item.username);

  const handlePasswordCopy = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied!",
      description: `The password for ${website} has been copied to your clipboard.`,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/vault/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vault: [
            {
              id: item.id,
              type: "password",
              website,
              username,
              password,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save details");
      }

      toast({
        title: "Details updated!",
        description: `The details for ${website} have been updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Card className="relative shadow-md p-4 rounded-lg">
      <button
        className="absolute top-2 right-2 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Close"
      >
        X
      </button>
      <CardContent className="flex items-center justify-between space-x-4">
        <div className="space-y-2">
          {isEditing ? (
            <Input
              type="text"
              value={website}
              onChange={handleWebsiteChange}
              className="font-medium text-lg mb-2 text-black bg-white p-2 rounded border border-gray-300 w-full focus-visible:ring-0"
            />
          ) : (
            <h2 className="font-medium text-lg mb-2">{website}</h2>
          )}
          {isEditing ? (
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="text-gray-500 dark:text-gray-400 mb-2 bg-white p-2 rounded border border-gray-300 w-full focus-visible:ring-0"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mb-2">{username}</p>
          )}
          <div className="flex items-center space-x-2">
            <Input
              type={showPassword ? "text" : "password"}
              readOnly={!isEditing}
              value={password}
              onChange={handlePasswordChange}
              className="text-black text-lg bg-white p-2 rounded border border-gray-300 w-full focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full"
              onClick={handlePasswordCopy}
              aria-label="Copy password"
            >
              <CopyIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full"
              onClick={handleEditToggle}
              aria-label="Edit details"
            >
              <EditIcon className="h-5 w-5" />
            </Button>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full"
                onClick={handleSave}
                aria-label="Save details"
              >
                <SaveIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
