import { Icons } from "@/components/ui/icons";
import VaultPage from "@/components/ui/vault/vault";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Loader } from "lucide-react";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Icons.logo />
        <Loader className="text-black animate-spin" />
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
