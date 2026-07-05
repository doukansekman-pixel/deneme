-- German relaunch: real venue content (Vype Lounge, Weiterstadt), EUR pricing,
-- per-item images, and a Shisha category. Additive: ADD COLUMN + UPDATE
-- existing seeded rows (0002 already inserted them) + INSERT OR IGNORE for
-- new rows. Safe to run against the shared preview/prod database.

ALTER TABLE menu_items ADD COLUMN image_url TEXT NOT NULL DEFAULT '';

UPDATE site_settings SET
  site_name = 'Vype Lounge',
  tagline = 'Shisha. Cocktails. Gute Stimmung.',
  about_text = 'Die Vype Lounge ist dein Ruhepunkt mitten in Weiterstadt: handgemachte Cocktails, entspannte Shisha-Runden und die richtige Musik, jeden Tag ab dem Nachmittag bis tief in die Nacht.',
  address = 'Darmstädter Str. 75, 64331 Weiterstadt',
  hours = 'Mo-Fr 16:00-01:00 Uhr, Sa 14:00-02:00 Uhr, So 16:00-00:00 Uhr',
  instagram_url = 'https://www.instagram.com/vype_lounge_bar/',
  updated_at = datetime('now')
WHERE id = 1;

UPDATE menu_categories SET name = 'Signature Cocktails' WHERE id = 'cat-signature';
UPDATE menu_categories SET name = 'Klassiker' WHERE id = 'cat-classic';
UPDATE menu_categories SET name = 'Alkoholfrei' WHERE id = 'cat-mocktail';
UPDATE menu_categories SET name = 'Snacks' WHERE id = 'cat-bites';

INSERT OR IGNORE INTO menu_categories (id, name, sort_order) VALUES
  ('cat-shisha', 'Shisha', 0);

UPDATE menu_items SET name = 'Vype Sour', description = 'Bourbon, Zitrone, Waldfrucht-Sirup, Eiweißschaum', price = '11,00 €', image_url = '/assets/menu-item-drinks.jpg' WHERE id = 'item-1';
UPDATE menu_items SET name = 'Rauch & Asche', description = 'Mezcal, Grapefruit, geräuchertes Salz', price = '12,00 €' WHERE id = 'item-2';
UPDATE menu_items SET name = 'Nachtspaziergang', description = 'Gin, Holunderblütenlikör, frische Gurke, Tonic', price = '11,00 €', image_url = '/assets/gallery-cocktail.jpg' WHERE id = 'item-3';
UPDATE menu_items SET description = 'Gin, roter Wermut, Campari', price = '10,00 €' WHERE id = 'item-4';
UPDATE menu_items SET description = 'Bourbon, Zucker, Angostura Bitters', price = '10,50 €' WHERE id = 'item-5';
UPDATE menu_items SET description = 'Wodka, Kaffeelikör, frischer Espresso', price = '10,50 €' WHERE id = 'item-6';
UPDATE menu_items SET name = 'Glühwürmchen', description = 'Frische Minze, Limette, Ingwer, Soda', price = '6,50 €' WHERE id = 'item-7';
UPDATE menu_items SET name = 'Kellerfrische', description = 'Hibiskus, Orange, Tonic', price = '6,50 €' WHERE id = 'item-8';
UPDATE menu_items SET name = 'Pommes Frites', description = 'Meersalz, hausgemachte Sauce', price = '6,00 €' WHERE id = 'item-9';
UPDATE menu_items SET name = 'Käseplatte', description = 'Saisonale Käsesorten, Honig, Walnüsse', price = '9,50 €' WHERE id = 'item-10';

INSERT OR IGNORE INTO menu_items (id, category_id, name, description, price, image_url, sort_order) VALUES
  ('item-shisha-1', 'cat-shisha', 'Doppelapfel', 'Klassische Doppelapfel-Mischung', '16,00 €', '/assets/gallery-shisha-prep.jpg', 1),
  ('item-shisha-2', 'cat-shisha', 'Blue Mist', 'Blaubeere, frische Minze', '16,00 €', '', 2),
  ('item-shisha-3', 'cat-shisha', 'Wassermelone Minze', 'Frisch und kühl', '16,00 €', '', 3),
  ('item-shisha-4', 'cat-shisha', 'Traube Minze', 'Süß und erfrischend', '16,00 €', '', 4);
