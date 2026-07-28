'use client'

import styles from './ProjectsPage.module.css'
import { getPortfolioProjects } from '@/config/projects'
import { withBasePath } from '@/lib/assetPaths'

import Image from 'next/image'

interface ProjectsPageProps {
  /** Navigate the IE window to another in-app route (a project subpage). */
  onNavigate: (nickname: string) => void
}

/** The /projects page: one card per portfolio project, each opening its own
 *  /projects/<slug> subpage. */
export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  return (
    <div className={styles.projectsPage}>
      <h1 className={styles.heading}>Projects</h1>
      <p className={styles.subtitle}>Select a project for details, links, and demos.</p>
      <div className={styles.grid}>
        {getPortfolioProjects().map((project) => (
          <button key={project.slug} type="button" className={styles.card} onClick={() => onNavigate(`about:projects/${project.slug}`)}>
            <span className={styles.thumb} style={project.image ? undefined : { background: project.gradient }}>
              {project.image && <Image className={styles.thumbImage} src={withBasePath(project.image)} fill alt="" loading="lazy" />}
            </span>
            <span className={styles.cardBody}>
              <span className={styles.cardHeader}>
                <span className={styles.cardTitle}>{project.title}</span>
                <span className={styles.yearBadge}>{project.yearStarted}</span>
              </span>
              <span className={styles.cardContext}>{project.context}</span>
              <span className={styles.cardSummary}>{project.summary}</span>
              <span className={styles.tagRow}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
