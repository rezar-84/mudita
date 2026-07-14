import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";
import { Users, ShoppingBag, CreditCard, Activity, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308", // Yellow
  confirmed: "#3b82f6", // Blue
  producing: "#a855f7", // Purple
  shipped: "#06b6d4", // Cyan
  delivered: "#22c55e", // Green
  cancelled: "#ef4444", // Red
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekleyen",
  confirmed: "Onaylanan",
  producing: "Üretimde",
  shipped: "Kargolanan",
  delivered: "Teslim Edilen",
  cancelled: "İptal Edilen",
};

function AdminDashboard() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => adminStats() });

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-sm text-muted-foreground">Yükleniyor…</span>
      </div>
    );
  }

  // Prep data for charts
  const statusData = Object.entries(data.byStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || "#94a3b8",
  }));

  const totalEvents = Object.values(data.eventCounts).reduce((a, b) => a + b, 0);

  const eventData = Object.entries(data.eventCounts)
    .map(([event, count]) => ({
      name: event.replace(/_/g, " "),
      Etkinlik: count,
    }))
    .sort((a, b) => b.Etkinlik - a.Etkinlik)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Yönetim Paneli</h2>
        <p className="text-sm text-muted-foreground">
          Sistem performansı ve istatistiklerine genel bakış.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toplam Kullanıcı
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.userCount}</div>
            <p className="mt-1 flex items-center text-xs text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>Aktif kayıtlar</span>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toplam Sipariş
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-chart-1">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.orderCount}</div>
            <p className="mt-1 flex items-center text-xs text-blue-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>Gelen talepler</span>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toplam Ciro
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatTRY(data.totalRevenue)}
            </div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>Ödemesi alınan siparişler</span>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Toplam Tasarım Etkinliği
            </CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <span>Konfigüratör etkileşimi</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Status Distribution */}
        <Card className="col-span-1 border-border bg-card/50 backdrop-blur-md lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Sipariş Dağılımı</CardTitle>
            <CardDescription>Siparişlerin güncel durum oranları.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {statusData.length > 0 ? (
              <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Sipariş`, "Miktar"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs w-full px-2">
                  {statusData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="truncate text-muted-foreground font-medium">
                        {entry.name}: <strong className="text-foreground">{entry.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-12 text-sm text-muted-foreground">Sipariş verisi bulunmuyor.</p>
            )}
          </CardContent>
        </Card>

        {/* Designer Activity Chart */}
        <Card className="col-span-1 border-border bg-card/50 backdrop-blur-md md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Tasarımcı Etkileşim Trendleri</CardTitle>
            <CardDescription>Konfigüratör üzerinde en çok yapılan işlemler.</CardDescription>
          </CardHeader>
          <CardContent>
            {eventData.length > 0 ? (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v.length > 12 ? `${v.substring(0, 10)}..` : v)}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />
                    <Bar dataKey="Etkinlik" fill="url(#neonGradient)" radius={[4, 4, 0, 0]}>
                      <defs>
                        <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-12 text-sm text-muted-foreground">Etkinlik verisi bulunmuyor.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
