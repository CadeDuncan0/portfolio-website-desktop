/**
 * Tray notification registry — each entry renders a persistent icon in the
 * system tray (left of the clock) whose balloon opens on click. Forks edit
 * this list to announce their own news (releases, tips, easter eggs).
 *
 * Nothing auto-opens and nothing auto-dismisses: the visitor opens a balloon
 * by clicking its tray icon, and closes it by clicking the ✕, the action
 * link, another notification, or anywhere outside. Right-clicking a tray icon
 * offers "Remove notification", which retires the icon for the session.
 */
import type { WindowKey } from './applications'

export interface NotificationDefinition {
  /** Stable id — also dedupes seeding, so each notification exists once. */
  id: string
  title: string
  message: string
  /** Tray icon + balloon-header glyph. Default: the Win7 info icon. */
  iconSrc?: string
  /** Optional link rendered under the message; opens an application through
   *  the same gate as every other launcher. */
  action?: { label: string; appKey: WindowKey }
  /** When true, the notification is retired and never seeded. */
  disabled?: boolean
}

export const NOTIFICATIONS: NotificationDefinition[] = [
  {
    // Points at Projects rather than Welcome so the action works in both
    // sessions — Welcome and Getting Started are hideForAdmin, and the launch
    // gate refuses an app hidden from the current role.
    id: 'welcome',
    title: 'Welcome to my desktop',
    message:
      "You're on a Windows 7 desktop running in your browser. Double-click an icon to explore, or start with my projects.",
    action: { label: 'Open Projects', appKey: 'projects' },
  },
]

/** Notifications that actually seed the tray — disabled entries drop out once
 *  here so no renderer ever sees them. */
export const ENABLED_NOTIFICATIONS: NotificationDefinition[] = NOTIFICATIONS.filter(
  (notification) => !notification.disabled
)
