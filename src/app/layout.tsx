import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className}>
            <header>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </header>

            <main>{children}</main>
          </body>
        </html>
      </ClerkProvider>
    </QueryProvider>
  );
}
