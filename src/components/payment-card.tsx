"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { QueryClient, useMutation } from "react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const PaymentCard = ({
  item,
  queryClient,
  deleteItem,
}: {
  item: CardItem;
  queryClient: QueryClient;
  deleteItem: (id: string, type: string) => Promise<void>;
}) => {
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast({
      title: "Copied",
      description: "Copied to clipboard.",
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getCardLogo = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === "5") {
      return "/images/card/MastercardLogo.png";
    } else if (firstDigit === "4") {
      return "/images/card/VisaLogo.png";
    } else if (firstDigit === "3") {
      return "/images/card/AmexLogo.png";
    } else if (firstDigit === "6") {
      return "/images/card/DiscoverLogo.png";
    } else {
      return "/images/card/Unknown.png";
    }
  };

  const getCardBG = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);

    if (firstDigit === "5") {
      return "/images/card/bgs/BlueCardBG.png";
    } else if (firstDigit === "4") {
      return "/images/card/bgs/BluePurpleCardBG.png";
    } else if (firstDigit === "3") {
      return "/images/card/bgs/OrangeWaveCardBG.png";
    } else if (firstDigit === "6") {
      return "/images/card/bgs/PurpleWaveCardBG.png";
    } else {
      return "/images/card/bgs/BlueCardBG.png";
    }
  };

  const deleteCardMutation = useMutation(() => deleteItem(item.id, item.type), {
    onSuccess: () => {
      queryClient.invalidateQueries("vaultItems");
    },
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
          <img
            className="relative object-cover w-full h-full rounded-xl"
            src={getCardBG(item.cardNumber)}
          />

          <div className="w-full px-8 absolute top-8">
            <div className="flex justify-between">
              <div className="">
                <p className="font-light">Name</p>
                <Tooltip>
                  <TooltipTrigger>
                    <p
                      className="font-medium tracking-widest"
                      onClick={() => handleCopy(item.cardHolderName)}
                    >
                      {item.cardHolderName.length > 20
                        ? item.cardHolderName.substring(0, 20) + "..."
                        : item.cardHolderName}
                    </p>
                  </TooltipTrigger>

                  <TooltipContent>
                    {copied ? "Copied" : "Click to copy"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="pt-1">
              <p className="font-light">Card Number</p>
              <Tooltip>
                <TooltipTrigger>
                  <p
                    className="font-medium tracking-more-wider"
                    onClick={() => handleCopy(item.cardNumber)}
                  >
                    {item.cardNumber}
                  </p>
                </TooltipTrigger>

                <TooltipContent>
                  {copied ? "Copied" : "Click to copy"}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="pt-6 pr-6">
              <div className="flex justify-between">
                <div className="">
                  <p className="font-light text-xs">Expiry</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <p
                        className="font-medium tracking-wider text-sm"
                        onClick={() => handleCopy(item.expiryDate)}
                      >
                        {item.expiryDate}
                      </p>
                    </TooltipTrigger>

                    <TooltipContent>
                      {copied ? "Copied" : "Click to copy"}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="mr-20">
                  <p className="font-light text-xs">CVV</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <p
                        className="font-bold tracking-more-wider text-sm"
                        onClick={() => handleCopy(item.cvv)}
                      >
                        {item.cvv.replace(/./g, "*")}
                      </p>
                    </TooltipTrigger>

                    <TooltipContent>
                      {copied ? "Copied" : "Click to copy"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {item.cardNumber && (
            <img
              className="absolute bottom-0 right-0 w-16 h-auto m-4"
              src={getCardLogo(item.cardNumber)}
              alt="Card Logo"
            />
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem onClick={() => handleCopy(item.cardHolderName)}>
          Copy Name
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleCopy(item.cardNumber)}>
          Copy Card Number
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleCopy(item.expiryDate)}>
          Copy Expiry Date
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleCopy(item.cvv)}>
          Copy CVV
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            deleteCardMutation.mutate();
          }}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default PaymentCard;
