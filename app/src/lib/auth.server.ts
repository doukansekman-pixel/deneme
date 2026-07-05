// This site's OWN admin auth — a single password gate for the menu admin
// panel. Not Higgsfield/fnf auth (see references/auth.md's distinction: this
// is in-app auth for the product's own admin, not a Higgsfield account).
import { getRequest } from "@tanstack/react-start/server";

import { bindings } from "./bindings.server";

export const SESSION_COOKIE_NAME = "vype_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Cloudflare Workers' SubtleCrypto ships a non-standard timingSafeEqual, but
// the TS lib types don't declare it. A manual constant-time compare avoids
// the type gap and is equally safe (length check, then constant-time XOR).
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function createSessionToken(): Promise<string | null> {
  const { SESSION_SECRET } = bindings();
  if (!SESSION_SECRET) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(exp);
  const signature = await sign(payload, SESSION_SECRET);
  return `${payload}.${signature}`;
}

async function verifySessionToken(token: string): Promise<boolean> {
  const { SESSION_SECRET } = bindings();
  if (!SESSION_SECRET) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expected = base64UrlDecode(await sign(payload, SESSION_SECRET));
  const actual = base64UrlDecode(signature);
  return timingSafeEqual(expected, actual);
}

function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) return rest.join("=");
  }
  return null;
}

export async function isAdminRequestAuthenticated(request: Request): Promise<boolean> {
  const token = parseCookie(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  if (!token) return false;
  return verifySessionToken(token);
}

// For use inside createServerFn handlers, which don't receive `request` in
// their ctx — the ambient request is read via getRequest() instead.
export async function isAdminAuthenticated(): Promise<boolean> {
  const request = getRequest();
  if (!request) return false;
  return isAdminRequestAuthenticated(request);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const { ADMIN_PASSWORD } = bindings();
  if (!ADMIN_PASSWORD) return false;
  const expected = new TextEncoder().encode(ADMIN_PASSWORD);
  const actual = new TextEncoder().encode(password);
  return timingSafeEqual(expected, actual);
}

export function buildSessionCookie(token: string): string {
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function buildClearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
