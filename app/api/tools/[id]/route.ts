// app/api/tools/[id]/route.ts
import {
  NextResponse } from 'next/server';
import { 
  PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a specific tool (optional, but good for testing)
export async function GET(request: Request, { 
  params 
}: { 
  params: { 
    id: string 
  } 
}) {
  const toolId = await Promise.resolve(params.id); // No parseInt needed

  if (!toolId) {
    return NextResponse.json({ 
      message: 'Invalid tool ID' 
    }, { 
      status: 400 
    });
  }

  try {
    const tool = await prisma.tool.findUnique({
      where: { 
        id: toolId 
      },
    });

    if (!tool) {
      return NextResponse.json({ 
        message: 'Tool not found' 
      }, { 
        status: 404 
      });
    }

    return NextResponse.json(tool);
  } catch (error: any) {
    console.error('Error getting tool:', error);
    return NextResponse.json({ 
      message: `Error getting tool: ${error.message}` 
    }, { 
      status: 500 
    }
    );
  } finally {
      await prisma.$disconnect();
  }
}


// PUT (or PATCH) to update a tool
export async function PUT(request: Request, {
   params 
  }: { 
    params: { 
      id: string 
  } }) {
  const toolId = await Promise.resolve(params.id); // No parseInt needed

  if (!toolId) {
    return NextResponse.json({ message: 'Invalid tool ID' }, { status: 400 });
  }

  const { 
    name, category, description, link 
  } = await request.json();

  if (!name || !category || !description || !link) {
    return NextResponse.json({ 
      message: 'Missing required fields' 
    }, { 
      status: 400 
    });
  }

  try {
    const updatedTool = await prisma.tool.update({
      where: { 
        id: toolId 
      },
      data: { 
        name, category, description, link 
      },
    });

    if (!updatedTool) {
      return NextResponse.json({ 
        message: 'Tool not found' 
      }, { 
        status: 404 
      });
    }

    return NextResponse.json(updatedTool); 
  } catch (error: any) {
    console.error('Error updating tool:', error);
    return NextResponse.json({ 
      message: `Error updating tool: ${
        error.message
      }` 
    }, { 
      status: 500 
    }); } finally {
      await prisma.$disconnect();
  }
}


export async function DELETE(request: Request, { 
  params 
}: { params: { id: string } }) {
  const toolId = await Promise.resolve(params.id); 

  if (!toolId) {
    return NextResponse.json({
       message: 'Invalid tool ID' }, { 
        status: 400 
      });
  }

  try {
    const deletedTool = await prisma.tool.delete({
      where: { 
        id: toolId 
      },
    });

    if (!deletedTool) {
      return NextResponse.json({ 
        message: 'Tool not found'
      }, { 
        status: 404 
      });
    }

    return NextResponse.json({ 
      message: 'Tool deleted successfully' 
    }, { 
      status: 200 
    });
  } catch (error: any) {
    console.error('Error deleting tool:', error);
    return NextResponse.json({ 
        message: `Error deleting tool: ${
          error.message
        }` 
      }, {
        status: 500 
      }
    );
  } finally {
      await prisma.$disconnect();
  }
}