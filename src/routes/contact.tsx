import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { CONTACT } from "@/lib/site-data";
import { MapPin, Phone, Mail, Globe, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Trans Sahara Consortium" },
      { name: "description", content: "Get in touch with Trans Sahara Consortium Limited at our Abuja headquarters. Phone, email and office address." },
      { property: "og:title", content: "Contact Trans Sahara Consortium" },
      { property: "og:description", content: "8th Floor, Bank of Industry Tower 2, Off Herbert Macaulay Way, Abuja, FCT." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's talk about your next project."
        subtitle="Whether you're a government body, industrial partner or investor — reach out and a member of our team will respond within one business day."
      />

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="h-11 w-11 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green-deep mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Head Office</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{CONTACT.address}</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="h-11 w-11 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-4">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Call Us</h3>
              <div className="mt-2 space-y-1">
                {CONTACT.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block text-sm text-muted-foreground hover:text-brand-green-deep">{p}</a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-card border border-border p-6">
                <Mail className="h-5 w-5 text-brand-green-deep mb-3" />
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Email</div>
                <a href={`mailto:${CONTACT.email}`} className="mt-1 block text-sm font-semibold break-all hover:text-brand-green-deep">{CONTACT.email}</a>
              </div>
              <div className="rounded-2xl bg-card border border-border p-6">
                <Globe className="h-5 w-5 text-brand-green-deep mb-3" />
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Web</div>
                <div className="mt-1 text-sm font-semibold break-all">{CONTACT.website}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl bg-card border border-border p-8 md:p-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">We typically respond within 1 business day.</p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Company" name="company" />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Area of interest</label>
                  <select className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>General enquiry</option>
                    <option>Power & Infrastructure</option>
                    <option>Oil & Gas</option>
                    <option>Agriculture</option>
                    <option>Pipeline Infrastructure</option>
                    <option>Logistics Services</option>
                    <option>Mining & Exploration</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Message</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Tell us about your project…"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary mt-6">
                {sent ? "Message sent — we'll be in touch" : (<>Send message <Send className="h-4 w-4" /></>)}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-widest font-semibold mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
