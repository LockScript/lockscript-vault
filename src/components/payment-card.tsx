"use client";

import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const PaymentCard = ({ item }: { item: CardItem }) => {
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

  return (
    <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
      <img
        className="relative object-cover w-full h-full rounded-xl"
        src="https://i.imgur.com/kGkSg1v.png"
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
          <img className="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png" />
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
              <p className="font-light text-xs"></p>
              <p className="font-medium tracking-wider text-sm mr-10"></p>
            </div>
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

            <div className="">
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
    </div>
  );
};

export default PaymentCard;
