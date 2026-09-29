// 가로 스크롤 줄(썸네일·탭) 안에서 요소가 가운데 오도록 줄만 스크롤 — 페이지 세로 위치는 건드리지 않음
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function centerInStrip(strip, el) {
  if (!strip || !el) return;
  const s = strip.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  strip.scrollTo({
    left: strip.scrollLeft + (r.left - s.left) - s.width / 2 + r.width / 2,
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}
