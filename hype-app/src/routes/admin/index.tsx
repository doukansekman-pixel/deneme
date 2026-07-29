import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import {
  adminAddGalleryImage,
  adminCreateCategory,
  adminCreateItem,
  adminDeleteCategory,
  adminDeleteGalleryImage,
  adminDeleteItem,
  adminGetAll,
  adminUpdateCategory,
  adminUpdateItem,
  adminUpdateSettings,
  checkAdminSession,
} from "../../lib/api/admin.functions";
import type { GalleryImage, MenuCategory, MenuItemRow, SiteSettings } from "../../lib/api/public.functions";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminSession();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  loader: () => adminGetAll(),
  head: () => ({
    meta: [{ title: "Verwaltung - Hype Bar" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboard,
});

const EMPTY_SETTINGS: SiteSettings = {
  site_name: "",
  tagline: "",
  about_text: "",
  address: "",
  hours: "",
  instagram_url: "",
  wifi_ssid: "",
  wifi_password: "",
  datenschutz_text: "",
  logo_url: "",
  hero_image_url: "",
  hero_subtitle: "",
  feature1_eyebrow: "",
  feature1_heading: "",
  feature1_body: "",
  feature1_image_url: "",
  feature2_eyebrow: "",
  feature2_heading: "",
  feature2_body: "",
  feature2_image_url: "",
  atmosphere_heading: "",
  atmosphere_body: "",
  atmosphere_image1_url: "",
  atmosphere_image2_url: "",
  menu_teaser_heading: "",
  menu_teaser_body: "",
  menu_teaser_cta_label: "",
  visit_heading: "",
  feature2_cta_label: "",
};

const TABS = [
  { id: "settings", label: "Einstellungen" },
  { id: "homepage", label: "Startseite" },
  { id: "menu", label: "Menü" },
  { id: "gallery", label: "Galerie" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function AdminDashboard() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("settings");
  // Lifted up (not local to each form) so switching between "Einstellungen" and
  // "Startseite" never loses unsaved edits, and both tabs save through the
  // same adminUpdateSettings call - the backend always writes the full row.
  const [settings, setSettings] = useState<SiteSettings>(data.settings ?? EMPTY_SETTINGS);

  async function onAuthError(error: unknown) {
    if (error instanceof Error && error.message.includes("unauthorized")) {
      await navigate({ to: "/admin/login" });
      return true;
    }
    return false;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    await navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-dvh bg-vb-bg font-vb-display text-vb-text">
      <header className="flex items-center justify-between border-b border-vb-border px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight">Hype Bar Verwaltung</h1>
        <div className="flex items-center gap-6 text-sm">
          <a href="/" target="_blank" rel="noreferrer" className="text-vb-text-secondary hover:text-vb-text">
            Website ansehen
          </a>
          <button onClick={logout} className="text-vb-text-secondary hover:text-vb-accent">
            Abmelden
          </button>
        </div>
      </header>

      <nav className="flex gap-2 border-b border-vb-border px-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-3 py-3 text-sm transition-colors ${
              tab === t.id
                ? "border-vb-accent text-vb-text"
                : "border-transparent text-vb-text-secondary hover:text-vb-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {tab === "settings" ? (
          <SettingsForm
            settings={settings}
            setSettings={setSettings}
            onAuthError={onAuthError}
            onSaved={() => router.invalidate()}
          />
        ) : null}
        {tab === "homepage" ? (
          <HomepageContentForm
            settings={settings}
            setSettings={setSettings}
            onAuthError={onAuthError}
            onSaved={() => router.invalidate()}
          />
        ) : null}
        {tab === "menu" ? (
          <div className="space-y-16">
            <CategoriesSection
              categories={data.categories}
              onAuthError={onAuthError}
              onChanged={() => router.invalidate()}
            />
            <ItemsSection
              categories={data.categories}
              items={data.items}
              onAuthError={onAuthError}
              onChanged={() => router.invalidate()}
            />
          </div>
        ) : null}
        {tab === "gallery" ? (
          <GallerySection
            images={data.gallery}
            onAuthError={onAuthError}
            onChanged={() => router.invalidate()}
          />
        ) : null}
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.15em] text-vb-text-secondary">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full border border-vb-border bg-vb-bg-secondary px-3 py-2 text-sm text-vb-text outline-none focus:border-vb-accent";

function SettingsForm({
  settings,
  setSettings,
  onAuthError,
  onSaved,
}: {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  onAuthError: (error: unknown) => Promise<boolean>;
  onSaved: () => void;
}) {
  const form = settings;
  const setForm = setSettings;
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);

  async function save() {
    setStatus("saving");
    try {
      await adminUpdateSettings({ data: form });
      setStatus("saved");
      onSaved();
    } catch (error) {
      if (await onAuthError(error)) return;
      setStatus("error");
    }
  }

  async function onLogoFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      setForm({ ...form, logo_url: url });
    } catch (error) {
      await onAuthError(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Kontakt &amp; Website-Einstellungen</h2>
      <p className="mt-2 text-sm text-vb-text-secondary">
        Standortinformationen, Kontakt und Datenschutztext. Für die Foto- und Überschriftenbereiche der
        Startseite siehe den Tab "Startseite".
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Logo">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={form.logo_url || "/assets/logo.png"}
                alt="Logo-Vorschau"
                className="h-10 w-auto rounded bg-vb-bg-secondary p-1"
              />
              <input
                className={inputClass}
                placeholder="Logo-URL (bei leer wird das Standardlogo verwendet)"
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              />
              <label className="shrink-0 cursor-pointer text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
                {uploading ? "Wird hochgeladen…" : "Von PC/Handy hochladen"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onLogoFileSelected(e.target.files?.[0])}
                />
              </label>
            </div>
          </Field>
        </div>
        <Field label="Name des Lokals">
          <input
            className={inputClass}
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
          />
        </Field>
        <Field label="Slogan">
          <input
            className={inputClass}
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </Field>
        <Field label="Instagram-Link">
          <input
            className={inputClass}
            placeholder="https://instagram.com/..."
            value={form.instagram_url}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
          />
        </Field>
        <Field label="Öffnungszeiten">
          <input
            className={inputClass}
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value })}
          />
        </Field>
        <Field label="Adresse">
          <input
            className={inputClass}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </Field>
        <Field label="WLAN-Netzwerkname">
          <input
            className={inputClass}
            value={form.wifi_ssid}
            onChange={(e) => setForm({ ...form, wifi_ssid: e.target.value })}
          />
        </Field>
        <Field label="WLAN-Passwort">
          <input
            className={inputClass}
            value={form.wifi_password}
            onChange={(e) => setForm({ ...form, wifi_password: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Über-uns-Text">
            <textarea
              rows={4}
              className={inputClass}
              value={form.about_text}
              onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Datenschutztext (Datenschutzerklärung)">
            <textarea
              rows={10}
              className={`${inputClass} font-mono text-xs`}
              value={form.datenschutz_text}
              onChange={(e) => setForm({ ...form, datenschutz_text: e.target.value })}
            />
          </Field>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="border border-vb-text px-5 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          {status === "saving" ? "Wird gespeichert…" : "Speichern"}
        </button>
        {status === "saved" ? <span className="text-sm text-vb-text-secondary">Gespeichert.</span> : null}
        {status === "error" ? (
          <span className="text-sm text-vb-accent">Konnte nicht gespeichert werden, bitte erneut versuchen.</span>
        ) : null}
      </div>
    </section>
  );
}

// Homepage editorial content: hero image/subtitle + the two photo-and-claim
// blocks + the gold atmosphere band. Split into its own tab (rather than
// folded into "Einstellungen") so the owner isn't scanning one long form
// mixing contact info with page copy - each tab has one clear job.
function HomepageContentForm({
  settings,
  setSettings,
  onAuthError,
  onSaved,
}: {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  onAuthError: (error: unknown) => Promise<boolean>;
  onSaved: () => void;
}) {
  const form = settings;
  const setForm = setSettings;
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  async function save() {
    setStatus("saving");
    try {
      await adminUpdateSettings({ data: form });
      setStatus("saved");
      onSaved();
    } catch (error) {
      if (await onAuthError(error)) return;
      setStatus("error");
    }
  }

  async function onImageFileSelected(field: keyof SiteSettings, file: File | undefined) {
    if (!file) return;
    setUploadingField(field);
    try {
      const url = await uploadAdminImage(file);
      setForm({ ...form, [field]: url });
    } catch (error) {
      await onAuthError(error);
    } finally {
      setUploadingField(null);
    }
  }

  function ImageField({
    label,
    field,
  }: {
    label: string;
    field: keyof SiteSettings;
  }) {
    const value = form[field] as string;
    return (
      <Field label={label}>
        <div className="flex flex-wrap items-center gap-3">
          {value ? <img src={value} alt="" className="h-12 w-16 rounded object-cover" /> : null}
          <input
            className={inputClass}
            placeholder="Bild-URL"
            value={value}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
          <label className="shrink-0 cursor-pointer text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
            {uploadingField === field ? "Wird hochgeladen…" : "Von PC/Handy hochladen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingField !== null}
              onChange={(e) => onImageFileSelected(field, e.target.files?.[0])}
            />
          </label>
        </div>
      </Field>
    );
  }

  return (
    <div className="space-y-14">
      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Titelbild (Hero)</h2>
        <p className="mt-2 text-sm text-vb-text-secondary">
          Das große Foto oben auf der Startseite und der kurze Satz darunter. Die große Überschrift
          (Slogan) kommt aus dem Feld "Slogan" im Tab "Einstellungen".
        </p>
        <div className="mt-6 grid gap-5">
          <ImageField label="Bild" field="hero_image_url" />
          <Field label="Untertitel">
            <input
              className={inputClass}
              value={form.hero_subtitle}
              onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Bereich 1 (Cocktails)</h2>
        <p className="mt-2 text-sm text-vb-text-secondary">Der erste Textblock neben dem Foto.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <ImageField label="Bild" field="feature1_image_url" />
          </div>
          <Field label="Kicker">
            <input
              className={inputClass}
              value={form.feature1_eyebrow}
              onChange={(e) => setForm({ ...form, feature1_eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Überschrift">
            <input
              className={inputClass}
              value={form.feature1_heading}
              onChange={(e) => setForm({ ...form, feature1_heading: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Text">
              <textarea
                rows={3}
                className={inputClass}
                value={form.feature1_body}
                onChange={(e) => setForm({ ...form, feature1_body: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Bereich 2 (Ambiente)</h2>
        <p className="mt-2 text-sm text-vb-text-secondary">Zweiter Foto- und Textblock.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <ImageField label="Bild" field="feature2_image_url" />
          </div>
          <Field label="Kicker">
            <input
              className={inputClass}
              value={form.feature2_eyebrow}
              onChange={(e) => setForm({ ...form, feature2_eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Überschrift">
            <input
              className={inputClass}
              value={form.feature2_heading}
              onChange={(e) => setForm({ ...form, feature2_heading: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Text">
              <textarea
                rows={3}
                className={inputClass}
                value={form.feature2_body}
                onChange={(e) => setForm({ ...form, feature2_body: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Goldenes Band</h2>
        <p className="mt-2 text-sm text-vb-text-secondary">
          Der Abschnitt in der Seitenmitte mit zwei Fotos und Text in der Mitte.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <ImageField label="Linkes Bild" field="atmosphere_image1_url" />
          <ImageField label="Rechtes Bild" field="atmosphere_image2_url" />
          <Field label="Überschrift">
            <input
              className={inputClass}
              value={form.atmosphere_heading}
              onChange={(e) => setForm({ ...form, atmosphere_heading: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Text">
              <textarea
                rows={3}
                className={inputClass}
                value={form.atmosphere_body}
                onChange={(e) => setForm({ ...form, atmosphere_body: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Karte &amp; Besuch uns</h2>
        <p className="mt-2 text-sm text-vb-text-secondary">
          Der "Karte"-Vorstellungsbereich und die "Besuch uns"-Überschrift unten auf der Startseite.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Karte-Überschrift">
            <input
              className={inputClass}
              value={form.menu_teaser_heading}
              onChange={(e) => setForm({ ...form, menu_teaser_heading: e.target.value })}
            />
          </Field>
          <Field label="Karte-Buttontext">
            <input
              className={inputClass}
              value={form.menu_teaser_cta_label}
              onChange={(e) => setForm({ ...form, menu_teaser_cta_label: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Karte-Text">
              <textarea
                rows={2}
                className={inputClass}
                value={form.menu_teaser_body}
                onChange={(e) => setForm({ ...form, menu_teaser_body: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Besuch-uns-Überschrift">
            <input
              className={inputClass}
              value={form.visit_heading}
              onChange={(e) => setForm({ ...form, visit_heading: e.target.value })}
            />
          </Field>
          <Field label="Bereich-2-Buttontext (Impressionen)">
            <input
              className={inputClass}
              value={form.feature2_cta_label}
              onChange={(e) => setForm({ ...form, feature2_cta_label: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="border border-vb-text px-5 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          {status === "saving" ? "Wird gespeichert…" : "Speichern"}
        </button>
        {status === "saved" ? <span className="text-sm text-vb-text-secondary">Gespeichert.</span> : null}
        {status === "error" ? (
          <span className="text-sm text-vb-accent">Konnte nicht gespeichert werden, bitte erneut versuchen.</span>
        ) : null}
      </div>
    </div>
  );
}

function CategoriesSection({
  categories,
  onAuthError,
  onChanged,
}: {
  categories: MenuCategory[];
  onAuthError: (error: unknown) => Promise<boolean>;
  onChanged: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  async function addCategory() {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await adminCreateCategory({ data: { name: newName.trim() } });
      setNewName("");
      onChanged();
    } catch (error) {
      await onAuthError(error);
    } finally {
      setBusy(false);
    }
  }

  async function updateCategory(
    category: MenuCategory,
    changes: Partial<Pick<MenuCategory, "name" | "image_url">>,
  ) {
    try {
      await adminUpdateCategory({
        data: {
          id: category.id,
          name: changes.name ?? category.name,
          sort_order: category.sort_order,
          image_url: changes.image_url ?? category.image_url,
        },
      });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  // Swaps this category's sort_order with its neighbor so the up/down
  // buttons reorder categories in place - the public menu already renders
  // in sort_order ASC, so this is the only change needed to move a
  // category on the live site.
  async function moveCategory(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const current = categories[index];
    const target = categories[targetIndex];
    try {
      await Promise.all([
        adminUpdateCategory({
          data: { id: current.id, name: current.name, sort_order: target.sort_order, image_url: current.image_url },
        }),
        adminUpdateCategory({
          data: { id: target.id, name: target.name, sort_order: current.sort_order, image_url: target.image_url },
        }),
      ]);
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  async function deleteCategory(category: MenuCategory) {
    if (!window.confirm(`"${category.name}" Kategorie und alle enthaltenen Produkte wirklich löschen?`)) return;
    try {
      await adminDeleteCategory({ data: { id: category.id } });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Kategorien</h2>
      <p className="mt-2 text-sm text-vb-text-secondary">
        Mit den Pfeilen die Reihenfolge ändern - die Karte auf der Website übernimmt diese Reihenfolge. Das Bild ist
        das Kategorie-Cover, das Gäste zuerst sehen.
      </p>
      <ul className="mt-6 divide-y divide-vb-border">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
            onMove={(direction) => moveCategory(index, direction)}
            onUpdate={(changes) => updateCategory(category, changes)}
            onDelete={() => deleteCategory(category)}
            onAuthError={onAuthError}
          />
        ))}
      </ul>
      <div className="mt-4 flex gap-3">
        <input
          className={inputClass}
          placeholder="Neuer Kategoriename"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={addCategory}
          disabled={busy}
          className="shrink-0 border border-vb-text px-4 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          Hinzufügen
        </button>
      </div>
    </section>
  );
}

function CategoryRow({
  category,
  isFirst,
  isLast,
  onMove,
  onUpdate,
  onDelete,
  onAuthError,
}: {
  category: MenuCategory;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => Promise<void>;
  onUpdate: (changes: Partial<Pick<MenuCategory, "name" | "image_url">>) => Promise<void>;
  onDelete: () => Promise<void>;
  onAuthError: (error: unknown) => Promise<boolean>;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      await onUpdate({ image_url: url });
    } catch (error) {
      await onAuthError(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="flex shrink-0 flex-col">
        <button
          onClick={() => onMove(-1)}
          disabled={isFirst}
          aria-label="Nach oben verschieben"
          className="px-1 leading-none text-vb-text-secondary hover:text-vb-accent disabled:opacity-30"
        >
          ▲
        </button>
        <button
          onClick={() => onMove(1)}
          disabled={isLast}
          aria-label="Nach unten verschieben"
          className="px-1 leading-none text-vb-text-secondary hover:text-vb-accent disabled:opacity-30"
        >
          ▼
        </button>
      </div>
      {category.image_url ? (
        <img src={category.image_url} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
      ) : (
        <div className="h-12 w-12 shrink-0 rounded bg-vb-bg-secondary" />
      )}
      <div className="flex-1 space-y-2">
        <input
          className={inputClass}
          defaultValue={category.name}
          onBlur={(e) => {
            if (e.target.value.trim() && e.target.value !== category.name) {
              onUpdate({ name: e.target.value.trim() });
            }
          }}
        />
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Bild-URL"
            defaultValue={category.image_url}
            onBlur={(e) => {
              if (e.target.value.trim() !== category.image_url) {
                onUpdate({ image_url: e.target.value.trim() });
              }
            }}
          />
          <label className="flex shrink-0 cursor-pointer items-center border border-vb-border px-3 py-2 text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:border-vb-accent hover:text-vb-accent">
            {uploading ? "Wird hochgeladen…" : "Hochladen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onFileSelected(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>
      <button onClick={onDelete} className="shrink-0 self-start text-sm text-vb-text-secondary hover:text-vb-accent">
        Löschen
      </button>
    </li>
  );
}

async function uploadAdminImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  if (!response.ok) {
    throw new Error(response.status === 401 ? "unauthorized" : "upload_failed");
  }
  const result = (await response.json()) as { url: string };
  return result.url;
}

function ItemRow({
  item,
  categories,
  onAuthError,
  onChanged,
}: {
  item: MenuItemRow;
  categories: MenuCategory[];
  onAuthError: (error: unknown) => Promise<boolean>;
  onChanged: () => void;
}) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await adminUpdateItem({
        data: {
          id: form.id,
          category_id: form.category_id,
          name: form.name,
          description: form.description,
          price_amount: form.price_amount,
          image_url: form.image_url,
          is_available: form.is_available === 1,
          sort_order: form.sort_order,
        },
      });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`"${item.name}" Produkt wirklich löschen?`)) return;
    try {
      await adminDeleteItem({ data: { id: item.id } });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  async function onFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      setForm({ ...form, image_url: url });
    } catch (error) {
      await onAuthError(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <li className="border-b border-vb-border py-4">
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_100px_auto_auto] md:items-center md:gap-3">
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input
          className={inputClass}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Beschreibung"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.price_amount}
            onChange={(e) => setForm({ ...form, price_amount: Number(e.target.value) })}
            placeholder="Preis"
          />
          <span className="shrink-0 text-sm text-vb-text-secondary">€</span>
        </div>
        <select
          className={inputClass}
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-vb-text-secondary">
            <input
              type="checkbox"
              checked={form.is_available === 1}
              onChange={(e) => setForm({ ...form, is_available: e.target.checked ? 1 : 0 })}
            />
            Aktiv
          </label>
          <button onClick={save} disabled={saving} className="text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
            Speichern
          </button>
          <button onClick={remove} className="text-xs text-vb-text-secondary hover:text-vb-accent">
            Löschen
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {form.image_url ? (
          <img src={form.image_url} alt="" className="h-10 w-10 rounded object-cover" />
        ) : null}
        <input
          className={inputClass}
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="Bild-URL (optional)"
        />
        <label className="shrink-0 cursor-pointer text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
          {uploading ? "Wird hochgeladen…" : "Von PC/Handy hochladen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFileSelected(e.target.files?.[0])}
          />
        </label>
      </div>
    </li>
  );
}

function ItemsSection({
  categories,
  items,
  onAuthError,
  onChanged,
}: {
  categories: MenuCategory[];
  items: MenuItemRow[];
  onAuthError: (error: unknown) => Promise<boolean>;
  onChanged: () => void;
}) {
  const [draft, setDraft] = useState({
    category_id: categories[0]?.id ?? "",
    name: "",
    description: "",
    price_amount: 0,
    image_url: "",
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function addItem() {
    if (!draft.name.trim() || !draft.category_id) return;
    setBusy(true);
    try {
      await adminCreateItem({
        data: {
          category_id: draft.category_id,
          name: draft.name.trim(),
          description: draft.description.trim(),
          price_amount: draft.price_amount,
          image_url: draft.image_url.trim(),
          is_available: true,
        },
      });
      setDraft({ category_id: draft.category_id, name: "", description: "", price_amount: 0, image_url: "" });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    } finally {
      setBusy(false);
    }
  }

  async function onDraftFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      setDraft({ ...draft, image_url: url });
    } catch (error) {
      await onAuthError(error);
    } finally {
      setUploading(false);
    }
  }

  if (categories.length === 0) {
    return (
      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Produkte</h2>
        <p className="mt-4 text-vb-text-secondary">Bitte zuerst eine Kategorie hinzufügen.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Produkte</h2>
      <ul className="mt-6">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} categories={categories} onAuthError={onAuthError} onChanged={onChanged} />
        ))}
      </ul>
      <div className="mt-6 grid gap-2 md:grid-cols-[1fr_1fr_100px_140px_auto] md:items-center md:gap-3">
        <input
          className={inputClass}
          placeholder="Neuer Produktname"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Beschreibung"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            placeholder="Preis"
            value={draft.price_amount}
            onChange={(e) => setDraft({ ...draft, price_amount: Number(e.target.value) })}
          />
          <span className="shrink-0 text-sm text-vb-text-secondary">€</span>
        </div>
        <select
          className={inputClass}
          value={draft.category_id}
          onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          placeholder="Bild-URL (optional)"
          value={draft.image_url}
          onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
        />
        <label className="shrink-0 cursor-pointer text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
          {uploading ? "Wird hochgeladen…" : "Von PC/Handy hochladen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onDraftFileSelected(e.target.files?.[0])}
          />
        </label>
        <button
          onClick={addItem}
          disabled={busy}
          className="shrink-0 border border-vb-text px-4 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          Hinzufügen
        </button>
      </div>
    </section>
  );
}

function GallerySection({
  images,
  onAuthError,
  onChanged,
}: {
  images: GalleryImage[];
  onAuthError: (error: unknown) => Promise<boolean>;
  onChanged: () => void;
}) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  async function addImage(url: string) {
    if (!url.trim()) return;
    setBusy(true);
    try {
      await adminAddGalleryImage({ data: { image_url: url.trim(), caption: caption.trim() } });
      setCaption("");
      setImageUrl("");
      onChanged();
    } catch (error) {
      await onAuthError(error);
    } finally {
      setBusy(false);
    }
  }

  async function onFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      await addImage(url);
    } catch (error) {
      await onAuthError(error);
    } finally {
      setUploading(false);
    }
  }

  async function remove(image: GalleryImage) {
    if (!window.confirm("Dieses Bild wirklich löschen?")) return;
    try {
      await adminDeleteGalleryImage({ data: { id: image.id } });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Impressionen-Galerie</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img src={image.image_url} alt={image.caption} className="aspect-[4/5] w-full rounded object-cover" />
            <button
              onClick={() => remove(image)}
              className="absolute right-1 top-1 bg-vb-bg/90 px-2 py-1 text-xs text-vb-text-secondary hover:text-vb-accent"
            >
              Löschen
            </button>
          </div>
        ))}
        {images.length === 0 ? <p className="text-vb-text-secondary">Noch keine Bilder.</p> : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          className={inputClass}
          placeholder="Beschreibung (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Bild-URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          onClick={() => addImage(imageUrl)}
          disabled={busy}
          className="shrink-0 border border-vb-text px-4 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          Hinzufügen
        </button>
        <label className="shrink-0 cursor-pointer text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
          {uploading ? "Wird hochgeladen…" : "Von PC/Handy hochladen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFileSelected(e.target.files?.[0])}
          />
        </label>
      </div>
    </section>
  );
}
