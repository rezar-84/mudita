import { useDesigner } from "./DesignerContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  FONTS,
  COLORS,
  SIZES,
  BACKBOARDS,
  MOUNTINGS,
} from "@/data/options";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { FontSelector } from "./FontSelector";
import { PreviewControls } from "./PreviewControls";
import { BackgroundToggle } from "./BackgroundToggle";
import { AiIdeaPanel } from "./AiIdeaPanel";
import { t } from "@/lib/i18n";

export function ConfiguratorPanel() {
  const { config, update } = useDesigner();
  const customW = config.customWidth ?? 80;
  const customH = config.customHeight ?? 40;

  // Warnings
  const trimmed = config.text.trim();
  const isEmpty = trimmed.length === 0;
  const longestLine = Math.max(1, ...config.text.split("\n").map((l) => l.length));
  const dims = config.sizeId === "custom" ? { width: customW, height: customH }
    : SIZES.find((s) => s.id === config.sizeId)!;
  const approxLetterCm = dims.width / Math.max(longestLine, 1);
  const tooSmall = !isEmpty && approxLetterCm < 4;
  const tooLong = trimmed.length > 30;
  const currentFont = FONTS.find((f) => f.id === config.fontId);
  const complexFont = !!currentFont && (currentFont.complexity >= 1.2 || ["script", "handwritten", "retro", "elegant"].includes(currentFont.category));
  const fragile = config.outdoor && complexFont;
  const complexNote = !config.outdoor && complexFont;

  const warnings: string[] = [];
  if (tooSmall) warnings.push("Yazı çok küçük olabilir, üretim zorlaşır. Daha büyük ölçü öneririz.");
  if (tooLong) warnings.push("Yazı uzun — okunaklık için ölçüyü büyütmeyi düşünebilirsin.");
  if (fragile) warnings.push("İnce/script yazı tipi dış mekanda dayanıksız olabilir, kalın bir font öneririz.");
  if (complexNote) warnings.push("Bu yazı tipi karmaşık; üretim biraz daha uzun sürebilir.");

  return (
    <div className="space-y-6">
      {isEmpty && (
        <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          Tasarımına başlamak için aşağıdaki kutuya yazını gir.
        </div>
      )}
      {warnings.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <ul className="space-y-1">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}


      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-1">
          <TabsTrigger value="text">Yazı</TabsTrigger>
          <TabsTrigger value="style">Stil</TabsTrigger>
          <TabsTrigger value="size">Ölçü</TabsTrigger>
          <TabsTrigger value="scene">Sahne</TabsTrigger>
          <TabsTrigger value="extras">Ekstra</TabsTrigger>
        </TabsList>

        {/* TEXT */}
        <TabsContent value="text" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="neon-text" className="mb-2 block text-sm font-medium">Yazını Gir</Label>
            <Textarea
              id="neon-text"
              rows={3}
              maxLength={60}
              placeholder="Mudita"
              value={config.text}
              onChange={(e) => update({ text: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">{config.text.length}/60 karakter · Enter ile yeni satır</p>
          </div>
        </TabsContent>

        {/* STYLE: font + color */}
        <TabsContent value="style" className="space-y-6 pt-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">{t("fontType")}</Label>
            <FontSelector />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">Renk Seç</Label>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  onClick={() => update({ colorId: c.id })}
                  className={cn(
                    "h-10 rounded-full border-2 transition",
                    config.colorId === c.id ? "border-foreground scale-110" : "border-border",
                  )}
                  style={{
                    background: c.rgb
                      ? "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)"
                      : c.hex,
                    boxShadow: `0 0 12px ${c.glow}`,
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Seçili: {COLORS.find((c) => c.id === config.colorId)?.label}
            </p>
          </div>
        </TabsContent>

        {/* SIZE */}
        <TabsContent value="size" className="space-y-5 pt-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">Ölçü</Label>
            <RadioGroup
              value={config.sizeId}
              onValueChange={(v) => update({ sizeId: v as typeof config.sizeId })}
              className="grid grid-cols-2 gap-2"
            >
              {SIZES.map((s) => (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-3",
                    config.sizeId === s.id ? "border-foreground bg-accent/40" : "border-border",
                  )}
                >
                  <span className="text-sm">{s.label}</span>
                  <RadioGroupItem value={s.id} />
                </label>
              ))}
            </RadioGroup>
          </div>

          {config.sizeId === "custom" && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <div>
                <Label className="mb-2 flex items-center justify-between text-sm">
                  Genişlik <span className="text-muted-foreground">{customW} cm</span>
                </Label>
                <Slider
                  min={20} max={200} step={5}
                  value={[customW]}
                  onValueChange={([v]) => update({ customWidth: v })}
                />
              </div>
              <div>
                <Label className="mb-2 flex items-center justify-between text-sm">
                  Yükseklik <span className="text-muted-foreground">{customH} cm</span>
                </Label>
                <Slider
                  min={10} max={120} step={5}
                  value={[customH]}
                  onValueChange={([v]) => update({ customHeight: v })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Dış Mekan (IP65)</p>
              <p className="text-xs text-muted-foreground">Su geçirmez üretim, +%25</p>
            </div>
            <Switch checked={config.outdoor} onCheckedChange={(v) => update({ outdoor: v })} />
          </div>
        </TabsContent>

        {/* SCENE: background + preview controls */}
        <TabsContent value="scene" className="space-y-5 pt-4">
          <p className="text-xs text-muted-foreground">{t("tryBgTip")}</p>
          <BackgroundToggle />
          <PreviewControls />
        </TabsContent>

        {/* EXTRAS: backboard, mounting, accessories, notes */}
        <TabsContent value="extras" className="space-y-5 pt-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">Arka Panel</Label>
            <div className="grid grid-cols-2 gap-2">
              {BACKBOARDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => update({ backboard: b.id })}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition",
                    config.backboard === b.id ? "border-foreground bg-accent/40" : "border-border",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">Montaj Seçenekleri</Label>
            <RadioGroup
              value={config.mounting}
              onValueChange={(v) => update({ mounting: v as typeof config.mounting })}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            >
              {MOUNTINGS.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm",
                    config.mounting === m.id ? "border-foreground bg-accent/40" : "border-border",
                  )}
                >
                  <span>{m.label}</span>
                  <RadioGroupItem value={m.id} />
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm">Uzaktan Kumandalı Dimmer</p>
                <p className="text-[11px] text-muted-foreground">
                  Parlaklığı ve titreşim modunu uzaktan kumandayla ayarla.
                </p>
              </div>
              <Switch checked={config.dimmer} onCheckedChange={(v) => update({ dimmer: v })} />
            </div>

            {config.dimmer && (
              <div className="space-y-3 rounded-md border border-dashed border-foreground/20 bg-secondary/30 p-3">
                <p className="text-[11px] text-muted-foreground">
                  ✨ Dimmer simülasyonu: aşağıdaki ayarlar uzaktan kumandayla gerçek hayatta da yapılabilir.
                </p>
                <div>
                  <Label className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium">{t("brightness")}</span>
                    <span className="text-muted-foreground">{config.brightness ?? 100}%</span>
                  </Label>
                  <Slider
                    min={40}
                    max={120}
                    step={5}
                    value={[config.brightness ?? 100]}
                    onValueChange={([v]) => update({ brightness: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{t("flicker")}</p>
                    <p className="text-[11px] text-muted-foreground">Hafif neon titreşim efekti</p>
                  </div>
                  <Switch
                    checked={config.flicker ?? true}
                    onCheckedChange={(v) => update({ flicker: v })}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">Acil Üretim (3-5 gün)</span>
              <Switch checked={config.urgent} onCheckedChange={(v) => update({ urgent: v })} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Güç Adaptörü</Label>
              <RadioGroup
                value={config.adapter}
                onValueChange={(v) => update({ adapter: v as typeof config.adapter })}
                className="grid grid-cols-2 gap-2"
              >
                <label className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border p-2 text-sm",
                  config.adapter === "tr" ? "border-foreground bg-accent/40" : "border-border",
                )}>
                  <span>Türkiye Tipi</span><RadioGroupItem value="tr" />
                </label>
                <label className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border p-2 text-sm",
                  config.adapter === "eu" ? "border-foreground bg-accent/40" : "border-border",
                )}>
                  <span>AB Tipi (+₺120)</span><RadioGroupItem value="eu" />
                </label>
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-2 block text-sm font-medium">Özel Notlar</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Özel istekleriniz..."
              value={config.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
