import "./globals.css";

export const metadata = {
  title: "김수만 — Portfolio",
  description:
    "실제 업무의 병목을 자동화하는 풀스택 개발자 김수만의 포트폴리오. SmartWorx, 준법 검토 시스템, K-POP 안무 유사도 검출, 주식 분석 파이프라인.",
  openGraph: {
    title: "김수만 — Portfolio",
    description: "실제 업무의 병목을 자동화하는 풀스택 개발자",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
