import { useState } from "react";
import {
  useDesigner,
  type AlignReference,
} from "@/components/configurator/DesignerContext";
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

/**
 * Single primary selection model. The reference selector picks the *bounds*
 * we align the selected layer against:
 *  - page    → the canvas itself
 *  - first   → first layer in recent selection history (excluding current)
 *  - last    → most recent layer in selection history (excluding current)
 *  - biggest → the layer with the largest sizePct (excluding current)
 *
 * When the chosen reference is unavailable (e.g. only one layer exists), the
 * align action transparently falls back to the page bounds.
 */
export function AlignmentControls() {
  const { alignSelected } = useDesigner();
  const [ref, setRef] = useState<AlignReference>("page");

  const btn = (
    title: string,
    Icon: typeof AlignLeft,
    dir: Parameters<typeof alignSelected>[0],
  ) => (
    <Button
      variant="outline"
      size="sm"
      title={`${title} (${refLabel(ref)})`}
      aria-label={title}
      onClick={() => alignSelected(dir, ref)}
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
          onChange={(e) => setRef(e.target.value as AlignReference)}
          className="h-7 rounded-md border border-input bg-background px-1.5 text-[11px]"
          title="Referans"
        >
          <option value="page">Sayfa</option>
          <option value="first">İlk seçili</option>
          <option value="last">Son seçili</option>
          <option value="biggest">En büyük</option>
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
        {ref === "page"
          ? "Seçili katman tuval kenarlarına göre hizalanır."
          : ref === "biggest"
            ? "En büyük diğer katmanın sınırlarına göre hizalanır."
            : ref === "first"
              ? "Geçmişteki ilk seçili katmana göre hizalanır."
              : "En son seçtiğin diğer katmana göre hizalanır."}
      </p>
    </div>
  );
}

function refLabel(ref: AlignReference): string {
  switch (ref) {
    case "page":
      return "sayfa";
    case "first":
      return "ilk seçili";
    case "last":
      return "son seçili";
    case "biggest":
      return "en büyük";
  }
}
