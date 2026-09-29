import { notFound } from "next/navigation";
import { projects, order } from "../projects-data";
import ProjectDetail from "../../components/ProjectDetail";
import { SHARE_IMAGE } from "../../site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return order.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const p = projects[params.slug];
  if (!p) return {};
  const title = `${p.title} — 김수만`;
  // 하위 페이지의 openGraph는 상위 값을 통째로 대체하므로 공유 이미지를 다시 지정
  return {
    title,
    description: p.subtitle,
    openGraph: { title, description: p.subtitle, type: "article", url: `/work/${params.slug}`, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title, description: p.subtitle, images: [SHARE_IMAGE.url] },
  };
}

export default function WorkPage({ params }) {
  const project = projects[params.slug];
  if (!project) notFound();

  const idx = order.indexOf(params.slug);
  const prevSlug = order[idx - 1];
  const nextSlug = order[idx + 1];
  const prev = prevSlug ? { slug: prevSlug, title: projects[prevSlug].title } : null;
  const next = nextSlug ? { slug: nextSlug, title: projects[nextSlug].title } : null;

  return <ProjectDetail project={project} slug={params.slug} prev={prev} next={next} />;
}
