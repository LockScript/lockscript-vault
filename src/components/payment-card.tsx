import { CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const PaymentCard = ({item}: {item: CardItem}) => {
  return (
    <Card className="shadow-md p-4 rounded-lg">
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="font-medium pt-4">
            {item.cardNumber} | {item.expiryDate}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {item.cardHolderName}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <CopyIcon className="h-4 w-4" />
          <span className="sr-only">Copy password</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
