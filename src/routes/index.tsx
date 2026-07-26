import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Droplet, Wheat, GitBranch, Truck, Mountain, ArrowUpRight } from "lucide-react";
import heroImg from "@/assets/hero-sahara.jpg";
import { useSubsidiaries } from "@/lib/content-hooks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trans Sahara Consortium — Building Africa's Industrial Backbone" },
      {
        name: "description",
        content:
          "A diversified industrial group delivering power, oil & gas, agriculture, pipelines, logistics and mining projects across Africa. Headquartered in Abuja, Nigeria.",
      },
      { property: "og:title", content: "Trans Sahara Consortium Limited" },
      {
        property: "og:description",
        content:
          "Integrated industrial solutions across power, energy, agriculture, pipelines, logistics and mining.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const ICONS: Record<string, typeof Zap> = {
  "power-infrastructure": Zap,
  "oil-and-gas": Droplet,
  "agriculture": Wheat,
  "pipeline-infrastructure": GitBranch,
  "logistics-services": Truck,
  "mining-and-exploration": Mountain,
};

function Home() {
  const { data: SUBSIDIARIES = [] } = useSubsidiaries();
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Sahara landscape with industrial infrastructure at sunset"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="container-page relative py-24 text-white">
          <span className="eyebrow text-brand-green">Trans Sahara Consortium Ltd</span>
          <h1 className="mt-5 text-5xl md:text-7xl lg:text-8xl font-bold max-w-4xl leading-[0.98]">
            Building Africa's <span className="text-brand-green">industrial</span> backbone.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
            From the power grids and pipelines that energize a continent, to the farms, fleets and mines that
            feed and fuel it — we deliver integrated solutions at Sahara-scale.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/subsidiaries" className="btn-primary">
              Explore Our Subsidiaries <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline text-white">
              Partner with us
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
            {[
              ["6", "Subsidiaries"],
              ["15+", "Years of expertise"],
              ["100+", "Projects delivered"],
              ["1", "Trusted partner"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-4xl md:text-5xl font-bold text-brand-green">{n}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              One consortium.<br /> Six industries.<br /> Endless capability.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Trans Sahara Consortium Limited is a Nigerian-headquartered industrial group operating six
              specialized subsidiaries across the sectors that matter most to Africa's future — energy,
              agriculture, infrastructure, logistics and natural resources.
            </p>
            <p>
              We combine the agility of a project-focused business with the balance sheet and technical depth
              of a diversified conglomerate — delivering to international standards, on Sahara timelines.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-brand-green-deep font-semibold hover:gap-3 transition-all">
              About Trans Sahara Consortium <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SUBSIDIARIES */}
      <section className="section-pad bg-secondary/40">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <span className="eyebrow">Our subsidiaries</span>
              <h2 className="mt-4 text-3xl md:text-5xl font-bold max-w-2xl">
                Six businesses. One shared standard of excellence.
              </h2>
            </div>
            <Link to="/subsidiaries" className="btn-outline text-foreground">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SUBSIDIARIES.map((s, i) => {
              const Icon = ICONS[s.slug] ?? Zap;
              return (
                <Link
                  key={s.slug}
                  to="/subsidiaries/$slug"
                  params={{ slug: s.slug }}
                  className="group relative overflow-hidden rounded-3xl bg-card border border-border hover:border-brand-green/50 transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.name}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 top-0 aspect-[4/3] bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="text-xs font-mono text-white/70">0{i + 1}</span>
                    <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <ArrowUpRight className="absolute top-5 right-5 h-6 w-6 text-white/80 transition-transform group-hover:rotate-45" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{s.short}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] ink-gradient p-10 md:p-16 text-white">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-green/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-red/20 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-2 items-center">
              <div>
                <span className="eyebrow text-brand-green">Let's build together</span>
                <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                  Have a project at continental scale?
                </h2>
                <p className="mt-4 text-white/70 max-w-md">
                  Whether you're a government, investor or industrial partner — we'd like to hear from you.
                </p>
              </div>
              <div className="flex md:justify-end">
                <Link to="/contact" className="btn-primary">
                  Start a conversation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
