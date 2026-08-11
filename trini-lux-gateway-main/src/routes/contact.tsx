import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { commerceService } from "@/services/commerce.service";

const title = "Contact & Store — TRINI INTERNATIONAL, Trichy";
const description =
  "Visit our Trichy - Puthur store or reach our support team for orders, warranty and bulk enquiries. Fast customer support, 7 days a week.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.message) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);

    try {
      const whatsappNumber = "919363328178";

      const whatsappMessage = `
Hello Trini International,

I would like to make an enquiry.

Name: ${form.name}
Email: ${form.email || "Not provided"}
Phone: ${form.phone}

Message:
${form.message}
      `.trim();

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      toast.success("Opening WhatsApp...");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error("Unable to open WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            We're here to <span className="text-gold">help</span>
          </>
        }
        subtitle="Trichy - Puthur store · Delivery across India · Same day dispatch"
        breadcrumb={[{ label: "Contact" }]}
      />

      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            {
              icon: MapPin,
              title: "Store",
              text: "No. 5/1 A, Aruna Nagar, Opposite BurgerMan, Puthur, Tiruchirappalli, Tamil Nadu 620021",
            },
            {
              icon: Phone,
              title: "Call / WhatsApp",
              text: "+91 93633 28177, +91 93633 28178",
            },
            {
              icon: Mail,
              title: "Email",
              text: "Trinisourcing786@gmail.com",
            },
            {
              icon: Clock,
              title: "Hours",
              text: "Mon – Sun · 10:00 AM to 9:00 PM",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="flex gap-4 rounded-3xl glass p-6"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand/15 text-primary">
                <c.icon className="size-5" />
              </span>

              <span>
                <span className="block text-sm font-semibold">
                  {c.title}
                </span>

                <span className="text-sm text-muted-foreground">
                  {c.text}
                </span>
              </span>
            </div>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-3xl glass p-7"
        >
          <h2 className="text-lg font-bold">
            Send us a message
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) =>
                setForm({ ...form, name: v })
              }
            />

            <Field
              label="Email"
              value={form.email}
              onChange={(v) =>
                setForm({ ...form, email: v })
              }
            />

            <div className="sm:col-span-2">
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) =>
                  setForm({ ...form, phone: v })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Message
            </Label>

            <Textarea
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
              placeholder="How can we help you?"
              className="min-h-36 rounded-2xl border-border bg-surface/60"
            />
          </div>

          <Button
            variant="hero"
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Opening WhatsApp…" : "Send message"}
          </Button>
        </form>
      </section>
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-2xl border-border bg-surface/60" />
    </div>
  );
}
