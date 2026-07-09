-- Replace the placeholder starter menu with the real Hype Bar menu
-- (transcribed from hype-bar.de/shisha-drinks). Keeps the two real
-- "Aktionen" promo items as-is.

DELETE FROM menu_items WHERE id IN ('item-shisha-1', 'item-cocktail-1', 'item-snack-1');
DELETE FROM menu_categories WHERE id IN ('cat-shisha', 'cat-cocktails', 'cat-snacks');

INSERT OR IGNORE INTO menu_categories (id, name, sort_order) VALUES
  ('cat-longdrinks', 'Longdrinks', 1),
  ('cat-mocktails', 'Mocktails', 2),
  ('cat-cocktails', 'Cocktails', 3),
  ('cat-aperitif', 'Aperitif', 4),
  ('cat-shots', 'Shots', 5),
  ('cat-bier', 'Bier', 6),
  ('cat-wein', 'Wein', 7),
  ('cat-softdrinks', 'Softdrinks', 8),
  ('cat-fruchtsaefte', 'Fruchtsäfte', 9),
  ('cat-kaffee', 'Kaffee', 10),
  ('cat-tee', 'Tee', 11),
  ('cat-frozen', 'Frozen', 12),
  ('cat-shisha', 'Shisha', 13),
  ('cat-snacks', 'Snacks', 14);

INSERT OR IGNORE INTO menu_items (id, category_id, name, description, price_amount, image_url, sort_order) VALUES
  ('item-ld-1', 'cat-longdrinks', 'Gin Tonic Wildberry', 'Tanqueray Gin · Schweppes Tonic / Tanqueray Gin · Schweppes Wildberry', 6.00, '', 1),
  ('item-ld-2', 'cat-longdrinks', 'Gin Tonic', 'Tanqueray Gin · Schweppes Tonic', 6.00, '', 2),
  ('item-ld-3', 'cat-longdrinks', 'Whiskey Cola / Ginger Ale', 'Gentlemen Jack · Afri Cola / Gentlemen Jack · Schweppes Ginger Ale', 6.00, '', 3),
  ('item-ld-4', 'cat-longdrinks', 'Vodka Lemon / Red Bull', 'Ketel One Vodka · Schweppes Bitter Lemon / Ketel One Vodka · Red Bull', 6.00, '', 4),
  ('item-ld-5', 'cat-longdrinks', 'Vodka Soda', 'Ketel One Vodka · Soda · Limettensaft', 6.00, '', 5),
  ('item-ld-6', 'cat-longdrinks', 'Vodka Bitter Lemon / Red Bull', 'Ketel One Vodka · Schweppes Bitter Lemon oder Red Bull', 6.00, '', 6),
  ('item-ld-7', 'cat-longdrinks', 'Jägermeister Red Bull / Cola', '', 6.00, '', 7),

  ('item-mock-1', 'cat-mocktails', 'Ipanema', 'Schweppes Ginger Ale, brauner Rohrzucker, Maracujasaft & Limetten', 5.90, '', 1),
  ('item-mock-2', 'cat-mocktails', 'Virgin Sunrise', 'Orangensaft, Ananassaft, Zitronensaft & Grenadine', 5.90, '', 2),

  ('item-ck-1', 'cat-cocktails', 'Long Island Iced Tea', 'Three Sixty Vodka, Havana Club Rum, Bombay Sapphire Gin, Triple Sec, Rohrzuckersirup, Zitronensaft & Cola', 9.90, '/assets/feature1-drinks-hype.jpg', 1),
  ('item-ck-2', 'cat-cocktails', 'Mojito', 'Plantation 3 Stars Rum · Soda · Limettensaft · Minze · Rohrzucker', 7.90, '', 2),
  ('item-ck-3', 'cat-cocktails', 'Caipirinha', 'Cachaça · Limettensaft · Rohrzucker', 7.90, '', 3),
  ('item-ck-4', 'cat-cocktails', 'Cuba Libre', 'Plantation 3 Stars Rum · Afri Cola · Limettensaft', 7.90, '', 4),
  ('item-ck-5', 'cat-cocktails', 'Piña Colada', 'Havana Club Rum · Ananassaft · Kokosnusscreme · Sahne', 7.90, '', 5),
  ('item-ck-6', 'cat-cocktails', 'Sex on the Beach', 'Ketel One Vodka · Pfirsichlikör · Cranberrysirup · Orangensaft', 7.90, '', 6),
  ('item-ck-7', 'cat-cocktails', 'Swimming Pool', 'Ketel One Vodka · Blue Curaçao · Ananassaft · Kokosnusscreme · Sahne', 7.90, '', 7),

  ('item-ap-1', 'cat-aperitif', 'Lillet Wildberry', 'Lillet · Schweppes · Wildberry', 5.90, '', 1),
  ('item-ap-2', 'cat-aperitif', 'Aperol Spritz', 'Cremant · Aperol · Orange', 5.90, '', 2),
  ('item-ap-3', 'cat-aperitif', 'Hugo', 'Cremant · Holundersirup · Limettensaft · Minze', 5.90, '', 3),

  ('item-shot-1', 'cat-shots', 'Jägermeister', '', 3.00, '', 1),
  ('item-shot-2', 'cat-shots', 'Tequila', '', 3.00, '', 2),

  ('item-beer-1', 'cat-bier', 'Desperados', '', 4.00, '', 1),
  ('item-beer-2', 'cat-bier', 'Corona', '', 4.00, '', 2),
  ('item-beer-3', 'cat-bier', 'Heineken', '', 3.00, '', 3),

  ('item-wine-1', 'cat-wein', 'Weißwein', '', 7.00, '', 1),
  ('item-wine-2', 'cat-wein', 'Rosé', '', 7.00, '', 2),
  ('item-wine-3', 'cat-wein', 'Rotwein', '', 7.00, '', 3),

  ('item-soft-1', 'cat-softdrinks', 'Wasser 0,2l', '', 2.60, '', 1),
  ('item-soft-2', 'cat-softdrinks', 'Wasser Sparkling / Still 0,75l', '', 4.90, '', 2),
  ('item-soft-3', 'cat-softdrinks', 'Afri Cola / Afri Cola Light 0,2l', '', 2.90, '', 3),
  ('item-soft-4', 'cat-softdrinks', 'Bluna Orange / Lemon 0,2l', '', 2.90, '', 4),
  ('item-soft-5', 'cat-softdrinks', 'Red Bull / Red Bull Zero 0,25l', '', 4.00, '', 5),
  ('item-soft-6', 'cat-softdrinks', 'Red Bull Editions 0,25l', 'White, Blue, Yellow oder Purple', 4.00, '', 6),
  ('item-soft-7', 'cat-softdrinks', '28 Black Energy 0,25l', '', 4.00, '', 7),
  ('item-soft-8', 'cat-softdrinks', 'Moloko 0,25l', '', 4.00, '', 8),
  ('item-soft-9', 'cat-softdrinks', 'Trade Islands Iced Tea 0,33l', 'Blueberry, Lemon-Lime oder Sunny Peach', 4.00, '', 9),
  ('item-soft-10', 'cat-softdrinks', 'Schweppes Tonic Water 0,2l', '', 2.90, '', 10),
  ('item-soft-11', 'cat-softdrinks', 'Schweppes Bitter Lemon 0,2l', '', 2.90, '', 11),
  ('item-soft-12', 'cat-softdrinks', 'Schweppes Ginger Ale 0,2l', '', 2.90, '', 12),

  ('item-juice-1', 'cat-fruchtsaefte', 'Rapp''s Orangensaft 0,4l', '', 4.00, '', 1),
  ('item-juice-2', 'cat-fruchtsaefte', 'Rapp''s Maracujasaft 0,4l', '', 4.00, '', 2),
  ('item-juice-3', 'cat-fruchtsaefte', 'Rapp''s Ananassaft 0,4l', '', 4.00, '', 3),
  ('item-juice-4', 'cat-fruchtsaefte', 'Rapp''s Bananensaft 0,4l', '', 4.00, '', 4),
  ('item-juice-5', 'cat-fruchtsaefte', 'Rapp''s Kirschsaft 0,4l', '', 4.00, '', 5),
  ('item-juice-6', 'cat-fruchtsaefte', 'Kiba 0,4l', '', 4.50, '', 6),

  ('item-coffee-1', 'cat-kaffee', 'Espresso', '', 1.80, '', 1),
  ('item-coffee-2', 'cat-kaffee', 'Espresso Doppio', '', 3.00, '', 2),
  ('item-coffee-3', 'cat-kaffee', 'Café Crème', '', 2.20, '', 3),
  ('item-coffee-4', 'cat-kaffee', 'Cappuccino', '', 3.00, '', 4),
  ('item-coffee-5', 'cat-kaffee', 'Flat White', '', 2.90, '', 5),
  ('item-coffee-6', 'cat-kaffee', 'Ice Coffee', '', 4.60, '', 6),
  ('item-coffee-7', 'cat-kaffee', 'Nescoffee Delgano', '', 4.80, '', 7),

  ('item-tea-1', 'cat-tee', 'Schwarzer Tee', 'Royal Earl Grey', 2.50, '', 1),
  ('item-tea-2', 'cat-tee', 'Grüner Tee', 'Jasmine Ting Yuan', 2.50, '', 2),
  ('item-tea-3', 'cat-tee', 'Früchtetee', 'Strawberry Flip / Red Fruit Flash', 2.50, '', 3),
  ('item-tea-4', 'cat-tee', 'Kräutertee', 'Fancy Camomile / Rooibush Strawberry Cream', 2.50, '', 4),

  ('item-frozen-1', 'cat-frozen', 'Frozen Erdbeere', '', 5.90, '', 1),
  ('item-frozen-2', 'cat-frozen', 'Frozen Wassermelone', '', 5.90, '', 2),
  ('item-frozen-3', 'cat-frozen', 'Frozen Banane', '', 5.90, '', 3),

  ('item-shisha-1', 'cat-shisha', 'Shisha African Queen', '', 10.00, '/assets/atmosphere2-hype.jpg', 1),
  ('item-shisha-2', 'cat-shisha', 'Shisha Wildberry Chill', '', 10.00, '', 2),
  ('item-shisha-3', 'cat-shisha', 'Shisha Lemon Chill', '', 10.00, '', 3),
  ('item-shisha-4', 'cat-shisha', 'Shisha Birne', '', 10.00, '', 4),
  ('item-shisha-5', 'cat-shisha', 'Shisha Ice Kaktuz', '', 10.00, '', 5),
  ('item-shisha-6', 'cat-shisha', 'Shisha Kiwi Punch', '', 10.00, '', 6),
  ('item-shisha-7', 'cat-shisha', 'Shisha Rasporn', '', 10.00, '', 7),
  ('item-shisha-8', 'cat-shisha', 'Shisha Ananas', '', 10.00, '', 8),
  ('item-shisha-9', 'cat-shisha', 'Shisha Eisbonbon', '', 10.00, '', 9),
  ('item-shisha-10', 'cat-shisha', 'Shisha Drachenfrucht', '', 10.00, '', 10),
  ('item-shisha-11', 'cat-shisha', 'Shisha Kaktusfeige', '', 10.00, '', 11),
  ('item-shisha-12', 'cat-shisha', 'Shisha Black Nana', '', 10.00, '', 12),
  ('item-shisha-13', 'cat-shisha', 'Shisha Traube-Minze', '', 10.00, '', 13),
  ('item-shisha-14', 'cat-shisha', 'Shisha Orange-Minze', '', 10.00, '', 14),
  ('item-shisha-15', 'cat-shisha', 'Shisha Limette-Minze', '', 10.00, '', 15),

  ('item-snack-1', 'cat-snacks', 'Nachos', 'Mit Salsa oder Käsedip · Extra Dip +0,50', 5.60, '', 1);
