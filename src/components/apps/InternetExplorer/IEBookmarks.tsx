'use client'

import styles from './IEBookmarks.module.css'
import { IE_BOOKMARKS } from '@/config/ieRoutes'

interface IEBookmarksProps {
  onNavigate: (nickname: string) => void
  onOpentab: (nickname: string) => void
}

/**
 * Blue underlined page links pinned to the top-left of the window content,
 * replacing the former favorites bar. One link per quick-link registry entry
 * (subpages are reachable from their parent page instead). The targets are
 * in-app routes (not real URLs), so each link is a button styled to read as
 * a classic hyperlink. Redirect entries go through onOpentab (new browser tab
 * + in-app redirect page) instead of onNavigate.
 */
export function IEBookmarks({ onNavigate, onOpentab }: IEBookmarksProps) {
  return (
    <nav className={styles.pageLinks} aria-label="Pages">
      {IE_BOOKMARKS.map((page) => (
        <button
          key={page.nickname}
          className={styles.link}
          onClick={() => (page.redirect ? onOpentab : onNavigate)(page.nickname)}
          type="button"
        >
          {page.title}
        </button>
      ))}
    </nav>
  )
}
