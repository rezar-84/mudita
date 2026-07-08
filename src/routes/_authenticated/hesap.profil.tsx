import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hesap/profil")({
  component: ProfilePage,
});

function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
        const addr = data.address as { line?: string } | null;
        setAddress(addr?.line ?? "");
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
      address: { line: address },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Profil kaydedildi");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Profil</h2>
      <form onSubmit={save} className="mt-4 max-w-lg space-y-4">
        <div>
          <Label>E-posta</Label>
          <Input value={email} disabled />
        </div>
        <div>
          <Label htmlFor="dn">Ad Soyad</Label>
          <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="addr">Adres</Label>
          <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy} className="bg-gradient-neon text-white">
            {busy ? "…" : "Kaydet"}
          </Button>
          <button type="button" onClick={signOut} className="text-sm text-muted-foreground hover:text-destructive">
            Çıkış Yap
          </button>
        </div>
      </form>
    </div>
  );
}
