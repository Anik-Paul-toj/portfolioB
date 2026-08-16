"use client";

<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type SkillsSectionProps = {
  skills: string[];
};

// Define types for assets in our CapCut Pro workspace
type Asset = {
  id: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  type: string;
  category: string;
};

// Seed library assets
const libraryAssets: Record<string, Asset[]> = {
  media: [
    { id: "m1", title: "Neon Pulse.mp4", duration: "0:15", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80", type: "video", category: "Music Reel" },
    { id: "m2", title: "Afterglow.mp4", duration: "0:22", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80", type: "video", category: "Fashion Campaign" },
    { id: "m3", title: "Still Motion.mp4", duration: "0:18", thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80", type: "video", category: "Brand Film" },
    { id: "m4", title: "Nocturne.mp4", duration: "0:30", thumbnail: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=400&q=80", type: "video", category: "Trailer Edit" },
    { id: "m5", title: "Velvet Spot.mp4", duration: "0:12", thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", type: "video", category: "Beauty Spot" },
    { id: "m6", title: "Echo Event.mp4", duration: "0:25", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80", type: "video", category: "Event Opener" },
  ],
  audio: [
    { id: "a1", title: "Retro Synth Wave", duration: "1:25", type: "audio", category: "Background Music" },
    { id: "a2", title: "Cinematic Sub Bass", duration: "1:30", type: "audio", category: "SFX" },
    { id: "a3", title: "Pastel Jazz Lounge", duration: "3:12", type: "audio", category: "Background Music" },
    { id: "a4", title: "Glitch Transition SFX", duration: "0:04", type: "audio", category: "SFX" },
    { id: "a5", title: "Rising Tension Sweep", duration: "0:08", type: "audio", category: "SFX" },
  ],
  text: [
    { id: "t1", title: "Minimal Cinematic Title", type: "text", category: "Title Preset" },
    { id: "t2", title: "Neon Glow Text", type: "text", category: "Glow Effect" },
    { id: "t3", title: "Subtitles (CapCut Style)", type: "text", category: "Subtitles" },
    { id: "t4", title: "Fast Glitch Intro", type: "text", category: "Intro Text" },
  ],
  stickers: [
    { id: "s1", title: "Neon Arrow Pointer", type: "sticker", category: "Overlay" },
    { id: "s2", title: "Soft Light Flare", type: "sticker", category: "Light Leak" },
    { id: "s3", title: "Film Frame Border", type: "sticker", category: "Border" },
    { id: "s4", title: "Sparkling Stars", type: "sticker", category: "Sparkle" },
  ],
  effects: [
    { id: "e1", title: "Retro VHS Bloom", type: "effect", category: "Video Effect" },
    { id: "e2", title: "Pastel Neon Dream", type: "effect", category: "Color Effect" },
    { id: "e3", title: "Glitch Aberration", type: "effect", category: "Distortion" },
    { id: "e4", title: "Cinematic Light Leak", type: "effect", category: "Light Leak" },
  ],
  filters: [
    { id: "f1", title: "Teal & Orange Glow", type: "filter", category: "Grade Look" },
    { id: "f2", title: "Warm Nostalgia", type: "filter", category: "Vintage" },
    { id: "f3", title: "Cyberpunk Magenta", type: "filter", category: "Stylized" },
    { id: "f4", title: "Monochrome High Key", type: "filter", category: "B&W" },
  ],
  transitions: [
    { id: "tr1", title: "Whip Pan Left", duration: "0.5s", type: "transition", category: "Movement" },
    { id: "tr2", title: "Cross Dissolve Smooth", duration: "0.8s", type: "transition", category: "Dissolve" },
    { id: "tr3", title: "Glitch Shift Drift", duration: "0.4s", type: "transition", category: "Distortion" },
    { id: "tr4", title: "Radial Zoom In-Out", duration: "0.6s", type: "transition", category: "Zoom" },
  ],
  ai_tools: [
    { id: "ai1", title: "Smart Cutout", type: "ai", category: "Chroma Key" },
    { id: "ai2", title: "Auto Caption Generator", type: "ai", category: "Subtitles" },
    { id: "ai3", title: "AI Vocal Separator", type: "ai", category: "Audio" },
    { id: "ai4", title: "Face Retouch / Glow", type: "ai", category: "Beautify" },
  ],
  adjustment: [
    { id: "adj1", title: "Custom Color Layer", type: "adjustment", category: "Color Wheel" },
    { id: "adj2", title: "Exposure Lift Overlay", type: "adjustment", category: "Light" },
    { id: "adj3", title: "Cyan/Magenta Tint Split", type: "adjustment", category: "Color" },
  ],
  templates: [
    { id: "temp1", title: "Fast-Paced Reels Template", type: "template", category: "Presets" },
    { id: "temp2", title: "Cinematic Travel Opener", type: "template", category: "Intro" },
    { id: "temp3", title: "Split Screen Beauty Edit", type: "template", category: "Layout" },
  ]
};

// Sidebar tabs config
const sidebarTabs = [
  { id: "media", label: "Media", icon: "M" },
  { id: "audio", label: "Audio", icon: "A" },
  { id: "text", label: "Text", icon: "T" },
  { id: "stickers", label: "Stickers", icon: "S" },
  { id: "effects", label: "Effects", icon: "E" },
  { id: "filters", label: "Filters", icon: "F" },
  { id: "transitions", label: "Transitions", icon: "⇄" },
  { id: "ai_tools", label: "AI Tools", icon: "🤖" },
  { id: "adjustment", label: "Adjustment", icon: "⚙️" },
  { id: "templates", label: "Templates", icon: "❐" },
];

// Timeline initial clips data mapping to tracks
type TimelineClip = {
  id: string;
  title: string;
  track: "v2" | "v1" | "a1";
  start: number; // in seconds
  duration: number; // in seconds
  color: string;
  type: string;
  thumbnail?: string;
  category?: string;
};

// Phase 4 Clip editable properties definitions
type ClipProperties = {
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  opacity: number;
  speed: number;
  blur: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  chromaKey: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
};

const defaultClipProperties: ClipProperties = {
  positionX: 0,
  positionY: 0,
  scale: 100,
  rotation: 0,
  opacity: 100,
  speed: 1.0,
  blur: 0,
  volume: 80,
  fadeIn: 0,
  fadeOut: 0,
  chromaKey: false,
  brightness: 0,
  contrast: 0,
  saturation: 0,
};

const initialTimelineClips: TimelineClip[] = [
  { id: "c1", title: "Minimal Cinematic Title", track: "v2", start: 2, duration: 10, color: "bg-indigo-950/80 border-indigo-500/40 text-indigo-200", type: "text", category: "Title Preset" },
  { id: "c2", title: "Sparkling Stars Overlay", track: "v2", start: 40, duration: 15, color: "bg-yellow-950/80 border-yellow-500/40 text-yellow-200", type: "sticker", category: "Overlay" },
  { id: "c3", title: "Neon Pulse.mp4", track: "v1", start: 0, duration: 15, color: "bg-rose-950/80 border-rose-500/40 text-rose-200", type: "video", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80", category: "Music Reel" },
  { id: "c4", title: "Afterglow.mp4", track: "v1", start: 15, duration: 22, color: "bg-blue-950/80 border-blue-500/40 text-blue-200", type: "video", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80", category: "Fashion Campaign" },
  { id: "c5", title: "Still Motion.mp4", track: "v1", start: 37, duration: 18, color: "bg-teal-950/80 border-teal-500/40 text-teal-200", type: "video", thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80", category: "Brand Film" },
  { id: "c6", title: "Nocturne.mp4", track: "v1", start: 55, duration: 30, color: "bg-purple-950/80 border-purple-500/40 text-purple-200", type: "video", thumbnail: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=400&q=80", category: "Trailer Edit" },
  { id: "c7", title: "Retro Synth Wave.mp3", track: "a1", start: 0, duration: 85, color: "bg-cyan-950/80 border-cyan-500/40 text-cyan-200", type: "audio", category: "Background Music" },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("media");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");

  // Phase 4 Inspector & Configuration States
  const [inspectorTab, setInspectorTab] = useState<"video" | "audio" | "speed">("video");
  const [clipsProperties, setClipsProperties] = useState<Record<string, ClipProperties>>({});

  // Phase 4 Stateful Track controls
  const [trackMutes, setTrackMutes] = useState<Record<string, boolean>>({});
  const [trackLocks, setTrackLocks] = useState<Record<string, boolean>>({});
  const [trackHides, setTrackHides] = useState<Record<string, boolean>>({});

  // Timeline clips stateful configurations
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>(initialTimelineClips);

  // Playback and Zoom states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [zoom, setZoom] = useState(6); // range 1-10

  const duration = 90; // total project duration in seconds
  const scale = zoom * 3.5; // pixel width per second
  const timelineWidth = duration * scale;

  const activeAssets = libraryAssets[activeTab] || [];
  
  // Phase 4 References for History Undos & Copy Paste Buffers
  const historyRef = useRef<TimelineClip[][]>([initialTimelineClips]);
  const historyIndexRef = useRef<number>(0);
  const copiedClipRef = useRef<TimelineClip | null>(null);
  const timelineViewportRef = useRef<HTMLDivElement>(null);

  // Save changes to history stack helper
  const saveToHistory = (newClips: TimelineClip[]) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(newClips);
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
  };

  // Properties retrieval helper
  const getClipProperties = (clipId: string): ClipProperties => {
    return clipsProperties[clipId] || defaultClipProperties;
  };

  // Properties update handler
  const updateClipProperty = <K extends keyof ClipProperties>(
    clipId: string,
    key: K,
    value: ClipProperties[K]
  ) => {
    setClipsProperties((prev) => {
      const existing = prev[clipId] || defaultClipProperties;
      return {
        ...prev,
        [clipId]: { ...existing, [key]: value },
      };
    });
  };

  // Playback loop controller ref bindings
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let rafId: number;

    const tick = (now: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
      }
      const elapsed = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlayingRef.current) {
        setCurrentTime((prev) => {
          const next = prev + elapsed;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      rafId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      lastTimeRef.current = performance.now();
      rafId = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  // Sync state when paused to avoid time jumps
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
    }
  }, [isPlaying]);

  // Phase 4 Playhead Auto-scrolling viewport tracker
  useEffect(() => {
    if (isPlaying && timelineViewportRef.current) {
      const viewport = timelineViewportRef.current;
      const playheadX = currentTime * scale;
      const scrollLeft = viewport.scrollLeft;
      const width = viewport.clientWidth;

      if (playheadX > scrollLeft + width * 0.7) {
        viewport.scrollLeft = playheadX - width * 0.3;
      } else if (playheadX < scrollLeft) {
        viewport.scrollLeft = playheadX;
      }
    }
  }, [currentTime, isPlaying, scale]);

  // Find active video frame at currentTime for monitor rendering (reads from stateful timelineClips)
  const activeVideoClip = timelineClips.find(
    (clip) => clip.track === "v1" && currentTime >= clip.start && currentTime < clip.start + clip.duration
  );

  // Parse active styling classes for monitor frame updates
  const monitorProps = activeVideoClip ? getClipProperties(activeVideoClip.id) : defaultClipProperties;
  const activeTextOverlay = timelineClips.find(
    (clip) => clip.track === "v2" && clip.type === "text" && currentTime >= clip.start && currentTime < clip.start + clip.duration
  );
  const activeStickerOverlay = timelineClips.find(
    (clip) => clip.track === "v2" && clip.type === "sticker" && currentTime >= clip.start && currentTime < clip.start + clip.duration
  );

  // Time conversion helper MM:SS:FF (assuming 30fps)
  const formatTimecode = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    const frames = Math.floor((secs % 1) * 30);
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  // Playback handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevFrame = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.max(0, prev - 1 / 30));
  };

  const handleNextFrame = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.min(duration, prev + 1 / 30));
  };

  const handleSkipBack = () => {
    setCurrentTime((prev) => Math.max(0, prev - 5));
  };

  const handleSkipForward = () => {
    setCurrentTime((prev) => Math.min(duration, prev + 5));
  };

  // Ruler scrubbing handler
  const handleRulerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollOffset = timelineViewportRef.current ? timelineViewportRef.current.scrollLeft : 0;
    
    const updateScrub = (clientX: number) => {
      const relativeX = clientX - rect.left + scrollOffset;
      const timeSecs = Math.max(0, Math.min(duration, relativeX / scale));
      setCurrentTime(timeSecs);
    };

    updateScrub(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateScrub(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Player scrubber click/drag handler
  const handleScrubberPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const updateTime = (clientX: number) => {
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setCurrentTime(fraction * duration);
    };

    updateTime(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateTime(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Setup time increments on ruler based on zoom level scale
  const getTimelineTicks = () => {
    const ticks = [];
    const step = zoom > 6 ? 5 : zoom > 3 ? 10 : 20; // grid interval
    for (let i = 0; i <= duration; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  // Phase 3 Drag & Drop from Library to Tracks
  const handleDropToLane = (e: React.DragEvent<HTMLDivElement>, laneId: "v1" | "v2" | "a1") => {
    e.preventDefault();
    if (trackLocks[laneId]) return; // prevent drop if locked

    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const assetData = JSON.parse(dataStr) as Asset;

      const rect = e.currentTarget.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropTime = Math.max(0, dropX / scale);

      // Determine color theme based on asset type
      let color = "bg-rose-950/80 border-rose-500/40 text-rose-200";
      if (assetData.type === "audio") {
        color = "bg-cyan-950/80 border-cyan-500/40 text-cyan-200";
      } else if (assetData.type === "text") {
        color = "bg-indigo-950/80 border-indigo-500/40 text-indigo-200";
      } else if (assetData.type === "sticker") {
        color = "bg-yellow-950/80 border-yellow-500/40 text-yellow-200";
      } else if (assetData.type === "effect") {
        color = "bg-purple-950/80 border-purple-500/40 text-purple-200";
      } else if (assetData.type === "filter") {
        color = "bg-emerald-950/80 border-emerald-500/40 text-emerald-200";
      }

      const newClip: TimelineClip = {
        id: `${assetData.id}-${Date.now()}`,
        title: assetData.title,
        track: laneId,
        start: dropTime,
        duration: assetData.type === "video" ? 15 : assetData.type === "audio" ? 20 : 8,
        color,
        type: assetData.type,
        thumbnail: assetData.thumbnail,
        category: assetData.category,
      };

      const updated = [...timelineClips, newClip];
      setTimelineClips(updated);
      saveToHistory(updated);
      setSelectedAsset(newClip as unknown as Asset);
    } catch (err) {
      console.error("Drop creation failed", err);
    }
  };

  // Phase 3 Click-and-Drag clip start positioning on track
  const handleClipDragStart = (e: React.PointerEvent<HTMLDivElement>, clipId: string, trackId: string) => {
    e.stopPropagation();
    if (trackLocks[trackId]) return; // block if locked

    const startX = e.clientX;
    const targetClip = timelineClips.find((c) => c.id === clipId);
    if (!targetClip) return;
    const originalStart = targetClip.start;

    // Immediately select clip details
    setSelectedAsset(targetClip as unknown as Asset);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / scale;
      let newStart = Math.max(0, originalStart + deltaTime);

      // Snapping to integer values if near boundary
      if (Math.abs(newStart - Math.round(newStart)) < 0.15) {
        newStart = Math.round(newStart);
      }

      setTimelineClips((prev) =>
        prev.map((c) => (c.id === clipId ? { ...c, start: newStart } : c))
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      // Save history snapshot on drag completion
      setTimelineClips((curr) => {
        saveToHistory(curr);
        return curr;
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Phase 3 Left Trim Clip Handle Dragging
  const handleTrimLeftStart = (e: React.PointerEvent<HTMLSpanElement>, clipId: string, trackId: string) => {
    e.stopPropagation();
    if (trackLocks[trackId]) return;

    const startX = e.clientX;
    const targetClip = timelineClips.find((c) => c.id === clipId);
    if (!targetClip) return;
    const originalStart = targetClip.start;
    const originalDuration = targetClip.duration;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / scale;

      // Maintain a minimum duration of 0.5s
      const maxStart = originalStart + originalDuration - 0.5;
      const newStart = Math.max(0, Math.min(maxStart, originalStart + deltaTime));
      const newDuration = originalDuration - (newStart - originalStart);

      setTimelineClips((prev) =>
        prev.map((c) =>
          c.id === clipId ? { ...c, start: newStart, duration: newDuration } : c
        )
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      // Save history snapshot
      setTimelineClips((curr) => {
        saveToHistory(curr);
        return curr;
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Phase 3 Right Trim Clip Handle Dragging
  const handleTrimRightStart = (e: React.PointerEvent<HTMLSpanElement>, clipId: string, trackId: string) => {
    e.stopPropagation();
    if (trackLocks[trackId]) return;

    const startX = e.clientX;
    const targetClip = timelineClips.find((c) => c.id === clipId);
    if (!targetClip) return;
    const originalDuration = targetClip.duration;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = deltaX / scale;
      const newDuration = Math.max(0.5, originalDuration + deltaTime);

      setTimelineClips((prev) =>
        prev.map((c) => (c.id === clipId ? { ...c, duration: newDuration } : c))
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      // Save history snapshot
      setTimelineClips((curr) => {
        saveToHistory(curr);
        return curr;
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Phase 3 Zoom slider interactive click/drag handler
  const handleZoomTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    const updateZoomVal = (clientX: number) => {
      const relativeX = clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, relativeX / rect.width));
      const newZoom = Math.round(1 + fraction * 9);
      setZoom(newZoom);
    };

    updateZoomVal(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateZoomVal(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Phase 4 Stateful Track controls
  const toggleMute = (track: "v2" | "v1" | "a1") => {
    setTrackMutes((prev) => ({ ...prev, [track]: !prev[track] }));
  };

  const toggleLock = (track: "v2" | "v1" | "a1") => {
    setTrackLocks((prev) => ({ ...prev, [track]: !prev[track] }));
  };

  const toggleHide = (track: "v2" | "v1" | "a1") => {
    setTrackHides((prev) => ({ ...prev, [track]: !prev[track] }));
  };

  // Phase 4 Key listeners registration for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is editing inputs/text areas
      const isInput = document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA";
      if (isInput) return;

      // Delete/Backspace shortcut
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedAsset) {
          setTimelineClips((prev) => {
            const updated = prev.filter((c) => c.id !== selectedAsset.id);
            saveToHistory(updated);
            return updated;
          });
          setSelectedAsset(null);
        }
      }

      // Ctrl + C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (selectedAsset) {
          const clipToCopy = timelineClips.find((c) => c.id === selectedAsset.id);
          if (clipToCopy) {
            copiedClipRef.current = clipToCopy;
          }
        }
      }

      // Ctrl + V (Paste)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (copiedClipRef.current) {
          const pasted: TimelineClip = {
            ...copiedClipRef.current,
            id: `pasted-${Date.now()}`,
            start: currentTime,
          };
          setTimelineClips((prev) => {
            const updated = [...prev, pasted];
            saveToHistory(updated);
            return updated;
          });
          setSelectedAsset(pasted as unknown as Asset);
        }
      }

      // Ctrl + Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (historyIndexRef.current > 0) {
          historyIndexRef.current -= 1;
          const prevClips = historyRef.current[historyIndexRef.current];
          setTimelineClips(prevClips);
          setSelectedAsset(null);
        }
      }

      // Ctrl + Y (Redo)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyIndexRef.current += 1;
          const nextClips = historyRef.current[historyIndexRef.current];
          setTimelineClips(nextClips);
          setSelectedAsset(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAsset, timelineClips, currentTime]);

  return (
    <section id="skills" className="scroll-mt-28 py-24 md:py-32 w-full">
      <span className="hidden" aria-hidden="true">{skills.join(", ")}</span>
      <div className="w-full max-w-[1540px] mx-auto px-4 md:px-8">
        <div data-reveal className="mb-10 max-w-3xl">
          <span className="section-label">Toolkit Workspace</span>
          <h2 className="mt-7 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
            Interactive Editing Suite
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#3d1f35]/70 md:text-lg">
            Experience a professional-grade post-production workflow simulated directly in the browser. Select assets, customize clip parameters, and preview edit states in this desktop editor mock.
          </p>
        </div>

        {/* CapCut Pro Dark Interface Window */}
        <div
          data-reveal
          className="relative mx-auto w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#0c0c0e] text-zinc-300 shadow-[0_32px_90px_rgba(0,0,0,0.45)]"
        >
          {/* Header Window Bar */}
          <div className="flex h-12 items-center justify-between border-b border-zinc-900 bg-[#0e0e11] px-4 select-none">
            {/* Window controls (Mac style) */}
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f56]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#27c93f]" />
              <span className="ml-4 text-xs font-medium tracking-wide text-zinc-500 uppercase">CapCut Pro Workspace</span>
            </div>

            {/* Project Title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold tracking-wider text-zinc-400">
              Ampita_Das_Reel_2026 - CapCut Pro Desktop
            </div>

            {/* Layout controls & Export */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center rounded-lg bg-zinc-900/60 p-1 border border-zinc-800/80 md:flex">
                <button type="button" className="rounded-md px-2 py-0.5 text-[10px] uppercase font-bold bg-zinc-800 text-white">Edit</button>
                <button type="button" className="rounded-md px-2 py-0.5 text-[10px] uppercase font-bold text-zinc-500 hover:text-zinc-300">Player</button>
              </div>
              <button
                type="button"
                className="rounded-full bg-[linear-gradient(115deg,#FE9EC7,#44ACFF)] px-4 py-1 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:opacity-90 shadow-sm transition-all"
              >
                Export
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid h-[580px] grid-cols-[auto_1fr] grid-rows-[1fr_auto] md:h-[640px]">
            
            {/* Sidebar & Assets Column Group */}
            <div className="flex border-r border-zinc-900 bg-[#0a0a0c] overflow-hidden">
              
              {/* Vertical Sidebar */}
              <div className="flex w-[82px] flex-col gap-1 border-r border-zinc-900 bg-[#0e0e11] py-3 overflow-y-auto capcut-scrollbar">
                {sidebarTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 gap-1.5 rounded-xl mx-2.5 transition-all duration-200 group ${
                      activeTab === tab.id
                        ? "bg-zinc-800 text-white font-bold"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                    }`}
                  >
                    <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === tab.id ? "text-[#FE9EC7]" : "text-zinc-400"}`}>
                      {tab.icon}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-center truncate w-full">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Assets List Panel */}
              <div className="flex w-[260px] flex-col bg-[#0d0d10] p-4 md:w-[300px]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">{activeTab.replace("_", " ")} Library</h3>
                  <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[9px] font-semibold text-zinc-500">
                    {activeAssets.length} items
                  </span>
                </div>

                {/* Assets Grid List */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 capcut-scrollbar">
                  {activeAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/json", JSON.stringify(asset));
                      }}
                      onClick={() => setSelectedAsset(asset)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-2 text-left cursor-grab active:cursor-grabbing transition-all ${
                        selectedAsset?.id === asset.id
                          ? "border-[#FE9EC7]/40 bg-[#16161c] shadow-[0_0_12px_rgba(254,158,199,0.06)]"
                          : "border-zinc-800/40 bg-zinc-950/40 hover:border-zinc-700/80 hover:bg-zinc-900/40"
                      }`}
                    >
                      {/* Thumbnail / Symbol */}
                      {asset.thumbnail ? (
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-800 pointer-events-none">
                          <Image src={asset.thumbnail} alt={asset.title} fill className="object-cover" sizes="80px" />
                          <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.2 text-[8px] text-zinc-300">
                            {asset.duration}
                          </span>
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-[#0f0f12] text-xl pointer-events-none">
                          {asset.type === "audio" ? "🎵" : asset.type === "text" ? "📝" : asset.type === "sticker" ? "⭐" : "✨"}
                        </div>
                      )}

                      {/* Info Details */}
                      <div className="flex-1 min-w-0 py-0.5 pointer-events-none">
                        <p className="truncate text-xs font-bold text-zinc-200">{asset.title}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-wide text-zinc-500">{asset.category}</p>
                        {asset.duration && !asset.thumbnail && (
                          <span className="mt-1.5 inline-block text-[8px] font-semibold text-zinc-400 bg-zinc-900 px-1 py-0.2 rounded">
                            {asset.duration}
                          </span>
                        )}
                      </div>

                      {/* Add button symbol */}
                      <span className="self-center text-sm font-bold text-zinc-600 hover:text-zinc-300 px-1">+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Player & Right Properties Panel Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] bg-[#0c0c0f] overflow-hidden">
              
              {/* Center Video Player Panel */}
              <div className="flex flex-col items-center justify-between p-4 border-b border-zinc-900 bg-[#09090b]">
                
                {/* Aspect ratio selector bar */}
                <div className="flex w-full items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Player Preview</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">Ratio:</span>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-300 outline-none border border-zinc-800"
                    >
                      <option value="16:9">16:9 Landscape</option>
                      <option value="9:16">9:16 Portrait</option>
                      <option value="1:1">1:1 Square</option>
                    </select>
                  </div>
                </div>

                {/* Video Monitor Frame Canvas */}
                <div className="flex-1 flex items-center justify-center py-4 w-full select-none">
                  <div
                    className={`relative overflow-hidden border border-zinc-800 bg-[#070709] shadow-inner transition-all duration-300 flex flex-col justify-center items-center ${
                      aspectRatio === "16:9"
                        ? "aspect-video h-[180px] md:h-[220px] max-w-full"
                        : aspectRatio === "9:16"
                          ? "aspect-[9/16] h-[220px] md:h-[260px]"
                          : "aspect-square h-[190px] md:h-[230px]"
                    }`}
                  >
                    {/* Render active clip based on playhead or selected asset */}
                    {!trackHides["v1"] && activeVideoClip && activeVideoClip.thumbnail ? (
                      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={activeVideoClip.thumbnail}
                          alt="Monitor Frame"
                          fill
                          style={{
                            transform: `translate(${monitorProps.positionX}px, ${monitorProps.positionY}px) scale(${monitorProps.scale / 100}) rotate(${monitorProps.rotation}deg)`,
                            opacity: monitorProps.opacity / 100,
                            filter: `blur(${monitorProps.blur}px) brightness(${100 + monitorProps.brightness}%) contrast(${100 + monitorProps.contrast}%) saturate(${100 + monitorProps.saturation}%)`,
                          }}
                          className="object-cover pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                        {/* Status bar details HUD */}
                        <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 text-[8px] font-mono text-zinc-400 pointer-events-none">
                          1920x1080 | 30fps
                        </div>
                      </div>
                    ) : selectedAsset && selectedAsset.thumbnail ? (
                      <div className="absolute inset-0">
                        <Image src={selectedAsset.thumbnail} alt="Preview Screen" fill className="object-cover opacity-60 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                        <span className="absolute top-2 left-2 text-[8px] font-semibold bg-zinc-900/80 text-zinc-400 px-1 py-0.2 rounded pointer-events-none">ASSET INSPECT</span>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-3xl opacity-35">🎬</span>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600">Preview Monitor</p>
                        <p className="mt-1 text-[9px] text-zinc-700">Play the timeline or select a clip</p>
                      </div>
                    )}

                    {/* HUD Metadata overlay */}
                    {!trackHides["v1"] && activeVideoClip && (
                      <div className="absolute bottom-2 left-2 z-10 rounded bg-black/60 px-2 py-0.5 text-[9px] tracking-wide text-zinc-400 font-mono pointer-events-none">
                        PLAYING: <span className="font-semibold text-[#FE9EC7]">{activeVideoClip.title}</span>
                      </div>
                    )}

                    {/* Render active Text Overlay from Track V2 */}
                    {!trackHides["v2"] && activeTextOverlay && (
                      <div className="absolute z-20 pointer-events-none select-none text-center px-4 max-w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                        <p className="font-display text-lg md:text-2xl text-white tracking-wider uppercase font-semibold">
                          {activeTextOverlay.title}
                        </p>
                      </div>
                    )}

                    {/* Render active Sticker Overlay from Track V2 */}
                    {!trackHides["v2"] && activeStickerOverlay && (
                      <div className="absolute z-25 top-1/4 pointer-events-none select-none text-[32px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        {activeStickerOverlay.title.includes("Arrow") ? "🏹" : activeStickerOverlay.title.includes("Flare") ? "✨" : activeStickerOverlay.title.includes("Border") ? "🔲" : "⭐"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Player Playback Controls */}
                <div className="flex w-full flex-col gap-3 border-t border-zinc-900 pt-3">
                  <div className="flex items-center justify-between">
                    {/* Frame Step controls */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handlePrevFrame}
                        className="text-zinc-500 hover:text-zinc-200 text-sm font-semibold transition"
                        title="Previous Frame (1/30s)"
                      >
                        |◀
                      </button>
                      <button
                        type="button"
                        onClick={handleSkipBack}
                        className="text-zinc-500 hover:text-zinc-200 text-xs font-semibold transition"
                        title="Skip Back 5s"
                      >
                        ◀◀
                      </button>
                      <button
                        type="button"
                        onClick={handlePlayPause}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-zinc-900 shadow transition ${
                          isPlaying ? "bg-[#FE9EC7] hover:opacity-90" : "bg-zinc-200 hover:bg-white"
                        }`}
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSkipForward}
                        className="text-zinc-500 hover:text-zinc-200 text-xs font-semibold transition"
                        title="Skip Forward 5s"
                      >
                        ▶▶
                      </button>
                      <button
                        type="button"
                        onClick={handleNextFrame}
                        className="text-zinc-500 hover:text-zinc-200 text-sm font-semibold transition"
                        title="Next Frame (1/30s)"
                      >
                        ▶|
                      </button>
                    </div>

                    {/* Time codes */}
                    <div className="text-[11px] font-mono text-zinc-500">
                      <span className="text-[#FE9EC7] font-semibold">{formatTimecode(currentTime)}</span>
                      <span className="mx-1.5">/</span>
                      <span>{formatTimecode(duration)}</span>
                    </div>

                    {/* Fullscreen & Volume icon indicators */}
                    <div className="flex items-center gap-3">
                      <button type="button" className={`text-sm transition ${trackMutes["a1"] ? "text-red-400" : "text-zinc-500 hover:text-zinc-300"}`} onClick={() => toggleMute("a1")} title="Mute Volume">
                        {trackMutes["a1"] ? "🔇" : "🔊"}
                      </button>
                      <button type="button" className="text-zinc-500 hover:text-zinc-300 text-sm" title="Fullscreen">⛶</button>
                    </div>
                  </div>

                  {/* Scrubber progress bar */}
                  <div
                    onPointerDown={handleScrubberPointerDown}
                    className="h-2 w-full rounded-full bg-zinc-900 relative cursor-pointer group"
                  >
                    <div
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                      className="absolute left-0 top-0 h-full bg-[#FE9EC7] rounded-full"
                    />
                    <div
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md border border-[#FE9EC7] scale-0 group-hover:scale-100 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* Right Details/Properties Panel */}
              <div className="hidden lg:flex flex-col bg-[#0b0b0d] border-l border-zinc-900 overflow-y-auto w-full select-none capcut-scrollbar">
                
                {/* Properties Header */}
                <div className="p-4 border-b border-zinc-900">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Inspector Panel</h3>
                </div>

                {/* Render selected asset options */}
                {selectedAsset ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* Tab Selection */}
                    <div className="flex border-b border-zinc-900 bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-center">
                      <button
                        onClick={() => setInspectorTab("video")}
                        className={`flex-1 py-2.5 border-b-2 transition ${
                          inspectorTab === "video" ? "border-[#FE9EC7] text-zinc-200" : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Video
                      </button>
                      <button
                        onClick={() => setInspectorTab("audio")}
                        className={`flex-1 py-2.5 border-b-2 transition ${
                          inspectorTab === "audio" ? "border-[#FE9EC7] text-zinc-200" : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Audio
                      </button>
                      <button
                        onClick={() => setInspectorTab("speed")}
                        className={`flex-1 py-2.5 border-b-2 transition ${
                          inspectorTab === "speed" ? "border-[#FE9EC7] text-zinc-200" : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Speed
                      </button>
                    </div>

                    {/* Inspector Scroll Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs capcut-scrollbar">
                      
                      {/* Shared Metadata details */}
                      <div className="bg-zinc-950/40 rounded-xl p-3 border border-zinc-900/60 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 text-[9px] uppercase font-semibold">Title</span>
                          <span className="text-zinc-300 truncate w-32 text-right font-mono text-[10px]">{selectedAsset.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 text-[9px] uppercase font-semibold">Type</span>
                          <span className="text-zinc-300 capitalize text-[10px]">{selectedAsset.type}</span>
                        </div>
                      </div>

                      {/* Text Asset Custom Input */}
                      {selectedAsset.type === "text" && (
                        <div className="space-y-1.5 border-b border-zinc-900 pb-4">
                          <span className="text-[9px] uppercase tracking-wide text-zinc-400 font-bold">Edit Text Title</span>
                          <input
                            type="text"
                            value={selectedAsset.title}
                            onChange={(e) => {
                              const nextVal = e.target.value;
                              setSelectedAsset((prev) => (prev ? { ...prev, title: nextVal } : null));
                              setTimelineClips((prev) => {
                                const updated = prev.map((c) => (c.id === selectedAsset.id ? { ...c, title: nextVal } : c));
                                return updated;
                              });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 outline-none focus:border-[#FE9EC7] text-zinc-200 font-mono"
                          />
                        </div>
                      )}

                      {/* Tab: Video */}
                      {inspectorTab === "video" && (
                        <div className="space-y-4">
                          {/* Scale */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Scale</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).scale}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="200"
                              value={getClipProperties(selectedAsset.id).scale}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "scale", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          {/* Opacity */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Opacity</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).opacity}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={getClipProperties(selectedAsset.id).opacity}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "opacity", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          {/* Rotation */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Rotation</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).rotation}°</span>
                            </div>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              value={getClipProperties(selectedAsset.id).rotation}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "rotation", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          {/* Position X */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Position X</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).positionX}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={getClipProperties(selectedAsset.id).positionX}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "positionX", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          {/* Position Y */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Position Y</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).positionY}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={getClipProperties(selectedAsset.id).positionY}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "positionY", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          {/* Blur */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Gaussian Blur</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).blur}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={getClipProperties(selectedAsset.id).blur}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "blur", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          {/* Color Correction */}
                          <div className="border-t border-zinc-900 pt-3 mt-3 space-y-3">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 block">Color Correction</span>

                            {/* Brightness */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-zinc-400 text-[11px]">Brightness</span>
                                <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).brightness}</span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={getClipProperties(selectedAsset.id).brightness}
                                onChange={(e) => updateClipProperty(selectedAsset.id, "brightness", parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#44ACFF]"
                              />
                            </div>

                            {/* Contrast */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-zinc-400 text-[11px]">Contrast</span>
                                <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).contrast}</span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={getClipProperties(selectedAsset.id).contrast}
                                onChange={(e) => updateClipProperty(selectedAsset.id, "contrast", parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#44ACFF]"
                              />
                            </div>

                            {/* Saturation */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-zinc-400 text-[11px]">Saturation</span>
                                <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).saturation}</span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={getClipProperties(selectedAsset.id).saturation}
                                onChange={(e) => updateClipProperty(selectedAsset.id, "saturation", parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#44ACFF]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab: Audio */}
                      {inspectorTab === "audio" && (
                        <div className="space-y-4">
                          {/* Volume */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Volume</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).volume}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={getClipProperties(selectedAsset.id).volume}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "volume", parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#44ACFF]"
                            />
                          </div>

                          {/* Fade In */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Fade In Duration</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).fadeIn}s</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="0.1"
                              value={getClipProperties(selectedAsset.id).fadeIn}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "fadeIn", parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#44ACFF]"
                            />
                          </div>

                          {/* Fade Out */}
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Fade Out Duration</span>
                              <span className="text-[10px] font-mono text-zinc-500">{getClipProperties(selectedAsset.id).fadeOut}s</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="0.1"
                              value={getClipProperties(selectedAsset.id).fadeOut}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "fadeOut", parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#44ACFF]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Tab: Speed */}
                      {inspectorTab === "speed" && (
                        <div className="space-y-4">
                          {/* Speed Multiplier */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Speed Ratio</span>
                              <span className="text-[10.5px] font-bold text-[#FE9EC7] font-mono">{getClipProperties(selectedAsset.id).speed.toFixed(1)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.2"
                              max="5.0"
                              step="0.1"
                              value={getClipProperties(selectedAsset.id).speed}
                              onChange={(e) => updateClipProperty(selectedAsset.id, "speed", parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FE9EC7]"
                            />
                          </div>

                          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-[10px] leading-5 text-zinc-500">
                            <p>💡 Speed adjustment alters playback rendering timing on real video tracks. Fast forwarding shifts duration in workspace displays.</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-2xl text-zinc-700">⚙️</span>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Inspector Empty</p>
                    <p className="mt-1 text-[9px] text-zinc-600">Select an asset from the library or click a timeline clip to inspect attributes.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Timeline Panel Section */}
            <div className="col-span-full border-t border-zinc-900 bg-[#070709] p-4 flex flex-col gap-2.5">
              
              {/* Timeline Header Toolbar */}
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2 select-none">
                <div className="flex items-center gap-4">
                  {/* Track Actions */}
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Tracks Layout</span>
                  <div className="flex items-center gap-1 bg-zinc-950 rounded px-1.5 py-0.5 border border-zinc-900">
                    <span className="text-[9px] text-zinc-600">Magnet</span>
                    <span className="text-[9px] font-bold text-zinc-400">ON</span>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-950 rounded px-1.5 py-0.5 border border-zinc-900">
                    <span className="text-[9px] text-zinc-600">Snap</span>
                    <span className="text-[9px] font-bold text-[#FE9EC7]">ON</span>
                  </div>
                  
                  {/* Phase 4 Undo / Redo visual indicators */}
                  <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (historyIndexRef.current > 0) {
                          historyIndexRef.current -= 1;
                          setTimelineClips(historyRef.current[historyIndexRef.current]);
                          setSelectedAsset(null);
                        }
                      }}
                      className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300"
                      title="Undo (Ctrl+Z)"
                    >
                      ↶ Undo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (historyIndexRef.current < historyRef.current.length - 1) {
                          historyIndexRef.current += 1;
                          setTimelineClips(historyRef.current[historyIndexRef.current]);
                          setSelectedAsset(null);
                        }
                      }}
                      className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300"
                      title="Redo (Ctrl+Y)"
                    >
                      ↷ Redo
                    </button>
                  </div>
                </div>

                {/* Timeline zoom slider container */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-600 font-semibold">ZOOM:</span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(1, z - 1))}
                    className="text-zinc-500 hover:text-zinc-300 text-xs px-1 font-bold"
                  >
                    -
                  </button>
                  <div
                    onPointerDown={handleZoomTrackPointerDown}
                    className="h-2 w-24 bg-zinc-900 rounded-full relative cursor-pointer"
                  >
                    <div
                      style={{ width: `${((zoom - 1) / 9) * 100}%` }}
                      className="absolute left-0 top-0 h-full bg-[#FE9EC7] rounded-full"
                    />
                    <div
                      style={{ left: `${((zoom - 1) / 9) * 100}%` }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white border border-[#FE9EC7]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(10, z + 1))}
                    className="text-zinc-500 hover:text-zinc-300 text-xs px-1 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Timeline Tracks Area Grid */}
              <div className="grid grid-cols-[110px_1fr] border border-zinc-900 bg-[#09090b]/80 rounded-xl overflow-hidden min-h-[140px]">
                
                {/* Track Headers Controls Column */}
                <div className="flex flex-col border-r border-zinc-900 bg-[#0c0c0e] select-none">
                  {/* Ruler header gap */}
                  <div className="h-8 border-b border-zinc-900 flex items-center px-3">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-zinc-600">Tracks</span>
                  </div>
                  
                  {/* Track rows labels */}
                  <div className="flex-1 flex flex-col justify-around py-1 font-mono text-[9px] text-zinc-500">
                    {/* Track V2 */}
                    <div className="flex items-center justify-between px-3 h-7 border-b border-zinc-900/30">
                      <span className={`font-bold transition ${trackLocks["v2"] ? "text-red-500" : trackHides["v2"] ? "text-zinc-600" : "text-zinc-400"}`}>V2 (Overlay)</span>
                      <div className="flex items-center gap-1.5 text-[8px]">
                        <span title="Hide track" className="cursor-pointer hover:text-zinc-300" onClick={() => toggleHide("v2")}>
                          {trackHides["v2"] ? "🙈" : "👁️"}
                        </span>
                        <span title="Lock track" className="cursor-pointer hover:text-zinc-300" onClick={() => toggleLock("v2")}>
                          {trackLocks["v2"] ? "🔒" : "🔓"}
                        </span>
                      </div>
                    </div>

                    {/* Track V1 */}
                    <div className="flex items-center justify-between px-3 h-7 border-b border-zinc-900/30">
                      <span className={`font-bold transition ${trackLocks["v1"] ? "text-red-500" : trackHides["v1"] ? "text-zinc-600" : "text-[#FE9EC7]"}`}>V1 (Video)</span>
                      <div className="flex items-center gap-1.5 text-[8px]">
                        <span title="Hide track" className="cursor-pointer hover:text-zinc-300" onClick={() => toggleHide("v1")}>
                          {trackHides["v1"] ? "🙈" : "👁️"}
                        </span>
                        <span title="Lock track" className="cursor-pointer hover:text-zinc-300" onClick={() => toggleLock("v1")}>
                          {trackLocks["v1"] ? "🔒" : "🔓"}
                        </span>
                      </div>
                    </div>

                    {/* Track A1 */}
                    <div className="flex items-center justify-between px-3 h-7 border-b border-zinc-900/30">
                      <span className={`font-bold transition ${trackLocks["a1"] ? "text-red-500" : trackMutes["a1"] ? "text-zinc-600" : "text-[#44ACFF]"}`}>A1 (Audio)</span>
                      <div className="flex items-center gap-1.5 text-[8px]">
                        <span title="Mute track" className="cursor-pointer hover:text-zinc-300" onClick={() => toggleMute("a1")}>
                          {trackMutes["a1"] ? "🔇" : "🔊"}
                        </span>
                        <span title="Lock track" className="cursor-pointer hover:text-zinc-300" onClick={() => toggleLock("a1")}>
                          {trackLocks["a1"] ? "🔒" : "🔓"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracks Viewport Grid Area (Horizontal Scrollable) */}
                <div
                  ref={timelineViewportRef}
                  className="flex flex-col bg-[#070709] relative overflow-x-auto capcut-scrollbar select-none"
                >
                  
                  {/* Outer Wrapper set to exact timelineWidth */}
                  <div style={{ width: timelineWidth }} className="relative flex-1 flex flex-col min-h-[120px]">
                    
                    {/* Time Ruler (Ticks) */}
                    <div
                      onPointerDown={handleRulerPointerDown}
                      className="h-8 border-b border-zinc-900 bg-zinc-950/60 relative cursor-ew-resize select-none"
                    >
                      {getTimelineTicks().map((tick) => (
                        <div
                          key={tick}
                          style={{ left: tick * scale }}
                          className="absolute bottom-0 border-l border-zinc-700/80 h-3 pl-1 text-[8px] font-mono text-zinc-500"
                        >
                          {tick}s
                        </div>
                      ))}
                    </div>

                    {/* Track Lanes */}
                    <div className="flex-1 flex flex-col justify-around py-1 relative">
                      
                      {/* Vertical grid lines overlay */}
                      {getTimelineTicks().map((tick) => (
                        <div
                          key={`grid-${tick}`}
                          style={{ left: tick * scale }}
                          className="absolute top-0 bottom-0 border-l border-zinc-900/40 pointer-events-none z-0"
                        />
                      ))}

                      {/* Track V2 lane (Drop target) */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToLane(e, "v2")}
                        className="h-7 border-b border-zinc-900/30 relative flex items-center"
                      >
                        <div className="absolute inset-0 bg-zinc-900/10 pointer-events-none" />
                        {!trackHides["v2"] && timelineClips
                          .filter((clip) => clip.track === "v2")
                          .map((clip) => (
                            <div
                              key={clip.id}
                              style={{
                                left: clip.start * scale,
                                width: clip.duration * scale,
                              }}
                              className={`absolute h-6 rounded border text-[9px] font-semibold flex items-center justify-between text-left select-none transition ${clip.color} ${
                                selectedAsset?.id === clip.id ? "ring-2 ring-white/50 z-30" : "hover:brightness-110 z-10"
                              } ${trackLocks["v2"] ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {/* Left Trim Handle */}
                              <span
                                onPointerDown={(e) => handleTrimLeftStart(e, clip.id, "v2")}
                                className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/40 hover:bg-[#FE9EC7]/60 cursor-w-resize z-40 rounded-l"
                              />

                              {/* Drag/Click Center Body */}
                              <div
                                onPointerDown={(e) => handleClipDragStart(e, clip.id, "v2")}
                                className="flex-1 h-full flex items-center justify-between px-3 truncate cursor-grab active:cursor-grabbing"
                              >
                                <span className="truncate">{clip.title}</span>
                                <span className="text-[8px] opacity-50 shrink-0">{clip.duration.toFixed(1)}s</span>
                              </div>

                              {/* Right Trim Handle */}
                              <span
                                onPointerDown={(e) => handleTrimRightStart(e, clip.id, "v2")}
                                className="absolute right-0 top-0 bottom-0 w-2.5 bg-black/40 hover:bg-[#FE9EC7]/60 cursor-e-resize z-40 rounded-r"
                              />
                            </div>
                          ))}
                      </div>

                      {/* Track V1 lane (Drop target) */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToLane(e, "v1")}
                        className="h-7 border-b border-zinc-900/30 relative flex items-center"
                      >
                        <div className="absolute inset-0 bg-zinc-900/15 pointer-events-none" />
                        {!trackHides["v1"] && timelineClips
                          .filter((clip) => clip.track === "v1")
                          .map((clip) => (
                            <div
                              key={clip.id}
                              style={{
                                left: clip.start * scale,
                                width: clip.duration * scale,
                              }}
                              className={`absolute h-6 rounded border text-[9px] font-semibold flex items-center select-none transition overflow-hidden ${clip.color} ${
                                selectedAsset?.id === clip.id ? "ring-2 ring-white/50 z-30" : "hover:brightness-110 z-10"
                              } ${trackLocks["v1"] ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {/* Left Trim Handle */}
                              <span
                                onPointerDown={(e) => handleTrimLeftStart(e, clip.id, "v1")}
                                className="absolute left-0 top-0 bottom-0 w-2 bg-black/50 hover:bg-[#FE9EC7]/70 cursor-w-resize z-40 rounded-l"
                              />

                              {/* Drag/Click Center Body */}
                              <div
                                onPointerDown={(e) => handleClipDragStart(e, clip.id, "v1")}
                                className="flex-1 h-full flex items-center gap-1.5 pl-2.5 pr-2 truncate cursor-grab active:cursor-grabbing"
                              >
                                {clip.thumbnail && (
                                  <div className="relative h-full w-8 shrink-0 bg-zinc-800 border-r border-zinc-700/50 pointer-events-none">
                                    <Image src={clip.thumbnail} alt="" fill className="object-cover" />
                                  </div>
                                )}
                                <span className="truncate flex-1 text-left">{clip.title}</span>
                                <span className="text-[8px] opacity-50 shrink-0">{clip.duration.toFixed(1)}s</span>
                              </div>

                              {/* Right Trim Handle */}
                              <span
                                onPointerDown={(e) => handleTrimRightStart(e, clip.id, "v1")}
                                className="absolute right-0 top-0 bottom-0 w-2 bg-black/50 hover:bg-[#FE9EC7]/70 cursor-e-resize z-40 rounded-r"
                              />
                            </div>
                          ))}
                      </div>

                      {/* Track A1 lane (Drop target) */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToLane(e, "a1")}
                        className="h-7 border-b border-zinc-900/30 relative flex items-center"
                      >
                        <div className="absolute inset-0 bg-zinc-900/10 pointer-events-none" />
                        {timelineClips
                          .filter((clip) => clip.track === "a1")
                          .map((clip) => (
                            <div
                              key={clip.id}
                              style={{
                                left: clip.start * scale,
                                width: clip.duration * scale,
                              }}
                              className={`absolute h-6 rounded border text-[9px] font-semibold flex items-center justify-between text-left select-none transition ${clip.color} ${
                                selectedAsset?.id === clip.id ? "ring-2 ring-white/50 z-30" : "hover:brightness-110 z-10"
                              } ${trackLocks["a1"] ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {/* Left Trim Handle */}
                              <span
                                onPointerDown={(e) => handleTrimLeftStart(e, clip.id, "a1")}
                                className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/40 hover:bg-[#FE9EC7]/60 cursor-w-resize z-40 rounded-l"
                              />

                              {/* Drag/Click Center Body */}
                              <div
                                onPointerDown={(e) => handleClipDragStart(e, clip.id, "a1")}
                                className="flex-1 h-full flex items-center justify-between px-3 truncate cursor-grab active:cursor-grabbing"
                              >
                                <span className="truncate">🎵 {clip.title}</span>
                                <span className="text-[8px] opacity-50 shrink-0">{clip.duration.toFixed(1)}s</span>
                              </div>

                              {/* Right Trim Handle */}
                              <span
                                onPointerDown={(e) => handleTrimRightStart(e, clip.id, "a1")}
                                className="absolute right-0 top-0 bottom-0 w-2.5 bg-black/40 hover:bg-[#FE9EC7]/60 cursor-e-resize z-40 rounded-r"
                              />
                            </div>
                          ))}
                      </div>

                      {/* Playhead vertical line indicator inside scroll track */}
                      <div
                        style={{ left: currentTime * scale }}
                        className="absolute top-0 bottom-0 w-0.5 bg-[#FE9EC7] z-20 pointer-events-none shadow-[0_0_8px_#FE9EC7]"
                      >
                        <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FE9EC7] rounded-full border border-black" />
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

>>>>>>> origin/refactor-read-codebase
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

