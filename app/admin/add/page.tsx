"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Link as LinkIcon, Loader2 } from "lucide-react";

export default function AddVideoPage() {
  const { status } = useSession({ required: true, onUnauthenticated() { router.push("/admin/login") } });
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Music Reel");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  const [sourceType, setSourceType] = useState<"CLOUDINARY" | "DRIVE">("CLOUDINARY");
  const [driveUrl, setDriveUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      let finalVideoUrl = "";
      let cloudinaryPublicId = null;
      let thumbnailUrl = null;
      let duration = null;
      let fileSize = null;

      if (sourceType === "CLOUDINARY") {
        if (!file) throw new Error("Please select a video file");
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "Failed to upload video to Cloudinary");
        }

        const uploadData = await uploadRes.json();
        finalVideoUrl = uploadData.secure_url;
        cloudinaryPublicId = uploadData.public_id;
        // Generate poster/thumbnail URL (jpg instead of mp4)
        thumbnailUrl = uploadData.secure_url.replace(/\.mp4|\.webm|\.mov/g, ".jpg");
        duration = uploadData.duration;
        fileSize = uploadData.bytes;
      } else {
        if (!driveUrl) throw new Error("Please provide a Google Drive URL");
        finalVideoUrl = driveUrl;
      }

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, category, description, client, year, sourceType,
          videoUrl: finalVideoUrl, cloudinaryPublicId, thumbnailUrl, duration, fileSize,
          published: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to save portfolio item");
      
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsUploading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-12">
      <Link href="/admin" className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400 hover:text-white transition">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <h1 className="mb-10 font-display text-4xl text-white">Add Portfolio Work</h1>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left Column - Details */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-300">Video Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50">
                    <option>Music Reel</option>
                    <option>Brand Film</option>
                    <option>Beauty Spot</option>
                    <option>Event Opener</option>
                    <option>Fashion Campaign</option>
                    <option>Trailer Edit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Year</label>
                  <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Client / Brand (Optional)</label>
                <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50" />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Upload */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-300">Video Source</h2>
            
            <div className="mb-6 flex overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <button type="button" onClick={() => setSourceType("CLOUDINARY")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${sourceType === "CLOUDINARY" ? "bg-cyan-500 text-black" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <UploadCloud className="mx-auto mb-1 h-4 w-4" /> Cloudinary
              </button>
              <button type="button" onClick={() => setSourceType("DRIVE")} className={`flex-1 border-l border-white/10 py-2 text-xs font-bold uppercase tracking-wider transition ${sourceType === "DRIVE" ? "bg-cyan-500 text-black" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <LinkIcon className="mx-auto mb-1 h-4 w-4" /> Google Drive
              </button>
            </div>

            {sourceType === "CLOUDINARY" ? (
              <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center transition hover:border-cyan-400/50">
                <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="video-upload" />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <UploadCloud className="mx-auto mb-4 h-8 w-8 text-slate-400" />
                  <p className="mb-1 text-sm font-bold text-white">{file ? file.name : "Choose a video file"}</p>
                  <p className="text-xs text-slate-500">MP4, WebM, MOV up to 100MB</p>
                </label>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Google Drive URL</label>
                <input type="url" placeholder="https://drive.google.com/..." value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50" />
              </div>
            )}
          </div>

          {error && <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">{error}</div>}

          <button disabled={isUploading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-cyan-400 disabled:opacity-50">
            {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : "Save to Portfolio"}
          </button>
        </div>
      </form>
    </div>
  );
}
