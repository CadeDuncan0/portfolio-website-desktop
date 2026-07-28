'use client'

import { useEffect, useState } from 'react'

import styles from './ResumePage.module.css'
import { assetPaths, withBasePath } from '@/lib/assetPaths'

// iframe/anchor URLs are not basePath-aware (unlike router navigations), so
// the PDF path is prefixed by hand — same pattern as ADMIN_API in lib/auth.ts.
const RESUME_URL = withBasePath(assetPaths.documents.resume)

/** The /resume page: the resume PDF rendered by the browser's built-in PDF
 *  viewer, with an explicit download link above it. Browsers with no inline
 *  viewer (iOS Safari, most mobile browsers) get a link panel instead — there
 *  the iframe renders as a blank rectangle with no way out. */
export function ResumePage() {
  // Starts true so the server render and the first client render agree; the
  // effect only ever flips it off, and only where the check is conclusive.
  // `pdfViewerEnabled` is undefined on older browsers — treated as capable,
  // matching the previous behavior rather than showing them a downgrade.
  const [canRenderInline, setCanRenderInline] = useState(true)

  useEffect(() => {
    if (navigator.pdfViewerEnabled === false) setCanRenderInline(false)
  }, [])

  return (
    <div className={styles.resumePage}>
      <div className={styles.bar}>
        <span className={styles.title}>Cade Duncan — Resume</span>
        <a className={styles.download} href={RESUME_URL} download="Cade-Duncan-Resume.pdf">
          Download PDF
        </a>
      </div>
      {canRenderInline ? (
        // Viewer chrome off: the bar above already covers download, and less
        // embedded UI keeps the retro look and trims the viewer's overhead.
        <iframe className={styles.viewer} src={`${RESUME_URL}#toolbar=0&navpanes=0`} title="Cade Duncan resume PDF" />
      ) : (
        <div className={styles.fallback}>
          <p className={styles.fallbackText}>This browser can&apos;t display PDFs inline. Open the resume in a new tab or download a copy.</p>
          <div className={styles.fallbackActions}>
            <a className={styles.fallbackButton} href={RESUME_URL} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
            <a className={styles.fallbackButton} href={RESUME_URL} download="Cade-Duncan-Resume.pdf">
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
