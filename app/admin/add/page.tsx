"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  Link as LinkIcon,
  Loader2,
  Video,
  Image as ImageIcon,
} from "lucide-react";

import {
  PORTFOLIO_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  THUMBNAIL_CATEGORIES,
} from "@/lib/content";

const VIDEO_CATEGORIES = [...PORTFOLIO_CATEGORIES];
const COVER_CATEGORIES = [...THUMBNAIL_CATEGORIES];

export default function AddWorkPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/admin/login");
    },
  });
  const router = useRouter();

  const [workType, setWorkType] = useState<"VIDEO" | "COVER">("VIDEO");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(VIDEO_CATEGORIES[0] || "Doctor edits");
  const [description, setDescription] = useState(
    CATEGORY_DESCRIPTIONS[VIDEO_CATEGORIES[0]] || ""
  );
  const [client, setClient] = useState("");

  const handleWorkTypeChange = (type: "VIDEO" | "COVER") => {
    setWorkType(type);
    if (type === "VIDEO") {
      const defaultCat = VIDEO_CATEGORIES[0];
      setCategory(defaultCat);
      setDescription(CATEGORY_DESCRIPTIONS[defaultCat] || "");
    } else {
      const defaultCat = COVER_CATEGORIES[0];
      setCategory(defaultCat);
      setDescription("High-impact visual artwork crafted for maximum engagement, CTR, and brand aesthetics.");
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (workType === "VIDEO") {
      const defaultDescriptions = Object.values(CATEGORY_DESCRIPTIONS);
      if (!description.trim() || defaultDescriptions.includes(description.trim())) {
        setDescription(CATEGORY_DESCRIPTIONS[newCategory] || "");
      }
    }
  };

  const [sourceType, setSourceType] = useState<"CLOUDINARY" | "DRIVE">("DRIVE");
  const [driveUrl, setDriveUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);
    setUploadProgress(10);

    try {
      let finalMediaUrl = "";
      let cloudinaryPublicId = null;
      let thumbnailUrl = null;
      let duration = null;
      let fileSize = null;

      if (sourceType === "CLOUDINARY") {
        if (!file) throw new Error(workType === "VIDEO" ? "Please select a video file" : "Please select an image file");

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dg4kelwe6";
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset";
        const resourceType = workType === "VIDEO" ? "video" : "image";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);

        const uploadData = await new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const pct = Math.round((event.loaded / event.total) * 90);
              setUploadProgress(Math.max(10, pct));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (err) {
                reject(new Error("Invalid response from Cloudinary"));
              }
            } else {
              // Fallback to server /api/upload
              fetch("/api/upload", {
                method: "POST",
                body: (() => {
                  const fd = new FormData();
                  fd.append("file", file);
                  return fd;
                })(),
              })
                .then((r) => r.json())
                .then((data) => {
                  if (data.error) reject(new Error(data.error));
                  else resolve(data);
                })
                .catch((err) => reject(new Error(err?.message || "Upload failed")));
            }
          };

          xhr.onerror = () => {
            fetch("/api/upload", {
              method: "POST",
              body: (() => {
                const fd = new FormData();
                fd.append("file", file);
                return fd;
              })(),
            })
              .then((r) => r.json())
              .then((data) => {
                if (data.error) reject(new Error(data.error));
                else resolve(data);
              })
              .catch((err) => reject(new Error(err?.message || "Upload failed")));
          };

          xhr.send(formData);
        });

        setUploadProgress(100);
        finalMediaUrl = uploadData.secure_url;
        cloudinaryPublicId = uploadData.public_id;
        thumbnailUrl = uploadData.secure_url ? uploadData.secure_url.replace(/\.[^/.]+$/, ".jpg") : null;
        duration = uploadData.duration || null;
        fileSize = uploadData.bytes || file.size;
      } else {
        if (!driveUrl) throw new Error("Please provide a Google Drive URL");
        finalMediaUrl = driveUrl;
      }

      if (workType === "VIDEO") {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category,
            description,
            client: client || "",
            year: new Date().getFullYear().toString(),
            sourceType,
            videoUrl: finalMediaUrl,
            cloudinaryPublicId,
            thumbnailUrl,
            duration,
            fileSize,
            published: true,
          }),
        });

        if (!res.ok) throw new Error("Failed to save video reel");
      } else {
        // Save Thumbnail Cover
        const res = await fetch("/api/covers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category,
            description,
            client: client || "",
            year: new Date().getFullYear().toString(),
            sourceType,
            imageUrl: finalMediaUrl,
            cloudinaryPublicId,
            published: true,
          }),
        });

        if (!res.ok) throw new Error("Failed to save thumbnail / cover image");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (status === "loading") return null;

  const currentCategories = workType === "VIDEO" ? VIDEO_CATEGORIES : COVER_CATEGORIES;

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-12">
      <Link
        href="/admin"
        className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <h1 className="mb-4 font-display text-4xl text-white">Add Portfolio Work</h1>
      <p className="mb-8 text-sm text-slate-400">
        Choose whether you want to add a Video Reel edit or a Thumbnail / Cover Image showcase item.
      </p>

      {/* Work Type Selection */}
      <div className="mb-10 grid grid-cols-2 gap-4 max-w-md">
        <button
          type="button"
          onClick={() => handleWorkTypeChange("VIDEO")}
          className={`flex items-center justify-center gap-2.5 rounded-2xl p-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
            workType === "VIDEO"
              ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/25"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
          }`}
        >
          <Video className="h-4 w-4" /> Video Reel
        </button>

        <button
          type="button"
          onClick={() => handleWorkTypeChange("COVER")}
          className={`flex items-center justify-center gap-2.5 rounded-2xl p-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
            workType === "COVER"
              ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/25"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
          }`}
        >
          <ImageIcon className="h-4 w-4" /> Thumbnail / Cover
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left Column - Details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d1117]/95 p-6 md:p-7 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-cyan-400">
              {workType === "VIDEO" ? "Video Reel Details" : "Thumbnail / Cover Details"}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-300 font-semibold">
                  Title
                </label>
                <input
                  required
                  type="text"
                  placeholder={
                    workType === "VIDEO"
                      ? "e.g. Clinical Authority Showcase or Cinematic Reel"
                      : "e.g. Viral Cosmic Astrology Breakdown or YouTube Cover"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-300 font-semibold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0d1117] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 cursor-pointer"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-300 font-semibold">
                  Client / Brand (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Health Clinic or Personal Project"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-widest text-slate-300 font-semibold">
                    Description
                  </label>
                  {workType === "VIDEO" && (
                    <button
                      type="button"
                      onClick={() => setDescription(CATEGORY_DESCRIPTIONS[category] || "")}
                      className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition underline underline-offset-2 cursor-pointer"
                    >
                      Reset to default
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  placeholder="Project scope, style notes, or visual highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media Source */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d1117]/95 p-6 md:p-7 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-cyan-400">
              {workType === "VIDEO" ? "Video Source" : "Image Source"}
            </h2>

            {/* Source Type Toggle */}
            <div className="mb-6 flex overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setSourceType("DRIVE")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  sourceType === "DRIVE"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <LinkIcon className="mx-auto mb-1 h-4 w-4" /> Google Drive Link
              </button>
              <button
                type="button"
                onClick={() => setSourceType("CLOUDINARY")}
                className={`flex-1 border-l border-white/10 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  sourceType === "CLOUDINARY"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <UploadCloud className="mx-auto mb-1 h-4 w-4" /> Upload File
              </button>
            </div>

            {sourceType === "DRIVE" ? (
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-slate-300 font-semibold">
                  Google Drive Link
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/... or sharing link"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Make sure the link sharing setting in Google Drive is set to &quot;Anyone with the link can view&quot;.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center transition hover:border-cyan-400/50 bg-white/[0.02]">
                <input
                  type="file"
                  accept={
                    workType === "VIDEO"
                      ? "video/mp4,video/webm,video/quicktime"
                      : "image/png,image/jpeg,image/webp,image/jpg"
                  }
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer block">
                  <UploadCloud className="mx-auto mb-4 h-10 w-10 text-cyan-400 animate-pulse" />
                  <p className="mb-1 text-sm font-bold text-white">
                    {file ? file.name : `Click to select ${workType === "VIDEO" ? "video" : "image"} file`}
                  </p>
                  <p className="text-xs text-slate-400">
                    {file
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : workType === "VIDEO"
                      ? "MP4, WebM, MOV up to 300MB"
                      : "PNG, JPG, WebP up to 20MB"}
                  </p>
                </label>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-cyan-300">
                  <span>Uploading to Cloudinary...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            disabled={isUploading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-cyan-400 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-cyan-400/25"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading ({uploadProgress}%)...
              </>
            ) : workType === "VIDEO" ? (
              "Save Video to Portfolio"
            ) : (
              "Save Cover to Showcase"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
