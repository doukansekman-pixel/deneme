-- Impressionen gallery becomes admin-managed instead of hardcoded. Seeded
-- with the photos already shipped in the page. Also corrects the opening
-- hours to match the live vype-bar.de footer (more current than the door
-- signage used for the first draft).

CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO gallery_images (id, image_url, caption, sort_order) VALUES
  ('gal-1', '/assets/hero-lounge.jpg', 'Lounge-Bereich mit hängenden Pflanzen und warmem Licht', 1),
  ('gal-2', '/assets/gallery-interior-1.jpg', 'Sitzbereich an der Marmorbar', 2),
  ('gal-3', '/assets/gallery-shisha-prep.jpg', 'Frisch aufgesetzte Shisha an der Bar', 3),
  ('gal-4', '/assets/gallery-cocktail.jpg', 'Cocktail mit frischer Minze', 4),
  ('gal-5', '/assets/gallery-interior-2.jpg', 'Blick durch die Lounge Richtung Bar', 5),
  ('gal-6', '/assets/gallery-storefront-day.jpg', 'Eingang der Vype Lounge bei Tag', 6),
  ('gal-7', '/assets/gallery-storefront-night.jpg', 'Leuchtschrift VYPE am Eingang bei Nacht', 7);

UPDATE site_settings SET
  hours = 'Mo-Do 16:00-00:00 Uhr, Fr-Sa 16:00-01:00 Uhr, So 16:00-00:00 Uhr',
  updated_at = datetime('now')
WHERE id = 1;
