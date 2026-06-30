import { useRef } from "react";
import { useDesigner } from "@/components/configurator/DesignerContext";
import { sanitiseSvg } from "@/lib/svgSanitize";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MousePointer2,
  Type,
  TextCursorInput,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Ruler,
  RotateCcw,
  Wand2,
  Undo2,
  Redo2,
  Layers,
  Trash2,
} from "lucide-react";

interface Tool {
  id: string;
  icon: typeof Type;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export function ToolRail({ onPickDecoration }: { onPickDecoration: () => void }) {
  const {
    config,
    update,
    selection,
    setSelection,
    addDecoration,
    addTextLayer,
    undo,
    redo,
    canUndo,
    canRedo,
    resetDesign,
  } = useDesigner();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSelectTool() {
    setSelection({ kind: "canvas" });
  }
  function handleTextTool() {
    setSelection({ kind: "text" });
    setTimeout(() => {
      const el = document.querySelector<HTMLTextAreaElement>("textarea#neon-text");
      el?.focus();
    }, 50);
  }
  function openLayers() {
    setSelection({ kind: "canvas" });
    setTimeout(() => {
      document
        .getElementById("layers-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }
  function handleSvgUpload(file: File) {
    if (!file.type.includes("svg")) {
      toast.error("Lütfen bir SVG dosyası seçin.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const cleaned = sanitiseSvg(text);
      if (!cleaned) {
        toast.error("SVG güvenli şekilde okunamadı veya çok büyük.");
        return;
      }
      addDecoration({
        id: `svg-${Date.now()}`,
        source: "upload",
        svgMarkup: cleaned.markup,
        label: file.name.replace(/\.svg$/i, ""),
        colorId: config.colorId,
        x: 0,
        y: 0,
        rotation: 0,
        sizePct: 22,
      });
      toast.success("SVG eklendi · renk ve boyutu sağdan ayarla");
    };
    reader.readAsText(file);
  }

  const tools: Tool[] = [
    {
      id: "select",
      icon: MousePointer2,
      label: "Seç (V)",
      onClick: handleSelectTool,
      active: selection.kind === "canvas",
    },
    {
      id: "text",
      icon: Type,
      label: "Ana Metin",
      onClick: handleTextTool,
      active: selection.kind === "text",
    },
    {
      id: "new-text-layer",
      icon: TextCursorInput,
      label: "Yeni Metin Katmanı",
      onClick: () => {
        addTextLayer({
          id: `tl-${Date.now()}`,
          text: "Yeni Yazı",
          fontId: config.fontId,
          colorId: config.colorId,
          sizePct: 14,
          x: 0,
          y: 15,
          rotation: 0,
        });
        toast.success("Metin katmanı eklendi");
      },
    },
    {
      id: "decoration",
      icon: Sparkles,
      label: "Süsleme / İkon Ekle",
      onClick: onPickDecoration,
    },
    {
      id: "upload",
      icon: Upload,
      label: "SVG Yükle",
      onClick: () => fileRef.current?.click(),
    },
    {
      id: "background",
      icon: ImageIcon,
      label: "Arka Plan",
      onClick: () => setSelection({ kind: "canvas" }),
    },
    {
      id: "layers",
      icon: Layers,
      label: "Katmanlar",
      onClick: openLayers,
    },
    {
      id: "measure",
      icon: Ruler,
      label: "Ölçüleri Göster/Gizle",
      onClick: () => update({ showMeasurements: !(config.showMeasurements ?? false) }),
      active: !!config.showMeasurements,
    },
    {
      id: "ai-mockup",
      icon: Wand2,
      label: "AI Mockup (yakında)",
      onClick: () =>
        toast.info("AI Mockup yakında! Tasarımını gerçek ortamda önizleyebileceksin."),
    },
    {
      id: "undo",
      icon: Undo2,
      label: "Geri Al (Ctrl+Z)",
      onClick: undo,
      disabled: !canUndo,
    },
    {
      id: "redo",
      icon: Redo2,
      label: "İleri Al (Ctrl+Shift+Z)",
      onClick: redo,
      disabled: !canRedo,
    },
    {
      id: "view-reset",
      icon: RotateCcw,
      label: "Görünümü Sıfırla",
      onClick: () =>
        update({ positionX: 0, positionY: 0, rotationDeg: 0, zoom: 1, brightness: 100 }),
    },
    {
      id: "design-reset",
      icon: Trash2,
      label: "Tasarımı Sıfırla",
      danger: true,
      onClick: () => {
        if (typeof window !== "undefined" && window.confirm("Tüm tasarımı sıfırlamak istiyor musun? (Geri al ile geri getirebilirsin)")) {
          resetDesign();
          toast.success("Tasarım sıfırlandı");
        }
      },
    },
  ];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 border-border bg-card/70 px-1 py-1",
        "overflow-x-auto border-b lg:overflow-y-auto lg:overflow-x-visible",
        "lg:w-14 lg:flex-col lg:gap-1 lg:border-b-0 lg:border-r lg:px-0 lg:py-2",
      )}
    >
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={tool.onClick}
          disabled={tool.disabled}
          title={tool.label}
          aria-label={tool.label}
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground",
            tool.active && "bg-accent text-foreground ring-1 ring-inset ring-neon-cyan/40",
            tool.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground",
            tool.danger && "text-destructive hover:bg-destructive/10 hover:text-destructive",
          )}
        >
          <tool.icon className="h-[18px] w-[18px]" />
        </button>
      ))}
      <input
        ref={fileRef}
        type="file"
        accept=".svg,image/svg+xml"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleSvgUpload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
