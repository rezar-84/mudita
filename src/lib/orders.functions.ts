import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const configSchema = z.record(z.string(), z.unknown());

const orderItemSchema = z.object({
  config: configSchema,
  price_try: z.number().int().min(0),
  breakdown: z.record(z.string(), z.unknown()),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        subtotal_try: z.number().int().min(0),
        shipping_try: z.number().int().min(0),
        total_try: z.number().int().min(0),
        contact: z.object({
          name: z.string().min(1).max(120),
          email: z.string().email().max(255),
          phone: z.string().min(4).max(40).optional(),
          address: z.string().max(500).optional(),
        }),
        notes: z.string().max(1000).optional(),
        items: z.array(orderItemSchema).min(1).max(20),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .insert({
        user_id: context.userId,
        subtotal_try: data.subtotal_try,
        shipping_try: data.shipping_try,
        total_try: data.total_try,
        contact: data.contact as never,
        notes: data.notes,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const { error: itemsError } = await context.supabase.from("order_items").insert(
      data.items.map((it) => ({
        order_id: order.id,
        config: it.config as never,
        price_try: it.price_try,
        breakdown: it.breakdown as never,
      }))
    );
    if (itemsError) throw new Error(itemsError.message);
    return { id: order.id };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, status, total_try, created_at, contact")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .select("id, status, subtotal_try, shipping_try, total_try, contact, notes, created_at")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Not found");
    const { data: items } = await context.supabase
      .from("order_items")
      .select("id, config, price_try, breakdown")
      .eq("order_id", order.id);
    return { order, items: items ?? [] };
  });

// -------------------- Admin ------------------

async function assertAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, user_id, status, total_try, contact, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "producing", "shipped", "delivered", "cancelled"]),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const roleMap = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    }
    return data.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      roles: roleMap.get(u.id) ?? [],
    }));
  });

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["admin", "customer"]),
        grant: z.boolean(),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      await supabaseAdmin.from("user_roles").upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role" });
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    return { ok: true };
  });

// -------------------- Gallery (admin) ------------------

export const adminListGallery = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("gallery_items")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        slug: z.string().min(1).max(80),
        title: z.string().min(1).max(200),
        text: z.string().max(200).optional(),
        font_id: z.string().max(80).optional(),
        color_id: z.string().max(80).optional(),
        image_url: z.string().url().optional().or(z.literal("")),
        tags: z.array(z.string().max(40)).max(20).optional(),
        published: z.boolean().default(true),
        sort: z.number().int().default(0),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const row = {
      slug: data.slug,
      title: data.title,
      text: data.text,
      font_id: data.font_id,
      color_id: data.color_id,
      image_url: data.image_url || null,
      tags: data.tags ?? [],
      published: data.published,
      sort: data.sort,
    };
    if (data.id) {
      const { error } = await context.supabase.from("gallery_items").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("gallery_items").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("gallery_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------------------- Analytics ------------------

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [ordersRes, usersCountRes, eventsRes] = await Promise.all([
      context.supabase.from("orders").select("status, total_try, created_at"),
      context.supabase.from("profiles").select("id", { count: "exact", head: true }),
      context.supabase.from("design_events").select("event").limit(5000),
    ]);
    const orders = ordersRes.data ?? [];
    const totalRevenue = orders.reduce((s, o) => s + (o.total_try ?? 0), 0);
    const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {});
    const eventCounts = (eventsRes.data ?? []).reduce<Record<string, number>>((acc, e) => {
      acc[e.event] = (acc[e.event] ?? 0) + 1;
      return acc;
    }, {});
    return {
      orderCount: orders.length,
      totalRevenue,
      byStatus,
      userCount: usersCountRes.count ?? 0,
      eventCounts,
    };
  });

export const isAdminCheck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: !!data };
  });
