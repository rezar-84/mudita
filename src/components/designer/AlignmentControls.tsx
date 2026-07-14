import { useState } from "react";
import { useDesigner, type AlignReference } from "@/components/configurator/DesignerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignTop,
  AlignVerticalJustifyCenter,
  AlignBottom,
} from "lucide-react";

export function AlignmentControls() {
  const { alignSelected, selection } = useDesigner();
  const t = useT();
  const [ref, setRef] = useState<AlignReference>("page");

  // Only meaningful when something is actually selected.
  if (
    selection.kind !== "textLayer" &&
    selection.kind !== "decoration" &&
    selection.kind !== "multi"
  ) {
    return null;
  }

  function refLabel(r: AlignReference): string {
    switch (r) {
      case "page":
        return t("alignRefPage");
      case "first":
        return t("alignRefFirst");
      case "last":
        return t("alignRefLast");
      case "biggest":
        return t("alignRefBiggest");
    }
  }

  const btn = (title: string, Icon: typeof AlignLeft, dir: Parameters<typeof alignSelected>[0]) => (
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
          {t("align")}
        </Label>
        <select
          value={ref}
          onChange={(e) => setRef(e.target.value as AlignReference)}
          className="h-7 rounded-md border border-input bg-background px-1.5 text-[11px]"
          title={t("alignRef")}
        >
          <option value="page">{t("alignRefPage")}</option>
          <option value="first">{t("alignRefFirst")}</option>
          <option value="last">{t("alignRefLast")}</option>
          <option value="biggest">{t("alignRefBiggest")}</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {/* Horizontal alignment — aligns to a vertical reference line (left / center / right) */}
        {btn(t("alignLeft"), AlignLeft, "left")}
        {btn(t("alignCenterH"), AlignCenter, "centerH")}
        {btn(t("alignRight"), AlignRight, "right")}
        <span className="mx-1 w-px self-stretch bg-border" />
        {/* Vertical alignment — aligns to a horizontal reference line (top / middle / bottom) */}
        {btn(t("alignTop"), AlignTop, "top")}
        {btn(t("alignCenterV"), AlignVerticalJustifyCenter, "centerV")}
        {btn(t("alignBottom"), AlignBottom, "bottom")}
      </div>
      <p className="text-[10px] text-muted-foreground">
        {ref === "page"
          ? t("alignHintPage")
          : ref === "biggest"
            ? t("alignHintBiggest")
            : ref === "first"
              ? t("alignHintFirst")
              : t("alignHintLast")}
      </p>
    </div>
  );
}
