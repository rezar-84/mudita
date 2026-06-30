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
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  price: number;
}

export function QuoteDialog({ open, onOpenChange, price }: Props) {
  const t = useT();
  const { config } = useDesigner();
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(2, t("quoteErrName")).max(100),
    email: z.string().trim().email(t("quoteErrEmail")).max(255),
    phone: z.string().trim().min(7, t("quoteErrPhone")).max(30),
    notes: z.string().trim().max(1000).optional().default(""),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success(t("quoteSuccess"));
    onOpenChange(false);
    setForm({ name: "", email: "", phone: "", notes: "" });
    console.info("[quote-request]", { ...parsed.data, config });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("quoteTitle")}</DialogTitle>
          <DialogDescription>
            {t("quoteEstPrice")} <span className="font-medium text-foreground">{formatTRY(price)}</span>. {t("quoteSubtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="q-name">{t("contactNameLabel")}</Label>
            <Input id="q-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="q-email">{t("contactEmailLabel")}</Label>
            <Input id="q-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="q-phone">{t("contactPhoneLabel")}</Label>
            <Input id="q-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="q-notes">{t("notes")}</Label>
            <Textarea id="q-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-neon text-white">
              {submitting ? t("submitting") : t("quoteSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
