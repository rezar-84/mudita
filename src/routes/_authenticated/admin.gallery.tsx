import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListGallery, adminUpsertGallery, adminDeleteGallery } from "@/lib/orders.functions";
import { FONTS, COLORS } from "@/data/options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Pencil, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: AdminGallery,
});

type GalleryItem = {
  id: string;
  slug: string;
  title: string;
  text: string | null;
  font_id: string | null;
  color_id: string | null;
  image_url: string | null;
  tags: string[] | null;
  published: boolean;
  sort: number;
};

function AdminGallery() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-gallery"], queryFn: () => adminListGallery() });
  const upsert = useServerFn(adminUpsertGallery);
  const del = useServerFn(adminDeleteGallery);
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await upsert({
        data: {
          id: editing.id,
          slug: editing.slug ?? "",
          title: editing.title ?? "",
          text: editing.text ?? undefined,
          font_id: editing.font_id ?? undefined,
          color_id: editing.color_id ?? undefined,
          image_url: editing.image_url ?? "",
          tags: editing.tags ?? [],
          published: editing.published ?? true,
          sort: editing.sort ?? 0,
        },
      });
      toast.success("Kaydedildi");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Sil?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Galeri Yönetimi</h2>
        <Button
          onClick={() => setEditing({ published: true, sort: 0 })}
          className="bg-gradient-neon text-white"
        >
          <Plus className="mr-1 h-4 w-4" /> Yeni
        </Button>
      </div>

      {editing && (
        <form
          onSubmit={save}
          className="mt-4 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
        >
          <div>
            <Label>Başlık</Label>
            <Input
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={editing.slug ?? ""}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Yazı</Label>
            <Input
              value={editing.text ?? ""}
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            />
          </div>
          <div>
            <Label>Font</Label>
            <select
              value={editing.font_id ?? ""}
              onChange={(e) => setEditing({ ...editing, font_id: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Renk</Label>
            <select
              value={editing.color_id ?? ""}
              onChange={(e) => setEditing({ ...editing, color_id: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {COLORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Sıralama</Label>
            <Input
              type="number"
              value={editing.sort ?? 0}
              onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Görsel URL (opsiyonel)</Label>
            <Input
              value={editing.image_url ?? ""}
              onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
              placeholder="https://…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.published ?? true}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
            />
            Yayında
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" className="bg-gradient-neon text-white">
              Kaydet
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              İptal
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Başlık</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Yazı</th>
              <th className="p-3">Yayında</th>
              <th className="p-3">Sıra</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((g: GalleryItem) => (
              <tr key={g.id} className="border-b border-border">
                <td className="p-3">{g.title}</td>
                <td className="p-3 text-xs text-muted-foreground">{g.slug}</td>
                <td className="p-3">{g.text}</td>
                <td className="p-3">{g.published ? "✓" : "—"}</td>
                <td className="p-3">{g.sort}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(g)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(g.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!data?.length && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-muted-foreground">
                  Öğe yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
