/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Inline the route's CSS into the HTML document instead of linking it.
    //
    // The app shell alone (globals + navbar + hero + flipcard + button +
    // divider + brandmark + footer) resolves to FIVE separate stylesheets,
    // and every one of them blocks the first paint. Measured on a throttled
    // mobile run they cost 157-607ms each and left the hero paragraph — the
    // LCP element — with 2854ms of pure render delay against only 457ms of
    // TTFB. Inlining removes those five blocking round trips outright: the
    // stylesheet arrives in the same response as the markup it styles.
    //
    // Byte-for-byte the same CSS, so nothing renders differently.
    inlineCss: true,
  },

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