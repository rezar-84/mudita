import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";
import { useDesigner } from "./DesignerContext";
import { formatTRY } from "@/lib/pricing";

const schema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter").max(100),
  email: z.string().trim().email("Geçerli e-posta giriniz").max(255),
  phone: z.string().trim().min(7, "Geçerli telefon giriniz").max(30),
  notes: z.string().trim().max(1000).optional().default(""),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  price: number;
}

export function QuoteDialog({ open, onOpenChange, price }: Props) {
  const { config } = useDesigner();
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    // Mock submit — backend integration later.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success("Teklif talebiniz alındı! En kısa sürede dönüş yapacağız.");
    onOpenChange(false);
    setForm({ name: "", email: "", phone: "", notes: "" });
    // For dev visibility:
    console.info("[quote-request]", { ...parsed.data, config });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Teklif Al</DialogTitle>
          <DialogDescription>
            Tahmini fiyat: <span className="font-medium text-foreground">{formatTRY(price)}</span>. Detaylı teklif için bilgilerinizi bırakın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="q-name">Ad Soyad</Label>
            <Input id="q-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="q-email">E-posta</Label>
            <Input id="q-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="q-phone">Telefon</Label>
            <Input id="q-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="q-notes">Notlar</Label>
            <Textarea id="q-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-neon text-white">
              {submitting ? "Gönderiliyor..." : "Teklif İste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
