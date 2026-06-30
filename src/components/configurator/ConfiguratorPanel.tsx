import { useEffect, useState } from "react";
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
import { AlertTriangle, RotateCcw, RotateCw, FlipHorizontal2, FlipVertical2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontSelector } from "./FontSelector";
import { PreviewControls } from "./PreviewControls";
import { BackgroundToggle } from "./BackgroundToggle";
import { AiIdeaPanel } from "./AiIdeaPanel";
import { useT } from "@/lib/i18n";

export function ConfiguratorPanel() {
  const t = useT();
  const { config, update, addTextLayer, setSelection, selection, updateTextLayer } = useDesigner();
  const customW = config.customWidth ?? 80;
  const customH = config.customHeight ?? 40;

  // Active text layer is STRICTLY the selected layer. No silent fallback —
  // when nothing is selected we show an empty state asking the user to pick one.
  const layers = config.textLayers ?? [];
  const activeLayer =
    selection.kind === "textLayer"
      ? layers.find((l) => l.id === selection.id) ?? null
      : null;

  const [tab, setTab] = useState<string>("text");
  useEffect(() => {
    const onOpenScene = () => setTab("scene");
    window.addEventListener("mudita:open-scene", onOpenScene);
    return () => window.removeEventListener("mudita:open-scene", onOpenScene);
  }, []);

  // When user clicks a text on the canvas, jump to the Text tab so the
  // textarea / fonts / colors immediately reflect that layer.
  useEffect(() => {
    if (selection.kind === "textLayer" && tab !== "text" && tab !== "style") {
      setTab("text");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);


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


      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-1">
          <TabsTrigger value="text">{t("tabText")}</TabsTrigger>
          <TabsTrigger value="style">{t("tabStyle")}</TabsTrigger>
          <TabsTrigger value="size">{t("tabSize")}</TabsTrigger>
          <TabsTrigger value="scene">{t("tabScene")}</TabsTrigger>
          <TabsTrigger value="extras">{t("tabExtras")}</TabsTrigger>
        </TabsList>

        {/* TEXT — edits the active layer directly */}
        <TabsContent value="text" className="space-y-5 pt-4">
          {activeLayer && (
            <ActiveLayerBadge
              label={activeLayer.text || t("textTabAdd")}
              hint={t("editingLayerHint")}
              editing={t("editingLayer")}
              layers={layers}
              activeId={activeLayer.id}
              onPick={(id) => setSelection({ kind: "textLayer", id })}
            />
          )}

          {activeLayer && (
            <>
              <div>
                <Label className="mb-2 block text-sm font-medium">{t("enterText")}</Label>
                <Textarea
                  rows={2}
                  maxLength={60}
                  value={activeLayer.text}
                  placeholder={t("textPlaceholder")}
                  onChange={(e) => updateTextLayer(activeLayer.id, { text: e.target.value })}
                  style={{ fontFamily: FONTS.find((f) => f.id === activeLayer.fontId)?.family }}
                  className="text-xl"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {activeLayer.text.length} {t("textCharsHint")}
                </p>
              </div>

              <div>
                <Label className="mb-2 flex items-center justify-between text-sm">
                  {t("layerSize")} <span className="text-muted-foreground">{activeLayer.sizePct}%</span>
                </Label>
                <Slider
                  min={6}
                  max={40}
                  step={1}
                  value={[activeLayer.sizePct]}
                  onValueChange={([v]) => updateTextLayer(activeLayer.id, { sizePct: v })}
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center justify-between text-sm">
                  {t("rotation")} <span className="text-muted-foreground">{activeLayer.rotation}°</span>
                </Label>
                <Slider
                  min={-180}
                  max={180}
                  step={5}
                  value={[activeLayer.rotation]}
                  onValueChange={([v]) => updateTextLayer(activeLayer.id, { rotation: v })}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateTextLayer(activeLayer.id, { rotation: ((activeLayer.rotation - 90 + 540) % 360) - 180 })}>
                    <RotateCcw className="mr-1 h-3.5 w-3.5" /> -90°
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateTextLayer(activeLayer.id, { rotation: ((activeLayer.rotation + 90 + 540) % 360) - 180 })}>
                    <RotateCw className="mr-1 h-3.5 w-3.5" /> +90°
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateTextLayer(activeLayer.id, { rotation: 0 })}>
                    0°
                  </Button>
                  <Button variant={activeLayer.flipX ? "default" : "outline"} size="sm" onClick={() => updateTextLayer(activeLayer.id, { flipX: !activeLayer.flipX })}>
                    <FlipHorizontal2 className="mr-1 h-3.5 w-3.5" /> {t("horizontal")}
                  </Button>
                  <Button variant={activeLayer.flipY ? "default" : "outline"} size="sm" onClick={() => updateTextLayer(activeLayer.id, { flipY: !activeLayer.flipY })}>
                    <FlipVertical2 className="mr-1 h-3.5 w-3.5" /> {t("vertical")}
                  </Button>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              const id = `tl-${Date.now()}`;
              addTextLayer({
                id,
                text: t("toolNewTextDefault"),
                fontId: activeLayer?.fontId ?? config.fontId,
                colorId: activeLayer?.colorId ?? config.colorId,
                sizePct: 16,
                x: 0,
                y: 12,
                rotation: 0,
              });
              setSelection({ kind: "textLayer", id });
            }}
            className="w-full rounded-lg border border-foreground/30 bg-accent/40 px-3 py-2 text-sm font-medium transition hover:bg-accent"
          >
            + {t("textTabAdd")}
          </button>
        </TabsContent>

        {/* STYLE — font + color for the active layer */}
        <TabsContent value="style" className="space-y-6 pt-4">
          {activeLayer && (
            <ActiveLayerBadge
              label={activeLayer.text || t("textTabAdd")}
              hint={t("editingLayerHint")}
              editing={t("editingLayer")}
              layers={layers}
              activeId={activeLayer.id}
              onPick={(id) => setSelection({ kind: "textLayer", id })}
            />
          )}

          <div>
            <Label className="mb-2 block text-sm font-medium">{t("fontType")}</Label>
            <FontSelector
              value={activeLayer?.fontId}
              onChange={(id) =>
                activeLayer
                  ? updateTextLayer(activeLayer.id, { fontId: id })
                  : update({ fontId: id })
              }
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">{t("pickColor")}</Label>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {COLORS.map((c) => {
                const selected = activeLayer ? activeLayer.colorId === c.id : config.colorId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    onClick={() =>
                      activeLayer
                        ? updateTextLayer(activeLayer.id, { colorId: c.id })
                        : update({ colorId: c.id })
                    }
                    className={cn(
                      "h-10 rounded-full border-2 transition",
                      selected ? "border-foreground scale-110" : "border-border",
                    )}
                    style={{
                      background: c.rgb
                        ? "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)"
                        : c.hex,
                      boxShadow: `0 0 12px ${c.glow}`,
                    }}
                  />
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("selectedColor")}:{" "}
              {COLORS.find((c) => c.id === (activeLayer?.colorId ?? config.colorId))?.label}
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

function ActiveLayerBadge({
  label,
  hint,
  editing,
  layers,
  activeId,
  onPick,
}: {
  label: string;
  hint: string;
  editing: string;
  layers: { id: string; text: string }[];
  activeId: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="rounded-md border border-dashed border-border bg-secondary/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs">
          <span className="font-semibold">{editing}:</span>{" "}
          <span className="text-foreground/80">{label.slice(0, 28) || "—"}</span>
        </p>
        {layers.length > 1 && (
          <select
            value={activeId}
            onChange={(e) => onPick(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-[11px]"
          >
            {layers.map((l, i) => (
              <option key={l.id} value={l.id}>
                #{i + 1} {l.text.slice(0, 16) || "—"}
              </option>
            ))}
          </select>
        )}
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
    </div>
  );
}
