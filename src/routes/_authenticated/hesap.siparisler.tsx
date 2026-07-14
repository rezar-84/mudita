import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";

export const Route = createFileRoute("/_authenticated/hesap/siparisler")({
  component: OrdersPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  producing: "Üretimde",
  shipped: "Kargoda",
  delivered: "Teslim edildi",
  cancelled: "İptal",
};

function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: () => listMyOrders() });
  return (
    <div>
      <h2 className="text-lg font-semibold">Siparişlerim</h2>
      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Yükleniyor…</p>
      ) : !data?.length ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Henüz siparişin yok.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {data.map((o) => (
            <li key={o.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">#{o.id.slice(0, 8)}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("tr-TR")}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatTRY(o.total_try)}</div>
                <div className="text-xs uppercase text-muted-foreground">
                  {STATUS_LABEL[o.status] ?? o.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
