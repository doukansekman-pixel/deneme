-- Makes the homepage's hero + two feature blocks + atmosphere band
-- admin-editable instead of hardcoded in src/routes/index.tsx. Additive
-- only (ALTER TABLE ADD COLUMN); defaults match the copy/images that were
-- previously hardcoded, so existing rows render identically until the
-- owner edits them from /admin.

ALTER TABLE site_settings ADD COLUMN hero_image_url TEXT NOT NULL DEFAULT '/assets/hero-lounge.jpg';
ALTER TABLE site_settings ADD COLUMN hero_subtitle TEXT NOT NULL DEFAULT 'Shisha, Cocktails und die richtige Musik, jeden Tag ab dem Nachmittag.';

ALTER TABLE site_settings ADD COLUMN feature1_eyebrow TEXT NOT NULL DEFAULT 'Cocktails';
ALTER TABLE site_settings ADD COLUMN feature1_heading TEXT NOT NULL DEFAULT 'Der passende Begleiter zu jeder Shisha';
ALTER TABLE site_settings ADD COLUMN feature1_body TEXT NOT NULL DEFAULT 'Fruchtige Mocktails, klassische Softdrinks und alles dazwischen, jeden Nachmittag ab Öffnung frisch gemixt.';
ALTER TABLE site_settings ADD COLUMN feature1_image_url TEXT NOT NULL DEFAULT '/assets/menu-item-drinks.jpg';

ALTER TABLE site_settings ADD COLUMN feature2_eyebrow TEXT NOT NULL DEFAULT 'Ambiente';
ALTER TABLE site_settings ADD COLUMN feature2_heading TEXT NOT NULL DEFAULT 'Entspannte Atmosphäre';
ALTER TABLE site_settings ADD COLUMN feature2_body TEXT NOT NULL DEFAULT 'Sanftes Licht, ruhige Musik und Sitzecken, in denen man gerne länger bleibt. Aus einem kurzen Besuch wird bei uns schnell ein langer Abend.';
ALTER TABLE site_settings ADD COLUMN feature2_image_url TEXT NOT NULL DEFAULT '/assets/gallery-interior-1.jpg';

ALTER TABLE site_settings ADD COLUMN atmosphere_heading TEXT NOT NULL DEFAULT 'Wohlfühl-Lounge in Weiterstadt';
ALTER TABLE site_settings ADD COLUMN atmosphere_body TEXT NOT NULL DEFAULT 'Ob mit Freunden nach der Arbeit oder für einen ruhigen Abend zu zweit, in der Vype Lounge kommt man an und bleibt gerne.';
ALTER TABLE site_settings ADD COLUMN atmosphere_image1_url TEXT NOT NULL DEFAULT '/assets/gallery-shisha-prep.jpg';
ALTER TABLE site_settings ADD COLUMN atmosphere_image2_url TEXT NOT NULL DEFAULT '/assets/gallery-interior-2.jpg';
