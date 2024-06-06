import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const user = await currentUser()

        if (!user) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const userId = Number(user.id);

        const passwordItems = await prisma.passwordItem.findMany({
            where: {
                userId: userId,
            }
        })

        const cardItems = await prisma.cardItem.findMany({
            where: {
                userId: userId,
            }
        })

        const pinItems = await prisma.pinItem.findMany({
            where: {
                userId: userId,
            }
        })

        const noteItems = await prisma.noteItem.findMany({
            where: {
                userId: userId,
            }
        })

        return NextResponse.json({ passwordItems, cardItems, pinItems, noteItems })
    } catch (error) {
        console.error("Error getting vault items:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}