import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim · MudiNeon" },
      { name: "description", content: "Sorularınız ve teklif talepleriniz için bize ulaşın. WhatsApp, e-posta ve form ile destek." },
      { property: "og:title", content: "İletişim · MudiNeon" },
      { property: "og:description", content: "Bize ulaşın, sorularınızı cevaplayalım." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  message: z.string().trim().min(10).max(1000),
});

function ContactPage() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    toast.success(t("contactSuccessToast"));
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("contactTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("contactSubtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <a href="https://wa.me/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-accent">
            <MessageCircle className="h-5 w-5 text-neon-pink" />
            <div>
              <div className="font-medium">{t("contactWhatsApp")}</div>
              <div className="text-sm text-muted-foreground">{t("contactWhatsAppDesc")}</div>
            </div>
          </a>
          <a href="mailto:info@mudineon.com" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-accent">
            <Mail className="h-5 w-5 text-neon-cyan" />
            <div>
              <div className="font-medium">{t("contactEmail")}</div>
              <div className="text-sm text-muted-foreground">info@mudineon.com</div>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Phone className="h-5 w-5 text-terracotta" />
            <div>
              <div className="font-medium">{t("contactPhone")}</div>
              <div className="text-sm text-muted-foreground">{t("contactPhoneHours")}</div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="c-name">{t("contactNameLabel")}</Label>
              <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="c-phone">{t("contactPhoneLabel")}</Label>
              <Input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="c-email">{t("contactEmailLabel")}</Label>
            <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="c-msg">{t("contactMessageLabel")}</Label>
            <Textarea id="c-msg" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit" className="w-full bg-gradient-neon text-white shadow-glow">
            {t("contactSendBtn")}
          </Button>
        </form>
      </div>
    </div>
  );
}

