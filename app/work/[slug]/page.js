import { notFound } from "next/navigation";
import { projects, order } from "../projects-data";
import ProjectDetail from "../../components/ProjectDetail";

export function generateStaticParams() {
  return order.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const p = projects[params.slug];
  if (!p) return {};
  return { title: `${p.title} — 김수만`, description: p.subtitle };
}

export default function WorkPage({ params }) {
  const project = projects[params.slug];
  if (!project) notFound();

  const idx = order.indexOf(params.slug);
  const prevSlug = order[idx - 1];
  const nextSlug = order[idx + 1];
  const prev = prevSlug ? { slug: prevSlug, title: projects[prevSlug].title } : null;
  const next = nextSlug ? { slug: nextSlug, title: projects[nextSlug].title } : null;

  return <ProjectDetail project={project} prev={prev} next={next} />;
}
