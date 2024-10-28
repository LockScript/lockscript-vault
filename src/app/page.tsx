import VaultPage from "@/components/ui/vault/vault";
import { useVaultModal } from "@/hooks/use-vault-modal";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const Page = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      passwordItems: true,
      cardItems: true,
      pinItems: true,
      noteItems: true,
    },
  });

  return (
    <>
      <VaultPage user={user} />
    </>
  );
};

export default Page;
