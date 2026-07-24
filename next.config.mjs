/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "youngarchitects.in",
      },
    ],

    // Serve AVIF first (smaller), fall back to WebP. Visually identical.
    formats: ["image/avif", "image/webp"],

    qualities: [75, 100],

    // Cache optimized images for 31 days. The remote origin sends short
    // cache lifetimes, which Lighthouse flags ("efficient cache lifetimes");
    // this floor overrides that for the /_next/image responses.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;