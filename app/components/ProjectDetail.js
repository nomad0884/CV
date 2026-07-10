"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// 주의: globals.css의 전역 header/nav/section 선택자(메인 페이지 히어로용)와
// 충돌하지 않도록 이 페이지는 시맨틱 태그 대신 클래스 기반 div를 사용합니다.
export default function ProjectDetail({ project, prev, next }) {
  const [lightbox, setLightbox] = useState(null); // index or null

  // html { scroll-behavior: smooth } 때문에 라우트 전환 시 스크롤이 맨 위로
  // 복원되지 않는 문제 보정 — 상세 페이지 진입 시 즉시 맨 위로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [project.title]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (lightbox === null) return;
      if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % project.images.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + project.images.length) % project.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, project.images.length]);

  return (
    <main className="detail">
      {/* 상단 고정 바 */}
      <div className="detail-topbar">
        <div className="dtb-in">
          <Link href="/#work" className="dtb-home">← 프로젝트 목록</Link>
          <span className="dtb-title">{project.title}</span>
          <Link href="/" className="dtb-brand">SUMAN KIM</Link>
        </div>
      </div>

      {/* 히어로 */}
      <div className="detail-hero">
        <div className="wrap">
          <div className="detail-tags">
            {project.tags.map((t) => (
              <span key={t} className="d-tag">{t}</span>
            ))}
          </div>
          <h1 className="detail-title">{project.title}</h1>
          <p className="detail-sub">{project.subtitle}</p>
          <div className="detail-strip">
            <div className="dm">
              <span className="dm-num">{project.metric}</span>
              <span className="dm-lbl">{project.metricLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        {/* 갤러리 */}
        <div className="gallery">
          {project.images.map((img, i) => (
            <figure key={img.file} className="shot" onClick={() => setLightbox(i)}>
              <div className="shot-frame">
                <Image
                  src={`/work/${img.file}`}
                  alt={img.caption}
                  width={img.w}
                  height={img.h}
                  sizes="(max-width: 820px) 100vw, 1024px"
                  className="shot-img"
                />
                <span className="shot-zoom">확대 보기</span>
              </div>
              <figcaption>{img.caption}</figcaption>
            </figure>
          ))}
          {project.galleryNote && <p className="gallery-note">{project.galleryNote}</p>}
        </div>

        {/* 본문: 좌측 스토리 / 우측 요약 */}
        <div className="detail-info">
          <div className="di-main">
            <div className="di-card">
              <span className="db-label">문제 · 배경</span>
              <p>{project.problem}</p>
            </div>
            <div className="di-card">
              <span className="db-label">구현</span>
              <p>{project.build}</p>
            </div>
            <div className="di-card">
              <span className="db-label">회고</span>
              <p>{project.retro}</p>
            </div>
          </div>
          <aside className="di-side">
            <div className="di-card di-accent">
              <span className="db-label">역할</span>
              <p>{project.role}</p>
            </div>
            <div className="di-card di-accent">
              <span className="db-label">기술 스택</span>
              <div className="db-stack">
                {project.stack.map((s) => (
                  <span key={s} className="ds-chip">{s}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 이전 / 다음 */}
        <div className="detail-nav">
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="dn-link">
              <span className="dn-dir">← 이전 프로젝트</span>
              <span className="dn-title">{prev.title}</span>
            </Link>
          ) : (
            <span className="dn-empty" />
          )}
          {next ? (
            <Link href={`/work/${next.slug}`} className="dn-link right">
              <span className="dn-dir">다음 프로젝트 →</span>
              <span className="dn-title">{next.title}</span>
            </Link>
          ) : (
            <span className="dn-empty" />
          )}
        </div>
      </div>

      {/* 라이트박스 */}
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" aria-label="닫기" onClick={() => setLightbox(null)}>×</button>
          <button
            className="lb-arrow left"
            aria-label="이전 이미지"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + project.images.length) % project.images.length); }}
          >‹</button>
          <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`/work/${project.images[lightbox].file}`}
              alt={project.images[lightbox].caption}
              width={project.images[lightbox].w}
              height={project.images[lightbox].h}
              className="lb-img"
            />
            <figcaption>{project.images[lightbox].caption}</figcaption>
          </figure>
          <button
            className="lb-arrow right"
            aria-label="다음 이미지"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % project.images.length); }}
          >›</button>
        </div>
      )}
    </main>
  );
}
