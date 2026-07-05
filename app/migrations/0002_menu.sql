-- Vype Bar: site settings (single row) + menu categories/items.
-- Additive only (CREATE TABLE IF NOT EXISTS / INSERT OR IGNORE) — this D1
-- database is shared by preview and production.

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'Vype Bar',
  tagline TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  hours TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  wifi_ssid TEXT NOT NULL DEFAULT '',
  wifi_password TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_settings
  (id, site_name, tagline, about_text, address, hours, instagram_url, wifi_ssid, wifi_password)
VALUES (
  1,
  'Vype Bar',
  'Kokteyl. Müzik. Gece.',
  'Şehrin merkezinde, gün batımından gün doğumuna kadar özenle hazırlanmış kokteyller ve seçme müzikler sunuyoruz. Her masa, her kadeh özenle hazırlanır.',
  'Örnek Mahallesi, Kokteyl Sokak No:1, İstanbul',
  'Her gün 18:00 - 02:00',
  '',
  '',
  ''
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES menu_categories(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  is_available INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO menu_categories (id, name, sort_order) VALUES
  ('cat-signature', 'İmza Kokteyller', 1),
  ('cat-classic', 'Klasikler', 2),
  ('cat-mocktail', 'Alkolsüz', 3),
  ('cat-bites', 'Atıştırmalıklar', 4);

INSERT OR IGNORE INTO menu_items (id, category_id, name, description, price, sort_order) VALUES
  ('item-1', 'cat-signature', 'Vype Sour', 'Bourbon, limon, kırmızı meyve şurubu, yumurta akı köpüğü', '₺320', 1),
  ('item-2', 'cat-signature', 'Duman ve Kül', 'Mezcal, greyfurt, tütsülenmiş tuz', '₺340', 2),
  ('item-3', 'cat-signature', 'Gece Yürüyüşü', 'Cin, mürver çiçeği likörü, taze salatalık, tonik', '₺310', 3),
  ('item-4', 'cat-classic', 'Negroni', 'Cin, kırmızı vermut, Campari', '₺290', 1),
  ('item-5', 'cat-classic', 'Old Fashioned', 'Bourbon, şeker, Angostura bitters', '₺300', 2),
  ('item-6', 'cat-classic', 'Espresso Martini', 'Votka, kahve likörü, taze espresso', '₺300', 3),
  ('item-7', 'cat-mocktail', 'Ateşböceği', 'Taze nane, lime, zencefil, soda', '₺180', 1),
  ('item-8', 'cat-mocktail', 'Mahzen Ferahlığı', 'Hibiskus, portakal, tonik', '₺180', 2),
  ('item-9', 'cat-bites', 'Patates Kızartması', 'Deniz tuzu, ev yapımı sos', '₺160', 1),
  ('item-10', 'cat-bites', 'Peynir Tabağı', 'Mevsim peynirleri, bal, ceviz', '₺280', 2);
