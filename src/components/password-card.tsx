import { CopyIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const PasswordCard = ({ item }: { item: PasswordItem }) => {
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
        >
          <CopyIcon className="h-5 w-5" />
          <span className="sr-only">Copy password</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
