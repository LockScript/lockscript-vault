import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()


export async function GET(
    req: Request,
) {
    try {
        const user = await currentUser()

        if (!user) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const vaultUser = await prisma.user.findUnique({
            where: {
                id: user?.id,
            }
        })

        return NextResponse.json(vaultUser?.vault)
    } catch (error) {
        console.error("Error getting vault:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}