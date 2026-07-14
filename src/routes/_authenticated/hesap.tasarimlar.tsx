import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyDesigns, deleteDesign } from "@/lib/designs.functions";
import { encodeConfig } from "@/lib/share";
import { sanitiseConfigDecorations } from "@/lib/svgSanitize";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hesap/tasarimlar")({
  component: DesignsPage,
});

function DesignsPage() {
  const qc = useQueryClient();
  const del = useServerFn(deleteDesign);
  const { data } = useQuery({ queryKey: ["my-designs"], queryFn: () => listMyDesigns() });

  const remove = async (id: string) => {
    if (!confirm("Tasarımı silmek istediğine emin misin?")) return;
    await del({ data: { id } });
    toast.success("Tasarım silindi");
    qc.invalidateQueries({ queryKey: ["my-designs"] });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Kayıtlı Tasarımlarım</h2>
      {!data?.length ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Henüz kayıtlı tasarımın yok.{" "}
          <Link to="/tasarla" className="text-neon-pink hover:underline">
            Tasarım oluştur
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.map((d) => {
            const cfg = sanitiseConfigDecorations(d.config as any);
            const share = "/tasarla?d=" + encodeConfig(cfg);
            return (
              <li key={d.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{d.name || "Adsız tasarım"}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(d.updated_at).toLocaleString("tr-TR")}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <a
                  href={share}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-neon-pink hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Editörde aç
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
