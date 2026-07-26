import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, Users, Briefcase, ImageIcon, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/about", label: "About", icon: FileText },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/services", label: "Subsidiaries & Services", icon: Briefcase },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setAllowed(!!data);
      setChecking(false);
    })();
  }, [navigate]);

  if (checking) return <div className="p-16 text-center text-muted-foreground">Checking access…</div>;
  if (!allowed) {
    return (
      <div className="p-16 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Your account is not an administrator.</p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
          className="btn-outline mt-6 inline-flex"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 self-start rounded-2xl bg-card border border-border p-4">
        <div className="px-3 py-2">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Admin</div>
          <div className="text-lg font-bold">Content</div>
        </div>
        <nav className="mt-2 flex flex-col gap-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to as string}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-brand-green/10 text-brand-green-deep" : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
