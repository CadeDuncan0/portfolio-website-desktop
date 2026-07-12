import { useEffect } from 'react'

import {
  readIconPositions,
  readWindowSizes,
  writeIconPositions,
  writeWindowSizes,
} from '@/lib/desktopPersistence'
import { computeGridBounds } from '@/lib/gridMath'
import { useAppStore } from '@/store/hooks'
import { hydrateIconPositions, selectIconsById } from '@/store/slices/desktopSlice'
import { hydrateWindowSizes, selectWindowSizes } from '@/store/slices/windowSlice'

/**
 * Desktop-layout persistence. On desktop boot, hydrates the per-kind window
 * sizes and the icon grid positions from their sessionStorage markers, then
 * subscribes to the store and mirrors every later change back. Change
 * detection is by reference identity — Immer replaces exactly the objects a
 * reducer touched, so a stale reference means nothing to write.
 */
export function useDesktopPersistence(): void {
  const store = useAppStore()

  useEffect(() => {
    const savedSizes = readWindowSizes()
    if (savedSizes) {
      store.dispatch(hydrateWindowSizes(savedSizes))
    }
    const savedPositions = readIconPositions()
    if (savedPositions) {
      // Saved cells were valid for the viewport they were written under; the
      // window may have shrunk since. Clamp into the current grid so no icon
      // is restored off-screen where it could never be dragged back.
      const bounds = computeGridBounds(window.innerWidth, window.innerHeight)
      const clamped = Object.fromEntries(
        Object.entries(savedPositions).map(([id, cell]) => [
          id,
          {
            column: Math.max(0, Math.min(cell.column, bounds.maxColumns - 1)),
            row: Math.max(0, Math.min(cell.row, bounds.maxRows - 1)),
          },
        ])
      )
      store.dispatch(hydrateIconPositions(clamped))
    }

    let lastSizes = selectWindowSizes(store.getState())
    let lastIcons = selectIconsById(store.getState())
    return store.subscribe(() => {
      const sizes = selectWindowSizes(store.getState())
      if (sizes !== lastSizes) {
        lastSizes = sizes
        writeWindowSizes(sizes)
      }
      const icons = selectIconsById(store.getState())
      if (icons !== lastIcons) {
        lastIcons = icons
        writeIconPositions(
          Object.fromEntries(Object.values(icons).map((icon) => [icon.id, icon.position]))
        )
      }
    })
  }, [store])
}
