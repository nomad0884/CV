"use client";

import { useEffect, useRef, useState } from "react";
import { centerInStrip } from "./strip";

// Work 섹션 상단에 고정되는 프로젝트 챕터 탭 (현재 보고 있는 프로젝트 표시)
export default function ChapterNav({ items }) {
  const [active, setActive] = useState(items[0]?.slug);
  const listRef = useRef(null);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(`project-${it.slug}`)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace("project-", ""));
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // 모바일에서 활성 탭이 보이도록 탭 줄만 가로 스크롤
  useEffect(() => {
    const list = listRef.current;
    centerInStrip(list, list?.querySelector('[aria-current="true"]')?.parentElement);
  }, [active]);

  return (
    <nav className="chapter-nav" aria-label="프로젝트 바로가기">
      <div className="container" style={{ height: "100%" }}>
        <ul className="cn-list" ref={listRef}>
          {items.map((it) => (
            <li key={it.slug}>
              <a href={`#project-${it.slug}`} aria-current={active === it.slug ? "true" : undefined}>
                <span className="n">{it.index}</span>
                {it.short}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
