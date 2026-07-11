import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListUsers,
  adminSetUserRole,
  adminUpdateUserProfile,
  adminDeleteUser,
  adminListOrders,
} from "@/lib/orders.functions";
import { formatTRY } from "@/lib/pricing";
import { toast } from "sonner";
import {
  Shield,
  ShieldOff,
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Trash2,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
};

interface UserData {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
  profile: {
    display_name?: string;
    phone?: string;
    address?: any;
    updated_at?: string;
  } | null;
}

function AdminUsers() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminListUsers(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => adminListOrders(),
  });

  const setRole = useServerFn(adminSetUserRole);
  const updateProfile = useServerFn(adminUpdateUserProfile);
  const deleteUser = useServerFn(adminDeleteUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<Address>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");

  const handleOpenDetails = (user: UserData) => {
    setSelectedUser(user);
    setDisplayName(user.profile?.display_name || "");
    setPhone(user.profile?.phone || "");
    const addr = (user.profile?.address ?? {}) as Address;
    setAddress({
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      district: addr.district || "",
      postal_code: addr.postal_code || "",
      country: addr.country || "TR",
      tax_id: addr.tax_id || "",
    });
    setEditMode(false);
    setIsDeleting(false);
    setConfirmDeleteText("");
  };

  const toggleAdminRole = async (user_id: string, isAdmin: boolean) => {
    try {
      await setRole({ data: { user_id, role: "admin", grant: !isAdmin } });
      toast.success(isAdmin ? "Admin yetkisi kaldırıldı" : "Admin yetkisi verildi");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      if (selectedUser?.id === user_id) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                roles: isAdmin
                  ? prev.roles.filter((r) => r !== "admin")
                  : [...prev.roles, "admin"],
              }
            : null
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu");
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await updateProfile({
        data: {
          user_id: selectedUser.id,
          display_name: displayName,
          phone,
          address: address as any,
        },
      });
      toast.success("Kullanıcı profili güncellendi");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setEditMode(false);
      // Update selectedUser state locally
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                display_name: displayName,
                phone,
                address,
              },
            }
          : null
      );
    } catch (err: any) {
      toast.error(err.message || "Profil güncellenirken hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (confirmDeleteText !== "SİL") {
      toast.error("Lütfen silme işlemini onaylamak için kutuya 'SİL' yazın.");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUser({ data: { user_id: selectedUser.id } });
      toast.success("Kullanıcı tamamen silindi");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || "Kullanıcı silinirken hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    // Role filter
    if (roleFilter === "admin" && !u.roles.includes("admin")) return false;
    if (roleFilter === "customer" && u.roles.includes("admin")) return false;

    // Search filter
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const nameMatch = (u.profile?.display_name || "").toLowerCase().includes(s);
    const emailMatch = (u.email || "").toLowerCase().includes(s);
    const phoneMatch = (u.profile?.phone || "").toLowerCase().includes(s);
    return nameMatch || emailMatch || phoneMatch;
  });

  const userOrders = selectedUser
    ? orders.filter((o) => o.user_id === selectedUser.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-muted-foreground">
            Sistemdeki kayıtlı müşterileri ve yöneticileri listeyin, yetkilendirin ve düzenleyin.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="İsim, e-posta veya telefon ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-border p-1 bg-muted/40">
          <Button
            variant={roleFilter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRoleFilter("all")}
          >
            Tümü
          </Button>
          <Button
            variant={roleFilter === "admin" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRoleFilter("admin")}
          >
            Yöneticiler
          </Button>
          <Button
            variant={roleFilter === "customer" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRoleFilter("customer")}
          >
            Müşteriler
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Müşteri</th>
              <th className="p-3">İletişim</th>
              <th className="p-3">Kayıt Tarihi</th>
              <th className="p-3">Son Giriş</th>
              <th className="p-3">Roller</th>
              <th className="p-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const isAdmin = u.roles.includes("admin");
              return (
                <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-medium">{u.profile?.display_name || "İsimsiz"}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="p-3 text-xs">
                    <div>{u.profile?.phone || "—"}</div>
                    <div className="max-w-40 truncate text-muted-foreground">
                      {(u.profile?.address as { city?: string } | null)?.city || ""}
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("tr-TR") : "—"}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleDateString("tr-TR")
                      : "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            r === "admin"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          {r === "admin" ? "Yönetici" : "Müşteri"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetails(u)}
                        className="inline-flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" /> Detay / Düzenle
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filteredUsers.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details & Edit Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kullanıcı Bilgileri & Yönetim</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-2">
              {/* Header Profile Summary */}
              <div className="flex items-start gap-4 rounded-lg border border-border p-4 bg-muted/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-base">
                    {selectedUser.profile?.display_name || "İsimsiz Kullanıcı"}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {selectedUser.email}
                    </span>
                    {selectedUser.profile?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {selectedUser.profile.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Kayıt:{" "}
                      {new Date(selectedUser.created_at).toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.roles.map((r) => (
                      <span
                        key={r}
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                          r === "admin" ? "bg-red-500/15 text-red-500" : "bg-blue-500/15 text-blue-500"
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      toggleAdminRole(selectedUser.id, selectedUser.roles.includes("admin"))
                    }
                  >
                    {selectedUser.roles.includes("admin") ? (
                      <>
                        <ShieldOff className="mr-1 h-3.5 w-3.5" /> Adminlik Kaldır
                      </>
                    ) : (
                      <>
                        <Shield className="mr-1 h-3.5 w-3.5" /> Admin Yap
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tabs / Toggle for edit profile vs viewing information */}
              {!editMode ? (
                <div className="space-y-6">
                  {/* Shipping & Billing Address Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> Adres ve İletişim Bilgileri
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                        Profilini Düzenle
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 rounded-lg border border-border p-4 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Ad Soyad</span>
                        <p className="font-medium">{selectedUser.profile?.display_name || "—"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Telefon</span>
                        <p className="font-medium">{selectedUser.profile?.phone || "—"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-xs text-muted-foreground">Adres Satırı 1</span>
                        <p className="font-medium">{(selectedUser.profile?.address as Address)?.line1 || "—"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-xs text-muted-foreground">Adres Satırı 2</span>
                        <p className="font-medium">{(selectedUser.profile?.address as Address)?.line2 || "—"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">İlçe / İl</span>
                        <p className="font-medium">
                          {[(selectedUser.profile?.address as Address)?.district, (selectedUser.profile?.address as Address)?.city]
                            .filter(Boolean)
                            .join(" / ") || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Posta Kodu / Ülke</span>
                        <p className="font-medium">
                          {[(selectedUser.profile?.address as Address)?.postal_code, (selectedUser.profile?.address as Address)?.country]
                            .filter(Boolean)
                            .join(" / ") || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Vergi No / TC</span>
                        <p className="font-medium">{(selectedUser.profile?.address as Address)?.tax_id || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Orders History */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Sipariş Geçmişi ({userOrders.length})</h4>
                    {userOrders.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                        {userOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 hover:bg-muted/10 transition-colors">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-semibold">{order.id.slice(0, 8)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString("tr-TR")}
                                </span>
                              </div>
                              <div className="text-xs font-semibold mt-1">
                                Tutar: {formatTRY(order.total_try)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                                {order.status}
                              </span>
                              <Link
                                to="/admin/orders"
                                className="text-primary hover:underline text-xs inline-flex items-center"
                              >
                                Git <ExternalLink className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                        Bu kullanıcıya ait sipariş bulunamadı.
                      </p>
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-red-500">Tehlikeli Alan</h4>
                    <p className="text-xs text-muted-foreground">
                      Kullanıcıyı silmek, kullanıcının hesabını, siparişlerini ve tasarımlarını kalıcı olarak sistemden kaldıracaktır. Bu işlem geri alınamaz.
                    </p>
                    {!isDeleting ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleting(true)}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="h-4 w-4" /> Kullanıcıyı Tamamen Sil
                      </Button>
                    ) : (
                      <div className="space-y-3 pt-2 border-t border-red-500/20">
                        <Label htmlFor="confirm-del" className="text-xs font-bold text-red-500">
                          Onaylamak için büyük harflerle "SİL" yazın:
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="confirm-del"
                            value={confirmDeleteText}
                            onChange={(e) => setConfirmDeleteText(e.target.value)}
                            placeholder="SİL"
                            className="max-w-xs border-red-500/30"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteUser}
                            disabled={confirmDeleteText !== "SİL"}
                          >
                            Evet, Kalıcı Olarak Sil
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsDeleting(false);
                              setConfirmDeleteText("");
                            }}
                          >
                            Vazgeç
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Edit Profile Form */
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="edit-name">Ad Soyad</Label>
                      <Input
                        id="edit-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Telefon</Label>
                      <Input
                        id="edit-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="edit-line1">Adres Satırı 1</Label>
                      <Input
                        id="edit-line1"
                        value={address.line1 || ""}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="edit-line2">Adres Satırı 2</Label>
                      <Input
                        id="edit-line2"
                        value={address.line2 || ""}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-district">İlçe</Label>
                      <Input
                        id="edit-district"
                        value={address.district || ""}
                        onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-city">Şehir</Label>
                      <Input
                        id="edit-city"
                        value={address.city || ""}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-postal">Posta Kodu</Label>
                      <Input
                        id="edit-postal"
                        value={address.postal_code || ""}
                        onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-country">Ülke</Label>
                      <Input
                        id="edit-country"
                        value={address.country || "TR"}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="edit-tax">Vergi No / TC Kimlik No</Label>
                      <Input
                        id="edit-tax"
                        value={address.tax_id || ""}
                        onChange={(e) => setAddress({ ...address, tax_id: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0 pt-4">
                    <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                      Vazgeç
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
