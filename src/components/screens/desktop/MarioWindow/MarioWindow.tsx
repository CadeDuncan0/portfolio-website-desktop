'use client'

import { WindowWrapper } from '../WindowWrapper'
import styles from './MarioWindow.module.css'
import { assetPaths, withBasePath } from '@/lib/assetPaths'

/** Default geometry for the game window — a comfortable 4:3-ish canvas for the
 *  NES viewport plus title-bar chrome. Passed by every openWindow dispatch that
 *  spawns the game (desktop icon, Start Menu, project subpage demo button). */
export const MARIO_WINDOW_SIZE = { width: 800, height: 640 }

export interface MarioWindowProps {
  /** Redux window id — wires the OS chrome (geometry, focus, controls). */
  windowId: string
}

/** The playable Super Mario Bros. NES recreation (a Godot 4 WebAssembly
 *  export served from public/mario) embedded as its own desktop app. */
export function MarioWindow({ windowId }: MarioWindowProps) {
  const icon = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.titleBarIcon}
      src={withBasePath(assetPaths.desktopIcons.superMarioBros)}
      alt=""
      aria-hidden="true"
    />
  )

  return (
    <WindowWrapper windowId={windowId} icon={icon} bodySpace={false}>
      <iframe
        className={styles.gameFrame}
        src={withBasePath(assetPaths.games.superMarioBros)}
        title="Super Mario Bros. NES Recreation — playable demo"
        allow="autoplay; fullscreen"
      />
    </WindowWrapper>
  )
}
