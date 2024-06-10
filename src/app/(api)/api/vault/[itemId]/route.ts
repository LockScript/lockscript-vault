import { currentUser } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextApiRequest, { params }: { params: { itemId: string } },) {
    try {
        const user = await currentUser();
        const itemId = params.itemId
        const type = headers().get('X-Item-Type')

        if (!user || !user.id) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }
        
        console.log(itemId, type)

        if (!itemId || !type) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const userId = user.id;

        switch (type) {
            case 'password':
                await prisma.passwordItem.delete({
                    where: { id: itemId, userId: userId },
                });
                break;
            case 'card':
                await prisma.cardItem.delete({
                    where: { id: itemId, userId: userId },
                });
                break;
            case 'pin':
                await prisma.pinItem.delete({
                    where: { id: itemId, userId: userId },
                });
                break;
            case 'note':
                await prisma.noteItem.delete({
                    where: { id: itemId, userId: userId },
                });
                break;
            default:
                return new NextResponse("Bad Request", { status: 400 });
        }

        return NextResponse.json({ message: "Vault Item Deleted Succesfully" })
    } catch (error) {
        console.error("Error deleting item:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
