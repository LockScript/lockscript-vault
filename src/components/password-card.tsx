import { useToast } from "@/components/ui/use-toast";
import { CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";

const PasswordCard = ({ item }: { item: PasswordItem }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordCopy = () => {
    navigator.clipboard.writeText(item.password);

    toast({
      title: "Password copied!",
      description: `The password for ${item.website} has been copied to your clipboard.`,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="shadow-md p-4 rounded-lg">
      <div className="absolute top-2 right-2 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        X
      </div>
      <CardContent className="flex items-center justify-between space-x-4">
        <div className="space-y-2">
          <div className="font-medium text-lg mb-2">{item.website}</div>
          <div className="text-gray-500 dark:text-gray-400 mb-2">
            {item.username}
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            readOnly
            value={item.password}
            className="text-black text-lg bg-white p-2 rounded border border-gray-300 w-full focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2 rounded-full"
            onClick={handlePasswordCopy}
          >
            <CopyIcon className="h-5 w-5" />
            <span className="sr-only">Copy password</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
