-- Swap the homepage's real photos for AI-animated (real photo, subtle
-- camera motion) video versions of the same shots. Guarded by the old
-- default image URL so an owner who already customized these fields via
-- admin keeps their own choice.

UPDATE site_settings SET hero_image_url = '/assets/hero-lounge.mp4'
  WHERE hero_image_url = '/assets/hero-lounge.jpg';

UPDATE site_settings SET feature1_image_url = '/assets/menu-item-drinks.mp4'
  WHERE feature1_image_url = '/assets/menu-item-drinks.jpg';

UPDATE site_settings SET feature2_image_url = '/assets/gallery-interior-1.mp4'
  WHERE feature2_image_url = '/assets/gallery-interior-1.jpg';

UPDATE site_settings SET atmosphere_image1_url = '/assets/gallery-shisha-prep.mp4'
  WHERE atmosphere_image1_url = '/assets/gallery-shisha-prep.jpg';

UPDATE site_settings SET atmosphere_image2_url = '/assets/gallery-interior-2.mp4'
  WHERE atmosphere_image2_url = '/assets/gallery-interior-2.jpg';
