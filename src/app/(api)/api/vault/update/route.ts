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

        if (!user) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }

        const vaultString = JSON.stringify(vault);

        // Encrypt the vault string
        const ciphertext = CryptoJS.AES.encrypt(vaultString, 'secret key').toString();

        const userVault = await prisma.user.update({
            where: { id: user?.id },
            data: { vault: vault },
        })

        return NextResponse.json(userVault)
    } catch (error) {
        console.error("Error saving vault:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}