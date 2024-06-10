import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Montserrat({ subsets: ["latin"] });

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
    <QueryProvider>
      <TooltipProvider>
        <ClerkProvider>
          <html lang="en">
            <body className={inter.className}>
              <Toaster />
              <header>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </header>

              <main>{children}</main>
            </body>
          </html>
        </ClerkProvider>
      </TooltipProvider>
    </QueryProvider>
  );
}
