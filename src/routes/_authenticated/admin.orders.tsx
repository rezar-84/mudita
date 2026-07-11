import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  adminGetOrderDetails,
} from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = [
  "pending",
  "confirmed",
  "producing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
type Status = (typeof STATUSES)[number];

function AdminOrders() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-orders"], queryFn: () => adminListOrders() });
  const update = useServerFn(adminUpdateOrderStatus);
  const getDetails = useServerFn(adminGetOrderDetails);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: detail } = useQuery({
    queryKey: ["admin-order", selectedId],
    queryFn: () => getDetails({ data: { id: selectedId! } }),
    enabled: !!selectedId,
  });

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
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o) => {
              const contact = o.contact as { name?: string; email?: string } | null;
              return (
                <tr key={o.id} className="border-b border-border">
                  <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="p-3">
                    {contact?.name ?? "—"}
                    <div className="text-xs text-muted-foreground">{contact?.email}</div>
                  </td>
                  <td className="p-3 font-medium">{formatTRY(o.total_try)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => change(o.id, e.target.value as Status)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" onClick={() => setSelectedId(o.id)}>
                      Detay
                    </Button>
                  </td>
                </tr>
              );
            })}
            {!data?.length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                  Sipariş yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sipariş detayı</DialogTitle>
          </DialogHeader>
          {!detail ? (
            <p className="text-sm text-muted-foreground">Yükleniyor…</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2">
                <Info label="Sipariş" value={detail.order.id} />
                <Info label="Durum" value={detail.order.status} />
                <Info
                  label="Müşteri"
                  value={(detail.order.contact as { name?: string } | null)?.name ?? "—"}
                />
                <Info label="Toplam" value={formatTRY(detail.order.total_try)} />
                <Info
                  label="Teslimat"
                  value={`${(detail.order.contact as { address_line1?: string; city?: string } | null)?.address_line1 ?? "—"} · ${(detail.order.contact as { city?: string } | null)?.city ?? ""}`}
                />
                <Info label="Not" value={detail.order.notes ?? "—"} />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Ürünler ({detail.items.length})</h3>
                <div className="space-y-2">
                  {detail.items.map((item) => {
                    const config = item.config as {
                      text?: string;
                      textLayers?: { text?: string }[];
                    };
                    const title =
                      config.textLayers?.find((layer) => layer.text)?.text ||
                      config.text ||
                      "Tasarım";
                    return (
                      <div key={item.id} className="rounded-lg border border-border p-3">
                        <div className="flex justify-between gap-3">
                          <span className="font-medium">{title}</span>
                          <span>{formatTRY(item.price_try)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {JSON.stringify(item.breakdown)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words">{value}</p>
    </div>
  );
}
