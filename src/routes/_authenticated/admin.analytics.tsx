import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AdminAnalytics,
});

function AdminAnalytics() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => adminStats() });
  if (!data) return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;
  const events = Object.entries(data.eventCounts).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <h2 className="text-lg font-semibold">Analitik</h2>
      <p className="mt-1 text-sm text-muted-foreground">Tasarımcı etkinlik özeti.</p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Olay</th><th className="p-3 text-right">Sayı</th></tr>
          </thead>
          <tbody>
            {events.length ? events.map(([k, v]) => (
              <tr key={k} className="border-b border-border"><td className="p-3">{k}</td><td className="p-3 text-right font-medium">{v}</td></tr>
            )) : (
              <tr><td colSpan={2} className="p-6 text-center text-sm text-muted-foreground">Henüz veri yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
