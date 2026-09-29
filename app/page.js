import Image from "next/image";
import SiteNav from "./components/SiteNav";
import Hero from "./components/Hero";
import ChapterNav from "./components/ChapterNav";
import Slider from "./components/Slider";
import Reveal from "./components/Reveal";
import Icon from "./components/Icons";
import { ProjectHead, ProjectStory } from "./components/ProjectStory";
import { order, projects, papers, heroItems, heroIndex } from "./work/projects-data";
import profilePic from "../public/profile.jpg";

const STACK = [
  { label: "Language", items: ["Java", "Python"] },
  { label: "Web · Full-stack", items: ["React · Next.js", "Vue 3", "인증 · 권한 설계"] },
  { label: "AI · LLM", items: ["LangChain · LangGraph", "RAG · Vector DB", "Local LLM (온프레미스)"] },
  { label: "Data · Infra", items: ["PostgreSQL · pgvector", "Docker · AWS · CI/CD", "API 수집 · 크롤링"] },
];

export default function Home() {
  const items = heroItems();
  const index = heroIndex();
  const chapters = order.map((slug) => ({ slug, index: projects[slug].index, short: projects[slug].short }));

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <SiteNav />
      <Hero items={items} index={index} />

      <main id="main">
        {/* WORK */}
        <section id="work" className="section" aria-labelledby="work-title" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="sec-head reveal">
              <p className="eyebrow" lang="en">
                <span className="eb-num">01</span>
                Selected Work
              </p>
              <h2 className="sec-title" id="work-title">
                문제를 정의하고, <em>끝까지</em> 구현한 프로젝트
              </h2>
              <p className="sec-lede">
                네 개의 프로젝트에서 일관되게 기술 그 자체보다 업무의 병목 해소에 집중했습니다. 화면을 넘겨보며
                구조와 결과를 확인해 보세요.
              </p>
            </div>
          </div>

          <ChapterNav items={chapters} />

          {order.map((slug) => {
            const p = projects[slug];
            return (
              <article key={slug} id={`project-${slug}`} className="chapter" aria-labelledby={`title-${slug}`}>
                <div className="container">
                  <div className="reveal">
                    <ProjectHead project={p} as="h3" titleId={`title-${slug}`} />
                  </div>
                  <div className="reveal">
                    <Slider images={p.images} label={p.title} note={p.galleryNote} />
                  </div>
                  <div className="reveal">
                    <ProjectStory project={p} slug={slug} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* PAPERS */}
        <section id="papers" className="section" aria-labelledby="papers-title">
          <div className="container">
            <div className="sec-head reveal">
              <p className="eyebrow" lang="en">
                <span className="eb-num">02</span>
                Publications
              </p>
              <h2 className="sec-title" id="papers-title">
                연구를 <em>논문</em>으로
              </h2>
              <p className="sec-lede">프로젝트에서 마주친 문제를 연구로 확장해 KICS 하계종합학술발표회에서 발표했습니다.</p>
            </div>
            <div className="papers-grid">
              {papers.map((pp) => (
                <article key={pp.id} id={pp.id} className="paper reveal">
                  <div className="paper-cover">
                    <Image
                      src={pp.cover.src}
                      alt={`${pp.short} 표지`}
                      width={pp.cover.w}
                      height={pp.cover.h}
                      sizes="(max-width: 640px) 150px, 168px"
                    />
                  </div>
                  <div className="paper-body">
                    <p className="venue">
                      {pp.index} · {pp.venue}
                    </p>
                    <h3>{pp.title}</h3>
                    <p className="authors">
                      {pp.authors.map((a, i) => (
                        <span key={a.name}>
                          {i > 0 && ", "}
                          {a.me ? <span className="me">{a.name}</span> : a.name}
                          {a.firstAuthor && <span className="paper-badge">제1저자</span>}
                        </span>
                      ))}
                      {" · "}
                      {pp.affiliation}
                    </p>
                    <p className="paper-summary">{pp.summary}</p>
                    <a className="btn btn-ghost" href={pp.pdf} target="_blank" rel="noopener noreferrer">
                      <Icon name="file" />
                      논문 보기 (PDF)
                      <span className="sr-only">, 새 창에서 열림</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="portrait reveal">
              <Image
                className="portrait-img"
                src={profilePic}
                alt="김수만 프로필 사진"
                placeholder="blur"
                sizes="(max-width: 820px) 320px, 420px"
              />
              <span className="portrait-tag" lang="en">Suman Kim</span>
            </div>
            <div className="about-body reveal">
              <p className="eyebrow" lang="en">
                <span className="eb-num">03</span>
                About
              </p>
              <h2 className="sec-title" id="about-title" style={{ marginBottom: 28 }}>
                실제 업무를 <em>자동화</em>합니다
              </h2>
              <p>
                국제통상학과 소프트웨어를 복수전공하며 2027년 2월 졸업 예정입니다(GPA 3.92 / 4.5). 졸업작품부터
                기업 협업 프로젝트까지, 실제 데이터와 실무 요구를 다루는 개발을 해왔습니다.
              </p>
              <p>
                네 개의 프로젝트에서 일관되게 <b>기술 그 자체가 아니라 업무의 병목 해소</b>에 집중했습니다. 문제를
                정의하고, 정량 지표로 분석하며, 배포와 인수인계까지 구현합니다.
              </p>
              <div className="value-card">
                <p className="kw">
                  자등명 <span>自燈明</span>
                </p>
                <p className="han">Self-directed · Principled</p>
                <p>
                  스스로 한계를 정하지 않고 꾸준히 배우며 나아갑니다. 국제통상학에서 출발해 소프트웨어 전공까지 영역을
                  넓혀 왔듯, 처음 마주한 문제 앞에서도 원칙과 근거 위에 방향을 잡고 끝까지 책임집니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section" aria-labelledby="skills-title">
          <div className="container">
            <div className="sec-head reveal">
              <p className="eyebrow" lang="en">
                <span className="eb-num">04</span>
                Skills
              </p>
              <h2 className="sec-title" id="skills-title">
                직접 다뤄온 <em>기술</em>
              </h2>
            </div>
            <div className="stack-grid">
              {STACK.map((s) => (
                <div className="stack-card reveal" key={s.label}>
                  <h3>{s.label}</h3>
                  <ul>
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEYOND */}
        <section id="beyond" className="section" aria-labelledby="beyond-title">
          <div className="container">
            <div className="sec-head reveal">
              <p className="eyebrow" lang="en">
                <span className="eb-num">05</span>
                Beyond Code
              </p>
              <h2 className="sec-title" id="beyond-title">
                조직 안에서 <em>움직입니다</em>
              </h2>
            </div>
            <div className="beyond-grid">
              <div className="beyond-card reveal">
                <h3 className="role">미디어국장</h3>
                <p className="org">단과대 학생회</p>
                <p>
                  단과대 학생회 미디어국장으로 <span className="hi">연합 축제</span>를 성공적으로 마무리했습니다.
                  팀원의 역할과 여건을 확인해 업무를 분배하고, 영상 편집으로 행사 콘텐츠를 직접 제작했습니다.
                </p>
              </div>
              <div className="beyond-card reveal">
                <h3 className="role">병 포반장</h3>
                <p className="org">해병대 2사단</p>
                <p>
                  최전방 관측병으로 파견 근무했습니다. 위탁 교육을 수료해 병 포반장을 맡았고, 전술 훈련 평가에서{" "}
                  <span className="hi">1위</span>를 기록했습니다.
                </p>
              </div>
              <div className="beyond-card reveal">
                <h3 className="role">Samyang Seeds</h3>
                <p className="org">삼양그룹 서포터즈 5기</p>
                <p>
                  팀 내 편집자가 없자 <span className="hi">이틀 만에 편집 툴을 독학</span>해 콘텐츠 제작을 맡았고,
                  연합 기획에서 전체 2등을 기록했습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="container">
            <div className="contact reveal">
              <p className="eyebrow" lang="en" style={{ justifyContent: "center" }}>
                <span className="eb-num">06</span>
                Contact
              </p>
              <h2 id="contact-title">
                끊임없이 배우고
                <br />
                끝까지 책임지는 개발자가 되겠습니다
              </h2>
              <p className="mail">suman2022@naver.com</p>
              <a className="btn btn-primary" href="https://github.com/nomad0884" target="_blank" rel="noopener noreferrer">
                <Icon name="github" />
                GitHub
                <span className="sr-only">, 새 창에서 열림</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">© 2026 · 김수만</footer>
      <Reveal />
    </>
  );
}

