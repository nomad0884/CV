"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icons";
import Lightbox from "./Lightbox";
import { centerInStrip, prefersReducedMotion } from "./strip";

const pad = (v) => String(v).padStart(2, "0");

// 프로젝트 이미지 넘겨보기: 스와이프(scroll-snap)·버튼·키보드(←→ Home End)·썸네일·확대 보기
export default function Slider({ images, label, note, priority = false }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const thumbsRef = useRef(null);
  const targetRef = useRef(null); // 버튼·키로 넘기는 중(스크롤 애니메이션)의 목표 인덱스
  const timerRef = useRef(0);
  const indexRef = useRef(0);
  const focusFollowRef = useRef(false); // 슬라이드 안에 포커스가 있었다면 새 슬라이드로 옮김
  const [index, setIndex] = useState(0);
  const [near, setNear] = useState(priority);
  const [zoom, setZoom] = useState(null);
  const n = images.length;
  indexRef.current = index;

  const readIndex = useCallback(() => {
    const t = trackRef.current;
    return t ? Math.max(0, Math.min(n - 1, Math.round(t.scrollLeft / Math.max(1, t.clientWidth)))) : 0;
  }, [n]);

  const changeIndex = useCallback((i) => {
    const t = trackRef.current;
    const active = document.activeElement;
    if (t && active !== t && t.contains(active)) focusFollowRef.current = true;
    setIndex(i);
  }, []);

  // 트랙에 CSS scroll-behavior: smooth가 있으므로 즉시 이동은 "instant"로 명시
  const goTo = useCallback(
    (i, { instant = false } = {}) => {
      const track = trackRef.current;
      if (!track) return;
      const next = ((i % n) + n) % n;
      targetRef.current = next;
      track.scrollTo({ left: next * track.clientWidth, behavior: instant || prefersReducedMotion() ? "instant" : "smooth" });
      changeIndex(next);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        targetRef.current = null;
        setIndex(readIndex());
      }, 900);
    },
    [n, changeIndex, readIndex]
  );

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // 스와이프로 넘긴 경우 현재 인덱스 동기화
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = readIndex();
        if (targetRef.current !== null) {
          if (i === targetRef.current) targetRef.current = null;
          return;
        }
        if (i !== indexRef.current) changeIndex(i);
      });
    };
    // 사용자가 직접 넘기기 시작하면 버튼 이동 중 잠금을 풀어 스와이프가 무시되지 않게
    const release = () => {
      targetRef.current = null;
      window.clearTimeout(timerRef.current);
    };
    // 창 크기가 바뀌어도 현재 슬라이드 위치 유지
    const ro = new ResizeObserver(() => {
      track.scrollTo({ left: indexRef.current * track.clientWidth, behavior: "instant" });
    });
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("touchstart", release, { passive: true });
    track.addEventListener("wheel", release, { passive: true });
    track.addEventListener("pointerdown", release);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("touchstart", release);
      track.removeEventListener("wheel", release);
      track.removeEventListener("pointerdown", release);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [changeIndex, readIndex]);

  // 슬라이드 안에 있던 키보드 포커스를 새로 보이는 슬라이드로 옮김 (숨겨진 슬라이드에 포커스가 남지 않게)
  useEffect(() => {
    if (!focusFollowRef.current) return;
    focusFollowRef.current = false;
    trackRef.current?.children[index]?.querySelector(".sl-zoom")?.focus({ preventScroll: true });
  }, [index]);

  // 화면 가까이 오면 현재·다음 이미지를 미리 로드
  useEffect(() => {
    if (near) return undefined;
    const el = rootRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    if (el) io.observe(el);
    return () => io.disconnect();
  }, [near]);

  // 활성 썸네일이 보이도록 썸네일 줄만 가로 스크롤
  useEffect(() => {
    const strip = thumbsRef.current;
    centerInStrip(strip, strip?.children[index]);
  }, [index]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(n - 1);
    }
  };

  const onZoomIndex = useCallback(
    (i) => {
      const next = ((i % n) + n) % n;
      setZoom(next);
      goTo(next, { instant: true });
    },
    [goTo, n]
  );
  const onZoomClose = useCallback(() => setZoom(null), []);
  const getReturnFocus = useCallback(() => trackRef.current?.children[indexRef.current]?.querySelector(".sl-zoom"), []);

  return (
    <section className="slider" ref={rootRef} aria-roledescription="carousel" aria-label={`${label} 화면 ${n}장`}>
      <div className="sl-stage">
        <div className="sl-track" ref={trackRef} tabIndex={0} onKeyDown={onKeyDown} aria-label="좌우 화살표 키로 넘겨보기">
          {images.map((img, i) => {
            const current = i === index;
            return (
              <div
                key={img.src}
                className="sl-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${n}`}
                aria-hidden={current ? undefined : "true"}
              >
                {/* 접근 가능한 이름 = 이미지의 상세 대체 텍스트 + "확대 보기" */}
                <button type="button" className="sl-zoom" tabIndex={current ? 0 : -1} onClick={() => onZoomIndex(i)}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1280px) 94vw, 1200px"
                    className="sl-img"
                    priority={priority && i === 0}
                    loading={priority && i === 0 ? undefined : near && Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                  />
                  <span className="sl-zoom-hint">
                    <Icon name="expand" />
                    확대 보기
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sl-controls">
        <button type="button" className="sl-btn" onClick={() => goTo(index - 1)} aria-label="이전 이미지">
          <Icon name="arrowLeft" />
        </button>
        <span className="sl-counter" aria-hidden="true">
          <b>{pad(index + 1)}</b> / {pad(n)}
        </span>
        <button type="button" className="sl-btn" onClick={() => goTo(index + 1)} aria-label="다음 이미지">
          <Icon name="arrowRight" />
        </button>
        <p className="sl-caption" aria-live={zoom === null ? "polite" : "off"}>
          <span className="sr-only">
            {n}장 중 {index + 1}번째:{" "}
          </span>
          {images[index].caption}
        </p>
      </div>
      <div className="sl-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(index + 1) / n})` }} />
      </div>

      {n > 1 && (
        <ul className="sl-thumbs" ref={thumbsRef} aria-label="이미지 목록">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className="sl-thumb"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}번 이미지: ${img.caption}`}
                aria-current={i === index ? "true" : undefined}
              >
                <Image src={img.src} alt="" fill sizes="104px" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="sl-note">{note}</p>}

      {zoom !== null && (
        <Lightbox
          images={images}
          index={zoom}
          label={label}
          onClose={onZoomClose}
          onIndex={onZoomIndex}
          getReturnFocus={getReturnFocus}
        />
      )}
    </section>
  );
}
