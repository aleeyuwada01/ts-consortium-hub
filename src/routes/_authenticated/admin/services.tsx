import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Trash2 } from "lucide-react";
import type { DbSubsidiary } from "@/lib/content-hooks";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: SubsidiariesAdmin,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function SubsidiariesAdmin() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin_subsidiaries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subsidiaries").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as DbSubsidiary[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin_subsidiaries"] });
    qc.invalidateQueries({ queryKey: ["subsidiaries"] });
  };

  async function add() {
    const name = prompt("Subsidiary name?");
    if (!name) return;
    const nextOrder = data.length ? Math.max(...data.map((s) => s.sort_order)) + 1 : 1;
    const { error } = await supabase.from("subsidiaries").insert({
      slug: slugify(name),
      name,
      short: name,
      tagline: "",
      description: "",
      capabilities: [],
      sort_order: nextOrder,
    });
    if (error) alert(error.message);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subsidiaries & Services</h1>
          <p className="text-sm text-muted-foreground">
            These entries power both the Services page and the Subsidiaries dropdown.
          </p>
        </div>
        <button onClick={add} className="btn-primary">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          {data.map((s) => (
            <SubRow key={s.id} sub={s} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubRow({ sub, onChanged }: { sub: DbSubsidiary; onChanged: () => void }) {
  const [s, setS] = useState<DbSubsidiary>(sub);
  const [caps, setCaps] = useState(sub.capabilities.join("\n"));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("subsidiaries")
      .update({
        slug: s.slug,
        name: s.name,
        short: s.short,
        tagline: s.tagline,
        description: s.description,
        capabilities: caps.split("\n").map((c) => c.trim()).filter(Boolean),
        image_url: s.image_url,
        sort_order: s.sort_order,
      })
      .eq("id", s.id);
    setSaving(false);
    if (error) alert(error.message);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const { error } = await supabase.from("subsidiaries").delete().eq("id", s.id);
    if (error) alert(error.message);
    onChanged();
  }

  return (
    <details className="rounded-2xl border border-border bg-card p-5 group" open>
      <summary className="cursor-pointer flex items-center justify-between gap-3">
        <div className="font-bold">{s.short || s.name}</div>
        <div className="text-xs text-muted-foreground font-mono">/{s.slug}</div>
      </summary>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} placeholder="Full name" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input value={s.short} onChange={(e) => setS({ ...s, short: e.target.value })} placeholder="Short name" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input value={s.slug} onChange={(e) => setS({ ...s, slug: slugify(e.target.value) })} placeholder="URL slug" className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono" />
          <input type="number" value={s.sort_order} onChange={(e) => setS({ ...s, sort_order: Number(e.target.value) })} placeholder="Sort order" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <input value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} placeholder="Tagline" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <textarea rows={4} value={s.description} onChange={(e) => setS({ ...s, description: e.target.value })} placeholder="Description" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <div>
          <label className="text-sm font-medium">Capabilities (one per line)</label>
          <textarea rows={5} value={caps} onChange={(e) => setCaps(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono" />
        </div>
        <ImageUploader value={s.image_url} onChange={(u) => setS({ ...s, image_url: u })} folder="subsidiaries" label="Hero image" />
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
          <button onClick={remove} className="btn-outline text-brand-red"><Trash2 className="h-4 w-4" /> Delete</button>
        </div>
      </div>
    </details>
  );
}
