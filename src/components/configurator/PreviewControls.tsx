import { useDesigner } from "./DesignerContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";

export function PreviewControls() {
  const { config, update } = useDesigner();
  const brightness = config.brightness ?? 100;
  const zoom = config.zoom ?? 1;
  const flicker = config.flicker ?? true;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div>
        <Label className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">{t("brightness")}</span>
          <span className="text-muted-foreground">{brightness}%</span>
        </Label>
        <Slider
          min={40}
          max={120}
          step={5}
          value={[brightness]}
          onValueChange={([v]) => update({ brightness: v })}
        />
      </div>

      <div>
        <Label className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">{t("zoom")}</span>
          <span className="text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </Label>
        <Slider
          min={60}
          max={140}
          step={5}
          value={[Math.round(zoom * 100)]}
          onValueChange={([v]) => update({ zoom: v / 100 })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{t("flicker")}</Label>
        <Switch checked={flicker} onCheckedChange={(v) => update({ flicker: v })} />
      </div>
    </div>
  );
}
