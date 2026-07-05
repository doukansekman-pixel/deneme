import { createServerFn } from "@tanstack/react-start";

import { bindings } from "../bindings.server";

export type SiteSettings = {
  site_name: string;
  tagline: string;
  about_text: string;
  address: string;
  hours: string;
  instagram_url: string;
  wifi_ssid: string;
  wifi_password: string;
};

export type MenuCategory = { id: string; name: string; sort_order: number };

export type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  is_available: number;
  sort_order: number;
};

export type PublicMenuData = {
  settings: SiteSettings;
  categories: MenuCategory[];
  items: MenuItemRow[];
};

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Vype Bar",
  tagline: "",
  about_text: "",
  address: "",
  hours: "",
  instagram_url: "",
  wifi_ssid: "",
  wifi_password: "",
};

// Public read: the live menu + settings for the homepage. No auth — this is
// the guest-facing QR menu data.
export const getPublicMenuData = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicMenuData> => {
    const { DB } = bindings();
    if (!DB) {
      return { settings: DEFAULT_SETTINGS, categories: [], items: [] };
    }

    const [settingsRow, categoriesResult, itemsResult] = await Promise.all([
      DB.prepare("SELECT * FROM site_settings WHERE id = 1").first<SiteSettings>(),
      DB.prepare(
        "SELECT id, name, sort_order FROM menu_categories ORDER BY sort_order ASC",
      ).all<MenuCategory>(),
      DB.prepare(
        "SELECT id, category_id, name, description, price, is_available, sort_order FROM menu_items WHERE is_available = 1 ORDER BY sort_order ASC",
      ).all<MenuItemRow>(),
    ]);

    return {
      settings: settingsRow ?? DEFAULT_SETTINGS,
      categories: categoriesResult.results ?? [],
      items: itemsResult.results ?? [],
    };
  },
);
