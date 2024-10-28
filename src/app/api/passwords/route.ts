import prismadb from "@/lib/prismadb";
import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { website, username, password } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!website) {
      return new NextResponse("Website is required", { status: 400 });
    }

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }

    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    const existingUser = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return new NextResponse("User does not have a vault.", { status: 400 });
    }

    const passwordItem = await prismadb.passwordItem.create({
      data: {
        website,
        username,
        password,
        userId,
      },
    });

    return NextResponse.json(passwordItem);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
