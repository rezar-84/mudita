import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS, FONTS } from "@/data/options";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n";
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCw,
  RotateCcw,
  FlipHorizontal2,
  FlipVertical2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TextLayerProperties() {
  const { config, selection, updateTextLayer, removeTextLayer, addTextLayer, reorder } = useDesigner();
  const t = useT();
  if (selection.kind !== "textLayer") return null;
  const l = (config.textLayers ?? []).find((x) => x.id === selection.id);
  if (!l) {
    return <p className="text-sm text-muted-foreground">{t("textLayerNotFound")}</p>;
  }

  const onDuplicate = () =>
    addTextLayer({
      ...l,
      id: `tl-${Date.now()}`,
      x: Math.min(45, l.x + 5),
      y: Math.min(45, l.y + 5),
    });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold">{t("textLayerTitle")}</p>
        <p className="text-xs text-muted-foreground">{t("textLayerDesc")}</p>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("content")}</Label>
        <Input
          value={l.text}
          maxLength={40}
          onChange={(e) => updateTextLayer(l.id, { text: e.target.value })}
          placeholder={t("textPlaceholderShort")}
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("fontType")}</Label>
        <select
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          value={l.fontId}
          onChange={(e) => updateTextLayer(l.id, { fontId: e.target.value })}
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("color")}</Label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              onClick={() => updateTextLayer(l.id, { colorId: c.id })}
              className={cn(
                "h-9 rounded-full border-2 transition",
                l.colorId === c.id ? "border-foreground scale-110" : "border-border",
              )}
              style={{
                background: c.rgb
                  ? "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)"
                  : c.hex,
                boxShadow: `0 0 10px ${c.glow}`,
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 flex items-center justify-between text-sm">
          {t("layerSize")} <span className="text-muted-foreground">{l.sizePct}%</span>
        </Label>
        <Slider min={6} max={40} step={1} value={[l.sizePct]} onValueChange={([v]) => updateTextLayer(l.id, { sizePct: v })} />
      </div>

      <div>
        <Label className="mb-2 flex items-center justify-between text-sm">
          {t("rotation")} <span className="text-muted-foreground">{l.rotation}°</span>
        </Label>
        <Slider min={-180} max={180} step={5} value={[l.rotation]} onValueChange={([v]) => updateTextLayer(l.id, { rotation: v })} />
        <div className="mt-2 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => updateTextLayer(l.id, { rotation: ((l.rotation - 90 + 540) % 360) - 180 })}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> -90°
          </Button>
          <Button variant="outline" size="sm" onClick={() => updateTextLayer(l.id, { rotation: ((l.rotation + 90 + 540) % 360) - 180 })}>
            <RotateCw className="mr-1 h-3.5 w-3.5" /> +90°
          </Button>
          <Button variant="outline" size="sm" onClick={() => updateTextLayer(l.id, { rotation: 0 })}>
            0°
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("transform")}</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant={l.flipX ? "default" : "outline"} size="sm" onClick={() => updateTextLayer(l.id, { flipX: !l.flipX })}>
            <FlipHorizontal2 className="mr-1 h-3.5 w-3.5" /> {t("horizontal")}
          </Button>
          <Button variant={l.flipY ? "default" : "outline"} size="sm" onClick={() => updateTextLayer(l.id, { flipY: !l.flipY })}>
            <FlipVertical2 className="mr-1 h-3.5 w-3.5" /> {t("vertical")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-2 flex items-center justify-between text-xs">
            X <span className="text-muted-foreground">{l.x}</span>
          </Label>
          <Slider min={-45} max={45} step={1} value={[l.x]} onValueChange={([v]) => updateTextLayer(l.id, { x: v })} />
        </div>
        <div>
          <Label className="mb-2 flex items-center justify-between text-xs">
            Y <span className="text-muted-foreground">{l.y}</span>
          </Label>
          <Slider min={-45} max={45} step={1} value={[l.y]} onValueChange={([v]) => updateTextLayer(l.id, { y: v })} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => reorder("textLayer", l.id, Infinity)}>
          {t("layerToTop")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => reorder("textLayer", l.id, 1)}>
          {t("layerForward")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => reorder("textLayer", l.id, -1)}>
          {t("layerBackward")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => reorder("textLayer", l.id, -Infinity)}>
          {t("layerToBottom")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <Copy className="mr-1.5 h-3.5 w-3.5" /> {t("duplicate")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => updateTextLayer(l.id, { locked: !l.locked })}>
          {l.locked ? <Unlock className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
          {l.locked ? t("unlock") : t("lock")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => updateTextLayer(l.id, { hidden: !l.hidden })}>
          {l.hidden ? <Eye className="mr-1.5 h-3.5 w-3.5" /> : <EyeOff className="mr-1.5 h-3.5 w-3.5" />}
          {l.hidden ? t("show") : t("hide")}
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeTextLayer(l.id)}>
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> {t("delete")}
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm">{t("layerShowLabel")}</p>
          <p className="text-[11px] text-muted-foreground">{t("layerExcludeDesc")}</p>
        </div>
        <Switch checked={!l.hidden} onCheckedChange={(v) => updateTextLayer(l.id, { hidden: !v })} />
      </div>
    </div>
  );
}
