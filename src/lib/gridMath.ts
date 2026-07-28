/** Coordinate math for the desktop icon grid.
 *  Icons live in a column-major grid; these functions convert between
 *  grid cells (column, row) and pixel offsets (x, y). */

import type { GridCell } from '@/store/slices/desktopSlice'

// Canonical layout constants, mirrored by --dsk-grid-cell-w, --dsk-grid-cell-h,
// --dsk-grid-padding and --dsk-taskbar-reserve in globals.css.
export const CELL_WIDTH = 75
export const CELL_HEIGHT = 80
export const GRID_PADDING = 12
export const TASKBAR_RESERVE = 40

/** Usable grid dimensions for a viewport — the single source of the bounds
 *  math shared by IconGrid's live layout and the persistence hydration clamp. */
export function computeGridBounds(
  viewportWidth: number,
  viewportHeight: number
): { maxColumns: number; maxRows: number } {
  const availableHeight = viewportHeight - TASKBAR_RESERVE - GRID_PADDING * 2
  const availableWidth = viewportWidth - GRID_PADDING * 2
  return {
    maxColumns: Math.max(1, Math.floor(availableWidth / CELL_WIDTH)),
    maxRows: Math.max(1, Math.floor(availableHeight / CELL_HEIGHT)),
  }
}

// Rows that fit above the taskbar at the current viewport height — the bound
// every desktopSlice reducer that places an icon wraps at. Reads window, so call
// from client effects and event handlers only, never during render/SSR. Mirrors
// IconGrid's live gridBounds.maxRows.
export function gridMaxRows(): number {
  return computeGridBounds(window.innerWidth, window.innerHeight).maxRows
}

export function gridCellToPixels(cell: GridCell): { x: number; y: number } {
  return {
    x: cell.column * CELL_WIDTH + GRID_PADDING,
    y: cell.row * CELL_HEIGHT + GRID_PADDING,
  }
}

export function pixelsToGridCell(x: number, y: number): GridCell {
  return {
    column: Math.max(0, Math.round((x - GRID_PADDING) / CELL_WIDTH)),
    row: Math.max(0, Math.round((y - GRID_PADDING) / CELL_HEIGHT)),
  }
}

export function isCellOccupied(cell: GridCell, occupied: GridCell[]): boolean {
  return occupied.some((taken) => taken.column === cell.column && taken.row === cell.row)
}

// The single free-cell resolver: every path that places an icon (registration,
// hydration, re-show, drag-drop) routes through it, so they cannot drift apart.
// Callers pass the cells to avoid — an icon being moved omits its own, which is
// how it is allowed to stay put. Scans column-major (down rows, then the next
// column) to match Win7's icon flow, and `maxRows` bounds every column including
// the desired cell's own, so a row past the fold wraps instead of landing under
// the taskbar. The finite `occupied` set guarantees termination.
export function findNextFreeCell(
  desired: GridCell,
  occupied: GridCell[],
  maxRows: number
): GridCell {
  let column = desired.column + Math.floor(desired.row / maxRows)
  let row = desired.row % maxRows

  while (isCellOccupied({ column, row }, occupied)) {
    row += 1
    if (row >= maxRows) {
      row = 0
      column += 1
    }
  }
  return { column, row }
}
