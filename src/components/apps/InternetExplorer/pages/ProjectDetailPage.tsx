'use client'

import styles from './ProjectDetailPage.module.css'
import type { PortfolioProject } from '@/content/projects'
import { withBasePath } from '@/lib/assetPaths'
import { launchApplication } from '@/lib/launchApplication'
import { useAppDispatch } from '@/store/hooks'

interface ProjectDetailPageProps {
  project: PortfolioProject
  /** Navigate the IE window to another in-app route (back to /projects). */
  onNavigate: (nickname: string) => void
}

/** A /projects/<slug> subpage: hero image, description, tags, external links,
 *  and — when the project has one — a live demo action. */
export function ProjectDetailPage({ project, onNavigate }: ProjectDetailPageProps) {
  const dispatch = useAppDispatch()

  // Routed through the shared launch gate, so the demo button honours the same
  // disabled/role rules as the desktop icon and Start Menu shortcut. Title and
  // geometry come from the registry record.
  const handlePlayMario = () => {
    dispatch(launchApplication('mario'))
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => onNavigate('about:projects')}
        >
          ← All Projects
        </button>

        <div className={styles.hero} style={{ background: project.gradient }}>
          {project.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.heroImage}
              src={withBasePath(project.image)}
              alt={`${project.title} screenshot`}
            />
          )}
        </div>

        <h1 className={styles.heading}>{project.title}</h1>
        <p className={styles.context}>{project.context}</p>

        <div className={styles.tagRow}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {project.description.map((paragraph, index) => (
          // Index keys are safe here: the list is static authored content.
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}

        {project.demo?.type === 'note' && <p className={styles.demoNote}>{project.demo.text}</p>}

        {(project.links.length > 0) && (
          <div className={styles.actions}>
              <button type="button" className={styles.demoButton} onClick={handlePlayMario}>
                ▶ Play it now — opens in its own window
              </button>
            {project.links.map((link) => (
              <a
                key={link.url}
                className={styles.externalLink}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
