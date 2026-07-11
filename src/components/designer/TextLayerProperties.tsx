import { useState } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS, FONTS, FONT_CATEGORY_LABEL, FONT_CATEGORY_ORDER } from "@/data/options";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCcw,
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FontCategory } from "@/lib/types";

const sectionClass = "space-y-3 rounded-xl border border-border bg-secondary/20 p-3";

export function TextLayerProperties() {
  const { config, selection, updateTextLayer, removeTextLayer, addTextLayer } = useDesigner();
  const t = useT();
  const l =
    selection.kind === "textLayer"
      ? (config.textLayers ?? []).find((x) => x.id === selection.id)
      : null;
  const selectedFont = FONTS.find((font) => font.id === l?.fontId) ?? FONTS[0];
  const [category, setCategory] = useState<FontCategory>(selectedFont.category);

  if (!l) return <p className="text-sm text-muted-foreground">{t("textLayerNotFound")}</p>;

  const fonts = FONTS.filter((font) => font.category === category);
  const duplicate = () =>
    addTextLayer({
      ...l,
      id: `tl-${Date.now()}`,
      x: Math.min(45, l.x + 5),
      y: Math.min(45, l.y + 5),
    });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{t("textLayerTitle")}</p>
          <p className="text-xs text-muted-foreground">İçerik, yazı tipi ve görünüm</p>
        </div>
        <span className="rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
          {l.text.length}/40
        </span>
      </div>

      <section className={sectionClass}>
        <Label htmlFor="layer-text" className="text-sm font-medium">
          {t("content")}
        </Label>
        <Textarea
          id="layer-text"
          value={l.text}
          maxLength={40}
          rows={2}
          onChange={(e) => updateTextLayer(l.id, { text: e.target.value })}
          placeholder={t("textPlaceholderShort")}
          className="resize-none text-base leading-relaxed"
        />
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">{t("fontType")}</Label>
          <span className="truncate text-xs text-muted-foreground">{selectedFont.label}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {FONT_CATEGORY_ORDER.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition",
                category === item
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              {FONT_CATEGORY_LABEL[item]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => updateTextLayer(l.id, { fontId: font.id })}
              className={cn(
                "min-w-0 rounded-lg border px-2 py-2 text-left transition",
                l.fontId === font.id
                  ? "border-neon-cyan/70 bg-neon-cyan/10 ring-1 ring-neon-cyan/20"
                  : "border-border bg-background hover:border-foreground/40",
              )}
            >
              <span
                className="block truncate text-lg leading-tight"
                style={{ fontFamily: font.family }}
              >
                {l.text.trim() || "Aa"}
              </span>
              <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                {font.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <Label className="text-sm font-medium">{t("color")}</Label>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() => updateTextLayer(l.id, { colorId: color.id })}
              className={cn(
                "h-8 rounded-full border-2 transition hover:scale-105",
                l.colorId === color.id
                  ? "border-foreground ring-2 ring-neon-cyan/40"
                  : "border-transparent",
              )}
              style={{
                background: color.rgb
                  ? "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)"
                  : color.hex,
                boxShadow: `0 0 8px ${color.glow}`,
              }}
            />
          ))}
        </div>
        <div>
          <Label className="mb-2 flex justify-between text-xs">
            {t("layerSize")} <span>{l.sizePct}%</span>
          </Label>
          <Slider
            min={6}
            max={40}
            step={1}
            value={[l.sizePct]}
            onValueChange={([value]) => updateTextLayer(l.id, { sizePct: value })}
          />
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t("transform")}</Label>
          <span className="text-xs text-muted-foreground">{l.rotation}°</span>
        </div>
        <Slider
          min={-180}
          max={180}
          step={5}
          value={[l.rotation]}
          onValueChange={([value]) => updateTextLayer(l.id, { rotation: value })}
        />
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateTextLayer(l.id, { rotation: ((l.rotation - 90 + 540) % 360) - 180 })
            }
          >
            <RotateCcw /> -90°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateTextLayer(l.id, { rotation: 0 })}
          >
            0°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateTextLayer(l.id, { rotation: ((l.rotation + 90 + 540) % 360) - 180 })
            }
          >
            <RotateCw /> +90°
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-2 flex justify-between text-xs">
              X <span>{l.x}</span>
            </Label>
            <Slider
              min={-45}
              max={45}
              step={1}
              value={[l.x]}
              onValueChange={([value]) => updateTextLayer(l.id, { x: value })}
            />
          </div>
          <div>
            <Label className="mb-2 flex justify-between text-xs">
              Y <span>{l.y}</span>
            </Label>
            <Slider
              min={-45}
              max={45}
              step={1}
              value={[l.y]}
              onValueChange={([value]) => updateTextLayer(l.id, { y: value })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={l.flipX ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => updateTextLayer(l.id, { flipX: !l.flipX })}
          >
            <FlipHorizontal2 /> {t("horizontal")}
          </Button>
          <Button
            variant={l.flipY ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => updateTextLayer(l.id, { flipY: !l.flipY })}
          >
            <FlipVertical2 /> {t("vertical")}
          </Button>
        </div>
      </section>

      <section className="flex flex-wrap gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={duplicate}>
          <Copy /> {t("duplicate")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateTextLayer(l.id, { locked: !l.locked })}
        >
          {l.locked ? <Unlock /> : <Lock />}
          {l.locked ? t("unlock") : t("lock")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateTextLayer(l.id, { hidden: !l.hidden })}
        >
          {l.hidden ? <Eye /> : <EyeOff />}
          {l.hidden ? t("show") : t("hide")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-destructive hover:text-destructive"
          onClick={() => removeTextLayer(l.id)}
        >
          <Trash2 /> {t("delete")}
        </Button>
      </section>
    </div>
  );
}
