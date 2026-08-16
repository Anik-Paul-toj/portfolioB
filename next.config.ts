import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.giphy.com",
      },
      {
        protocol: "https",
        hostname: "media.giphy.com",
      },
    ],
  },
};

export default nextConfig;
