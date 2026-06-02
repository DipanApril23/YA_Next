/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "youngarchitects.in",
      },
    ],

    qualities: [75, 100],
  },
};

export default nextConfig;