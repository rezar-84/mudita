import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "905555555555"; // placeholder; update with real number
const DEFAULT_MSG = "Merhaba! Mudita Dekorasyon neon tabela hakkında bilgi almak istiyorum.";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MSG)}`;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 print:hidden md:bottom-6 md:left-6">
      {open && (
        <div className="w-72 animate-fade-in rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">WhatsApp ile Hızlı Teklif</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sorularını yaz, ücretsiz tasarım ve teklif alalım.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp'ı Aç
          </a>
        </div>
      )}

      {/* MOBILE bottom bar leaves space; lift the FAB on mobile so it doesn't overlap the price bar on /tasarla */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="WhatsApp ile iletişime geç"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition hover:scale-105 mb-16 md:mb-0"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden />
        <MessageCircle className="relative h-6 w-6" />
      </button>
    </div>
  );
}
