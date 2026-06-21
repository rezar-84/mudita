import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, Palette, Sparkles, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/yukle")({
  head: () => ({
    meta: [
      { title: "Logo / Görsel ile Teklif Al · Mudita Dekorasyon" },
      { name: "description", content: "Logonu, çizimini, referans fotoğrafını veya marka tasarımını yükle, sana özel LED neon tabela teklifi hazırlayalım." },
      { property: "og:title", content: "Logo / Görsel ile Teklif Al" },
      { property: "og:description", content: "PNG, JPG, PDF, SVG — dosyanı yükle, ölçü ve detayları paylaş, ücretsiz teklif al." },
    ],
  }),
  component: UploadPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Adınızı girin").max(100),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(255),
  phone: z.string().trim().min(7, "Telefon numaranızı girin").max(30),
  size: z.string().trim().max(100),
  usage: z.string().trim().max(100),
  deadline: z.string().trim().max(100),
  notes: z.string().trim().max(1000),
});

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    size: "",
    usage: "",
    deadline: "",
    notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!file) return toast.error("Lütfen bir görsel/logo dosyası ekleyin");
    if (file.size > 10 * 1024 * 1024) return toast.error("Dosya 10MB'dan büyük olamaz");
    toast.success("Talebiniz alındı! Görselinizi inceleyip 1 iş günü içinde dönüş yapacağız.");
    setForm({ name: "", email: "", phone: "", size: "", usage: "", deadline: "", notes: "" });
    setFile(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Logonu Yükle, Teklif Al</h1>
      <p className="mt-2 text-muted-foreground">
        Logo, el çizimi, referans fotoğraf veya marka tasarımı — ne paylaşırsan paylaş, sana özel LED neon tabela teklifi hazırlayalım.
        Üretime başlamadan önce dijital tasarım onayını alıyoruz.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: FileImage, t: "Logo veya çizim" },
          { icon: Palette, t: "Referans fotoğraf" },
          { icon: Sparkles, t: "Marka tasarımı" },
        ].map((b) => (
          <div key={b.t} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm">
            <b.icon className="h-4 w-4 text-neon-pink" /> {b.t}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div>
          <Label className="mb-2 block">Görsel / Logo</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center hover:bg-secondary/50">
            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium">
              {file ? file.name : "Tıkla ve yükle"}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              Kabul edilen formatlar: PNG, JPG, PDF, SVG · max 10MB
            </span>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="u-name">Ad Soyad</Label>
            <Input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="u-phone">Telefon</Label>
            <Input id="u-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div>
          <Label htmlFor="u-email">E-posta</Label>
          <Input id="u-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="u-size">Yaklaşık ölçü</Label>
            <Input id="u-size" placeholder="örn. 80 cm" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="u-usage">Kullanım yeri</Label>
            <Input id="u-usage" placeholder="ev / kafe / vitrin" value={form.usage} onChange={(e) => setForm({ ...form, usage: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="u-deadline">Termin</Label>
            <Input id="u-deadline" placeholder="örn. 2 hafta içinde" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>

        <div>
          <Label htmlFor="u-notes">Notlar (renk tercihi, arka panel, montaj vs.)</Label>
          <Textarea id="u-notes" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <Button type="submit" className="w-full bg-gradient-neon text-white shadow-glow">
          Ücretsiz Teklif Al
        </Button>

        <p className="flex items-start gap-2 rounded-lg border border-border bg-accent/30 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
          Üretime başlamadan önce dijital tasarım onayınızı alıyoruz. Görseliniz yalnızca teklif amacıyla kullanılır.
        </p>
      </form>
    </div>
  );
}
