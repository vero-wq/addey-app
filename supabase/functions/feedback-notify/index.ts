// Feedback notification — fires on every insert into public.feedback via the
// on_feedback_insert_notify trigger, and emails Veronika so a report lands
// somewhere she actually looks instead of sitting in a table nobody opens.
//
// Deliberately the same shape as resend-waitlist-signup: trigger -> pg_net ->
// this function -> Resend. That path is proven in production (waitlist insert
// to delivered email in under three seconds, 2026-09-11), so there was no
// reason for a second notification path to invent its own mechanism.
//
// One thing this does NOT do: attach or link the screenshot. Screenshots live
// in a private bucket and can show Cycle or Sobriety data, and a signed URL is
// a bearer link — whoever holds it can open the image for as long as it lives.
// Parking one in an inbox for weeks would contradict the privacy position the
// App Store nutrition labels have to assert (board card c036). The email says
// whether a screenshot exists and where it is; Veronika opens it from the
// dashboard, or from the founder-only inbox screen when that gets built.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROJECT_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const FROM = "Addley <feedback@updates.addley.app>";
const TO = "hello@addley.app";

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const row = payload?.record;
    if (!row?.id) {
      return new Response(JSON.stringify({ error: "no record on payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const admin = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

    // Same secrets table the waitlist function reads from, rather than a
    // second copy of the key in this function's own env.
    const { data: secret, error: secretErr } = await admin
      .from("app_secrets")
      .select("value")
      .eq("key", "resend_api_key")
      .single();
    if (secretErr || !secret?.value) {
      console.error("could not read resend_api_key", secretErr);
      return new Response(JSON.stringify({ error: "missing resend key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // The table stores user_id, not an address — so that a deleted account
    // takes its feedback with it (on delete cascade) rather than leaving an
    // email address behind in a row nobody can attribute.
    let who = row.user_id as string;
    const { data: userRes } = await admin.auth.admin.getUserById(row.user_id);
    if (userRes?.user?.email) who = userRes.user.email;

    const shot = row.screenshot_path
      ? `Screenshot attached: <code>${esc(row.screenshot_path)}</code><br>
         <span style="color:#8A7F70">Open it from Storage &rarr; feedback-screenshots in the Supabase dashboard.</span>`
      : `<span style="color:#8A7F70">No screenshot attached.</span>`;

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#221E1A;max-width:560px">
        <p style="margin:0 0 18px;font-size:13px;color:#8A7F70">New feedback in Addley</p>
        <div style="background:#F7F3EC;border-left:3px solid #A9804F;border-radius:4px;padding:14px 16px;margin:0 0 20px;white-space:pre-wrap">${esc(row.body)}</div>
        <table style="font-size:13px;color:#8A7F70;border-collapse:collapse">
          <tr><td style="padding:3px 14px 3px 0">From</td><td style="color:#221E1A">${esc(who)}</td></tr>
          <tr><td style="padding:3px 14px 3px 0">Screen</td><td style="color:#221E1A">${esc(row.screen || "unknown")} <span style="color:#8A7F70">(where they were when they opened the panel &mdash; a hint, not a fact)</span></td></tr>
          <tr><td style="padding:3px 14px 3px 0">Page</td><td style="color:#221E1A">${esc(row.page_url)}</td></tr>
          <tr><td style="padding:3px 14px 3px 0">Device</td><td style="color:#221E1A">${esc(row.user_agent)}</td></tr>
          <tr><td style="padding:3px 14px 3px 0">Row</td><td style="color:#221E1A"><code>${esc(row.id)}</code></td></tr>
        </table>
        <p style="margin:20px 0 0;font-size:13px">${shot}</p>
      </div>`;

    const subject = `Addley feedback — ${String(row.body || "").trim().slice(0, 60) || "no message"}`;

    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [TO], subject, html, reply_to: who }),
    });

    const result = await send.json();
    if (!send.ok) {
      console.error("resend rejected the send", result);
      return new Response(JSON.stringify({ error: result }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, email_id: result.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("feedback-notify failed", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
