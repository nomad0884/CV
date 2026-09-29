import { Inter } from "next/font/google";
import "./globals.css";

// 영문 UI 폰트: Mac은 SF Pro(시스템), 그 외 OS는 Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "김수만 — Portfolio",
  description:
    "실제 업무의 병목을 자동화하는 풀스택 · AI 개발자 김수만의 포트폴리오. NL2SQL 프로젝트, 준법 검토 시스템, K-POP 안무 유사도 검출, 뉴스 · 공시 분석 파이프라인과 KICS 논문 2편.",
  openGraph: {
    title: "김수만 — Portfolio",
    description: "실제 업무의 병목을 자동화하는 풀스택 · AI 개발자",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* JS가 켜진 경우에만 스크롤 등장 효과용으로 콘텐츠를 숨김 */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
