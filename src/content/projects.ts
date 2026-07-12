import { assetPaths } from '@/lib/assetPaths'

/**
 * Portfolio project content — the single source of truth for the Projects
 * pages inside Internet Explorer. Each entry drives one card on the /projects
 * page and one /projects/<slug> subpage (the IE route registry generates a
 * page entry per slug — see ieRoutes.ts).
 *
 * This file is portfolio content: it stays in this fork and never flows
 * upstream to the win7-web-os template.
 */

export interface ProjectLink {
  label: string
  /** Real external URL — opened in a new browser tab. */
  url: string
}

export type ProjectDemo =
  /** Renders a button that opens the playable Super Mario Bros window. */
  | { type: 'mario-window' }
  /** Renders an informational line (e.g. proprietary system, or "you're using it"). */
  | { type: 'note'; text: string }

export interface PortfolioProject {
  /** URL-safe id; becomes the IE route `about:projects/<slug>`. */
  slug: string
  title: string
  /** Where/for whom the work happened, e.g. employer or "Personal Project". */
  context: string
  /** One-sentence card blurb on the /projects grid. */
  summary: string
  /** Detail-page paragraphs. */
  description: string[]
  tags: string[]
  /** CSS background for the card thumb / detail hero (fallback when no image). */
  gradient: string
  /** Optional screenshot under public/ (root-absolute, basePath-prefixed at render). */
  image?: string
  links: ProjectLink[]
  demo?: ProjectDemo
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'order-intake-platform',
    title: 'Order Intake Platform',
    context: 'Russell Sigler Inc.',
    summary:
      'Full-stack order intake platform that retired a legacy process and now handles hundreds of sales orders each month.',
    description: [
      'A full-stack order intake platform built for Russell Sigler Inc. that retired the legacy Esker Notes process. It consolidates multi-entity transactional workflows, third-party API file delivery, and automated notifications into a single system.',
      'The platform processes hundreds of sales orders each month, built on ASP.NET Core and C# with SQL Server and Entity Framework on the data layer.',
    ],
    tags: ['ASP.NET Core', 'C#', 'SQL', 'Entity Framework'],
    gradient: 'linear-gradient(135deg, #141a4d, #3a1f6b)',
    links: [],
    demo: {
      type: 'note',
      text: 'Proprietary internal system — no public demo or source code is available.',
    },
  },
  {
    slug: 'windows-7-web-os',
    title: 'Windows 7 Web OS',
    context: 'Open Source',
    summary:
      'A browser-based recreation of the Windows 7 Aero Glass desktop — the very site you are using right now.',
    description: [
      'A faithful browser recreation of the Windows 7 Aero Glass desktop: a custom window manager with dragging, resizing, minimize/maximize and z-index stacking, a live taskbar, a Start Menu, and draggable snap-to-grid desktop icons.',
      'Built with Next.js, TypeScript, and Redux Toolkit, animated with Framer Motion, and styled by a token-driven Aero Glass design system. Dual-role authentication (Guest and password-gated Admin) is enforced server-side with httpOnly cookie sessions.',
      'The desktop is published as an open-source template — this portfolio is a content fork of it.',
    ],
    tags: ['Next.js', 'TypeScript', 'React', 'Redux Toolkit'],
    gradient: 'linear-gradient(135deg, #0d3433, #1a7a5f)',
    image: assetPaths.projects.win7WebOs,
    links: [
      { label: 'Template Source (win7-web-os)', url: 'https://github.com/CadeDuncan0/win7-web-os' },
      {
        label: 'This Site’s Source',
        url: 'https://github.com/CadeDuncan0/portfolio-website-desktop',
      },
    ],
    demo: {
      type: 'note',
      text: 'You are looking at the live demo right now — this entire desktop is the project.',
    },
  },
  {
    slug: 'stardew-valley-mods',
    title: 'Stardew Valley Mods',
    context: 'Open Source',
    summary: 'C# gameplay mods published on Nexus Mods with 96,000+ downloads.',
    description: [
      'Open-source C# gameplay mods for Stardew Valley, published to Nexus Mods with more than 96,000 downloads.',
      'The mods use event-driven SMAPI hooks to manage real-time menu state, with defensive logic that prevents a game-breaking soft-lock.',
    ],
    tags: ['C#', 'SMAPI', 'Game Modding'],
    gradient: 'linear-gradient(135deg, #3a1f0d, #9b5a18)',
    links: [
      { label: 'Nexus Mods Profile', url: 'https://www.nexusmods.com/profile/Stingrayss/mods' },
      { label: 'Source Code', url: 'https://github.com/CadeDuncan0/StardewValley' },
    ],
  },
  {
    slug: 'super-mario-bros-nes',
    title: 'Super Mario Bros. NES Recreation',
    context: 'Personal Project',
    summary:
      'A faithful Godot recreation of the NES classic — playable right here in a desktop window.',
    description: [
      'A faithful recreation of the NES-era Super Mario Bros. built in the Godot engine, replicating the original physics, collision detection, and game-state systems.',
      'The game is exported to WebAssembly through Godot’s HTML5 pipeline and embedded in this site as its own desktop app — use the arrow keys to move once it loads.',
    ],
    tags: ['Godot', 'GDScript', 'Game Dev'],
    gradient: 'linear-gradient(135deg, #3a0d2e, #8a1f63)',
    image: assetPaths.projects.superMarioBros,
    links: [
      {
        label: 'Source Code',
        url: 'https://github.com/CadeDuncan0/Super-Mario-Bros-In-Godot',
      },
    ],
    demo: { type: 'mario-window' },
  },
]

/** Look up a project by its slug (the tail of an `about:projects/…` route). */
export function projectBySlug(slug: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((project) => project.slug === slug)
}
