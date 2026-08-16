"use client";

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

          </div>
        </div>
      </div>
    </section>
  );
}
