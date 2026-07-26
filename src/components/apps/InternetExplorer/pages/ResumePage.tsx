'use client'

import styles from './ResumePage.module.css'
import { assetPaths, withBasePath } from '@/lib/assetPaths'

// iframe/anchor URLs are not basePath-aware (unlike router navigations), so
// the PDF path is prefixed by hand — same pattern as ADMIN_API in lib/auth.ts.
const RESUME_URL = withBasePath(assetPaths.documents.resume)

/** The /resume page: the resume PDF rendered by the browser's built-in PDF
 *  viewer, with an explicit download link above it. */
export function ResumePage() {
  return (
    <div className={styles.resumePage}>
      <div className={styles.bar}>
        <span className={styles.title}>Cade Duncan — Resume</span>
        <a className={styles.download} href={RESUME_URL} download="Cade-Duncan-Resume.pdf">
          Download PDF
        </a>
      </div>
      {/* Viewer chrome off: the bar above already covers download, and less
          embedded UI keeps the retro look and trims the viewer's overhead. */}
      <iframe
        className={styles.viewer}
        src={`${RESUME_URL}#toolbar=0&navpanes=0`}
        title="Cade Duncan resume PDF"
      />
    </div>
  )
}
