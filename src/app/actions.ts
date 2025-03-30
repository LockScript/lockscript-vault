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

export async function updateNoteItem(
  id: string,
  newTitle: string,
  newContent: string,
  titleIV: string,
  contentIV: string
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
      noteItems: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const noteItem = user.noteItems.find((item) => item.id === id);

  if (!noteItem) {
    throw new Error("Note item not found");
  }

  const item = await prismadb.noteItem.update({
    where: {
      id: noteItem.id,
    },
    data: {
      title: newTitle,
      content: newContent,
      titleIV,
      contentIV,
    },
  });

  return item;
}

export async function deleteNoteItem(id: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      noteItems: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const noteItem = user.noteItems.find((item) => item.id === id);

  if (!noteItem) {
    throw new Error("Note item not found");
  }

  await prismadb.noteItem.delete({
    where: {
      id: noteItem.id,
    },
  });

  return { success: true };
}

export async function createNoteItem(
  title: string,
  content: string,
  titleIV: string,
  contentIV: string
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const newNoteItem = await prismadb.noteItem.create({
    data: {
      title,
      content,
      titleIV,
      contentIV,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      user: {
        connect: {
          id: userId
        }
      }
    },
  });

  return newNoteItem;
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

export async function getItems() {
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

