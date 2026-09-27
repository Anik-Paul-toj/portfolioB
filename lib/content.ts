export type NavItem = {
  href: string;
  label: string;
};

export type Project = {
  id?: string;
  title: string;
  category: string;
  description?: string | null;
  client?: string | null;
  sourceType?: string | null;
  year?: string | null;
  thumbnailUrl?: string | null;
  thumbnail?: string; // fallback
  videoUrl: string;
  accent?: string;
  duration?: number | null;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const PORTFOLIO_CATEGORIES = [
  "Astrology edits",
  "Business edits",
  "Doctor edits",
  "Fun facts edits",
  "Gaming edits",
  "Industrial edits",
  "Psychology edits",
  "Real Estate edits",
  "Recent Affairs edits",
  "Relationship Advice edits",
  "Tech edits",
] as const;

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Astrology edits":
    "Captivating zodiac, cosmic horoscope, and mystical astrological storytelling with mesmerizing glow effects and ethereal visual pacing.",
  "Business edits":
    "Dynamic entrepreneurial and corporate storytelling highlighting company growth, visionary leadership, brand authority, and client success.",
  "Doctor edits":
    "High-impact medical and healthcare video showcasing patient trust, expert consultations, and clinical excellence with clean, engaging visual pacing.",
  "Fun facts edits":
    "Fast-paced, hook-driven trivia and curiosity-sparking educational content designed for maximum viewer retention and viral social reach.",
  "Gaming edits":
    "High-energy gameplay sequences, sync-heavy montage cuts, sound design, and vibrant visual effects capturing clutch moments and esports hype.",
  "Industrial edits":
    "Cinematic industrial footage capturing factory operations, precision machinery, modern manufacturing lines, and the scale of production.",
  "Psychology edits":
    "Intriguing human behavior, mind breakdown, and cognitive insights delivered through compelling pacing, visual metaphors, and narrative focus.",
  "Psycology edits":
    "Intriguing human behavior, mind breakdown, and cognitive insights delivered through compelling pacing, visual metaphors, and narrative focus.",
  "Real Estate edits":
    "Luxurious architectural tours, drone flythroughs, and premium property walkthroughs crafted to inspire buyers and elevate high-end listings.",
  "Recent Affairs edits":
    "Sharp journalistic breakdowns, global news analysis, and trending cultural commentary cut with authority, clear infoboxes, and momentum.",
  "Relationship Advice edits":
    "Empathetic, insight-driven video content designed for relationship coaching, emotional connection, communication breakthroughs, and personal growth.",
  "Tech edits":
    "Sleek gadget reviews, software deep dives, and futuristic product showcases with crisp graphics, macro detail, and cutting-edge sound design.",
};

export type PricingDeliverable = {
  text: string;
  note?: string;
};

export type PricingPlan = {
  id: string;
  planNumber: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  additionalCharge?: string;
  featured?: boolean;
  badge?: string;
  deliverables: PricingDeliverable[];
  cta: string;
  accentGradient: string;
  borderGlow?: boolean;
};

export const navItems: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#pricing", label: "Pricing" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "the-spark",
    planNumber: "PLAN 01",
    name: "THE SPARK",
    tagline: "For brands ready to stay consistently visible.",
    price: "₹25K",
    period: "/ month",
    featured: false,
    deliverables: [
      { text: "13 Reels" },
      { text: "10 Carousels" },
      { text: "Cover Images" },
      { text: "Instagram Management" },
      { text: "Script Writing" },
    ],
    cta: "LET’S CREATE",
    accentGradient: "from-[#FE9EC7]/30 via-white to-[#89D4FF]/20",
  },
  {
    id: "the-glow-up",
    planNumber: "PLAN 02",
    name: "THE GLOW-UP",
    tagline: "For brands ready to turn content into a serious growth engine.",
    price: "₹45K",
    period: "/ month",
    featured: true,
    badge: "MOST PURCHASED",
    deliverables: [
      { text: "15 Reels" },
      { text: "4 Long-form YouTube Videos", note: "Approx. 10 minutes each" },
      { text: "YouTube + Instagram Management" },
      { text: "Cover Images" },
      { text: "10 Carousels" },
      { text: "Script Writing" },
    ],
    cta: "GO ALL IN",
    accentGradient: "from-[#FE9EC7]/45 via-[#fff0f7] to-[#F9F6C4]/35",
    borderGlow: true,
  },
  {
    id: "the-takeover",
    planNumber: "PLAN 03",
    name: "THE TAKEOVER",
    tagline: "For brands building a full-scale content presence across platforms.",
    price: "₹50K",
    period: "/ month",
    additionalCharge: "+ ₹15K additional Meta charges",
    featured: false,
    deliverables: [
      { text: "16 Reels" },
      { text: "Cover Images" },
      { text: "Instagram + YouTube + LinkedIn Management" },
      { text: "10 LinkedIn Posts" },
      { text: "10 Instagram Carousels" },
      { text: "Script Writing" },
      { text: "8–10 Long-form YouTube Videos", note: "Approx. 10 minutes each" },
    ],
    cta: "OWN THE FEED",
    accentGradient: "from-[#89D4FF]/30 via-white to-[#FE9EC7]/25",
  },
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
  "Narrative Cuts",
  "Social Reels",
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
