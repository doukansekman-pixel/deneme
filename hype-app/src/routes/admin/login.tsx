import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Anmeldung - Hype Bar" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Falsches Passwort.");
        return;
      }
      await navigate({ to: "/admin" });
    } catch {
      setError("Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-vb-bg px-6 font-vb-display text-vb-text">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Anmeldung</h1>
        <p className="mt-2 text-sm text-vb-text-secondary">Passwort eingeben, um die Karte zu bearbeiten.</p>
        <label htmlFor="admin-password" className="mt-8 block text-xs uppercase tracking-[0.15em] text-vb-text-secondary">
          Passwort
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border border-vb-border bg-vb-bg-secondary px-4 py-3 text-vb-text outline-none focus:border-vb-accent"
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm text-vb-accent">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full border border-vb-text py-3 text-sm uppercase tracking-[0.15em] text-vb-text transition-colors hover:border-vb-accent hover:text-vb-accent disabled:opacity-50"
        >
          {submitting ? "Anmelden…" : "Anmelden"}
        </button>
      </form>
    </div>
  );
}
