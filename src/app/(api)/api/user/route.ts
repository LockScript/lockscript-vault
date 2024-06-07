import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const user = await currentUser()

        if (!user || !user.id) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                id: Number(user?.id),
            }
        })

        console.log(dbUser)

        return NextResponse.json(dbUser)
    } catch (error) {
        console.error("Error getting user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}