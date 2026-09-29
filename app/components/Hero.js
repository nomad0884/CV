"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "./Icons";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// three r163+는 WebGL2만 지원하므로 WebGL2만 확인하고, 확인용 컨텍스트는 즉시 해제
function hasWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

export default function Hero({ items, index }) {
  const [support, setSupport] = useState(null); // null: 확인 전, true/false
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState(null); // 3D 카드 호버 (item)
  const [listActive, setListActive] = useState(null); // 인덱스 목록 호버/포커스 (id)
  const [tipDismissed, setTipDismissed] = useState(null); // Esc로 닫은 카드 key
  const tipRef = useRef(null);
  const heroRef = useRef(null);
  const lastPt = useRef(null);

  useEffect(() => {
    setSupport(hasWebGL2());
  }, []);

  // 툴팁: 화면(viewport) 기준으로 커서 옆에 두고, 오른쪽·아래 가장자리에서는 반대편으로 뒤집음
  const placeTip = useCallback(() => {
    const tip = tipRef.current;
    const pt = lastPt.current;
    if (!tip || !pt) return;
    const GAP = 18;
    const PAD = 12;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let x = pt.x + GAP;
    let y = pt.y + GAP;
    if (x + w > window.innerWidth - PAD) x = pt.x - GAP - w;
    if (y + h > window.innerHeight - PAD) y = pt.y - GAP - h;
    tip.style.transform = `translate3d(${Math.max(PAD, x)}px, ${Math.max(PAD, y)}px, 0)`;
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    const onMove = (e) => {
      lastPt.current = { x: e.clientX, y: e.clientY };
      placeTip();
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, [placeTip]);

  // 내용이 바뀌면 크기가 달라지므로 다시 배치
  useLayoutEffect(() => {
    if (hovered) placeTip();
  }, [hovered, placeTip]);

  // 호버 툴팁은 Esc로 닫을 수 있어야 함 (WCAG 1.4.13)
  useEffect(() => {
    if (!hovered) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setTipDismissed(hovered.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hovered]);

  const onSelect = useCallback((item) => {
    const el = document.getElementById(item.target);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${item.target}`);
  }, []);

  const onError = useCallback(() => {
    setHovered(null);
    setSupport(false);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const activeId = hovered?.id ?? listActive;
  const showTip = Boolean(hovered) && tipDismissed !== hovered.key;
  const fallbackImages = [items.find((i) => i.kind === "project"), items.find((i) => i.kind === "project" && i.id !== items[0].id), items.find((i) => i.kind === "paper")].filter(Boolean);

  return (
    <header className="hero" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true" />

      {support && (
        <div className={`hero-canvas${ready ? " ready" : ""}`}>
          <HeroScene
            items={items}
            activeId={listActive}
            onHover={setHovered}
            onSelect={onSelect}
            onReady={onReady}
            onError={onError}
          />
        </div>
      )}
      {support === false && (
        <div className="hero-fallback" aria-hidden="true">
          {fallbackImages.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.key} src={img.texture} alt="" loading="eager" />
          ))}
        </div>
      )}
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-inner container">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="pulse" aria-hidden="true" />
            <span lang="en">Full-stack · AI Engineer</span>
            <span className="kicker-ko">국제통상 × 소프트웨어 · 국민대학교</span>
          </p>
          <h1 className="hero-name">
            김수만
            <span className="en" lang="en">
              Defining problems, shipping solutions.
            </span>
          </h1>
          <p className="hero-lede">
            실제 업무의 병목을 찾아 <b>자동화</b>하는 풀스택 개발자입니다. 문제를 정의하고, 지표로
            분석하고, 배포와 인수인계까지 구현합니다.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#work">
              프로젝트 보기
              <Icon name="arrowDown" />
            </a>
            <a className="btn btn-ghost" href="#papers">
              논문 보기
            </a>
          </div>
          <ul className="hero-stats" aria-label="주요 이력">
            <li>
              <span className="v">3.92 / 4.5</span>
              <span className="k">복수전공 GPA</span>
            </li>
            <li>
              <span className="v">KICS 2편</span>
              <span className="k">학술 논문</span>
            </li>
            <li>
              <span className="v">우수상</span>
              <span className="k">캡스톤 경진대회</span>
            </li>
            <li>
              <span className="v">최우수상</span>
              <span className="k">NIPA-NaverCloud Sovereign AI</span>
            </li>
          </ul>
        </div>

      </div>

      <div ref={tipRef} className={`orbit-tip${showTip ? " on" : ""}`} aria-hidden="true">
        {showTip && (
          <>
            <span className="ot-kind" lang="en">
              {hovered.kind === "paper" ? "Paper" : "Project"} {hovered.index}
            </span>
            <span className="ot-title">{hovered.title}</span>
            <span className="ot-meta">{hovered.meta}</span>
            <span className="ot-cta">
              클릭해서 보기 <Icon name="arrowRight" />
              <span className="ot-sep" aria-hidden="true">·</span>
              끌어서 움직이기
            </span>
          </>
        )}
      </div>

      <nav className="orbit-index" aria-label="궤도 위 프로젝트와 논문">
        <div className="container oi-row">
          <p className="oi-head" aria-hidden="true">
            Index
          </p>
          <ul className="oi-list">
            {index.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.target}`}
                  className={activeId === it.id ? "active" : undefined}
                  onMouseEnter={() => setListActive(it.id)}
                  onMouseLeave={() => setListActive(null)}
                  onFocus={() => setListActive(it.id)}
                  onBlur={() => setListActive(null)}
                >
                  <span className="n">{it.index}</span>
                  <span className="t">{it.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {support !== false && <p className="oi-hint">카드를 끌어 움직이고, 클릭하면 자세히 볼 수 있어요</p>}
        </div>
      </nav>
    </header>
  );
}
