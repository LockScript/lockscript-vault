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
                last_sign_in_at,
                phone_numbers,
                updated_at,
                username,
            },
            object: eventObject,
            type
        } = body;

        if (type !== 'user.created') {
            return new NextResponse("Invalid event type", { status: 400 });
        }

        console.log({
            id, username, phone_numbers, updated_at, last_sign_in_at
        })

        const user = prisma.user.create({
            data: {
                id: id,
                username: username,
                phone_number: phone_numbers[0],
                updated_at: updated_at,
                last_sign_in_at: last_sign_in_at,
                vault: ""
            }
        })

        return new NextResponse(JSON.stringify({ message: "User created successfully!", user }), { status: 200 });
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}