-- The owner renamed/reorganized the menu categories via the admin panel
-- into a different (English-named) set after 0011 shipped, so most of
-- these never got a cover photo. Matched by exact current name rather than
-- the old `cat-*` ids, since admin-created/renamed rows use random ids.
-- Guarded by empty image_url so an owner-set image isn't overwritten.

UPDATE menu_categories SET image_url = '/assets/category-softdrinks-en.jpg'
  WHERE name = 'Soft Drinks' AND image_url = '';

UPDATE menu_categories SET image_url = '/assets/category-lemonade.jpg'
  WHERE name = 'Homemade Lemonade' AND image_url = '';

UPDATE menu_categories SET image_url = '/assets/category-juices.jpg'
  WHERE name = 'Juices' AND image_url = '';

UPDATE menu_categories SET image_url = '/assets/category-hotcoffee.jpg'
  WHERE name = 'Hot Coffee' AND image_url = '';

UPDATE menu_categories SET image_url = '/assets/category-teatime.jpg'
  WHERE name = 'Tea Time' AND image_url = '';

UPDATE menu_categories SET image_url = '/assets/category-hookah.jpg'
  WHERE name = 'Hookah' AND image_url = '';
