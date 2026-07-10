// 프로젝트 상세 데이터. 메인/상세 페이지가 공유합니다.
export const order = ["smartworx", "compliance", "capstone", "stock"];

export const projects = {
  smartworx: {
    title: "SmartWorx 챗봇 시스템",
    subtitle: "실제 기업 DB를 자연어로 질의하는 온프레미스 NL→SQL 챗봇",
    tags: ["ENTERPRISE", "LLM", "NL2SQL"],
    metric: "15/15",
    metricLabel: "질의 정확도 · 8B→32B",
    stack: ["Local LLM (gemma · qwen2.5-coder 32B)", "PostgreSQL", "Vector DB", "RAG", "온프레미스"],
    images: [
      { file: "smartworx-1-landing.jpg", w: 1500, h: 712, caption: "관리자 진입 화면 · 자주 쓰는 질의와 SQL 직접 실행·스키마 보기" },
      { file: "smartworx-2-chat.jpg", w: 1500, h: 709, caption: "자연어 질의 → 차트 시각화와 근거 SQL 제시 (민감 정보 마스킹)" },
    ],
    problem:
      "실제 기업의 민감한 데이터를 다뤄야 해 외부 API를 쓸 수 없었습니다. 온프레미스 로컬 LLM으로 자연어 질의를 SQL·시각화로 바꾸는 챗봇을 구축하는 것이 목표였습니다.",
    role: "초기 개발·연구 단계를 인턴처럼 단독으로 할당받아 설계부터 구현까지 진행했습니다.",
    build:
      "로컬 GPU에 gemma와 qwen2.5-coder 32B를 올리고, 질의를 명확화하는 Agent와 SQL 인젝션·프롬프트 공격을 방어하는 구조를 설계했습니다. 200개 이상 테이블 메타데이터를 PostgreSQL 기반 벡터 DB로 인덱싱해, 유사도 상위 테이블만 추출·주입하는 방식으로 컨텍스트 사용을 최소화했습니다. 응답은 30종 시각화로 분기해 자연어 답변과 함께 제공했습니다.",
    retro:
      "8B부터 32B까지 모델을 비교하며 15개 질의 중 11개 정답에서 15개 전부 정답까지 정확도를 끌어올렸습니다. 무엇보다 다음 개발자 인수인계를 전제로, Singleton 사용 금지 규칙과 AI용(md)·사람용(html) 이중 문서화 규칙을 세워 유지보수성을 확보했습니다.",
  },

  compliance: {
    title: "준법 관리인 검토 시스템",
    subtitle: "금융 상품설명서 준법 검토를 반자동화하는 워크플로우 · 데이콘 (JB금융그룹 주관)",
    tags: ["FINTECH", "FULL-STACK", "WORKFLOW"],
    metric: "3-Role",
    metricLabel: "풀스택 · 반자동화",
    stack: ["풀스택 웹", "RAG", "PDF 하이라이트", "권한 분리", "법령 교차검증"],
    images: [
      { file: "compliance-1-login.jpg", w: 1500, h: 710, caption: "역할 선택 화면 · 문서담당자 / 준법관리인 / 관리자 3개 권한" },
      { file: "compliance-2-queue.jpg", w: 1500, h: 710, caption: "준법관리인 검토 대기열 · 문서별 상태와 이슈 건수" },
      { file: "compliance-3-analysis.jpg", w: 1500, h: 712, caption: "체크리스트 42개 기준으로 원본 PDF에 근거를 하이라이트" },
      { file: "compliance-4-review.jpg", w: 1500, h: 712, caption: "검토 기준·LLM 의견·법령 근거를 교차검증하는 상세 화면" },
    ],
    problem:
      "금융 상품설명서·광고 문구의 준법 검토는 담당자가 규정과 일일이 대조해야 해 병목이 컸습니다. 사람이 최종 판단만 하면 되는 반자동 워크플로우가 목표였습니다.",
    role: "웹 개발 경험을 바탕으로 2인 팀에서 풀스택을 맡았습니다.",
    build:
      "사원·준법관리인·관리자 3개 권한을 실제 업무 환경과 유사하게 분리하고, 원본 PDF에 검토 기준별 근거를 하이라이트해 보여주는 화면을 구현했습니다. 검토 대기열, 체크리스트, LLM 검토 의견과 법령 근거 교차검증까지 실제 워크플로우를 재현했습니다.",
    retro:
      "팀원은 RAG 속도·근거 명시 등 기술 자체에 집중하려 했고, 저는 실제 업무 요구서를 근거로 워크플로우 자동화를 우선해야 한다고 판단했습니다. 제품 요구서를 근거로 합의점을 만들어 진행했습니다. 예선에서 아쉽게 탈락했지만, 기업의 니즈를 더 정확히 정의하는 훈련과 온프레미스 LLM의 필요성을 체감한 계기였습니다.",
  },

  capstone: {
    title: "K-POP 안무 유사도 검출",
    subtitle: "콘텐츠진흥원 산학협력 졸업작품 · 팀장 / PM",
    tags: ["PM", "RESEARCH", "MULTIMODAL"],
    metric: "0.98",
    metricLabel: "피어슨 0.87→0.98 · 우수상",
    stack: ["사전학습 모델", "멀티모달", "AWS", "Docker", "CI/CD"],
    images: [
      { file: "capstone-1-login.jpg", w: 548, h: 261, caption: "K-pop Visual Studio 로그인 · 서비스 진입 화면" },
      { file: "capstone-2-upload.jpg", w: 548, h: 261, caption: "원본·비교 영상 업로드 후 분석 시작" },
      { file: "capstone-3-result.jpg", w: 548, h: 261, caption: "전체 유사도와 구간별 유사 동작 비교 결과" },
    ],
    problem:
      "선행 연구가 거의 없는 주제라 AI 모델 선정, 데이터셋 구성, '안무 유사'의 정의까지 처음부터 설계해야 했습니다.",
    role: "팀장이자 PM으로 일정·역할 분배와 AI 개발을 함께 이끌었습니다.",
    build:
      "초기 BiLSTM 인코더가 데이터 품질·수량·자원 문제로 실패하자, 대학원 자문을 거쳐 사전학습 모델 전환을 제안하고 데이터셋을 전면 재구성했습니다. 콘텐츠진흥원 실무자와 4차례 회의로 '유사도'의 정의를 현장 기준에 맞췄고, 멀티모달을 추가해 검증 피어슨 상관계수를 0.8653에서 0.9766으로(약 11%p) 개선했습니다. AWS·Docker·GPU 서버로 배포했습니다.",
    retro:
      "개발 실력이 부족한 팀원에게는 제가 웹 뼈대를 만들어 주고 로그인·업로드·프로필처럼 학습하며 할 수 있는 부분을 맡겨 팀 전체 생산성을 유지했습니다. '좋은 데이터셋이 모델 구조보다 중요하다'를 처음 체감했습니다. 경진대회 우수상과 KICS 하계 특별세션 구두발표로 이어졌습니다.",
  },

  stock: {
    title: "주식 등락 원인 분석 파이프라인",
    subtitle: "공시·뉴스·거시지표를 모아 등락 원인을 정리하는 분석 도구",
    tags: ["DATA", "NLP", "PIPELINE"],
    metric: "KICS",
    metricLabel: "신규정보 탐지 · 논문 발표",
    stack: ["Open DART", "네이버 뉴스 API", "크롤링", "STS-NLI", "OpenAI API", "Streamlit"],
    images: [
      { file: "stock-2-financials.jpg", w: 1500, h: 707, caption: "3개년 재무제표와 전년 대비 증감 (공개 공시 데이터)" },
      { file: "stock-3-macro.jpg", w: 1500, h: 715, caption: "거시경제 지표 수집 화면 · 환율·리스크·원자재" },
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
