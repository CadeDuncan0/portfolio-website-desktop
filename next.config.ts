import type { NextConfig } from 'next'

// Legacy/alias paths that resolve to the canonical OS route. Append here as
// more are needed — each entry becomes a temporary (307) redirect to /win7.
const legacyRedirects = ['/', '/hub', '/login', '/desktop']

// This project is served at cadeduncan.com/desktop via a Vercel rewrite zone in
// the portfolio-website repo. basePath/assetPrefix make Next emit its routes and
// framework assets under /desktop; NEXT_PUBLIC_BASE_PATH mirrors it to the
// browser so CSS url() assets are prefixed to match (see src/lib/assetPaths.ts).
// Canonical entry point: cadeduncan.com/desktop → redirects to /desktop/win7.
const basePath = '/desktop'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  devIndicators: false,
  basePath,
  assetPrefix: basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  async redirects() {
    return legacyRedirects.map((source) => ({
      source,
      destination: '/win7',
      permanent: false,
    }))
  },
}

export default nextConfig
