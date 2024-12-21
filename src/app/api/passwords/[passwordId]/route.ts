import prismadb from "@/lib/prismadb";
import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ passwordId: Promise<string> }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const passwordId = await params.passwordId; // Await the params
    if (!passwordId) {
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
        id: passwordId,
        userId: userId,
      },
    });

    return NextResponse.json(passwordItem);
  } catch (error) {
    console.log("[PASSWORD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ passwordId: Promise<string> }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const passwordId = await params.passwordId;
    if (!passwordId) {
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

    const passwordData = await req.json();

    const updatedPasswordItem = await prismadb.passwordItem.update({
      where: {
        id: passwordId,
        userId: userId,
      },
      data: passwordData,
    });
    

    return NextResponse.json(updatedPasswordItem);
  } catch (error) {
    console.log("[PASSWORD_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
