import Link from "next/link";
import Icon from "./Icons";
import Slider from "./Slider";
import Reveal from "./Reveal";
import { ProjectHead, ProjectStory } from "./ProjectStory";

// 프로젝트 케이스 스터디 페이지 (메인 챕터와 같은 컴포넌트를 크게 보여줌)
export default function ProjectDetail({ project, slug, prev, next }) {
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <nav className="detail-bar" aria-label="프로젝트 페이지">
        <div className="container nav-in">
          <Link href={`/#project-${slug}`} className="db-back">
            <Icon name="arrowLeft" />
            전체 포트폴리오
          </Link>
          <span className="db-title" aria-hidden="true">
            {project.title}
          </span>
          <Link className="brand" href="/" aria-label="Suman Kim 김수만, 포트폴리오 홈">
            <span className="brand-dot" aria-hidden="true" />
            <span className="brand-text">Suman Kim</span>
          </Link>
        </div>
      </nav>

      <main id="main" className="detail">
        <div className="container">
          <ProjectHead project={project} as="h1" />
          <Slider images={project.images} label={project.title} note={project.galleryNote} priority />
          <ProjectStory project={project} slug={slug} showLink={false} labelAs="h2" />

          <nav className="detail-nav" aria-label="다른 프로젝트">
            {prev ? (
              <Link href={`/work/${prev.slug}`} className="dn-link">
                <span className="dn-dir">← 이전 프로젝트</span>
                <span className="dn-title">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/work/${next.slug}`} className="dn-link next">
                <span className="dn-dir">다음 프로젝트 →</span>
                <span className="dn-title">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </main>
      <footer className="site-footer">© 2026 · 김수만</footer>
      <Reveal />
    </>
  );
}
