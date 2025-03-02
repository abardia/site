import { 
    NextResponse 
} from "next/server";
import { 
    PrismaClient 
} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tools = await prisma.tool.findMany();
  return NextResponse.json(tools);
}

export async function POST(req: Request) {
  const { 
    name, category, description, link 
  } = await req.json();
  
  const newTool = await prisma.tool.create({
    data: { 
        name, category, description, link 
    },
  });

  return NextResponse.json(newTool, { 
    status: 201 
});
}
