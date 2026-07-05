-- Prices become a plain number (price_amount REAL) so the admin only ever
-- types digits and the UI always appends the EUR sign. The old `price` text
-- column is kept (additive-only) but no longer read by the app.

ALTER TABLE menu_items ADD COLUMN price_amount REAL NOT NULL DEFAULT 0;

UPDATE menu_items SET price_amount = 11.00 WHERE id = 'item-1';
UPDATE menu_items SET price_amount = 12.00 WHERE id = 'item-2';
UPDATE menu_items SET price_amount = 11.00 WHERE id = 'item-3';
UPDATE menu_items SET price_amount = 10.00 WHERE id = 'item-4';
UPDATE menu_items SET price_amount = 10.50 WHERE id = 'item-5';
UPDATE menu_items SET price_amount = 10.50 WHERE id = 'item-6';
UPDATE menu_items SET price_amount = 6.50 WHERE id = 'item-7';
UPDATE menu_items SET price_amount = 6.50 WHERE id = 'item-8';
UPDATE menu_items SET price_amount = 6.00 WHERE id = 'item-9';
UPDATE menu_items SET price_amount = 9.50 WHERE id = 'item-10';
UPDATE menu_items SET price_amount = 16.00 WHERE id = 'item-shisha-1';
UPDATE menu_items SET price_amount = 16.00 WHERE id = 'item-shisha-2';
UPDATE menu_items SET price_amount = 16.00 WHERE id = 'item-shisha-3';
UPDATE menu_items SET price_amount = 16.00 WHERE id = 'item-shisha-4';
