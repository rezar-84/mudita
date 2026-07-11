import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS } from "@/data/options";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sectionClass = "space-y-3 rounded-xl border border-border bg-secondary/20 p-3";

export function DecorationProperties() {
  const { config, selection, updateDecoration, removeDecoration, addDecoration } = useDesigner();
  const t = useT();
  const d =
    selection.kind === "decoration"
      ? (config.decorations ?? []).find((item) => item.id === selection.id)
      : null;
  if (!d) return <p className="text-sm text-muted-foreground">{t("decoNotFound")}</p>;

  const duplicate = () =>
    addDecoration({
      ...d,
      id: `${d.source}-${Date.now()}`,
      x: Math.min(45, d.x + 5),
      y: Math.min(45, d.y + 5),
    });
  const currentMode = d.renderMode || (d.presetId?.startsWith("emblem-") ? "hybrid" : "glow-only");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">{d.label || t("decoration")}</p>
        <p className="text-xs text-muted-foreground">
          {d.source === "preset" ? t("decoSourcePreset") : t("decoSourceUpload")}
        </p>
      </div>

      <section className={sectionClass}>
        <Label className="text-sm font-medium">{t("color")}</Label>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() => updateDecoration(d.id, { colorId: color.id })}
              className={cn(
                "h-8 rounded-full border-2 transition hover:scale-105",
                d.colorId === color.id
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
        {(d.svgMarkup || d.presetId?.startsWith("emblem-") || d.source === "upload") && (
          <div>
            <Label className="mb-2 block text-xs">Baskı ve neon</Label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-background p-1">
              {(["hybrid", "glow-only", "print-only"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateDecoration(d.id, { renderMode: mode })}
                  className={cn(
                    "rounded-md px-1 py-1.5 text-[10px] font-medium",
                    currentMode === mode
                      ? "bg-neon-cyan/15 text-foreground"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {mode === "hybrid" ? "İkisi" : mode === "glow-only" ? "Neon" : "Baskı"}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label className="mb-2 flex justify-between text-xs">
            {t("layerSize")} <span>{d.sizePct}%</span>
          </Label>
          <Slider
            min={5}
            max={40}
            step={1}
            value={[d.sizePct]}
            onValueChange={([value]) => updateDecoration(d.id, { sizePct: value })}
          />
        </div>
        {d.source === "draw" && (
          <div>
            <Label className="mb-2 flex justify-between text-xs">
              Çizgi kalınlığı <span>{d.strokeWidth ?? 6}px</span>
            </Label>
            <Slider
              min={2}
              max={16}
              step={1}
              value={[d.strokeWidth ?? 6]}
              onValueChange={([value]) => updateDecoration(d.id, { strokeWidth: value })}
            />
          </div>
        )}
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t("transform")}</Label>
          <span className="text-xs text-muted-foreground">{d.rotation}°</span>
        </div>
        <Slider
          min={-180}
          max={180}
          step={5}
          value={[d.rotation]}
          onValueChange={([value]) => updateDecoration(d.id, { rotation: value })}
        />
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateDecoration(d.id, { rotation: ((d.rotation - 90 + 540) % 360) - 180 })
            }
          >
            <RotateCcw /> -90°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateDecoration(d.id, { rotation: 0 })}
          >
            0°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateDecoration(d.id, { rotation: ((d.rotation + 90 + 540) % 360) - 180 })
            }
          >
            <RotateCw /> +90°
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-2 flex justify-between text-xs">
              X <span>{d.x}</span>
            </Label>
            <Slider
              min={-45}
              max={45}
              step={1}
              value={[d.x]}
              onValueChange={([value]) => updateDecoration(d.id, { x: value })}
            />
          </div>
          <div>
            <Label className="mb-2 flex justify-between text-xs">
              Y <span>{d.y}</span>
            </Label>
            <Slider
              min={-45}
              max={45}
              step={1}
              value={[d.y]}
              onValueChange={([value]) => updateDecoration(d.id, { y: value })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={d.flipX ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => updateDecoration(d.id, { flipX: !d.flipX })}
          >
            <FlipHorizontal2 /> {t("horizontal")}
          </Button>
          <Button
            variant={d.flipY ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => updateDecoration(d.id, { flipY: !d.flipY })}
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
          onClick={() => updateDecoration(d.id, { locked: !d.locked })}
        >
          {d.locked ? <Unlock /> : <Lock />}
          {d.locked ? t("unlock") : t("lock")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateDecoration(d.id, { hidden: !d.hidden })}
        >
          {d.hidden ? <Eye /> : <EyeOff />}
          {d.hidden ? t("show") : t("hide")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-destructive hover:text-destructive"
          onClick={() => removeDecoration(d.id)}
        >
          <Trash2 /> {t("delete")}
        </Button>
      </section>
    </div>
  );
}
