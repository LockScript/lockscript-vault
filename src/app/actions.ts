"use server";

import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export async function updatePasswordItem(
  id: string,
  newUsername: string,
  newWebsite: string,
  newPassword: string
) {
  const clerkUser = await currentUser();

  const user = await prismadb.user.findUnique({
    where: {
      id: clerkUser?.id,
    },
    include: {
      passwordItems: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordItem = user.passwordItems.find((item) => item.id === id);

  if (!passwordItem) {
    throw new Error("Password item not found");
  }

  await prismadb.passwordItem.update({
    where: {
      id: passwordItem.id,
    },
    data: {
      username: newUsername,
      website: newWebsite,
      password: newPassword,
    },
  });

  return { success: true };
}

export async function deletePasswordItem(id: string) {
  const clerkUser = await currentUser();

  const user = await prismadb.user.findUnique({
    where: {
      id: clerkUser?.id,
    },
    include: {
      passwordItems: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordItem = user.passwordItems.find((item) => item.id === id);

  if (!passwordItem) {
    throw new Error("Password item not found");
  }

  await prismadb.passwordItem.delete({
    where: {
      id: passwordItem.id,
    },
  });

  return { success: true };
}

export async function createPasswordItem(
  username: string,
  website: string,
  password: string
) {
  const clerkUser = await currentUser();

  const user = await prismadb.user.findUnique({
    where: {
      id: clerkUser?.id,
    },
    include: {
      passwordItems: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newPasswordItem = await prismadb.passwordItem.create({
    data: {
      username,
      website,
      password,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    },
  });

  return newPasswordItem;
}

export async function instantiateVault() {
  const clerkUser = await currentUser();

  const vault = await prismadb.user.create({
    data: {
      id: clerkUser?.id,
      username: clerkUser?.username!,
    },
    include: {
      passwordItems: true,
      cardItems: true,
      pinItems: true,
      noteItems: true,
    },
  });

  return vault;
}
