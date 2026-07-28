'use client'

/** Redux-wired window wrapper. Reads geometry and focus state from windowSlice
 *  by id, wires title-bar controls to dispatch actions, and composes the
 *  stateless 7.css <Window> primitive inside a positioned shell. */

import { motion } from 'framer-motion'
import { type CSSProperties, type ReactNode, useEffect } from 'react'

import styles from './WindowWrapper.module.css'
import { Window } from '@/components/ui/Window'
import { useWindowDrag } from '@/hooks/useWindowDrag'
import { useWindowResize } from '@/hooks/useWindowResize'
import { TASKBAR_RESERVE } from '@/lib/gridMath'
import { clampWindowPosition, clampWindowSize } from '@/lib/windowMath'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  closeWindow,
  focusWindow,
  minimizeWindow,
  MIN_WINDOW_SIZE,
  moveWindow,
  resizeWindow,
  selectIsPeeking,
  selectTopWindowId,
  selectWindowById,
  toggleMaximize,
} from '@/store/slices/windowSlice'

export interface WindowWrapperProps {
  windowId: string
  /** App icon shown to the left of the title text. */
  icon?: ReactNode
  /** Optional second title-bar row (e.g. a browser nav/address toolbar). */
  toolbar?: ReactNode
  /** Pass false to drop the default body padding (e.g. edge-to-edge browser chrome). */
  bodySpace?: boolean
  children?: ReactNode
}

export function WindowWrapper({
  windowId,
  icon,
  toolbar,
  bodySpace = true,
  children,
}: WindowWrapperProps) {
  const dispatch = useAppDispatch()
  const windowData = useAppSelector(selectWindowById(windowId))
  const topWindowId = useAppSelector(selectTopWindowId)
  const isPeeking = useAppSelector(selectIsPeeking)

  const drag = useWindowDrag({
    windowId,
    position: windowData?.position ?? { x: 0, y: 0 },
    size: windowData?.size ?? { width: 0, height: 0 },
    isMaximized: windowData?.isMaximized ?? false,
  })

  const resize = useWindowResize({
    windowId,
    position: windowData?.position ?? { x: 0, y: 0 },
    size: windowData?.size ?? { width: 0, height: 0 },
    isMaximized: windowData?.isMaximized ?? false,
  })

  // Re-clamp committed geometry to the current viewport. Remembered geometry
  // (positionByKind, persisted sizeByKind, prevGeometry restores) may predate
  // a viewport shrink, which would strand the title bar or resize handle
  // off-screen with no pointer path to recover them. Gesture-committed values
  // are already clamped, so re-runs are no-ops and cannot loop.
  useEffect(() => {
    if (!windowData || windowData.isMaximized) {
      return
    }
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight - TASKBAR_RESERVE,
    }
    const size = clampWindowSize(windowData.size, { x: 0, y: 0 }, viewport, MIN_WINDOW_SIZE)
    const position = clampWindowPosition(windowData.position, size, viewport)
    if (size.width !== windowData.size.width || size.height !== windowData.size.height) {
      dispatch(resizeWindow({ id: windowId, width: size.width, height: size.height }))
    }
    if (position.x !== windowData.position.x || position.y !== windowData.position.y) {
      dispatch(moveWindow({ id: windowId, x: position.x, y: position.y }))
    }
  }, [dispatch, windowId, windowData])

  if (!windowData) {
    return null
  }

  const isActive = windowData.id === topWindowId

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dispatch(focusWindow({ id: windowId }))
    drag.handlePointerDown(e)
  }

  function handleClose() {
    dispatch(closeWindow({ id: windowId }))
  }

  function handleMinimize() {
    dispatch(minimizeWindow({ id: windowId }))
  }

  function getViewport() {
    const taskbarHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--dsk-taskbar-reserve'),
        10
      ) || TASKBAR_RESERVE
    return {
      width: window.innerWidth,
      height: window.innerHeight - taskbarHeight,
    }
  }

  function handleToggleMaximize() {
    dispatch(toggleMaximize({ id: windowId, viewport: getViewport() }))
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!(e.target as Element).closest('.title-bar')) {
      return
    }
    if ((e.target as Element).closest('.title-bar-controls')) {
      return
    }
    // Double-clicking the nav/address toolbar must not maximize the window.
    if ((e.target as Element).closest('.title-bar-toolbar')) {
      return
    }
    dispatch(toggleMaximize({ id: windowId, viewport: getViewport() }))
  }

  const controls = (
    <>
      <button aria-label="Minimize" onClick={handleMinimize} />
      <button
        aria-label={windowData.isMaximized ? 'Restore' : 'Maximize'}
        onClick={handleToggleMaximize}
      />
      <button aria-label="Close" onClick={handleClose} />
    </>
  )

  const wrapperClass = [
    styles.WindowWrapper,
    (drag.isDragging || resize.isResizing) && styles.dragging,
    windowData.isMaximized && styles.maximized,
    isPeeking && styles.peek,
  ]
    .filter(Boolean)
    .join(' ')

  const style: CSSProperties = {
    position: 'absolute',
    left: windowData.position.x + drag.dragOffset.x,
    top: windowData.position.y + drag.dragOffset.y,
    width: windowData.size.width + resize.sizeOffset.width,
    height: windowData.size.height + resize.sizeOffset.height,
    zIndex: windowData.zIndex,
  }

  // A minimize unmounts the window but leaves its slice entry standing, so
  // isMinimized is the one exit signal every minimize path shares — title bar,
  // taskbar button and Show Desktop all reach it through the reducers. A close
  // deletes the entry, so the shrink-away variant is the close case by
  // elimination.
  const variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: {
      opacity: 0,
      scale: windowData.isMinimized ? 0.5 : 0.95,
      transition: { duration: 0.1, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.div
      className={wrapperClass}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={drag.handlePointerMove}
      onPointerUp={drag.handlePointerUp}
      onDoubleClick={handleDoubleClick}
      data-testid={`managed-window-${windowId}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      <Window
        title={windowData.title}
        active={isActive}
        glass
        icon={icon}
        controls={controls}
        toolbar={toolbar}
        bodySpace={bodySpace}
      >
        {children}
      </Window>
      {/* Invisible bottom-right resize affordance. A custom handle (not CSS
          `resize: both`) is used deliberately: native resize forces
          `overflow` on the window, which clips the Aero box-shadow. */}
      {!windowData.isMaximized && (
        <div
          className={styles.resizeHandle}
          onPointerDown={resize.handlePointerDown}
          onPointerMove={resize.handlePointerMove}
          onPointerUp={resize.handlePointerUp}
          data-testid={`resize-handle-${windowId}`}
        />
      )}
    </motion.div>
  )
}
