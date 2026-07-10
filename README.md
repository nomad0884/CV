# 김수만 포트폴리오 (Next.js)

원페이지 포트폴리오. Next.js 14 (App Router).

## 로컬에서 실행

```bash
npm install
npm run dev
```

→ 브라우저에서 http://localhost:3000

## Vercel 배포 (권장 · 무료 · 상시 접속)

### 방법 1 — GitHub 연결 (가장 쉬움)

1. 이 폴더를 GitHub 새 저장소에 올립니다.
   ```bash
   git init
   git add .
   git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/nomad0884/suman-portfolio.git
   git push -u origin main
   ```
2. https://vercel.com 로그인(GitHub 계정) → **Add New → Project**
3. 방금 올린 저장소를 선택하고 **Deploy**. 설정은 건드릴 필요 없습니다(Next.js 자동 인식).
4. 1~2분 뒤 `https://suman-portfolio.vercel.app` 형태의 URL이 발급됩니다. 이 링크를 제출하면 됩니다.

이후 `git push` 할 때마다 자동으로 재배포됩니다.

### 방법 2 — Vercel CLI

```bash
npm i -g vercel
vercel        # 최초 배포 (질문에 기본값 Enter)
vercel --prod # 프로덕션 배포
```

## 내용 수정 위치

- **텍스트 / 프로젝트**: `app/page.js`
- **프로필 사진**: `public/profile.jpg` 를 같은 이름으로 교체
- **색상 / 폰트**: `app/globals.css` 상단 `:root` 변수
- **이력서 PDF 링크**: `app/page.js` 의 `이력서 PDF` 버튼 `href`
