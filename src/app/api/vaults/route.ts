import prismadb from "@/lib/prismadb";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { key } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!key) {
      return new NextResponse("Encryption Key is required", { status: 400 });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const existingUser = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (existingUser) {
      return new NextResponse("User already has a vault", { status: 400 });
    }

    const vault = await prismadb.user.create({
      data: {
        id: userId,
        username: clerkUser.username!,
        key: key,
      },
      include: {
        passwordItems: true,
        cardItems: true,
        pinItems: true,
        noteItems: true,
      }
    });

    return NextResponse.json(vault);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
