import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS, FONTS } from "@/data/options";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  Move,
  Type,
  Palette,
  ChevronDown,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function EditorPropertiesToolbar() {
  const {
    config,
    selection,
    updateDecoration,
    removeDecoration,
    addDecoration,
    updateTextLayer,
    removeTextLayer,
    addTextLayer,
    reorder,
    activeTool,
    update,
  } = useDesigner();
  const t = useT();

  const activeColor = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];

  // 1. Text Layer Selected
  if (selection.kind === "textLayer") {
    const l = (config.textLayers ?? []).find((x) => x.id === selection.id);
    if (!l) return null;

    const color = COLORS.find((c) => c.id === l.colorId) ?? COLORS[0];
    const font = FONTS.find((f) => f.id === l.fontId) ?? FONTS[0];

    const onDuplicate = () =>
      addTextLayer({
        ...l,
        id: `tl-${Date.now()}`,
        x: Math.min(45, l.x + 5),
        y: Math.min(45, l.y + 5),
      });

    return (
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 py-1.5 text-xs shadow-sm backdrop-blur overflow-x-auto select-none min-h-10">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Type className="h-3.5 w-3.5 text-neon-cyan" />
            <span>{t("textLayerTitle")}</span>
          </div>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground truncate max-w-[120px]">
            "{l.text}"
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Font & Color info */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Yazı Tipi:</span>
            <span className="font-medium text-foreground">{font.label}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-muted-foreground">{t("color")}:</span>
            <div
              className="h-3.5 w-3.5 rounded-full border border-white/20"
              style={{
                backgroundColor: color.hex,
                boxShadow: `0 0 6px ${color.glow}`,
              }}
              title={color.label}
            />
          </div>

          {/* Size slider representation */}
          <div className="flex items-center gap-2 shrink-0 w-24">
            <span className="text-muted-foreground">{t("layerSize")}:</span>
            <Slider
              min={6}
              max={40}
              step={1}
              value={[l.sizePct]}
              onValueChange={([v]) => updateTextLayer(l.id, { sizePct: v })}
              className="h-1.5"
            />
          </div>

          {/* Rotation display and quick actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updateTextLayer(l.id, { rotation: ((l.rotation - 90 + 540) % 360) - 180 })
              }
              title="-90°"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-[10px] text-muted-foreground">{l.rotation}°</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updateTextLayer(l.id, { rotation: ((l.rotation + 90 + 540) % 360) - 180 })
              }
              title="+90°"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Lock & Visibility */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => updateTextLayer(l.id, { locked: !l.locked })}
            title={l.locked ? t("unlock") : t("lock")}
          >
            {l.locked ? (
              <Lock className="h-3.5 w-3.5 text-neon-cyan" />
            ) : (
              <Unlock className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Duplicate & Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onDuplicate}
            title={t("duplicate")}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => removeTextLayer(l.id)}
            title={t("delete")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  // 2. Decoration / Vector / Custom Drawing Selected
  if (selection.kind === "decoration") {
    const d = (config.decorations ?? []).find((x) => x.id === selection.id);
    if (!d) return null;

    const color = COLORS.find((c) => c.id === d.colorId) ?? COLORS[0];

    const onDuplicate = () =>
      addDecoration({
        ...d,
        id: `${d.source}-${Date.now()}`,
        x: Math.min(45, d.x + 5),
        y: Math.min(45, d.y + 5),
      });

    return (
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 py-1.5 text-xs shadow-sm backdrop-blur overflow-x-auto select-none min-h-10">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Move className="h-3.5 w-3.5 text-neon-cyan" />
            <span>{d.label || t("decoration")}</span>
          </div>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground capitalize">
            {d.source === "preset" ? "Şekil" : "Çizim"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-muted-foreground">{t("color")}:</span>
            <div
              className="h-3.5 w-3.5 rounded-full border border-white/20"
              style={{
                backgroundColor: color.hex,
                boxShadow: `0 0 6px ${color.glow}`,
              }}
              title={color.label}
            />
          </div>

          {/* Stroke Width Slider for drawings */}
          {d.source === "draw" && (
            <div className="flex items-center gap-2 shrink-0 w-28">
              <span className="text-muted-foreground">Kalınlık:</span>
              <Slider
                min={2}
                max={16}
                step={1}
                value={[d.strokeWidth ?? 6]}
                onValueChange={([v]) => updateDecoration(d.id, { strokeWidth: v })}
                className="h-1.5"
              />
              <span className="w-6 text-right text-[10px] text-muted-foreground">
                {d.strokeWidth ?? 6}px
              </span>
            </div>
          )}

          {/* Size slider */}
          <div className="flex items-center gap-2 shrink-0 w-24">
            <span className="text-muted-foreground">Boyut:</span>
            <Slider
              min={5}
              max={40}
              step={1}
              value={[d.sizePct]}
              onValueChange={([v]) => updateDecoration(d.id, { sizePct: v })}
              className="h-1.5"
            />
          </div>

          {/* Mirror / Flip */}
          <div className="flex items-center gap-0.5 border-l border-white/10 pl-2 shrink-0">
            <Button
              variant={d.flipX ? "secondary" : "ghost"}
              size="icon"
              className="h-6 w-6"
              onClick={() => updateDecoration(d.id, { flipX: !d.flipX })}
              title={t("horizontal")}
            >
              <FlipHorizontal2 className="h-3 w-3" />
            </Button>
            <Button
              variant={d.flipY ? "secondary" : "ghost"}
              size="icon"
              className="h-6 w-6"
              onClick={() => updateDecoration(d.id, { flipY: !d.flipY })}
              title={t("vertical")}
            >
              <FlipVertical2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updateDecoration(d.id, { rotation: ((d.rotation - 90 + 540) % 360) - 180 })
              }
              title="-90°"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-[10px] text-muted-foreground">{d.rotation}°</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updateDecoration(d.id, { rotation: ((d.rotation + 90 + 540) % 360) - 180 })
              }
              title="+90°"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => updateDecoration(d.id, { locked: !d.locked })}
            title={d.locked ? t("unlock") : t("lock")}
          >
            {d.locked ? (
              <Lock className="h-3.5 w-3.5 text-neon-cyan" />
            ) : (
              <Unlock className="h-3.5 w-3.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onDuplicate}
            title={t("duplicate")}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => removeDecoration(d.id)}
            title={t("delete")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  // 3. Drawing / Pen Tool Active
  if (activeTool === "draw" || activeTool === "pen") {
    return (
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 py-1.5 text-xs shadow-sm backdrop-blur min-h-10 select-none animate-fade-in">
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-neon-cyan animate-pulse" />
          <span className="font-semibold text-foreground">
            {activeTool === "draw" ? "Serbest Çizim Aktif" : "Kalem Vektör Aktif"}
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            ·{" "}
            {activeTool === "draw"
              ? "Çizmek için basılı tutup sürükleyin."
              : "Noktalar eklemek için tıklayın."}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Aktif Renk:</span>
            <div
              className="h-3.5 w-3.5 rounded-full border border-white/20"
              style={{
                backgroundColor: activeColor.hex,
                boxShadow: `0 0 6px ${activeColor.glow}`,
              }}
              title={activeColor.label}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Aktif Kalınlık:</span>
            <select
              value={
                activeTool === "draw" ? (config.drawStrokeWidth ?? 6) : (config.penStrokeWidth ?? 6)
              }
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (activeTool === "draw") update({ drawStrokeWidth: val });
                else update({ penStrokeWidth: val });
              }}
              className="rounded bg-white/10 px-1 py-0.5 text-xs text-white border border-white/10 outline-none cursor-pointer"
            >
              <option value="2" className="bg-black text-white">
                2px (Çok İnce)
              </option>
              <option value="4" className="bg-black text-white">
                4px (İnce)
              </option>
              <option value="6" className="bg-black text-white">
                6px (Orta)
              </option>
              <option value="10" className="bg-black text-white">
                10px (Kalın)
              </option>
              <option value="14" className="bg-black text-white">
                14px (Çok Kalın)
              </option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // 4. Default / Selection Canvas (Show Canvas Dimensions & Background)
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 py-1.5 text-xs shadow-sm backdrop-blur min-h-10 select-none text-muted-foreground">
      <div className="flex items-center gap-2">
        <Layers className="h-3.5 w-3.5 text-muted-foreground/70" />
        <span className="font-medium text-foreground/80">Neon Tasarım Editörü</span>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span>Arka Plan:</span>
          <span className="font-semibold capitalize text-foreground/80">
            {config.background.replace("-", " ")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Arkada Tahta:</span>
          <span className="font-semibold capitalize text-foreground/80">{config.backboard}</span>
        </div>
      </div>
    </div>
  );
}
