"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

type SkillsSectionProps = {
  skills: string[];
};

type ToolId = "media" | "audio" | "text" | "stickers" | "effects" | "filters" | "transitions" | "ai" | "adjustment" | "templates";

type ClipKind = "video" | "audio" | "text";

type Clip = {
  id: string;
  title: string;
  kind: ClipKind;
  trackId: string;
  start: number;
  duration: number;
  color: string;
  position: number;
  scale: number;
  rotation: number;
  opacity: number;
  speed: number;
  blur: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
};

type Track = {
  id: string;
  name: string;
  kind: ClipKind;
  muted: boolean;
  locked: boolean;
  hidden: boolean;
  clips: Clip[];
};

const tools: { id: ToolId; label: string; icon: string }[] = [
  { id: "media", label: "Media", icon: "◉" },
  { id: "audio", label: "Audio", icon: "♫" },
  { id: "text", label: "Text", icon: "T" },
  { id: "stickers", label: "Stickers", icon: "✦" },
  { id: "effects", label: "Effects", icon: "✧" },
  { id: "filters", label: "Filters", icon: "◌" },
  { id: "transitions", label: "Transitions", icon: "↔" },
  { id: "ai", label: "AI Tools", icon: "⚡" },
  { id: "adjustment", label: "Adjustment", icon: "⚙" },
  { id: "templates", label: "Templates", icon: "▣" },
];

const initialTracks: Track[] = [
  {
    id: "track-video",
    name: "Video 1",
    kind: "video",
    muted: false,
    locked: false,
    hidden: false,
    clips: [
      {
        id: "clip-1",
        title: "Opening Scene",
        kind: "video",
        trackId: "track-video",
        start: 0.6,
        duration: 4.4,
        color: "#10b981",
        position: 12,
        scale: 100,
        rotation: 0,
        opacity: 100,
        speed: 100,
        blur: 0,
        volume: 100,
        fadeIn: 0.3,
        fadeOut: 0.4,
      },
      {
        id: "clip-2",
        title: "B-Roll",
        kind: "video",
        trackId: "track-video",
        start: 7.4,
        duration: 3.6,
        color: "#f472b6",
        position: 18,
        scale: 96,
        rotation: 3,
        opacity: 92,
        speed: 100,
        blur: 2,
        volume: 100,
        fadeIn: 0.2,
        fadeOut: 0.3,
      },
    ],
  },
  {
    id: "track-audio",
    name: "Voiceover",
    kind: "audio",
    muted: false,
    locked: false,
    hidden: false,
    clips: [
      {
        id: "clip-3",
        title: "Narration",
        kind: "audio",
        trackId: "track-audio",
        start: 0.8,
        duration: 6.2,
        color: "#818cf8",
        position: 0,
        scale: 100,
        rotation: 0,
        opacity: 100,
        speed: 100,
        blur: 0,
        volume: 78,
        fadeIn: 0.2,
        fadeOut: 0.4,
      },
    ],
  },
  {
    id: "track-text",
    name: "Text Overlay",
    kind: "text",
    muted: false,
    locked: false,
    hidden: false,
    clips: [
      {
        id: "clip-4",
        title: "Lower Third",
        kind: "text",
        trackId: "track-text",
        start: 5.2,
        duration: 2.8,
        color: "#f59e0b",
        position: 18,
        scale: 108,
        rotation: 0,
        opacity: 88,
        speed: 100,
        blur: 0,
        volume: 100,
        fadeIn: 0.1,
        fadeOut: 0.2,
      },
    ],
  },
];

const totalDuration = 24;
const snapStep = 0.25;

function formatTime(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number) {
  return Math.round(value / snapStep) * snapStep;
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeTool, setActiveTool] = useState<ToolId>("media");
  const [tracks, setTracks] = useState(initialTracks);
  const [selectedClipId, setSelectedClipId] = useState("clip-1");
  const [playhead, setPlayhead] = useState(3.2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [resolution, setResolution] = useState("4K");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; clipId: string } | null>(null);
  const [history, setHistory] = useState<Track[][]>([]);
  const [redoHistory, setRedoHistory] = useState<Track[][]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    clipId: string;
    mode: "move" | "resize-left" | "resize-right";
    startX: number;
    initialStart: number;
    initialDuration: number;
  } | null>(null);

  const selectedClip = useMemo(() => tracks.flatMap((track) => track.clips).find((clip) => clip.id === selectedClipId) ?? null, [tracks, selectedClipId]);

  useEffect(() => {
    const updateWidth = () => setTimelineWidth(timelineRef.current?.clientWidth ?? 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = window.setInterval(() => {
      setPlayhead((value) => {
        if (value >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        return value + 0.08;
      });
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (!selectedClip) return;
        event.preventDefault();
        setTracks((prev) => prev.map((track) => ({ ...track, clips: track.clips.filter((clip) => clip.id !== selectedClip.id) })));
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (!history.length) return;
        const previous = history[history.length - 1];
        setRedoHistory((prev) => [tracks, ...prev]);
        setHistory((prev) => prev.slice(0, -1));
        setTracks(previous);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        if (!redoHistory.length) return;
        const next = redoHistory[0];
        setHistory((prev) => [...prev, tracks]);
        setRedoHistory((prev) => prev.slice(1));
        setTracks(next);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, redoHistory, selectedClip, tracks]);

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      if (!dragStateRef.current || !timelineRef.current) return;
      const pixelsPerSecond = (timelineWidth / totalDuration) * zoom;
      const deltaSeconds = (event.clientX - dragStateRef.current.startX) / pixelsPerSecond;
      const snappedDelta = snap(deltaSeconds);

      setTracks((prev) =>
        prev.map((track) => ({
          ...track,
          clips: track.clips.map((clip) => {
            if (clip.id !== dragStateRef.current?.clipId) return clip;
            if (dragStateRef.current?.mode === "move") {
              const nextStart = clamp(dragStateRef.current.initialStart + snappedDelta, 0, totalDuration - clip.duration);
              return { ...clip, start: nextStart };
            }
            if (dragStateRef.current?.mode === "resize-right") {
              const nextDuration = clamp(dragStateRef.current.initialDuration + snappedDelta, 0.8, totalDuration - clip.start);
              return { ...clip, duration: nextDuration };
            }
            const nextStart = clamp(dragStateRef.current.initialStart + snappedDelta, 0, totalDuration - dragStateRef.current.initialDuration);
            const nextDuration = clamp(dragStateRef.current.initialDuration - snappedDelta, 0.8, totalDuration);
            return { ...clip, start: nextStart, duration: nextDuration };
          }),
        }))
      );
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, [timelineWidth, zoom]);

  const handleClipPointerDown = (
    event: ReactMouseEvent<HTMLElement>,
    clip: Clip,
    mode: "move" | "resize-left" | "resize-right" = "move"
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedClipId(clip.id);
    dragStateRef.current = {
      clipId: clip.id,
      mode,
      startX: event.clientX,
      initialStart: clip.start,
      initialDuration: clip.duration,
    };
  };

  const updateClip = (clipId: string, updater: (clip: Clip) => Clip) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.map((clip) => (clip.id === clipId ? updater(clip) : clip)),
      }))
    );
  };

  const moveClipTrack = (clipId: string, direction: -1 | 1) => {
    setTracks((prev) => {
      const nextTracks = prev.map((track) => ({ ...track, clips: track.clips.filter((clip) => clip.id !== clipId) }));
      const clip = prev.flatMap((track) => track.clips).find((item) => item.id === clipId);
      if (!clip) return prev;
      const currentIndex = prev.findIndex((track) => track.clips.some((item) => item.id === clipId));
      const targetIndex = clamp(currentIndex + direction, 0, prev.length - 1);
      return nextTracks.map((track, index) => {
        if (index !== targetIndex) return track;
        return { ...track, clips: [...track.clips, { ...clip, trackId: track.id }] };
      });
    });
  };

  const duplicateClip = (clipId: string) => {
    const clip = tracks.flatMap((track) => track.clips).find((item) => item.id === clipId);
    if (!clip) return;
    const duplicate: Clip = { ...clip, id: `${clip.id}-copy`, title: `${clip.title} copy`, start: clamp(clip.start + 0.8, 0, totalDuration - clip.duration) };
    setTracks((prev) => prev.map((track) => (track.id === clip.trackId ? { ...track, clips: [...track.clips, duplicate] } : track)));
  };

  return (
    <section id="skills" className="scroll-mt-28 py-8 md:py-12">
      <div className="section-shell">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl" data-reveal>
            <span className="section-label">CapCut Pro workspace</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.96] tracking-[-0.04em] text-[#f7f8ff]">
              A desktop editing experience that feels instantly familiar to a video editor.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">
              Multi-track editing, live preview, snapping, trims, properties, and keyboard-friendly interaction are all built into a premium dark interface.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 8).map((skill) => (
              <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-[34px] border border-white/10 bg-[#06070b]/95 shadow-[0_35px_140px_rgba(2,6,23,0.72)]">
          <div className="flex min-w-[1080px] flex-row">
            <aside className="w-[220px] border-r border-white/10 p-3">
              <div className="mb-3 text-[10px] uppercase tracking-[0.36em] text-slate-500">Tools</div>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
                      activeTool === tool.id
                        ? "border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 to-transparent text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-1 text-sm">{tool.icon}</span>
                      {tool.label}
                    </span>
                    <span className="text-xs text-slate-500">›</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 p-3 text-sm text-slate-400">
                <div className="font-semibold text-slate-100">{tools.find((tool) => tool.id === activeTool)?.label ?? "Media"}</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {activeTool === "media" && "Import footage, images, and assets into the active project."}
                  {activeTool === "audio" && "Adjust voice, music, and sound design in a dedicated audio lane."}
                  {activeTool === "text" && "Drop polished titles, captions, and lower thirds on-top of the edit."}
                  {activeTool === "stickers" && "Layer stickers, emojis, and motion graphics onto the frame."}
                  {activeTool === "effects" && "Add motion and effect presets with instant layering."}
                  {activeTool === "filters" && "Blend color and cinematic LUTs into the full timeline."}
                  {activeTool === "transitions" && "Cross dissolve, wipe, and animated transitions between clips."}
                  {activeTool === "ai" && "Generate captions or smart edits that accelerate your workflow."}
                  {activeTool === "adjustment" && "Fine tune color correction, curves, and blend settings."}
                  {activeTool === "templates" && "Start from polished templates tailored for content editors."}
                </p>
              </div>
            </aside>

            <div className="flex-1 p-3">
              <div className="rounded-[28px] border border-white/10 bg-[#080b11] p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">Preview</span>
                    <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-[11px] text-cyan-200">{resolution} • 24fps</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select value={resolution} onChange={(event) => setResolution(event.target.value)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                      <option value="4K">4K</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                    </select>
                    <button type="button" className="rounded-full bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[24px] border border-white/10 bg-[#0b1017] p-3">
                    <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                      <span>Player</span>
                      <span>{formatTime(playhead)} / {formatTime(totalDuration)}</span>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.28),_transparent_45%),linear-gradient(135deg,_#0b0f16,_#111827)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,_rgba(244,114,182,0.28),_transparent_28%),radial-gradient(circle_at_18%_82%,_rgba(96,165,250,0.22),_transparent_36%)]" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                        {selectedClip?.title ?? "No clip selected"}
                      </div>

                      <div className="absolute inset-x-4 bottom-4 rounded-[18px] border border-white/10 bg-black/45 p-3 backdrop-blur">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setPlayhead((value) => clamp(value - 0.4, 0, totalDuration))} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-2 text-sm text-slate-200">
                            ⏮
                          </button>
                          <button type="button" onClick={() => setPlayhead((value) => clamp(value - 0.2, 0, totalDuration))} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-2 text-sm text-slate-200">
                            ◀
                          </button>
                          <button type="button" onClick={() => setIsPlaying((value) => !value)} className="rounded-full bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">
                            {isPlaying ? "Pause" : "Play"}
                          </button>
                          <button type="button" onClick={() => setPlayhead((value) => clamp(value + 0.2, 0, totalDuration))} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-2 text-sm text-slate-200">
                            ▶
                          </button>
                          <button type="button" onClick={() => setPlayhead((value) => clamp(value + 0.4, 0, totalDuration))} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-2 text-sm text-slate-200">
                            ⏭
                          </button>
                        </div>
                        <input type="range" min={0} max={totalDuration} step={0.1} value={playhead} onChange={(event) => setPlayhead(Number(event.target.value))} className="mt-3 h-1 w-full cursor-pointer accent-cyan-400" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-[#0b1017] p-3">
                    <div className="text-sm text-slate-400">Transform inspector</div>
                    <div className="mt-4 space-y-3">
                      {[
                        { label: "Position", value: selectedClip?.position ?? 0, unit: "%", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, position: value })) },
                        { label: "Scale", value: selectedClip?.scale ?? 100, unit: "%", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, scale: value })) },
                        { label: "Rotation", value: selectedClip?.rotation ?? 0, unit: "°", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, rotation: value })) },
                        { label: "Opacity", value: selectedClip?.opacity ?? 100, unit: "%", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, opacity: value })) },
                        { label: "Speed", value: selectedClip?.speed ?? 100, unit: "%", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, speed: value })) },
                        { label: "Blur", value: selectedClip?.blur ?? 0, unit: "px", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, blur: value })) },
                        { label: "Volume", value: selectedClip?.volume ?? 100, unit: "%", onChange: (value: number) => selectedClip && updateClip(selectedClip.id, (clip) => ({ ...clip, volume: value })) },
                      ].map((item) => (
                        <label key={item.label} className="block rounded-[16px] border border-white/10 bg-white/5 p-3">
                          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                            <span>{item.label}</span>
                            <span className="text-cyan-200">{item.value}{item.unit}</span>
                          </div>
                          <input type="range" min={0} max={item.label === "Rotation" ? 180 : 100} value={item.value} onChange={(event) => item.onChange(Number(event.target.value))} className="h-1 w-full cursor-pointer accent-cyan-400" />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-[28px] border border-white/10 bg-[#080b11] p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="rounded-full bg-white/10 px-3 py-1">Timeline</span>
                    <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-200">Snap • Zoom • Multi-track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setZoom((value) => clamp(value - 0.2, 0.8, 1.8))} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">Zoom out</button>
                    <span className="min-w-11 text-center text-sm text-slate-300">{zoom.toFixed(1)}x</span>
                    <button type="button" onClick={() => setZoom((value) => clamp(value + 0.2, 0.8, 1.8))} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">Zoom in</button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#090d13]">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                    <span>Multitrack edit</span>
                    <span>{tracks.length} layers</span>
                  </div>

                  <div className="px-4 py-3">
                    <div className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                      <div className="w-24">Track</div>
                      <div className="flex-1 rounded-[10px] border border-white/10 bg-black/20 px-2 py-2">
                        <div className="flex">
                          {Array.from({ length: 13 }, (_, index) => (
                            <div key={index} className="flex-1 border-l border-white/10 first:border-l-0" />
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span key={index}>{formatTime((index * totalDuration * 60) / 4)}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {tracks.map((track) => (
                      <div key={track.id} className="mb-3 rounded-[16px] border border-white/10 bg-[#10151d] p-2">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${track.kind === "video" ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-200" : track.kind === "audio" ? "border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-200" : "border-amber-400/30 bg-amber-500/15 text-amber-200"}`}>
                              {track.kind}
                            </span>
                            <span className="text-sm font-medium text-slate-100">{track.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setTracks((prev) => prev.map((item) => item.id === track.id ? { ...item, locked: !item.locked } : item))} className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${track.locked ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-slate-400"}`}>Lock</button>
                            <button type="button" onClick={() => setTracks((prev) => prev.map((item) => item.id === track.id ? { ...item, muted: !item.muted } : item))} className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${track.muted ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-slate-400"}`}>Mute</button>
                            <button type="button" onClick={() => setTracks((prev) => prev.map((item) => item.id === track.id ? { ...item, hidden: !item.hidden } : item))} className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${track.hidden ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-slate-400"}`}>Hide</button>
                          </div>
                        </div>

                        <div ref={timelineRef} className="relative h-16 overflow-hidden rounded-[12px] border border-white/10 bg-[#070b12]">
                          {Array.from({ length: 13 }, (_, index) => (
                            <div key={index} className="absolute inset-y-0 w-px border-l border-white/10" style={{ left: `${(index + 1) * 7.69}%` }} />
                          ))}
                          {track.clips.map((clip) => (
                            <button
                              key={clip.id}
                              type="button"
                              onContextMenu={(event) => {
                                event.preventDefault();
                                setContextMenu({ x: event.clientX, y: event.clientY, clipId: clip.id });
                                setSelectedClipId(clip.id);
                              }}
                              onMouseDown={(event) => handleClipPointerDown(event, clip)}
                              className={`absolute top-2 h-12 rounded-[12px] border px-2 text-left text-xs font-medium text-white shadow-lg transition ${selectedClipId === clip.id ? "border-cyan-400 ring-2 ring-cyan-400/30" : "border-white/10 hover:border-cyan-400/50"}`}
                              style={{
                                left: `${(clip.start / totalDuration) * 100}%`,
                                width: `${(clip.duration / totalDuration) * 100}%`,
                                background: `linear-gradient(135deg, ${clip.color}, rgba(10, 14, 24, 0.96))`,
                              }}
                            >
                              <div className="flex h-full items-center justify-between">
                                <span className="truncate pr-2">{clip.title}</span>
                                <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px]">{clip.kind}</span>
                              </div>
                              <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-white/70" />
                              <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white/70" />
                              <div onMouseDown={(event) => handleClipPointerDown(event, clip, "resize-left")} className="absolute left-0 top-0 h-full w-2 cursor-w-resize rounded-l-[12px] bg-white/10" />
                              <div onMouseDown={(event) => handleClipPointerDown(event, clip, "resize-right")} className="absolute right-0 top-0 h-full w-2 cursor-e-resize rounded-r-[12px] bg-white/10" />
                            </button>
                          ))}
                          <div className="absolute inset-y-0" style={{ left: `${(playhead / totalDuration) * 100}%` }}>
                            <div className="h-full w-[2px] bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.7)]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && selectedClip && (
        <div className="fixed z-50 rounded-2xl border border-white/10 bg-[#0d1117]/95 p-2 shadow-2xl" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10" onClick={() => { duplicateClip(contextMenu.clipId); setContextMenu(null); }}>
            Duplicate clip
          </button>
          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10" onClick={() => { moveClipTrack(contextMenu.clipId, -1); setContextMenu(null); }}>
            Move up layer
          </button>
          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10" onClick={() => { moveClipTrack(contextMenu.clipId, 1); setContextMenu(null); }}>
            Move down layer
          </button>
          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10" onClick={() => { setTracks((prev) => prev.map((track) => ({ ...track, clips: track.clips.filter((clip) => clip.id !== contextMenu.clipId) }))); setContextMenu(null); }}>
            Delete clip
          </button>
        </div>
      )}
    </section>
  );
}
