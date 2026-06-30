import { useDesigner } from "./DesignerContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lightbulb, LightbulbOff, RotateCcw } from "lucide-react";
import { useT } from "@/lib/i18n";

export function PreviewControls() {
  const t = useT();
  const { config, update } = useDesigner();
  const brightness = config.brightness ?? 100;
  const zoom = config.zoom ?? 1;
  const flicker = config.flicker ?? true;
  const isLightOn = config.isLightOn ?? true;
  const realSize = config.realSizeMode ?? false;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
        <div className="flex items-center gap-2">
          {isLightOn ? <Lightbulb className="h-4 w-4 text-yellow-500" /> : <LightbulbOff className="h-4 w-4 text-muted-foreground" />}
          <div>
            <p className="text-sm font-medium">{t("lightOn")}</p>
            <p className="text-[11px] text-muted-foreground">{isLightOn ? t("on") : t("off")}</p>
          </div>
        </div>
        <Switch checked={isLightOn} onCheckedChange={(v) => update({ isLightOn: v })} />
      </div>

      <div>
        <Label className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">{t("brightness")}</span>
          <span className="text-muted-foreground">{brightness}%</span>
        </Label>
        <Slider min={40} max={120} step={5} value={[brightness]} onValueChange={([v]) => update({ brightness: v })} />
      </div>

      <div>
        <Label className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">{t("zoom")}</span>
          <span className="text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </Label>
        <Slider min={60} max={140} step={5} value={[Math.round(zoom * 100)]} onValueChange={([v]) => update({ zoom: v / 100 })} />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{t("flicker")}</Label>
        <Switch checked={flicker} onCheckedChange={(v) => update({ flicker: v })} />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{t("realSizePreview")}</Label>
        <Switch checked={realSize} onCheckedChange={(v) => update({ realSizeMode: v })} />
      </div>

      <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("measureGuides")}</p>
        <div className="flex items-center justify-between">
          <Label className="text-xs">{t("showMeasurements")}</Label>
          <Switch checked={config.showMeasurements ?? false} onCheckedChange={(v) => update({ showMeasurements: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">{t("showBackboardBounds")}</Label>
          <Switch checked={config.showBackboardBounds ?? false} onCheckedChange={(v) => update({ showBackboardBounds: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">{t("showSafeArea")}</Label>
          <Switch checked={config.showSafeArea ?? false} onCheckedChange={(v) => update({ showSafeArea: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">{t("showSizeBadge")}</Label>
          <Switch checked={config.showSizeBadge ?? true} onCheckedChange={(v) => update({ showSizeBadge: v })} />
        </div>
        <p className="text-[10px] text-muted-foreground">{t("measureNote")}</p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={() => update({ zoom: 1, brightness: 100 })}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> {t("resetView")}
        </Button>
      </div>
    </div>
  );
}
