import Link from "next/link";
import Icon from "./Icons";
import SqlDialog from "./SqlDialog";

const SQL_TOKEN = /('(?:[^']|'')*'|\b(?:SELECT|FROM|INNER|LEFT|JOIN|ON|AND|OR|WHERE|CASE|WHEN|THEN|ELSE|END|AS)\b|\b\d+\b|>=|<=|=)/;

// 가벼운 SQL 하이라이트 (서버에서 렌더링)
function highlightSql(sql) {
  return sql.split(new RegExp(SQL_TOKEN.source, "g")).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("'")) return <span key={i} className="tk-str">{part}</span>;
    if (/^[A-Z]+$/.test(part) && SQL_TOKEN.test(part)) return <span key={i} className="tk-kw">{part}</span>;
    if (/^\d+$/.test(part)) return <span key={i} className="tk-num">{part}</span>;
    if (/^(>=|<=|=)$/.test(part)) return <span key={i} className="tk-op">{part}</span>;
    return part;
  });
}

// 실제 생성 SQL (민감 식별자는 치환된 상태로 데이터에 저장) — 버튼을 누르면 모달로 표시
function SqlSample({ sample, projectTitle }) {
  return (
    <SqlDialog title="실제 생성 SQL" subtitle={`${projectTitle} · 자연어 질문을 SQL로 변환한 결과`}>
      <p className="sql-q">
        <span className="sql-q-label">질문</span>
        {sample.question}
      </p>
      <pre className="sql-code" tabIndex={0} aria-label="생성된 SQL">
        <code>{highlightSql(sample.sql)}</code>
      </pre>
      <p className="sql-note">
        <span className="sql-badge">민감 정보 수정</span>
        {sample.note.replace(/^민감 정보 수정 — /, "")}
      </p>
    </SqlDialog>
  );
}

// 프로젝트 헤더 (메인 챕터·상세 페이지 공용)
export function ProjectHead({ project, as: Heading = "h3", titleId }) {
  const [lead, ...rest] = project.metric.split("/");
  return (
    <div className="ch-head">
      <div>
        <div className="ch-meta">
          <span className="ch-index" aria-hidden="true">
            {project.index}
          </span>
          <ul className="tags" aria-label="분야">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <Heading className="ch-title" id={titleId}>
          {project.title}
        </Heading>
        <p className="ch-sub">{project.subtitle}</p>
      </div>
      <div className="metric">
        <span className="num">
          {rest.length ? (
            <>
              <span className="accent">{lead}</span>/{rest.join("/")}
            </>
          ) : (
            <span className="accent">{project.metric}</span>
          )}
        </span>
        <span className="lbl">{project.metricLabel}</span>
      </div>
    </div>
  );
}

// 문제 · 구현 · 회고 + 역할 · 스택 요약 (메인 챕터·상세 페이지 공용)
export function ProjectStory({ project, slug, showLink = true, labelAs: Label = "h4" }) {
  const blocks = [
    ["문제 · 배경", project.problem],
    ["구현", project.build],
    ["회고 · 성과", project.retro],
  ];
  return (
    <div className="ch-body">
      <div className="story">
        {blocks.map(([label, text], i) => (
          <div className="story-block" key={label}>
            <Label className="sb-label">
              <span className="sn">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </Label>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <aside className="aside" aria-label={`${project.title} 요약`}>
        <div className="aside-card">
          <Label className="ac-label">역할</Label>
          <p>{project.role}</p>
        </div>
        <div className="aside-card">
          <Label className="ac-label">기술 스택</Label>
          <ul className="chips">
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {project.sqlSample && <SqlSample sample={project.sqlSample} projectTitle={project.title} />}
        {showLink && (
          <Link className="link-arrow" href={`/work/${slug}`}>
            케이스 스터디 페이지로 보기
            <span className="sr-only">: {project.title}</span>
            <Icon name="arrowUpRight" />
          </Link>
        )}
      </aside>
    </div>
  );
}
