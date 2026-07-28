import { MarioWindow } from './MarioWindow'
import type { WindowApp } from '@/components/apps/types'

export { MarioWindow, MARIO_WINDOW_SIZE, type MarioWindowProps } from './MarioWindow'

/** This app's window identity: every window it opens is a Mario window,
 *  grouped under this kind. Registry records reference the descriptor — never
 *  a raw kind string — so kind and component cannot drift apart. */
export const marioApp = {
  kind: 'mario',
  component: MarioWindow,
} as const satisfies WindowApp
