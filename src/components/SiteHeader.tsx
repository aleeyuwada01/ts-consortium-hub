import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/tsc-logo.jpg.asset.json";
import { NAV_LINKS } from "@/lib/site-data";
import { useSubsidiaries } from "@/lib/content-hooks";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: SUBSIDIARIES = [] } = useSubsidiaries();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="container-page flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo.url} alt="Trans Sahara Consortium" className="h-12 w-auto" width={96} height={48} />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[13px] font-bold tracking-widest text-foreground">TRANS SAHARA</span>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-brand-green-deep">CONSORTIUM</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
            if (link.dropdown) {
              return (
                <div key={link.to} className="relative group">
                  <Link
                    to={link.to as string}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      active ? "text-brand-green-deep" : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[320px]">
                    <div className="bg-popover border border-border rounded-2xl shadow-2xl p-2 overflow-hidden">
                      {SUBSIDIARIES.map((s) => (
                        <Link
                          key={s.slug}
                          to="/subsidiaries/$slug"
                          params={{ slug: s.slug }}
                          className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
                        >
                          <span className="text-sm font-semibold">{s.short}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{s.tagline}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to as string}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  active ? "text-brand-green-deep" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link to="/contact" className="btn-primary">Get in touch</Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md hover:bg-secondary"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to as string}
                className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-4 border-l-2 border-brand-green ml-3 mt-1 flex flex-col">
              {SUBSIDIARIES.map((s) => (
                <Link
                  key={s.slug}
                  to="/subsidiaries/$slug"
                  params={{ slug: s.slug }}
                  className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {s.short}
                </Link>
              ))}
            </div>
            <Link to="/contact" className="btn-primary mt-3">Get in touch</Link>
          </div>
        </div>
      )}
    </header>
  );
}
