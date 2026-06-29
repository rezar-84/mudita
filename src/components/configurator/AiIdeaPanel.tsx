import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/**
 * Local mock — does NOT call an AI API yet.
 *
 * TODO (future backend / AI integration):
 *  - Wire "Fikir Öner" to a server function that calls OpenAI (text) for
 *    prompt → design suggestions (fontId / colorId / sizeId / vibe).
 *  - Use OpenAI Vision to analyze uploaded logos and propose backboard /
 *    cut style.
 *  - Use AI image generation (e.g. Lovable AI Gateway image model) to render
 *    a room mockup of the neon on the user's space.
 *  - Persist generated concepts per user in the backend so they can be
 *    revisited from the gallery.
 */
const SAMPLE_SUGGESTIONS = [
  "Minimal çizgili logo tabelası — Bebas Neue, sıcak beyaz, 80 cm",
  "Sıcak beyaz el yazısı isim tabelası — Pacifico, 60 cm, dikdörtgen panel",
  "Kafe duvarı için retro pembe neon — Monoton, pembe, 100 cm",
  "Mağaza vitrini için okunaklı blok yazı — Russo One, soğuk beyaz, 120 cm",
];

const USE_CASES = ["Ev / Salon", "Bebek Odası", "Düğün & Nişan", "Kafe", "Mağaza", "Ofis"];
const STYLES = ["Minimal", "Retro", "El Yazısı", "Bold / Blok", "Zarif"];
const VIBES = ["Sıcak Beyaz", "Pembe / Romantik", "Mavi / Serin", "Çok Renkli (RGB)", "Sarı / Enerjik"];

export function AiIdeaPanel() {
  const [prompt, setPrompt] = useState("");
  const [useCase, setUseCase] = useState(USE_CASES[3]);
  const [style, setStyle] = useState(STYLES[0]);
  const [vibe, setVibe] = useState(VIBES[0]);
  const [shown, setShown] = useState<string[] | null>(null);

  function suggest() {
    // TODO: replace with real AI call.
    setShown(SAMPLE_SUGGESTIONS);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-foreground/25 bg-gradient-to-br from-accent/30 to-secondary/20 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-neon-pink" />
        <h3 className="text-sm font-semibold">AI ile Fikir Üret</h3>
        <span className="ml-auto rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          Yakında
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Hayalindeki tabelayı anlat, sana stil önerileri sunalım. (Şimdilik örnek öneriler gösterilir.)
      </p>

      <div>
        <Label className="mb-1 block text-xs">Nasıl bir tabela hayal ediyorsun?</Label>
        <Textarea
          rows={3}
          placeholder="Örn: Kafem için sıcak beyaz, minimal ve okunaklı bir neon tabela istiyorum."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <SelectChips label="Kullanım alanı" options={USE_CASES} value={useCase} onChange={setUseCase} />
        <SelectChips label="Stil" options={STYLES} value={style} onChange={setStyle} />
        <SelectChips label="Renk havası" options={VIBES} value={vibe} onChange={setVibe} />
      </div>

      <Button
        type="button"
        onClick={suggest}
        className="w-full bg-gradient-neon text-white shadow-glow hover:opacity-90"
      >
        <Wand2 className="mr-2 h-4 w-4" /> Fikir Öner
      </Button>

      {shown && (
        <ul className="space-y-2 rounded-lg border border-border bg-card p-3">
          {shown.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-foreground"
            >
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-neon-pink" />
              <span>{s}</span>
            </li>
          ))}
          <li className="pt-1 text-[10px] text-muted-foreground">
            Bu öneriler örnek amaçlıdır. Gerçek AI önerileri yakında eklenecek.
          </li>
        </ul>
      )}
    </div>
  );
}

function SelectChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block text-[11px] text-muted-foreground">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
