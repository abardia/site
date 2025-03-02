// app/api/tools/delete-all/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { excludeToolName } = await req.json();

    try {
        if (excludeToolName) {
            await prisma.tool.deleteMany({
                where: {
                    NOT: {
                        name: excludeToolName,
                    },
                },
            });
        } else {
            await prisma.tool.deleteMany(); // Delete all if no name to exclude
        }


        return NextResponse.json({ message: 'All tools deleted successfully (except excluded)' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting all tools:', error);
        return NextResponse.json(
            { message: `Error deleting all tools: ${error.message}` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}