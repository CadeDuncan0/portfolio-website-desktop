import type { NextConfig } from 'next'

// This project is served at cadeduncan.com/desktop via a Vercel rewrite zone in
// the portfolio-website repo. basePath/assetPrefix make Next emit its routes and
// framework assets under /desktop; NEXT_PUBLIC_BASE_PATH mirrors it to the
// browser so CSS url() assets are prefixed to match (see src/lib/assetPaths.ts).
//
// Routes are flattened so the mount IS the canonical URL — no nested redirect:
//   app '/'        → cadeduncan.com/desktop          (logon screen)
//   app '/desktop' → cadeduncan.com/desktop/desktop  (desktop, auth-gated)
const basePath = '/desktop'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  devIndicators: false,
  basePath,
  assetPrefix: basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
