import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useT } from "@/lib/i18n";

const WHATSAPP_NUMBER = "905555555555";

export function WhatsAppWidget() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba! Mudita Dekorasyon neon tabela hakkında bilgi almak istiyorum.")}`;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 print:hidden md:bottom-6 md:left-6">
      {open && (
        <div className="w-72 animate-fade-in rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{t("whatsappTitle")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("whatsappSubtitle")}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={t("whatsappClose")}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <a href={href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-90">
            <MessageCircle className="h-4 w-4" />
            {t("whatsappOpenBtn")}
          </a>
        </div>
      )}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={t("whatsappAria")} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition hover:scale-105 mb-16 md:mb-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden />
        <MessageCircle className="relative h-6 w-6" />
      </button>
    </div>
  );
}
