/// <reference types="@cloudflare/workers-types" />
import { z } from "zod";

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  N8N_WEBHOOK_URL?: string;
  N8N_WEBHOOK_SECRET?: string;
  // Test hook: when "1", force Resend to fail so the n8n fallback path runs.
  TEST_FORCE_RESEND_FAILURE?: string;
}

const ALLOWED_ORIGINS = [
  "https://sethbrasile.com",
  "https://www.sethbrasile.com",
  "http://localhost:4321",
  "http://localhost:3000",
];

const NOTIFY_TO = "seth@tenorcreative.com";
const FROM = "Seth Brasile <noreply@notify.pricklypearmarketingco.com>";

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
  "cf-turnstile-response": z.string().min(1),
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

async function sendViaResend(env: Env, lead: { name: string; email: string; subject: string; message: string }): Promise<void> {
  if (env.TEST_FORCE_RESEND_FAILURE === "1") throw new Error("forced Resend failure (test)");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      reply_to: lead.email,
      subject: `[sethbrasile.com] ${lead.subject}`,
      html: `<h2>New contact form submission</h2>
<p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(lead.subject)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}

async function sendToN8nFallback(env: Env, lead: Record<string, string>, errorMessage: string): Promise<void> {
  if (!env.N8N_WEBHOOK_URL) return;
  // NOTE: JSON payload — do NOT HTML-escape (causes &amp; artifacts downstream).
  const payload = JSON.stringify({
    source: "sethbrasile.com",
    ...lead,
    error: errorMessage,
    context: "visitor saw success, expects a follow-up",
  });
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (env.N8N_WEBHOOK_SECRET) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.N8N_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    headers["x-webhook-signature"] = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  await fetch(env.N8N_WEBHOOK_URL, { method: "POST", headers, body: payload });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Origin validation — reject missing OR unexpected (fail closed).
  const origin = request.headers.get("Origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: "Forbidden" }, 403);
  }

  // Fail-secure: Turnstile secret must be configured.
  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ error: "Server misconfiguration." }, 500);
  }

  // Fail-secure: at least one delivery method must exist.
  if (!env.RESEND_API_KEY && !env.N8N_WEBHOOK_URL) {
    return json({ error: "Server misconfiguration." }, 500);
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return json({ error: "Please check the form and try again." }, 400);
  }
  const { "cf-turnstile-response": token, ...lead } = parsed.data;

  const ok = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, request.headers.get("CF-Connecting-IP"));
  if (!ok) {
    return json({ error: "Anti-bot check failed. Please try again." }, 400);
  }

  // Primary delivery: Resend. On failure, fall back to n8n (optimistic success).
  try {
    if (!env.RESEND_API_KEY) throw new Error("no Resend key; using fallback");
    await sendViaResend(env, lead);
    return json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    context.waitUntil(sendToN8nFallback(env, lead, message).catch(() => {}));
    // User sees success regardless — the lead is captured via fallback.
    return json({ ok: true });
  }
};
