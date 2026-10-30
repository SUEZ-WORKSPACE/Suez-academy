/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a second build (e.g. a local preview) run next to `next dev` without sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
