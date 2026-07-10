import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getPricingConfig, updatePricingConfig } from "@/lib/pricing.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/pricing")({
  component: AdminPricing,
});

type Form = {
  base_rate_per_cm2: number;
  outdoor_mult: number;
  rgb_mult: number;
  urgent_mult: number;
  extra_line_fee: number;
  shipping_tr: number;
  decoration_preset_base: number;
  decoration_upload_base: number;
  adapter_tr: number;
  adapter_eu: number;
  decoration_hybrid_fee: number;
  decoration_print_only_mult: number;
};

const FIELDS: { key: keyof Form; label: string; hint?: string; step?: number }[] = [
  { key: "base_rate_per_cm2", label: "Taban fiyat (TRY / cm²)", step: 0.1 },
  { key: "outdoor_mult", label: "Dış mekan çarpanı", hint: "1.25 → +%25", step: 0.05 },
  { key: "rgb_mult", label: "RGB çarpanı", step: 0.05 },
  { key: "urgent_mult", label: "Acil üretim çarpanı", step: 0.05 },
  { key: "extra_line_fee", label: "Ek satır ücreti (TRY)" },
  { key: "shipping_tr", label: "Kargo (TRY)" },
  { key: "decoration_preset_base", label: "Süsleme (preset) taban" },
  { key: "decoration_upload_base", label: "SVG yükleme (süsleme) taban" },
  { key: "adapter_tr", label: "TR adaptör" },
  { key: "adapter_eu", label: "AB adaptör" },
  { key: "decoration_hybrid_fee", label: "Süsleme Baskı + Neon Ek Ücreti (TRY)" },
  { key: "decoration_print_only_mult", label: "Süsleme Sadece Baskı Katsayısı", hint: "0.40 → %40 maliyet", step: 0.05 },
];

function AdminPricing() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["pricing_config"], queryFn: () => getPricingConfig() });
  const save = useServerFn(updatePricingConfig);
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    const adapter = (data.adapter_prices ?? { tr: 0, eu: 120 }) as {
      tr?: number;
      eu?: number;
      decoration_hybrid_fee?: number;
      decoration_print_only_mult?: number;
    };
    setForm({
      base_rate_per_cm2: Number(data.base_rate_per_cm2),
      outdoor_mult: Number(data.outdoor_mult),
      rgb_mult: Number(data.rgb_mult),
      urgent_mult: Number(data.urgent_mult),
      extra_line_fee: data.extra_line_fee,
      shipping_tr: data.shipping_tr,
      decoration_preset_base: data.decoration_preset_base,
      decoration_upload_base: data.decoration_upload_base,
      adapter_tr: adapter.tr ?? 0,
      adapter_eu: adapter.eu ?? 120,
      decoration_hybrid_fee: adapter.decoration_hybrid_fee ?? 150,
      decoration_print_only_mult: adapter.decoration_print_only_mult ?? 0.4,
    });
  }, [data]);

  if (!form) return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await save({ data: form });
      toast.success("Fiyatlandırma güncellendi");
      qc.invalidateQueries({ queryKey: ["pricing_config"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Fiyatlandırma</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Değişiklikler tasarımcıda anında hesaplamayı etkiler.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            <Input
              type="number"
              step={f.step ?? 1}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
            />
            {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy} className="bg-gradient-neon text-white">
            {busy ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
