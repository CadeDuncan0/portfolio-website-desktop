import { createElement, type ComponentType } from 'react'

import { HomePage, ProjectDetailPage, ProjectsPage, ResumePage } from '@/components/apps/InternetExplorer/pages'
import { getPortfolioProjects } from '@/config/projects'

/** Props every in-app IE page component receives from the IE window. */
export interface IEPageProps {
  onNavigate: (nickname: string) => void
  /** Redirect entries: open the real URL in a new browser tab and show the
   *  in-app redirect page. */
  onOpentab: (nickname: string) => void
}

export interface IEPage {
  nickname: string // id
  url: string
  title: string // search dropdown label
  component?: ComponentType<IEPageProps>
  redirect?: boolean // when true, does not require a component
  disabled?: boolean // unaccessible
  hidden?: boolean // accessible but hidden in IE
  bookmark?: boolean
  addressbar?: boolean
  tags?: string[]
}

const SITE = 'www.cadeduncan.com'

/** One in-app page per portfolio project — /projects/<slug> subpages. Each
 *  entry closes over its own project, so the IE window renders these through
 *  the same generic `page.component` path as every other route. */
const PROJECT_SUBPAGES: IEPage[] = getPortfolioProjects().map((project) =>
  createPage({
    nickname: `about:projects/${project.slug}`,
    url: `${SITE}/projects/${project.slug}`,
    title: project.title,
    redirect: false,
    component: (props: IEPageProps) => createElement(ProjectDetailPage, { ...props, project }),
  })
)

export const IE_PAGES: IEPage[] = [
  createPage({
    nickname: 'about:home',
    url: `${SITE}/home`,
    title: 'Home',
    redirect: false,
    bookmark: true,
    component: HomePage,
  }),
  createPage({
    nickname: 'about:resume',
    url: `${SITE}/resume`,
    title: 'Resume',
    redirect: false,
    bookmark: true,
    component: ResumePage,
    tags: ['get-started'],
  }),
  createPage({
    nickname: 'about:projects',
    url: `${SITE}/projects`,
    title: 'Projects',
    redirect: false,
    bookmark: true,
    component: ProjectsPage,
    tags: ['get-started'],
  }),
  ...PROJECT_SUBPAGES,
  createPage({
    nickname: 'links:source-code',
    url: `https://github.com/CadeDuncan0/portfolio-website-desktop`,
    title: 'Source Code',
    redirect: true,
    disabled: false,
    tags: ['explore'],
  }),
  createPage({
    nickname: 'links:win7-source-code',
    url: `https://github.com/CadeDuncan0/win7-web-os`,
    title: 'Win7 Source Code',
    redirect: true,
    disabled: false,
    tags: ['explore'],
  }),
  createPage({
    nickname: 'links:changelog',
    url: `https://github.com/CadeDuncan0/portfolio-website-desktop/releases/latest`,
    title: 'Changelog',
    redirect: true,
    disabled: false,
    tags: ['explore'],
  }),
]

export const IE_ENABLED_PAGES: IEPage[] = IE_PAGES.filter((page) => !page.disabled)
export const IE_LISTED_PAGES: IEPage[] = IE_ENABLED_PAGES.filter((page) => !page.hidden)
export const IE_ADDRESSES: IEPage[] = IE_LISTED_PAGES.filter((page) => page.addressbar)
export const IE_BOOKMARKS: IEPage[] = IE_LISTED_PAGES.filter((page) => page.bookmark)

/** The page IE opens on by default (its nickname). */
export const DEFAULT_ROUTE = IE_ENABLED_PAGES[0].nickname

const PAGES_BY_NICKNAME: Record<string, IEPage> = Object.fromEntries(IE_ENABLED_PAGES.map((page) => [page.nickname, page]))

/** Assigns addressbar to provided page */
export function createPage(page: IEPage): IEPage {
  return {
    addressbar: page.addressbar ?? (!page.disabled && !page.hidden),
    ...page,
  }
}

/** Resolve a nickname (history-stack value) to its page, if any. */
export function resolvePage(nickname: string): IEPage | undefined {
  return PAGES_BY_NICKNAME[nickname]
}

/** Full address-bar URL for a nickname; falls back to the nickname itself. */
export function pageUrl(nickname: string): string {
  return resolvePage(nickname)?.url ?? nickname
}

/** Link-visible pages carrying `tag`, subpages included — for custom sections. */
export function pagesByTag(tag: string): IEPage[] {
  return IE_LISTED_PAGES.filter((page) => page.tags?.includes(tag))
}

/** Filter pages for the address-bar dropdown. */
export function filterPages(query: string): IEPage[] {
  const q = query.trim().toLowerCase()
  // list all pages
  if (!q) {
    return IE_LISTED_PAGES
  }
  return IE_LISTED_PAGES.filter(
    (page) => page.title.toLowerCase().includes(q) || page.url.toLowerCase().includes(q) || page.nickname.toLowerCase().includes(q)
  )
}

/**
 * Resolve free-typed address-bar input to a nickname to navigate to. Accepts an
 * exact nickname, an exact full URL, or a case-insensitive title; otherwise
 * returns the first page whose title/url/nickname contains the query, or
 * `undefined` when nothing matches. Exact input matches a `hidden` page too —
 * that is the address a fork hands out for an unlisted route.
 */
export function inputToRoute(input: string): string | undefined {
  const raw = input.trim()
  if (!raw) {
    return undefined
  }
  if (PAGES_BY_NICKNAME[raw]) {
    return raw
  }
  const lower = raw.toLowerCase()
  const exact = IE_ADDRESSES.find((page) => page.url.toLowerCase() === lower || page.title.toLowerCase() === lower)
  if (exact) {
    return exact.nickname
  }
  return filterPages(raw)[0]?.nickname
}
