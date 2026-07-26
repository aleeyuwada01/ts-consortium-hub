import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import aboutImg from "@/assets/about-office.jpg";
import { Target, Compass, ShieldCheck, HeartHandshake } from "lucide-react";
import { useAbout } from "@/lib/content-hooks";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Trans Sahara Consortium" },
      { name: "description", content: "Trans Sahara Consortium is a Nigerian industrial group delivering power, energy, agriculture, pipelines, logistics and mining projects." },
      { property: "og:title", content: "About Trans Sahara Consortium" },
      { property: "og:description", content: "Our story, our mission and the values that guide our work across Africa." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Purpose-built", body: "Every project starts with the outcome — measurable value for our clients and the communities we operate in." },
  { icon: ShieldCheck, title: "Uncompromising HSE", body: "Zero-harm operations governed by international HSE standards across every subsidiary." },
  { icon: Compass, title: "African expertise", body: "Deep local knowledge combined with global engineering capability — a rare and hard-won advantage." },
  { icon: HeartHandshake, title: "Long-term partnership", body: "We build businesses and relationships that outlast the individual project." },
];

const DEFAULTS = {
  hero_eyebrow: "About Us",
  hero_title: "A Nigerian industrial group with a Sahara-wide vision.",
  hero_subtitle: "Trans Sahara Consortium Limited was founded to bring together the specialized capability required to deliver Africa's most demanding infrastructure and industrial projects — under one accountable roof.",
  story_heading: "Built for the industries that build nations.",
  story_body: "Headquartered on the 8th Floor of the Bank of Industry Tower in Abuja, Trans Sahara Consortium operates as an integrated industrial platform — bringing engineering, capital, logistics and local expertise to bear on projects that move Africa forward. Our six subsidiaries operate independently in their sectors, yet share a common commitment to technical excellence, transparent governance and long-term community value.",
  mission: "To deliver world-class industrial and infrastructure solutions that unlock prosperity across Africa — safely, sustainably and profitably.",
  vision: "To be the most trusted African industrial consortium — the partner of choice for governments, investors and communities from the Sahara to the sea.",
};

function About() {
  const { data } = useAbout();
  const c = data ?? DEFAULTS;
  return (
    <>
      <PageHero eyebrow={c.hero_eyebrow} title={c.hero_title} subtitle={c.hero_subtitle} />

      <section className="section-pad">
        <div className="container-page grid gap-16 lg:grid-cols-2 items-center">
          <div className="relative">
            <img
              src={aboutImg}
              alt="Trans Sahara Consortium headquarters in Abuja"
              width={1600}
              height={1000}
              loading="lazy"
              className="rounded-3xl w-full h-auto shadow-2xl"
            />
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-card border border-border rounded-2xl p-6 shadow-xl max-w-xs">
              <div className="text-4xl font-bold text-brand-green-deep">6</div>
              <div className="text-sm text-muted-foreground mt-1">Specialized subsidiaries operating under one consortium</div>
            </div>
          </div>
          <div>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">{c.story_heading}</h2>
            <div className="mt-6 space-y-5 text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
              {c.story_body}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary/40">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="eyebrow">What we stand for</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold">Values that scale across every subsidiary.</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-card border border-border p-8 hover:border-brand-green/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green-deep">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl ink-gradient text-white p-10">
            <span className="eyebrow text-brand-green">Mission</span>
            <p className="mt-6 text-2xl md:text-3xl font-semibold leading-snug">{c.mission}</p>
          </div>
          <div className="rounded-3xl bg-card border border-border p-10">
            <span className="eyebrow">Vision</span>
            <p className="mt-6 text-2xl md:text-3xl font-semibold leading-snug">{c.vision}</p>
          </div>
        </div>
      </section>
    </>
  );
}
