import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";

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
