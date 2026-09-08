// Addley — push notification sender.
//
// Invoked on a schedule (every 30 minutes, via pg_cron + pg_net — see the
// migration that sets that up). Each run:
//   1. Looks at every account's saved app state.
//   2. Works out which Practice streak/deposit milestones were just
//      crossed since the last run, and whether it's evening-and-something's-
//      still-open for the gentle daily reminder.
//   3. Sends a push for anything new, and records it so the next run
//      30 minutes later doesn't send the same thing twice.
//
// Deliberately celebratory only — no "streak at risk" / urgency messaging.
//
// 2026-09 rewrite: this used to compute everything off the retired
// six-pillar Wellness model (state.wellness + movement/spiritualAnchor/
// sleepProtected/socialConnection/learning/food). That model stopped being
// written to when the app moved to per-Practice apps — nothing populates
// those fields for new days anymore, so the old version of this file was
// scanning data that had gone stale, meaning the "Celebrate streaks &
// deposits" toggle in Settings promised pushes it could no longer produce.
// This version reads the same real per-Practice model app.js itself now
// uses: state.sheets / state.customSheets / state.extraTrackers for which
// Practices exist, isAppLoggedToday/appCurrentStreak's logic for whether
// and how long each one is running, and state.veronikasPrize.earnedAmount
// directly for reward-deposit progress (no need to replicate the deposit
// math here — the client already keeps that number current on every log).
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

// Same ladder app.js's HOME_STREAK_MILESTONES uses for every Practice's
// own streak (the plant medallion tiers) — keep these two lists in sync.
const STREAK_MILESTONES = [3, 7, 10, 14, 21, 30, 60, 100, 150, 200, 365];
const DEPOSIT_MILESTONE_FRACTIONS = [0.25, 0.5, 0.75, 1.0];

// Meal Log's "qualifies as a real deposit" quality tags — mirrors
// MEAL_HEALTHY_QUALITY_KEYS in app.js.
const MEAL_HEALTHY_QUALITY_KEYS = ["nourishing", "balanced"];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function localDateInTimezone(tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function localHourInTimezone(tz: string): number {
  const s = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "2-digit", hour12: false }).format(new Date());
  return parseInt(s, 10) % 24;
}

// ------------------------------------------------------------------
// The real per-Practice model — mirrors the client-side functions of the
// same name in app.js. Kept as close to a line-for-line port as this
// server context allows, since drift between the two is exactly what
// broke this file the first time.
// ------------------------------------------------------------------

const BUILTIN_PRACTICE_IDS = ["bible", "sleep"];

// Every currently-visible Practice app for this account: built-in Bible/
// Sleep, every gallery-added custom sheet (all templates default to
// "practice" except Cycle, which isn't a custom sheet at all), and
// Sobriety if it's been added and isn't hidden. Cycle is deliberately
// excluded — it's a Tracker, never a streak, never a deposit.
function currentPracticeApps(state: any): { id: string; label: string }[] {
  const apps: { id: string; label: string }[] = [];
  (state.sheets || []).forEach((s: any) => {
    if (!s.visible) return;
    if (s.kind === "builtin") {
      if (BUILTIN_PRACTICE_IDS.includes(s.id)) {
        apps.push({ id: s.id, label: s.id === "bible" ? "Bible" : "Sleep" });
      }
      return;
    }
    const cs = state.customSheets?.[s.id];
    if (cs) apps.push({ id: s.id, label: cs.label || "Practice" });
  });
  if (state.extraTrackers?.sobriety && !state.extraTrackers?.hidden?.sobriety) {
    apps.push({ id: "sobriety", label: "Sobriety" });
  }
  return apps;
}

function sleepNightProtected(entry: any, targetHours: number): boolean {
  if (!entry || !entry.am || entry.am.quality == null || entry.am.hours == null) return false;
  return entry.am.quality !== "rough" && entry.am.hours >= targetHours;
}

function mealLogDayQualifies(sheet: any, date: string): boolean {
  return (sheet.items || []).some((i: any) => i.date === date && MEAL_HEALTHY_QUALITY_KEYS.includes(i.quality));
}

function workoutLoggedDatesHas(sheet: any, date: string): boolean {
  return (sheet.weeks || []).some((week: any) => (week.days || []).some((day: any) => day.lastLoggedDate === date));
}

// Mirrors app.js's sheetActiveToday — the real, per-template "was this
// actually logged today" check for every sheet-backed Practice.
function sheetActiveToday(state: any, sheetId: string, today: string): boolean {
  if (sheetId === "bible") {
    return (state.bible || []).some((r: any) => r.done && r.completedDate === today);
  }
  if (sheetId === "sleep") {
    const targetHours = state.sleepSettings?.targetHours || 7;
    const lastNight = (state.sleepLogs || []).find((e: any) => e.date === addDays(today, -1));
    if (!sleepNightProtected(lastNight, targetHours)) return false;
    const tonight = (state.sleepLogs || []).find((e: any) => e.date === today);
    return tonight?.pm?.completedDate === today;
  }
  const cs = state.customSheets?.[sheetId];
  if (cs && cs.templateKey === "books") {
    return (state.learningLog || []).some((e: any) => e.date === today);
  }
  if (cs && (cs.templateKey === "social" || cs.templateKey === "activity" || cs.templateKey === "prayer" || cs.templateKey === "breathe")) {
    return (cs.items || []).some((i: any) => i.date === today);
  }
  if (cs && cs.templateKey === "workout") {
    return workoutLoggedDatesHas(cs, today);
  }
  if (cs && cs.templateKey === "mealLog") {
    return mealLogDayQualifies(cs, today);
  }
  if (!cs || !Array.isArray(cs.items)) return false;
  return cs.items.some((i: any) => i.done && i.completedDate === today);
}

// Mirrors app.js's isAppLoggedToday — Sobriety has no sheet behind it, so
// it reads its own check-in list directly.
function isAppLoggedToday(state: any, appId: string, date: string): boolean {
  if (appId === "sobriety") return (state.sobriety?.checkIns || []).some((c: any) => c.date === date);
  return sheetActiveToday(state, appId, date);
}

function isAppDayPositiveWithGrace(state: any, appId: string, date: string): boolean {
  if (isAppLoggedToday(state, appId, date)) return true;
  return !!(state.grace && state.grace.coveredDates?.[`${appId}|${date}`]);
}

// Mirrors app.js's appCurrentStreak — a Practice's own streak, grace-aware,
// with today not yet being logged not breaking yesterday's run.
function appCurrentStreak(state: any, appId: string, today: string): number {
  let streak = 0;
  let cursor = isAppLoggedToday(state, appId, today) ? today : addDays(today, -1);
  while (isAppDayPositiveWithGrace(state, appId, cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

Deno.serve(async (req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Secrets (VAPID keys, the shared cron secret) live in a service-role-only
    // table rather than function env vars — see the app_secrets_table migration.
    const { data: secretRows, error: secretsErr } = await supabase.from("app_secrets").select("key,value");
    if (secretsErr) throw secretsErr;
    const secrets = Object.fromEntries((secretRows || []).map((r: any) => [r.key, r.value]));

    const providedSecret = req.headers.get("x-cron-secret");
    if (!providedSecret || providedSecret !== secrets.cron_secret) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
    }

    webpush.setVapidDetails(secrets.vapid_subject, secrets.vapid_public_key, secrets.vapid_private_key);

    const { data: rows, error: rowsErr } = await supabase.from("app_state").select("user_id, data");
    if (rowsErr) throw rowsErr;

    const summary: any[] = [];

    for (const row of rows || []) {
      const userId = row.user_id;
      const state = row.data || {};
      const tz: string | undefined = state.timezone;
      const utcToday = new Date().toISOString().slice(0, 10);
      const today = tz ? localDateInTimezone(tz) : utcToday;

      const practices = currentPracticeApps(state);
      const candidates: { key: string; title: string; body: string }[] = [];

      // Per-Practice streak milestones — no more "overall" streak now that
      // every Practice runs its own independent one.
      practices.forEach(({ id, label }) => {
        const streak = appCurrentStreak(state, id, today);
        STREAK_MILESTONES.filter((m) => m <= streak).forEach((m) => {
          candidates.push({
            key: `streak:${id}:${m}`,
            title: `🎉 ${m}-day ${label} streak!`,
            body: `${label} logged ${m} days running.`,
          });
        });
      });

      // Reward-deposit milestones — reads state.veronikasPrize.earnedAmount
      // directly rather than recomputing deposits here. That number is
      // already kept current client-side on every real Practice log
      // (awardRewardForPracticeLog), so re-deriving it from raw logs a
      // second time here would just be a second, drift-prone copy of the
      // same math.
      const prize = state.veronikasPrize;
      if (prize?.enabled && prize.depositGoal > 0) {
        const pct = Math.max(0, prize.earnedAmount || 0) / prize.depositGoal;
        const itemName = prize.itemName || "your prize";
        DEPOSIT_MILESTONE_FRACTIONS.filter((f) => pct >= f).forEach((f) => {
          const pctLabel = Math.round(f * 100);
          const key = `deposit:${prize.cycleStartDate}:${pctLabel}`;
          if (f >= 1) {
            candidates.push({
              key,
              title: `🎉 You did it — ${itemName} unlocked!`,
              body: `You've earned the full $${prize.depositGoal} goal. Time to treat yourself.`,
            });
          } else {
            candidates.push({
              key,
              title: `🎉 ${pctLabel}% of the way to ${itemName}`,
              body: `$${(prize.earnedAmount || 0).toFixed(2)} of $${prize.depositGoal} earned so far.`,
            });
          }
        });
      }

      // Gentle evening reminder — once a day, only if there's an actual
      // gap, only in the 7–9pm window in the account's own timezone, and
      // never phrased as a warning. Now names open Practices instead of
      // open pillars.
      if (tz && practices.length) {
        const hour = localHourInTimezone(tz);
        if (hour >= 19 && hour < 21) {
          const openPractices = practices.filter(({ id }) => !isAppLoggedToday(state, id, today)).map(({ label }) => label);
          if (openPractices.length) {
            const list = openPractices.length > 2 ? `${openPractices.slice(0, 2).join(", ")}, and ${openPractices.length - 2} more` : openPractices.join(" and ");
            candidates.push({
              key: `reminder:${today}`,
              title: "A few Practices still open today",
              body: `${list} — a quick tap logs them.`,
            });
          }
        }
      }

      if (!candidates.length) {
        summary.push({ userId, sent: 0 });
        continue;
      }

      // Does this account even have anywhere to send a push? If not,
      // don't bother claiming candidates — leave them unclaimed so that
      // once a subscription does exist, the milestone can still fire
      // instead of having been silently burned by a run with no device
      // to deliver to.
      const { data: subs } = await supabase.from("push_subscriptions").select("id, endpoint, subscription").eq("user_id", userId);
      if (!subs || !subs.length) {
        summary.push({ userId, sent: 0, note: "no subscriptions" });
        continue;
      }

      // Claim each candidate via the unique (user_id, milestone_key)
      // constraint — whichever run wins the insert is the one that sends,
      // so two overlapping cron runs can never double-send. If the actual
      // send below fails for a reason that isn't "this endpoint is dead"
      // (network hiccup, push-service error, bad payload, etc.), the claim
      // is released again so the NEXT run gets to retry it instead of the
      // milestone being marked "sent" forever while never having reached
      // her device.
      const toSend: typeof candidates = [];
      for (const c of candidates) {
        const { error: insertErr } = await supabase
          .from("push_notified_milestones")
          .insert({ user_id: userId, milestone_key: c.key });
        if (!insertErr) toSend.push(c);
        // A unique-violation just means another run already claimed it —
        // not a real error, so it's silently skipped rather than thrown.
      }

      if (!toSend.length) {
        summary.push({ userId, sent: 0 });
        continue;
      }

      let sent = 0;
      for (const sub of subs) {
        for (const msg of toSend) {
          try {
            await webpush.sendNotification(sub.subscription, JSON.stringify({ title: msg.title, body: msg.body }));
            sent++;
          } catch (err: any) {
            console.error(`push send failed for user ${userId}, milestone ${msg.key}, endpoint ${sub.endpoint}:`, err?.statusCode, err?.body || err?.message || err);
            if (err.statusCode === 404 || err.statusCode === 410) {
              // The browser/OS has unsubscribed this endpoint on its end —
              // clean it up so future runs don't keep retrying it.
              await supabase.from("push_subscriptions").delete().eq("id", sub.id);
            } else {
              // Some other failure (network blip, push-service 5xx, a
              // malformed payload, etc.) — release the claim so the next
              // cron run 30 minutes from now tries this milestone again
              // instead of it being lost for good.
              await supabase
                .from("push_notified_milestones")
                .delete()
                .eq("user_id", userId)
                .eq("milestone_key", msg.key);
            }
          }
        }
      }
      summary.push({ userId, sent, candidates: toSend.map((c) => c.key) });
    }

    return new Response(JSON.stringify({ ok: true, summary }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("send-notifications error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
