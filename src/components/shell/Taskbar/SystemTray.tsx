'use client'

import { useEffect, useState } from 'react'

import styles from './SystemTray.module.css'

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
})

export function SystemTray() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // suppressHydrationWarning: the prerendered HTML bakes in the build-time
  // clock; the client's first paint always disagrees. The mismatch is
  // expected and self-corrects on the next interval tick.
  //
  // No role="status": that would make this an aria-live region, and the 1s
  // interval would have a screen reader read the clock over everything else.
  return (
    <div className={styles.systemTray} aria-label="System tray">
      <time className={styles.time} dateTime={now.toISOString()} suppressHydrationWarning>
        {timeFormatter.format(now)}
      </time>
      <time className={styles.date} dateTime={now.toISOString()} suppressHydrationWarning>
        {dateFormatter.format(now)}
      </time>
    </div>
  )
}
