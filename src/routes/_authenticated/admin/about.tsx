import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAbout, type AboutContent } from "@/lib/content-hooks";

export const Route = createFileRoute("/_authenticated/admin/about")({
  component: AboutAdmin,
});

function AboutAdmin() {
  const { data } = useAbout();
  const qc = useQueryClient();
  const [form, setForm] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  if (!form) return <p className="text-muted-foreground">Loading…</p>;

  async function save() {
    if (!form) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("about_content")
      .update({
        hero_eyebrow: form.hero_eyebrow,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        story_heading: form.story_heading,
        story_body: form.story_body,
        mission: form.mission,
        vision: form.vision,
      })
      .eq("id", 1);
    setSaving(false);
    if (error) setMsg(error.message);
    else {
      setMsg("Saved.");
      qc.invalidateQueries({ queryKey: ["about_content"] });
    }
  }

  const F = ({ label, k, textarea }: { label: string; k: keyof AboutContent; textarea?: boolean }) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {textarea ? (
        <textarea
          rows={5}
          value={String(form[k] ?? "")}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={String(form[k] ?? "")}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">About page</h1>
        <p className="text-sm text-muted-foreground">Editable copy on the public /about page.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <F label="Hero eyebrow" k="hero_eyebrow" />
        <F label="Hero title" k="hero_title" />
        <F label="Hero subtitle" k="hero_subtitle" textarea />
        <F label="Story heading" k="story_heading" />
        <F label="Story body" k="story_body" textarea />
        <F label="Mission statement" k="mission" textarea />
        <F label="Vision statement" k="vision" textarea />
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
          {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
