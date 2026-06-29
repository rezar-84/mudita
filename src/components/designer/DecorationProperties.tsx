import { useDesigner } from "@/components/configurator/DesignerContext";
import { COLORS } from "@/data/options";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  FlipHorizontal2,
  FlipVertical2,
  RotateCw,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Property editor for a selected decoration / SVG layer.
 * Mirrors the Figma "right inspector" feel: color, position, size, rotation,
 * plus lock / hide / duplicate / delete actions.
 */
export function DecorationProperties() {
  const { config, selection, updateDecoration, removeDecoration, addDecoration } = useDesigner();
  if (selection.kind !== "decoration") return null;
  const d = (config.decorations ?? []).find((x) => x.id === selection.id);
  if (!d) {
    return (
      <p className="text-sm text-muted-foreground">Seçili süsleme silinmiş görünüyor.</p>
    );
  }

  const onDuplicate = () => {
    addDecoration({
      ...d,
      id: `${d.source}-${Date.now()}`,
      x: Math.min(45, d.x + 5),
      y: Math.min(45, d.y + 5),
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold">{d.label || "Süsleme"}</p>
        <p className="text-xs text-muted-foreground">
          {d.source === "preset" ? "Hazır ikon" : "Yüklenen SVG"}
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <Copy className="mr-1.5 h-3.5 w-3.5" /> Çoğalt
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateDecoration(d.id, { locked: !d.locked })}
        >
          {d.locked ? <Unlock className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
          {d.locked ? "Kilit Aç" : "Kilitle"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateDecoration(d.id, { hidden: !d.hidden })}
        >
          {d.hidden ? <Eye className="mr-1.5 h-3.5 w-3.5" /> : <EyeOff className="mr-1.5 h-3.5 w-3.5" />}
          {d.hidden ? "Göster" : "Gizle"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => removeDecoration(d.id)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Sil
        </Button>
      </div>

      {/* Color */}
      <div>
        <Label className="mb-2 block text-sm font-medium">Renk</Label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              onClick={() => updateDecoration(d.id, { colorId: c.id })}
              className={cn(
                "h-9 rounded-full border-2 transition",
                d.colorId === c.id ? "border-foreground scale-110" : "border-border",
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

      {/* Size */}
      <div>
        <Label className="mb-2 flex items-center justify-between text-sm">
          Boyut <span className="text-muted-foreground">{d.sizePct}%</span>
        </Label>
        <Slider
          min={5}
          max={40}
          step={1}
          value={[d.sizePct]}
          onValueChange={([v]) => updateDecoration(d.id, { sizePct: v })}
        />
      </div>

      {/* Rotation */}
      <div>
        <Label className="mb-2 flex items-center justify-between text-sm">
          Döndürme <span className="text-muted-foreground">{d.rotation}°</span>
        </Label>
        <Slider
          min={-180}
          max={180}
          step={5}
          value={[d.rotation]}
          onValueChange={([v]) => updateDecoration(d.id, { rotation: v })}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateDecoration(d.id, {
                rotation: ((d.rotation - 90 + 540) % 360) - 180,
              })
            }
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> -90°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateDecoration(d.id, {
                rotation: ((d.rotation + 90 + 540) % 360) - 180,
              })
            }
          >
            <RotateCw className="mr-1 h-3.5 w-3.5" /> +90°
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateDecoration(d.id, { rotation: 0 })}
          >
            0°
          </Button>
        </div>
      </div>

      {/* Transform */}
      <div>
        <Label className="mb-2 block text-sm font-medium">Dönüşüm</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={d.flipX ? "default" : "outline"}
            size="sm"
            onClick={() => updateDecoration(d.id, { flipX: !d.flipX })}
          >
            <FlipHorizontal2 className="mr-1 h-3.5 w-3.5" /> Yatay
          </Button>
          <Button
            variant={d.flipY ? "default" : "outline"}
            size="sm"
            onClick={() => updateDecoration(d.id, { flipY: !d.flipY })}
          >
            <FlipVertical2 className="mr-1 h-3.5 w-3.5" /> Dikey
          </Button>
        </div>
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-2 flex items-center justify-between text-xs">
            X <span className="text-muted-foreground">{d.x}</span>
          </Label>
          <Slider
            min={-45}
            max={45}
            step={1}
            value={[d.x]}
            onValueChange={([v]) => updateDecoration(d.id, { x: v })}
          />
        </div>
        <div>
          <Label className="mb-2 flex items-center justify-between text-xs">
            Y <span className="text-muted-foreground">{d.y}</span>
          </Label>
          <Slider
            min={-45}
            max={45}
            step={1}
            value={[d.y]}
            onValueChange={([v]) => updateDecoration(d.id, { y: v })}
          />
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
        💡 Süslemeyi canlı önizlemede tutup sürükleyerek de konumlandırabilirsin.
        Renk ve boyut anlık olarak fiyat hesabına yansır.
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm">Süslemeyi Göster</p>
          <p className="text-[11px] text-muted-foreground">Üretimde dahil etmek istemiyorsan kapat.</p>
        </div>
        <Switch
          checked={!d.hidden}
          onCheckedChange={(v) => updateDecoration(d.id, { hidden: !v })}
        />
      </div>
    </div>
  );
}
