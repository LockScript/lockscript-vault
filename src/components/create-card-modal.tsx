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
import { z } from "zod";
import { toast } from "./ui/use-toast";

const validateCardData = ({
  formData,
}: {
  formData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  };
}) => {
  try {
    CardSchema.parse(formData);
    return true;
  } catch (error) {
    return false;
  }
};

const CardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)
    .min(19)
    .max(19),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
  cvv: z.string().length(3),
  cardHolderName: z.string(),
});

const CreateCardModal = ({
  formData,
  setFormData,
  handleSave,
  activeTab,
}: {
  formData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  };
  setFormData: (value: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  }) => void;
  handleSave: () => void;
  activeTab: string;
}) => {
  const handleSaveClick = () => {
    if (validateCardData({ formData })) {
      handleSave();
    } else {
      toast({
        title: "Invalid Card Data",
        description: `Please enter valid card data.`,
      });
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
              Enter details for the new card below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                className="col-span-3"
                required
                value={formData.cardNumber}
                onChange={(e) => {
                  let formattedCardNumber = e.target.value.replace(/\s/g, "");
                  formattedCardNumber = formattedCardNumber.replace(/\D/g, "");
                  formattedCardNumber = formattedCardNumber.replace(
                    /(\d{4})(?=\d)/g,
                    "$1 "
                  );
                  setFormData({ ...formData, cardNumber: formattedCardNumber });
                }}
                maxLength={19}
                onKeyDown={(e) => {
                  if (
                    !(
                      (e.key >= "0" && e.key <= "9") ||
                      e.key === "Backspace" ||
                      e.key === "Tab" ||
                      e.key === "ArrowLeft" ||
                      e.key === "ArrowRight" ||
                      e.keyCode === 32
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                placeholder="Card Number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                className="col-span-3"
                required
                value={formData.expiryDate}
                onChange={(e) => {
                  const input = e.target.value;
                  const numericInput = input.replace(/\D/g, "");
                  const formattedInput = numericInput.replace(
                    /^(\d{2})(\d{0,2}).*/,
                    "$1/$2"
                  );
                  setFormData({ ...formData, expiryDate: formattedInput });
                }}
                maxLength={5}
                placeholder="MM/YY"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="cvv" className="text-right">
                CVV
              </Label>
              <Input
                id="cvv"
                className="flex-grow"
                required
                type="password"
                inputMode="numeric"
                maxLength={3}
                pattern="[0-9]*"
                value={formData.cvv}
                onChange={(e) => {
                  const input = e.target.value;
                  const numericInput = input.replace(/\D/g, "");
                  setFormData({ ...formData, cvv: numericInput });
                }}
                placeholder="CVV"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="cardHolderName" className="text-right">
                Card Holder Name
              </Label>
              <Input
                id="cvv"
                className="flex-grow"
                required
                type="text"
                value={formData.cardHolderName}
                onChange={(e) => {
                  const input = e.target.value;
                  const textInput = input.replace(/[^A-Za-z\s]/g, "");
                  setFormData({ ...formData, cardHolderName: textInput });
                }}
                placeholder="John Smith"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="w-full" onClick={handleSaveClick}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCardModal;
