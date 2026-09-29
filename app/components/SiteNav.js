"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "papers", label: "Papers" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "beyond", label: "Beyond" },
  { id: "contact", label: "Contact" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onTop);
      io.disconnect();
    };
  }, []);

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`} aria-label="주요 섹션">
      <div className="container nav-in">
        <a className="brand" href="#top" aria-label="Suman Kim 김수만, 맨 위로">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-text">Suman Kim</span>
        </a>
        <ul className="nav-links" lang="en">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
