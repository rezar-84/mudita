import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => adminStats() });
  if (!data) return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Kullanıcı" value={data.userCount} />
        <Card label="Sipariş" value={data.orderCount} />
        <Card label="Toplam Ciro" value={formatTRY(data.totalRevenue)} />
        <Card label="Etkinlik" value={Object.values(data.eventCounts).reduce((a, b) => a + b, 0)} />
      </div>

      <section>
        <h3 className="font-semibold">Sipariş Durumu</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {Object.entries(data.byStatus).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs uppercase text-muted-foreground">{k}</div>
              <div className="text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold">Tasarımcı Etkinlikleri</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.eventCounts).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
