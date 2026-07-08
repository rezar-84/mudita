import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/lib/orders.functions";
import { listMyDesigns } from "@/lib/designs.functions";
import { formatTRY } from "@/lib/pricing";
import { Package, Bookmark, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hesap/")({
  component: HesapOverview,
});

function HesapOverview() {
  const orders = useQuery({ queryKey: ["my-orders"], queryFn: () => listMyOrders() });
  const designs = useQuery({ queryKey: ["my-designs"], queryFn: () => listMyDesigns() });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card icon={Package} label="Sipariş" value={orders.data?.length ?? 0} />
        <Card icon={Bookmark} label="Kayıtlı Tasarım" value={designs.data?.length ?? 0} />
        <Card
          icon={PlusCircle}
          label="Yeni Tasarım"
          value=""
          hint={<Link to="/tasarla" className="text-neon-pink hover:underline">Tasarımcıyı aç</Link>}
        />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Son Siparişler</h2>
          <Link to="/hesap/siparisler" className="text-xs text-muted-foreground hover:text-foreground">Tümü →</Link>
        </div>
        {orders.data?.length ? (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {orders.data.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-medium">#{o.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("tr-TR")}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatTRY(o.total_try)}</div>
                  <div className="text-xs uppercase text-muted-foreground">{o.status}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Henüz siparişin yok.
          </p>
        )}
      </section>
    </div>
  );
}

function Card({ icon: Icon, label, value, hint }: { icon: typeof Package; label: string; value: string | number; hint?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-sm">{hint}</div>}
    </div>
  );
}
