import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useSubsidiaries } from "@/lib/content-hooks";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/subsidiaries/")({
  head: () => ({
    meta: [
      { title: "Subsidiaries — Trans Sahara Consortium" },
      { name: "description", content: "The six specialized subsidiaries of Trans Sahara Consortium Limited: power, oil & gas, agriculture, pipelines, logistics and mining." },
      { property: "og:title", content: "Our Subsidiaries — Trans Sahara Consortium" },
      { property: "og:description", content: "Meet the six businesses that form Trans Sahara Consortium." },
      { property: "og:url", content: "/subsidiaries" },
    ],
    links: [{ rel: "canonical", href: "/subsidiaries" }],
  }),
  component: List,
});

function List() {
  const { data: SUBSIDIARIES = [] } = useSubsidiaries();
  return (
    <>
      <PageHero
        eyebrow="Subsidiaries"
        title="Six businesses that form the Trans Sahara Consortium."
        subtitle="Each subsidiary operates as a sector specialist — sharing the technical, financial and governance resources of the wider group."
      />

      <section className="section-pad">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {SUBSIDIARIES.map((s, i) => (
            <Link
              key={s.slug}
              to="/subsidiaries/$slug"
              params={{ slug: s.slug }}
              className="group relative overflow-hidden rounded-3xl border border-border hover:border-brand-green/50 transition-all hover:-translate-y-1 hover:shadow-2xl bg-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 top-0 aspect-[16/10] bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
              <span className="absolute top-5 left-5 text-xs font-mono text-white/80">0{i + 1} / 06</span>
              <ArrowUpRight className="absolute top-5 right-5 h-6 w-6 text-white/90 transition-transform group-hover:rotate-45" />
              <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold">{s.short}</h3>
                <p className="mt-2 text-sm text-white/80 max-w-md">{s.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
