"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type CSSProperties } from "react";
import Image from "next/image";
import workspaceBg from "@/assets/workspace.png";

// Web Audio API Synthesizer for magical Disney fairytale feedback sound
function playSynth(type: "swoosh" | "blip" | "melody") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "blip") {
      // Gentle enchanted sparkle chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "swoosh") {
      // Magic wand sparkle sweep
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === "melody") {
      // Disney fairytale arpeggio (C5, E5, G5, B5, C6)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        g.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.28);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + idx * 0.08);
        o.stop(ctx.currentTime + idx * 0.08 + 0.3);
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
  { id: "media", label: "Media", icon: "🎬" },
  { id: "audio", label: "Audio", icon: "🎵" },
  { id: "text", label: "Text", icon: "👑" },
  { id: "stickers", label: "Stickers", icon: "✨" },
  { id: "effects", label: "Effects", icon: "🪄" },
  { id: "filters", label: "Filters", icon: "🌸" },
  { id: "transitions", label: "Transitions", icon: "↔" },
  { id: "ai", label: "Magic AI", icon: "✦" },
  { id: "adjustment", label: "Adjust", icon: "⚙" },
  { id: "templates", label: "Castles", icon: "🏰" },
];

const mediaLibrary = [
  { id: "lib-video-1", title: "🏰 Castle Opening", kind: "video" as const, color: "#fe9ec7", url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" },
  { id: "lib-video-2", title: "✨ Starlight Flight", kind: "video" as const, color: "#89d4ff", url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4" },
  { id: "lib-video-3", title: "🌸 Enchanted Garden", kind: "video" as const, color: "#f472b6", url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-walking-through-a-forest-4833-large.mp4" },
  { id: "lib-video-4", title: "🏮 Floating Lanterns", kind: "video" as const, color: "#c084fc", url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-43063-large.mp4" }
];

const audioLibrary = [
  { id: "lib-audio-1", title: "🪄 Fairy Tale Waltz", kind: "audio" as const, color: "#f472b6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "lib-audio-2", title: "🌟 Starlight Lullaby", kind: "audio" as const, color: "#89d4ff", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "lib-audio-3", title: "🏰 Kingdom Fanfare", kind: "audio" as const, color: "#f9f6c4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

const textLibrary = [
  { id: "lib-text-1", title: "👑 Once Upon a Time", kind: "text" as const, color: "#f9f6c4", textContent: "ONCE UPON A TIME...", effectName: "Fairytale Title" },
  { id: "lib-text-2", title: "✨ Happily Ever After", kind: "text" as const, color: "#fe9ec7", textContent: "HAPPILY EVER AFTER", effectName: "Shimmer Glow" },
  { id: "lib-text-3", title: "🌸 Princess Storyteller", kind: "text" as const, color: "#89d4ff", textContent: "Princess Storyteller", effectName: "Royal Lower Third" }
];

const stickerLibrary = [
  { id: "lib-sticker-1", title: "Castle", kind: "text" as const, color: "#c084fc", textContent: "🏰", stickerEmoji: "🏰" },
  { id: "lib-sticker-2", title: "Royal Crown", kind: "text" as const, color: "#facc15", textContent: "👑", stickerEmoji: "👑" },
  { id: "lib-sticker-3", title: "Fairy Sparkle", kind: "text" as const, color: "#fe9ec7", textContent: "✨", stickerEmoji: "✨" },
  { id: "lib-sticker-4", title: "Magic Wand", kind: "text" as const, color: "#89d4ff", textContent: "🪄", stickerEmoji: "🪄" },
  { id: "lib-sticker-5", title: "Enchanted Rose", kind: "text" as const, color: "#f43f5e", textContent: "🌹", stickerEmoji: "🌹" },
  { id: "lib-sticker-6", title: "Ice Crystal", kind: "text" as const, color: "#67e8f9", textContent: "❄️", stickerEmoji: "❄️" },
  { id: "lib-sticker-7", title: "Silk Bow", kind: "text" as const, color: "#f472b6", textContent: "🎀", stickerEmoji: "🎀" },
  { id: "lib-sticker-8", title: "White Dove", kind: "text" as const, color: "#e2e8f0", textContent: "🕊️", stickerEmoji: "🕊️" }
];

const effectLibrary = [
  { id: "lib-effect-1", title: "Pixie Dust", effectName: "Pixie Dust" },
  { id: "lib-effect-2", title: "Royal Glow", effectName: "Royal Glow" },
  { id: "lib-effect-3", title: "Pastel Dream", effectName: "Pastel Dream" },
  { id: "lib-effect-4", title: "Cinema Scope", effectName: "Cinema Scope" }
];

const filterLibrary = [
  { id: "lib-filter-1", title: "Rose Quartz", filterName: "Rose Quartz" },
  { id: "lib-filter-2", title: "Ice Palace", filterName: "Ice Palace" },
  { id: "lib-filter-3", title: "Golden Hour", filterName: "Golden Hour" },
  { id: "lib-filter-4", title: "Midnight Dream", filterName: "Midnight Dream" }
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
        title: "🏰 Castle Opening",
        kind: "video",
        trackId: "track-video",
        start: 0.6,
        duration: 4.4,
        color: "#fe9ec7",
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
        title: "✨ Starlight Flight",
        kind: "video",
        trackId: "track-video",
        start: 7.4,
        duration: 3.6,
        color: "#89d4ff",
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
    name: "Waltz Audio",
    kind: "audio",
    muted: false,
    locked: false,
    hidden: false,
    clips: [
      {
        id: "clip-3",
        title: "🪄 Fairy Tale Waltz",
        kind: "audio",
        trackId: "track-audio",
        start: 0.8,
        duration: 6.2,
        color: "#c084fc",
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
    name: "Story Title",
    kind: "text",
    muted: false,
    locked: false,
    hidden: false,
    clips: [
      {
        id: "clip-4",
        title: "👑 Once Upon a Time",
        kind: "text",
        trackId: "track-text",
        start: 4.8,
        duration: 3.2,
        color: "#f9f6c4",
        position: 0,
        positionX: 0,
        positionY: 45,
        scale: 100,
        rotation: 0,
        opacity: 95,
        speed: 100,
        blur: 0,
        volume: 100,
        fadeIn: 0.1,
        fadeOut: 0.2,
        textContent: "ONCE UPON A TIME...",
        effectName: "Fairytale Title",
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
    case "Rose Quartz":
      return "sepia(0.2) saturate(1.5) hue-rotate(-15deg) contrast(1.08) brightness(1.05)";
    case "Ice Palace":
      return "hue-rotate(180deg) saturate(1.4) contrast(1.15) brightness(1.08)";
    case "Golden Hour":
      return "sepia(0.35) saturate(1.6) contrast(1.1) brightness(1.02)";
    case "Midnight Dream":
      return "hue-rotate(240deg) saturate(1.3) contrast(1.2) brightness(0.95)";
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
    // Fairytale graphic fallback
    return (
      <div
        onMouseDown={onPointerDown}
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center cursor-move select-none ${
          isSelected ? "border-2 border-dashed border-[#FE9EC7]" : ""
        }`}
        style={{
          transform: `translate(${clip.positionX ?? 0}px, ${clip.positionY ?? 0}px) scale(${(clip.scale ?? 100) / 100}) rotate(${clip.rotation ?? 0}deg)`,
          opacity: (clip.opacity ?? 100) / 100,
          filter: `blur(${clip.blur ?? 0}px) ${clip.filterName ? getFilterCSS(clip.filterName) : ""}`,
          background: `linear-gradient(135deg, ${clip.color}, #2a152d)`,
          width: "100%",
          height: "100%",
        }}
      >
        <span className="text-sm font-bold tracking-wider text-white/90">{clip.title}</span>
        <span className="text-[10px] text-white/50 mt-1">✨ Fairytale Reel • {(clip.duration).toFixed(1)}s</span>
        <div className="mt-2.5 flex gap-1 justify-center items-end h-5">
          <span className="w-1.5 bg-[#FE9EC7]/60 animate-[pulse_1s_infinite_100ms] h-3 rounded-full" />
          <span className="w-1.5 bg-[#F9F6C4]/80 animate-[pulse_1s_infinite_300ms] h-4 rounded-full" />
          <span className="w-1.5 bg-[#89D4FF]/60 animate-[pulse_1s_infinite_500ms] h-2.5 rounded-full" />
        </div>
        {isSelected && (
          <>
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 w-full h-full ${isSelected ? "border-2 border-dashed border-[#FE9EC7]" : ""}`}
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
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#FE9EC7] rounded-full shadow" />
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
        filter: "drop-shadow(0 0 12px rgba(254,158,199,0.75))",
        animation: clip.stickerEmoji === "✨" || clip.stickerEmoji === "🪄" ? "sparkle-float 2.5s ease-in-out infinite" : undefined,
      } as React.CSSProperties;
    }

    switch (clip.effectName) {
      case "Fairytale Title":
        return {
          ...baseStyle,
          fontFamily: "var(--font-display), 'Baskerville', serif",
          color: "#fff8db",
          textShadow: "0 0 16px rgba(254,158,199,0.9), 0 0 32px rgba(137,212,255,0.7), 0 2px 5px rgba(0,0,0,0.8)",
          fontWeight: "bold",
          fontSize: "28px",
          letterSpacing: "4px",
        } as React.CSSProperties;
      case "Shimmer Glow":
        return {
          ...baseStyle,
          color: "#FE9EC7",
          fontFamily: "var(--font-display), 'Baskerville', serif",
          fontWeight: "600",
          fontSize: "26px",
          letterSpacing: "5px",
          textShadow: "0 0 20px rgba(254,158,199,0.95), 0 0 35px rgba(249,246,196,0.8)",
        } as React.CSSProperties;
      case "Royal Lower Third":
        return {
          position: "absolute",
          left: "10%",
          bottom: "14%",
          transform: `translate(${clip.positionX ?? 0}px, ${clip.positionY ?? 0}px) scale(${(clip.scale ?? 100) / 100}) rotate(${clip.rotation ?? 0}deg)`,
          opacity: (clip.opacity ?? 100) / 100,
          filter: `blur(${clip.blur ?? 0}px)`,
          cursor: "move",
          pointerEvents: "auto",
          userSelect: "none",
          zIndex: 20,
          background: "linear-gradient(90deg, rgba(61,31,53,0.92), rgba(61,31,53,0.5))",
          borderLeft: "4px solid #FE9EC7",
          borderTop: "1px solid rgba(254,158,199,0.4)",
          borderBottom: "1px solid rgba(254,158,199,0.4)",
          padding: "6px 14px",
          color: "#f9f6c4",
          borderRadius: "0 12px 12px 0",
          fontSize: "13px",
          fontWeight: "600",
          letterSpacing: "2px",
          textShadow: "0 0 8px rgba(254,158,199,0.5)",
        } as React.CSSProperties;
      default:
        return {
          ...baseStyle,
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: "700",
          textShadow: "0 2px 10px rgba(0,0,0,0.85)",
        } as React.CSSProperties;
    }
  }, [clip]);

  return (
    <div
      onMouseDown={onPointerDown}
      style={textStyle}
      className={isSelected ? "outline-2 outline-dashed outline-[#FE9EC7] outline-offset-4" : ""}
    >
      {clip.textContent || clip.title}
      {isSelected && (
        <>
          <div className="absolute -top-1.5 -left-1.5 w-2 h-2 bg-white border border-[#FE9EC7] rounded-full pointer-events-none shadow" />
          <div className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-white border border-[#FE9EC7] rounded-full pointer-events-none shadow" />
          <div className="absolute -bottom-1.5 -left-1.5 w-2 h-2 bg-white border border-[#FE9EC7] rounded-full pointer-events-none shadow" />
          <div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 bg-white border border-[#FE9EC7] rounded-full pointer-events-none shadow" />
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

    const track = tracks.find((t) => t.id === clip.trackId);
    if (track?.locked) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const initialX = clip.positionX ?? 0;
    const initialY = clip.positionY ?? 0;

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
    
    const track = tracks.find((t) => t.id === clip.trackId);
    if (track?.locked) return;

    setSelectedClipId(clip.id);

    const startX = event.clientX;
    const initialStart = clip.start;
    const initialDuration = clip.duration;
    const currentTracks = [...tracks];

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
      color: asset.color || "#fe9ec7",
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
    <section id="skills" className="relative scroll-mt-28 py-16 md:py-24 overflow-hidden">
      {/* Decorative Atmosphere Background Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-120px),transparent_100%)] [webkit-mask-image:linear-gradient(180deg,transparent_0%,black_140px,black_calc(100%-120px),transparent_100%)]"
        aria-hidden="true"
      >
        <Image
          src={workspaceBg}
          alt=""
          fill
          className="object-cover object-center opacity-65 md:opacity-75 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Soft pastel and ambient glow overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f9]/50 via-transparent to-[#fff5f9]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,158,199,0.08),transparent_75%)]" />
      </div>

      {/* Dedicated seamless top transition */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-36 md:h-52 z-[1] bg-gradient-to-b from-[#fff5f9] via-[#fff5f9]/60 to-transparent"
        aria-hidden="true"
      />

      {/* Soft bottom blend into subsequent section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-40 z-[1] bg-gradient-to-t from-[#fff5f9] to-transparent"
        aria-hidden="true"
      />

      {/* Fairytale animations injected dynamically */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sparkle-float {
          0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 10px rgba(254,158,199,0.8)); }
          50% { transform: scale(1.1) translateY(-6px); filter: drop-shadow(0 0 20px rgba(249,246,196,0.95)); }
        }
        @keyframes pixie-drift {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .effect-pixie-dust {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #f9f6c4, transparent),
            radial-gradient(2px 2px at 60px 80px, #fe9ec7, transparent),
            radial-gradient(3px 3px at 120px 50px, #89d4ff, transparent),
            radial-gradient(2px 2px at 200px 140px, #f9f6c4, transparent),
            radial-gradient(3px 3px at 280px 100px, #ffffff, transparent);
          background-size: 300px 300px;
          animation: pixie-drift 6s linear infinite;
          opacity: 0.85;
          z-index: 25;
        }
        .effect-royal-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          box-shadow: inset 0 0 50px rgba(254,158,199,0.4), inset 0 0 90px rgba(249,246,196,0.3);
          mix-blend-mode: screen;
          z-index: 25;
        }
        .effect-pastel-dream {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(135deg, rgba(254,158,199,0.2), rgba(137,212,255,0.18));
          mix-blend-mode: soft-light;
          z-index: 25;
        }
      `}} />

      <div className="section-shell relative z-[2]">
        <div className="mb-6 md:mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl" data-reveal>
            <span className="section-label">Enchanted Studio Suite</span>
            <h2 className="mt-5 md:mt-6 font-display text-[clamp(2.1rem,5.5vw,3.6rem)] leading-[1.02] md:leading-[0.98] tracking-[-0.04em] text-[#3d1f35]">
              A magical editing workspace shaped with fairytale rhythm & glow.
            </h2>
            <p className="mt-3.5 md:mt-4 text-base leading-7 md:leading-8 text-[#3d1f35]/70 md:text-lg">
              Arrange royal clips, layer starlight audio, customize enchanted titles, and edit magical motion in real-time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-w-md lg:justify-end">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#FE9EC7]/35 bg-white/80 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#3d1f35]/75 shadow-sm backdrop-blur-sm transition hover:border-[#FE9EC7]/60 hover:bg-white hover:text-[#3d1f35]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scroll Helper Banner */}
        <div className="flex items-center justify-between rounded-full border border-[#FE9EC7]/30 bg-white/70 px-4 py-2 text-xs text-[#3d1f35]/80 backdrop-blur-sm mb-3.5 md:hidden shadow-sm">
          <span className="font-semibold flex items-center gap-1.5"><span>✨</span> Interactive Studio</span>
          <span className="text-[#FE9EC7] font-semibold text-[11px] tracking-wider uppercase">Swipe to edit ➔</span>
        </div>

        {/* Disney Fairytale Themed Editor Container */}
        <div className="overflow-x-auto rounded-[28px] md:rounded-[34px] border border-[#FE9EC7]/30 bg-gradient-to-br from-[#24132b]/95 via-[#1a0f23]/95 to-[#13091c]/95 shadow-[0_35px_120px_rgba(254,158,199,0.22),0_0_50px_rgba(137,212,255,0.12)] backdrop-blur-xl">
          <div className="flex min-w-[1120px] flex-row">
            {/* Sidebar Library Tabs */}
            <aside className="w-[230px] border-r border-[#FE9EC7]/15 p-3 flex flex-col bg-[#160b1e]/50">
              <div className="mb-3 text-[10px] uppercase tracking-[0.36em] text-[#FE9EC7]/70 font-semibold flex items-center gap-1.5">
                <span>✦</span> Tools
              </div>
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
                        ? "border-[#FE9EC7]/70 bg-gradient-to-b from-[#FE9EC7]/25 to-[#FE9EC7]/5 text-[#f9f6c4] shadow-[0_0_15px_rgba(254,158,199,0.3)]"
                        : "border-white/5 bg-white/5 text-pink-100/60 hover:border-[#FE9EC7]/30 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-semibold">{tool.icon}</span>
                    <span className="text-[10px] mt-1 tracking-wider">{tool.label}</span>
                  </button>
                ))}
              </div>

              {/* Sidebar Asset Lists */}
              <div className="flex-1 overflow-y-auto rounded-[20px] border border-[#FE9EC7]/20 bg-[#0e0614]/60 p-3 max-h-[380px]">
                <div className="font-semibold text-[#f9f6c4] flex items-center justify-between text-xs pb-2 border-b border-white/10 mb-3">
                  <span>{tools.find((t) => t.id === activeTool)?.label}</span>
                  <span className="text-[9px] text-[#FE9EC7] bg-[#FE9EC7]/15 border border-[#FE9EC7]/30 px-2 py-0.5 rounded-full font-mono uppercase">Magic Assets</span>
                </div>
                
                <div className="space-y-2">
                  {activeTool === "media" && mediaLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/40 border border-[#FE9EC7]/15 p-2 hover:border-[#FE9EC7]/40 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow" style={{ background: item.color, color: "#3d1f35" }}>🎬</div>
                        <span className="text-[11px] text-pink-100/90 truncate">{item.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addAssetToTimeline(item)}
                        className="rounded-lg bg-gradient-to-r from-[#FE9EC7] to-[#f9f6c4] hover:brightness-110 p-1 text-[#3d1f35] font-bold text-xs w-5 h-5 flex items-center justify-center transition shadow-sm"
                        title="Insert at Playhead"
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {activeTool === "audio" && audioLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/40 border border-[#FE9EC7]/15 p-2 hover:border-[#FE9EC7]/40 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow" style={{ background: item.color, color: "#3d1f35" }}>🎵</div>
                        <span className="text-[11px] text-pink-100/90 truncate">{item.title}</span>
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
                          className="rounded bg-white/10 hover:bg-white/20 px-1.5 py-0.5 text-pink-200 text-[9px]"
                          title="Preview"
                        >
                          ▶
                        </button>
                        <button
                          type="button"
                          onClick={() => addAssetToTimeline(item)}
                          className="rounded-lg bg-gradient-to-r from-[#FE9EC7] to-[#f9f6c4] hover:brightness-110 p-1 text-[#3d1f35] font-bold text-xs w-5 h-5 flex items-center justify-center transition shadow-sm"
                          title="Insert"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {activeTool === "text" && textLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/40 border border-[#FE9EC7]/15 p-2 hover:border-[#FE9EC7]/40 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-[#FE9EC7]/20 text-[#f9f6c4] border border-[#FE9EC7]/40 flex items-center justify-center font-bold text-xs">👑</div>
                        <span className="text-[11px] text-pink-100/90 truncate">{item.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addAssetToTimeline(item)}
                        className="rounded-lg bg-gradient-to-r from-[#FE9EC7] to-[#f9f6c4] hover:brightness-110 p-1 text-[#3d1f35] font-bold text-xs w-5 h-5 flex items-center justify-center transition shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  ))}

                  {activeTool === "stickers" && stickerLibrary.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between rounded-xl bg-black/40 border border-[#FE9EC7]/15 p-2 hover:border-[#FE9EC7]/40 transition">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-[#FE9EC7]/20 text-pink-200 border border-[#FE9EC7]/30 flex items-center justify-center text-[13px]">{item.stickerEmoji}</div>
                        <span className="text-[11px] text-pink-100/90 truncate">{item.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addAssetToTimeline(item)}
                        className="rounded-lg bg-gradient-to-r from-[#FE9EC7] to-[#f9f6c4] hover:brightness-110 p-1 text-[#3d1f35] font-bold text-xs w-5 h-5 flex items-center justify-center transition shadow-sm"
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
                          ? "border-[#FE9EC7] bg-[#FE9EC7]/20 text-[#f9f6c4] shadow-[0_0_10px_rgba(254,158,199,0.3)]"
                          : "border-white/5 bg-black/30 text-pink-100/80 hover:border-[#FE9EC7]/30"
                      }`}
                    >
                      <span>✨ {item.title}</span>
                      <span className="text-[9px] text-[#FE9EC7]/70">{selectedClip ? "Toggle" : "Select clip"}</span>
                    </button>
                  ))}

                  {activeTool === "filters" && filterLibrary.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => applyFilterToSelected(item.filterName)}
                      className={`flex w-full items-center justify-between rounded-xl border p-2 text-left text-[11px] transition ${
                        selectedClip?.filterName === item.filterName
                          ? "border-[#89D4FF] bg-[#89D4FF]/20 text-[#89D4FF] shadow-[0_0_10px_rgba(137,212,255,0.3)]"
                          : "border-white/5 bg-black/30 text-pink-100/80 hover:border-[#89D4FF]/30"
                      }`}
                    >
                      <span>🌸 {item.title}</span>
                      <span className="text-[9px] text-[#89D4FF]/70">{selectedClip ? "Toggle" : "Select clip"}</span>
                    </button>
                  ))}

                  {["transitions", "ai", "adjustment", "templates"].includes(activeTool) && (
                    <div className="text-[11px] text-pink-200/60 py-6 text-center leading-relaxed">
                      ✨ Fairytale options unlocked. Select Media, Audio, Text, Stickers, Effects, or Filters to cast edits.
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Video Player and Inspector panel */}
            <div className="flex-1 p-3 flex flex-col gap-3 min-w-0">
              <div className="rounded-[28px] border border-[#FE9EC7]/20 bg-[#160b20]/80 p-3 flex flex-col backdrop-blur-md">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#FE9EC7]/30 bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#f9f6c4]">✨ Fairytale Canvas</span>
                    <span className="rounded-full bg-[#FE9EC7]/15 border border-[#FE9EC7]/30 px-2.5 py-0.5 text-[10px] text-[#FE9EC7] font-mono">{resolution} • 60fps</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={resolution}
                      onChange={(event) => {
                        setResolution(event.target.value);
                        playSynth("blip");
                      }}
                      className="rounded-full border border-[#FE9EC7]/30 bg-[#24132b] px-3 py-1 text-xs text-pink-100 focus:outline-none"
                    >
                      <option value="1080p (16:9)" className="bg-[#24132b]">1080p (16:9)</option>
                      <option value="4K (16:9)" className="bg-[#24132b]">4K (16:9)</option>
                      <option value="Mobile (9:16)" className="bg-[#24132b]">Mobile (9:16)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        playSynth("melody");
                        alert("✨ Enchanted composition rendered successfully with fairytale magic!");
                      }}
                      className="rounded-full bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] px-4 py-1.5 text-xs font-bold text-[#3d1f35] transition hover:brightness-110 shadow-[0_0_15px_rgba(254,158,199,0.35)]"
                    >
                      Export Reel ✦
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                  {/* Left: Video Player Bezel */}
                  <div className="rounded-[24px] border border-[#FE9EC7]/15 bg-[#120719]/90 p-3 flex flex-col justify-between shadow-inner">
                    <div className="mb-2 flex items-center justify-between text-xs text-pink-200/70 font-mono">
                      <span>Timeline Head</span>
                      <span className="text-[#f9f6c4] font-semibold">{formatTime(playhead)} / {formatTime(totalDuration)}</span>
                    </div>

                    {/* Live Video Preview Window */}
                    <div className="flex-1 flex items-center justify-center py-2 bg-black/50 rounded-[20px] min-h-[300px] border border-white/5">
                      <div
                        className={`relative overflow-hidden rounded-[16px] border border-[#FE9EC7]/30 bg-[#0d0512] transition-all duration-300 shadow-[0_0_25px_rgba(254,158,199,0.15)] ${
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

                        {/* Video / Text elements */}
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

                        {/* Global Fairytale Visual Effects applied on top of player */}
                        {activeClips.some((c) => c.effectName === "Pixie Dust") && (
                          <div className="effect-pixie-dust" />
                        )}
                        {activeClips.some((c) => c.effectName === "Royal Glow") && (
                          <div className="effect-royal-glow" />
                        )}
                        {activeClips.some((c) => c.effectName === "Pastel Dream") && (
                          <div className="effect-pastel-dream" />
                        )}
                        {activeClips.some((c) => c.effectName === "Cinema Scope") && (
                          <div className="pointer-events-none absolute inset-0 z-30">
                            <div className="absolute top-0 inset-x-0 h-[22px] bg-black border-b border-[#FE9EC7]/20" />
                            <div className="absolute bottom-0 inset-x-0 h-[22px] bg-black border-t border-[#FE9EC7]/20" />
                          </div>
                        )}

                        {/* Ambient frame boundary */}
                        <div className="absolute inset-0 border border-white/5 pointer-events-none z-10" />
                      </div>
                    </div>

                    {/* Audio & Video Controls bar */}
                    <div className="mt-3 rounded-[16px] border border-[#FE9EC7]/20 bg-[#1e0e29]/90 p-2.5 backdrop-blur flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPlayhead(0);
                              playSynth("blip");
                            }}
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-pink-200 transition"
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
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-pink-200 transition"
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
                            className="rounded-full bg-gradient-to-r from-[#FE9EC7] via-[#f9f6c4] to-[#89D4FF] hover:brightness-110 px-4 py-1.5 text-xs font-bold text-[#3d1f35] transition shadow-[0_0_15px_rgba(254,158,199,0.35)]"
                          >
                            {isPlaying ? "⏸ Pause" : "▶ Play Reel"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPlayhead((v) => clamp(v + 0.5, 0, totalDuration));
                              playSynth("blip");
                            }}
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-pink-200 transition"
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
                            className="rounded-full bg-white/5 hover:bg-white/10 px-2 py-1.5 text-xs text-pink-200 transition"
                            title="Go to end"
                          >
                            ⏭
                          </button>
                        </div>

                        {/* Split Clip Toolbar */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={splitSelectedClip}
                            disabled={!selectedClip || playhead <= selectedClip.start || playhead >= selectedClip.start + selectedClip.duration}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition ${
                              selectedClip && playhead > selectedClip.start && playhead < selectedClip.start + selectedClip.duration
                                ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-110 text-white shadow-sm"
                                : "bg-white/5 text-pink-300/30 cursor-not-allowed"
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
                        className="h-1.5 w-full cursor-pointer accent-[#FE9EC7] bg-white/10 rounded-lg appearance-none"
                      />
                    </div>
                  </div>

                  {/* Right: Clip Properties Inspector Panel */}
                  <div className="rounded-[24px] border border-[#FE9EC7]/15 bg-[#120719]/90 p-3 flex flex-col max-h-[460px] overflow-y-auto">
                    <div className="text-xs font-semibold text-[#f9f6c4] border-b border-white/10 pb-2 mb-3 flex items-center gap-1.5">
                      <span>🪄</span> Royal Inspector
                    </div>
                    
                    {selectedClip ? (
                      <div className="space-y-3">
                        <div className="rounded-[16px] border border-[#FE9EC7]/20 bg-white/5 p-3">
                          <div className="text-xs text-pink-200/80">Clip Title</div>
                          <input
                            type="text"
                            value={selectedClip.title}
                            onChange={(e) => updateClip(selectedClip.id, (c) => ({ ...c, title: e.target.value }))}
                            className="mt-1.5 w-full rounded-lg border border-[#FE9EC7]/25 bg-[#200d2b]/80 px-2.5 py-1.5 text-xs text-pink-100 focus:border-[#FE9EC7] focus:outline-none"
                          />
                        </div>

                        {selectedClip.kind === "text" && (
                          <div className="rounded-[16px] border border-[#FE9EC7]/20 bg-white/5 p-3">
                            <div className="text-xs text-pink-200/80">Story Text Content</div>
                            <input
                              type="text"
                              value={selectedClip.textContent ?? ""}
                              onChange={(e) => updateClip(selectedClip.id, (c) => ({ ...c, textContent: e.target.value }))}
                              className="mt-1.5 w-full rounded-lg border border-[#FE9EC7]/25 bg-[#200d2b]/80 px-2.5 py-1.5 text-xs text-pink-100 focus:border-[#FE9EC7] focus:outline-none"
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
                          <label key={item.label} className="block rounded-[16px] border border-[#FE9EC7]/15 bg-white/5 p-2.5">
                            <div className="mb-1.5 flex items-center justify-between text-xs text-pink-100/90">
                              <span>{item.label}</span>
                              <span className="text-[#f9f6c4] font-mono text-[11px]">{item.value}{item.unit}</span>
                            </div>
                            <input
                              type="range"
                              min={item.min}
                              max={item.max}
                              value={item.value}
                              onChange={(e) => item.onChange(Number(e.target.value))}
                              className="h-1.5 w-full cursor-pointer accent-[#FE9EC7] bg-white/10 rounded-lg appearance-none"
                            />
                          </label>
                        ))}

                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateClip(selectedClip.id)}
                            className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-[#FE9EC7]/20 py-2 text-xs text-pink-100 transition"
                          >
                            👥 Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteClip(selectedClip.id)}
                            className="flex-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 py-2 text-xs text-rose-300 transition"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-10 px-4">
                        <div className="text-2xl mb-2">✨</div>
                        <p className="text-xs text-pink-200/60 leading-relaxed">
                          Select a clip in the enchanted timeline below to adjust scale, magical rotation, volume, and fairytale filters.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Multitrack Timeline Section */}
              <div className="rounded-[28px] border border-[#FE9EC7]/20 bg-[#160b20]/80 p-3 flex flex-col backdrop-blur-md">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-xs text-pink-200/80">
                    <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 font-semibold text-[#f9f6c4]">✨ Royal Timeline</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSnapping(!isSnapping);
                        playSynth("blip");
                      }}
                      className={`rounded-full px-2.5 py-0.5 border text-[10px] transition ${
                        isSnapping ? "border-[#FE9EC7] bg-[#FE9EC7]/20 text-[#f9f6c4]" : "border-white/10 text-pink-200/50"
                      }`}
                    >
                      🧲 Snapping: {isSnapping ? "On" : "Off"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => clamp(z - 0.15, 0.8, 2.2))}
                      className="rounded-full border border-[#FE9EC7]/20 bg-white/5 px-2.5 py-1 text-xs text-pink-100 hover:bg-white/10"
                    >
                      Zoom out
                    </button>
                    <span className="min-w-8 text-center text-xs font-mono text-[#f9f6c4]">{(zoom * 100).toFixed(0)}%</span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => clamp(z + 0.15, 0.8, 2.2))}
                      className="rounded-full border border-[#FE9EC7]/20 bg-white/5 px-2.5 py-1 text-xs text-pink-100 hover:bg-white/10"
                    >
                      Zoom in
                    </button>
                  </div>
                </div>

                {/* Multitrack timeline container */}
                <div className="overflow-hidden rounded-[20px] border border-[#FE9EC7]/20 bg-[#110619]/90">
                  <div className="flex flex-row overflow-x-auto select-none">
                    
                    {/* Sticky left headers */}
                    <div className="w-[150px] shrink-0 border-r border-[#FE9EC7]/20 bg-[#14081e] z-10 py-3 pl-3 space-y-3">
                      <div className="h-8 text-[9px] uppercase tracking-wider text-[#FE9EC7]/70 font-semibold flex items-center">
                        ✦ Layers
                      </div>
                      {tracks.map((track) => (
                        <div key={track.id} className="h-16 flex flex-col justify-center border-b border-white/5 last:border-0 pb-1.5">
                          <span className="text-[11px] font-bold text-pink-100 truncate">{track.name}</span>
                          <div className="mt-1 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, locked: !t.locked } : t)));
                                playSynth("blip");
                              }}
                              className={`rounded px-1.5 py-0.5 text-[8px] font-semibold font-mono ${
                                track.locked ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/5 text-pink-200/60"
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
                                track.muted ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-white/5 text-pink-200/60"
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
                          className="h-8 rounded-lg border border-[#FE9EC7]/15 bg-black/30 mb-3 relative cursor-ew-resize select-none"
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
                                  borderColor: isMajor ? "rgba(254,158,199,0.5)" : "rgba(255,255,255,0.08)",
                                }}
                              >
                                {isMajor && (
                                  <span className="absolute bottom-4 -left-3 text-[8px] font-mono text-[#f9f6c4]/80">
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
                                track.locked ? "border-amber-500/20 bg-[#1d1217]" : "border-[#FE9EC7]/15 bg-[#180922]/80"
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
                                    selectedClipId === clip.id ? "border-[#FE9EC7] ring-2 ring-[#FE9EC7]/60 shadow-[0_0_15px_rgba(254,158,199,0.5)]" : "border-white/20 hover:border-[#FE9EC7]/60"
                                  }`}
                                  style={{
                                    left: `${(clip.start / totalDuration) * 100}%`,
                                    width: `${(clip.duration / totalDuration) * 100}%`,
                                    background: `linear-gradient(135deg, ${clip.color}, rgba(28, 12, 36, 0.95))`,
                                  }}
                                >
                                  <div className="flex h-full flex-col justify-between py-0.5 truncate">
                                    <span className="font-bold truncate leading-tight text-white">{clip.title}</span>
                                    <span className="text-[8px] text-pink-100/70 leading-none">{clip.duration.toFixed(1)}s</span>
                                  </div>

                                  {/* Trim/resize handles */}
                                  {!track.locked && (
                                    <>
                                      <div
                                        onMouseDown={(event) => handleClipPointerDown(event, clip, "resize-left")}
                                        className="absolute left-0 top-0 bottom-0 w-2.5 cursor-w-resize rounded-l-lg hover:bg-[#FE9EC7]/50 active:bg-[#FE9EC7]"
                                      />
                                      <div
                                        onMouseDown={(event) => handleClipPointerDown(event, clip, "resize-right")}
                                        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-e-resize rounded-r-lg hover:bg-[#FE9EC7]/50 active:bg-[#FE9EC7]"
                                      />
                                    </>
                                  )}
                                </button>
                              ))}
                            </div>
                          ))}

                          {/* Playhead Overlay Needle */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f9f6c4] via-[#FE9EC7] to-[#89D4FF] shadow-[0_0_12px_#FE9EC7] z-10 pointer-events-none"
                            style={{ left: `${(playhead / totalDuration) * 100}%` }}
                          >
                            <div className="w-3 h-3 bg-[#f9f6c4] border border-[#FE9EC7] rounded-full -ml-[5px] -mt-1 shadow-[0_0_8px_#f9f6c4] flex items-center justify-center text-[7px] text-[#3d1f35] font-bold">
                              ✦
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
      </div>

      {/* Right Click Context Menu */}
      {contextMenu && selectedClip && (
        <div
          className="fixed z-50 rounded-xl border border-[#FE9EC7]/30 bg-[#1d0e26]/95 backdrop-blur-md p-1.5 shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-pink-100 hover:bg-white/10 transition"
            onClick={() => {
              duplicateClip(contextMenu.clipId);
              setContextMenu(null);
            }}
          >
            👥 Duplicate Clip
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-pink-100 hover:bg-white/10 transition"
            onClick={() => {
              moveClipTrack(contextMenu.clipId, -1);
              setContextMenu(null);
            }}
          >
            ⬆ Move Layer Up
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-pink-100 hover:bg-white/10 transition"
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
            className="block w-full rounded-lg px-3 py-1.5 text-left text-xs text-rose-300 hover:bg-rose-500/10 transition"
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
