import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { useSubsidiaries } from "@/lib/content-hooks";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Trans Sahara Consortium" },
      { name: "description", content: "Integrated industrial services from Trans Sahara Consortium across power, oil & gas, agriculture, pipelines, logistics and mining." },
      { property: "og:title", content: "Services — Trans Sahara Consortium" },
      { property: "og:description", content: "Explore the full range of industrial services offered across our six subsidiaries." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const { data: SUBSIDIARIES = [] } = useSubsidiaries();
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Integrated capability. Sector-specialist delivery."
        subtitle="Six specialist subsidiaries. One accountable partner. From feasibility to commissioning to long-term operations — we cover the full industrial project lifecycle."
      />

      <section className="section-pad">
        <div className="container-page space-y-6">
          {SUBSIDIARIES.map((s, i) => (
            <Link
              key={s.slug}
              to="/subsidiaries/$slug"
              params={{ slug: s.slug }}
              className="group grid gap-8 md:grid-cols-12 items-center rounded-3xl bg-card border border-border p-6 md:p-8 hover:border-brand-green/50 hover:-translate-y-0.5 transition-all"
            >
              <div className="md:col-span-4 relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  src={s.image}
                  alt={s.name}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-xs font-mono bg-white/85 text-brand-ink px-2 py-1 rounded">0{i + 1}</span>
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold">{s.short}</h2>
                  <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-brand-green-deep" />
                </div>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.capabilities.map((c) => (
                    <li key={c} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
