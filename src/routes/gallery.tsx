import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SUBSIDIARIES } from "@/lib/site-data";
import heroImg from "@/assets/hero-sahara.jpg";
import aboutImg from "@/assets/about-office.jpg";
import { useGallery } from "@/lib/content-hooks";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Trans Sahara Consortium" },
      { name: "description", content: "A visual look at Trans Sahara Consortium's projects across power, oil & gas, agriculture, pipelines, logistics and mining." },
      { property: "og:title", content: "Gallery — Trans Sahara Consortium" },
      { property: "og:description", content: "Projects and operations across Africa." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const { data = [] } = useGallery();

  const images: { src: string; alt: string; tall?: boolean }[] = data.length
    ? data.map((g) => ({ src: g.image_url, alt: g.title }))
    : [
        { src: heroImg, alt: "Sahara industrial landscape", tall: true },
        ...SUBSIDIARIES.map((s) => ({ src: s.image, alt: s.name })),
        { src: aboutImg, alt: "Corporate headquarters, Abuja" },
      ];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Projects, sites and moments from across the consortium."
        subtitle="A visual record of work in progress — from remote field sites in the Sahara belt to the headquarters that coordinates it all."
      />

      <section className="section-pad">
        <div className="container-page columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {images.map((img, i) => (
            <figure
              key={i}
              className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border group relative"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={`w-full ${img.tall ? "aspect-[3/4]" : "aspect-[4/3]"} object-cover transition-transform duration-700 group-hover:scale-105`}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {img.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
