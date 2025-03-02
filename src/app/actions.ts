"use server";

import prismadb from "@/lib/prismadb";
import {auth} from "@clerk/nextjs/server";

export async function updatePasswordItem(
  id: string,
  newUsername: string,
  newWebsite: string,
  newPassword: string,
  usernameIV: string,
  websiteIV: string,
  passwordIV: string
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
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

  const item = await prismadb.passwordItem.update({
    where: {
      id: passwordItem.id,
    },
    data: {
      username: newUsername,
      website: newWebsite,
      password: newPassword,
      usernameIV,
      websiteIV,
      passwordIV,
    },
  });

  return item;
}

export async function deletePasswordItem(id: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
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
  password: string,
  usernameIV: string,
  websiteIV: string,
  passwordIV: string
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const newPasswordItem = await prismadb.passwordItem.create({
    data: {
      username,
      website,
      password,
      usernameIV,
      websiteIV,
      passwordIV,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      user: {
        connect: {
          id: userId
        }
      }
    },
  });

  return newPasswordItem;
}

export async function resetVault() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prismadb.passwordItem.deleteMany({
    where: {
      userId,
    },
  });

  await prismadb.cardItem.deleteMany({
    where: {
      userId,
    },
  });

  await prismadb.pinItem.deleteMany({
    where: {
      userId,
    },
  });

  await prismadb.noteItem.deleteMany({
    where: {
      userId,
    },
  });

  return { success: true };
}


export async function instantiateVault(userId: string, username: string) {
  const vault = await prismadb.user.create({
    data: {
      id: userId,
      username: username,
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

export async function getPasswords() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prismadb.user.findUnique({
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
}
