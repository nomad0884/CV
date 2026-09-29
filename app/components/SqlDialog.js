"use client";

import { useId, useRef } from "react";
import Icon from "./Icons";

// "실제 생성 SQL 보기" — 네이티브 <dialog>로 띄워 포커스 가두기·Esc 닫기·배경 비활성화를 브라우저에 맡김
export default function SqlDialog({ title, subtitle, children }) {
  const ref = useRef(null);
  const titleId = useId();

  const open = () => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    document.documentElement.classList.add("modal-open");
    dialog.showModal();
  };
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" className="aside-card sql-open" onClick={open} aria-haspopup="dialog">
        <span className="sql-open-label">실제 생성 SQL 보기</span>
        <span className="sql-open-sub">자연어 질문 → 생성된 SQL 예시</span>
        <Icon name="arrowUpRight" />
      </button>
      <dialog
        ref={ref}
        className="sql-dialog"
        aria-labelledby={titleId}
        onClose={() => document.documentElement.classList.remove("modal-open")}
        onClick={(e) => {
          // 창 바깥(백드롭)을 누르면 닫기 — 내용 영역은 .sd-inner가 채우므로 dialog 자체가 대상이면 백드롭
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="sd-inner">
          <div className="sd-head">
            <div>
              <h2 id={titleId}>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <button type="button" className="lb-btn sd-close" onClick={close} aria-label="닫기">
              <Icon name="close" />
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
