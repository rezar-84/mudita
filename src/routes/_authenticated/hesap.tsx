import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LayoutGrid, Bookmark, Package, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hesap")({
  head: () => ({ meta: [{ title: "Hesabım · MudiNeon" }] }),
  component: HesapLayout,
});

const LINKS: { to: string; label: string; icon: typeof LayoutGrid; exact?: boolean }[] = [
  { to: "/hesap", label: "Genel Bakış", icon: LayoutGrid, exact: true },
  { to: "/hesap/tasarimlar", label: "Tasarımlarım", icon: Bookmark },
  { to: "/hesap/siparisler", label: "Siparişlerim", icon: Package },
  { to: "/hesap/profil", label: "Profil", icon: User },
];

function HesapLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Hesabım</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to as "/hesap"}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
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
