import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const videos = await prisma.portfolioVideo.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio videos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, description, client, year, sourceType, videoUrl, cloudinaryPublicId, thumbnailUrl, duration, fileSize, featured, published } = body;

    // Get highest displayOrder
    const maxOrderVideo = await prisma.portfolioVideo.findFirst({
      orderBy: { displayOrder: 'desc' }
    });
    const nextOrder = maxOrderVideo ? maxOrderVideo.displayOrder + 1 : 0;

    const newVideo = await prisma.portfolioVideo.create({
      data: {
        title,
        category,
        description,
        client,
        year,
        sourceType,
        videoUrl,
        cloudinaryPublicId,
        thumbnailUrl,
        duration,
        fileSize,
        featured: featured || false,
        published: published || false,
        displayOrder: nextOrder,
      },
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
