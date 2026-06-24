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
  },
};

export default nextConfig;