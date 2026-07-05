import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import {
  adminCreateCategory,
  adminCreateItem,
  adminDeleteCategory,
  adminDeleteItem,
  adminGetAll,
  adminUpdateCategory,
  adminUpdateItem,
  adminUpdateSettings,
  checkAdminSession,
} from "../../lib/api/admin.functions";
import type { MenuCategory, MenuItemRow, SiteSettings } from "../../lib/api/public.functions";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminSession();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  loader: () => adminGetAll(),
  head: () => ({
    meta: [{ title: "Yönetim - Vype Bar" }, { name: "robots", content: "noindex, nofollow" }],
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
};

function AdminDashboard() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();

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
        <h1 className="text-lg font-semibold tracking-tight">Vype Bar Yönetim</h1>
        <div className="flex items-center gap-6 text-sm">
          <a href="/" target="_blank" rel="noreferrer" className="text-vb-text-secondary hover:text-vb-text">
            Siteyi Gör
          </a>
          <button onClick={logout} className="text-vb-text-secondary hover:text-vb-accent">
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-16 px-6 py-12">
        <SettingsForm
          initial={data.settings ?? EMPTY_SETTINGS}
          onAuthError={onAuthError}
          onSaved={() => router.invalidate()}
        />
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
  initial,
  onAuthError,
  onSaved,
}: {
  initial: SiteSettings;
  onAuthError: (error: unknown) => Promise<boolean>;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Site Ayarları</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Mekan Adı">
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
        <Field label="Instagram Linki">
          <input
            className={inputClass}
            placeholder="https://instagram.com/..."
            value={form.instagram_url}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
          />
        </Field>
        <Field label="Çalışma Saatleri">
          <input
            className={inputClass}
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value })}
          />
        </Field>
        <Field label="Adres">
          <input
            className={inputClass}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </Field>
        <Field label="WiFi Ağ Adı">
          <input
            className={inputClass}
            value={form.wifi_ssid}
            onChange={(e) => setForm({ ...form, wifi_ssid: e.target.value })}
          />
        </Field>
        <Field label="WiFi Şifresi">
          <input
            className={inputClass}
            value={form.wifi_password}
            onChange={(e) => setForm({ ...form, wifi_password: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Hakkımızda Metni">
            <textarea
              rows={4}
              className={inputClass}
              value={form.about_text}
              onChange={(e) => setForm({ ...form, about_text: e.target.value })}
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
          {status === "saving" ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {status === "saved" ? <span className="text-sm text-vb-text-secondary">Kaydedildi.</span> : null}
        {status === "error" ? <span className="text-sm text-vb-accent">Kaydedilemedi, tekrar deneyin.</span> : null}
      </div>
    </section>
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

  async function renameCategory(category: MenuCategory, name: string) {
    try {
      await adminUpdateCategory({ data: { id: category.id, name, sort_order: category.sort_order } });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  async function deleteCategory(category: MenuCategory) {
    if (!window.confirm(`"${category.name}" kategorisini ve içindeki tüm ürünleri silmek istediğinize emin misiniz?`)) return;
    try {
      await adminDeleteCategory({ data: { id: category.id } });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Kategoriler</h2>
      <ul className="mt-6 divide-y divide-vb-border">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center gap-3 py-3">
            <input
              className={inputClass}
              defaultValue={category.name}
              onBlur={(e) => {
                if (e.target.value.trim() && e.target.value !== category.name) {
                  renameCategory(category, e.target.value.trim());
                }
              }}
            />
            <button onClick={() => deleteCategory(category)} className="shrink-0 text-sm text-vb-text-secondary hover:text-vb-accent">
              Sil
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-3">
        <input
          className={inputClass}
          placeholder="Yeni kategori adı"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={addCategory}
          disabled={busy}
          className="shrink-0 border border-vb-text px-4 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          Ekle
        </button>
      </div>
    </section>
  );
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

  async function save() {
    setSaving(true);
    try {
      await adminUpdateItem({
        data: {
          id: form.id,
          category_id: form.category_id,
          name: form.name,
          description: form.description,
          price: form.price,
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
    if (!window.confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz?`)) return;
    try {
      await adminDeleteItem({ data: { id: item.id } });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    }
  }

  return (
    <li className="grid gap-2 border-b border-vb-border py-4 md:grid-cols-[1fr_1fr_100px_auto_auto] md:items-center md:gap-3">
      <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ad" />
      <input
        className={inputClass}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Açıklama"
      />
      <input className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Fiyat" />
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
          Aktif
        </label>
        <button onClick={save} disabled={saving} className="text-xs uppercase tracking-[0.1em] text-vb-text-secondary hover:text-vb-text">
          Kaydet
        </button>
        <button onClick={remove} className="text-xs text-vb-text-secondary hover:text-vb-accent">
          Sil
        </button>
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
    price: "",
  });
  const [busy, setBusy] = useState(false);

  async function addItem() {
    if (!draft.name.trim() || !draft.category_id) return;
    setBusy(true);
    try {
      await adminCreateItem({
        data: {
          category_id: draft.category_id,
          name: draft.name.trim(),
          description: draft.description.trim(),
          price: draft.price.trim(),
          is_available: true,
        },
      });
      setDraft({ category_id: draft.category_id, name: "", description: "", price: "" });
      onChanged();
    } catch (error) {
      await onAuthError(error);
    } finally {
      setBusy(false);
    }
  }

  if (categories.length === 0) {
    return (
      <section>
        <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Ürünler</h2>
        <p className="mt-4 text-vb-text-secondary">Önce bir kategori ekleyin.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.15em] text-vb-accent">Ürünler</h2>
      <ul className="mt-6">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} categories={categories} onAuthError={onAuthError} onChanged={onChanged} />
        ))}
      </ul>
      <div className="mt-6 grid gap-2 md:grid-cols-[1fr_1fr_100px_140px_auto] md:items-center md:gap-3">
        <input
          className={inputClass}
          placeholder="Yeni ürün adı"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Açıklama"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Fiyat"
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: e.target.value })}
        />
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
        <button
          onClick={addItem}
          disabled={busy}
          className="shrink-0 border border-vb-text px-4 py-2 text-sm uppercase tracking-[0.15em] hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          Ekle
        </button>
      </div>
    </section>
  );
}
