import { createFileRoute, Outlet, Link, useRouterState, redirect } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Users, Image as ImageIcon, DollarSign, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Paneli · MudiNeon" }] }),
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) throw redirect({ to: "/hesap" });
  },
  component: AdminLayout,
});

const LINKS: { to: string; label: string; icon: typeof LayoutDashboard }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Siparişler", icon: Package },
  { to: "/admin/users", label: "Kullanıcılar", icon: Users },
  { to: "/admin/gallery", label: "Galeri", icon: ImageIcon },
  { to: "/admin/pricing", label: "Fiyatlandırma", icon: DollarSign },
  { to: "/admin/analytics", label: "Analitik", icon: BarChart3 },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin Paneli</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
          {LINKS.map((l) => {
            const active = l.to === "/admin" ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to as "/admin"}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
