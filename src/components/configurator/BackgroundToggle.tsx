import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { useDesigner } from "./DesignerContext";
import { cn } from "@/lib/utils";
import { BACKGROUNDS } from "@/data/options";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";

const MAX_BYTES = 8 * 1024 * 1024;
const TARGET_MAX_DIM = 1600;

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("Image decode failed"));
    i.src = dataUrl;
  });

  const scale = Math.min(1, TARGET_MAX_DIM / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function BackgroundToggle() {
  const t = useT();
  const { config, update } = useDesigner();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const hasCustom = !!config.customBackground;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("bgErrNotImage"));
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(t("bgErrTooLarge"));
      return;
    }
    setLoading(true);
    try {
      const url = await fileToCompressedDataUrl(file);
      update({ customBackground: url, customBackgroundName: file.name });
      toast.success(t("bgUpdated"));
    } catch {
      toast.error(t("bgUploadFailed"));
    } finally {
      setLoading(false);
    }
  }

  function clearCustom() {
    update({ customBackground: undefined, customBackgroundName: undefined });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {t("previewBackground")}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-dashed border-foreground/30 px-2.5 py-1 text-xs font-medium transition",
            "hover:border-foreground hover:bg-accent/40 disabled:opacity-50",
          )}
        >
          <Upload className="h-3 w-3" />
          {loading ? t("uploading") : t("uploadImage")}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>

      {hasCustom && (
        <div className="flex items-center gap-2 rounded-lg border border-foreground/30 bg-accent/30 p-2">
          <div
            className="h-10 w-14 shrink-0 rounded-md border border-border bg-cover bg-center"
            style={{ backgroundImage: `url(${config.customBackground})` }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">
              {config.customBackgroundName ?? t("customBg")}
            </p>
            <p className="text-[10px] text-muted-foreground">{t("active")}</p>
          </div>
          <button
            type="button"
            onClick={clearCustom}
            className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label={t("removeBg")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {BACKGROUNDS.map((o) => {
          const active = !hasCustom && config.background === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                update({
                  background: o.id,
                  customBackground: undefined,
                  customBackgroundName: undefined,
                })
              }
              title={o.label}
              className={cn(
                "group relative overflow-hidden rounded-lg border-2 transition",
                active
                  ? "border-foreground ring-2 ring-foreground/30"
                  : "border-border hover:border-foreground/40",
              )}
            >
              <div className={cn("h-12 w-full", o.thumb)} aria-hidden />
              <div className="truncate bg-card px-1.5 py-1 text-[10px] font-medium text-foreground">
                {o.label}
              </div>
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ImageIcon className="h-3 w-3" />
        {t("bgTip")}
      </p>
    </div>
  );
}
