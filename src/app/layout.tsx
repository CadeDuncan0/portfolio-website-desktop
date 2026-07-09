import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'

import ReduxProviderWrapper from '@/components/providers/ReduxProvider'
import { cssAssetVars } from '@/lib/assetPaths'

// globals.css imports 7.css into a low cascade layer (see globals.css header)
import './globals.css'

export const metadata: Metadata = {
  title: 'Cade Duncan — Desktop',
  description: 'A Windows 7 desktop portfolio built with React and Next.js.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={cssAssetVars() as CSSProperties}>
      <body>
        <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
      </body>
    </html>
  )
}
