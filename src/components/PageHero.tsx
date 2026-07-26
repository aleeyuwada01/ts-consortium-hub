import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden ink-gradient text-white">
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
        backgroundSize: "40px 40px, 60px 60px",
      }} />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-green/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="container-page relative py-24 md:py-32">
        <span className="eyebrow text-brand-green">{eyebrow}</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold max-w-3xl leading-[1.05]">{title}</h1>
        {subtitle && <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
