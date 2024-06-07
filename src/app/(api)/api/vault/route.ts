import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user || !user.id) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const { type, data } = await req.json();

        if (!type || !data) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        let newItem;

        switch (type) {
            case "password":
                newItem = await prisma.passwordItem.create({
                    data: {
                        ...data,
                        userId: user?.id,
                    },
                });
                break;
            case "card":
                newItem = await prisma.cardItem.create({
                    data: {
                        ...data,
                        userId: user?.id,
                    },
                });
                break;
            case "pin":
                newItem = await prisma.pinItem.create({
                    data: {
                        ...data,
                        userId: user?.id,
                    },
                });
                break;
            case "note":
                newItem = await prisma.noteItem.create({
                    data: {
                        ...data,
                        userId: user?.id,
                    },
                });
                break;
            default:
                return new NextResponse("Unsupported item type", { status: 400 });
        }

        return NextResponse.json(newItem);
    } catch (error) {
        console.error("Error creating vault item:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: Request) {
    try {
        const user = await currentUser()

        if (!user) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const passwordItems = await prisma.passwordItem.findMany({
            where: {
                userId: user?.id,
            }
        })

        const cardItems = await prisma.cardItem.findMany({
            where: {
                userId: user?.id,
            }
        })

        const pinItems = await prisma.pinItem.findMany({
            where: {
                userId: user?.id,
            }
        })

        const noteItems = await prisma.noteItem.findMany({
            where: {
                userId: user?.id,
            }
        })

        return NextResponse.json({ passwordItems, cardItems, pinItems, noteItems })
    } catch (error) {
        console.error("Error getting vault items:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}