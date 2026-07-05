import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { isAdminAuthenticated } from "../auth.server";
import type { MenuCategory, MenuItemRow, SiteSettings } from "./public.functions";

class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
  }
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new UnauthorizedError();
  }
}

export const checkAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ authenticated: boolean }> => {
    return { authenticated: await isAdminAuthenticated() };
  },
);

export const adminGetAll = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { DB } = bindings();
  if (!DB) return { settings: null as SiteSettings | null, categories: [], items: [] };

  const [settingsRow, categoriesResult, itemsResult] = await Promise.all([
    DB.prepare("SELECT * FROM site_settings WHERE id = 1").first<SiteSettings>(),
    DB.prepare(
      "SELECT id, name, sort_order FROM menu_categories ORDER BY sort_order ASC",
    ).all<MenuCategory>(),
    DB.prepare(
      "SELECT id, category_id, name, description, price_amount, image_url, is_available, sort_order FROM menu_items ORDER BY sort_order ASC",
    ).all<MenuItemRow>(),
  ]);

  return {
    settings: settingsRow,
    categories: categoriesResult.results ?? [],
    items: itemsResult.results ?? [],
  };
});

const settingsSchema = z.object({
  site_name: z.string().min(1).max(120),
  tagline: z.string().max(200),
  about_text: z.string().max(2000),
  address: z.string().max(300),
  hours: z.string().max(200),
  instagram_url: z.string().max(300),
  wifi_ssid: z.string().max(100),
  wifi_password: z.string().max(100),
  datenschutz_text: z.string().max(30000),
});

export const adminUpdateSettings = createServerFn({ method: "POST" })
  .inputValidator(settingsSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    await DB.prepare(
      `UPDATE site_settings SET site_name = ?, tagline = ?, about_text = ?, address = ?, hours = ?,
       instagram_url = ?, wifi_ssid = ?, wifi_password = ?, datenschutz_text = ?, updated_at = datetime('now') WHERE id = 1`,
    )
      .bind(
        data.site_name,
        data.tagline,
        data.about_text,
        data.address,
        data.hours,
        data.instagram_url,
        data.wifi_ssid,
        data.wifi_password,
        data.datenschutz_text,
      )
      .run();
    return { ok: true as const };
  });

const idSchema = z.object({ id: z.string().min(1).max(64) });

const categoryCreateSchema = z.object({ name: z.string().min(1).max(80) });

export const adminCreateCategory = createServerFn({ method: "POST" })
  .inputValidator(categoryCreateSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    const id = crypto.randomUUID();
    const maxRow = await DB.prepare(
      "SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM menu_categories",
    ).first<{ max_order: number }>();
    const sortOrder = (maxRow?.max_order ?? 0) + 1;
    await DB.prepare("INSERT INTO menu_categories (id, name, sort_order) VALUES (?, ?, ?)")
      .bind(id, data.name, sortOrder)
      .run();
    return { ok: true as const, id };
  });

const categoryUpdateSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(80),
  sort_order: z.number().int(),
});

export const adminUpdateCategory = createServerFn({ method: "POST" })
  .inputValidator(categoryUpdateSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    await DB.prepare("UPDATE menu_categories SET name = ?, sort_order = ? WHERE id = ?")
      .bind(data.name, data.sort_order, data.id)
      .run();
    return { ok: true as const };
  });

export const adminDeleteCategory = createServerFn({ method: "POST" })
  .inputValidator(idSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    await DB.prepare("DELETE FROM menu_items WHERE category_id = ?").bind(data.id).run();
    await DB.prepare("DELETE FROM menu_categories WHERE id = ?").bind(data.id).run();
    return { ok: true as const };
  });

const imageUrlSchema = z
  .string()
  .max(500)
  .refine(
    (v) => v === "" || v.startsWith("/") || v.startsWith("https://") || v.startsWith("http://"),
    "invalid_image_url",
  );

const priceAmountSchema = z.number().nonnegative().max(9999);

const itemCreateSchema = z.object({
  category_id: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  description: z.string().max(400),
  price_amount: priceAmountSchema,
  image_url: imageUrlSchema,
  is_available: z.boolean(),
});

export const adminCreateItem = createServerFn({ method: "POST" })
  .inputValidator(itemCreateSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    const id = crypto.randomUUID();
    const maxRow = await DB.prepare(
      "SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM menu_items WHERE category_id = ?",
    )
      .bind(data.category_id)
      .first<{ max_order: number }>();
    const sortOrder = (maxRow?.max_order ?? 0) + 1;
    await DB.prepare(
      "INSERT INTO menu_items (id, category_id, name, description, price_amount, image_url, is_available, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        id,
        data.category_id,
        data.name,
        data.description,
        data.price_amount,
        data.image_url,
        data.is_available ? 1 : 0,
        sortOrder,
      )
      .run();
    return { ok: true as const, id };
  });

const itemUpdateSchema = z.object({
  id: z.string().min(1).max(64),
  category_id: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  description: z.string().max(400),
  price_amount: priceAmountSchema,
  image_url: imageUrlSchema,
  is_available: z.boolean(),
  sort_order: z.number().int(),
});

export const adminUpdateItem = createServerFn({ method: "POST" })
  .inputValidator(itemUpdateSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    await DB.prepare(
      "UPDATE menu_items SET category_id = ?, name = ?, description = ?, price_amount = ?, image_url = ?, is_available = ?, sort_order = ? WHERE id = ?",
    )
      .bind(
        data.category_id,
        data.name,
        data.description,
        data.price_amount,
        data.image_url,
        data.is_available ? 1 : 0,
        data.sort_order,
        data.id,
      )
      .run();
    return { ok: true as const };
  });

export const adminDeleteItem = createServerFn({ method: "POST" })
  .inputValidator(idSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { DB } = bindings();
    if (!DB) throw new Error("db_unavailable");
    await DB.prepare("DELETE FROM menu_items WHERE id = ?").bind(data.id).run();
    return { ok: true as const };
  });
