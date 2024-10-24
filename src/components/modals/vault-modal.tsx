"use client";

import { useVaultModal } from "@/hooks/use-vault-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  encryptionKey: z.string().min(8, "Key must be at least 8 characters long"),
});

export const VaultModal = () => {
  const storeModal = useVaultModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      encryptionKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      await axios.post("/api/vaults", {
        key: values.encryptionKey,
      });

      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Vault"
      description="Provide a key to encrypt your vault"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="encryptionKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encryption Key</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter encryption key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                onClick={storeModal.onClose}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
