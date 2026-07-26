import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGallery, uploadSiteImage, type GalleryImage } from "@/lib/content-hooks";
import { Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const { data = [], isLoading } = useGallery();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["gallery_images"] });
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      let order = data.length ? Math.max(...data.map((g) => g.sort_order)) + 1 : 1;
      for (const file of files) {
        const url = await uploadSiteImage(file, "gallery");
        const { error } = await supabase.from("gallery_images").insert({
          title: title || file.name.replace(/\.[^.]+$/, ""),
          category: category || null,
          image_url: url,
          sort_order: order++,
        });
        if (error) throw error;
      }
      setTitle("");
      setCategory("");
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function remove(g: GalleryImage) {
    if (!confirm(`Delete "${g.title}"?`)) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", g.id);
    if (error) alert(error.message);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="text-sm text-muted-foreground">Photos on the public /gallery page.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional, defaults to filename)" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (optional)" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <label className="btn-primary inline-flex cursor-pointer">
          <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload images"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((g) => (
            <GalleryCard key={g.id} img={g} onDelete={() => remove(g)} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryCard({ img, onDelete, onChanged }: { img: GalleryImage; onDelete: () => void; onChanged: () => void }) {
  const [g, setG] = useState(img);
  async function save() {
    const { error } = await supabase
      .from("gallery_images")
      .update({ title: g.title, category: g.category, sort_order: g.sort_order })
      .eq("id", g.id);
    if (error) alert(error.message);
    onChanged();
  }
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <img src={g.image_url} alt={g.title} className="aspect-[4/3] w-full object-cover" />
      <div className="p-3 space-y-2">
        <input value={g.title} onChange={(e) => setG({ ...g, title: e.target.value })} className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm" />
        <input value={g.category ?? ""} onChange={(e) => setG({ ...g, category: e.target.value || null })} placeholder="Category" className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm" />
        <input type="number" value={g.sort_order} onChange={(e) => setG({ ...g, sort_order: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm" />
        <div className="flex gap-2">
          <button onClick={save} className="btn-primary text-xs flex-1 justify-center">Save</button>
          <button onClick={onDelete} className="btn-outline text-xs text-brand-red"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
