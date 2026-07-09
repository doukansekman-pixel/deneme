-- Same fix as Vype Lounge's 0009: a few homepage text bits were still
-- hardcoded in index.tsx (not admin-editable). Additive-only, defaults
-- match the copy that was previously hardcoded.

ALTER TABLE site_settings ADD COLUMN menu_teaser_heading TEXT NOT NULL DEFAULT 'Karte';
ALTER TABLE site_settings ADD COLUMN menu_teaser_body TEXT NOT NULL DEFAULT 'Shisha, Cocktails, Snacks und mehr. Alle Preise und Beschreibungen findest du auf unserer Karte.';
ALTER TABLE site_settings ADD COLUMN menu_teaser_cta_label TEXT NOT NULL DEFAULT 'Zur Karte';
ALTER TABLE site_settings ADD COLUMN visit_heading TEXT NOT NULL DEFAULT 'Besuch uns';
ALTER TABLE site_settings ADD COLUMN feature2_cta_label TEXT NOT NULL DEFAULT 'Impressionen ansehen';
