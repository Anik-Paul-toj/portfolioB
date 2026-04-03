export type NavItem = {
  href: string;
  label: string;
};

export type Project = {
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  videoUrl: string;
  accent: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const projects: Project[] = [
  {
    title: "Neon Pulse",
    category: "Music Reel",
    year: "2026",
    thumbnail:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-at-night-43119-large.mp4",
    accent: "from-[#FE9EC7]/75 via-transparent to-[#44ACFF]/70",
  },
  {
    title: "Afterglow Frames",
    category: "Fashion Campaign",
    year: "2026",
    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-woman-walking-in-a-neon-lit-underpass-42904-large.mp4",
    accent: "from-[#44ACFF]/75 via-transparent to-[#F9F6C4]/70",
  },
  {
    title: "Still in Motion",
    category: "Brand Film",
    year: "2025",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-young-woman-walking-through-a-forest-4833-large.mp4",
    accent: "from-[#89D4FF]/75 via-transparent to-[#FE9EC7]/65",
  },
  {
    title: "Nocturne Cut",
    category: "Trailer Edit",
    year: "2025",
    thumbnail:
      "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-city-at-night-34543-large.mp4",
    accent: "from-[#F9F6C4]/65 via-transparent to-[#44ACFF]/70",
  },
  {
    title: "Velvet Atmos",
    category: "Beauty Spot",
    year: "2024",
    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-model-applying-makeup-in-front-of-a-mirror-42909-large.mp4",
    accent: "from-[#FE9EC7]/75 via-transparent to-[#F9F6C4]/75",
  },
  {
    title: "Echo Sequence",
    category: "Event Opener",
    year: "2024",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-audience-watching-a-live-concert-4000-large.mp4",
    accent: "from-[#44ACFF]/75 via-transparent to-[#89D4FF]/75",
  },
];

export const skills = [
  "Adobe Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Cinema 4D",
  "Color Grading",
  "Sound Design",
  "Narrative Cuts",
  "Social Reels",
  "Motion Graphics",
  "Client Direction",
];

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Vimeo", href: "https://vimeo.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export const heroVideo =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4";
