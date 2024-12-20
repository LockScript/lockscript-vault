import {Icons} from "@/components/ui/icons";
import VaultPage from "@/components/ui/vault/vault";
import prismadb from "@/lib/prismadb";
import {RedirectToSignIn,SignedOut} from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="h-screen w-[calc(100vw-var(--sidebar-width))] flex justify-center items-center animate-pulse">
        <Icons.logo className="w-40 h-40" />
        <h1 className="font-bold tracking-tig text-7xl">Authenticating</h1>

        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    );
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

  return <VaultPage user={user} />;
};

export default Page;
