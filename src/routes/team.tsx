import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Linkedin, Mail } from "lucide-react";
import { useTeam } from "@/lib/content-hooks";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — Trans Sahara Consortium" },
      { name: "description", content: "Meet the executive leadership steering Trans Sahara Consortium Limited across power, energy, agriculture, pipelines, logistics and mining." },
      { property: "og:title", content: "Leadership — Trans Sahara Consortium" },
      { property: "og:description", content: "The executive team behind Trans Sahara Consortium." },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: Team,
});

const ACCENTS = [
  "from-brand-green to-brand-green-deep",
  "from-brand-red to-brand-green-deep",
  "from-brand-green-deep to-brand-ink",
  "from-brand-ink to-brand-green",
  "from-brand-green to-brand-ink",
  "from-brand-red to-brand-ink",
  "from-brand-green to-brand-red",
  "from-brand-ink to-brand-green-deep",
  "from-brand-green-deep to-brand-red",
  "from-brand-ink to-brand-red",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Team() {
  const { data = [] } = useTeam();
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="The leadership behind the consortium."
        subtitle="A multidisciplinary executive team combining decades of African industrial experience with international engineering, finance and governance expertise."
      />

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((m, i) => (
              <article key={m.id} className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-brand-green/50 transition-all hover:-translate-y-1">
                <div className={`aspect-[4/5] bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} relative flex items-end justify-center p-6 overflow-hidden`}>
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-white/20">{initials(m.name)}</span>
                  )}
                  <div className="relative flex gap-2">
                    {m.linkedin_url && (
                      <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} aria-label="Email" className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{m.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{m.role}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-14 text-sm text-muted-foreground max-w-2xl">
            Full biographies and named appointments are available on request. Please{" "}
            <a href="mailto:info@tsconsortium.ng" className="text-brand-green-deep font-semibold underline underline-offset-4">contact our corporate office</a>.
          </p>
        </div>
      </section>
    </>
  );
}
