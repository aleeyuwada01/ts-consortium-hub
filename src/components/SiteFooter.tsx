import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import logo from "@/assets/tsc-logo.jpg.asset.json";
import { CONTACT, SUBSIDIARIES } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="ink-gradient text-white/85 mt-24">
      <div className="container-page py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo.url} alt="TSC" className="h-14 w-auto bg-white rounded-lg p-1" width={112} height={56} />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-widest">TRANS SAHARA</div>
              <div className="text-[10px] font-semibold tracking-[0.3em] text-brand-green">CONSORTIUM LTD</div>
            </div>
          </div>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            A diversified African industrial group delivering integrated solutions across power, energy,
            agriculture, logistics and mining — from Abuja to the wider Sahara.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-brand-green mb-4">SUBSIDIARIES</h4>
          <ul className="space-y-2 text-sm">
            {SUBSIDIARIES.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/subsidiaries/$slug"
                  params={{ slug: s.slug }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {s.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-brand-green mb-4">GET IN TOUCH</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 text-white/70"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-red" /><span>{CONTACT.address}</span></li>
            {CONTACT.phones.map((p) => (
              <li key={p} className="flex gap-3 text-white/70"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand-red" /><a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-white">{p}</a></li>
            ))}
            <li className="flex gap-3 text-white/70"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand-red" /><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
            <li className="flex gap-3 text-white/70"><Globe className="h-4 w-4 mt-0.5 shrink-0 text-brand-red" /><span>{CONTACT.website}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Trans Sahara Consortium Limited. All rights reserved.</span>
          <span>RC — Abuja, Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
