"use client";

import { usePasswordModal } from "@/hooks/use-password-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
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
import { Button } from "../ui/button";
import CryptoJS from "crypto-js";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  website: z.string().min(1, "Website is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const PasswordModal = () => {
  const passwordModal = usePasswordModal();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const encryptionPassword = `${user!.id}-${
        user!.createdAt
      }-${user!.createdAt?.getTime()}-${user!.id.charCodeAt(
        user!.id.length - 1
      )}-${user!.createdAt?.getDate()}-${user!.id.charCodeAt(
        0
      )}-${user!.createdAt?.getUTCFullYear()}-${user!.id.charCodeAt(
        1
      )}-${user!.createdAt?.getUTCHours()}-${
        user!.id.length
      }-${user!.createdAt?.getUTCMinutes()}`;

      const encryptedWebsite = CryptoJS.AES.encrypt(
        values.website,
        encryptionPassword
      ).toString();

      const encryptedUsername = CryptoJS.AES.encrypt(
        values.username,
        encryptionPassword
      ).toString();

      const encryptedPassword = CryptoJS.AES.encrypt(
        values.password,
        encryptionPassword
      ).toString();

      await axios.post("/api/passwords", {
        website: encryptedWebsite,
        username: encryptedUsername,
        password: encryptedPassword,
      });

      window.location.reload();

      toast.success("Password created successfully.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <Modal
      title="Create Password"
      description="Create a password item."
      isOpen={passwordModal.isOpen}
      onClose={passwordModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      disabled={loading}
                      placeholder="Enter website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={loading}
                      placeholder="Enter password"
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
                onClick={passwordModal.onClose}
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
