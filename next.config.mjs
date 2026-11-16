/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a second build (e.g. a local preview) run next to `next dev` without sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
   output: 'export', trailingSlash: true , images: { unoptimized: true }
};

export default nextConfig;
