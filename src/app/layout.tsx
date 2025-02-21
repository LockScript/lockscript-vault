import {TooltipProvider} from "@/components/ui/tooltip";
import {ClerkProvider} from "@clerk/nextjs";
import type {Metadata} from "next";
import {Toaster} from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "LockScript - Vault",
  description: "Online security, made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <TooltipProvider>
            <Toaster />
            <main>{children}</main>
          </TooltipProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
