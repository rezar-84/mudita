import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
  );
}

export const getPricingConfig = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase.from("pricing_config").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

const pricingSchema = z.object({
  base_rate_per_cm2: z.coerce.number().min(0.1).max(50),
  outdoor_mult: z.coerce.number().min(1).max(3),
  rgb_mult: z.coerce.number().min(1).max(3),
  urgent_mult: z.coerce.number().min(1).max(3),
  extra_line_fee: z.coerce.number().int().min(0).max(10000),
  shipping_tr: z.coerce.number().int().min(0).max(10000),
  decoration_preset_base: z.coerce.number().int().min(0).max(10000),
  decoration_upload_base: z.coerce.number().int().min(0).max(10000),
  adapter_tr: z.coerce.number().int().min(0).max(10000),
  adapter_eu: z.coerce.number().int().min(0).max(10000),
  decoration_hybrid_fee: z.coerce.number().int().min(0).max(10000).optional(),
  decoration_print_only_mult: z.coerce.number().min(0.05).max(1).optional(),
});

export const updatePricingConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => pricingSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("pricing_config")
      .update({
        base_rate_per_cm2: data.base_rate_per_cm2,
        outdoor_mult: data.outdoor_mult,
        rgb_mult: data.rgb_mult,
        urgent_mult: data.urgent_mult,
        extra_line_fee: data.extra_line_fee,
        shipping_tr: data.shipping_tr,
        decoration_preset_base: data.decoration_preset_base,
        decoration_upload_base: data.decoration_upload_base,
        adapter_prices: {
          tr: data.adapter_tr,
          eu: data.adapter_eu,
          decoration_hybrid_fee: data.decoration_hybrid_fee ?? 150,
          decoration_print_only_mult: data.decoration_print_only_mult ?? 0.4,
        },
        updated_by: context.userId,
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
