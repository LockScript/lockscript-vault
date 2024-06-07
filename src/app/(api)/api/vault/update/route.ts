import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

const prisma = new PrismaClient()

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();
        const { vault } = body;
        const user = await currentUser();

        if (!user || !user.id) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                id: Number(user?.id),
            }
        })

        if (!dbUser) {
            return new NextResponse("User not found in DB", { status: 500 })
        }

        // Iterate over each vault item and update it in the database
        for (const item of vault) {
            switch (item.type) {
                case 'password':
                    await prisma.passwordItem.update({
                        where: { id: item.id },
                        data: item,
                    });
                    break;
                case 'card':
                    await prisma.cardItem.update({
                        where: { id: item.id },
                        data: item,
                    });
                    break;
                case 'pin':
                    await prisma.pinItem.update({
                        where: { id: item.id },
                        data: item,
                    });
                    break;
                case 'note':
                    await prisma.noteItem.update({
                        where: { id: item.id },
                        data: item,
                    });
                    break;
                default:
                    console.error(`Unknown item type: ${item.type}`);
            }
        }

        return NextResponse.json({ message: "Vault updated successfully" })
    } catch (error) {
        console.error("Error saving vault:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}