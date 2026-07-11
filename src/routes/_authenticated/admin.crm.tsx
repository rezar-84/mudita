import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListCrmLeads, adminUpsertCrmLead } from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/crm")({ component: AdminCrm });
const statuses = ["new", "contacted", "waiting", "won", "lost"] as const;

function AdminCrm() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-crm"], queryFn: () => adminListCrmLeads() });
  const save = useServerFn(adminUpsertCrmLead);
  const [draft, setDraft] = useState({ name: "", email: "", phone: "", note: "" });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-crm"] });
  const create = async () => {
    await save({ data: { ...draft, source: "manual", status: "new" } });
    setDraft({ name: "", email: "", phone: "", note: "" });
    toast.success("CRM kaydı eklendi");
    refresh();
  };
  const setStatus = async (id: string, status: (typeof statuses)[number]) => {
    await save({ data: { id, status } });
    refresh();
  };
  const waiting = data.filter(
    (lead: any) => lead.source === "waiting_cart" || lead.status === "waiting",
  );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">CRM ve bekleyen sepetler</h2>
        <p className="text-sm text-muted-foreground">
          Takip gerektiren müşteri adaylarını, sepet fırsatlarını ve notları yönetin.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Toplam aday" value={data.length} />
        <Stat label="Bekleyen takip" value={waiting.length} />
        <Stat label="Kazanılan" value={data.filter((lead: any) => lead.status === "won").length} />
      </div>
      <section className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
        <Input
          placeholder="Ad soyad"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <Input
          placeholder="E-posta"
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
        />
        <Input
          placeholder="Telefon"
          value={draft.phone}
          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
        />
        <Button onClick={create}>Yeni aday ekle</Button>
        <Textarea
          className="md:col-span-4"
          rows={2}
          placeholder="İlk görüşme notu"
          value={draft.note}
          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
        />
      </section>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Aday</th>
              <th className="p-3">Kaynak</th>
              <th className="p-3">Fırsat</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Not</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lead: any) => (
              <tr key={lead.id} className="border-b border-border align-top">
                <td className="p-3 font-medium">
                  {lead.name || "İsimsiz"}
                  <div className="text-xs font-normal text-muted-foreground">
                    {lead.email || lead.phone || "İletişim bilgisi yok"}
                  </div>
                </td>
                <td className="p-3 text-xs">
                  {lead.source === "waiting_cart" ? "Bekleyen sepet" : lead.source}
                </td>
                <td className="p-3">
                  {lead.estimated_total_try ? formatTRY(lead.estimated_total_try) : "—"}
                </td>
                <td className="p-3">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      setStatus(lead.id, e.target.value as (typeof statuses)[number])
                    }
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="max-w-xs whitespace-pre-wrap p-3 text-xs text-muted-foreground">
                  {lead.note || "—"}
                </td>
              </tr>
            ))}
            {!data.length && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Henüz CRM kaydı yok. Yeni aday ekleyebilir veya sepet yakalama entegrasyonunu
                  bağlayabilirsiniz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
