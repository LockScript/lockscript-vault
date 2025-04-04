import { VaultPage } from "@/components/vault/vault-page";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getItems, instantiateVault } from "../actions";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const user = await getItems();

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return redirectToSignIn();
    await instantiateVault(clerkUser.id, clerkUser.username as string);
  }

  return <VaultPage user={user} />;
}
