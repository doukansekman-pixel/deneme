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
  logo_url: string;
  // Homepage content (hero + the two feature blocks + the atmosphere band) -
  // admin-editable so the owner never needs a code change to update it.
  hero_image_url: string;
  hero_subtitle: string;
  feature1_eyebrow: string;
  feature1_heading: string;
  feature1_body: string;
  feature1_image_url: string;
  feature2_eyebrow: string;
  feature2_heading: string;
  feature2_body: string;
  feature2_image_url: string;
  atmosphere_heading: string;
  atmosphere_body: string;
  atmosphere_image1_url: string;
  atmosphere_image2_url: string;
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
  site_name: "Hype Bar",
  tagline: "",
  about_text: "",
  address: "",
  hours: "",
  instagram_url: "",
  wifi_ssid: "",
  wifi_password: "",
  datenschutz_text: "",
  logo_url: "",
  hero_image_url: "/assets/hero-hype.jpg",
  hero_subtitle: "Shisha, Cocktails und Ladies Night, jeden Abend ab 16 Uhr.",
  feature1_eyebrow: "Cocktails",
  feature1_heading: "Der perfekte Drink zu deiner Shisha",
  feature1_body:
    "Vom Hype Special bis zum Cocktail zur Ladies Night, jeden Tag frisch gemixt ab Öffnung.",
  feature1_image_url: "/assets/feature1-drinks-hype.jpg",
  feature2_eyebrow: "Ambiente",
  feature2_heading: "Stilvoll und entspannt",
  feature2_body:
    "Warmes Licht, bequeme Lounge-Sitzecken und die richtige Musik für einen langen Abend.",
  feature2_image_url: "/assets/feature2-ambience-hype.jpg",
  atmosphere_heading: "Ladies Night jeden Freitag",
  atmosphere_body:
    "Shisha und Cocktail schon ab 18 Uhr für 13 Euro, jeden Freitag in der Hype Bar.",
  atmosphere_image1_url: "/assets/atmosphere1-hype.jpg",
  atmosphere_image2_url: "/assets/atmosphere2-hype.jpg",
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
