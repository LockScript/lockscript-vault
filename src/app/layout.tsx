import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";

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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
