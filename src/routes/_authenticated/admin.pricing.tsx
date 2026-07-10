import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getPricingConfig, updatePricingConfig } from "@/lib/pricing.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, Percent, Settings, Sparkles, HelpCircle } from "lucide-react";

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

const SECTIONS = [
  {
    title: "Temel Fiyat Ayarları",
    description: "Tabela boyutuna ve satır sayısına göre hesaplanan baz üretim ücretleri.",
    icon: Settings,
    fields: [
      { key: "base_rate_per_cm2", label: "Taban Fiyat (TRY / cm²)", step: 0.1, suffix: "TRY" },
      { key: "extra_line_fee", label: "Ek Satır Ücreti", suffix: "TRY", hint: "Tek satır harici her ek satır için" },
      { key: "shipping_tr", label: "Yurtiçi Sabit Kargo Ücreti", suffix: "TRY" },
    ] as const,
  },
  {
    title: "Tabela Çarpanları & Opsiyonlar",
    description: "Özel üretim koşulları ve donanım katsayıları.",
    icon: Percent,
    fields: [
      { key: "outdoor_mult", label: "Dış Mekan Katsayısı", step: 0.05, suffix: "x", hint: "1.25 → Baz fiyata +%25 ekler" },
      { key: "rgb_mult", label: "RGB / Çok Renkli Katsayısı", step: 0.05, suffix: "x", hint: "1.35 → Renk geçişli şerit farkı" },
      { key: "urgent_mult", label: "Acil Üretim Katsayısı", step: 0.05, suffix: "x", hint: "1.20 → Öncelikli teslimat farkı" },
    ] as const,
  },
  {
    title: "Süslemeler & Kulüp Armaları",
    description: "Tabelalara eklenen SVG ikonlar ve hybrid baskı/neon modlarının fiyatlandırılması.",
    icon: Sparkles,
    fields: [
      { key: "decoration_preset_base", label: "Hazır İkon (Preset) Taban Ücreti", suffix: "TRY" },
      { key: "decoration_upload_base", label: "SVG Yükleme Taban Ücreti", suffix: "TRY" },
      { key: "decoration_hybrid_fee", label: "Baskı + Neon Ek Ücreti", suffix: "TRY", hint: "Arkası baskılı + önü neon şeritli tabelalar için" },
      { key: "decoration_print_only_mult", label: "Sadece Baskı Çarpanı", step: 0.05, suffix: "x", hint: "0.40 → Sadece baskılı (neon takılmayan) katman %40 oranlı maliyet" },
    ] as const,
  },
  {
    title: "Adaptör & Priz Seçenekleri",
    description: "Bölgelere göre fiş ve adaptör maliyetleri.",
    icon: DollarSign,
    fields: [
      { key: "adapter_tr", label: "TR Tip Adaptör", suffix: "TRY", hint: "Standart Türkiye priz adaptörü" },
      { key: "adapter_eu", label: "EU Tip Adaptör", suffix: "TRY", hint: "Avrupa priz adaptör farkı" },
    ] as const,
  },
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
      toast.success("Fiyatlandırma ayarları başarıyla güncellendi");
      qc.invalidateQueries({ queryKey: ["pricing_config"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fiyatlandırma güncellenirken hata oluştu");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fiyatlandırma Kuralları</h2>
          <p className="text-sm text-muted-foreground">
            Tüm tabela özelleştirme ücretlerini ve katsayılarını buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <Card key={sec.title} className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-soft transition-all duration-200 hover:border-border hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                  <div className="rounded-lg bg-accent p-2 text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{sec.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">{sec.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sec.fields.map((f) => (
                    <div key={f.key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground/90">{f.label}</Label>
                        {f.hint && (
                          <div className="group relative cursor-help text-muted-foreground hover:text-foreground">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span className="pointer-events-none absolute right-0 top-6 z-50 w-52 rounded bg-popover border border-border p-2 text-[10px] text-popover-foreground opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100">
                              {f.hint}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <Input
                          type="number"
                          step={f.step ?? 1}
                          value={form[f.key]}
                          onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
                          className="pr-12 text-sm font-medium tabular-nums"
                        />
                        <span className="absolute right-3 text-xs font-bold text-muted-foreground select-none uppercase">
                          {f.suffix}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={busy} className="bg-gradient-neon hover:opacity-95 text-white shadow-glow px-6 font-semibold min-w-[160px] transition-all duration-150">
            {busy ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
