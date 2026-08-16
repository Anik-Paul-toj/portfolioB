"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b10] text-[#f7f8ff]">
      <div className="w-full max-w-sm rounded-[30px] border border-white/10 bg-[#0d1117]/90 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-center font-display text-3xl tracking-wide text-white">Admin Portal</h1>
        <p className="mb-8 text-center text-sm text-slate-400">Sign in to manage portfolio.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-4 rounded-full bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-cyan-400"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
