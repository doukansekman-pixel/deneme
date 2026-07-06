-- Hype Bar (Stadtallendorf) - single init migration. This is a fresh
-- instance (own SQLite file, own volume), so the full final schema is
-- written directly here instead of replaying Vype Lounge's incremental
-- history. Content: real facts scraped from hype-bar.de where available
-- (address, hours, Instagram, real promotions, verbatim Datenschutz text);
-- the full a-la-carte menu wasn't reachable (Wix JS widget, not in the
-- static page) so it ships as a small starter menu anchored on the two
-- confirmed real promotions - the owner completes it from /admin, same as
-- Vype Lounge's own launch.

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'Hype Bar',
  tagline TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  hours TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  wifi_ssid TEXT NOT NULL DEFAULT '',
  wifi_password TEXT NOT NULL DEFAULT '',
  datenschutz_text TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT NOT NULL DEFAULT '/assets/hero-hype.jpg',
  hero_subtitle TEXT NOT NULL DEFAULT 'Shisha, Cocktails und Ladies Night, jeden Abend ab 16 Uhr.',
  feature1_eyebrow TEXT NOT NULL DEFAULT 'Cocktails',
  feature1_heading TEXT NOT NULL DEFAULT 'Der perfekte Drink zu deiner Shisha',
  feature1_body TEXT NOT NULL DEFAULT 'Vom Hype Special bis zum Cocktail zur Ladies Night, jeden Tag frisch gemixt ab Öffnung.',
  feature1_image_url TEXT NOT NULL DEFAULT '/assets/feature1-drinks-hype.jpg',
  feature2_eyebrow TEXT NOT NULL DEFAULT 'Ambiente',
  feature2_heading TEXT NOT NULL DEFAULT 'Stilvoll und entspannt',
  feature2_body TEXT NOT NULL DEFAULT 'Warmes Licht, bequeme Lounge-Sitzecken und die richtige Musik für einen langen Abend.',
  feature2_image_url TEXT NOT NULL DEFAULT '/assets/feature2-ambience-hype.jpg',
  atmosphere_heading TEXT NOT NULL DEFAULT 'Ladies Night jeden Freitag',
  atmosphere_body TEXT NOT NULL DEFAULT 'Shisha und Cocktail schon ab 18 Uhr für 13 Euro, jeden Freitag in der Hype Bar.',
  atmosphere_image1_url TEXT NOT NULL DEFAULT '/assets/atmosphere1-hype.jpg',
  atmosphere_image2_url TEXT NOT NULL DEFAULT '/assets/atmosphere2-hype.jpg',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_settings (
  id, site_name, tagline, about_text, address, hours, instagram_url, datenschutz_text
) VALUES (
  1,
  'Hype Bar',
  'Shisha, Cocktails und die beste Stimmung in Stadtallendorf.',
  'Die Hype Bar ist der Treffpunkt in Stadtallendorf für entspannte Shisha-Runden und handgemachte Cocktails. Jeden Freitag Ladies Night (Shisha & Cocktail ab 18 Uhr für 13 €) und täglich das Hype Special (Shisha mit Softdrink, 16-19 Uhr für 10 €).',
  'Niederkleiner Str. 44, 35260 Stadtallendorf',
  'So-Do 16:00-02:00 Uhr, Fr-Sa 16:00-03:00 Uhr',
  'https://www.instagram.com/hype_bar_lounge/',
  'Datenschutz

1. Datenschutz auf einen Blick

Allgemeine Hinweise
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.

Wer ist verantwortlich für die Datenerfassung auf dieser Website?
Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber (Kontaktdaten siehe Impressum).

Wie erfassen wir Ihre Daten?
Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen, etwa über ein Kontaktformular. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.

Wofür nutzen wir Ihre Daten?
Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.

Welche Rechte haben Sie bezüglich Ihrer Daten?
Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an die im Impressum angegebene Adresse wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.

Analyse-Tools von Drittanbietern
Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonymisiert; das Surf-Verhalten kann nicht zu Ihnen zurückverfolgt werden. Sie können dieser Analyse widersprechen oder sie durch die Nichtbenutzung bestimmter Tools verhindern. Detaillierte Informationen dazu finden Sie in der folgenden Datenschutzerklärung.

2. Allgemeine Hinweise und Pflichtinformationen

Datenschutz
Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Wir weisen darauf hin, dass die Datenübertragung im Internet Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.

Hinweis zur verantwortlichen Stelle
Die verantwortliche Stelle entscheidet allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten.

Widerruf Ihrer Einwilligung zur Datenverarbeitung
Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.

Recht auf Datenübertragbarkeit
Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.

SSL- bzw. TLS-Verschlüsselung
Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.

Auskunft, Sperrung, Löschung
Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.

Widerspruch gegen Werbe-E-Mails
Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen.

3. Datenerfassung auf unserer Website

Cookies
Die Internetseiten verwenden teilweise so genannte Cookies. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.

Server-Log-Dateien
Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO.

Kontaktformular
Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt.

4. Analyse-Tools und Werbung

Google Analytics
Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Google Analytics verwendet so genannte "Cookies". Die Speicherung von Google-Analytics-Cookies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.

IP-Anonymisierung
Wir haben auf dieser Website die Funktion IP-Anonymisierung aktiviert. Ihre IP-Adresse wird von Google innerhalb von Mitgliedstaaten der EU oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt.

Google AdWords und Google Conversion-Tracking, Facebook Pixel
Diese Website verwendet Google AdWords sowie das Besucheraktions-Pixel von Facebook, Facebook Inc., 1601 S. California Ave, Palo Alto, CA 94304, USA, zur Konversionsmessung und zur Bewerbung unserer Angebote. Näheres zum Umgang mit Nutzerdaten finden Sie in den jeweiligen Datenschutzerklärungen von Google und Facebook.

5. Plugins und Tools

YouTube, Vimeo
Unsere Website nutzt Plugins der von Google betriebenen Seite YouTube sowie des Videoportals Vimeo. Beim Besuch einer entsprechend ausgestatteten Seite wird eine Verbindung zu den jeweiligen Servern hergestellt.

Google Web Fonts
Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts, die von Google bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Web Fonts in ihren Browsercache, um Texte und Schriftarten korrekt anzuzeigen.

Google Maps
Diese Seite nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und an einer leichten Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.

Kontakt
Hype Bar Stadtallendorf
Niederkleiner Str. 44
35260 Stadtallendorf'
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES menu_categories(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  price_amount REAL NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  is_available INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO menu_categories (id, name, sort_order) VALUES
  ('cat-aktionen', 'Aktionen', 0),
  ('cat-shisha', 'Shisha', 1),
  ('cat-cocktails', 'Cocktails', 2),
  ('cat-snacks', 'Snacks', 3);

INSERT OR IGNORE INTO menu_items (id, category_id, name, description, price_amount, image_url, sort_order) VALUES
  ('item-ladies-night', 'cat-aktionen', 'Ladies Night', 'Shisha und Cocktail, jeden Freitag ab 18:00 Uhr', 13.00, '/assets/atmosphere1-hype.jpg', 1),
  ('item-hype-special', 'cat-aktionen', 'Hype Special', 'Shisha mit Softdrink, täglich 16:00-19:00 Uhr', 10.00, '', 2),
  ('item-shisha-1', 'cat-shisha', 'Shisha nach Wahl', 'Verschiedene Tabaksorten, frag unser Team', 16.00, '', 1),
  ('item-cocktail-1', 'cat-cocktails', 'Cocktail nach Wahl', 'Klassiker und hausgemachte Kreationen', 9.00, '/assets/feature1-drinks-hype.jpg', 1),
  ('item-snack-1', 'cat-snacks', 'Snackteller', 'Kleine Auswahl zum Teilen', 6.00, '', 1);

CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO gallery_images (id, image_url, caption, sort_order) VALUES
  ('gal-1', '/assets/hero-hype.jpg', 'Bar-Bereich der Hype Bar', 1),
  ('gal-2', '/assets/feature1-drinks-hype.jpg', 'Cocktail an der Bar', 2),
  ('gal-3', '/assets/feature2-ambience-hype.jpg', 'Lounge-Sitzecke', 3),
  ('gal-4', '/assets/atmosphere1-hype.jpg', 'Shisha und Cocktail', 4),
  ('gal-5', '/assets/atmosphere2-hype.jpg', 'An der Bar', 5);
