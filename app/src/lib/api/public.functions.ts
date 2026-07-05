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
  datenschutz_text: string;
};

export type MenuCategory = { id: string; name: string; sort_order: number };

export type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_amount: number;
  image_url: string;
  is_available: number;
  sort_order: number;
};

export type PublicMenuData = {
  settings: SiteSettings;
  categories: MenuCategory[];
  items: MenuItemRow[];
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Vype Lounge",
  tagline: "",
  about_text: "",
  address: "",
  hours: "",
  instagram_url: "",
  wifi_ssid: "",
  wifi_password: "",
  datenschutz_text: "",
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
        "SELECT id, category_id, name, description, price_amount, image_url, is_available, sort_order FROM menu_items WHERE is_available = 1 ORDER BY sort_order ASC",
      ).all<MenuItemRow>(),
    ]);

    return {
      settings: settingsRow ?? DEFAULT_SETTINGS,
      categories: categoriesResult.results ?? [],
      items: itemsResult.results ?? [],
    };
  },
);

// Public read: the Impressionen gallery photos.
export const getPublicGallery = createServerFn({ method: "GET" }).handler(
  async (): Promise<GalleryImage[]> => {
    const { DB } = bindings();
    if (!DB) return [];
    const result = await DB.prepare(
      "SELECT id, image_url, caption, sort_order FROM gallery_images ORDER BY sort_order ASC",
    ).all<GalleryImage>();
    return result.results ?? [];
  },
);
