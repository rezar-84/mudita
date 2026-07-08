import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/hesap/profil")({
  component: ProfilePage,
});

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  // legacy shape
  line?: string;
};

function ProfilePage() {
  const t = useT();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState<Address>({ country: "TR" });
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("display_name, phone, address")
        .eq("id", userData.user?.id ?? "")
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setPhone(data.phone ?? "");
        const a = (data.address ?? {}) as Address;
        setAddr({
          line1: a.line1 ?? a.line ?? "",
          line2: a.line2 ?? "",
          city: a.city ?? "",
          district: a.district ?? "",
          postal_code: a.postal_code ?? "",
          country: a.country ?? "TR",
          tax_id: a.tax_id ?? "",
        });
      }
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      display_name: displayName,
      phone,
      address: addr as never,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success(t("profileSaved"));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const set = (patch: Partial<Address>) => setAddr((a) => ({ ...a, ...patch }));

  return (
    <div>
      <h2 className="text-lg font-semibold">{t("profileTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("profileSubtitle")}</p>
      <form onSubmit={save} className="mt-6 max-w-2xl space-y-6">
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("checkoutContactHeader")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>{t("billEmail")}</Label>
              <Input value={email} disabled />
            </div>
            <div>
              <Label htmlFor="dn">{t("billFullName")}</Label>
              <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">{t("billPhone")}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("checkoutShippingHeader")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="addr1">{t("billAddressLine1")}</Label>
              <Input id="addr1" value={addr.line1 ?? ""} onChange={(e) => set({ line1: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="addr2">{t("billAddressLine2")}</Label>
              <Input id="addr2" value={addr.line2 ?? ""} onChange={(e) => set({ line2: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="city">{t("billCity")}</Label>
              <Input id="city" value={addr.city ?? ""} onChange={(e) => set({ city: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="district">{t("billDistrict")}</Label>
              <Input id="district" value={addr.district ?? ""} onChange={(e) => set({ district: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="postal">{t("billPostalCode")}</Label>
              <Input id="postal" value={addr.postal_code ?? ""} onChange={(e) => set({ postal_code: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="country">{t("billCountry")}</Label>
              <Input id="country" value={addr.country ?? "TR"} onChange={(e) => set({ country: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("checkoutInvoiceHeader")}
          </h3>
          <div>
            <Label htmlFor="tax">{t("billTaxId")}</Label>
            <Input id="tax" value={addr.tax_id ?? ""} onChange={(e) => set({ tax_id: e.target.value })} />
          </div>
        </section>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={busy} className="bg-gradient-neon text-white">
            {busy ? "…" : t("profileSave")}
          </Button>
          <button type="button" onClick={signOut} className="text-sm text-muted-foreground hover:text-destructive">
            {t("userMenuSignOut")}
          </button>
        </div>
      </form>
    </div>
  );
}
