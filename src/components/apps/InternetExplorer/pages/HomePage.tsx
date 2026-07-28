'use client'

import styles from './HomePage.module.css'
import portal from './IEPortal.module.css'
import { IESidebar } from './IESidebar'
import { pagesByTag } from '@/config/ieRoutes'

interface HomePageProps {
  onNavigate: (nickname: string) => void
  /** Redirect entries: opens the real URL in a new browser tab and shows the
   *  in-app redirect page. */
  onOpentab: (nickname: string) => void
}

// Generic period blurbs for the feature tiles, keyed by nickname. Unknown pages
// fall back to a neutral line — no branding, so a fork can add pages freely.
const TILE_BLURB: Record<string, string> = {
  'about:resume': 'Explore my resume',
  'about:projects': "Check out what I've made",
}

export function HomePage({ onNavigate, onOpentab }: HomePageProps) {
  // Computed in-body, not at module load: ieRoutes imports this page for its
  // registry `component`, so reading IE_QUICK_LINKS at import time would hit the
  // circular-init temporal dead zone.
  const getStartedPages = pagesByTag('get-started')
  return (
    <div className={portal.pageShell}>
      <header className={portal.headerBand}>
        <h1 className={portal.bandTitle}>Welcome to Internet Explorer</h1>
        <p className={portal.bandTagline}>Your window to the World Wide Web.</p>
      </header>
      <div className={portal.columns}>
        <div className={portal.main}>
          <section className={portal.module}>
            <div className={portal.moduleHeader}>Get started on the Web</div>
            <div className={portal.moduleBody}>
              <p className={styles.lede}>Pick a page below to explore this desktop, or use the links along the left.</p>
              <div className={styles.tiles}>
                {getStartedPages.map((page) => (
                  <button
                    key={page.nickname}
                    className={styles.tile}
                    onClick={() => (page.redirect ? onOpentab : onNavigate)(page.nickname)}
                    type="button"
                  >
                    <span className={styles.tileTitle}>{page.title}</span>
                    <span className={styles.tileDesc}>{TILE_BLURB[page.nickname] ?? 'Open this page.'}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <IESidebar onNavigate={onNavigate} onOpentab={onOpentab} />
      </div>
    </div>
  )
}
