import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListUsers, adminSetUserRole } from "@/lib/orders.functions";
import { toast } from "sonner";
import { Shield, ShieldOff } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: () => adminListUsers() });
  const setRole = useServerFn(adminSetUserRole);

  const toggle = async (user_id: string, isAdmin: boolean) => {
    await setRole({ data: { user_id, role: "admin", grant: !isAdmin } });
    toast.success(isAdmin ? "Admin yetkisi kaldırıldı" : "Admin yapıldı");
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Kullanıcılar</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">E-posta</th>
              <th className="p-3">Kayıt</th>
              <th className="p-3">Son giriş</th>
              <th className="p-3">Roller</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((u) => {
              const isAdmin = u.roles.includes("admin");
              return (
                <tr key={u.id} className="border-b border-border">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-xs text-muted-foreground">{u.created_at ? new Date(u.created_at).toLocaleDateString("tr-TR") : "—"}</td>
                  <td className="p-3 text-xs text-muted-foreground">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("tr-TR") : "—"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span key={r} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggle(u.id, isAdmin)}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
                    >
                      {isAdmin ? <><ShieldOff className="h-3 w-3" /> Admin kaldır</> : <><Shield className="h-3 w-3" /> Admin yap</>}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!data?.length && (
              <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">Kullanıcı yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
