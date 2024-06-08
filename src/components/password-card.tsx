import { useToast } from "@/components/ui/use-toast";
import { CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const PasswordCard = ({ item }: { item: PasswordItem }) => {
  const { toast } = useToast()

  const handlePasswordCopy = () => {
    navigator.clipboard.writeText(item.password);

    toast({
      title: "Password copied!",
      description: `The password for ${item.website} has been copied to your clipboard.`,
    })
  };

  return (
    <Card className="shadow-md p-4 rounded-lg">
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="font-medium text-lg">{item.website}</div>
          <div className="text-gray-500 dark:text-gray-400">
            {item.username}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => handlePasswordCopy()}
        >
          <CopyIcon className="h-5 w-5" />
          <span className="sr-only">
            Copy password
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
