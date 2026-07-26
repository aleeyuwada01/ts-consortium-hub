import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Users, Briefcase, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

const CARDS = [
  { to: "/admin/about", label: "About page", desc: "Hero, story, mission and vision text.", icon: FileText },
  { to: "/admin/team", label: "Team members", desc: "Executive leadership entries and photos.", icon: Users },
  { to: "/admin/services", label: "Subsidiaries & Services", desc: "Six business units, taglines, capabilities, images.", icon: Briefcase },
  { to: "/admin/gallery", label: "Gallery", desc: "Photos shown on the public gallery page.", icon: ImageIcon },
] as const;

function AdminHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Content admin</h1>
      <p className="mt-2 text-muted-foreground">
        Edit any section below. Changes go live immediately — no redeploy required.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to as string}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-brand-green/50 transition-all hover:-translate-y-0.5"
          >
            <c.icon className="h-6 w-6 text-brand-green-deep" />
            <h3 className="mt-4 text-lg font-bold">{c.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
