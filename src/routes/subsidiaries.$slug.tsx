import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SUBSIDIARIES } from "@/lib/site-data";
import { useSubsidiaries } from "@/lib/content-hooks";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/subsidiaries/$slug")({
  loader: ({ params }) => {
    const item = SUBSIDIARIES.find((s) => s.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Subsidiary not found" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.item;
    return {
      meta: [
        { title: `${s.name} — Trans Sahara Consortium` },
        { name: "description", content: s.description },
        { property: "og:title", content: s.name },
        { property: "og:description", content: s.tagline },
        { property: "og:url", content: `/subsidiaries/${s.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `/subsidiaries/${s.slug}` }],
    };
  },
  component: Detail,
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-3xl font-bold">Subsidiary not found</h1>
      <Link to="/subsidiaries" className="btn-outline mt-6 inline-flex">View all subsidiaries</Link>
    </div>
  ),
});

function Detail() {
  const { item: loaderItem } = Route.useLoaderData();
  const { data: subs = [] } = useSubsidiaries();
  const item = subs.find((s) => s.slug === loaderItem.slug) ?? loaderItem;
  const idx = subs.findIndex((s) => s.slug === item.slug);
  const next = subs[((idx < 0 ? 0 : idx) + 1) % (subs.length || 1)] ?? item;


  return (
    <>
      <section className="relative overflow-hidden ink-gradient text-white">
        <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" width={1200} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="container-page relative py-24 md:py-36">
          <Link to="/subsidiaries" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
            <ArrowLeft className="h-4 w-4" /> All subsidiaries
          </Link>
          <span className="eyebrow text-brand-green">Subsidiary 0{idx + 1} / 06</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold max-w-3xl leading-[1.05]">{item.name}</h1>
          <p className="mt-6 text-xl text-brand-green max-w-2xl">{item.tagline}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow">Overview</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">A focused business, backed by a consortium.</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{item.description}</p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              As part of Trans Sahara Consortium, {item.short} draws on shared group resources — engineering
              talent, project finance, HSE governance and logistics — to deliver at a scale few standalone
              operators can match.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-secondary/60 border border-border p-8">
              <span className="eyebrow">Core capabilities</span>
              <ul className="mt-5 space-y-3">
                {item.capabilities.map((c: string) => (
                  <li key={c} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-brand-green-deep shrink-0 mt-0.5" />
                    <span className="font-medium">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <Link
            to="/subsidiaries/$slug"
            params={{ slug: next.slug }}
            className="group flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-card border border-border p-8 hover:border-brand-green/50 transition-all"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Next subsidiary</div>
              <div className="mt-1 text-2xl font-bold">{next.short}</div>
            </div>
            <ArrowRight className="h-6 w-6 text-brand-green-deep transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
