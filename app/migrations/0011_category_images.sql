-- Category cover photos for the redesigned Karte catalog view: category
-- covers first, then items+prices inside. Higgsfield-generated, matched to
-- Vype's real palette/mood. Additive: ADD COLUMN + guarded UPDATE.

ALTER TABLE menu_categories ADD COLUMN image_url TEXT NOT NULL DEFAULT '';

UPDATE menu_categories SET image_url = '/assets/category-shisha.jpg' WHERE id = 'cat-shisha' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-signature-cocktails.jpg' WHERE id = 'cat-signature' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-klassiker.jpg' WHERE id = 'cat-classic' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-alkoholfrei.jpg' WHERE id = 'cat-mocktail' AND image_url = '';
UPDATE menu_categories SET image_url = '/assets/category-snacks.jpg' WHERE id = 'cat-bites' AND image_url = '';
