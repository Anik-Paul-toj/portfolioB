import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const covers = await prisma.thumbnailCover.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(covers);
  } catch (error) {
    console.error("Error fetching covers:", error);
    return NextResponse.json({ error: "Failed to fetch covers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      category,
      description,
      client,
      year,
      sourceType,
      imageUrl,
      cloudinaryPublicId,
      featured,
      published,
    } = body;

    // Get highest displayOrder
    const maxOrderCover = await prisma.thumbnailCover.findFirst({
      orderBy: { displayOrder: "desc" },
    });
    const nextOrder = maxOrderCover ? maxOrderCover.displayOrder + 1 : 0;

    const newCover = await prisma.thumbnailCover.create({
      data: {
        title,
        category: category || "YouTube Thumbnail",
        description: description || null,
        client: client || null,
        year: year || new Date().getFullYear().toString(),
        sourceType: sourceType || "DRIVE",
        imageUrl,
        cloudinaryPublicId: cloudinaryPublicId || null,
        featured: featured || false,
        published: published !== undefined ? published : true,
        displayOrder: nextOrder,
      },
    });

    return NextResponse.json(newCover, { status: 201 });
  } catch (error) {
    console.error("Error creating cover:", error);
    return NextResponse.json({ error: "Failed to create cover" }, { status: 500 });
  }
}
