import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

// App Router route segment config
export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: MP4, WebM, MOV` },
        { status: 400 }
      );
    }

    const maxSizeMb = parseInt(process.env.MAX_VIDEO_SIZE_MB || "100", 10);
    if (file.size > maxSizeMb * 1024 * 1024) {
      return NextResponse.json(
        { error: `File exceeds maximum size of ${maxSizeMb}MB` },
        { status: 400 }
      );
    }

    let cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/['"]/g, "");
    let apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/['"]/g, "");
    let apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/['"]/g, "");

    if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
      const match = process.env.CLOUDINARY_URL.trim().replace(/['"]/g, "").match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
      if (match) {
        apiKey = apiKey || match[1];
        apiSecret = apiSecret || match[2];
        cloudName = cloudName || match[3];
      }
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary not configured properly in .env" }, { status: 500 });
    }

    // Configure Cloudinary explicitly per request
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`[Cloudinary] Uploading video (${(file.size / (1024 * 1024)).toFixed(2)} MB) to cloud: ${cloudName}...`);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "portfolio",
          timeout: 120000,
        },
        (error, result) => {
          if (error) {
            console.error("[Cloudinary SDK Error]:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload handler error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Upload failed. Please check server logs." },
      { status: 500 }
    );
  }
}
