import { Icons } from "@/components/ui/icons";
import {VaultPage} from "@/components/vault/vault-page";
import prismadb from "@/lib/prismadb";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

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

  return <VaultPage user={user} />;
};

export default Page;
