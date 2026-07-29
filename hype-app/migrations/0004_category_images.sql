-- Category cover photos for the redesigned Karte catalog view: category
-- covers first, then items+prices inside. Higgsfield-generated, matched to
-- Hype's real palette/mood. Additive: ADD COLUMN + guarded UPDATE.

ALTER TABLE menu_categories ADD COLUMN image_url TEXT NOT NULL DEFAULT '';

UPDATE menu_categories SET image_url = '/assets/category-aktionen.jpg' WHERE id = 'cat-aktionen' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-longdrinks.jpg' WHERE id = 'cat-longdrinks' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-mocktails.jpg' WHERE id = 'cat-mocktails' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-cocktails.jpg' WHERE id = 'cat-cocktails' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-aperitif.jpg' WHERE id = 'cat-aperitif' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-shots.jpg' WHERE id = 'cat-shots' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-bier.jpg' WHERE id = 'cat-bier' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-wein.jpg' WHERE id = 'cat-wein' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-softdrinks.jpg' WHERE id = 'cat-softdrinks' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-fruchtsaefte.jpg' WHERE id = 'cat-fruchtsaefte' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-kaffee.jpg' WHERE id = 'cat-kaffee' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-tee.jpg' WHERE id = 'cat-tee' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-frozen.jpg' WHERE id = 'cat-frozen' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-shisha.jpg' WHERE id = 'cat-shisha' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-snacks.jpg' WHERE id = 'cat-snacks' AND image_url = '';
