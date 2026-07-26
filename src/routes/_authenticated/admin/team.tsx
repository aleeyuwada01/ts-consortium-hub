import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeam, type TeamMember } from "@/lib/content-hooks";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: TeamAdmin,
});

function TeamAdmin() {
  const { data = [], isLoading } = useTeam();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["team_members"] });

  async function addMember() {
    const nextOrder = data.length ? Math.max(...data.map((m) => m.sort_order)) + 1 : 1;
    const { error } = await supabase
      .from("team_members")
      .insert({ name: "New member", role: "Role", sort_order: nextOrder });
    if (error) alert(error.message);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team members</h1>
          <p className="text-sm text-muted-foreground">Manage the leadership shown on /team.</p>
        </div>
        <button onClick={addMember} className="btn-primary">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          {data.map((m) => (
            <MemberRow key={m.id} member={m} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberRow({ member, onChanged }: { member: TeamMember; onChanged: () => void }) {
  const [m, setM] = useState<TeamMember>(member);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("team_members")
      .update({
        name: m.name,
        role: m.role,
        image_url: m.image_url,
        linkedin_url: m.linkedin_url,
        email: m.email,
        sort_order: m.sort_order,
      })
      .eq("id", m.id);
    setSaving(false);
    if (error) alert(error.message);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Delete ${m.name}?`)) return;
    const { error } = await supabase.from("team_members").delete().eq("id", m.id);
    if (error) alert(error.message);
    onChanged();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 grid gap-4 md:grid-cols-[auto_1fr_auto] items-start">
      <ImageUploader value={m.image_url} onChange={(u) => setM({ ...m, image_url: u })} folder="team" label="Photo" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} placeholder="Name" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input value={m.role} onChange={(e) => setM({ ...m, role: e.target.value })} placeholder="Role" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input value={m.linkedin_url ?? ""} onChange={(e) => setM({ ...m, linkedin_url: e.target.value || null })} placeholder="LinkedIn URL" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input value={m.email ?? ""} onChange={(e) => setM({ ...m, email: e.target.value || null })} placeholder="Email" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input type="number" value={m.sort_order} onChange={(e) => setM({ ...m, sort_order: Number(e.target.value) })} placeholder="Sort order" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={save} disabled={saving} className="btn-primary text-sm">{saving ? "…" : "Save"}</button>
        <button onClick={remove} className="btn-outline text-sm text-brand-red"><Trash2 className="h-4 w-4" /> Delete</button>
      </div>
    </div>
  );
}
