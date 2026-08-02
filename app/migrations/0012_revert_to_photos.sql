-- Revert the homepage from AI-animated videos back to static real photos
-- (0010 swapped these to .mp4 - videos turned out unreliable enough on
-- guest phones that the owner asked to go back). Guarded by the current
-- video URL so an owner who already customized these fields via admin
-- keeps their own choice. The hero uses the poster frame extracted from
-- the owner's own custom banner video (hero-lounge-poster.jpg), which is
-- the most current hero photo - not the older pre-video hero-lounge.jpg.

UPDATE site_settings SET hero_image_url = '/assets/hero-lounge-poster.jpg'
  WHERE hero_image_url = '/assets/hero-lounge.mp4';

UPDATE site_settings SET feature1_image_url = '/assets/menu-item-drinks.jpg'
  WHERE feature1_image_url = '/assets/menu-item-drinks.mp4';

UPDATE site_settings SET feature2_image_url = '/assets/gallery-interior-1.jpg'
  WHERE feature2_image_url = '/assets/gallery-interior-1.mp4';

UPDATE site_settings SET atmosphere_image1_url = '/assets/gallery-shisha-prep.jpg'
  WHERE atmosphere_image1_url = '/assets/gallery-shisha-prep.mp4';

UPDATE site_settings SET atmosphere_image2_url = '/assets/gallery-interior-2.jpg'
  WHERE atmosphere_image2_url = '/assets/gallery-interior-2.mp4';
