import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SUBSIDIARIES as STATIC_SUBS, type Subsidiary as StaticSub } from "@/lib/site-data";

export type DbSubsidiary = {
  id: string;
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  capabilities: string[];
  image_url: string | null;
  sort_order: number;
};

export type MergedSubsidiary = StaticSub & { id?: string; image_url?: string | null };

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  sort_order: number;
};

export type GalleryImage = {
  id: string;
  title: string;
  category: string | null;
  image_url: string;
  sort_order: number;
};

export type AboutContent = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  story_heading: string;
  story_body: string;
  mission: string;
  vision: string;
};

const STATIC_BY_SLUG = new Map(STATIC_SUBS.map((s) => [s.slug, s]));

export function useSubsidiaries() {
  return useQuery({
    queryKey: ["subsidiaries"],
    queryFn: async (): Promise<MergedSubsidiary[]> => {
      const { data, error } = await supabase
        .from("subsidiaries")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      if (!data || data.length === 0) return STATIC_SUBS;
      return data.map((row) => {
        const fallback = STATIC_BY_SLUG.get(row.slug);
        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          short: row.short,
          tagline: row.tagline,
          description: row.description,
          capabilities: row.capabilities ?? [],
          image: row.image_url || fallback?.image || "",
          image_url: row.image_url,
        };
      });
    },
    initialData: STATIC_SUBS,
    staleTime: 30_000,
  });
}

export function useAbout() {
  return useQuery({
    queryKey: ["about_content"],
    queryFn: async (): Promise<AboutContent | null> => {
      const { data, error } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 30_000,
  });
}

export function useTeam() {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async (): Promise<TeamMember[]> => {
      const { data, error } = await supabase.from("team_members").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery_images"],
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

/** Upload a file to site-images and return a very-long-lived signed URL. */
export async function uploadSiteImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("site-images").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (upErr) throw upErr;
  // ~100 years
  const { data, error } = await supabase.storage.from("site-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 100);
  if (error || !data?.signedUrl) throw error ?? new Error("Failed to sign URL");
  return data.signedUrl;
}
