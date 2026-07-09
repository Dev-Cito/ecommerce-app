import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack's on-disk dev cache (.next/dev/cache/turbopack/*.sst) is a persistent
    // store that isn't safe under concurrent writers — a second `next dev`/`next build`,
    // or deleting .next while the dev server is running, corrupts it and crashes the
    // server. Disabling it trades slightly slower cold starts for a cache that can't corrupt.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
