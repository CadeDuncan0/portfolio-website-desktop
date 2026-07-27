# win7-web-os

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**A Windows 7 desktop, rebuilt for the browser — fork it and make it yours.**

Sign in as Guest or Admin and land on a real Aero Glass desktop: draggable icons, a
window manager, Start menu, and an in-browser Internet Explorer. Every personal
touch — icons, links, pages, branding — lives in one config folder, so forking is a
rebrand, not a rewrite.

[Try the live demo](http://cadeduncan.com/desktop)

## Quick start

```bash
git clone https://github.com/CadeDuncan0/win7-web-os.git
cd win7-web-os && npm ci && npm run dev
```

Visit `http://localhost:3000/win7`, sign in as **Guest** (no password), or copy
`.env.example` to `.env.local` and set `ADMIN_PASSWORD` to try **Admin**. Requires Node 22+.

## Environment variables

| Variable         | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `ADMIN_PASSWORD` | Password checked server-side for the Admin sign-in form         |
| `BASE_PATH`      | Mounts the app under a subpath, e.g. `/desktop`, instead of `/` |

\* Empty `ADMIN_PASSWORD` disables Admin sign-in

## What's included

- **Login screen** — authentic Windows 7 logon with Guest + Admin accounts
- **Aero Glass desktop** — draggable icons with grid snapping, Start menu, live-clock taskbar
- **Window manager** — drag, resize, minimize, maximize, z-order, session persistence
- **Internet Explorer** — a placeholder browser app with Home/Getting Started pages, address bar
  routing, and bookmarks
- **Notifications** — a tray notification center

## Make it yours

Forks personalize the template entirely through plain-data registries in `src/config/`:

| File               | Controls                                           |
| ------------------ | -------------------------------------------------- |
| `applications.ts`  | Desktop icons, Start Menu shortcuts, window apps   |
| `ieRoutes.ts`      | Internet Explorer pages, bookmarks, external links |
| `notifications.ts` | Tray notification content                          |
| `persistence.ts`   | Which desktop state survives a reload              |

No forking-required code changes — edit the tables, keep the components. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full fork guide, including how to track this repo
as an `upstream` remote for template updates.

## Tech stack

| Technology    | Role                                                      |
| ------------- | --------------------------------------------------------- |
| Next.js       | SSR, file-based routing, the auth gate                    |
| TypeScript    | Type safety enforced across every layer                   |
| Redux Toolkit | Global state for the desktop, windows, and session        |
| CSS Modules   | Scoped styling with a centralized Aero Glass token system |
| Framer Motion | Window transitions and desktop animations                 |
| @dnd-kit      | Drag-and-drop icon repositioning with grid snapping       |
| Zod           | Runtime validation                                        |

## Project layout

```
src/
├── app/          Next.js routes, layouts, the /win7 entry point
├── components/
│   ├── shell/    Taskbar, Start menu, desktop chrome
│   ├── apps/     Window content (Internet Explorer, Welcome, …)
│   └── ui/       Reusable Win7 primitives
├── store/        Redux slices for windows, desktop, and session state
├── config/       Fork-editable registries (see Make it yours)
├── hooks/        Shared React hooks
└── lib/          Utilities, including asset-path helpers for BASE_PATH
```

## Scripts

| Command          | Purpose                           |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the dev server              |
| `npm run build`  | Production build + type-check     |
| `npm test`       | Run the test suite (Vitest)       |
| `npm run lint`   | Lint with zero warnings tolerated |
| `npm run format` | Check formatting with Prettier    |

## License

MIT — see [LICENSE](LICENSE).
