import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Anchor Turbopack here so it doesn't pick up a sibling lockfile as root.
  turbopack: {
    root: __dirname,
  },
  // Excalidraw ships ESM; nothing extra needed for Turbopack.
};

export default nextConfig;
