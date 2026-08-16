"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2, Power, PowerOff, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchVideos();
    }
  }, [status, router]);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setVideos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !currentStatus }),
    });
    fetchVideos();
  };

  const deleteVideo = async (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      fetchVideos();
    }
  };

  if (status === "loading" || loading) return <div className="p-10 text-slate-400">Loading...</div>;
  if (!session) return null;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-12">
      <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 text-xl font-bold tracking-widest text-white">
          <LayoutDashboard className="h-6 w-6 text-cyan-400" />
          <span>ADMIN DASHBOARD</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/add"
            className="flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" /> Add Work
          </Link>
          <button
            onClick={() => signOut()}
            className="text-xs uppercase tracking-widest text-slate-400 transition hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </header>

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
                  No portfolio works found. Click "Add Work" to begin.
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
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-600">Drive</div>
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
                      onClick={() => togglePublish(video.id, video.published)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs transition ${
                        video.published ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {video.published ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                      {video.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {/* Edit functionality left as a simple mock or future implementable route */}
                      <button className="text-slate-500 hover:text-cyan-400" title="Edit coming soon">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteVideo(video.id)} className="text-slate-500 hover:text-red-400">
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
    </div>
  );
}
