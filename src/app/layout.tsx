import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import ReduxProviderWrapper from '@/components/providers/ReduxProvider'
import { cssAssetVars, withBasePath } from '@/lib/assetPaths'

// globals.css imports 7.css into a low cascade layer (see globals.css header)
import './globals.css'

const TITLE = 'Cade Duncan — Desktop'
const DESCRIPTION = 'A Windows 7 desktop portfolio built with React and Next.js.'

// The site's one public URL. `metadataBase` supplies the origin that crawlers
// need (they cannot resolve relative paths), and withBasePath supplies the
// `/desktop` mount so the canonical URL stays correct under the cadeduncan.com
// rewrite zone without hardcoding the basePath a second time.
const SITE_ORIGIN = 'https://cadeduncan.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: TITLE,
  description: DESCRIPTION,
  // opengraph-image.png sits next to this file; Next emits the tag, its
  // dimensions, and the twitter:image alias from that convention.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: withBasePath('/'),
    siteName: TITLE,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={cssAssetVars() as CSSProperties}>
      <body>
        <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
        <SpeedInsights></SpeedInsights>
      </body>
    </html>
  )
}
