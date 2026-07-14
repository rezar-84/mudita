import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { handleServerError } from "./serverErrors";

const configSchema = z.record(z.string(), z.unknown());

export const listMyDesigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("saved_designs")
      .select("id, name, config, thumbnail_url, created_at, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) handleServerError(error, "Tasarımlar listelenirken bir hata oluştu.");
    return data ?? [];
  });

export const saveDesign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        name: z.string().min(1).max(120),
        config: configSchema,
        thumbnail_url: z.string().url().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("saved_designs")
      .insert({
        user_id: context.userId,
        name: data.name,
        config: data.config as never,
        thumbnail_url: data.thumbnail_url,
      })
      .select("id")
      .single();
    if (error) handleServerError(error, "Tasarım kaydedilirken bir hata oluştu.");
    return row;
  });

export const deleteDesign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_designs")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) handleServerError(error, "Tasarım silinirken bir hata oluştu.");
    return { ok: true };
  });
