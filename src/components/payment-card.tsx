import { CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useToast } from "@/components/ui/use-toast";

const PaymentCard = ({ item }: { item: CardItem }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(item.cardNumber);
    toast({
      title: "Copied",
      description: "Card number copied to clipboard.",
    });
  };

  return (
    <Card className="shadow-md rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white max-w-sm transform transition-transform hover:scale-105">
      <CardContent className="p-6 space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {item.cardHolderName.length > 30
              ? item.cardHolderName.substring(0, 30) + "..."
              : item.cardHolderName}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-gray-300"
            onClick={handleCopy}
          >
            <CopyIcon className="h-5 w-5" />
            <span className="sr-only">Copy card number</span>
          </Button>
        </div>
        <div>
          <div className="text-xl font-bold tracking-wider mb-2">
            {item.cardNumber.replace(/\d{4}(?=.)/g, "$& ")}
          </div>
          <div className="text-lg mb-10">Expiry Date: {item.expiryDate}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
