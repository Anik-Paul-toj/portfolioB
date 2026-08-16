"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type CSSProperties } from "react";

// Web Audio API Synthesizer for retro video editor feedback sound
function playSynth(type: "swoosh" | "blip" | "melody") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "blip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "swoosh") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "melody") {
      const notes = [261.63, 329.63, 392.00]; // C4, E4, G4
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        g.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.3);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + idx * 0.12);
        o.stop(ctx.currentTime + idx * 0.12 + 0.35);
      });
    }
  } catch (e) {
    console.warn("AudioContext block:", e);
  }
}

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
  textContent?: string;
  videoUrl?: string;
  audioUrl?: string;
  stickerEmoji?: string;
  effectName?: string;
  filterName?: string;
  positionX?: number;
  positionY?: number;
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

const mediaLibrary = [
  { id: "lib-video-1", title: "Forest River", kind: "video" as const, color: "#10b981", url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" },
  { id: "lib-video-2", title: "Space Journey", kind: "video" as const, color: "#f472b6", url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4" },
  { id: "lib-video-3", title: "Ocean Cliff", kind: "video" as const, color: "#06b6d4", url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-43063-large.mp4" },
  { id: "lib-video-4", title: "City Traffic", kind: "video" as const, color: "#a855f7", url: "https://assets.mixkit.co/videos/preview/mixkit-urban-city-traffic-at-night-42287-large.mp4" }
];

const audioLibrary = [
  { id: "lib-audio-1", title: "Lofi Sunset", kind: "audio" as const, color: "#818cf8", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "lib-audio-2", title: "Synthwave", kind: "audio" as const, color: "#c084fc", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "lib-audio-3", title: "Ambient Breeze", kind: "audio" as const, color: "#60a5fa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

const textLibrary = [
  { id: "lib-text-1", title: "Cyberpunk Glow", kind: "text" as const, color: "#f59e0b", textContent: "CYBERPUNK", effectName: "Cyberpunk" },
  { id: "lib-text-2", title: "Minimalist Title", kind: "text" as const, color: "#d97706", textContent: "MINIMAL DESIGN", effectName: "Minimalist" },
  { id: "lib-text-3", title: "Lower Third", kind: "text" as const, color: "#b45309", textContent: "Creative Editor", effectName: "Lower Third" }
];

const stickerLibrary = [
  { id: "lib-sticker-1", title: "Fire Emoji", kind: "text" as const, color: "#ef4444", textContent: "🔥", stickerEmoji: "🔥" },
  { id: "lib-sticker-2", title: "Sparkle Loop", kind: "text" as const, color: "#facc15", textContent: "⭐", stickerEmoji: "⭐" },
  { id: "lib-sticker-3", title: "Heart Pulsing", kind: "text" as const, color: "#ec4899", textContent: "❤️", stickerEmoji: "❤️" },
  { id: "lib-sticker-4", title: "Record Badge", kind: "text" as const, color: "#3b82f6", textContent: "🎥", stickerEmoji: "🎥" }
];

const effectLibrary = [
  { id: "lib-effect-1", title: "VHS Glitch", effectName: "VHS Glitch" },
  { id: "lib-effect-2", title: "Retro Grain", effectName: "Retro Grain" },
  { id: "lib-effect-3", title: "Cinema Scope", effectName: "Cinema Scope" }
];

const filterLibrary = [
  { id: "lib-filter-1", title: "Warm Sunset", filterName: "Warm Sunset" },
  { id: "lib-filter-2", title: "Cyber Cyan", filterName: "Cyber Cyan" },
  { id: "lib-filter-3", title: "Noir Film", filterName: "Noir Film" },
  { id: "lib-filter-4", title: "Vintage Faded", filterName: "Vintage Faded" }
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
        position: 0,
        positionX: 0,
        positionY: 0,
        scale: 100,
        rotation: 0,
        opacity: 100,
        speed: 100,
        blur: 0,
        volume: 100,
        fadeIn: 0.3,
        fadeOut: 0.4,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
      },
      {
        id: "clip-2",
        title: "B-Roll",
        kind: "video",
        trackId: "track-video",
        start: 7.4,
        duration: 3.6,
        color: "#f472b6",
        position: 0,
        positionX: 0,
        positionY: 0,
        scale: 100,
        rotation: 0,
        opacity: 92,
        speed: 100,
        blur: 0,
        volume: 100,
        fadeIn: 0.2,
        fadeOut: 0.3,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
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
        positionX: 0,
        positionY: 0,
        scale: 100,
        rotation: 0,
        opacity: 100,
        speed: 100,
        blur: 0,
        volume: 78,
        fadeIn: 0.2,
        fadeOut: 0.4,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
        position: 0,
        positionX: 0,
        positionY: 45,
        scale: 100,
        rotation: 0,
        opacity: 90,
        speed: 100,
        blur: 0,
        volume: 100,
        fadeIn: 0.1,
        fadeOut: 0.2,
        textContent: "CapCut Pro Workspace",
        effectName: "Lower Third",
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

function getFilterCSS(filterName?: string) {
  if (!filterName) return "";
  switch (filterName) {
    case "Warm Sunset":
      return "sepia(0.3) saturate(1.4) hue-rotate(-10deg) contrast(1.1)";
    case "Cyber Cyan":
      return "hue-rotate(140deg) saturate(1.8) contrast(1.2)";
    case "Noir Film":
      return "grayscale(1) contrast(1.6) brightness(0.9)";
    case "Vintage Faded":
      return "sepia(0.15) contrast(0.85) brightness(1.05) saturate(0.8)";
    default:
      return "";
  }
}

// Sub-component: Handles dynamic syncing of `<video>` elements in player
interface ActiveVideoElementProps {
  clip: Clip;
  playhead: number;
  isPlaying: boolean;
  trackMuted: boolean;
  isSelected: boolean;
  onPointerDown: (e: React.MouseEvent) => void;
}

function ActiveVideoElement({
  clip,
  playhead,
  isPlaying,
  trackMuted,
  isSelected,
  onPointerDown,
}: ActiveVideoElementProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const localTime = playhead - clip.start;
    const progress = localTime * (clip.speed / 100);

    // Sync currentTime
    if (Math.abs(video.currentTime - progress) > 0.2) {
      video.currentTime = clamp(progress, 0, clip.duration);
    }

    // Sync volume & speed
    video.volume = trackMuted ? 0 : clamp((clip.volume / 100), 0, 1);
    video.playbackRate = clamp(clip.speed / 100, 0.1, 8);

    // Sync play/pause
    if (isPlaying && playhead >= clip.start && playhead <= clip.start + clip.duration) {
      if (video.paused) {
        video.play().catch((e) => console.log("Video playback blocked:", e));
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [playhead, isPlaying, clip, trackMuted]);

  if (hasError) {
    // Elegant fallback design if stock URL doesn't load or if user is offline
    return (
      <div
        onMouseDown={onPointerDown}
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center cursor-move select-none ${
          isSelected ? "border-2 border-dashed border-cyan-400" : ""
        }`}
        style={{
          transform: `translate(${clip.positionX ?? 0}px, ${clip.positionY ?? 0}px) scale(${(clip.scale ?? 100) / 100}) rotate(${clip.rotation ?? 0}deg)`,
          opacity: (clip.opacity ?? 100) / 100,
          filter: `blur(${clip.blur ?? 0}px) ${clip.filterName ? getFilterCSS(clip.filterName) : ""}`,
          background: `linear-gradient(135deg, ${clip.color}, #070b10)`,
          width: "100%",
          height: "100%",
        }}
      >
        <span className="text-sm font-bold uppercase tracking-wider text-white/90">{clip.title}</span>
        <span className="text-[10px] text-white/40 mt-1">Live Graphic • {(clip.duration).toFixed(1)}s</span>
        <div className="mt-2.5 flex gap-1 justify-center items-end h-5">
          <span className="w-1 bg-white/40 animate-[pulse_1s_infinite_100ms] h-3" />
          <span className="w-1 bg-white/60 animate-[pulse_1s_infinite_300ms] h-4" />
          <span className="w-1 bg-white/40 animate-[pulse_1s_infinite_500ms] h-2.5" />
        </div>
        {isSelected && (
          <>
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full ${isSelected ? "border-2 border-dashed border-cyan-400" : ""}`}
      style={{
        transform: `translate(${clip.positionX ?? 0}px, ${clip.positionY ?? 0}px) scale(${(clip.scale ?? 100) / 100}) rotate(${clip.rotation ?? 0}deg)`,
        opacity: (clip.opacity ?? 100) / 100,
        filter: `blur(${clip.blur ?? 0}px) ${clip.filterName ? getFilterCSS(clip.filterName) : ""}`,
      }}
      onMouseDown={onPointerDown}
    >
      <video
        ref={videoRef}
        src={clip.videoUrl}
        className="w-full h-full object-cover pointer-events-none"
        playsInline
        webkit-playsinline="true"
        muted={trackMuted || clip.volume === 0}
        loop
        onError={() => setHasError(true)}
      />
      {isSelected && (
        <>
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-500 rounded-full" />
        </>
      )}
    </div>
  );
}

// Sub-component: Handles dynamic audio elements syncing
function ActiveAudioElement({ clip, playhead, isPlaying, trackMuted }: { clip: Clip; playhead: number; isPlaying: boolean; trackMuted: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const localTime = playhead - clip.start;
    const progress = localTime * (clip.speed / 100);

    // Sync currentTime
    if (Math.abs(audio.currentTime - progress) > 0.2) {
      audio.currentTime = clamp(progress, 0, clip.duration);
    }

    // Sync volume & speed
    audio.volume = trackMuted ? 0 : clamp((clip.volume / 100), 0, 1);
    audio.playbackRate = clamp(clip.speed / 100, 0.1, 8);

    // Sync play/pause
    if (isPlaying && playhead >= clip.start && playhead <= clip.start + clip.duration) {
      if (audio.paused) {
        audio.play().catch((e) => console.log("Audio playback blocked:", e));
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [playhead, isPlaying, clip, trackMuted]);

  return (
    <audio
      ref={audioRef}
      src={clip.audioUrl}
      preload="auto"
      loop
      style={{ display: "none" }}
    />
  );
}

// Sub-component: Handles dynamic overlays for texts/stickers in player
interface ActiveTextElementProps {
  clip: Clip;
  isSelected: boolean;
  onPointerDown: (e: React.MouseEvent) => void;
}

function ActiveTextElement({ clip, isSelected, onPointerDown }: ActiveTextElementProps) {
  const textStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) translate(${clip.positionX ?? 0}px, ${clip.positionY ?? 0}px) scale(${(clip.scale ?? 100) / 100}) rotate(${clip.rotation ?? 0}deg)`,
      opacity: (clip.opacity ?? 100) / 100,
      filter: `blur(${clip.blur ?? 0}px)`,
      cursor: "move",
      pointerEvents: "auto",
      userSelect: "none",
      zIndex: 20,
      whiteSpace: "nowrap",
    };

    if (clip.stickerEmoji) {
      return {
        ...baseStyle,
        fontSize: "56px",
        animation: clip.stickerEmoji === "🔥" ? "pulse-ring 1.5s infinite" : clip.stickerEmoji === "⭐" ? "spin-slow 4s linear infinite" : undefined,
      } as React.CSSProperties;
    }

    switch (clip.effectName) {
      case "Cyberpunk":
        return {
          ...baseStyle,
          fontFamily: "monospace",
          color: "#f43f5e",
          textShadow: "0 0 10px #f43f5e, 0 0 20px #a855f7",
          fontWeight: "bold",
          fontSize: "32px",
          letterSpacing: "3px",
        } as React.CSSProperties;
      case "Minimalist":
        return {
          ...baseStyle,
          color: "#ffffff",
          fontFamily: "sans-serif",
          fontWeight: "300",
          fontSize: "24px",
          letterSpacing: "10px",
          textTransform: "uppercase",
        } as React.CSSProperties;
      case "Lower Third":
        return {
          position: "absolute",
          left: "12%",
          bottom: "15%",
          transform: `translate(${clip.positionX ?? 0}px, ${clip.positionY ?? 0}px) scale(${(clip.scale ?? 100) / 100}) rotate(${clip.rotation ?? 0}deg)`,
          opacity: (clip.opacity ?? 100) / 100,
          filter: `blur(${clip.blur ?? 0}px)`,
          cursor: "move",
          pointerEvents: "auto",
          userSelect: "none",
          zIndex: 20,
          background: "rgba(0,0,0,0.8)",
          borderLeft: "4px solid #06b6d4",
          padding: "6px 12px",
          color: "#06b6d4",
          borderRadius: "0 6px 6px 0",
          fontSize: "14px",
          fontWeight: "600",
        } as React.CSSProperties;
      default:
        return {
          ...baseStyle,
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: "700",
          textShadow: "0 2px 8px rgba(0,0,0,0.85)",
        } as React.CSSProperties;
    }
  }, [clip]);

  return (
    <div
      onMouseDown={onPointerDown}
      style={textStyle}
      className={isSelected ? "outline-2 outline-dashed outline-cyan-400 outline-offset-4" : ""}
    >
      {clip.textContent || clip.title}
      {isSelected && (
        <>
          <div className="absolute -top-1.5 -left-1.5 w-2 h-2 bg-white border border-cyan-500 rounded-full pointer-events-none" />
          <div className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-white border border-cyan-500 rounded-full pointer-events-none" />
          <div className="absolute -bottom-1.5 -left-1.5 w-2 h-2 bg-white border border-cyan-500 rounded-full pointer-events-none" />
          <div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 bg-white border border-cyan-500 rounded-full pointer-events-none" />
        </>
      )}
    </div>
  );
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeTool, setActiveTool] = useState<ToolId>("media");
  const [tracks, setTracks] = useState(initialTracks);
  const [selectedClipId, setSelectedClipId] = useState("clip-1");
  const [playhead, setPlayhead] = useState(3.2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1.1);
  const [resolution, setResolution] = useState("1080p (16:9)");
  const [isSnapping, setIsSnapping] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; clipId: string } | null>(null);
  const [history, setHistory] = useState<Track[][]>([]);
  const [redoHistory, setRedoHistory] = useState<Track[][]>([]);
  
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement | null>(null);

  const selectedClip = useMemo(() => tracks.flatMap((track) => track.clips).find((clip) => clip.id === selectedClipId) ?? null, [tracks, selectedClipId]);

  // Smooth playhead animation using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let frameId: number;

    const update = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setPlayhead((value) => {
        if (value >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        return Math.min(totalDuration, value + delta);
      });
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  // Keyboard Shortcuts (Delete, Undo, Redo)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger commands if editing input fields
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (event.key === "Delete" || event.key === "Backspace") {
        if (!selectedClip) return;
        event.preventDefault();
        setHistory((h) => [...h, tracks].slice(-20));
        setRedoHistory([]);
        setTracks((prev) => prev.map((track) => ({ ...track, clips: track.clips.filter((clip) => clip.id !== selectedClip.id) })));
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (!history.length) return;
        const previous = history[history.length - 1];
        setRedoHistory((prev) => [tracks, ...prev]);
        setHistory((prev) => prev.slice(0, -1));
        setTracks(previous);
        playSynth("blip");
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        if (!redoHistory.length) return;
        const next = redoHistory[0];
        setHistory((prev) => [...prev, tracks]);
        setRedoHistory((prev) => prev.slice(1));
        setTracks(next);
        playSynth("blip");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, redoHistory, selectedClip, tracks]);

  // Dragging clip in the preview window player (changes X/Y translation)
  const handlePlayerClipPointerDown = (event: React.MouseEvent, clipId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedClipId(clipId);

    const clip = tracks.flatMap((t) => t.clips).find((c) => c.id === clipId);
    if (!clip) return;

    // Verify track is not locked
    const track = tracks.find((t) => t.id === clip.trackId);
    if (track?.locked) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const initialX = clip.positionX ?? 0;
    const initialY = clip.positionY ?? 0;

    // Push history before edit
    setHistory((h) => [...h, tracks].slice(-20));
    setRedoHistory([]);

    const handlePointerMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      setTracks((prev) =>
        prev.map((t) => ({
          ...t,
          clips: t.clips.map((c) => {
            if (c.id !== clipId) return c;
            return {
              ...c,
              positionX: initialX + deltaX,
              positionY: initialY + deltaY,
            };
          }),
        }))
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  };

  // Dragging and resizing clip in timeline track
  const handleClipPointerDown = (
    event: ReactMouseEvent<HTMLElement>,
    clip: Clip,
    mode: "move" | "resize-left" | "resize-right" = "move"
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Ignore edits on locked tracks
    const track = tracks.find((t) => t.id === clip.trackId);
    if (track?.locked) return;

    setSelectedClipId(clip.id);

    const startX = event.clientX;
    const initialStart = clip.start;
    const initialDuration = clip.duration;
    const currentTracks = [...tracks];

    // Push state to undo history
    setHistory((h) => [...h, currentTracks].slice(-20));
    setRedoHistory([]);

    const handlePointerMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;
      const currentWidth = timelineRef.current.clientWidth;
      const pixelsPerSecond = currentWidth / totalDuration;
      const deltaSeconds = (moveEvent.clientX - startX) / pixelsPerSecond;
      const snappedDelta = isSnapping ? snap(deltaSeconds) : deltaSeconds;

      setTracks((prev) =>
        prev.map((t) => ({
          ...t,
          clips: t.clips.map((c) => {
            if (c.id !== clip.id) return c;
            if (mode === "move") {
              const nextStart = clamp(initialStart + snappedDelta, 0, totalDuration - c.duration);
              return { ...c, start: isSnapping ? snap(nextStart) : Number(nextStart.toFixed(2)) };
            }
            if (mode === "resize-right") {
              const nextDuration = clamp(initialDuration + snappedDelta, 0.5, totalDuration - c.start);
              return { ...c, duration: isSnapping ? snap(nextDuration) : Number(nextDuration.toFixed(2)) };
            }
            // resize-left
            const targetStart = initialStart + snappedDelta;
            const nextStart = clamp(targetStart, 0, initialStart + initialDuration - 0.5);
            const nextDuration = initialDuration - (nextStart - initialStart);
            return {
              ...c,
              start: isSnapping ? snap(nextStart) : Number(nextStart.toFixed(2)),
              duration: isSnapping ? snap(nextDuration) : Number(nextDuration.toFixed(2)),
            };
          }),
        }))
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  };

  // Add library asset to the active timeline at the current playhead
  const addAssetToTimeline = (asset: any) => {
    let trackId = "";
    if (asset.kind === "video") trackId = "track-video";
    else if (asset.kind === "audio") trackId = "track-audio";
    else if (asset.kind === "text") trackId = "track-text";
    
    if (!trackId) trackId = "track-text";

    const defaultDuration = 4;
    const clipStart = clamp(playhead, 0, totalDuration - defaultDuration);

    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      title: asset.title,
      kind: asset.kind,
      trackId: trackId,
      start: isSnapping ? snap(clipStart) : Number(clipStart.toFixed(2)),
      duration: defaultDuration,
      color: asset.color || "#10b981",
      position: 0,
      positionX: 0,
      positionY: 0,
      scale: 100,
      rotation: 0,
      opacity: 100,
      speed: 100,
      blur: 0,
      volume: 100,
      fadeIn: 0.2,
      fadeOut: 0.2,
      textContent: asset.textContent,
      videoUrl: asset.url,
      audioUrl: asset.url,
      stickerEmoji: asset.stickerEmoji,
      effectName: asset.effectName,
      filterName: asset.filterName
    };

    setHistory((h) => [...h, tracks].slice(-20));
    setRedoHistory([]);
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id !== trackId) return track;
        return { ...track, clips: [...track.clips, newClip] };
      })
    );

    setSelectedClipId(newClip.id);
    playSynth("blip");
  };

  // Split selected clip at current playhead position
  const splitSelectedClip = () => {
    if (!selectedClip) return;
    const { start, duration } = selectedClip;
    if (playhead > start && playhead < start + duration) {
      const splitTime = playhead;
      const duration1 = splitTime - start;
      const duration2 = start + duration - splitTime;

      setHistory((h) => [...h, tracks].slice(-20));
      setRedoHistory([]);

      setTracks((prev) =>
        prev.map((track) => {
          if (track.id !== selectedClip.trackId) return track;
          
          const clipIndex = track.clips.findIndex((c) => c.id === selectedClip.id);
          if (clipIndex === -1) return track;

          const part1 = {
            ...selectedClip,
            duration: duration1,
          };
          const part2 = {
            ...selectedClip,
            id: `${selectedClip.id}-split-${Date.now()}`,
            title: `${selectedClip.title} (Part 2)`,
            start: splitTime,
            duration: duration2,
          };

          const newClips = [...track.clips];
          newClips.splice(clipIndex, 1, part1, part2);
          
          return { ...track, clips: newClips };
        })
      );
      playSynth("swoosh");
    }
  };

  // Duplicate clip
  const duplicateClip = (clipId: string) => {
    const clip = tracks.flatMap((track) => track.clips).find((item) => item.id === clipId);
    if (!clip) return;
    const duplicate: Clip = {
      ...clip,
      id: `${clip.id}-copy-${Date.now()}`,
      title: `${clip.title} Copy`,
      start: clamp(clip.start + 1.2, 0, totalDuration - clip.duration),
      positionX: (clip.positionX ?? 0) + 15,
      positionY: (clip.positionY ?? 0) + 15,
    };
    
    setHistory((h) => [...h, tracks].slice(-20));
    setRedoHistory([]);
    setTracks((prev) => prev.map((track) => (track.id === clip.trackId ? { ...track, clips: [...track.clips, duplicate] } : track)));
    setSelectedClipId(duplicate.id);
    playSynth("blip");
  };

  // Delete clip
  const deleteClip = (clipId: string) => {
    setHistory((h) => [...h, tracks].slice(-20));
    setRedoHistory([]);
    setTracks((prev) => prev.map((track) => ({ ...track, clips: track.clips.filter((clip) => clip.id !== clipId) })));
    playSynth("blip");
  };

  // Shift tracks (up/down layer)
  const moveClipTrack = (clipId: string, direction: -1 | 1) => {
    setTracks((prev) => {
      const clip = prev.flatMap((track) => track.clips).find((item) => item.id === clipId);
      if (!clip) return prev;
      
      const currentIndex = prev.findIndex((track) => track.clips.some((item) => item.id === clipId));
      const targetIndex = clamp(currentIndex + direction, 0, prev.length - 1);
      if (currentIndex === targetIndex) return prev;

      setHistory((h) => [...h, prev].slice(-20));
      setRedoHistory([]);

      const nextTracks = prev.map((track) => ({ ...track, clips: track.clips.filter((c) => c.id !== clipId) }));
      return nextTracks.map((track, index) => {
        if (index !== targetIndex) return track;
        return { ...track, clips: [...track.clips, { ...clip, trackId: track.id }] };
      });
    });
  };

  const updateClip = (clipId: string, updater: (clip: Clip) => Clip) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.map((clip) => (clip.id === clipId ? updater(clip) : clip)),
      }))
    );
  };

  // Apply filters/effects from sidebar
  const applyEffectToSelected = (effectName: string) => {
    if (!selectedClip) return;
    setHistory((h) => [...h, tracks].slice(-20));
    updateClip(selectedClip.id, (clip) => ({ ...clip, effectName: clip.effectName === effectName ? undefined : effectName }));
    playSynth("blip");
  };

  const applyFilterToSelected = (filterName: string) => {
    if (!selectedClip) return;
    setHistory((h) => [...h, tracks].slice(-20));
    updateClip(selectedClip.id, (clip) => ({ ...clip, filterName: clip.filterName === filterName ? undefined : filterName }));
    playSynth("blip");
  };

  // Timeline Ruler Scrubbing
  const handleRulerPointerDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    
    const updatePlayhead = (clientX: number) => {
      const clickX = clientX - rect.left;
      const progressPercent = clickX / rect.width;
      const newPlayhead = clamp(progressPercent * totalDuration, 0, totalDuration);
      setPlayhead(isSnapping ? snap(newPlayhead) : Number(newPlayhead.toFixed(2)));
    };

    updatePlayhead(event.clientX);

    const handlePointerMove = (moveEvent: MouseEvent) => {
      updatePlayhead(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  };

  // Computed: Find which clips are active at the current playhead
  const activeClips = useMemo(() => {
    return tracks
      .filter((t) => !t.hidden)
      .flatMap((t) => t.clips)
      .filter((clip) => playhead >= clip.start && playhead <= clip.start + clip.duration);
  }, [tracks, playhead]);

  return (
    <section id="skills" className="scroll-mt-28 py-8 md:py-12">
      {/* Glitch & Noise CSS animations injected dynamically */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-1.5px, 1.5px) }
          40% { transform: translate(-1.5px, -1.5px) }
          60% { transform: translate(1.5px, 1.5px) }
          80% { transform: translate(1.5px, -1.5px) }
          100% { transform: translate(0) }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%) }
          100% { transform: translateY(100%) }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0) }
          10% { transform: translate(-1%, -1%) }
          20% { transform: translate(-2%, 1%) }
          30% { transform: translate(1%, -2%) }
          40% { transform: translate(-1%, 3%) }
          50% { transform: translate(-2%, 1%) }
          60% { transform: translate(1%, 3%) }
          70% { transform: translate(2%, 1%) }
          80% { transform: translate(-2%, -2%) }
          90% { transform: translate(1%, -3%) }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95) translate(-50%, -50%); opacity: 0.7; }
          50% { transform: scale(1.08) translate(-50%, -50%); opacity: 1; }
          100% { transform: scale(0.95) translate(-50%, -50%); opacity: 0.7; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg) translate(-50%, -50%); }
          100% { transform: rotate(360deg) translate(-50%, -50%); }
        }
        .effect-vhs-scanline {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 48%, rgba(0,255,255,0.18) 50%, rgba(0,255,255,0.18));
          background-size: 100% 16px;
          animation: scanline 4.5s linear infinite;
          pointer-events: none;
          z-index: 25;
        }
        .effect-grain {
          position: absolute;
          top: -10%; left: -10%; width: 120%; height: 120%;
          opacity: 0.12;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: grain 0.3s steps(6) infinite;
          pointer-events: none;
          z-index: 22;
        }
        .vhs-chromatic {
          animation: glitch 0.25s infinite;
        }
      `}} />

      <div className="section-shell">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl" data-reveal>
            <span className="section-label">CapCut Pro Workspace</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.96] tracking-[-0.04em] text-[#f7f8ff]">
              A high-fidelity editing experience built into a premium dark interface.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">
              Double-click or drag assets from the left panel to insert them. Edit clip position by dragging inside the player window, or customize properties in the inspector panel.
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
          <div className="flex min-w-[1120px] flex-row">
            {/* Sidebar Library Tabs */}
            <aside className="w-[230px] border-r border-white/10 p-3 flex flex-col">
              <div className="mb-3 text-[10px] uppercase tracking-[0.36em] text-slate-500">Tools</div>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setActiveTool(tool.id);
                      playSynth("blip");
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition ${
                      activeTool === tool.id
                        ? "border-cyan-400/40 bg-gradient-to-b from-cyan-500/15 to-transparent text-white"
                        : "border-white/5 bg-white/5 text-slate-400 hover:border-cyan-400/20 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-sm font-semibold">{tool.icon}</span>
                    <span className="text-[10px] mt-1 tracking-wider">{tool.label}</span>
                  </button>
                ))}
              </div>

              {/* Sidebar Asset Lists */}
              <div className="flex-1 overflow-y-auto rounded-[20px] border border-white/10 bg-white/5 p-3 max-h-[380px]">
                <div className="font-semibold text-slate-100 flex items-center justify-between text-xs pb-2 border-b border-white/5 mb-3">
                  <span>{tools.find((t) => t.id === activeTool)?.label}</span>
                  <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-full font-mono uppercase">Assets</span>
                </div>
                
                <div className="space-y-2">
                  {activeTool === "media" && mediaLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/30 border border-white/5 p-2 hover:border-cyan-400/35 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: item.color }}>🎬</div>
                        <span className="text-[11px] text-slate-300 truncate">{item.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addAssetToTimeline(item)}
                        className="rounded-lg bg-cyan-500 hover:bg-cyan-400 p-1 text-slate-950 font-bold text-xs w-5 h-5 flex items-center justify-center transition"
                        title="Insert at Playhead"
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {activeTool === "audio" && audioLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/30 border border-white/5 p-2 hover:border-cyan-400/35 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: item.color }}>🎵</div>
                        <span className="text-[11px] text-slate-300 truncate">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const audio = new Audio(item.url);
                            audio.volume = 0.3;
                            audio.play().catch(() => {});
                            setTimeout(() => audio.pause(), 2500);
                          }}
                          className="rounded bg-white/10 hover:bg-white/20 px-1 py-0.5 text-slate-300 text-[9px]"
                          title="Preview"
                        >
                          ▶
                        </button>
                        <button
                          type="button"
                          onClick={() => addAssetToTimeline(item)}
                          className="rounded-lg bg-cyan-500 hover:bg-cyan-400 p-1 text-slate-950 font-bold text-xs w-5 h-5 flex items-center justify-center transition"
                          title="Insert"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {activeTool === "text" && textLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/30 border border-white/5 p-2 hover:border-cyan-400/35 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">T</div>
                        <span className="text-[11px] text-slate-300 truncate">{item.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addAssetToTimeline(item)}
                        className="rounded-lg bg-cyan-500 hover:bg-cyan-400 p-1 text-slate-950 font-bold text-xs w-5 h-5 flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {activeTool === "stickers" && stickerLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/30 border border-white/5 p-2 hover:border-cyan-400/35 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center justify-center text-[13px]">{item.stickerEmoji}</div>
                        <span className="text-[11px] text-slate-300 truncate">{item.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addAssetToTimeline(item)}
                        className="rounded-lg bg-cyan-500 hover:bg-cyan-400 p-1 text-slate-950 font-bold text-xs w-5 h-5 flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {activeTool === "effects" && effectLibrary.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => applyEffectToSelected(item.effectName)}
                      className={`flex w-full items-center justify-between rounded-xl border p-2 text-left text-[11px] transition ${
                        selectedClip?.effectName === item.effectName
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                          : "border-white/5 bg-black/30 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <span>✨ {item.title}</span>
                      <span className="text-[9px] text-slate-500">{selectedClip ? "Toggle" : "Select clip"}</span>
                    </button>
                  ))}

                  {activeTool === "filters" && filterLibrary.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => applyFilterToSelected(item.filterName)}
                      className={`flex w-full items-center justify-between rounded-xl border p-2 text-left text-[11px] transition ${
                        selectedClip?.filterName === item.filterName
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                          : "border-white/5 bg-black/30 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <span>🎨 {item.title}</span>
                      <span className="text-[9px] text-slate-500">{selectedClip ? "Toggle" : "Select clip"}</span>
                    </button>
                  ))}

                  {["transitions", "ai", "adjustment", "templates"].includes(activeTool) && (
                    <div className="text-[11px] text-slate-500 py-6 text-center leading-relaxed">
                      Option coming soon. Select Media, Audio, Text, Stickers, Effects, or Filters to import/apply assets.
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Video Player and Inspector panel */}
            <div className="flex-1 p-3 flex flex-col gap-3 min-w-0">
              <div className="rounded-[28px] border border-white/10 bg-[#080b11] p-3 flex flex-col">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">Preview</span>
                    <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] text-cyan-200 font-mono">{resolution} • 30fps</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={resolution}
                      onChange={(event) => {
                        setResolution(event.target.value);
                        playSynth("blip");
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="1080p (16:9)" className="bg-slate-900">1080p (16:9)</option>
                      <option value="4K (16:9)" className="bg-slate-900">4K (16:9)</option>
                      <option value="Mobile (9:16)" className="bg-slate-900">Mobile (9:16)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        playSynth("melody");
                        alert("Exporting project... Composition compiled successfully (Simulation only).");
                      }}
                      className="rounded-full bg-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                  {/* Left: Video Player Bezel */}
                  <div className="rounded-[24px] border border-white/10 bg-[#0b1017] p-3 flex flex-col justify-between">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Timeline Head</span>
                      <span className="text-cyan-400">{formatTime(playhead)} / {formatTime(totalDuration)}</span>
                    </div>

                    {/* Live Video Preview Window */}
                    <div className="flex-1 flex items-center justify-center py-2 bg-black/40 rounded-[20px] min-h-[300px]">
                      <div
                        className={`relative overflow-hidden rounded-[16px] border border-white/10 bg-black transition-all duration-300 ${
                          resolution === "Mobile (9:16)" ? "aspect-[9/16] h-[320px] w-auto" : "aspect-video w-full"
                        }`}
                      >
                        {/* Audio elements */}
                        {tracks
                          .filter((t) => t.kind === "audio" && !t.muted)
                          .flatMap((t) => t.clips)
                          .map((clip) => (
                            <ActiveAudioElement
                              key={clip.id}
                              clip={clip}
                              playhead={playhead}
                              isPlaying={isPlaying}
                              trackMuted={tracks.find((t) => t.id === clip.trackId)?.muted ?? false}
                            />
                          ))}

                        {/* Video / Text elements (sorted by layout layering: video at bottom, text on top) */}
                        {activeClips
                          .slice()
                          .sort((a, b) => {
                            if (a.kind === "video" && b.kind !== "video") return -1;
                            if (a.kind !== "video" && b.kind === "video") return 1;
                            return 0;
                          })
                          .map((clip) => {
                            const isSelected = clip.id === selectedClipId;
                            if (clip.kind === "video") {
                              return (
                                <ActiveVideoElement
                                  key={clip.id}
                                  clip={clip}
                                  playhead={playhead}
                                  isPlaying={isPlaying}
                                  trackMuted={tracks.find((t) => t.id === clip.trackId)?.muted ?? false}
                                  isSelected={isSelected}
                                  onPointerDown={(e) => handlePlayerClipPointerDown(e, clip.id)}
                                />
                              );
                            }
                            if (clip.kind === "text") {
                              return (
                                <ActiveTextElement
                                  key={clip.id}
                                  clip={clip}
                                  isSelected={isSelected}
                                  onPointerDown={(e) => handlePlayerClipPointerDown(e, clip.id)}
                                />
                              );
                            }
                            return null;
                          })}

                        {/* Global Visual Effects applied on top of player */}
                        {activeClips.some((c) => c.effectName === "VHS Glitch") && (
                          <div className="vhs-chromatic pointer-events-none absolute inset-0 z-30">
                            <div className="effect-vhs-scanline" />
                            <div className="effect-grain" />
                          </div>
                        )}
                        {activeClips.some((c) => c.effectName === "Retro Grain") && (
                          <div className="effect-grain pointer-events-none absolute inset-0 z-30" />
                        )}
                        {activeClips.some((c) => c.effectName === "Cinema Scope") && (
                          <div className="pointer-events-none absolute inset-0 z-30">
                            <div className="absolute top-0 inset-x-0 h-[22px] bg-black border-b border-white/5" />
                            <div className="absolute bottom-0 inset-x-0 h-[22px] bg-black border-t border-white/5" />
                          </div>
                        )}

                        {/* Ambient Grid overlay showing player frame bounds */}
                        <div className="absolute inset-0 border border-white/5 pointer-events-none z-10" />
                      </div>
                    </div>

                    {/* Audio & Video Controls bar */}
                    <div className="mt-3 rounded-[16px] border border-white/10 bg-black/45 p-2.5 backdrop-blur flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPlayhead(0);
                              playSynth("blip");
                            }}
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-slate-200 transition"
                            title="Go to start"
                          >
                            ⏮
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPlayhead((v) => clamp(v - 0.5, 0, totalDuration));
                              playSynth("blip");
                            }}
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-slate-200 transition"
                            title="-0.5s"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsPlaying((v) => !v);
                              playSynth("swoosh");
                            }}
                            className="rounded-full bg-cyan-500 hover:bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 transition"
                          >
                            {isPlaying ? "⏸ Pause" : "▶ Play"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPlayhead((v) => clamp(v + 0.5, 0, totalDuration));
                              playSynth("blip");
                            }}
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-slate-200 transition"
                            title="+0.5s"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPlayhead(totalDuration);
                              playSynth("blip");
                            }}
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-slate-200 transition"
                            title="Go to end"
                          >
                            ⏭
                          </button>
                        </div>

                        {/* Split Clip & Snapping Toolbar */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={splitSelectedClip}
                            disabled={!selectedClip || playhead <= selectedClip.start || playhead >= selectedClip.start + selectedClip.duration}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition ${
                              selectedClip && playhead > selectedClip.start && playhead < selectedClip.start + selectedClip.duration
                                ? "bg-red-500 hover:bg-red-400 text-white"
                                : "bg-white/5 text-slate-500 cursor-not-allowed"
                            }`}
                            title="Split Clip at Playhead (✂️)"
                          >
                            <span>✂️</span>
                            <span>Split</span>
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={totalDuration}
                        step={0.05}
                        value={playhead}
                        onChange={(e) => setPlayhead(Number(e.target.value))}
                        className="h-1 w-full cursor-pointer accent-cyan-400 bg-white/10 rounded-lg appearance-none"
                      />
                    </div>
                  </div>

                  {/* Right: Clip Properties Inspector Panel */}
                  <div className="rounded-[24px] border border-white/10 bg-[#0b1017] p-3 flex flex-col max-h-[460px] overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 border-b border-white/5 pb-2 mb-3">Transform Inspector</div>
                    
                    {selectedClip ? (
                      <div className="space-y-3">
                        <div className="rounded-[16px] border border-white/10 bg-white/5 p-3">
                          <div className="text-xs text-slate-400">Clip Title</div>
                          <input
                            type="text"
                            value={selectedClip.title}
                            onChange={(e) => updateClip(selectedClip.id, (c) => ({ ...c, title: e.target.value }))}
                            className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {selectedClip.kind === "text" && (
                          <div className="rounded-[16px] border border-white/10 bg-white/5 p-3">
                            <div className="text-xs text-slate-400">Text Content</div>
                            <input
                              type="text"
                              value={selectedClip.textContent ?? ""}
                              onChange={(e) => updateClip(selectedClip.id, (c) => ({ ...c, textContent: e.target.value }))}
                              className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        )}

                        {[
                          { label: "Position X", value: selectedClip.positionX ?? 0, min: -180, max: 180, unit: "px", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, positionX: value })) },
                          { label: "Position Y", value: selectedClip.positionY ?? 0, min: -180, max: 180, unit: "px", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, positionY: value })) },
                          { label: "Scale", value: selectedClip.scale ?? 100, min: 10, max: 200, unit: "%", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, scale: value })) },
                          { label: "Rotation", value: selectedClip.rotation ?? 0, min: -180, max: 180, unit: "°", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, rotation: value })) },
                          { label: "Opacity", value: selectedClip.opacity ?? 100, min: 0, max: 100, unit: "%", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, opacity: value })) },
                          { label: "Speed", value: selectedClip.speed ?? 100, min: 25, max: 400, unit: "%", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, speed: value })) },
                          { label: "Blur", value: selectedClip.blur ?? 0, min: 0, max: 20, unit: "px", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, blur: value })) },
                          { label: "Volume", value: selectedClip.volume ?? 100, min: 0, max: 100, unit: "%", onChange: (value: number) => updateClip(selectedClip.id, (clip) => ({ ...clip, volume: value })) },
                        ].map((item) => (
                          <label key={item.label} className="block rounded-[16px] border border-white/10 bg-white/5 p-2.5">
                            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                              <span>{item.label}</span>
                              <span className="text-cyan-300 font-mono text-[11px]">{item.value}{item.unit}</span>
                            </div>
                            <input
                              type="range"
                              min={item.min}
                              max={item.max}
                              value={item.value}
                              onChange={(e) => item.onChange(Number(e.target.value))}
                              className="h-1 w-full cursor-pointer accent-cyan-400 bg-white/10 rounded-lg appearance-none"
                            />
                          </label>
                        ))}

                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateClip(selectedClip.id)}
                            className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2 text-xs text-slate-200 transition"
                          >
                            👥 Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteClip(selectedClip.id)}
                            className="flex-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 py-2 text-xs text-red-400 transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-10 px-4">
                        <div className="text-xl mb-2">🎬</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Select a clip in the timeline below to customize its position, rotation, speed, volume, and visual filters.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Multitrack Timeline Section */}
              <div className="rounded-[28px] border border-white/10 bg-[#080b11] p-3 flex flex-col">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-semibold">Timeline</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSnapping(!isSnapping);
                        playSynth("blip");
                      }}
                      className={`rounded-full px-2.5 py-0.5 border text-[10px] transition ${
                        isSnapping ? "border-cyan-500 bg-cyan-500/10 text-cyan-200" : "border-white/10 text-slate-400"
                      }`}
                    >
                      🧲 Snapping: {isSnapping ? "On" : "Off"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => clamp(z - 0.15, 0.8, 2.2))}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
                    >
                      Zoom out
                    </button>
                    <span className="min-w-8 text-center text-xs font-mono text-slate-400">{(zoom * 100).toFixed(0)}%</span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => clamp(z + 0.15, 0.8, 2.2))}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
                    >
                      Zoom in
                    </button>
                  </div>
                </div>

                {/* Multitrack timeline container */}
                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#090d13]">
                  <div className="flex flex-row overflow-x-auto select-none">
                    
                    {/* Sticky left headers */}
                    <div className="w-[150px] shrink-0 border-r border-white/10 bg-[#090d13] z-10 py-3 pl-3 space-y-3">
                      <div className="h-8 text-[9px] uppercase tracking-wider text-slate-500 flex items-center">
                        Layers
                      </div>
                      {tracks.map((track) => (
                        <div key={track.id} className="h-16 flex flex-col justify-center border-b border-white/5 last:border-0 pb-1.5">
                          <span className="text-[11px] font-bold text-slate-300 truncate">{track.name}</span>
                          <div className="mt-1 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, locked: !t.locked } : t)));
                                playSynth("blip");
                              }}
                              className={`rounded px-1.5 py-0.5 text-[8px] font-semibold font-mono ${
                                track.locked ? "bg-amber-500/20 text-amber-300" : "bg-white/5 text-slate-400"
                              }`}
                              title={track.locked ? "Unlock track" : "Lock track"}
                            >
                              {track.locked ? "🔒 Locked" : "🔓 Lock"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, muted: !t.muted } : t)));
                                playSynth("blip");
                              }}
                              className={`rounded px-1.5 py-0.5 text-[8px] font-semibold font-mono ${
                                track.muted ? "bg-red-500/20 text-red-300" : "bg-white/5 text-slate-400"
                              }`}
                            >
                              {track.muted ? "🔇 Muted" : "🔊 Mute"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Scrollable tracks & ruler */}
                    <div className="flex-1 overflow-x-auto" ref={timelineScrollRef}>
                      <div style={{ width: `${zoom * 100}%`, minWidth: "100%" }} className="relative py-3 pr-4" ref={timelineRef}>
                        
                        {/* Ruler Area */}
                        <div
                          className="h-8 rounded-lg border border-white/5 bg-black/25 mb-3 relative cursor-ew-resize select-none"
                          onMouseDown={handleRulerPointerDown}
                        >
                          {Array.from({ length: Math.floor(totalDuration * 2) + 1 }).map((_, idx) => {
                            const time = idx * 0.5;
                            const isMajor = idx % 2 === 0;
                            return (
                              <div
                                key={idx}
                                className="absolute bottom-0 h-3 border-l border-white/10"
                                style={{
                                  left: `${(time / totalDuration) * 100}%`,
                                  height: isMajor ? "12px" : "6px",
                                  borderColor: isMajor ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.06)",
                                }}
                              >
                                {isMajor && (
                                  <span className="absolute bottom-4 -left-3 text-[8px] font-mono text-slate-500">
                                    {formatTime(time)}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Tracks Area container */}
                        <div className="space-y-3 relative">
                          {tracks.map((track) => (
                            <div
                              key={track.id}
                              className={`h-16 relative rounded-xl border p-1 overflow-hidden transition ${
                                track.locked ? "border-amber-500/10 bg-[#161310]" : "border-white/5 bg-[#0f141c]"
                              }`}
                            >
                              {/* Grid lines */}
                              {Array.from({ length: 12 }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className="absolute inset-y-0 w-px border-l border-white/5 pointer-events-none"
                                  style={{ left: `${(idx + 1) * 8.33}%` }}
                                />
                              ))}

                              {/* Render clips inside track */}
                              {!track.hidden && track.clips.map((clip) => (
                                <button
                                  key={clip.id}
                                  type="button"
                                  onContextMenu={(event) => {
                                    event.preventDefault();
                                    setContextMenu({ x: event.clientX, y: event.clientY, clipId: clip.id });
                                    setSelectedClipId(clip.id);
                                  }}
                                  onMouseDown={(event) => handleClipPointerDown(event, clip)}
                                  className={`absolute top-1.5 bottom-1.5 rounded-lg border px-2 text-left text-[10px] font-medium text-white shadow-lg transition select-none ${
                                    selectedClipId === clip.id ? "border-cyan-400 ring-1 ring-cyan-400/40" : "border-white/10 hover:border-cyan-400/40"
                                  }`}
                                  style={{
                                    left: `${(clip.start / totalDuration) * 100}%`,
                                    width: `${(clip.duration / totalDuration) * 100}%`,
                                    background: `linear-gradient(135deg, ${clip.color}, rgba(8, 12, 20, 0.9))`,
                                  }}
                                >
                                  <div className="flex h-full flex-col justify-between py-0.5 truncate">
                                    <span className="font-bold truncate leading-tight">{clip.title}</span>
                                    <span className="text-[8px] opacity-60 leading-none">{clip.duration.toFixed(1)}s</span>
                                  </div>

                                  {/* Trim/resize handles */}
                                  {!track.locked && (
                                    <>
                                      <div
                                        onMouseDown={(event) => handleClipPointerDown(event, clip, "resize-left")}
                                        className="absolute left-0 top-0 bottom-0 w-2.5 cursor-w-resize rounded-l-lg hover:bg-cyan-400/35 active:bg-cyan-400"
                                      />
                                      <div
                                        onMouseDown={(event) => handleClipPointerDown(event, clip, "resize-right")}
                                        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-e-resize rounded-r-lg hover:bg-cyan-400/35 active:bg-cyan-400"
                                      />
                                    </>
                                  )}
                                </button>
                              ))}
                            </div>
                          ))}

                          {/* Playhead Overlay Bar */}
                          <div
                            className="absolute top-0 bottom-0 w-px bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.85)] z-10 pointer-events-none"
                            style={{ left: `${(playhead / totalDuration) * 100}%` }}
                          >
                            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full -ml-[4.5px] -mt-1 shadow shadow-cyan-400/90" />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Click Context Menu */}
      {contextMenu && selectedClip && (
        <div
          className="fixed z-50 rounded-xl border border-white/10 bg-[#0d1117]/95 p-1.5 shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-white/10 transition"
            onClick={() => {
              duplicateClip(contextMenu.clipId);
              setContextMenu(null);
            }}
          >
            👥 Duplicate Clip
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-white/10 transition"
            onClick={() => {
              moveClipTrack(contextMenu.clipId, -1);
              setContextMenu(null);
            }}
          >
            ⬆ Move Layer Up
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-white/10 transition"
            onClick={() => {
              moveClipTrack(contextMenu.clipId, 1);
              setContextMenu(null);
            }}
          >
            ⬇ Move Layer Down
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10 transition"
            onClick={() => {
              deleteClip(contextMenu.clipId);
              setContextMenu(null);
            }}
          >
            🗑️ Delete Clip
          </button>
        </div>
      )}
    </section>
  );
}

interface SkillsSectionProps {
  skills: string[];
}

