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
import { useT } from "@/lib/i18n";

export function ConfiguratorPanel() {
  const t = useT();
  const { config, update, addTextLayer, setSelection } = useDesigner();
  const customW = config.customWidth ?? 80;
  const customH = config.customHeight ?? 40;

  // Warnings derived from the visible text layers (no global text anymore).
  const visibleLayers = (config.textLayers ?? []).filter((l) => !l.hidden && l.text.trim().length);
  const isEmpty = visibleLayers.length === 0;
  const longestLine = Math.max(
    1,
    ...visibleLayers.flatMap((l) => l.text.split("\n").map((line) => line.length)),
  );
  const dims = config.sizeId === "custom" ? { width: customW, height: customH }
    : SIZES.find((s) => s.id === config.sizeId)!;
  const approxLetterCm = dims.width / Math.max(longestLine, 1);
  const totalChars = visibleLayers.reduce((s, l) => s + l.text.length, 0);
  const tooSmall = !isEmpty && approxLetterCm < 4;
  const tooLong = totalChars > 60;
  const primaryFontId = visibleLayers[0]?.fontId ?? config.fontId;
  const currentFont = FONTS.find((f) => f.id === primaryFontId);
  const complexFont = !!currentFont && (currentFont.complexity >= 1.2 || ["script", "handwritten", "retro", "elegant"].includes(currentFont.category));
  const fragile = config.outdoor && complexFont;
  const complexNote = !config.outdoor && complexFont;

  const warnings: string[] = [];
  if (tooSmall) warnings.push(t("warningSmall"));
  if (tooLong) warnings.push(t("warningLongText"));
  if (fragile) warnings.push(t("warningOutdoorScript"));
  if (complexNote) warnings.push(t("warningComplexFont"));

  return (
    <div className="space-y-6">
      {isEmpty && (
        <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          {t("emptyHint")}
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
          <TabsTrigger value="text">{t("tabText")}</TabsTrigger>
          <TabsTrigger value="style">{t("tabStyle")}</TabsTrigger>
          <TabsTrigger value="size">{t("tabSize")}</TabsTrigger>
          <TabsTrigger value="scene">{t("tabScene")}</TabsTrigger>
          <TabsTrigger value="extras">{t("tabExtras")}</TabsTrigger>
        </TabsList>

        {/* TEXT */}
        <TabsContent value="text" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="neon-text" className="mb-2 block text-sm font-medium">{t("enterText")}</Label>
            <Textarea
              id="neon-text"
              rows={3}
              maxLength={60}
              placeholder={t("textPlaceholder")}
              value={config.text}
              onChange={(e) => update({ text: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">{config.text.length}/60 {t("textCharsHint")}</p>
          </div>
        </TabsContent>

        {/* STYLE: font + color */}
        <TabsContent value="style" className="space-y-6 pt-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">{t("fontType")}</Label>
            <FontSelector />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">{t("pickColor")}</Label>
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
              {t("selectedColor")}: {COLORS.find((c) => c.id === config.colorId)?.label}
            </p>
          </div>
        </TabsContent>

        {/* SIZE */}
        <TabsContent value="size" className="space-y-5 pt-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">{t("size")}</Label>
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
                  {t("width")} <span className="text-muted-foreground">{customW} cm</span>
                </Label>
                <Slider
                  min={20} max={200} step={5}
                  value={[customW]}
                  onValueChange={([v]) => update({ customWidth: v })}
                />
              </div>
              <div>
                <Label className="mb-2 flex items-center justify-between text-sm">
                  {t("height")} <span className="text-muted-foreground">{customH} cm</span>
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
              <p className="text-sm font-medium">{t("outdoorIP65")}</p>
              <p className="text-xs text-muted-foreground">{t("outdoorIP65Desc")}</p>
            </div>
            <Switch checked={config.outdoor} onCheckedChange={(v) => update({ outdoor: v })} />
          </div>
        </TabsContent>

        {/* SCENE: background + preview controls */}
        <TabsContent value="scene" className="space-y-5 pt-4">
          <p className="text-xs text-muted-foreground">{t("tryBgTip")}</p>
          <BackgroundToggle />
          <PreviewControls />
          <AiIdeaPanel />
        </TabsContent>

        {/* EXTRAS: backboard, mounting, accessories, notes */}
        <TabsContent value="extras" className="space-y-5 pt-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">{t("backboard")}</Label>
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
            <Label className="mb-2 block text-sm font-medium">{t("mounting")}</Label>
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
                <p className="text-sm">{t("dimmer")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("dimmerDesc")}
                </p>
              </div>
              <Switch checked={config.dimmer} onCheckedChange={(v) => update({ dimmer: v })} />
            </div>

            {config.dimmer && (
              <div className="space-y-3 rounded-md border border-dashed border-foreground/20 bg-secondary/30 p-3">
                <p className="text-[11px] text-muted-foreground">
                  {t("dimmerSimNote")}
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
                    <p className="text-[11px] text-muted-foreground">{t("flickerDesc")}</p>
                  </div>
                  <Switch
                    checked={config.flicker ?? true}
                    onCheckedChange={(v) => update({ flicker: v })}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">{t("urgentLabel")}</span>
              <Switch checked={config.urgent} onCheckedChange={(v) => update({ urgent: v })} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">{t("adapter")}</Label>
              <RadioGroup
                value={config.adapter}
                onValueChange={(v) => update({ adapter: v as typeof config.adapter })}
                className="grid grid-cols-2 gap-2"
              >
                <label className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border p-2 text-sm",
                  config.adapter === "tr" ? "border-foreground bg-accent/40" : "border-border",
                )}>
                  <span>{t("adapterTR")}</span><RadioGroupItem value="tr" />
                </label>
                <label className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border p-2 text-sm",
                  config.adapter === "eu" ? "border-foreground bg-accent/40" : "border-border",
                )}>
                  <span>{t("adapterEU")}</span><RadioGroupItem value="eu" />
                </label>
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-2 block text-sm font-medium">{t("notes")}</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder={t("notesPlaceholder")}
              value={config.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
