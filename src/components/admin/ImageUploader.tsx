import { useState } from "react";
import { uploadSiteImage } from "@/lib/content-hooks";
import { Upload, X } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await uploadSiteImage(file, folder);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-start gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-24 w-32 rounded-lg object-cover border border-border" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brand-ink text-white flex items-center justify-center"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-32 rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <label className="btn-outline cursor-pointer inline-flex text-sm">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
      </div>
      {err && <p className="mt-1 text-xs text-brand-red">{err}</p>}
    </div>
  );
}
