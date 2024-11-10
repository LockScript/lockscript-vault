import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ToastProvider } from "@/providers/toast-provider";

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
    <SidebarProvider>
      <ToastProvider />
      <ModalProvider />
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
