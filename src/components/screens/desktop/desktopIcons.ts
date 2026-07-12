import { MARIO_WINDOW_SIZE } from './MarioWindow'
import { WINDOW_KEYS, type WindowKey } from './windowKeys'
import { assetPaths } from '@/lib/assetPaths'
import type { WindowKind } from '@/store/slices/windowSlice'

export interface DesktopIconDefinition {
  id: string
  label: string
  iconSrc: string
  windowKind: WindowKind
  windowTitle: string
  /** Stable id used for the disabled-window switch and the openWindow gate. */
  windowKey: WindowKey
  /** Optional initial window geometry; omitted = windowSlice default. */
  windowSize?: { width: number; height: number }
  /** Hide this icon on the admin desktop (guest sessions still show it). */
  hideForAdmin?: boolean
  /** Hide this icon from guest sessions (guests cannot see or open it). */
  hideForGuest?: boolean
}

const FOLDER_ICON = assetPaths.desktopIcons.folderWithDocuments

export const DESKTOP_ICONS: DesktopIconDefinition[] = [
  {
    id: 'icon-ie',
    label: 'Internet Explorer',
    iconSrc: assetPaths.desktopIcons.internetExplorer,
    windowKind: 'internet-explorer',
    windowTitle: 'Internet Explorer',
    windowKey: WINDOW_KEYS.internetExplorer,
  },
  {
    id: 'icon-welcome',
    label: 'Welcome',
    iconSrc: FOLDER_ICON,
    windowKind: 'welcome',
    windowTitle: 'Welcome',
    windowKey: WINDOW_KEYS.welcome,
    hideForAdmin: true
  },
  {
    id: 'icon-getting-started',
    label: 'Getting Started',
    iconSrc: FOLDER_ICON,
    windowKind: 'internet-explorer',
    // Matches an IE page title, so the window opens directly on that page.
    windowTitle: 'Getting Started',
    windowKey: WINDOW_KEYS.gettingStarted,
    hideForAdmin: true,
  },
  {
    id: 'icon-resume',
    label: 'Resume',
    iconSrc: assetPaths.desktopIcons.resume,
    windowKind: 'internet-explorer',
    windowTitle: 'Resume',
    windowKey: WINDOW_KEYS.resume,
    hideForAdmin: true,
  },
  {
    id: 'icon-projects',
    label: 'Projects',
    iconSrc: assetPaths.desktopIcons.projects,
    windowKind: 'internet-explorer',
    windowTitle: 'Projects',
    windowKey: WINDOW_KEYS.projects,
    hideForAdmin: true,
  },
  {
    id: 'icon-mario',
    label: 'Super Mario Bros.',
    iconSrc: assetPaths.desktopIcons.superMarioBros,
    windowKind: 'mario',
    windowTitle: 'Super Mario Bros.',
    windowKey: WINDOW_KEYS.mario,
    windowSize: MARIO_WINDOW_SIZE,
  },
]
