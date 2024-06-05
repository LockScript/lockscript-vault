import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();

        const {
            data: {
                id,
                username,
            },
            object: eventObject,
            type
        } = body;

        if (type !== 'user.created') {
            return new NextResponse("Invalid event type", { status: 400 });
        }

        console.log({
            id, username
        })

        const user = prisma.user.create({
            data: {
                id: id,
                username: username,
                vault: ""
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}