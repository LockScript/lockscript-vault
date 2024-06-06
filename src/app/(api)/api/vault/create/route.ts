import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();
        const referer = req.headers.get('Referer');
        console.log('Request came from:', referer);

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

        const vaultKey = CryptoJS.lib.WordArray.random(128/8).toString();

        const user = await prisma.user.create({
            data: {
                id: id,
                username: username,
                vault: "",
                vaultKey: vaultKey,
                updated_at: new Date(),
                last_sign_in_at: new Date(),
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}