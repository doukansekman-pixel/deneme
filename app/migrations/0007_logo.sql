-- Admin-editable logo: the owner can upload/paste their own real logo file
-- from the admin Ayarlar tab instead of relying on the generated one.
-- Empty by default so the app falls back to the bundled /assets/logo.png.

ALTER TABLE site_settings ADD COLUMN logo_url TEXT NOT NULL DEFAULT '';
