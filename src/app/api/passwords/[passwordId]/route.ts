import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { passwordId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.passwordId) {
      return new NextResponse("Password ID is required", { status: 400 });
    }

    const existingUser = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return new NextResponse("User does not have a vault.", { status: 400 });
    }

    const passwordItem = await prismadb.passwordItem.delete({
      where: {
        id: params.passwordId,
        userId: userId,
      },
    });

    return NextResponse.json(passwordItem);
  } catch (error) {
    console.log("[PASSWORD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
