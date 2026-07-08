import { useDesigner } from "@/components/configurator/DesignerContext";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Eye, EyeOff, Lock, Unlock, Trash2, Type, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function LayersPanel() {
  const t = useT();
  const {
    config,
    selection,
    setSelection,
    reorder,
    updateDecoration,
    updateTextLayer,
    removeDecoration,
    removeTextLayer,
    layerOrder,
  } = useDesigner();

  const decos = config.decorations ?? [];
  const texts = config.textLayers ?? [];

  type Item = { id: string; kind: "decoration" | "textLayer"; label: string; hidden?: boolean; locked?: boolean };
  const decoById = new Map(decos.map((d) => [d.id, d]));
  const textById = new Map(texts.map((l) => [l.id, l]));

  // Build the unified list top → bottom (reverse of bottom → top layerOrder).
  const items: Item[] = [...layerOrder]
    .reverse()
    .map((id): Item | null => {
      const l = textById.get(id);
      if (l) return { id, kind: "textLayer", label: l.text?.trim() || t("textLayerFallback"), hidden: l.hidden, locked: l.locked };
      const d = decoById.get(id);
      if (d) return { id, kind: "decoration", label: d.label || (d.source === "upload" ? t("decoSourceUpload") : t("decoration")), hidden: d.hidden, locked: d.locked };
      return null;
    })
    .filter((x): x is Item => x !== null);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
        {t("layersEmpty")}
      </div>
    );
  }

  function isSelected(it: Item) {
    if (selection.kind === "multi") return selection.ids.includes(it.id);
    return (
      (it.kind === "decoration" && selection.kind === "decoration" && selection.id === it.id) ||
      (it.kind === "textLayer" && selection.kind === "textLayer" && selection.id === it.id)
    );
  }

  function pick(it: Item, e: React.MouseEvent) {
    if (e.shiftKey) {
      const cur = selection;
      let ids: string[] = [];
      let kinds: ("textLayer" | "decoration")[] = [];
      if (cur.kind === "multi") {
        ids = [...cur.ids];
        kinds = [...cur.kinds];
      } else if (cur.kind === "textLayer" || cur.kind === "decoration") {
        ids = [cur.id];
        kinds = [cur.kind];
      }
      const idx = ids.indexOf(it.id);
      if (idx >= 0) {
        ids.splice(idx, 1);
        kinds.splice(idx, 1);
      } else {
        ids.push(it.id);
        kinds.push(it.kind);
      }
      if (ids.length === 0) setSelection({ kind: "canvas" });
      else if (ids.length === 1) setSelection({ kind: kinds[0], id: ids[0] });
      else setSelection({ kind: "multi", ids, kinds });
      return;
    }
    setSelection({ kind: it.kind, id: it.id } as Parameters<typeof setSelection>[0]);
  }

  function setVisible(it: Item, hidden: boolean) {
    if (it.kind === "decoration") updateDecoration(it.id, { hidden });
    else updateTextLayer(it.id, { hidden });
  }
  function setLocked(it: Item, locked: boolean) {
    if (it.kind === "decoration") updateDecoration(it.id, { locked });
    else updateTextLayer(it.id, { locked });
  }
  function remove(it: Item) {
    if (it.kind === "decoration") removeDecoration(it.id);
    else removeTextLayer(it.id);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("layersTitle")} ({items.length})</p>
      <ul className="space-y-1.5">
        {items.map((it) => {
          const sel = isSelected(it);
          const Icon = it.kind === "textLayer" ? Type : Sparkles;
          return (
            <li key={`${it.kind}-${it.id}`} className={cn("group flex items-center gap-1 rounded-md border bg-card px-2 py-1.5 text-sm transition", sel ? "border-neon-cyan/60 ring-1 ring-neon-cyan/30" : "border-border")}>
              <button type="button" onClick={(e) => pick(it, e)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{it.label}</span>
              </button>
              <div className="flex shrink-0 items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7" title={t("layerMoveUp")} onClick={() => reorder(it.kind, it.id, Infinity)}><ArrowUpToLine className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" title={t("layerMoveForward")} onClick={() => reorder(it.kind, it.id, 1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" title={t("layerMoveBackward")} onClick={() => reorder(it.kind, it.id, -1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" title={t("layerMoveBottom")} onClick={() => reorder(it.kind, it.id, -Infinity)}><ArrowDownToLine className="h-3.5 w-3.5" /></Button>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" title={it.hidden ? t("show") : t("hide")} onClick={() => setVisible(it, !it.hidden)}>
                {it.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" title={it.locked ? t("unlock") : t("lock")} onClick={() => setLocked(it, !it.locked)}>
                {it.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title={t("delete")} onClick={() => remove(it)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
