"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icons";

// 전체 화면 이미지 보기. Esc·←→ 키, 포커스 가두기, 닫을 때 원래 위치로 포커스 복귀.
export default function Lightbox({ images, index, label, onClose, onIndex, getReturnFocus }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const returnRef = useRef(getReturnFocus);
  returnRef.current = getReturnFocus;
  const n = images.length;
  const img = images[index];

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      // 확대 보기 안에서 이미지를 넘겼다면 원래 버튼이 아니라 지금 보이는 슬라이드로 포커스를 돌려줌
      const target = returnRef.current?.() || previous;
      if (target && typeof target.focus === "function") target.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndex(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndex(index - 1);
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onIndex]);

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} 이미지 확대 보기`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label="닫기">
        <Icon name="close" />
      </button>
      <figure className="lb-figure" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="lb-img-wrap">
          <Image src={img.src} alt={img.alt} fill sizes="100vw" className="lb-img" priority />
        </div>
        <figcaption aria-live="polite" aria-atomic="true">
          <span className="mono" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <span className="sr-only">
            {n}장 중 {index + 1}번째:{" "}
          </span>
          {img.caption}
        </figcaption>
      </figure>
      {n > 1 && (
        <>
          <button type="button" className="lb-btn lb-prev" onClick={() => onIndex(index - 1)} aria-label="이전 이미지">
            <Icon name="arrowLeft" />
          </button>
          <button type="button" className="lb-btn lb-next" onClick={() => onIndex(index + 1)} aria-label="다음 이미지">
            <Icon name="arrowRight" />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
