import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "producing", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUSES[number];

function AdminOrders() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-orders"], queryFn: () => adminListOrders() });
  const update = useServerFn(adminUpdateOrderStatus);

  const change = async (id: string, status: Status) => {
    await update({ data: { id, status } });
    toast.success("Durum güncellendi");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Siparişler</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Müşteri</th>
              <th className="p-3">Tutar</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o) => {
              const contact = o.contact as { name?: string; email?: string } | null;
              return (
                <tr key={o.id} className="border-b border-border">
                  <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="p-3">{contact?.name ?? "—"}<div className="text-xs text-muted-foreground">{contact?.email}</div></td>
                  <td className="p-3 font-medium">{formatTRY(o.total_try)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => change(o.id, e.target.value as Status)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("tr-TR")}</td>
                </tr>
              );
            })}
            {!data?.length && (
              <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">Sipariş yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
