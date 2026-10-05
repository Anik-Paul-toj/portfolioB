"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Power, PowerOff, LayoutDashboard, Video, Image as ImageIcon } from "lucide-react";
import { formatDriveImageUrl } from "@/lib/drive";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"VIDEOS" | "COVERS">("VIDEOS");
  const [videos, setVideos] = useState<any[]>([]);
  const [covers, setCovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resVideos, resCovers] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/covers"),
      ]);
      const dataVideos = await resVideos.json();
      const dataCovers = await resCovers.json();
      setVideos(Array.isArray(dataVideos) ? dataVideos : []);
      setCovers(Array.isArray(dataCovers) ? dataCovers : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishVideo = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !currentStatus }),
    });
    fetchData();
  };

  const deleteVideo = async (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const togglePublishCover = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/covers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !currentStatus }),
    });
    fetchData();
  };

  const deleteCover = async (id: string) => {
    if (confirm("Are you sure you want to delete this thumbnail / cover image?")) {
      await fetch(`/api/covers/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  if (status === "loading" || loading) return <div className="p-10 text-slate-400">Loading dashboard...</div>;
  if (!session) return null;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 text-xl font-bold tracking-widest text-white">
          <LayoutDashboard className="h-6 w-6 text-cyan-400" />
          <span>ADMIN DASHBOARD</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/add"
            className="flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="h-4 w-4" /> Add New Work
          </Link>
          <button
            onClick={() => signOut()}
            className="text-xs uppercase tracking-widest text-slate-400 transition hover:text-white cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => setActiveTab("VIDEOS")}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "VIDEOS"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Video className="h-4 w-4" /> Video Reels ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab("COVERS")}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "COVERS"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <ImageIcon className="h-4 w-4" /> Thumbnails & Covers ({covers.length})
        </button>
      </div>

      {/* Video Reels Table */}
      {activeTab === "VIDEOS" && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Video</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No video reels found. Click &quot;Add New Work&quot; to begin.
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="transition hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="h-16 w-24 overflow-hidden rounded-lg bg-black">
                        {video.sourceType === "CLOUDINARY" && video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt="thumbnail" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 font-medium">Drive Video</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{video.title}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{video.category}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{video.sourceType}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublishVideo(video.id, video.published)}
                        className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs transition cursor-pointer ${
                          video.published ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        {video.published ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                        {video.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => deleteVideo(video.id)} className="text-slate-500 hover:text-red-400 cursor-pointer" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Thumbnails & Covers Table */}
      {activeTab === "COVERS" && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Preview</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {covers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No thumbnails or cover images found. Click &quot;Add New Work&quot; to upload or add Drive links.
                  </td>
                </tr>
              ) : (
                covers.map((cover) => {
                  const displayImg = formatDriveImageUrl(cover.imageUrl);
                  return (
                    <tr key={cover.id} className="transition hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="h-16 w-24 overflow-hidden rounded-lg bg-black/40 border border-white/10">
                          {displayImg ? (
                            <img src={displayImg} alt="cover" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No Image</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">{cover.title}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-cyan-500/10 text-cyan-300 px-3 py-1 text-xs font-medium">
                          {cover.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{cover.sourceType}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublishCover(cover.id, cover.published)}
                          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs transition cursor-pointer ${
                            cover.published ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          {cover.published ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                          {cover.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => deleteCover(cover.id)} className="text-slate-500 hover:text-red-400 cursor-pointer" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
