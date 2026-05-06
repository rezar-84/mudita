import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/yukle")({
  head: () => ({
    meta: [
      { title: "Logo / Görsel Yükle · Mudita Dekorasyon" },
      { name: "description", content: "Logonu veya tasarımını yükle, sana özel neon tabela teklifi alalım." },
      { property: "og:title", content: "Logo / Görsel ile Teklif Al" },
      { property: "og:description", content: "Kendi logon veya tasarımın için özel neon tabela teklifi." },
    ],
  }),
  component: UploadPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  notes: z.string().trim().max(1000),
});

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!file) return toast.error("Lütfen bir görsel/logo dosyası ekleyin");
    if (file.size > 10 * 1024 * 1024) return toast.error("Dosya 10MB'dan büyük olamaz");
    toast.success("Talebiniz alındı! Görselinizi inceleyip dönüş yapacağız.");
    setForm({ name: "", email: "", phone: "", notes: "" });
    setFile(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Logo / Görsel ile Teklif Al</h1>
      <p className="mt-2 text-muted-foreground">
        Kendi logonu veya çizimini yükle, sana özel neon tabela teklifi hazırlayalım. UV baskı ve özel kesim seçenekleri mevcut.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div>
          <Label className="mb-2 block">Görsel / Logo</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center hover:bg-secondary/50">
            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium">
              {file ? file.name : "Tıkla ve yükle (PNG, JPG, SVG, PDF — max 10MB)"}
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
        <div>
          <Label htmlFor="u-notes">Notlar (ölçü, renk tercihi, kullanım alanı)</Label>
          <Textarea id="u-notes" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <Button type="submit" className="w-full bg-gradient-neon text-white shadow-glow">
          Teklif Talebi Gönder
        </Button>
      </form>
    </div>
  );
}
