// 프로젝트·논문 데이터. 메인(3D 히어로·프로젝트 챕터)과 상세 페이지가 공유합니다.
// 이미지 경로는 /public 기준이며, 공개 전 민감 정보(회사명·접속 정보·DB 식별자)를 가린 파일입니다.
export const order = ["nl2sql", "compliance", "capstone", "stock"];

export const projects = {
  nl2sql: {
    index: "01",
    short: "NL2SQL",
    title: "NL2SQL 프로젝트",
    subtitle: "기업 DB를 자연어로 질의해 SQL·시각화로 답하는 온프레미스 LLM 챗봇",
    tags: ["Enterprise", "LLM Agent", "NL2SQL"],
    metric: "15/15",
    metricLabel: "질의 정확도 · 8B→32B",
    stack: ["Local LLM · Ollama", "Qwen2.5-Coder 32B", "LangGraph", "FastAPI", "Vue 3", "pgvector · bge-m3", "RAG"],
    heroImages: [0, 1],
    images: [
      {
        src: "/work/nl2sql/01-landing.jpg", w: 2083, h: 971,
        caption: "대시보드 · 로컬 LLM 서버 상태와 업무 도메인 지식 그래프",
        alt: "어두운 테마의 대시보드. GPU 서버 상태와 모델 메모리 카드, 중앙 노드를 중심으로 기준정보·재고·품질 등 8개 업무 영역이 연결된 지식 그래프가 보인다.",
      },
      {
        src: "/work/nl2sql/02-chat.jpg", w: 2083, h: 975,
        caption: "자연어 질의를 SQL로 변환해 조회 결과·요약·생성 SQL을 함께 보여주는 채팅 화면",
        alt: "3단 구성의 챗봇 화면. 왼쪽 대화 기록, 가운데 작업실적 조회 질문과 답변, 오른쪽에 결과 요약·데이터 표·생성된 SQL 패널이 있다.",
      },
      {
        src: "/work/nl2sql/10-architecture.jpg", w: 2000, h: 924,
        caption: "Vue 프론트엔드 · FastAPI 에이전트 · Ollama 로컬 LLM · 읽기 전용 원본 DB 아키텍처",
        alt: "시스템 아키텍처 다이어그램. Vue 3 프론트엔드, Runtime·DEV 에이전트를 둔 FastAPI 백엔드, Qwen2.5-Coder 32B·bge-m3·Gemma 모델을 서빙하는 Ollama, 읽기 전용 원본 DB와 시스템 저장소로 구성된다.",
      },
      {
        src: "/work/nl2sql/09-two-agent.jpg", w: 2400, h: 1109,
        caption: "질문마다 실행되는 Runtime Agent와 DB 분석용 DEV Agent의 2-에이전트 구조",
        alt: "두 에이전트 아키텍처 도식. 왼쪽 채팅용 Runtime Agent의 SQL 생성 그래프, 가운데 공용 계층, 오른쪽 8단계 DB 분석 DEV Agent가 배치되어 있다.",
      },
      {
        src: "/work/nl2sql/07-request-flow.jpg", w: 2400, h: 1109,
        caption: "질문 수신부터 Agent 실행 · 7관문 SQL 검증 · 응답 저장까지의 요청 처리 흐름",
        alt: "요청 처리 흐름도. 1단계는 질문 입력·인증·맥락 복원·프롬프트 조립, 2단계는 Agent 판단·도구 실행·SQL 검증·근거 검증·저장과 응답으로 이어진다.",
      },
      {
        src: "/work/nl2sql/08-request-flow-detail.jpg", w: 2400, h: 1109,
        caption: "의도 분류 → SQL 생성 · 검증 → 실행 → 시각화 LangGraph 흐름과 자기수정 규칙",
        alt: "classify부터 finalize까지 이어지는 LangGraph 상태 그래프. 검증 실패나 실행 오류가 나면 SQL을 최대 2회까지 재생성한다.",
      },
      {
        src: "/work/nl2sql/03-analysis.jpg", w: 2400, h: 1109,
        caption: "DB 메타데이터 추출부터 관계 검증 · 임베딩까지 이어지는 8단계 분석 파이프라인",
        alt: "분석 파이프라인 도식. 청록색 분석 단계 4개와 붉은색 정리·적재 단계 4개가 8개의 카드로 이어진다.",
      },
      {
        src: "/work/nl2sql/04-analysis-detail-1.jpg", w: 2400, h: 1109,
        caption: "LLM 점수 대신 근거 유형 · 물리적 호환성 · 충돌로 계산하는 confidence 산식",
        alt: "Verifier에서 Resolver로 이어지는 검증 흐름과 confidence 계산식, 근거 유형별 직접성 점수 막대그래프를 설명하는 슬라이드.",
      },
      {
        src: "/work/nl2sql/05-analysis-detail-2.jpg", w: 2400, h: 1109,
        caption: "불확실하고 영향이 큰 가설만 골라 묻는 명확화 질문 Top-K 선정 점수식",
        alt: "업무 중요도·불확실성·하위 영향·정보 이득을 곱하고 중복 패널티를 반영한 질문 우선순위 점수식 도식.",
      },
      {
        src: "/work/nl2sql/06-analysis-detail-3.jpg", w: 2400, h: 1109,
        caption: "잘못된 JOIN을 대화로 정정하고 근거와 함께 게시한 실제 개선 사례",
        alt: "잘못된 JOIN 사례를 문제·원인·조치·결과 카드로 정리하고, 게시된 변경 12건의 유형별 분포를 막대그래프로 보여주는 인포그래픽.",
      },
    ],
    problem:
      "실제 기업의 민감한 데이터를 다뤄야 해 외부 API를 쓸 수 없었습니다. 온프레미스 로컬 LLM만으로 자연어 질의를 SQL·시각화로 바꾸는 챗봇을 구축하는 것이 목표였습니다.",
    role: "초기 개발·연구 단계를 인턴처럼 단독으로 할당받아 설계부터 구현까지 진행했습니다.",
    // 실제 생성된 SQL (테이블명은 A~F, 컬럼명은 col_01~col_15로 치환 — 구조·조인·조건은 원본과 동일)
    sqlSample: {
      question:
        "26년간에 작업실적 현황을 조회해줘, 설비그룹과 아이템과 이름 000가동과 연결해서 000에 대한 이름을 알려줘.",
      sql: `SELECT
    D.col_01,
    C.col_02,
    E.col_03,
    A.col_04,
    A.col_05,
    A.col_06,
    B.col_07 AS WORK_ORDER_NAME,
    CASE WHEN C.col_08 = 'Y' THEN
      CASE WHEN F.col_09 = 0 THEN 'COMPLETE'
           WHEN F.col_10 = 0 THEN 'SKIP'
           ELSE 'NONE' END
    ELSE '' END AS SMT_CHECK_YN
FROM A
INNER JOIN B
   ON A.col_11 = B.col_11
  AND A.col_12 = B.col_12
LEFT JOIN C
   ON B.col_11 = C.col_11
  AND B.col_13 = C.col_13
INNER JOIN D
   ON C.col_11 = D.col_11
  AND C.col_14 = D.col_14
INNER JOIN E
   ON B.col_11 = E.col_11
  AND B.col_15 = E.col_15
LEFT JOIN F
   ON F.col_11 = A.col_11
  AND F.col_12 = A.col_12
WHERE A.col_06 >= '2026-01-01'
  AND A.col_06 <= '2026-12-31'`,
      note: "민감 정보 수정 — 실제 테이블명은 A~F, 컬럼명은 col_01~col_15로 바꿔 표시했습니다. 쿼리 구조·조인·조건은 실제 생성 결과와 같습니다.",
    },
    build:
      "로컬 GPU에 gemma와 qwen2.5-coder 32B를 올리고, 질문마다 도는 Runtime Agent와 DB 구조를 분석하는 DEV Agent로 역할을 나눴습니다. 200개 이상 테이블 메타데이터를 PostgreSQL 기반 벡터 DB로 인덱싱해 유사도 상위 테이블만 주입하는 방식으로 컨텍스트 사용을 최소화했고, LangGraph로 의도 분류 → SQL 생성·검증 → 조회 → 시각화 흐름과 실패 시 재생성 규칙을 구성했습니다. 원본 DB는 읽기 전용으로 두고 SQL 인젝션·프롬프트 공격을 방어했으며, 응답은 30종 시각화로 분기해 자연어 답변과 함께 제공했습니다.",
    retro:
      "8B부터 32B까지 모델을 비교하며 15개 질의 중 11개 정답에서 15개 전부 정답까지 정확도를 끌어올렸습니다. 무엇보다 다음 개발자 인수인계를 전제로, Singleton 사용 금지 규칙과 AI용(md)·사람용(html) 이중 문서화 규칙을 세워 유지보수성을 확보했습니다.",
  },

  compliance: {
    index: "02",
    short: "준법 검토",
    title: "준법 관리인 검토 시스템",
    subtitle: "금융 상품설명서 준법 검토를 반자동화하는 워크플로우 · 데이콘 (JB금융그룹 주관)",
    tags: ["Fintech", "Full-stack", "Workflow"],
    metric: "3-Role",
    metricLabel: "권한 분리 · 반자동 검토",
    stack: ["풀스택 웹", "RAG", "PDF 하이라이트", "권한 분리", "법령 교차검증"],
    heroImages: [2, 1],
    images: [
      {
        src: "/work/compliance/01-login.jpg", w: 1500, h: 710,
        caption: "역할 선택 화면 · 문서담당자 / 준법관리인 / 관리자 3개 권한",
        alt: "문서담당자, 준법관리인, 관리자 중 역할을 선택해 진입하는 화면.",
      },
      {
        src: "/work/compliance/02-queue.jpg", w: 1500, h: 710,
        caption: "준법관리인 검토 대기열 · 문서별 상태와 이슈 건수",
        alt: "검토 대기 중인 문서 목록과 문서별 처리 상태, 이슈 건수가 표시된 대기열 화면.",
      },
      {
        src: "/work/compliance/04-review.jpg", w: 1500, h: 712,
        caption: "체크리스트 42개 기준으로 원본 PDF에 검토 근거를 하이라이트",
        alt: "원본 PDF 문서 위에 체크리스트 기준별 검토 근거가 하이라이트된 분석 화면.",
      },
      {
        src: "/work/compliance/03-analysis.jpg", w: 1500, h: 712,
        caption: "검토 기준 · LLM 의견 · 법령 근거를 교차검증하는 상세 화면",
        alt: "검토 기준, LLM 검토 의견, 관련 법령 근거를 한 화면에서 비교하는 상세 검토 화면.",
      },
    ],
    problem:
      "금융 상품설명서·광고 문구의 준법 검토는 담당자가 규정과 일일이 대조해야 해 병목이 컸습니다. 사람은 최종 판단만 하면 되는 반자동 워크플로우가 목표였습니다.",
    role: "웹 개발 경험을 바탕으로 2인 팀에서 풀스택을 맡았습니다.",
    build:
      "문서담당자·준법관리인·관리자 3개 권한을 실제 업무 환경과 유사하게 분리하고, 원본 PDF에 검토 기준별 근거를 하이라이트해 보여주는 화면을 구현했습니다. 검토 대기열, 체크리스트, LLM 검토 의견과 법령 근거 교차검증까지 실제 워크플로우를 재현했습니다.",
    retro:
      "팀원은 RAG 속도·근거 명시 등 기술 자체에 집중하려 했고, 저는 실제 업무 요구서를 근거로 워크플로우 자동화를 우선해야 한다고 판단했습니다. 제품 요구서를 근거로 합의점을 만들어 진행했습니다. 예선에서 아쉽게 탈락했지만, 기업의 니즈를 더 정확히 정의하는 훈련과 온프레미스 LLM의 필요성을 체감한 계기였습니다.",
  },

  capstone: {
    index: "03",
    short: "K-POP 안무",
    title: "K-POP 안무 유사도 검출",
    subtitle: "콘텐츠진흥원 산학협력 졸업작품 · 팀장 / PM",
    tags: ["PM", "Research", "Multimodal"],
    metric: "0.98",
    metricLabel: "피어슨 0.87→0.98 · 우수상",
    stack: ["YOLOv8m · HRNet-W48", "MotionBERT · ST-GCN", "멀티모달 (Pose-Tag)", "React · Vite", "Supabase", "AWS EC2 · Docker", "GitHub Actions"],
    heroImages: [0, 2],
    images: [
      {
        src: "/work/capstone/01-landing.jpg", w: 1422, h: 881,
        caption: "K-pop Visual Studio 랜딩 · 안무 유사도 분석 서비스 소개",
        alt: "녹색 물결 배경 위 유리 카드에 '안무를 데이터로, 춤을 과학으로' 문구와 서비스 지표, 기능 소개 카드가 있는 랜딩 화면.",
      },
      {
        src: "/work/capstone/02-upload.jpg", w: 1631, h: 641,
        caption: "원본 · 비교 안무 영상을 나란히 업로드해 분석을 시작하는 화면",
        alt: "왼쪽 원본 영상, 오른쪽 비교 영상 업로드 카드와 MP4·MOV 파일 또는 유튜브 URL 입력 안내, 분석하기 버튼이 있는 화면.",
      },
      {
        src: "/work/capstone/03-result.jpg", w: 1366, h: 840,
        caption: "전체 유사도와 유사 구간을 영상 비교 · 신체 부위별 점수로 보여주는 결과 화면",
        alt: "전체 유사도 원형 게이지와 종합 해석, 유사 구간의 A·B 영상 비교와 왼팔·오른팔·왼다리 등 부위별 점수가 표시된 분석 결과 화면.",
      },
      {
        src: "/work/capstone/04-result-detail.jpg", w: 1026, h: 807,
        caption: "분석 상세 · 유사 구간의 타임코드와 동작 비교 해설",
        alt: "유사도 원형 그래프와 분석 개요, 유사 구간의 타임코드 대응과 동작 비교 설명, PDF 저장 버튼이 있는 상세 모달.",
      },
      {
        src: "/work/capstone/06-model-architecture.jpg", w: 1099, h: 1445,
        caption: "YOLOv8m · HRNet · MotionBERT 기반 전체 · 구간 유사도와 LLM 피드백 모델 구조",
        alt: "두 영상을 YOLOv8m과 HRNet-W48로 처리한 뒤 MotionBERT 기반 전체 유사도와 5초 구간 매칭으로 나뉘고, 결과를 통합해 LLM이 자연어 피드백을 생성하는 모델 구조도.",
      },
      {
        src: "/work/capstone/05-architecture.jpg", w: 1450, h: 660,
        caption: "GitHub Actions → ECR → EC2 Docker로 배포한 서비스 아키텍처",
        alt: "GitHub Actions에서 이미지를 빌드해 ECR로 푸시하고, EC2의 Docker 컨테이너(프론트엔드·API 서버·Python AI 서버)가 Supabase·OpenAI와 연동되는 아키텍처.",
      },
    ],
    problem:
      "선행 연구가 거의 없는 주제라 AI 모델 선정, 데이터셋 구성, '안무 유사'의 정의까지 처음부터 설계해야 했습니다.",
    role: "팀장이자 PM으로 일정·역할 분배와 AI 개발을 함께 이끌었고, MotionBERT + ST-GCN 모델 설계를 담당했습니다.",
    build:
      "초기 BiLSTM 인코더가 데이터 품질·수량·자원 문제로 실패하자, 대학원 자문을 거쳐 사전학습 모델 전환을 제안하고 데이터셋을 전면 재구성했습니다. 콘텐츠진흥원 실무자와 4차례 회의로 '유사도'의 정의를 현장 기준에 맞췄고, 멀티모달을 추가해 검증 피어슨 상관계수를 0.8653에서 0.9766으로(약 11%p) 개선했습니다. AWS·Docker·GPU 서버로 배포했습니다.",
    retro:
      "개발 실력이 부족한 팀원에게는 제가 웹 뼈대를 만들어 주고 로그인·업로드·프로필처럼 학습하며 할 수 있는 부분을 맡겨 팀 전체 생산성을 유지했습니다. '좋은 데이터셋이 모델 구조보다 중요하다'를 처음 체감했습니다. 경진대회 우수상과 KICS 하계 특별세션 구두발표로 이어졌습니다.",
  },

  stock: {
    index: "04",
    short: "뉴스 분석",
    title: "주식 등락 원인 분석 파이프라인",
    subtitle: "공시 · 뉴스 · 거시지표를 모아 등락 원인을 정리하는 뉴스 분석 도구",
    tags: ["Data", "NLP", "Pipeline"],
    metric: "KICS",
    metricLabel: "신규정보 탐지 · 논문 발표",
    stack: ["Open DART", "네이버 뉴스 API", "크롤링", "STS-NLI", "OpenAI API", "Streamlit"],
    heroImages: [0, 1],
    images: [
      {
        src: "/work/stock/01-financials.jpg", w: 1500, h: 707,
        caption: "3개년 재무제표와 전년 대비 증감 (공개 공시 데이터)",
        alt: "공개 공시 데이터로 만든 3개년 재무제표 표와 전년 대비 증감이 표시된 화면.",
      },
      {
        src: "/work/stock/02-macro.jpg", w: 1500, h: 715,
        caption: "거시경제 지표 수집 화면 · 환율 · 리스크 · 원자재",
        alt: "환율, 리스크 지표, 원자재 가격 등 거시경제 지표를 모아 보여주는 화면.",
      },
    ],
    galleryNote: "* Streamlit 기반 프로토타입 화면입니다.",
    problem:
      "뉴스·공시가 과다해 시장 참여자가 핵심 정보를 선택하기 어렵다는 문제에서 출발했습니다. '왜 올랐고 왜 내렸는가'를 정리해 보여주는 것이 목표였습니다.",
    role: "데이터 수집부터 분석 파이프라인 설계·구현까지 담당했습니다.",
    build:
      "OPEN DART 공시, 네이버 뉴스 API, 크롤링, 거시경제·주식 정보를 하나의 파이프라인으로 정리하고, OpenAI 모델로 hallucination을 줄인 분석을 제공했습니다. 내부자 매매·계약·주요사항처럼 참여자가 오래 찾아야 하는 정보를 한 번에 모았습니다.",
    retro:
      "뉴스 중복 제거에서 코사인 유사도(80% 동일 / 20% 상이)만으로는 20%에 든 핵심 정보를 놓치는 한계를 분석했고, STS-NLI를 결합해 한국어 뉴스의 신규 정보만 탐지하는 파이프라인을 도출했습니다. 이 연구는 KICS 하계 특별세션에서 구두발표했습니다.",
  },
};

export const papers = [
  {
    id: "paper-pose-tag",
    index: "P1",
    short: "Pose-Tag 논문",
    venue: "KICS 하계종합학술발표회",
    title: "Pose-Tag 멀티모달 융합 기반 K-pop 안무 유사 구간 검출에 관한 연구",
    summary: "포즈와 태그 정보를 결합한 멀티모달 융합으로 두 안무 영상의 유사 구간을 검출합니다.",
    authors: [
      { name: "김정인" },
      { name: "김수만", me: true },
      { name: "배문경" },
      { name: "백경지" },
      { name: "윤수연" },
    ],
    affiliation: "국민대학교",
    cover: { src: "/papers/cover-kpop.jpg", w: 360, h: 509 },
    pdf: "/papers/kpop-pose-tag.pdf",
    related: "capstone",
  },
  {
    id: "paper-sts-nli",
    index: "P2",
    short: "STS-NLI 논문",
    venue: "KICS 하계종합학술발표회 · 특별세션 구두발표",
    title: "한국어 뉴스의 의미적 중복 제거를 위한 STS-NLI 결합 기반 신규 정보 탐지",
    summary: "코사인 유사도 기반 중복 제거가 놓치는 신규 정보를 STS와 NLI를 결합해 탐지합니다.",
    authors: [{ name: "김수만", me: true, firstAuthor: true }, { name: "윤수연" }],
    affiliation: "국민대학교",
    cover: { src: "/papers/cover-sts.jpg", w: 360, h: 509 },
    pdf: "/papers/sts-nli-news.pdf",
    related: "stock",
  },
];

// 3D 히어로에 띄울 카드 목록: 프로젝트 대표 이미지 뒤에 관련 논문 표지를 이어 붙여 궤도에서 이웃하게 둔다
export function heroItems() {
  const items = [];
  const paperCard = (pp) => ({
    key: pp.id,
    id: pp.id,
    kind: "paper",
    index: pp.index,
    title: pp.title,
    meta: pp.venue,
    texture: pp.cover.src,
    w: pp.cover.w,
    h: pp.cover.h,
    target: pp.id,
  });
  order.forEach((slug) => {
    const p = projects[slug];
    p.heroImages.forEach((i, k) => {
      const img = p.images[i];
      const nn = img.src.split("/").pop().split("-")[0];
      items.push({
        key: `${slug}-${k}`,
        id: slug,
        kind: "project",
        index: p.index,
        title: p.title,
        meta: `${p.metric} · ${p.metricLabel}`,
        texture: `/work/thumbs/${slug}-${nn}.jpg`,
        w: img.w,
        h: img.h,
        target: `project-${slug}`,
      });
    });
    papers.filter((pp) => pp.related === slug).forEach((pp) => items.push(paperCard(pp)));
  });
  return items;
}

// 히어로 인덱스 목록 (카드와 1:1이 아니라 프로젝트·논문 단위)
export function heroIndex() {
  return [
    ...order.map((slug) => ({ id: slug, index: projects[slug].index, label: projects[slug].short, kind: "PROJECT", target: `project-${slug}` })),
    ...papers.map((pp) => ({ id: pp.id, index: pp.index, label: pp.short, kind: "PAPER", target: pp.id })),
  ];
}
