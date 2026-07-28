import { cookies } from 'next/headers'

import { DesktopScreen } from '@/components/screens/desktop/DesktopScreen'
import { LoginScreen } from '@/components/screens/login/LoginScreen'
import { ADMIN_COOKIE_NAME, isAdminCookieValid } from '@/lib/adminAuth'
import { GUEST_COOKIE_NAME } from '@/lib/guestSession'

/**
 * The OS lives at a single URL: the app root. In production the app is
 * mounted under BASE_PATH=/desktop behind the cadeduncan.com rewrite zone, so
 * this page IS cadeduncan.com/desktop — the only URL the site exposes. The
 * server checks the session cookies and renders either the logon screen or
 * the desktop. Signing in and out re-render the page via router.refresh() —
 * the address bar never changes.
 */
export default async function DesktopPage() {
  const cookieStore = await cookies()
  const isAdmin = await isAdminCookieValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  const isGuest = cookieStore.get(GUEST_COOKIE_NAME)?.value === '1'

  return isAdmin || isGuest ? <DesktopScreen isAdmin={isAdmin} /> : <LoginScreen />
}
