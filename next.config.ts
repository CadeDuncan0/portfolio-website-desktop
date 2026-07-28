import type { NextConfig } from 'next'

// The OS is served at the app root only (src/app/page.tsx). In production the
// app mounts under BASE_PATH=/desktop behind the cadeduncan.com rewrite zone,
// making cadeduncan.com/desktop the single public URL — no other routes exist.
// Exposed to the browser as NEXT_PUBLIC_BASE_PATH so CSS url() assets and
// hand-built fetch/iframe/embed paths can be prefixed to match (see
// src/lib/assetPaths.ts → cssAssetVars).
const basePath = process.env.BASE_PATH ?? ''

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  devIndicators: false,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
