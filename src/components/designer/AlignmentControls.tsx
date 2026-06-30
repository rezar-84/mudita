import { useState } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from "lucide-react";

type Reference = "page" | "first" | "last" | "biggest";

/**
 * Single-selection alignment. The reference selector is shown for parity with
 * multi-select editors; with one selected layer all references resolve to the
 * canvas/page bounds, so the active layer is snapped to page edges/center.
 */
export function AlignmentControls() {
  const { alignSelected } = useDesigner();
  const [ref, setRef] = useState<Reference>("page");

  const btn = (
    title: string,
    Icon: typeof AlignLeft,
    dir: Parameters<typeof alignSelected>[0],
  ) => (
    <Button
      variant="outline"
      size="sm"
      title={title}
      aria-label={title}
      onClick={() => alignSelected(dir)}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hizala
        </Label>
        <select
          value={ref}
          onChange={(e) => setRef(e.target.value as Reference)}
          className="h-7 rounded-md border border-input bg-background px-1.5 text-[11px]"
          title="Referans"
        >
          <option value="page">Sayfa</option>
          <option value="first" disabled>
            İlk seçili (yakında)
          </option>
          <option value="last" disabled>
            Son seçili (yakında)
          </option>
          <option value="biggest" disabled>
            En büyük (yakında)
          </option>
        </select>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {btn("Sola", AlignLeft, "left")}
        {btn("Yatay ortala", AlignCenter, "centerH")}
        {btn("Sağa", AlignRight, "right")}
        <span className="mx-1 w-px self-stretch bg-border" />
        {btn("Üste", AlignStartVertical, "top")}
        {btn("Dikey ortala", AlignCenterVertical, "centerV")}
        {btn("Alta", AlignEndVertical, "bottom")}
      </div>
      <p className="text-[10px] text-muted-foreground">
        Tek katman seçili — referans şu an sayfa.
      </p>
    </div>
  );
}
