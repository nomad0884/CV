"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import profilePic from "../public/profile.jpg";

export default function Home() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const cards = [
    {
      slug: "smartworx",
      tag: "ENTERPRISE · LLM",
      title: "SmartWorx 챗봇 시스템",
      desc: "실제 기업 DB를 자연어로 질의해 SQL로 변환·시각화하는 온프레미스 챗봇. 보안을 위해 로컬 LLM(gemma·qwen2.5-coder 32B)을 구축하고, 200개 이상 테이블 메타데이터를 벡터 DB로 인덱싱해 컨텍스트 사용을 최소화했습니다. SQL 인젝션·프롬프트 공격 방어와 인수인계를 전제로 한 문서화 규칙을 설계했습니다.",
      metric: "15/15",
      mlbl: "질의 정확도 · 8B→32B",
    },
    {
      slug: "compliance",
      tag: "FINTECH · FULL-STACK",
      title: "준법 관리인 검토 시스템",
      desc: "금융 상품설명서·광고 문구의 준법 검토 병목을 줄이는 반자동 워크플로우(데이콘 · JB금융그룹 주관). 사원·준법관리인·관리자 3개 권한을 분리하고, 원본 PDF에 검토 근거를 하이라이트하는 화면을 풀스택으로 구현했습니다. 기술 중심 대신 실제 업무 요구서를 근거로 팀 의사결정을 조율했습니다.",
      metric: "3-Role",
      mlbl: "풀스택 · 반자동화",
    },
    {
      slug: "capstone",
      tag: "PM · RESEARCH",
      title: "K-POP 안무 유사도 검출 (졸업작품)",
      desc: "팀장·PM으로 진행한 콘텐츠진흥원 산학협력 연구. 초기 BiLSTM 인코더가 데이터 문제로 실패하자 사전학습 모델 전환을 제안하고 데이터셋을 전면 재구성했습니다. 멀티모달을 추가해 검출 성능을 0.87에서 0.98로 개선하고, AWS·Docker로 배포했습니다.",
      metric: "0.98",
      mlbl: "피어슨 0.87→0.98 · 우수상",
    },
    {
      slug: "stock",
      tag: "DATA · NLP",
      title: "주식 등락 원인 분석 파이프라인",
      desc: "Open DART·뉴스 API·크롤링으로 공시와 뉴스를 수집해 주가 등락 원인을 분석하는 파이프라인. 코사인 유사도 기반 중복 제거의 한계를 분석하고, STS-NLI를 결합해 한국어 뉴스의 신규 정보만 탐지하는 방식을 도출했습니다.",
      metric: "KICS",
      mlbl: "신규정보 탐지 · 논문",
    },
  ];

  return (
    <>
      <nav id="nav">
        <div className="nav-in">
          <span className="brand">SUMAN KIM</span>
          <div className="nav-links">
            <a href="#about">ABOUT</a>
            <a href="#skills">SKILLS</a>
            <a href="#work">WORK</a>
            <a href="#publications">PAPERS</a>
            <a href="#beyond">BEYOND</a>
            <a href="#contact">CONTACT</a>
          </div>
        </div>
      </nav>

      <header>
        <div className="blob a" />
        <div className="blob b" />
        <div className="wrap hero-in">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="times-line">
                국제통상 <span className="op">×</span> 소프트웨어 · 국민대학교
              </div>
              <h1 className="name">김수만</h1>
              <p className="lede">
                실제 업무의 병목을 찾아 <b>자동화</b>하는 풀스택 개발자입니다. 문제를 정의하고, 지표로
                분석하고, 배포까지 구현합니다.
              </p>
              <div className="chips">
                <div className="chip">복수전공 GPA <b>3.92 / 4.5</b></div>
                <div className="chip"><b>KICS 논문 2편</b></div>
                <div className="chip">캡스톤 경진 <b>우수상</b></div>
              </div>
            </div>
            <div className="portrait">
              <Image
                className="portrait-img"
                src={profilePic}
                alt="김수만 프로필 사진"
                placeholder="blur"
                priority
                sizes="(max-width: 820px) 72vw, 300px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span>SCROLL</span>
          <span className="bar" />
        </div>
      </header>

      {/* ABOUT */}
      <section id="about">
        <div className="wrap about-grid">
          <div className="reveal">
            <span className="eyebrow">About</span>
            <h2 className="sec-title">
              실제 업무를
              <br />
              <span className="grad-text">자동화합니다</span>
            </h2>
          </div>
          <div className="about-body reveal">
            <p>
              국제통상학과 소프트웨어를 복수전공하며 2026년 12월 졸업 예정입니다(GPA 3.92 / 4.5).
              졸업작품부터 기업 협업 프로젝트까지, 실제 데이터와 실무 요구를 다루는 개발을 해왔습니다.
            </p>
            <p>
              네 개의 프로젝트에서 일관되게 <b>기술 그 자체가 아니라 업무의 병목 해소</b>에 집중했습니다.
              문제를 정의하고, 정량 지표로 분석하며, 배포와 인수인계까지 구현합니다.
            </p>
            <div className="value-card" style={{ marginTop: "8px" }}>
              <div className="kw">
                자등명{" "}
                <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: "16px" }}>自燈明</span>
              </div>
              <div className="han">SELF-DIRECTED · PRINCIPLED</div>
              <p>
                편집 툴을 이틀 만에 독학하고, 처음 맡은 PM 역할과 로컬 LLM을 스스로 공부해 결과로
                만들었습니다. 원칙과 근거 위에서 방향을 잡고 끝까지 책임집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: "44px" }}>
            <span className="eyebrow">Skills</span>
            <h2 className="sec-title">
              직접 다뤄온 <span className="grad-text">기술 스택</span>
            </h2>
          </div>
          <div className="stack-grid">
            <div className="stack-card reveal">
              <div className="lbl">Language</div>
              <ul><li>Java</li><li>Python</li></ul>
            </div>
            <div className="stack-card reveal">
              <div className="lbl">Web · Full-stack</div>
              <ul><li>React</li><li>Next.js</li><li>인증 · 권한</li></ul>
            </div>
            <div className="stack-card reveal">
              <div className="lbl">AI · LLM</div>
              <ul><li>LangChain · LangGraph</li><li>RAG</li><li>Local LLM (온프레미스)</li></ul>
            </div>
            <div className="stack-card reveal">
              <div className="lbl">Data · Infra</div>
              <ul><li>PostgreSQL · Vector DB</li><li>Docker · AWS · CI/CD</li><li>API 수집 · 크롤링</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work">
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: "36px" }}>
            <span className="eyebrow">Selected Work</span>
            <h2 className="sec-title">
              정의 → 분석 → <span className="grad-text">구현</span>
            </h2>
          </div>

          {cards.map((c) => (
            <div className="proj reveal" key={c.slug}>
              <span className="tag">{c.tag}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link className="detail-link" href={`/work/${c.slug}`}>
                  자세히 보기 →
                </Link>
              </div>
              <div className="metric">
                {c.metric}<span className="m-lbl">{c.mlbl}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section id="publications">
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: "36px" }}>
            <span className="eyebrow">Publications</span>
            <h2 className="sec-title">
              연구를 <span className="grad-text">논문으로</span>
            </h2>
          </div>
          <div className="pubs">
            <div className="pub reveal">
              <img className="pub-cover" src="/papers/cover-kpop.jpg" alt="Pose-Tag 논문 표지" />
              <div className="pub-body">
                <span className="venue">KICS 하계종합학술발표회</span>
                <h3 className="p-title">Pose-Tag 멀티모달 융합 기반 K-pop 안무 유사 구간 검출에 관한 연구</h3>
                <p className="authors">김정인, <span className="me">김수만</span>, 배문경, 백경지, 윤수연 · 국민대학교</p>
                <div className="p-btns">
                  <a className="p-btn solid" href="/papers/kpop-pose-tag.pdf" target="_blank" rel="noopener noreferrer">논문 보기 (PDF)</a>
                </div>
              </div>
            </div>
            <div className="pub reveal">
              <img className="pub-cover" src="/papers/cover-sts.jpg" alt="STS-NLI 논문 표지" />
              <div className="pub-body">
                <span className="venue">KICS 하계종합학술발표회 · 특별세션 구두발표</span>
                <h3 className="p-title">한국어 뉴스의 의미적 중복 제거를 위한 STS-NLI 결합 기반 신규 정보 탐지</h3>
                <p className="authors"><span className="me">김수만</span>(제1저자), 윤수연 · 국민대학교</p>
                <div className="p-btns">
                  <a className="p-btn solid" href="/papers/sts-nli-news.pdf" target="_blank" rel="noopener noreferrer">논문 보기 (PDF)</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEYOND */}
      <section id="beyond">
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: "40px" }}>
            <span className="eyebrow">Beyond Code</span>
            <h2 className="sec-title">
              조직 안에서 <span className="grad-text">움직입니다</span>
            </h2>
          </div>
          <div className="beyond-grid">
            <div className="beyond-card reveal">
              <div className="role">미디어국장</div>
              <p>
                단과대 학생회 미디어국장으로 <span className="hi">연합 축제</span>를 성공적으로
                마무리했습니다. 팀원의 역할과 여건을 확인해 업무를 분배하고, 영상 편집으로 행사 콘텐츠를
                직접 제작했습니다.
              </p>
            </div>
            <div className="beyond-card reveal">
              <div className="role">병 포반장</div>
              <p>
                해병대 2사단 최전방 관측병으로 파견 근무했습니다. 위탁 교육을 수료해 병 포반장을 맡았고,
                전술 훈련 평가에서 <span className="hi">1위</span>를 기록했습니다.
              </p>
            </div>
            <div className="beyond-card reveal">
              <div className="role">Samyang Seeds</div>
              <p>
                삼양그룹 서포터즈 5기. 팀 내 편집자가 없자{" "}
                <span className="hi">이틀 만에 편집 툴을 독학</span>해 콘텐츠 제작을 맡았고, 연합 기획에서
                전체 2등을 기록했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="wrap">
          <div className="contact reveal">
            <h2>
              끊임없이 배우고
              <br />
              끝까지 책임지는 개발자가 되겠습니다
            </h2>
            <p>suman2022@naver.com</p>
            <div className="btns">
              <a className="btn primary" href="mailto:suman2022@naver.com">이메일 보내기</a>
              <a className="btn ghost" href="https://github.com/nomad0884" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
        <footer>© 2026 · 김수만</footer>
      </section>
    </>
  );
}
