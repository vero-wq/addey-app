const checkSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

// ------------------------------------------------------------------
// Sheets — the built-in tabs, plus any sheets added from the Settings
// gallery. state.sheets holds the order + visibility for all of them;
// state.customSheets holds the data for the gallery-added ones.
// ------------------------------------------------------------------
const BUILTIN_SHEET_META = {
  todo: { label: "Lists", icon: `<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"></path>` },
  budget: { label: "Budget", icon: `<line x1="12" y1="2" x2="12" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>` },
  investments: { label: "Investments", icon: `<polyline points="3 17 9 11 13 15 21 6"></polyline><polyline points="15 6 21 6 21 12"></polyline>` },
  bible: {
    label: "Bible",
    icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M13 7v9M10.2 9.6h5.6"></path>`,
  },
  wellness: { label: "Wellness", icon: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>` },
  sleep: { label: "Sleep", icon: `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>` },
};
// "todo" (Lists) is deliberately left out of this list now — it's a pure
// utility with no habit pillar behind it, same reasoning as Wardrobe.
// Anyone who already has it (existing accounts, including Veronika's own)
// keeps it untouched, since this only controls what gets seeded for a
// brand-new account; nothing here ever removes an existing sheet.
const BUILTIN_SHEET_ORDER = ["budget", "investments", "bible", "sleep", "wellness"];

const SHEET_GALLERY = [
  {
    key: "workout",
    label: "Workout Log",
    icon: `<rect x="1.5" y="9" width="3" height="6" rx="1"></rect><rect x="19.5" y="9" width="3" height="6" rx="1"></rect><rect x="5.5" y="7" width="2.5" height="10" rx="1"></rect><rect x="16" y="7" width="2.5" height="10" rx="1"></rect><line x1="8" y1="12" x2="16" y2="12"></line>`,
    desc: "Track sets, weight, and how your training sessions are going.",
    starterItems: ["Upper body — Monday", "Lower body — Wednesday", "Full body — Friday"],
    type: "practice",
  },
  {
    key: "activity",
    label: "Activity Log",
    icon: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>`,
    desc: "Walks, hikes, runs, rides — anything that's not sets and reps. Workout Log's sibling for Movement.",
    starterItems: [],
    type: "practice",
  },
  {
    key: "mealLog",
    label: "Meal Log",
    icon: `<path d="M11 2a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3v8"></path><path d="M18 2v9a3 3 0 0 1-3 3"></path><path d="M18 2v20"></path>`,
    desc: "A quick daily log of how you ate — Food's practice, same idea as Activity Log for Movement.",
    starterItems: [],
    type: "practice",
  },
  {
    key: "quran",
    label: "Quran Plan",
    icon: `<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M9 7h8M9 11h8M9 15h5"></path>`,
    desc: "31 reading segments with the same pace tracker as your Bible plan.",
    starterItems: [],
    type: "practice",
  },
  {
    key: "books",
    label: "Books",
    icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M9 7h7"></path>`,
    desc: "Your reading list, organized by category — to read and already read.",
    starterItems: [],
    type: "practice",
  },
  {
    key: "social",
    label: "Connections",
    icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
    desc: "A quick log of who you connected with today — a call, coffee, a real conversation.",
    starterItems: [],
    type: "practice",
  },
  {
    key: "prayer",
    label: "Prayer Log",
    icon: `<path d="M12 2v6"></path><path d="M8.5 8c0 2 1 3.5 3.5 3.5S15.5 10 15.5 8"></path><rect x="9.5" y="11" width="5" height="10" rx="1"></rect>`,
    desc: "A quick tap for each prayer — the five daily times, plus gratitude, intercession, and protection.",
    starterItems: [],
    type: "practice",
  },
  {
    key: "breathe",
    label: "Breathe",
    icon: `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path>`,
    desc: "A guided breathing session with a mood check-in before and after — box breathing, a slower breath, and a soft guiding sound.",
    starterItems: [],
    type: "practice",
  },
  // Kept last, deliberately: a genuinely useful utility, but the one
  // gallery space with no habit pillar behind it — same category as the
  // built-in Lists space. Not being removed for anyone already using it,
  // just no longer featured as a core habit-wellness offering.
  {
    key: "wardrobe",
    label: "Wardrobe",
    icon: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"></path>`,
    desc: "Checklist for what's in rotation this season, by category — a general wardrobe utility, not a habit pillar.",
    starterItems: ["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"],
    type: "tool",
  },
];

// Extra trackers — a different family from practices entirely: they
// don't map to a pillar, don't ask anything of you daily, and don't
// count against the practice cap (always free, no upgrade gate). Cycle
// is the first; state.extraTrackers[key] is whether it's currently
// added. Removing one hides it without touching any data already
// logged under it.
const EXTRA_TRACKERS_GALLERY = [
  {
    key: "cycle",
    label: "Cycle",
    icon: `<path d="M12 3a9 9 0 1 0 9 9"></path><path d="M12 3v9l6 3"></path>`,
    desc: "Log when your period starts and Addley predicts your phase from there — no streak, no pass or fail.",
    type: "tracker",
  },
  {
    key: "sobriety",
    label: "Sobriety",
    // A proper symmetric heart (mirrored left/right around x=12) — the
    // previous path had a stray extra curve segment tacked on after the
    // bottom point that never closed back up, which is what made it read
    // as lopsided/off-center rather than a clean heart.
    icon: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>`,
    // 2026-09 apps rearchitecture: Sobriety's daily check-in is a real
    // dated log (state.sobriety.checkIns), so it moved from "tracker" to
    // "practice" — any check-in today is a deposit and it earns its own
    // streak now, same as Workout Log or Meal Log.
    desc: "A day count and a daily check-in — any check-in is a deposit toward your reward, with its own streak.",
    type: "practice",
  },
];

// ------------------------------------------------------------------
// Capsule Wardrobe — richer than a plain checklist: each item carries
// category/type/color/season/priority/purchase-type/price data, seeded
// from her real spreadsheet. Season pills up top (Staples pinned first,
// then the four seasons ordered starting with whatever season it is
// right now on this device, so the most relevant one is never buried),
// and within a season the items collapse into category groups — same
// pattern as the Bible book list.
const WARDROBE_SEED_ITEMS = [{"category": "Tops", "name": "White Button-Down Shirt", "itemType": "Everyday", "color": "White", "season": "All", "priority": "High", "purchaseType": "Support", "min": 40, "max": 80, "purchased": true, "paid": 55, "notes": "A versatile staple that works for most occasions."}, {"category": "Bottoms", "name": "Dark Wash Jeans", "itemType": "Everyday", "color": "Indigo", "season": "All", "priority": "High", "purchaseType": "Support", "min": 60, "max": 120, "purchased": true, "paid": 89, "notes": "Goes with almost everything."}, {"category": "Outerwear", "name": "Wool Coat", "itemType": "Cold Weather", "color": "Camel", "season": "Fall/Winter", "priority": "Medium", "purchaseType": "Bonus", "min": 150, "max": 300, "purchased": false, "paid": null, "notes": "Add your own wishlist items like this one."}, {"category": "Shoes", "name": "White Sneakers", "itemType": "Everyday", "color": "White", "season": "All", "priority": "High", "purchaseType": "Support", "min": 60, "max": 120, "purchased": true, "paid": 75, "notes": ""}, {"category": "Accessories", "name": "Leather Belt", "itemType": "Everyday", "color": "Black", "season": "All", "priority": "Low", "purchaseType": "Support", "min": 20, "max": 50, "purchased": true, "paid": 30, "notes": ""}];

const WARDROBE_SEASON_DEFS = [
  { key: "spring", label: "Spring" },
  { key: "summer", label: "Summer" },
  { key: "fall", label: "Fall" },
  { key: "winter", label: "Winter" },
];

// "All" / "All-season" -> Staples. Combined seasons ("Spring/Summer")
// tag the item under both, so it shows up in either pill.
function parseSeasonTags(seasonStr) {
  const s = (seasonStr || "").trim().toLowerCase();
  if (!s || s === "all" || s === "all-season" || s === "all seasons") return ["staples"];
  return s
    .split("/")
    .map((p) => p.trim())
    .filter((p) => WARDROBE_SEASON_DEFS.some((d) => d.key === p));
}

// Northern-hemisphere calendar seasons from the device's local date —
// good enough to put the relevant pill first without asking anyone
// where they live.
function getCurrentSeasonKey() {
  const m = new Date().getMonth(); // 0=Jan
  if (m <= 1 || m === 11) return "winter"; // Dec, Jan, Feb
  if (m <= 4) return "spring"; // Mar, Apr, May
  if (m <= 7) return "summer"; // Jun, Jul, Aug
  return "fall"; // Sep, Oct, Nov
}

// Staples always leads; the four seasons follow starting with whichever
// one it is right now, so a summer visit doesn't bury Summer behind
// Spring every time.
function wardrobeSeasonPillOrder() {
  const current = getCurrentSeasonKey();
  const idx = WARDROBE_SEASON_DEFS.findIndex((d) => d.key === current);
  const rotated = WARDROBE_SEASON_DEFS.slice(idx).concat(WARDROBE_SEASON_DEFS.slice(0, idx));
  return [{ key: "staples", label: "Staples" }, ...rotated];
}

// A small color-name -> swatch lookup. Falls back to a neutral dot for
// anything unrecognized rather than guessing wrong.
const WARDROBE_COLOR_SWATCHES = [
  ["black", "#221E1A"],
  ["white", "#F7F5F0"],
  ["off-white", "#F0ECE0"],
  ["ivory", "#F0E9DB"],
  ["cream", "#ECE3D2"],
  ["camel", "#B98A55"],
  ["chocolate", "#4A3323"],
  ["brown", "#5C4128"],
  ["tan", "#C9AB7C"],
  ["gold", "#C9A86A"],
  ["grey", "#9A958D"],
  ["gray", "#9A958D"],
  ["navy", "#2C3A4A"],
  ["denim", "#5B7A9A"],
  ["merlot", "#5C1F2E"],
  ["red", "#B3392B"],
  ["green", "#6B7F5A"],
  ["olive", "#6B6B45"],
  ["floral", "#C08887"],
  ["neutral", "#ADA79A"],
  ["diamond", "#D9D3C4"],
];
function wardrobeColorSwatch(colorStr) {
  const s = (colorStr || "").toLowerCase();
  for (const [name, hex] of WARDROBE_COLOR_SWATCHES) {
    if (s.includes(name)) return hex;
  }
  return "#ADA79A";
}

function seedWardrobeItems() {
  return WARDROBE_SEED_ITEMS.map((it) => ({
    id: nextId(),
    ...it,
    seasonTags: parseSeasonTags(it.season),
  }));
}

function seedQuranItems() {
  return QURAN_SEED_ITEMS.map((it) => ({ id: nextId(), ...it }));
}

function seedBookItems() {
  return BOOK_SEED_ITEMS.map((it) => ({ id: nextId(), ...it }));
}

const BOOK_SEED_ITEMS = [{"title": "Atomic Habits", "author": "James Clear", "category": "Personal Growth", "link": "", "read": true, "format": "read", "onlineRating": 5, "myRating": 4, "notes": "A good example of how notes show up here."}, {"title": "Add your own book", "author": "", "category": "To Read", "link": "", "read": false, "format": "read", "onlineRating": null, "myRating": null, "notes": ""}];

const QURAN_SEED_ITEMS = [{"reading": "Surah Al-Fatiha (1:1–7) to Surah Al-Baqarah (2:1–141)", "done": false}, {"reading": "Surah Al-Baqarah (2:142–252)", "done": false}, {"reading": "Surah Al-Baqarah (2:253–286) to Surah Aal-E-Imran (3:1–92)", "done": false}, {"reading": "Surah Aal-E-Imran (3:93–200) to Surah An-Nisa (4:1–23)", "done": false}, {"reading": "Surah An-Nisa (4:24–147)", "done": false}, {"reading": "Surah An-Nisa (4:148–176) to Surah Al-Ma’idah (5:1–81)", "done": false}, {"reading": "Surah Al-Ma’idah (5:82–120) to Surah Al-An’am (6:1–110)", "done": false}, {"reading": "Surah Al-An’am (6:111–165) to Surah Al-A’raf (7:1–87)", "done": false}, {"reading": "Surah Al-A’raf (7:88–206) to Surah Al-Anfal (8:1–40)", "done": false}, {"reading": "Surah Al-Anfal (8:41–75) to Surah At-Tawbah (9:1–129)", "done": false}, {"reading": "Surah Yunus (10:1–109) to Surah Hud (11:1–5)", "done": false}, {"reading": "Surah Hud (11:6–123) to Surah Yusuf (12:1–52)", "done": false}, {"reading": "Surah Yusuf (12:53–111) to Surah Ar-Ra’d (13:1–43)", "done": false}, {"reading": "Surah Ibrahim (14:1–52) to Surah Al-Hijr (15:1–99)", "done": false}, {"reading": "Surah An-Nahl (16:1–128)", "done": false}, {"reading": "Surah Al-Isra (17:1–111) to Surah Al-Kahf (18:1–74)", "done": false}, {"reading": "Surah Al-Kahf (18:75–110) to Surah Maryam (19:1–98)", "done": false}, {"reading": "Surah Taha (20:1–135) to Surah Al-Anbiya (21:1–50)", "done": false}, {"reading": "Surah Al-Anbiya (21:51–112) to Surah Al-Hajj (22:1–78)", "done": false}, {"reading": "Surah Al-Mu’minun (23:1–118) to Surah An-Nur (24:1–64)", "done": false}, {"reading": "Surah Al-Furqan (25:1–77) to Surah Ash-Shu’ara (26:1–227)", "done": false}, {"reading": "Surah An-Naml (27:1–93) to Surah Al-Qasas (28:1–44)", "done": false}, {"reading": "Surah Al-Qasas (28:45–88) to Surah Al-Ankabut (29:1–69)", "done": false}, {"reading": "Surah Ar-Rum (30:1–60) to Surah Luqman (31:1–34)", "done": false}, {"reading": "Surah As-Sajda (32:1–30) to Surah Ya-Sin (36:1–83)", "done": false}, {"reading": "Surah As-Saffat (37:1–182) to Surah Sad (38:1–88)", "done": false}, {"reading": "Surah Az-Zumar (39:1–75) to Surah Ghafir (40:1–85)", "done": false}, {"reading": "Surah Fussilat (41:1–54) to Surah Ash-Shura (42:1–53)", "done": false}, {"reading": "Surah Az-Zukhruf (43:1–89) to Surah Ad-Dukhan (44:1–59)", "done": false}, {"reading": "Surah Al-Jathiya (45:1–37) to Surah Al-Qamar (54:1–55)", "done": false}, {"reading": "Surah Ar-Rahman (55:1–78) to Surah An-Nas (114:1–6)", "done": false}];

let state = null;
let saveTimer = null;
let saveRetryTimer = null;
let saveRetryDelay = 2000;
let currentUserId = null;
let currentUserEmail = null;
let currentUserFirstName = "";

// ------------------------------------------------------------------
// Supabase — the real backend. The app's data now lives in the
// `app_state` table (one JSON row per user, RLS-walled so nobody can
// read or write anyone else's row) instead of this browser's
// localStorage, so it's the same on every device the moment you sign in.
// The publishable key is safe to ship in client code by design — it can
// only do what the database's row-level security policies allow it to.
// ------------------------------------------------------------------
const SUPABASE_URL = "https://kzdtxlwzlihorrlqmpzb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_S1j4SqujL3N0g-ebTpKFBA_MLTrvJEU";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Resolves once someone is signed in — shows the sign-in/create-account
// screen and waits on it if nobody is yet, otherwise resolves immediately
// with the existing session.
async function requireAuth() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (session) return session;
  return new Promise((resolve) => showAuthGate(resolve));
}

function showAuthGate(onSignedIn) {
  const gate = document.getElementById("auth-gate");
  const bootLoading = document.getElementById("boot-loading");
  if (bootLoading) bootLoading.remove();
  gate.style.display = "flex";

  const form = document.getElementById("auth-gate-form");
  const emailInput = document.getElementById("auth-gate-email");
  const passwordInput = document.getElementById("auth-gate-password");
  const submitBtn = document.getElementById("auth-gate-submit");
  const status = document.getElementById("auth-gate-status");
  const tabs = gate.querySelectorAll(".auth-gate-tab");
  let mode = "signin";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      submitBtn.textContent = mode === "signin" ? "Sign in" : "Create account";
      passwordInput.autocomplete = mode === "signin" ? "current-password" : "new-password";
      status.textContent = "";
      status.classList.remove("err");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    status.classList.remove("err");
    status.textContent = mode === "signin" ? "Signing in…" : "Creating your account…";
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const { data, error } =
      mode === "signin"
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({ email, password });
    if (error) {
      status.textContent = error.message;
      status.classList.add("err");
      submitBtn.disabled = false;
      return;
    }
    if (mode === "signup" && !data.session) {
      // Email confirmation is on for this project — no session yet.
      status.textContent = "Check your email to confirm your account, then sign in.";
      submitBtn.disabled = false;
      return;
    }
    gate.style.display = "none";
    onSignedIn(data.session);
  });

  const googleBtn = document.getElementById("auth-gate-google");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      googleBtn.disabled = true;
      status.classList.remove("err");
      status.textContent = "Redirecting to Google…";
      const { error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + window.location.pathname },
      });
      if (error) {
        status.textContent = error.message;
        status.classList.add("err");
        googleBtn.disabled = false;
      }
      // On success the browser navigates away to Google, then back here —
      // boot()'s requireAuth() picks up the new session on reload.
    });
  }
}

// Returns null ONLY for the one case where a blank slate is actually
// correct: this account genuinely has no row yet (PGRST116 — "no rows
// returned" from .single()). The signup trigger creates that row the
// instant an account is created, so in practice this should only ever
// fire for a brand-new sign-up. Anything else — a dropped connection, a
// timeout, a Supabase hiccup — THROWS instead of returning null. That
// distinction matters: this function used to return null for every kind
// of failure alike, which meant a plain network blip while opening the
// app looked identical to "new account with nothing saved." boot() would
// then start on a blank slate and write it straight back — silently
// overwriting months of real budget/investment/wellness/journal history
// with nothing, all from a moment of bad connectivity. Callers now have
// to handle the thrown error deliberately rather than data loss just
// falling out of an unrelated bug.
async function loadStateFromSupabase(userId) {
  const { data, error } = await sb.from("app_state").select("data").eq("user_id", userId).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data?.data ?? null;
}

// A few retries with short backoff before giving up — most load failures
// at boot are a brief connection hiccup that clears up within a couple
// of seconds, not something worth immediately dropping into an error
// screen over.
async function loadStateWithRetries(userId, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await loadStateFromSupabase(userId);
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
  throw lastErr;
}

// Shown when boot() truly can't reach the account's data after retrying —
// reuses the same boot-loading overlay instead of a separate screen, with
// a manual retry since at this point auto-retrying quietly hasn't worked.
function showBootLoadError() {
  const overlay = document.getElementById("boot-loading");
  if (!overlay) return;
  overlay.classList.remove("hide");
  overlay.innerHTML = `
    <div class="boot-loading-grid"><div></div><div></div><div></div><div></div></div>
    <div class="boot-loading-text" style="max-width:260px; text-align:center; line-height:1.5;">
      Couldn't load your data. This is usually just a dropped connection &mdash; check you're online and try again.
    </div>
    <button type="button" class="btn-primary" id="boot-retry-btn">Try again</button>
  `;
  document.getElementById("boot-retry-btn").addEventListener("click", () => {
    location.reload();
  });
}

// Saving uploads this whole device's in-memory `state` as one JSON blob —
// simple, but it means a save is a blind overwrite. Using the app on two
// devices (or two tabs) close together, whichever one saves LAST wins
// outright: it has no idea what the other device just wrote, so its own
// (older) copy of that data erases it. That's exactly what happened when
// logging today's Cycle phase on one device got silently wiped out by
// the next autosave from another device/tab that never had it in memory.
//
// The fix: before every save, pull the latest remote copy and merge it
// into what's about to be written, record-by-record, for the handful of
// collections that are pure journal entries — added or updated, never
// deleted through the UI (today's wellness record, a day's reading-log
// entry). This device's own field values always win on a shared record,
// but a field or a whole day's entry the OTHER device wrote and this one
// never saw is kept instead of dropped.
//
// Deliberately NOT applied to anything with a delete button (book list
// items, social connections, to-do items, custom sheets themselves) —
// merging those the same way would resurrect an item the instant it's
// deleted, since "missing locally" would look identical to "deleted
// locally." Two devices editing the exact same list within moments of
// each other can still race the old way; this closes the specific gap
// that bit the wellness/cycle log, not every possible collision.
// Folds remote fields into each local record IN PLACE rather than
// building fresh merged objects — anything on screen mid-edit (the
// Cycle sheet holds a direct reference to today's wellness record while
// it's open, same as Home's hero and the Wellness page's own "today"
// variable) is holding onto that exact object. Replacing it with a new
// one the instant a save happens would silently detach whatever's being
// edited from the array doSave() actually uploads next — a tap that
// updates the detached copy would look like it worked (no error, sheet
// closes normally) while never reaching the record that gets saved.
// Only a record local has never seen at all becomes a new array entry,
// since there's no existing object for that one to preserve.
// A field counts as "missing locally" if it's null/undefined/empty —
// NOT merely absent as a key. This mattered concretely for sleepLogs:
// sleepEntryForDate() creates a night's record as { pm: null, am: null }
// the moment either half is first logged, so the OTHER half's key is
// always already present locally (just null) well before it's ever
// filled in on any device. The original `field in existingLocal` check
// treated that null placeholder as "already have it" and refused to
// copy in the real value — so a stale tab (or a different device) that
// still had that half as null, saving for any unrelated reason, would
// silently blank out a sleep entry someone had just finished logging
// elsewhere. This is the bug behind Veronika seeing a morning's sleep
// entry vanish after using both her phone and desktop.
function journalFieldIsMissing(value) {
  return value === null || value === undefined || value === "";
}
function mergeJournalRecords(remoteList, localList, keyFn) {
  const remoteArr = Array.isArray(remoteList) ? remoteList : [];
  const localArr = Array.isArray(localList) ? localList : [];
  const localByKey = new Map(localArr.map((l) => [keyFn(l), l]));
  const merged = [...localArr];
  remoteArr.forEach((r) => {
    const existingLocal = localByKey.get(keyFn(r));
    if (existingLocal) {
      Object.keys(r).forEach((field) => {
        if (journalFieldIsMissing(existingLocal[field]) && !journalFieldIsMissing(r[field])) existingLocal[field] = r[field];
      });
    } else {
      merged.push(r);
    }
  });
  return merged;
}

// A plain settings object (not a journal collection) can't use the
// field-fill merge above — the field is already present locally, just
// possibly stale, so "fill in what's missing" would never pick up a
// genuinely newer edit made on another device. This is what let a
// stale tab's autosave silently revert Veronika's sleep target back to
// the default after she'd changed it elsewhere: whichever device
// saved LAST won, regardless of which one actually held the real edit.
// Comparing `updatedAt` (stamped only when the value is actually
// changed, not on every render) picks the real most-recent edit
// instead of the most-recent save.
function mergeLastWriteWins(remoteVal, localVal) {
  if (!remoteVal) return localVal;
  if (!localVal) return remoteVal;
  return (remoteVal.updatedAt || 0) > (localVal.updatedAt || 0) ? remoteVal : localVal;
}

// Union of two string arrays, local entries first (so local's own
// finish-order is kept) with any remote-only entries appended after.
// Used for lifetime, append-only records like bibleBooksEverFinished,
// where the one thing that must never happen is losing an entry either
// side already has.
function mergeStringArrayUnion(remoteArr, localArr) {
  const local = Array.isArray(localArr) ? localArr : [];
  const remote = Array.isArray(remoteArr) ? remoteArr : [];
  const seen = new Set(local);
  const merged = local.slice();
  remote.forEach((v) => {
    if (!seen.has(v)) {
      seen.add(v);
      merged.push(v);
    }
  });
  return merged;
}

// Union of two "earned date" maps (milestone key -> date first earned) —
// whichever side has an earned date for a key wins; a key earned on only
// one device is never lost by the other device's blind overwrite.
function mergeEarnedDates(remoteObj, localObj) {
  const merged = { ...(localObj || {}) };
  Object.entries(remoteObj || {}).forEach(([key, date]) => {
    if (!merged[key]) merged[key] = date;
  });
  return merged;
}

function mergeRemoteBeforeSave(remote, local) {
  if (!remote) return; // nothing saved yet from anywhere — nothing to merge with
  local.wellness = mergeJournalRecords(remote.wellness, local.wellness, (w) => w.logDate);
  local.learningLog = mergeJournalRecords(remote.learningLog, local.learningLog, (l) => l.date);
  // Each night's record is built up in two halves (pm, then am the next
  // morning) that are often logged from different devices — exactly the
  // shape journalFieldIsMissing above exists to handle correctly.
  local.sleepLogs = mergeJournalRecords(remote.sleepLogs, local.sleepLogs, (s) => s.date);
  local.sleepSettings = mergeLastWriteWins(remote.sleepSettings, local.sleepSettings);
  // Same journal shape as wellness/sleepLogs — added or edited by date,
  // never deleted through the UI — so a check-in logged on one device
  // survives a blind overwrite autosaved from another.
  if (local.sobriety && remote.sobriety) {
    local.sobriety.checkIns = mergeJournalRecords(remote.sobriety.checkIns, local.sobriety.checkIns, (c) => c.date);
  }
  // Cycle periods can be deleted through the UI, so — unlike the journal
  // records above — a stale device must never get to resurrect one a
  // newer device already removed. Whole-object last-write-wins (keyed by
  // state.cycle.updatedAt, bumped on every log/edit/delete) protects a
  // freshly-logged or freshly-edited period from a blind overwrite
  // without ever reviving something intentionally deleted.
  local.cycle = mergeLastWriteWins(remote.cycle, local.cycle);
  // Lifetime Milestones records — permanent by design, so these use
  // union merges rather than last-write-wins: a milestone earned on one
  // device must survive a blind overwrite autosaved from another.
  local.bibleBooksEverFinished = mergeStringArrayUnion(remote.bibleBooksEverFinished, local.bibleBooksEverFinished);
  local.bibleMilestonesEarned = mergeEarnedDates(remote.bibleMilestonesEarned, local.bibleMilestonesEarned);
  local.sleepMilestonesEarned = mergeEarnedDates(remote.sleepMilestonesEarned, local.sleepMilestonesEarned);
  if (local.sobriety && remote.sobriety) {
    local.sobriety.milestonesAllTime = mergeEarnedDates(remote.sobriety.milestonesAllTime, local.sobriety.milestonesAllTime);
    local.sobriety.milestonesCurrent = mergeEarnedDates(remote.sobriety.milestonesCurrent, local.sobriety.milestonesCurrent);
  }
}

async function saveStateToSupabase(userId, stateToSave) {
  const { error } = await sb.from("app_state").upsert({ user_id: userId, data: stateToSave });
  if (error) throw error;
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function nextId() {
  return state.nextId++;
}

// A phone camera photo can easily be several MB straight out of the file
// picker — stored as-is (base64) in localStorage, a couple of those are
// enough to blow past the browser's per-site storage quota, which makes
// EVERY save silently fail afterward (not just the photo — any checkbox,
// anywhere), because the whole state object is written as one JSON blob.
// Downscaling through a canvas before it ever reaches state keeps each
// photo to a few tens of KB, and it's the only thing that goes through
// FileReader now — nothing stores a raw file's dataURL directly.
function resizeImageToDataUrl(file, maxDim = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ------------------------------------------------------------------
// Saving — plain localStorage on this device. No network round-trip,
// no page reload, and nothing for a future code update to collide with.
// ------------------------------------------------------------------
function setSaveIndicator(text, isErr) {
  const ind = document.getElementById("save-indicator");
  if (!ind) return;
  ind.textContent = text;
  ind.classList.toggle("err", Boolean(isErr));
}

// .topbar is position:fixed (see index.html for why), so it's out of
// normal document flow — .shell-body needs a top margin matching its
// real rendered height or content starts underneath it. Height differs
// a little between the desktop and mobile padding, so it's measured
// rather than hardcoded, and re-measured on resize/orientation change.
function syncTopbarHeight() {
  const bar = document.querySelector(".topbar");
  if (!bar) return;
  document.documentElement.style.setProperty("--topbar-h", `${bar.offsetHeight}px`);
}

function scheduleSave() {
  setSaveIndicator("Saving…");
  if (saveTimer) clearTimeout(saveTimer);
  if (saveRetryTimer) {
    clearTimeout(saveRetryTimer);
    saveRetryTimer = null;
  }
  saveRetryDelay = 2000;
  saveTimer = setTimeout(doSave, 300);
}

async function doSave() {
  try {
    const remote = await loadStateFromSupabase(currentUserId);
    mergeRemoteBeforeSave(remote, state);
    await saveStateToSupabase(currentUserId, state);
    // Saves happen constantly and silently — flashing "Saving…" briefly is
    // enough to show something's happening; there's no need for a lingering
    // "Saved" that just sits there taking up space once it's done. A
    // failure is the one state worth calling out, so that stays.
    setSaveIndicator("");
    saveRetryDelay = 2000;
  } catch (err) {
    console.error("Save failed:", err);
    setSaveIndicator("Couldn't save", true);
    // Most failures here are a brief network hiccup (a dropped connection,
    // a slow round-trip) rather than a real problem with the edit itself —
    // retry quietly in the background with backoff rather than leaving the
    // change stranded until some unrelated later edit happens to trigger
    // another save. A newer edit cancels this and starts fresh (see
    // scheduleSave); a successful retry clears the indicator like normal.
    if (saveRetryTimer) clearTimeout(saveRetryTimer);
    saveRetryTimer = setTimeout(doSave, saveRetryDelay);
    saveRetryDelay = Math.min(saveRetryDelay * 2, 30000);
  }
}

// Coming back online after a dropped connection is the single most common
// reason a save failed — retry right away instead of waiting out whatever
// backoff delay happened to be in progress.
window.addEventListener("online", () => {
  if (saveRetryTimer) {
    clearTimeout(saveRetryTimer);
    saveRetryTimer = null;
    doSave();
  }
});

// ------------------------------------------------------------------
// Push notifications — celebratory only (streak milestones, deposit
// milestones) plus one gentle non-urgent evening nudge if pillars are
// still open. The actual decision of what to send and when lives
// server-side (the send-notifications Edge Function, on a cron); this
// client-side half is just: register the service worker that can
// receive a push while the app isn't open, and manage this device's
// subscription (permission + endpoint) in push_subscriptions.
// ------------------------------------------------------------------
const VAPID_PUBLIC_KEY = "BFH67al5heVMTybTkWgshd7zXlvaYULnqokLIxaWs1jkyQamCN533j58AgRrVHJ2O7UdFv_d3fEEt3G1ziFNWrQ";

// Web Push wants the VAPID public key as a raw Uint8Array, but it's only
// ever handed to us (and to the server) as a base64url string.
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

// Registers sw.js as early as possible so it's ready by the time she
// turns notifications on in Settings — a service worker has to be
// registered before pushManager.subscribe() can be called on it.
// Silently no-ops on browsers/contexts without support (e.g. an older
// browser, or Safari on a tab that isn't the installed Home Screen app)
// rather than treating that as an error.
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch((err) => {
    console.error("Service worker registration failed:", err);
  });
}

// navigator.serviceWorker.ready only resolves once a worker actually
// activates for this page — if registration failed (blocked, an
// unsupported context, a slow network) it hangs forever rather than
// rejecting, which would leave the Settings toggle stuck on "Checking…"
// permanently. getRegistration() resolves immediately either way, and a
// short race against .ready covers the ordinary case where the worker
// registered at boot just hasn't finished activating yet by the time the
// user opens Settings.
async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  let reg = await navigator.serviceWorker.getRegistration();
  if (!reg) {
    try {
      reg = await navigator.serviceWorker.register("sw.js");
    } catch (err) {
      return null;
    }
  }
  if (reg.active) return reg;
  return Promise.race([navigator.serviceWorker.ready, new Promise((resolve) => setTimeout(() => resolve(reg), 4000))]);
}

// Current status, for the Settings toggle to render correctly: whether
// push is even possible here, whether permission was granted/denied/not
// asked yet, and whether this specific device already has a live
// subscription row saved.
async function getPushStatus() {
  const supported = "serviceWorker" in navigator && "PushManager" in window;
  if (!supported) return { supported: false, permission: "unsupported", subscribed: false };
  const permission = Notification.permission; // "granted" | "denied" | "default"
  let subscribed = false;
  try {
    const reg = await getServiceWorkerRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    subscribed = !!sub;
  } catch (err) {
    // Service worker not ready yet or not registered — treat as not subscribed.
  }
  return { supported: true, permission, subscribed };
}

// Asks for permission (if not already decided), subscribes this device
// with the VAPID public key, and saves the subscription server-side so
// the notification job can find it. Returns { ok: true } or
// { ok: false, reason } so the Settings UI can show a real message
// instead of a silent failure.
async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, reason: "Push notifications aren't supported in this browser." };
  }
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") {
    return {
      ok: false,
      reason:
        permission === "denied"
          ? "Notifications are blocked for Addley in this browser's settings — you'll need to allow them there first."
          : "Permission wasn't granted.",
    };
  }
  try {
    const reg = await getServiceWorkerRegistration();
    if (!reg) return { ok: false, reason: "Couldn't set up notifications for this browser — please try again." };
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    const { error } = await sb.from("push_subscriptions").upsert(
      { user_id: currentUserId, endpoint: sub.endpoint, subscription: sub.toJSON() },
      { onConflict: "endpoint" }
    );
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error("Push subscribe failed:", err);
    return { ok: false, reason: "Something went wrong turning notifications on — please try again." };
  }
}

// Unsubscribes this device both locally and from push_subscriptions.
// Deliberately only removes THIS device's row (matched by endpoint) —
// turning notifications off on her phone shouldn't silently turn them
// off on a desktop browser she also enabled them on.
async function unsubscribeFromPush() {
  try {
    const reg = await getServiceWorkerRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    if (sub) {
      await sb.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      await sub.unsubscribe();
    }
  } catch (err) {
    console.error("Push unsubscribe failed:", err);
  }
}

// A reorder, a toggle, any edit — scheduleSave() waits 300ms before it even
// starts talking to the network, so switching apps, swiping a mobile
// browser tab away, or closing the tab right after making a change can
// tear the page down before that timer ever fires, silently dropping the
// edit. The tab going hidden (backgrounded) or being torn down are both
// reliable signals that "she might be leaving right now" — flush
// immediately instead of waiting out the debounce, so what's already in
// memory gets sent while the page is still around to send it.
function flushPendingSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
    doSave();
  }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushPendingSave();
});
window.addEventListener("pagehide", flushPendingSave);

// ------------------------------------------------------------------
// Tabs
// ------------------------------------------------------------------
function activateTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${tab}`));
  // All panels share one scrolling container, so switching tabs doesn't
  // naturally reset scroll position — without this, a page opens wherever
  // the previous page happened to be scrolled to, which can land you
  // mid-page or at the bottom of a shorter one.
  const contentEl = document.querySelector(".content");
  if (contentEl) contentEl.scrollTop = 0;
  const homeRow = document.getElementById("home-tab-row");
  if (homeRow) homeRow.classList.toggle("active", tab === "home");
  const homeCircle = document.getElementById("home-tab-circle");
  if (homeCircle) homeCircle.classList.toggle("active", tab === "home");
  // Home always re-renders itself on every switch, so its pillar tiles
  // (and everything absorbed from the old separate Wellness page) are
  // never stale. Sobriety and Cycle need the same treatment now that
  // they're real tabs instead of modals opened fresh each time — a
  // modal always rebuilt itself from scratch on open, so these two
  // need an explicit re-render here to match that.
  if (tab === "home") renderHome();
  if (tab === "sobriety") renderSobrietyPanel();
  if (tab === "cycle") renderCyclePanel();
  state.activeTab = tab;
  scheduleSave();
  // Auto-growing textareas measure scrollHeight, which is 0 while their
  // panel is display:none — recompute now that this panel is visible.
  document.querySelectorAll(`#panel-${tab} textarea.auto-grow`).forEach((t) => {
    t.style.height = "auto";
    t.style.height = t.scrollHeight + "px";
  });
}

function iconSvg(inner) {
  return `<svg class="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

// Same open-eye / eye-slash pair used for sheet visibility in Settings.
function eyeToggleSvg(hidden) {
  return hidden
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
}

function sheetIcon(sheet) {
  if (sheet.kind === "builtin") return BUILTIN_SHEET_META[sheet.id]?.icon || `<circle cx="12" cy="12" r="9"></circle>`;
  const tpl = SHEET_GALLERY.find((g) => g.key === state.customSheets[sheet.id]?.templateKey);
  return tpl ? tpl.icon : `<circle cx="12" cy="12" r="9"></circle>`;
}

function sheetLabel(sheet) {
  if (sheet.kind === "builtin") return BUILTIN_SHEET_META[sheet.id]?.label || sheet.id;
  return state.customSheets[sheet.id]?.label || "Practice";
}

// ------------------------------------------------------------------
// Apps (2026-09 rearchitecture) — every built-in or gallery sheet is one
// of three types now: "practice" (its own streak, any log is a deposit),
// "tracker" (Cycle — state to note, never a streak, never a deposit), or
// "tool" (a plain checklist — Wardrobe, Lists — never dated or tracked).
// Gallery templates carry their type on SHEET_GALLERY/EXTRA_TRACKERS_
// GALLERY; built-in sheets (which have no template) are classified here.
// Budget/Investments/Wellness are none of the three — they sit outside
// the Apps model entirely, same as they always have.
// ------------------------------------------------------------------
const BUILTIN_PRACTICE_IDS = ["bible", "sleep"];
const BUILTIN_TOOL_IDS = ["todo"];

function appTypeForSheet(s) {
  if (s.kind === "builtin") {
    if (BUILTIN_PRACTICE_IDS.includes(s.id)) return "practice";
    if (BUILTIN_TOOL_IDS.includes(s.id)) return "tool";
    return null; // budget, investments, wellness — not part of the Apps model
  }
  const cs = state.customSheets[s.id];
  const tpl = SHEET_GALLERY.find((g) => g.key === cs?.templateKey);
  return tpl ? tpl.type || "practice" : null;
}

// Every currently-added, visible app that belongs on Home's unified grid —
// Practices and Trackers only, never Tools. Sobriety and Cycle aren't
// entries in state.sheets at all (they're extraTrackers), so they're
// folded in here alongside the sheet-backed ones.
// Every currently-visible app that belongs on Home's unified grid —
// Practices, Trackers, AND Tools (Wardrobe, Lists): a Tool never gets a
// streak or a checkmark, but it's still an app you added and should
// still have a tile, same as the plan always intended. This used to
// filter tools out entirely, which is why un-hiding Lists never made
// it reappear on Home — it structurally couldn't show up here no
// matter what its visible flag said.
function currentAppEntries() {
  const entries = [];
  state.sheets.forEach((s) => {
    if (!s.visible) return;
    const type = appTypeForSheet(s);
    if (type === "practice" || type === "tracker" || type === "tool") {
      entries.push({ id: s.id, label: sheetLabel(s), icon: sheetIcon(s), type });
    }
  });
  if (state.extraTrackers?.sobriety && !state.extraTrackers?.hidden?.sobriety) {
    const tpl = EXTRA_TRACKERS_GALLERY.find((t) => t.key === "sobriety");
    entries.push({ id: "sobriety", label: "Sobriety", icon: tpl?.icon, type: "practice" });
  }
  if (state.extraTrackers?.cycle && !state.extraTrackers?.hidden?.cycle) {
    const tpl = EXTRA_TRACKERS_GALLERY.find((t) => t.key === "cycle");
    entries.push({ id: "cycle", label: "Cycle", icon: tpl?.icon, type: "tracker" });
  }
  return entries;
}

function currentPracticeAppIds() {
  return currentAppEntries()
    .filter((e) => e.type === "practice")
    .map((e) => e.id);
}

// Did she log something today in this particular space? The real,
// per-template "was this actually logged today" check — reused directly
// by isAppLoggedToday below for every sheet-backed Practice, since each
// template's dated-log shape is already known here.
function sheetActiveToday(sheetId, today) {
  if (sheetId === "bible") {
    return state.bible.some((r) => r.done && r.completedDate === today);
  }
  if (sheetId === "sleep") {
    // Sleep protected is an outcome, not just a logged action — logging a
    // rough, short night shouldn't count the same as a real one. "Today"
    // reads on last night specifically, since that's what a morning log
    // is actually reporting on.
    const nightEntry = state.sleepLogs.find((e) => e.date === addDays(today, -1));
    return sleepNightProtected(nightEntry);
  }
  const cs = state.customSheets[sheetId];
  if (cs && cs.templateKey === "books") {
    // Books don't have a "done today" shape the way a checklist does —
    // finishing a whole book is rare, but reading is meant to be daily.
    // Learning completes off a real reading-log entry (which book, what
    // chapter) logged from inside the Book List panel — see
    // renderBookSheet / openReadingLogModal.
    return (state.learningLog || []).some((e) => e.date === today);
  }
  if (cs && cs.templateKey === "social") {
    // Social connection completes off a real logged entry today — who,
    // what, when — not a flat yes/no toggle.
    return cs.items.some((i) => i.date === today);
  }
  if (cs && cs.templateKey === "activity") {
    // Same shape as Social: a real logged activity today, not a toggle.
    return cs.items.some((i) => i.date === today);
  }
  if (cs && (cs.templateKey === "prayer" || cs.templateKey === "breathe")) {
    // Same shape again — a real logged entry (a prayer tapped, a breathing
    // session saved) today, not a toggle.
    return cs.items.some((i) => i.date === today);
  }
  if (cs && cs.templateKey === "workout") {
    // A week/day slot has no calendar date of its own — day.lastLoggedDate
    // is what actually gets stamped the moment a set's Actual is filled
    // in (see renderWorkoutExercise), so that's what "today" reads on
    // here. Without this branch, logging a workout never marked Movement
    // done at all — it fell through to the generic items/completedDate
    // fallback below, which doesn't apply to Workout Log's shape.
    return workoutLoggedDatesSet(cs).has(today);
  }
  if (cs && cs.templateKey === "mealLog") {
    // Not just "logged something" — mirrors Sleep protected: only counts
    // once today has a real Nourishing/Balanced entry. See the block
    // comment above the Meal Log completion helpers for why.
    return mealLogDayQualifies(cs, today);
  }
  if (!cs || !Array.isArray(cs.items)) return false;
  return cs.items.some((i) => i.done && i.completedDate === today);
}

// ------------------------------------------------------------------
// Pillar activity — historical record of one real record per pillar per
// day it was marked Yes under the old six-pillar model. Pillars
// themselves are retired (2026-09), but Trends/History still read this
// data for days already logged before the cutover (see the plan: past
// days display exactly as they were logged, never rewritten), and
// openWellnessDayEditor still lets a past day's manual pillar note be
// corrected. `source` is either "manual" or the id of the space that
// triggered it.
// ------------------------------------------------------------------
function pillarActivityFor(pillar, date) {
  return state.pillarActivity.find((a) => a.pillar === pillar && a.date === date);
}

// Idempotent — replaces whatever was recorded for this pillar+day, since
// there's only ever one real explanation for a given day's Yes.
function setPillarActivity(pillar, date, label, source) {
  state.pillarActivity = state.pillarActivity.filter((a) => !(a.pillar === pillar && a.date === date));
  state.pillarActivity.push({ id: nextId(), pillar, date, label: label || null, source });
}

function clearPillarActivity(pillar, date) {
  state.pillarActivity = state.pillarActivity.filter((a) => !(a.pillar === pillar && a.date === date));
}

// A space's own label, for attributing an auto-detected day (e.g. "via
// Workout Log") — separate from a manual entry's freeform label.
function labelForActivitySource(source) {
  if (!source || source === "manual") return null;
  const sheet = state.sheets.find((s) => s.id === source);
  return sheet ? sheetLabel(sheet) : null;
}

// Chips for the quick-log sheet: this pillar's own history of manual
// labels, most recent distinct label first.
function pillarManualLabelHistory(key) {
  const seen = new Set();
  const labels = [];
  [...state.pillarActivity]
    .filter((a) => a.pillar === key && a.source === "manual" && a.label)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .forEach((a) => {
      const k = a.label.trim().toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        labels.push(a.label);
      }
    });
  return labels.slice(0, 4);
}

// Did this app get a real log on `date`? Reuses sheetActiveToday for every
// sheet-backed practice (it already knows each template's real dated-log
// shape); Sobriety is the one practice with no sheet behind it, so it
// reads its own check-in list directly.
function isAppLoggedToday(appId, date) {
  if (appId === "sobriety") return (state.sobriety?.checkIns || []).some((c) => c.date === date);
  return sheetActiveToday(appId, date);
}

function isAppDayPositiveWithGrace(appId, date) {
  if (isAppLoggedToday(appId, date)) return true;
  return !!(state.grace && state.grace.coveredDates[`${appId}|${date}`]);
}

// A Practice's own streak, computed straight from its own dated records —
// no combined/overall streak anymore. Today not being logged yet doesn't
// break yesterday's streak, same rule as the old pillar streak.
function appCurrentStreak(appId, today) {
  let streak = 0;
  let cursor = isAppLoggedToday(appId, today) ? today : addDays(today, -1);
  while (isAppDayPositiveWithGrace(appId, cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Credits a reward deposit for every Practice logged today that hasn't
// already been credited — replaces the old pillar-flips-to-Yes trigger.
// state.practiceDeposits is a permanent {"<appId>|<date>": true} ledger so
// re-rendering Home never double-credits the same day's log.
function applyPracticeDepositsForToday(today) {
  state.practiceDeposits ||= {};
  let changed = false;
  currentPracticeAppIds().forEach((id) => {
    const ledgerKey = `${id}|${today}`;
    if (state.practiceDeposits[ledgerKey]) return;
    if (isAppLoggedToday(id, today)) {
      state.practiceDeposits[ledgerKey] = true;
      awardRewardForPracticeLog();
      changed = true;
    }
  });
  if (changed) scheduleSave();
}

// Recalculates the per-log reward rate off the current Practice count —
// called whenever a Practice is added, removed, or hidden. See
// computeDollarPerLog for the formula (cycleLengthDays × practice count ×
// 0.5, spread evenly across the cycle).
function recomputeRewardDollarPerLog() {
  const prize = state.veronikasPrize;
  if (!prize || !prize.depositGoal) return;
  prize.dollarPerLog = computeDollarPerLog(prize.depositGoal, prize.cycleLengthDays, currentPracticeAppIds().length);
  scheduleSave();
}

// Home sits fixed, dead center, on the mobile bar. Only the first
// MOBILE_PINNED_COUNT visible sheets render as bottom-bar icons on
// mobile (via CSS hiding anything past that count) — split evenly
// across the two strips flanking Home so it actually looks centered,
// not crowded to one side. No scrolling either way, nothing to swipe
// past. Whatever doesn't fit shows up instead in the top menu, alongside
// Settings and Appearance. On desktop every visible sheet just flows
// straight into the one sidebar list, in original order, since there's
// room for all of them — the left/right split only matters on mobile.
const MOBILE_PINNED_COUNT = 4;

function renderNav() {
  const leftNav = document.getElementById("tabs-nav-left");
  const rightNav = document.getElementById("tabs-nav-right");
  if (!leftNav || !rightNav) return;
  leftNav.innerHTML = "";
  rightNav.innerHTML = "";

  // Sobriety and Cycle are real tabs now, same as Bible/Sleep/every
  // other app — so they need to actually show up here, not just be
  // reachable from My Apps/Home. Building this list off state.appOrder
  // (Practices/Trackers/Tools, in the order Settings → My Apps already
  // lets you drag) is also what makes that drag order finally mean
  // something: before this, reordering My Apps only relabeled which
  // row showed a "Bar" badge — the real nav bar underneath, built
  // straight from state.sheets, never actually moved. Budget and
  // Investments aren't part of the Apps model at all (appTypeForSheet
  // returns null for them), so they're appended after, in their
  // existing order, same as always.
  ensureAppOrder();
  const seen = new Set();
  const visible = [];
  state.appOrder.forEach((id) => {
    const d = appRowDescriptor(id);
    if (d && d.visible) {
      visible.push(d);
      seen.add(id);
    }
  });
  state.sheets.forEach((s) => {
    if (s.id === "wellness" || seen.has(s.id) || !s.visible) return;
    visible.push({ id: s.id, label: sheetLabel(s), icon: sheetIcon(s) });
  });

  const pinnedCount = Math.min(visible.length, MOBILE_PINNED_COUNT);
  const splitAt = Math.ceil(pinnedCount / 2);
  const tabBtn = (d, overflow) =>
    el(`<button class="tab-btn${overflow ? " tab-btn-overflow" : ""}" data-tab="${d.id}">${iconSvg(d.icon || `<circle cx="12" cy="12" r="9"></circle>`)}<span>${escapeHtml(d.label)}</span></button>`);
  visible.forEach((d, i) => {
    const btn = tabBtn(d, i >= MOBILE_PINNED_COUNT);
    (i < splitAt ? leftNav : rightNav).appendChild(btn);
  });
  renderMenuOverflow(visible.slice(MOBILE_PINNED_COUNT));
}

// The apps that didn't make the cut for the mobile bottom bar — listed
// in the same top menu that already holds Settings/Appearance, right
// above them, with a small "More sheets" label. CSS hides this whole
// section on desktop, where the sidebar already shows everything.
function renderMenuOverflow(overflowApps) {
  const section = document.getElementById("menu-sheets-section");
  const list = document.getElementById("menu-sheets-list");
  if (!section || !list) return;
  list.innerHTML = "";
  overflowApps.forEach((d) => {
    const item = el(`
      <button type="button" class="menu-item menu-sheet-item" data-tab="${d.id}">
        ${iconSvg(d.icon || `<circle cx="12" cy="12" r="9"></circle>`)}
        <div>${escapeHtml(d.label)}</div>
      </button>
    `);
    item.addEventListener("click", () => {
      activateTab(d.id);
      document.getElementById("main-menu-dropdown")?.classList.remove("open");
    });
    list.appendChild(item);
  });
  section.classList.toggle("has-items", overflowApps.length > 0);
}

function rebuildNav() {
  renderNav();
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });
}

function ensureCustomPanels() {
  const main = document.querySelector("main.content");
  const settingsPanel = document.getElementById("panel-settings");
  if (!main) return;
  Object.keys(state.customSheets).forEach((id) => {
    if (!document.getElementById(`panel-${id}`)) {
      const section = document.createElement("section");
      section.id = `panel-${id}`;
      section.className = "panel";
      main.insertBefore(section, settingsPanel);
    }
  });
}

function initTabs() {
  rebuildNav();
  renderAccountAvatar();
  const avatarBtn = document.getElementById("account-avatar-btn");
  if (avatarBtn) avatarBtn.addEventListener("click", () => openAccountSheet());
  const brandBtn = document.getElementById("brand-home-btn");
  if (brandBtn) brandBtn.addEventListener("click", () => activateTab("home"));
  const homeRow = document.getElementById("home-tab-row");
  const homeCircle = document.getElementById("home-tab-circle");
  if (homeRow) homeRow.addEventListener("click", () => activateTab("home"));
  if (homeCircle) homeCircle.addEventListener("click", () => activateTab("home"));
  const validTabs = state.sheets
    .filter((s) => s.visible)
    .map((s) => s.id)
    .concat(["settings", "appearance", "home"]);
  if (state.extraTrackers?.sobriety) validTabs.push("sobriety");
  if (state.extraTrackers?.cycle) validTabs.push("cycle");
  let target = state.activeTab || "home";
  if (!validTabs.includes(target)) target = "home";
  activateTab(target);
}

function renderAll() {
  ensureCustomPanels();
  renderHome();
  renderLists();
  renderBudget();
  renderInvestments();
  renderBible();
  renderSleep();
  if (state.extraTrackers?.sobriety) renderSobrietyPanel();
  if (state.extraTrackers?.cycle) renderCyclePanel();
  Object.keys(state.customSheets).forEach((id) => renderCustomSheet(id));
  renderAppearance();
  renderSettings();
}

// ------------------------------------------------------------------
// Settings — reorder / hide / remove sheets, add new ones from the gallery
// ------------------------------------------------------------------
function confirmModal(title, message, confirmLabel, onConfirm) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-danger modal-confirm">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.querySelector(".modal-confirm").addEventListener("click", () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Account — profile sheet behind the top-right avatar. Sign out lives
// only here, deliberately, so it's never one accidental tap away from
// the everyday nav (Settings/Appearance in the hamburger menu are about
// the app's spaces, not the account itself).
// ------------------------------------------------------------------
function accountInitial() {
  const source = currentUserEmail || "";
  return source ? source[0].toUpperCase() : "?";
}

function renderAccountAvatar() {
  const btn = document.getElementById("account-avatar-btn");
  if (btn) btn.textContent = accountInitial();
}

// "You" — the single destination behind the avatar, replacing both the old
// hamburger and the old Account sheet. One icon, one flat list: spaces/app
// content up top (the stuff you'll open most from here), identity/billing
// below, Sign out last. Matches the reference apps Veronika pointed to
// (Etsy's "You" tab, Slack's account sheet) rather than splitting settings
// and account across two separate top-right icons.
function openAccountSheet() {
  const acct = state.account || { plan: "free", planLabel: "Free", isFounder: false, unlimitedSpaces: false };
  const statusPill = acct.isFounder
    ? "Founder account &middot; full access to everything"
    : `${escapeHtml(acct.planLabel || "Free")} plan`;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box you-page">
        <div class="info-modal-header">
          <h3>You</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="account-modal-header-row">
          <div class="account-avatar-lg">${accountInitial()}</div>
          <div>
            <div class="account-email">${escapeHtml(currentUserEmail || "")}</div>
            <div class="account-plan-badge${acct.isFounder ? " founder" : ""}">${escapeHtml(acct.planLabel || "Free")}</div>
          </div>
        </div>
        <div class="you-status-pill">${statusPill}</div>

        <div class="you-identity-label">Who do you say you are?</div>
        <div id="you-identity-quote-slot"></div>
        <div class="you-list-divider"></div>

        <div class="you-list-group-title">Apps</div>
        <button type="button" class="you-list-row" id="you-my-apps-row">
          ${iconSvg('<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect>')}
          <span>My Apps</span>
        </button>
        <button type="button" class="you-list-row" id="you-marketplace-row">
          ${iconSvg('<path d="M5 8l1.5-4h11L19 8"></path><path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z"></path><path d="M9 12a3 3 0 0 0 6 0"></path>')}
          <span>Marketplace</span>
        </button>

        <div class="you-list-group-title">Preferences</div>
        <button type="button" class="you-list-row" id="you-appearance-row">
          ${iconSvg('<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>')}
          <span>Appearance</span>
        </button>
        <button type="button" class="you-list-row" id="you-notifications-row">
          ${iconSvg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>')}
          <span>Notifications</span>
        </button>
        <button type="button" class="you-list-row" id="account-grace-btn">
          ${graceFeatherSvg()}
          <span>Grace Days</span>
        </button>

        <div class="you-list-group-title">Money</div>
        <button type="button" class="you-list-row" id="account-reward-btn">
          ${iconSvg(rewardCupcakeSvg())}
          <span>Your Reward</span>
        </button>
        <button type="button" class="you-list-row" id="account-billing-btn">
          ${iconSvg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>')}
          <span>Plan &amp; Billing</span>
        </button>

        <div class="you-list-group-title">Session</div>
        <button type="button" class="you-list-row" id="account-password-btn">
          ${iconSvg('<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>')}
          <span>Email &amp; password</span>
        </button>
        <button type="button" class="you-list-row danger" id="account-signout-btn">
          ${iconSvg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>')}
          <span>Sign out</span>
        </button>
      </div>
    </div>
  `);
  renderIdentityQuote(overlay.querySelector("#you-identity-quote-slot"), false);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector("#you-my-apps-row").addEventListener("click", () => {
    close();
    settingsSubTab = "mine";
    activateTab("settings");
  });
  overlay.querySelector("#you-marketplace-row").addEventListener("click", () => {
    close();
    settingsSubTab = "gallery";
    activateTab("settings");
  });
  overlay.querySelector("#you-appearance-row").addEventListener("click", () => {
    close();
    activateTab("appearance");
  });
  overlay.querySelector("#you-notifications-row").addEventListener("click", () => {
    close();
    openNotificationsModal();
  });
  overlay.querySelector("#account-password-btn").addEventListener("click", () => {
    close();
    openChangePasswordModal();
  });
  overlay.querySelector("#account-billing-btn").addEventListener("click", () => {
    close();
    openBillingModal();
  });
  overlay.querySelector("#account-grace-btn").addEventListener("click", () => {
    close();
    openGraceDaysModal();
  });
  overlay.querySelector("#account-reward-btn").addEventListener("click", () => {
    close();
    openYourRewardScreen();
  });
  const signOutBtn = overlay.querySelector("#account-signout-btn");
  signOutBtn.addEventListener("click", async () => {
    signOutBtn.disabled = true;
    signOutBtn.querySelector("span").textContent = "Signing out…";
    try {
      await sb.auth.signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
    location.reload();
  });
  document.body.appendChild(overlay);
}

// Reached only from Account → "Email & password". Email changes go through
// Supabase's confirmation-email flow, which isn't wired up yet, so for now
// this only handles the password half — real and functional, not a stub.
function openChangePasswordModal() {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Email &amp; password</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="account-section" style="border-top:none;padding-top:4px;">
          <div class="account-section-label">Email</div>
          <div class="account-note">${escapeHtml(currentUserEmail || "")}</div>
        </div>
        <div class="account-section">
          <div class="account-section-label">New password</div>
          <input type="password" class="text-input" id="account-new-password" placeholder="At least 8 characters" style="width:100%;margin-bottom:8px;" />
          <input type="password" class="text-input" id="account-confirm-password" placeholder="Confirm new password" style="width:100%;" />
        </div>
        <div class="account-password-status" id="account-password-status" style="font-size:12.5px;min-height:16px;margin:2px 2px 4px;"></div>
        <div class="account-section" style="border-top:none;padding-top:0;">
          <button type="button" class="account-btn" id="account-password-save" style="justify-content:center;background:var(--accent-dark);color:#fff;border-color:var(--accent-dark);">
            <span>Save new password</span>
          </button>
        </div>
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  const status = overlay.querySelector("#account-password-status");
  const saveBtn = overlay.querySelector("#account-password-save");
  saveBtn.addEventListener("click", async () => {
    const pw = overlay.querySelector("#account-new-password").value;
    const confirm = overlay.querySelector("#account-confirm-password").value;
    status.style.color = "var(--muted)";
    if (pw.length < 8) {
      status.style.color = "#8C3F2B";
      status.textContent = "Password needs to be at least 8 characters.";
      return;
    }
    if (pw !== confirm) {
      status.style.color = "#8C3F2B";
      status.textContent = "Passwords don't match.";
      return;
    }
    saveBtn.disabled = true;
    status.textContent = "Saving…";
    try {
      const { error } = await sb.auth.updateUser({ password: pw });
      if (error) throw error;
      status.style.color = "var(--good)";
      status.textContent = "Password updated.";
      setTimeout(close, 900);
    } catch (err) {
      console.error("Password update failed:", err);
      status.style.color = "#8C3F2B";
      status.textContent = "Couldn't update password — try again.";
      saveBtn.disabled = false;
    }
  });
  document.body.appendChild(overlay);
}

// Reached only from Account → "Plan & Billing". This is the one place
// price, payment method, and plan changes live — a founder account has
// nothing to manage here since access was granted directly, but the shape
// below is what a real subscriber will see once billing is connected.
function openBillingModal() {
  const acct = state.account || { plan: "free", planLabel: "Free", isFounder: false };
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Plan &amp; Billing</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        ${
          acct.isFounder
            ? `<div class="account-section" style="border-top:none;padding-top:4px;">
                <div class="account-section-label">Current plan</div>
                <div class="account-note" style="border-color:var(--accent);background:var(--bg);">
                  <strong style="color:var(--text);">Founder — Full Access</strong><br/>
                  Granted personally — every practice, no subscription, nothing to manage here.
                </div>
              </div>`
            : `<div class="account-section" style="border-top:none;padding-top:4px;">
                <div class="account-section-label">Current plan</div>
                <div class="account-note"><strong style="color:var(--text);">${escapeHtml(acct.planLabel || "Free")}</strong></div>
              </div>
              <div class="account-section">
                <button type="button" class="account-btn" disabled>
                  <span>Change plan</span>
                  <span>&rsaquo;</span>
                </button>
              </div>
              <div class="account-section">
                <button type="button" class="account-btn danger" disabled>
                  <span>Cancel subscription</span>
                </button>
              </div>
              <div class="account-note" style="margin-top:2px;">Billing isn't connected yet — these will work once real subscriptions launch.</div>`
        }
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

// Reached from Account → "Grace Days", right next to Plan & Billing since
// free/paid earn at different rates — the one other place that
// distinction shows up. Read-only: the bank fills and drains from
// reconcileGraceDays() during boot, nothing here is editable.
function openGraceDaysModal() {
  const g = state.grace || { banked: 0 };
  const isPaid = state.account?.plan === "paid" || state.account?.isFounder;
  const tokensHtml = Array.from({ length: GRACE_BANK_CAP })
    .map((_, i) => `<div class="grace-token ${i < g.banked ? "filled" : "empty"}">${i < g.banked ? graceFeatherSvg() : ""}</div>`)
    .join("");
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3 style="display:flex;align-items:center;gap:10px;">
            <span class="grace-token-icon-badge">${graceFeatherSvg()}</span>
            Grace Days
          </h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="account-section" style="border-top:none;padding-top:4px;">
          <div class="account-note">You're covered for up to ${GRACE_BANK_CAP} missed days — vacations, sick days, life. They bank month to month, so unused days aren't lost, and each Practice's streak gets its own coverage.</div>
        </div>
        <div class="account-section">
          <div class="grace-token-row">${tokensHtml}</div>
          <div class="grace-token-caption">${g.banked} of ${GRACE_BANK_CAP} banked</div>
        </div>
        <div class="account-section" style="display:flex;flex-direction:column;gap:0;">
          <div class="grace-earn-row"><span>Monthly earn rate</span><b>${isPaid ? "+2" : "+1"} / month</b></div>
          <div class="grace-earn-row"><span>Bonus for long streaks</span><b>+1 at every streak milestone, 30 days on</b></div>
          <div class="grace-earn-row"><span>Bank limit</span><b>${GRACE_BANK_CAP} days</b></div>
        </div>
        ${!isPaid ? `<div class="account-note" style="margin-top:2px;">Upgrading doubles your monthly earn rate — the bank limit stays the same for everyone.</div>` : ""}
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function openPhotoLightbox(src) {
  const overlay = el(`
    <div class="modal-overlay photo-lightbox-overlay">
      <button type="button" class="icon-btn photo-lightbox-close" aria-label="Close">${closeSvg}</button>
      <img class="photo-lightbox-img" src="${src}" alt="" />
    </div>
  `);
  overlay.querySelector(".photo-lightbox-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// Drag-and-drop reorder in Settings.
let draggedSheetId = null;

function reorderSheet(draggedId, targetId, before) {
  const fromIdx = state.sheets.findIndex((s) => s.id === draggedId);
  if (fromIdx < 0) return;
  const [item] = state.sheets.splice(fromIdx, 1);
  let targetIdx = state.sheets.findIndex((s) => s.id === targetId);
  if (targetIdx < 0) targetIdx = state.sheets.length;
  const insertAt = before ? targetIdx : targetIdx + 1;
  state.sheets.splice(insertAt, 0, item);
  scheduleSave();
  rebuildNav();
  renderSettings();
}

// Drag-and-drop reorder for budget line items — kept within the same
// section, since sections are their own visual groups.
let draggedBudgetItemId = null;

function reorderBudgetItem(draggedId, targetId, before) {
  const draggedIdx = state.budget.findIndex((b) => b.id === draggedId);
  const targetIdx = state.budget.findIndex((b) => b.id === targetId);
  if (draggedIdx < 0 || targetIdx < 0) return;
  if (state.budget[draggedIdx].section !== state.budget[targetIdx].section) return;
  const [item] = state.budget.splice(draggedIdx, 1);
  let newTargetIdx = state.budget.findIndex((b) => b.id === targetId);
  const insertAt = before ? newTargetIdx : newTargetIdx + 1;
  state.budget.splice(insertAt, 0, item);
  scheduleSave();
  renderBudget();
}

// Drag-and-drop reorder for financial goals.
let draggedGoalId = null;

function reorderGoal(draggedId, targetId, before) {
  const ordered = state.goals.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const fromIdx = ordered.findIndex((g) => g.id === draggedId);
  if (fromIdx < 0) return;
  const [item] = ordered.splice(fromIdx, 1);
  let targetIdx = ordered.findIndex((g) => g.id === targetId);
  if (targetIdx < 0) targetIdx = ordered.length;
  const insertAt = before ? targetIdx : targetIdx + 1;
  ordered.splice(insertAt, 0, item);
  ordered.forEach((g, i) => (g.sortOrder = i));
  scheduleSave();
  renderBudget();
}

function toggleSheetVisible(id) {
  const s = state.sheets.find((x) => x.id === id);
  if (!s) return;
  s.visible = !s.visible;
  scheduleSave();
  recomputeRewardDollarPerLog();
  rebuildNav();
  renderSettings();
  if (!s.visible && state.activeTab === id) {
    const fallback = state.sheets.find((x) => x.visible);
    activateTab(fallback ? fallback.id : "home");
  }
}

// Tiered space cap — Free and Paid are real product tiers, Founder is
// Veronika's own account so she can test different space templates
// without deleting data to make room. Counts every visible space except
// Wellness, since Wellness isn't really a separate space anymore — Home
// absorbed it (see homeAbsorbsWellnessV1Applied above) — it's just a
// hidden data source now, not something you navigate to or add more of.
function spaceCapForAccount() {
  const acct = state.account || {};
  if (acct.isFounder) return 30;
  if (acct.plan === "paid") return 15;
  return 6;
}
// Wellness, Budget, and Investments sit outside the pillar/practice system
// entirely — they're not one of the six pillars' practices, so they don't
// count against the free/paid practice cap, the same way Wellness already
// didn't. Bible is excluded too: it's a legacy extra on top of Spiritual's
// real starter choices (Prayer/Qur'an/Breathe), not one of the six.
function countedSpaces() {
  const EXCLUDED = new Set(["wellness", "budget", "investments", "bible"]);
  return state.sheets.filter((s) => s.visible && !EXCLUDED.has(s.id)).length;
}

// A small, reusable "you're at your limit" modal — never a silent block.
// Names the exact next tier and how many more spaces it buys.
function openSpaceCapModal() {
  const acct = state.account || {};
  const limit = spaceCapForAccount();
  const nextTierLabel = acct.plan === "paid" || acct.isFounder ? null : "Paid";
  const nextTierLimit = 15;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box" style="max-width:360px;text-align:center;">
        <div style="font-size:26px;margin-bottom:8px;">🔒</div>
        <h3 style="margin:0 0 8px;">You've used all ${limit} practices</h3>
        <p class="muted" style="margin:0 0 18px;line-height:1.5;">
          ${
            nextTierLabel
              ? `Upgrade to ${nextTierLabel} for ${nextTierLimit} practices total — double the room, same habit tracking. Or remove a practice in My Practices to make room.`
              : `Remove a practice in My Practices to make room for a new one.`
          }
        </p>
        <button type="button" class="btn-primary" style="width:100%;">${nextTierLabel ? `See ${nextTierLabel} plan` : "Manage my practices"}</button>
        <button type="button" class="btn-ghost" style="width:100%;margin-top:8px;">Close</button>
      </div>
    </div>
  `);
  overlay.querySelector(".btn-primary").addEventListener("click", () => {
    overlay.remove();
    settingsSubTab = "mine";
    activateTab("settings");
  });
  overlay.querySelector(".btn-ghost").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

function addSheetFromTemplate(tpl) {
  if (countedSpaces() >= spaceCapForAccount()) {
    openSpaceCapModal();
    return;
  }
  createSheetFromTemplateUnchecked(tpl);
}

// The actual sheet-creation logic, without the space-cap gate. Used by
// addSheetFromTemplate (Gallery "+ Add", cap-checked) and by onboarding
// (which is establishing the free tier's starter six, not spending down
// an already-set quota — it shouldn't be able to trip its own cap).
function createSheetFromTemplateUnchecked(tpl) {
  const id = `sheet_${nextId()}`;
  const isWardrobe = tpl.key === "wardrobe";
  const isQuran = tpl.key === "quran";
  const isBooks = tpl.key === "books";
  const isWorkout = tpl.key === "workout";
  const isSocial = tpl.key === "social";
  const isActivity = tpl.key === "activity";
  const isMealLog = tpl.key === "mealLog";
  const isPrayer = tpl.key === "prayer";
  const isBreathe = tpl.key === "breathe";
  state.customSheets[id] = {
    label: tpl.label,
    templateKey: tpl.key,
    items: isWardrobe
      ? seedWardrobeItems()
      : isQuran
      ? seedQuranItems()
      : isBooks
      ? seedBookItems()
      : isWorkout || isSocial || isActivity || isMealLog || isPrayer || isBreathe
      ? []
      : tpl.starterItems.map((text) => ({ id: nextId(), text, done: false })),
    ...(isWardrobe ? { wardrobeSchemaV: 2, openCategories: {}, activeSeason: null } : {}),
    ...(isQuran ? { quranSchemaV: 1, quranSettings: { startDate: todayISO() } } : {}),
    ...(isBooks ? { booksSchemaV: 1, openCategories: {}, activeStatus: "toread" } : {}),
    ...(isWorkout ? seedWorkoutSheetData() : {}),
    ...(isSocial ? { socialSchemaV: 2, people: [] } : {}),
    ...(isActivity ? { activitySchemaV: 1, customTypes: [], weeklyGoalMinutes: ACTIVITY_WEEKLY_GOAL_DEFAULT } : {}),
    ...(isMealLog ? { mealLogSchemaV: 1 } : {}),
    ...(isPrayer ? { prayerSchemaV: 1, milestonesEarned: {} } : {}),
    ...(isBreathe ? { breatheSchemaV: 1, milestonesEarned: {}, soundVoice: "pad" } : {}),
  };
  state.sheets.push({ id, kind: "custom", visible: true });
  scheduleSave();
  recomputeRewardDollarPerLog();
  ensureCustomPanels();
  renderCustomSheet(id);
  rebuildNav();
  renderSettings();
}

// Dispatches to the right renderer for a custom sheet — most gallery
// templates are a plain checklist, but Capsule Wardrobe, the Quran
// Reading Plan, and the Book List each have their own richer shape.
function renderCustomSheet(id) {
  const sheet = state.customSheets[id];
  if (sheet && sheet.templateKey === "wardrobe" && sheet.wardrobeSchemaV === 2) {
    renderWardrobeSheet(id);
  } else if (sheet && sheet.templateKey === "quran" && sheet.quranSchemaV === 1) {
    renderQuranSheet(id);
  } else if (sheet && sheet.templateKey === "books" && sheet.booksSchemaV === 1) {
    renderBookSheet(id);
  } else if (sheet && sheet.templateKey === "workout" && sheet.workoutSchemaV === 1) {
    renderWorkoutSheet(id);
  } else if (sheet && sheet.templateKey === "social") {
    renderSocialSheet(id);
  } else if (sheet && sheet.templateKey === "activity") {
    renderActivitySheet(id);
  } else if (sheet && sheet.templateKey === "mealLog") {
    renderMealLogSheet(id);
  } else if (sheet && sheet.templateKey === "prayer") {
    renderPrayerSheet(id);
  } else if (sheet && sheet.templateKey === "breathe") {
    renderBreatheSheet(id);
  } else {
    renderChecklistSheet(id);
  }
}

// isPinnedSheet is defined further down (see toolbarAppIds) — the
// Practices-only toolbar rule needs appTypeForSheet/state.appOrder, both
// of which live with the rest of the My Apps machinery.

function removeCustomSheet(id) {
  if (isPinnedSheet(id)) return;
  state.sheets = state.sheets.filter((s) => s.id !== id);
  delete state.customSheets[id];
  const panelEl = document.getElementById(`panel-${id}`);
  if (panelEl) panelEl.remove();
  scheduleSave();
  recomputeRewardDollarPerLog();
  rebuildNav();
  renderSettings();
  if (state.activeTab === id) {
    const fallback = state.sheets.find((x) => x.visible);
    activateTab(fallback ? fallback.id : "home");
  }
}

// Unlike a gallery sheet (Wardrobe/Books/Quran/...), a built-in sheet isn't
// backed by a template — there's nowhere in the Gallery to add it back from.
// Removing one wipes its underlying data for good, not just its tab.
function removeBuiltinSheet(id) {
  if (isPinnedSheet(id)) return;
  if (id === "todo") {
    state.lists = [];
    state.activeListId = null;
  }
  if (id === "budget") {
    state.budget = [];
    state.goals = [];
  }
  if (id === "investments") state.investmentAccounts = [];
  if (id === "bible") state.bible = [];
  if (id === "wellness") state.wellness = [];
  if (id === "sleep") state.sleepLogs = [];
  // Mark it as deliberately deleted, not just "missing" — otherwise boot()'s
  // own backfill (which re-adds any built-in sheet id it doesn't find, to
  // heal an old/incomplete save) would silently bring it right back on
  // the next reload.
  state.deletedBuiltinSheets ||= [];
  if (!state.deletedBuiltinSheets.includes(id)) state.deletedBuiltinSheets.push(id);
  state.sheets = state.sheets.filter((s) => s.id !== id);
  const panelEl = document.getElementById(`panel-${id}`);
  if (panelEl) panelEl.remove();
  scheduleSave();
  recomputeRewardDollarPerLog();
  rebuildNav();
  renderSettings();
  if (state.activeTab === id) {
    const fallback = state.sheets.find((x) => x.visible);
    activateTab(fallback ? fallback.id : "home");
  }
}

// ------------------------------------------------------------------
// Appearance — color themes. Type stays the same everywhere; only the
// CSS variables (bg/surface/accent/etc.) swap, defined in index.html.
// ------------------------------------------------------------------
const THEMES = [
  { key: "cream", name: "Warm Cream", swatch: ["#F7F3EC", "#FFFFFF", "#A9804F"] },
  { key: "slate", name: "Slate", swatch: ["#EDEFF2", "#FFFFFF", "#4A6178"] },
  { key: "sage", name: "Sage", swatch: ["#F1F4EE", "#FFFFFF", "#7C9469"] },
  { key: "rose", name: "Dusty Rose", swatch: ["#FAF1EF", "#FFFFFF", "#C08887"] },
  { key: "ocean", name: "Ocean", swatch: ["#EEF3F5", "#FFFFFF", "#2E6E7E"] },
  { key: "graphite", name: "Graphite", swatch: ["#EBEBEC", "#FFFFFF", "#4C545C"] },
  { key: "dark", name: "Dark Mode", swatch: ["#1B1B1D", "#242426", "#C9A36A"] },
];

function applyTheme() {
  if (state.theme && state.theme !== "cream") {
    document.documentElement.setAttribute("data-app-theme", state.theme);
  } else {
    document.documentElement.removeAttribute("data-app-theme");
  }
}

function renderAppearance() {
  const panel = document.getElementById("panel-appearance");
  if (!panel) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Appearance</h2>`));
  panel.appendChild(el(`<div class="settings-group-desc">Pick a color theme. It changes the whole app instantly — nothing else changes.</div>`));

  const grid = el(`<div class="theme-swatch-grid"></div>`);
  THEMES.forEach((theme) => {
    const isSelected = (state.theme || "cream") === theme.key;
    const card = el(`
      <button type="button" class="theme-swatch-card ${isSelected ? "selected" : ""}" data-theme-key="${theme.key}">
        <div class="theme-swatch-preview">${theme.swatch.map((c) => `<span style="background:${c};"></span>`).join("")}</div>
        <div class="theme-swatch-card-body">
          <div>
            <div class="theme-swatch-name">${escapeHtml(theme.name)}</div>
            ${isSelected ? `<div class="theme-swatch-current-tag">Current</div>` : ""}
          </div>
          <div class="theme-swatch-check">${isSelected ? "✓" : ""}</div>
        </div>
      </button>
    `);
    card.addEventListener("click", () => {
      state.theme = theme.key;
      scheduleSave();
      applyTheme();
      renderAppearance();
    });
    grid.appendChild(card);
  });
  panel.appendChild(grid);
}

let settingsSubTab = "mine"; // "mine" | "gallery" — resets each session, not persisted

// ------------------------------------------------------------------
// My Apps (2026-09 rearchitecture) — ONE flat, draggable list covering
// every added app (Practice, Tracker, or Tool), replacing the old
// three-zone (toolbar/additional/hidden) My Practices layout. Drag order
// is the only thing that decides the Home bottom bar: the first
// MOBILE_PINNED_COUNT *visible Practices* in state.appOrder form it —
// Trackers and Tools can never occupy one of those slots, however early
// they sit in the raw order (see normalizeAppOrder).
//
// state.appOrder holds ids for every sheet-backed app plus the two
// non-sheet apps (Sobriety, Cycle) that live in state.extraTrackers —
// Sobriety is a Practice now, Cycle stays a Tracker.
// ------------------------------------------------------------------
function appRowDescriptor(id) {
  if (id === "sobriety") {
    const tpl = EXTRA_TRACKERS_GALLERY.find((t) => t.key === "sobriety");
    return { id, label: "Sobriety", icon: tpl?.icon, type: "practice", visible: !state.extraTrackers?.hidden?.sobriety, removable: true, hideable: true, isExtraTracker: true };
  }
  if (id === "cycle") {
    const tpl = EXTRA_TRACKERS_GALLERY.find((t) => t.key === "cycle");
    return { id, label: "Cycle", icon: tpl?.icon, type: "tracker", visible: !state.extraTrackers?.hidden?.cycle, removable: true, hideable: true, isExtraTracker: true };
  }
  const s = state.sheets.find((x) => x.id === id);
  if (!s) return null;
  const type = appTypeForSheet(s);
  if (!type) return null;
  return { id, label: sheetLabel(s), icon: sheetIcon(s), type, visible: s.visible, removable: true, hideable: true, isCustom: s.kind === "custom" };
}

// Same job as toggleSheetVisible, generalized to Sobriety/Cycle — they
// aren't state.sheets entries, so they need their own hidden flag
// (state.extraTrackers.hidden) rather than a `visible` field on a
// sheet object. Hiding leaves everything else untouched: history,
// streak, milestones, the on/off state in extraTrackers itself — it
// only drops the Home tile and the nav tab, exactly like hiding a
// sheet-backed app does.
function toggleAppVisible(id) {
  if (id === "sobriety" || id === "cycle") {
    state.extraTrackers ||= {};
    state.extraTrackers.hidden ||= {};
    state.extraTrackers.hidden[id] = !state.extraTrackers.hidden[id];
    scheduleSave();
    recomputeRewardDollarPerLog();
    rebuildNav();
    renderSettings();
    if (state.extraTrackers.hidden[id] && state.activeTab === id) activateTab("home");
    else renderHome();
    return;
  }
  toggleSheetVisible(id);
}

function ensureAppOrder() {
  const validIds = [];
  state.sheets.forEach((s) => {
    if (s.id === "wellness") return;
    if (appTypeForSheet(s)) validIds.push(s.id);
  });
  if (state.extraTrackers?.sobriety) validIds.push("sobriety");
  if (state.extraTrackers?.cycle) validIds.push("cycle");
  const validSet = new Set(validIds);
  state.appOrder ||= [];
  state.appOrder = state.appOrder.filter((id) => validSet.has(id));
  const already = new Set(state.appOrder);
  validIds.forEach((id) => {
    if (!already.has(id)) {
      state.appOrder.push(id);
      already.add(id);
    }
  });
  normalizeAppOrder();
}

// Trackers/Tools can never occupy one of the first MOBILE_PINNED_COUNT
// visible-Practice slots — if a reorder (or a Practice being hidden/
// removed) would put one there, it gets bumped to right after the
// boundary instead of just snapping visually; there's nothing to
// visually snap since the underlying order is what's authoritative.
function normalizeAppOrder() {
  const order = state.appOrder;
  const misplaced = [];
  let practiceSeen = 0;
  for (let i = 0; i < order.length; ) {
    const d = appRowDescriptor(order[i]);
    if (practiceSeen < MOBILE_PINNED_COUNT && d && d.visible && d.type !== "practice") {
      misplaced.push(order.splice(i, 1)[0]);
      continue;
    }
    if (d && d.visible && d.type === "practice") practiceSeen++;
    i++;
  }
  if (!misplaced.length) return;
  let insertAt = order.length;
  let seen = 0;
  for (let i = 0; i < order.length; i++) {
    const d = appRowDescriptor(order[i]);
    if (d && d.visible && d.type === "practice") seen++;
    if (seen >= MOBILE_PINNED_COUNT) {
      insertAt = i + 1;
      break;
    }
  }
  order.splice(insertAt, 0, ...misplaced);
}

// The set of app ids currently occupying a Home-bar slot — first
// MOBILE_PINNED_COUNT visible Practices, in appOrder order.
function toolbarAppIds() {
  ensureAppOrder();
  const ids = [];
  for (const id of state.appOrder) {
    const d = appRowDescriptor(id);
    if (d && d.visible && d.type === "practice") {
      ids.push(id);
      if (ids.length >= MOBILE_PINNED_COUNT) break;
    }
  }
  return ids;
}

// Mirrors the old isPinnedSheet, generalized to any app id (sheet-backed
// or not) under the new Practices-only toolbar rule.
function isPinnedSheet(id) {
  return toolbarAppIds().includes(id);
}

let draggedAppId = null;

function reorderAppOrder(draggedId, targetId, before) {
  const order = state.appOrder;
  const fromIdx = order.indexOf(draggedId);
  if (fromIdx < 0) return;
  order.splice(fromIdx, 1);
  let targetIdx = order.indexOf(targetId);
  if (targetIdx < 0) targetIdx = order.length;
  const insertAt = before ? targetIdx : targetIdx + 1;
  order.splice(insertAt, 0, draggedId);
  normalizeAppOrder();
  scheduleSave();
  recomputeRewardDollarPerLog();
  rebuildNav();
  renderSettings();
}

const APP_TYPE_LABEL = { practice: "Practice", tracker: "Tracker", tool: "Tool" };
// One tint per app type, applied to every icon well wherever an app
// shows up (Home tile, My Apps row, Marketplace card) so the same app
// reads the same way on every screen — see the CSS comment by
// .icon-well-practice for why this is type-based, not per-app.
function appIconWellClass(type) {
  return type === "tracker" ? "icon-well-tracker" : type === "tool" ? "icon-well-tool" : "icon-well-practice";
}

function removeAppRow(id, descriptor) {
  const label = descriptor.label;
  if (descriptor.isExtraTracker) {
    confirmModal(
      `Remove ${label}?`,
      id === "sobriety"
        ? "It'll disappear from Home and Settings. Your check-in history stays saved if you ever add it back."
        : "It'll disappear from Home and Settings. Nothing logged is deleted — add it back anytime.",
      "Remove",
      () => {
        state.extraTrackers ||= {};
        state.extraTrackers[id] = false;
        scheduleSave();
        recomputeRewardDollarPerLog();
        rebuildNav();
        renderSettings();
        // Now real tabs, so removing one while it's the open tab needs an
        // explicit bounce back to Home — a modal just closing itself used
        // to make this a non-issue.
        if (state.activeTab === id) activateTab("home");
        else renderHome();
      }
    );
    return;
  }
  if (descriptor.isCustom) {
    confirmModal(
      `Remove ${label}?`,
      "It'll disappear from your sidebar. You can add it again anytime from Settings, but its items will be gone for good.",
      "Remove",
      () => removeCustomSheet(id)
    );
  } else {
    confirmModal(
      `Remove ${label}?`,
      "This is a built-in app — unlike the gallery ones, there's no template to add it back from. Removing it deletes everything in it for good. If you just want it off your sidebar without losing anything, tap the eye instead.",
      "Delete for good",
      () => removeBuiltinSheet(id)
    );
  }
}

function renderSettings() {
  const panel = document.getElementById("panel-settings");
  if (!panel) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Settings</h2>`));

  // My Apps (reorder/hide/remove everything you have) and Marketplace
  // (add something new — a practice, a tracker, or a tool) are the two
  // "app configuration" tasks now that Pillar Mapping is gone — there's
  // nothing left to map a practice to.
  const segment = el(`
    <div class="settings-segment">
      <button type="button" class="${settingsSubTab === "mine" ? "active" : ""}" data-target="mine">My Apps</button>
      <button type="button" class="${settingsSubTab === "gallery" ? "active" : ""}" data-target="gallery">Marketplace</button>
    </div>
  `);
  segment.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      settingsSubTab = btn.dataset.target;
      renderSettings();
    });
  });
  panel.appendChild(segment);

  const minePanel = el(`<div class="settings-subpanel" style="${settingsSubTab === "mine" ? "" : "display:none;"}"></div>`);
  const galleryPanel = el(`<div class="settings-subpanel" style="${settingsSubTab === "gallery" ? "" : "display:none;"}"></div>`);

  minePanel.appendChild(el(`<div class="settings-group-title">Your apps</div>`));
  minePanel.appendChild(
    el(
      `<div class="settings-group-desc">Drag a row (⠿) to reorder. Your first ${MOBILE_PINNED_COUNT} Practices form the Home toolbar and pin to the bottom bar on mobile, marked "Bar" — Trackers and Tools can never land above the dashed line, whatever order you drop them in. Additional apps can be hidden with the eye, no prompt — bar apps can't be hidden directly; drag one below the line first if you want to hide it. Tap the X to remove — that always asks first, since it deletes the app's data for good. Apps you added from the Marketplace can be added back anytime; built-in ones can't.</div>`
    )
  );

  ensureAppOrder();
  const list = el(`<div class="practice-row-list"></div>`);
  minePanel.appendChild(list);

  const dragHandleSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle><circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle><circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`;
  const eyeOpenSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOffSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-2.68 3.9M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  const removeXSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>`;

  const barIds = new Set(toolbarAppIds());

  state.appOrder.forEach((id) => {
    const d = appRowDescriptor(id);
    if (!d) return;

    const pinnedSlot = barIds.has(id);
    const row = el(`
      <div class="practice-row app-row-type-${d.type}" draggable="true" data-app-id="${id}">
        <span class="row-drag-handle">${dragHandleSvg}</span>
        <span class="row-icon ${appIconWellClass(d.type)}"${d.visible ? "" : ' style="opacity:.5;"'}>${iconSvg(d.icon || `<circle cx="12" cy="12" r="9"></circle>`).replace('width="20" height="20"', 'width="17" height="17"')}</span>
        <span class="row-label"${d.visible ? "" : ' style="color:var(--muted);"'}>${escapeHtml(d.label)}<span class="app-type-tag app-type-tag-${d.type}">${APP_TYPE_LABEL[d.type]}</span></span>
        ${pinnedSlot ? `<span class="row-pinned-badge">Bar</span>` : ""}
        <span class="row-actions">
          ${
            d.hideable && !pinnedSlot
              ? `<button type="button" class="row-icon-btn ${d.visible ? "eye-on" : "eye-off"}" title="${d.visible ? "Hide" : "Show"}">${d.visible ? eyeOpenSvg : eyeOffSvg}</button>`
              : ""
          }
          <button type="button" class="row-icon-btn remove-x" title="Remove">${removeXSvg}</button>
        </span>
      </div>
    `);

    if (d.hideable && !pinnedSlot) {
      row.querySelector(".eye-on, .eye-off").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleAppVisible(id);
      });
    }
    row.querySelector(".remove-x").addEventListener("click", (e) => {
      e.stopPropagation();
      removeAppRow(id, d);
    });

    row.addEventListener("dragstart", (e) => {
      draggedAppId = id;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", id);
      } catch (err) {
        // Some browsers require this call to not throw even if unused.
      }
    });
    row.addEventListener("dragend", () => {
      draggedAppId = null;
      document.querySelectorAll(".practice-row").forEach((r) => r.classList.remove("dragging", "drag-over-above", "drag-over-below"));
    });
    row.addEventListener("dragover", (e) => {
      if (!draggedAppId || draggedAppId === id) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = row.getBoundingClientRect();
      const above = e.clientY - rect.top < rect.height / 2;
      row.classList.toggle("drag-over-above", above);
      row.classList.toggle("drag-over-below", !above);
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over-above", "drag-over-below");
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedAppId || draggedAppId === id) return;
      const rect = row.getBoundingClientRect();
      const above = e.clientY - rect.top < rect.height / 2;
      reorderAppOrder(draggedAppId, id, above);
    });
    row.addEventListener("click", (e) => {
      if (e.target.closest(".row-actions")) return;
      // Sobriety and Cycle are real tabs now, same as every other app —
      // no more special-cased modal popup for just these two.
      activateTab(id);
    });

    list.appendChild(row);
    if (pinnedSlot && [...barIds][barIds.size - 1] === id) {
      list.appendChild(el(`<div class="app-order-divider"><span>Home bar ends here</span></div>`));
    }
  });
  if (!barIds.size) {
    list.insertBefore(el(`<div class="app-order-divider"><span>Home bar ends here</span></div>`), list.firstChild);
  }
  if (!list.children.length) list.appendChild(el(`<div class="row-empty">Add an app from the Marketplace to get started</div>`));

  minePanel.appendChild(
    el(`<div class="settings-note">Wellness isn't an app you add or hide — it's built into Home now, not a separate page.</div>`)
  );

  panel.appendChild(minePanel);

  // Marketplace — three shelves (Practices, Trackers, Tools), one
  // Add/Remove button style throughout regardless of shelf.
  galleryPanel.appendChild(el(`<div class="settings-group-title">Marketplace</div>`));
  galleryPanel.appendChild(el(`<div class="settings-group-desc">Browse and add — practices you log, trackers you note, and tools that are just checklists.</div>`));

  const usedCount = countedSpaces();
  const limit = spaceCapForAccount();
  const atCap = usedCount >= limit;
  const planLabel = (state.account && state.account.planLabel) || "Free";
  galleryPanel.appendChild(el(`
    <div class="space-usage-row">
      <div class="space-usage-top">
        <span class="space-usage-label">${escapeHtml(planLabel)} plan &middot; practices used</span>
        <span class="space-usage-count">${usedCount} of ${limit}</span>
      </div>
      <div class="space-usage-bar"><div class="space-usage-fill${atCap ? " full" : ""}" style="width:${Math.min(100, Math.round((usedCount / limit) * 100))}%;"></div></div>
    </div>
  `));

  function marketplaceShelf(title, badgeClass, explainer) {
    galleryPanel.appendChild(el(`
      <div class="marketplace-category-head" style="margin-top:20px;">
        <span class="marketplace-category-title">${title}</span>
        <span class="marketplace-category-badge ${badgeClass}">${explainer}</span>
      </div>
    `));
  }

  // Practices — log it and it can deposit toward your reward, with its
  // own streak.
  marketplaceShelf("Practices", "practices", "Log it and it can deposit");
  const practiceGallery = el(`<div class="sheet-gallery"></div>`);
  SHEET_GALLERY.filter((t) => t.type === "practice").forEach((tpl) => {
    const alreadyAdded = Object.values(state.customSheets).some((cs) => cs.templateKey === tpl.key);
    const cardEl = el(`
      <div class="sheet-card">
        <span class="sheet-card-icon icon-well-practice">${iconSvg(tpl.icon).replace('width="20" height="20"', 'width="18" height="18"')}</span>
        <div class="sheet-card-name">${escapeHtml(tpl.label)}</div>
        <div class="sheet-card-desc">${escapeHtml(tpl.desc)}</div>
        ${
          alreadyAdded
            ? `<span class="sheet-card-added">${checkSvg} Added</span>`
            : atCap
            ? `<button type="button" class="btn-ghost small" style="align-self:flex-start;">Upgrade to add</button>`
            : `<button type="button" class="btn-ghost small" style="align-self:flex-start;">+ Add</button>`
        }
      </div>
    `);
    if (!alreadyAdded) {
      cardEl.querySelector("button").addEventListener("click", () => addSheetFromTemplate(tpl));
    }
    practiceGallery.appendChild(cardEl);
  });
  // Sobriety lives in EXTRA_TRACKERS_GALLERY (no space-cap gate, no
  // template/customSheets backing) but is a Practice now, so it belongs
  // on this shelf, not the Trackers one below.
  const sobrietyTpl = EXTRA_TRACKERS_GALLERY.find((t) => t.key === "sobriety");
  if (sobrietyTpl) {
    const added = !!state.extraTrackers?.sobriety;
    const cardEl = el(`
      <div class="sheet-card">
        <span class="sheet-card-icon icon-well-practice">${iconSvg(sobrietyTpl.icon).replace('width="20" height="20"', 'width="18" height="18"')}</span>
        <div class="sheet-card-name">${escapeHtml(sobrietyTpl.label)}</div>
        <div class="sheet-card-desc">${escapeHtml(sobrietyTpl.desc)}</div>
        ${added ? `<button type="button" class="btn-ghost small">Remove</button>` : `<button type="button" class="btn-ghost small">+ Add</button>`}
      </div>
    `);
    cardEl.querySelector("button").addEventListener("click", () => {
      state.extraTrackers ||= {};
      state.extraTrackers.sobriety = !added;
      scheduleSave();
      recomputeRewardDollarPerLog();
      rebuildNav();
      renderSettings();
      renderHome();
    });
    practiceGallery.appendChild(cardEl);
  }
  galleryPanel.appendChild(practiceGallery);

  // Trackers — note it, no streak, no deposit.
  marketplaceShelf("Trackers", "trackers", "Note it — no streak");
  const trackerGallery = el(`<div class="sheet-gallery trackers-style"></div>`);
  EXTRA_TRACKERS_GALLERY.filter((t) => t.type === "tracker").forEach((tpl) => {
    const added = !!state.extraTrackers?.[tpl.key];
    const cardEl = el(`
      <div class="sheet-card trackers-style">
        <span class="sheet-card-icon icon-well-tracker">${iconSvg(tpl.icon).replace('width="20" height="20"', 'width="18" height="18"')}</span>
        <div class="sheet-card-name">${escapeHtml(tpl.label)}</div>
        <div class="sheet-card-desc">${escapeHtml(tpl.desc)}</div>
        ${added ? `<button type="button" class="btn-ghost small">Remove</button>` : `<button type="button" class="btn-ghost small">+ Add</button>`}
      </div>
    `);
    cardEl.querySelector("button").addEventListener("click", () => {
      state.extraTrackers ||= {};
      state.extraTrackers[tpl.key] = !added;
      scheduleSave();
      recomputeRewardDollarPerLog();
      rebuildNav();
      renderSettings();
      renderHome();
    });
    trackerGallery.appendChild(cardEl);
  });
  galleryPanel.appendChild(trackerGallery);

  // Tools — a checklist, nothing dated or tracked.
  marketplaceShelf("Tools", "tools", "Just a checklist");
  const toolGallery = el(`<div class="sheet-gallery"></div>`);
  SHEET_GALLERY.filter((t) => t.type === "tool").forEach((tpl) => {
    const alreadyAdded = Object.values(state.customSheets).some((cs) => cs.templateKey === tpl.key);
    // Capsule Wardrobe is grandfathered in for accounts that already have
    // one — never removed, still fully usable — but it's off the shelf
    // for everyone else, same as before.
    if (tpl.key === "wardrobe" && !alreadyAdded) return;
    const cardEl = el(`
      <div class="sheet-card">
        <span class="sheet-card-icon icon-well-tool">${iconSvg(tpl.icon).replace('width="20" height="20"', 'width="18" height="18"')}</span>
        <div class="sheet-card-name">${escapeHtml(tpl.label)}</div>
        <div class="sheet-card-desc">${escapeHtml(tpl.desc)}</div>
        ${
          alreadyAdded
            ? `<span class="sheet-card-added">${checkSvg} Added</span>`
            : `<button type="button" class="btn-ghost small" style="align-self:flex-start;">+ Add</button>`
        }
      </div>
    `);
    if (!alreadyAdded) {
      cardEl.querySelector("button").addEventListener("click", () => addSheetFromTemplate(tpl));
    }
    toolGallery.appendChild(cardEl);
  });
  // Lists (todo) is a built-in Tool with no template to add back from —
  // shown here read-only if it's ever been removed there'd be nothing to
  // re-add anyway, so it's just informational when present.
  if (state.sheets.some((s) => s.id === "todo")) {
    toolGallery.appendChild(el(`
      <div class="sheet-card">
        <span class="sheet-card-icon icon-well-tool">${iconSvg(BUILTIN_SHEET_META.todo.icon).replace('width="20" height="20"', 'width="18" height="18"')}</span>
        <div class="sheet-card-name">Lists</div>
        <div class="sheet-card-desc">General-purpose checklists — a built-in utility, not a habit.</div>
        <span class="sheet-card-added">${checkSvg} Added</span>
      </div>
    `));
  }
  galleryPanel.appendChild(toolGallery);

  panel.appendChild(galleryPanel);
}

// Cached so building the section doesn't have to be async — refreshed
// lazily (see refreshPushStatus) and re-rendered via the caller-supplied
// callback once the real answer comes back.
let pushStatusCache = null;
// Set only when turning notifications on just failed, so the reason
// (blocked permission, a network hiccup) shows right under the toggle
// instead of vanishing silently — cleared on the next attempt.
let pushErrorMessage = null;

function refreshPushStatus(onDone) {
  getPushStatus().then((status) => {
    pushStatusCache = status;
    onDone();
  });
}

// Notifications — celebratory streak/deposit milestones plus a gentle
// evening nudge if pillars are still open. Lives in its own modal off the
// You sheet (see openNotificationsModal) rather than buried in Settings'
// space-management scroll — reachable in one tap, the same way Appearance
// and Pillar Mapping already are. `rerender` is called both when the
// async status check first resolves and after every toggle, so the modal
// (the only place this renders now) always reflects the latest state.
function buildNotificationsSection(rerender) {
  const section = el(`<div></div>`);

  if (!pushStatusCache) {
    section.appendChild(el(`<div class="settings-note">Checking notification status&hellip;</div>`));
    refreshPushStatus(rerender);
    return section;
  }

  const status = pushStatusCache;

  if (!status.supported) {
    section.appendChild(
      el(
        `<div class="settings-note">Push notifications aren't supported in this browser. On an iPhone, add Addley to your Home Screen first (Share &rarr; Add to Home Screen), then open it from there.</div>`
      )
    );
    return section;
  }

  const isOn = status.permission === "granted" && status.subscribed;
  const row = el(`
    <div class="prog-field-row" style="align-items:center;">
      <label style="font-weight:500;">
        Celebrate streaks &amp; deposits
        <span class="account-btn-sub" style="display:block;margin-top:2px;">
          ${
            status.permission === "denied"
              ? "Blocked in this browser's site settings — allow notifications for Addley there, then come back."
              : isOn
              ? "On for this device &mdash; milestone celebrations and a gentle evening nudge if a pillar's still open."
              : "Off. Turn on for streak &amp; deposit milestone pushes, plus a gentle evening nudge."
          }
        </span>
      </label>
      <div class="toggle-switch ${isOn ? "on" : ""} ${status.permission === "denied" ? "disabled" : ""}" id="push-toggle" style="flex-shrink:0;"></div>
    </div>
  `);

  if (status.permission !== "denied") {
    row.querySelector("#push-toggle").addEventListener("click", async () => {
      const toggle = row.querySelector("#push-toggle");
      toggle.style.opacity = "0.5";
      pushErrorMessage = null;
      if (isOn) {
        await unsubscribeFromPush();
      } else {
        const result = await subscribeToPush();
        if (!result.ok) pushErrorMessage = result.reason || "Couldn't turn on notifications.";
      }
      pushStatusCache = null;
      rerender();
    });
  }

  section.appendChild(row);
  if (pushErrorMessage) {
    section.appendChild(el(`<div class="settings-note" style="margin-top:8px;">${escapeHtml(pushErrorMessage)}</div>`));
  }
  return section;
}

// Reached from You → "Notifications" — a single-purpose modal, same
// weight as Email & password or Plan & Billing, instead of a section
// tucked at the bottom of Settings' space-management scroll.
function openNotificationsModal() {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Notifications</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div id="notifications-modal-body"></div>
      </div>
    </div>
  `);
  const body = overlay.querySelector("#notifications-modal-body");
  const rerender = () => {
    body.innerHTML = "";
    body.appendChild(buildNotificationsSection(rerender));
  };
  rerender();
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function renderChecklistSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const card = el(`<div class="card"></div>`);
  if (!sheet.items.length) card.appendChild(el(`<div class="muted">Nothing here yet.</div>`));
  sheet.items.forEach((item) => {
    const row = el(`
      <div class="checklist-item-row">
        <div class="checkbox ${item.done ? "checked" : ""}">${checkSvg}</div>
        <div class="checklist-item-text"><span class="${item.done ? "strike" : ""}">${escapeHtml(item.text)}</span></div>
        <button class="remove-btn" title="Delete">&times;</button>
      </div>
    `);
    row.querySelector(".checkbox").addEventListener("click", () => {
      item.done = !item.done;
      if (item.done) item.completedDate = todayISO();
      scheduleSave();
      renderChecklistSheet(id);
    });
    row.querySelector(".remove-btn").addEventListener("click", () => {
      sheet.items = sheet.items.filter((x) => x.id !== item.id);
      scheduleSave();
      renderChecklistSheet(id);
    });
    card.appendChild(row);
  });
  panel.appendChild(card);

  const form = el(`
    <form class="add-form">
      <input name="text" placeholder="Add an item" required />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    sheet.items.push({ id: nextId(), text: fd.get("text"), done: false });
    scheduleSave();
    renderChecklistSheet(id);
  });
  panel.appendChild(form);
}

// ------------------------------------------------------------------
// Capsule Wardrobe — season pills up top (Staples pinned first, then
// the four seasons ordered starting with whichever one it is right now
// on this device), collapsible category groups underneath, same
// collapse-persistence pattern as the Bible book list.
// ------------------------------------------------------------------
const editSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>`;
const chevronSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const chevronRightSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>`;
const backArrowSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"></polyline></svg>`;
const trashSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

// A curated palette for the dot — separate from the free-text Color
// description, so "Gold + Diamonds" or "Same as Blazer" can still get an
// exact, deliberately-chosen dot instead of a guessed fallback. Existing
// items with no swatchKey set yet fall back to a text guess (below).
const WARDROBE_SWATCH_OPTIONS = [
  { key: "black", label: "Black", hex: "#221E1A" },
  { key: "white", label: "White / Off-White", hex: "#F7F5F0" },
  { key: "cream", label: "Cream / Ivory", hex: "#ECE3D2" },
  { key: "camel", label: "Camel / Tan", hex: "#B98A55" },
  { key: "brown", label: "Brown / Chocolate", hex: "#5C4128" },
  { key: "gold", label: "Gold", hex: "#C9A86A" },
  { key: "grey", label: "Grey", hex: "#9A958D" },
  { key: "navy", label: "Navy / Denim", hex: "#2C3A4A" },
  { key: "red", label: "Red / Merlot", hex: "#B3392B" },
  { key: "green", label: "Green / Olive", hex: "#6B7F5A" },
  { key: "pink", label: "Pink / Floral", hex: "#C08887" },
  { key: "neutral", label: "Other / Neutral", hex: "#ADA79A" },
];
function wardrobeSwatchHex(key) {
  return (WARDROBE_SWATCH_OPTIONS.find((o) => o.key === key) || WARDROBE_SWATCH_OPTIONS.find((o) => o.key === "neutral")).hex;
}
// Best-guess starting point for the dropdown/dot when an item has no
// explicit swatchKey saved yet (every seeded item starts this way).
function guessSwatchKey(colorStr) {
  const s = (colorStr || "").toLowerCase();
  if (s.includes("black")) return "black";
  if (s.includes("white") || s.includes("ivory")) return "white";
  if (s.includes("cream")) return "cream";
  if (s.includes("camel") || s.includes("tan")) return "camel";
  if (s.includes("chocolate") || s.includes("brown")) return "brown";
  if (s.includes("gold")) return "gold";
  if (s.includes("grey") || s.includes("gray")) return "grey";
  if (s.includes("navy") || s.includes("denim")) return "navy";
  if (s.includes("red") || s.includes("merlot")) return "red";
  if (s.includes("green") || s.includes("olive")) return "green";
  if (s.includes("floral") || s.includes("pink")) return "pink";
  return "neutral";
}
function getItemSwatchHex(item) {
  return wardrobeSwatchHex(item.swatchKey || guessSwatchKey(item.color));
}
const linkSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.5-1.5"></path></svg>`;
const photoPlaceholderSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>`;
const WARDROBE_SEASON_OPTIONS = ["All", "Spring", "Summer", "Fall", "Winter", "Spring/Summer", "Fall/Winter", "Spring/Fall"];
const WARDROBE_PRIORITY_OPTIONS = ["High", "Medium", "Low", "Fixed"];
const WARDROBE_PURCHASE_TYPE_OPTIONS = ["Core", "Support", "Bonus", "Owned", "Fixed"];

function renderWardrobeSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const pillOrder = wardrobeSeasonPillOrder();
  // Default to the current season, not Staples — that's the whole point
  // of reordering the pills by what's relevant right now.
  if (!sheet.activeSeason) sheet.activeSeason = getCurrentSeasonKey();

  const pillsRow = el(`<div class="view-toggle-row"><div class="view-toggle"></div></div>`);
  const pillsWrap = pillsRow.querySelector(".view-toggle");
  pillOrder.forEach((p) => {
    const btn = el(`<button type="button" class="${sheet.activeSeason === p.key ? "active" : ""}">${escapeHtml(p.label)}</button>`);
    btn.addEventListener("click", () => {
      sheet.activeSeason = p.key;
      scheduleSave();
      renderWardrobeSheet(id);
    });
    pillsWrap.appendChild(btn);
  });
  panel.appendChild(pillsRow);

  const items = sheet.items.filter((it) => (it.seasonTags || []).includes(sheet.activeSeason));
  const categories = [];
  const byCategory = new Map();
  items.forEach((it) => {
    if (!byCategory.has(it.category)) {
      byCategory.set(it.category, []);
      categories.push(it.category);
    }
    byCategory.get(it.category).push(it);
  });

  if (!items.length) {
    panel.appendChild(el(`<div class="muted" style="padding:10px 0;">Nothing tagged for this yet — add an item below.</div>`));
  }

  categories.forEach((cat) => {
    const catItems = byCategory.get(cat);
    const doneCount = catItems.filter((i) => i.purchased).length;
    const remembered = sheet.openCategories[cat];
    const shouldOpen = remembered !== undefined ? remembered : true;
    const details = el(`
      <details class="wardrobe-group" ${shouldOpen ? "open" : ""}>
        <summary class="wardrobe-summary">
          <span class="wardrobe-cat-title">${escapeHtml(cat)}</span>
          <span class="muted">${doneCount}/${catItems.length}</span>
        </summary>
        <div class="wardrobe-items"></div>
      </details>
    `);
    details.addEventListener("toggle", () => {
      sheet.openCategories[cat] = details.open;
      scheduleSave();
    });
    const itemsWrap = details.querySelector(".wardrobe-items");
    catItems.forEach((item) => {
      const priceText =
        item.purchased && item.paid != null
          ? `$${Number(item.paid).toFixed(2)}`
          : item.min || item.max
          ? `$${item.min}&ndash;${item.max}`
          : "";
      const thumb = item.photo
        ? `<img class="wi-thumb" src="${item.photo}" alt="" />`
        : `<span class="wi-swatch" style="background:${getItemSwatchHex(item)};" title="${escapeHtml(item.color)}"></span>`;
      const linkIcon = item.link
        ? `<a class="wi-link-icon" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" title="Open link">${linkSvg}</a>`
        : "";
      const rangeText = item.min || item.max ? `$${item.min}–${item.max} CAD` : "";
      const paidText = item.purchased && item.paid != null ? `$${Number(item.paid).toFixed(2)} CAD paid` : "";
      const seasonLabel = escapeHtml(item.season || "All");
      const zoomSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;
      const detailPhoto = item.photo
        ? `<button type="button" class="wi-detail-photo-btn"><img class="wi-detail-photo" src="${item.photo}" alt="" /><span class="wi-detail-photo-zoom">${zoomSvg}</span></button>`
        : `<div class="wi-detail-photo wi-detail-photo-empty" style="background:${getItemSwatchHex(item)}22;">${photoPlaceholderSvg}</div>`;
      const detailFacts = [
        ["Category", item.category],
        ["Type", item.itemType],
        ["Color", item.color],
        ["Season", seasonLabel],
        ["Priority", item.priority],
        ["Purchase type", item.purchaseType],
        ["Budget", rangeText],
      ].filter(([label, val]) => label && val);
      const factsHtml = detailFacts
        .map(([label, val]) => `<div class="wi-detail-fact"><span class="wi-detail-fact-label">${escapeHtml(label)}</span><span class="wi-detail-fact-val">${escapeHtml(String(val))}</span></div>`)
        .join("");
      const item2 = el(`
        <details class="wardrobe-item">
          <summary class="wardrobe-row">
            <div class="checkbox ${item.purchased ? "checked" : ""}">${checkSvg}</div>
            ${thumb}
            <div class="wi-body">
              <div class="wi-name ${item.purchased ? "owned" : ""}">${escapeHtml(item.name)}${linkIcon}</div>
              <div class="wi-sub">${escapeHtml([item.itemType, item.color].filter(Boolean).join(" · "))}</div>
            </div>
            <div class="wi-price">${priceText}</div>
            <span class="wardrobe-chevron">${chevronSvg}</span>
          </summary>
          <div class="wardrobe-item-detail">
            ${detailPhoto}
            <div class="wi-detail-facts">
              ${factsHtml}
              ${paidText ? `<div class="wi-detail-fact"><span class="wi-detail-fact-label">Paid</span><span class="wi-detail-fact-val">${escapeHtml(paidText)}</span></div>` : ""}
            </div>
            ${item.notes ? `<div class="wi-detail-notes">${escapeHtml(item.notes)}</div>` : ""}
            <div class="wi-detail-actions">
              ${item.link ? `<a class="btn-ghost wi-detail-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">${linkSvg} View product</a>` : ""}
              <button type="button" class="btn-ghost wi-detail-edit">${editSvg} Edit item</button>
            </div>
          </div>
        </details>
      `);
      // Anything inside <summary> that shouldn't toggle the accordion
      // (checkbox, the link icon which is its own <a>) needs to stop the
      // click from bubbling up to the native <summary> toggle.
      item2.querySelector(".checkbox").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        item.purchased = !item.purchased;
        scheduleSave();
        renderWardrobeSheet(id);
      });
      item2.querySelector(".wi-link-icon")?.addEventListener("click", (e) => e.stopPropagation());
      item2.querySelector(".wi-detail-edit").addEventListener("click", () => openWardrobeItemModal(id, item.id));
      item2.querySelector(".wi-detail-photo-btn")?.addEventListener("click", () => openPhotoLightbox(item.photo));
      itemsWrap.appendChild(item2);
    });
    panel.appendChild(details);
  });

  const addBtn = el(`<button type="button" class="btn-ghost" style="margin-top:16px;">+ Add item</button>`);
  addBtn.addEventListener("click", () => openWardrobeItemModal(id, null));
  panel.appendChild(addBtn);
}

function openWardrobeItemModal(sheetId, itemId) {
  const sheet = state.customSheets[sheetId];
  const isNew = !itemId;
  const item = isNew
    ? { category: "", name: "", itemType: "", color: "", season: "All", priority: "Medium", purchaseType: "Core", min: 0, max: 0, purchased: false, paid: null, notes: "", link: "", photo: null }
    : sheet.items.find((i) => i.id === itemId);
  if (!item) return;

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>${isNew ? "Add item" : "Edit item"}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <form class="wardrobe-item-form">
          <label class="muted" style="font-size:11px;">Name</label>
          <input name="name" required value="${escapeHtml(item.name)}" />
          <label class="muted" style="font-size:11px;">Category</label>
          <input name="category" required value="${escapeHtml(item.category)}" list="wardrobe-category-list-${sheetId}" />
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Type</label><input name="itemType" value="${escapeHtml(item.itemType)}" /></div>
            <div><label class="muted" style="font-size:11px;">Color (description)</label><input name="color" value="${escapeHtml(item.color)}" /></div>
          </div>
          <label class="muted" style="font-size:11px;">Swatch color (sets the dot)</label>
          <div class="swatch-select-row">
            <span class="swatch-preview-dot" style="background:${wardrobeSwatchHex(item.swatchKey || guessSwatchKey(item.color))};"></span>
            <select name="swatchColor" class="swatch-select">${WARDROBE_SWATCH_OPTIONS.map(
              (o) => `<option value="${o.key}" ${(item.swatchKey || guessSwatchKey(item.color)) === o.key ? "selected" : ""}>${o.label}</option>`
            ).join("")}</select>
          </div>
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Season</label><select name="season">${WARDROBE_SEASON_OPTIONS.map(
              (s) => `<option value="${s}" ${item.season === s ? "selected" : ""}>${s}</option>`
            ).join("")}</select></div>
            <div><label class="muted" style="font-size:11px;">Priority</label><select name="priority">${WARDROBE_PRIORITY_OPTIONS.map(
              (p) => `<option value="${p}" ${item.priority === p ? "selected" : ""}>${p}</option>`
            ).join("")}</select></div>
          </div>
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Purchase type</label><select name="purchaseType">${WARDROBE_PURCHASE_TYPE_OPTIONS.map(
              (p) => `<option value="${p}" ${item.purchaseType === p ? "selected" : ""}>${p}</option>`
            ).join("")}</select></div>
            <div><label class="muted" style="font-size:11px;">Purchased?</label><select name="purchased"><option value="false" ${
              !item.purchased ? "selected" : ""
            }>Not yet</option><option value="true" ${item.purchased ? "selected" : ""}>Purchased</option></select></div>
          </div>
          <div class="wardrobe-form-row">
            <div><label class="muted" style="font-size:11px;">Min $CAD</label><input name="min" type="number" min="0" value="${item.min ?? 0}" /></div>
            <div><label class="muted" style="font-size:11px;">Max $CAD</label><input name="max" type="number" min="0" value="${item.max ?? 0}" /></div>
          </div>
          <label class="muted" style="font-size:11px;">Paid $CAD (if purchased)</label>
          <input name="paid" type="number" min="0" step="0.01" value="${item.paid ?? ""}" />
          <label class="muted" style="font-size:11px;">Notes</label>
          <textarea name="notes" rows="2">${escapeHtml(item.notes || "")}</textarea>
          <label class="muted" style="font-size:11px;">Link</label>
          <input name="link" type="url" placeholder="https://…" value="${escapeHtml(item.link || "")}" />
          <label class="muted" style="font-size:11px;">Photo</label>
          <div class="photo-upload-row">
            <div class="photo-upload-preview">${item.photo ? `<img src="${item.photo}" alt="" />` : photoPlaceholderSvg}</div>
            <input type="file" accept="image/*" class="wardrobe-photo-input" style="display:none;" />
            <button type="button" class="btn-ghost wardrobe-photo-btn">${item.photo ? "Change Photo" : "Choose Photo"}</button>
            ${item.photo ? `<button type="button" class="icon-btn danger wardrobe-photo-remove" title="Remove photo">${closeSvg}</button>` : ""}
          </div>
          <div class="modal-actions" style="margin-top:14px;justify-content:space-between;">
            <div style="display:flex;gap:8px;">
              ${isNew ? "" : `<button type="button" class="btn-ghost danger wardrobe-delete-btn">Delete</button>`}
              ${isNew ? "" : `<button type="button" class="btn-ghost wardrobe-duplicate-btn">Duplicate</button>`}
            </div>
            <button type="submit" class="btn-primary">${isNew ? "Add" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  `);

  let pendingPhoto = item.photo || null;
  const photoInput = overlay.querySelector(".wardrobe-photo-input");
  const photoPreview = overlay.querySelector(".photo-upload-preview");
  overlay.querySelector(".wardrobe-photo-btn").addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    photoPreview.innerHTML = `<span class="muted" style="font-size:11px;">Resizing…</span>`;
    resizeImageToDataUrl(file)
      .then((dataUrl) => {
        pendingPhoto = dataUrl;
        photoPreview.innerHTML = `<img src="${pendingPhoto}" alt="" />`;
      })
      .catch(() => {
        photoPreview.innerHTML = item.photo ? `<img src="${item.photo}" alt="" />` : photoPlaceholderSvg;
      });
  });
  overlay.querySelector(".wardrobe-photo-remove")?.addEventListener("click", () => {
    pendingPhoto = null;
    photoPreview.innerHTML = photoPlaceholderSvg;
    overlay.querySelector(".wardrobe-photo-remove")?.remove();
  });

  const swatchPreview = overlay.querySelector(".swatch-preview-dot");
  overlay.querySelector(".swatch-select").addEventListener("change", (e) => {
    swatchPreview.style.background = wardrobeSwatchHex(e.target.value);
  });

  const datalist = el(`<datalist id="wardrobe-category-list-${sheetId}"></datalist>`);
  [...new Set(sheet.items.map((i) => i.category))].forEach((c) => datalist.appendChild(el(`<option value="${escapeHtml(c)}"></option>`)));
  overlay.querySelector(".modal-box").appendChild(datalist);

  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updated = {
      name: fd.get("name").trim(),
      category: fd.get("category").trim(),
      itemType: fd.get("itemType").trim(),
      color: fd.get("color").trim(),
      swatchKey: fd.get("swatchColor"),
      season: fd.get("season"),
      priority: fd.get("priority"),
      purchaseType: fd.get("purchaseType"),
      purchased: fd.get("purchased") === "true",
      min: Number(fd.get("min")) || 0,
      max: Number(fd.get("max")) || 0,
      paid: fd.get("paid") ? Number(fd.get("paid")) : null,
      notes: fd.get("notes").trim(),
      link: fd.get("link").trim(),
      photo: pendingPhoto,
    };
    updated.seasonTags = parseSeasonTags(updated.season);
    if (isNew) {
      sheet.items.push({ id: nextId(), ...updated });
    } else {
      Object.assign(item, updated);
    }
    scheduleSave();
    close();
    renderWardrobeSheet(sheetId);
  });

  if (!isNew) {
    overlay.querySelector(".wardrobe-delete-btn").addEventListener("click", () => {
      close();
      confirmModal(`Remove ${item.name}?`, "It'll be gone from your capsule wardrobe list for good.", "Remove", () => {
        sheet.items = sheet.items.filter((i) => i.id !== itemId);
        scheduleSave();
        renderWardrobeSheet(sheetId);
      });
    });
    // Duplicate — for splitting a multi-color line ("Sandals, Black or
    // Tan") into two single-color items. Copies everything, then reopens
    // the editor on the new copy so she can change color/swatch right away.
    overlay.querySelector(".wardrobe-duplicate-btn").addEventListener("click", () => {
      const { id: _oldId, ...rest } = item;
      const copy = { id: nextId(), ...rest };
      sheet.items.push(copy);
      scheduleSave();
      close();
      renderWardrobeSheet(sheetId);
      openWardrobeItemModal(sheetId, copy.id);
    });
  }

  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Quran Reading Plan — mirrors the Bible sheet's pace-card + progress
// design exactly (per her request), but as a flat checklist since the
// 31 segments already span multiple surahs each and don't group into
// anything smaller the way Bible chapters group into books.
// ------------------------------------------------------------------
function renderQuranPace(panel, sheet, doneCount, total) {
  const settings = sheet.quranSettings;
  const today = new Date();
  const startDate = new Date(settings.startDate + "T00:00:00");
  const daysElapsed = Math.max(1, daysBetween(startDate, today) + 1);
  const pace = doneCount / daysElapsed;
  const remaining = total - doneCount;
  const fmt = (d) => d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  let projectedEnd = null;
  if (remaining > 0 && pace > 0) {
    const daysToFinish = Math.ceil(remaining / pace);
    projectedEnd = new Date(today.getTime() + daysToFinish * 86400000);
  }

  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const finishLabel = remaining <= 0 ? "Finished!" : projectedEnd ? fmt(projectedEnd) : "—";

  // Mirrors the Bible sheet's ring treatment exactly — same reasoning:
  // one shared visual language for "percent of something done."
  const card = el(`
    <div class="card bible-pace-card">
      <div class="bible-ring-row">
        <div class="bible-ring" style="background:conic-gradient(var(--accent) ${pct}%, var(--border) ${pct}% 100%);">
          <div class="bible-ring-inner"><div class="bible-ring-pct">${pct}%</div></div>
        </div>
        <div class="bible-ring-caption"><strong>${doneCount} of ${total}</strong> readings done<br/>Projected finish: <strong>${finishLabel}</strong></div>
      </div>
      <div class="bible-pace-track" title="${doneCount} of ${total} readings (${pct}%)">
        <div class="bible-pace-track-fill" style="width:${pct}%;"></div>
      </div>
      <div class="bible-pace-mini-row">
        <label class="muted">Start date</label>
        <input type="date" class="quran-start-date" value="${settings.startDate}" />
        <button type="button" class="filler-btn quran-start-over-btn">&#8630; Start over</button>
      </div>
    </div>
  `);
  card.querySelector(".quran-start-date").addEventListener("change", (e) => {
    if (e.target.value) {
      settings.startDate = e.target.value;
      scheduleSave();
      renderQuranSheet(sheet.__id);
    }
  });
  card.querySelector(".quran-start-over-btn").addEventListener("click", () => {
    // Mirrors the Bible sheet's "Start over" exactly — resets the live
    // reading progress and pace, nothing else.
    confirmModal(
      "Start the reading plan over?",
      "Every reading goes back to unread and the pace resets from today.",
      "Start over",
      () => {
        sheet.items.forEach((item) => {
          item.done = false;
          item.completedDate = null;
        });
        settings.startDate = todayISO();
        scheduleSave();
        renderQuranSheet(sheet.__id);
      }
    );
  });
  panel.appendChild(card);
}

function renderQuranSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.__id = id; // so the pace card's date-change handler can re-render without threading id through
  const total = sheet.items.length;
  const doneCount = sheet.items.filter((r) => r.done).length;

  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));
  renderQuranPace(panel, sheet, doneCount, total);

  const list = el(`<div class="quran-list"></div>`);
  sheet.items.forEach((item) => {
    const row = el(`
      <div class="quran-row">
        <div class="checkbox ${item.done ? "checked" : ""}">${checkSvg}</div>
        <div class="quran-text ${item.done ? "done" : ""}">${escapeHtml(item.reading)}</div>
      </div>
    `);
    row.querySelector(".checkbox").addEventListener("click", () => {
      item.done = !item.done;
      if (item.done) item.completedDate = todayISO();
      scheduleSave();
      renderQuranSheet(id);
    });
    list.appendChild(row);
  });
  panel.appendChild(list);
}

// ------------------------------------------------------------------
// Book List — grouped by category (collapsible, like the wardrobe),
// with a To Read / Read / All filter, and each book expandable to show
// format, notes, and a link — with Online rating and My rating kept
// clearly distinct, since one exists for every book and the other only
// once she's actually read it.
// ------------------------------------------------------------------
function starsFor(n) {
  return n ? "⭐️".repeat(n) : "";
}

let bookSearchQuery = ""; // resets each session, not persisted — same treatment as settingsSubTab

function renderBookSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.milestonesEarned ||= {};
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const todayStr = todayISO();

  // ---- Streak, at the top like the other practices ----
  panel.appendChild(buildStreakCard(computeReadingStreak(todayStr), "day reading streak"));

  // Learning pillar check-in — a real log entry (which book, which
  // chapter), not just a same-day marker. Separate from any single
  // book's finished status, since the habit is reading today, not
  // finishing a book today.
  const todaysLog = (state.learningLog || []).find((e) => e.date === todayStr);
  const todaysBook = todaysLog?.bookId ? sheet.items.find((b) => b.id === todaysLog.bookId) : null;
  const learningRow = el(`
    <button type="button" class="learning-checkin-row${todaysLog ? " done" : ""}">
      <span class="learning-checkin-check${todaysLog ? " on" : ""}">${todaysLog ? checkSvg : ""}</span>
      <span class="learning-checkin-label">
        ${
          todaysLog
            ? `Logged today${todaysBook ? ` — ${escapeHtml(todaysBook.title)}${todaysLog.chapter ? `, ch. ${todaysLog.chapter}` : ""}` : ""} · tap to update`
            : "Log today's reading"
        }
      </span>
    </button>
  `);
  learningRow.addEventListener("click", () => openReadingLogModal(id));
  panel.appendChild(learningRow);
  if (!sheet.items.length) {
    panel.appendChild(el(`<div class="muted" style="padding:2px 0 12px; font-size:12px;">Add a book below, then log your reading against it.</div>`));
  }

  const total = sheet.items.length;
  const readCount = sheet.items.filter((b) => b.read).length;
  const summaryRow = el(`
    <div class="book-summary-strip">
      <div class="book-summary-chip"><div class="num">${total}</div><div class="lbl">Total books</div></div>
      <div class="book-summary-chip"><div class="num">${readCount}</div><div class="lbl">Read</div></div>
      <div class="book-summary-chip"><div class="num">${total - readCount}</div><div class="lbl">To read</div></div>
    </div>
  `);
  panel.appendChild(summaryRow);

  // A shelf this size is easy to lose a specific book in, especially when
  // trying to log today's reading against it — search by title or author
  // narrows straight to it instead of scrolling and opening categories.
  const searchWrap = el(`
    <div class="book-search-wrap">
      <input type="text" class="book-search-input" placeholder="Search by title or author…" value="${escapeHtml(bookSearchQuery)}" />
      ${bookSearchQuery ? `<button type="button" class="icon-btn book-search-clear" aria-label="Clear search">${closeSvg}</button>` : ""}
    </div>
  `);
  const searchInput = searchWrap.querySelector(".book-search-input");
  // Re-rendering the whole panel on every keystroke (same pattern as
  // everything else here) would normally steal focus back to nothing —
  // restore it and the cursor position right after so typing feels
  // continuous instead of kicking you out after each letter.
  searchInput.addEventListener("input", () => {
    bookSearchQuery = searchInput.value;
    const caret = searchInput.selectionStart;
    renderBookSheet(id);
    const freshInput = panel.querySelector(".book-search-input");
    if (freshInput) {
      freshInput.focus();
      freshInput.setSelectionRange(caret, caret);
    }
  });
  searchWrap.querySelector(".book-search-clear")?.addEventListener("click", () => {
    bookSearchQuery = "";
    renderBookSheet(id);
    panel.querySelector(".book-search-input")?.focus();
  });
  panel.appendChild(searchWrap);

  const filterRow = el(`<div class="view-toggle-row"><div class="view-toggle"></div></div>`);
  const filterWrap = filterRow.querySelector(".view-toggle");
  [
    ["toread", "To Read"],
    ["read", "Read"],
    ["all", "All"],
  ].forEach(([key, label]) => {
    const btn = el(`<button type="button" class="${sheet.activeStatus === key ? "active" : ""}">${label}</button>`);
    btn.addEventListener("click", () => {
      sheet.activeStatus = key;
      scheduleSave();
      renderBookSheet(id);
    });
    filterWrap.appendChild(btn);
  });
  panel.appendChild(filterRow);

  const query = bookSearchQuery.trim().toLowerCase();
  const items = sheet.items.filter((b) => {
    if (sheet.activeStatus === "read" && !b.read) return false;
    if (sheet.activeStatus === "toread" && b.read) return false;
    if (query && !`${b.title} ${b.author}`.toLowerCase().includes(query)) return false;
    return true;
  });

  const categories = [];
  const byCategory = new Map();
  items.forEach((b) => {
    if (!byCategory.has(b.category)) {
      byCategory.set(b.category, []);
      categories.push(b.category);
    }
    byCategory.get(b.category).push(b);
  });

  if (!items.length && query) {
    panel.appendChild(el(`<div class="muted" style="padding:10px 0;">No books match "${escapeHtml(bookSearchQuery)}".</div>`));
  } else if (!items.length) {
    panel.appendChild(el(`<div class="muted" style="padding:10px 0;">Nothing here yet — add a book below.</div>`));
  }

  categories.forEach((cat) => {
    const catItems = byCategory.get(cat);
    const doneCount = catItems.filter((b) => b.read).length;
    const remembered = sheet.openCategories[cat];
    // A search result hiding inside a category she'd collapsed earlier
    // would defeat the point — while searching, every category stays open
    // regardless of what's remembered.
    const shouldOpen = query ? true : remembered !== undefined ? remembered : true;
    const group = el(`
      <details class="wardrobe-group" ${shouldOpen ? "open" : ""}>
        <summary class="wardrobe-summary">
          <span class="wardrobe-cat-title">${escapeHtml(cat)}</span>
          <span class="muted">${doneCount}/${catItems.length}</span>
        </summary>
        <div class="wardrobe-items"></div>
      </details>
    `);
    group.addEventListener("toggle", () => {
      sheet.openCategories[cat] = group.open;
      scheduleSave();
    });
    const itemsWrap = group.querySelector(".wardrobe-items");
    catItems.forEach((book) => {
      const badge = book.read && book.myRating
        ? `<div class="wi-price bk-rating-badge">Mine<br><span class="stars">${starsFor(book.myRating)}</span></div>`
        : book.onlineRating
        ? `<div class="wi-price bk-rating-badge">Online<br><span class="stars">${starsFor(book.onlineRating)}</span></div>`
        : `<div class="wi-price"></div>`;
      const linkIcon = book.link
        ? `<a class="wi-link-icon" href="${escapeHtml(book.link)}" target="_blank" rel="noopener noreferrer" title="Open link">${linkSvg}</a>`
        : "";
      const facts = [
        ["Format", book.format],
        ["Progress", book.totalChapters ? `Chapter ${book.currentChapter || 0} of ${book.totalChapters}` : ""],
        ["Online rating", starsFor(book.onlineRating)],
        ["My rating", book.read ? starsFor(book.myRating) : ""],
      ].filter(([, v]) => v);
      const factsHtml = facts
        .map(([label, val]) => `<div class="wi-detail-fact"><span class="wi-detail-fact-label">${escapeHtml(label)}</span><span class="wi-detail-fact-val">${escapeHtml(val)}</span></div>`)
        .join("");
      const item = el(`
        <details class="wardrobe-item">
          <summary class="wardrobe-row">
            <div class="checkbox ${book.read ? "checked" : ""}">${checkSvg}</div>
            <div class="wi-body">
              <div class="wi-name ${book.read ? "owned" : ""}">${escapeHtml(book.title)}${linkIcon}</div>
              <div class="wi-sub">${escapeHtml(book.author)}</div>
            </div>
            ${badge}
            <span class="wardrobe-chevron">${chevronSvg}</span>
          </summary>
          <div class="wardrobe-item-detail">
            <div class="wi-detail-facts">${factsHtml}</div>
            ${book.notes ? `<div class="wi-detail-notes">${escapeHtml(book.notes)}</div>` : ""}
            <div class="wi-detail-actions">
              ${book.link ? `<a class="btn-ghost wi-detail-link" href="${escapeHtml(book.link)}" target="_blank" rel="noopener noreferrer">${linkSvg} Open link</a>` : ""}
              <button type="button" class="btn-ghost wi-detail-log">Log reading</button>
              <button type="button" class="btn-ghost wi-detail-edit">${editSvg} Edit</button>
            </div>
          </div>
        </details>
      `);
      item.querySelector(".checkbox").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        book.read = !book.read;
        scheduleSave();
        renderBookSheet(id);
      });
      item.querySelector(".wi-link-icon")?.addEventListener("click", (e) => e.stopPropagation());
      item.querySelector(".wi-detail-edit").addEventListener("click", () => openBookItemModal(id, book.id));
      item.querySelector(".wi-detail-log").addEventListener("click", () => openReadingLogModal(id, book.id));
      itemsWrap.appendChild(item);
    });
    panel.appendChild(group);
  });

  const addBtn = el(`<button type="button" class="btn-ghost" style="margin-top:16px;">+ Add book</button>`);
  addBtn.addEventListener("click", () => openBookItemModal(id, null));
  panel.appendChild(addBtn);

  // ---- Milestones — permanent, unlike the streak above ----
  panel.appendChild(buildMilestonesCard(sheet, BOOK_MILESTONES, todayStr));
}

const BOOK_FORMAT_OPTIONS = ["read", "listen", "listen & read", "listen or read"];
const BOOK_RATING_OPTIONS = [
  ["", "—"],
  ["1", "⭐️"],
  ["2", "⭐️⭐️"],
  ["3", "⭐️⭐️⭐️"],
  ["4", "⭐️⭐️⭐️⭐️"],
  ["5", "⭐️⭐️⭐️⭐️⭐️"],
];

function openBookItemModal(sheetId, itemId) {
  const sheet = state.customSheets[sheetId];
  const isNew = !itemId;
  const item = isNew
    ? { title: "", author: "", category: "", format: "listen or read", link: "", read: false, onlineRating: null, myRating: null, notes: "", totalChapters: null, currentChapter: 0 }
    : sheet.items.find((b) => b.id === itemId);
  if (!item) return;

  const existingCategories = [...new Set(sheet.items.map((b) => b.category).filter(Boolean))].sort();

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>${isNew ? "Add book" : "Edit book"}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Title</label>
          <input type="text" class="bk-f-title" value="${escapeHtml(item.title)}" />

          <label class="muted">Author</label>
          <input type="text" class="bk-f-author" value="${escapeHtml(item.author)}" />

          <label class="muted">Category</label>
          <input type="text" class="bk-f-category" value="${escapeHtml(item.category)}" list="bk-category-list" />
          <datalist id="bk-category-list">${existingCategories.map((c) => `<option value="${escapeHtml(c)}"></option>`).join("")}</datalist>

          <div class="wardrobe-form-row">
            <div>
              <label class="muted">Format</label>
              <select class="bk-f-format">${BOOK_FORMAT_OPTIONS.map((f) => `<option value="${f}" ${item.format === f ? "selected" : ""}>${f}</option>`).join("")}</select>
            </div>
            <div>
              <label class="muted">Status</label>
              <select class="bk-f-read">
                <option value="0" ${!item.read ? "selected" : ""}>To Read</option>
                <option value="1" ${item.read ? "selected" : ""}>Read</option>
              </select>
            </div>
          </div>

          <div class="wardrobe-form-row">
            <div>
              <label class="muted">Total chapters</label>
              <input type="number" min="0" class="bk-f-total-chapters" value="${item.totalChapters || ""}" placeholder="e.g. 24" />
            </div>
            <div>
              <label class="muted">Currently on</label>
              <input type="number" min="0" class="bk-f-current-chapter" value="${item.currentChapter || 0}" />
            </div>
          </div>

          <div class="wardrobe-form-row">
            <div>
              <label class="muted">Online rating</label>
              <select class="bk-f-online-rating">${BOOK_RATING_OPTIONS.map(([v, lbl]) => `<option value="${v}" ${String(item.onlineRating || "") === v ? "selected" : ""}>${lbl}</option>`).join("")}</select>
            </div>
            <div>
              <label class="muted">My rating</label>
              <select class="bk-f-my-rating">${BOOK_RATING_OPTIONS.map(([v, lbl]) => `<option value="${v}" ${String(item.myRating || "") === v ? "selected" : ""}>${lbl}</option>`).join("")}</select>
            </div>
          </div>

          <label class="muted">Notes</label>
          <textarea class="bk-f-notes" rows="3">${escapeHtml(item.notes)}</textarea>

          <label class="muted">Link</label>
          <input type="url" class="bk-f-link" value="${escapeHtml(item.link)}" placeholder="https://…" />
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <div>${isNew ? "" : `<button type="button" class="btn-ghost danger bk-delete">Delete</button>`}</div>
          <button type="button" class="btn-primary bk-save">${isNew ? "Add" : "Save"}</button>
        </div>
      </div>
    </div>
  `);

  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector(".bk-save").addEventListener("click", () => {
    const updated = {
      title: overlay.querySelector(".bk-f-title").value.trim(),
      author: overlay.querySelector(".bk-f-author").value.trim(),
      category: overlay.querySelector(".bk-f-category").value.trim(),
      format: overlay.querySelector(".bk-f-format").value,
      read: overlay.querySelector(".bk-f-read").value === "1",
      totalChapters: overlay.querySelector(".bk-f-total-chapters").value ? Number(overlay.querySelector(".bk-f-total-chapters").value) : null,
      currentChapter: overlay.querySelector(".bk-f-current-chapter").value ? Number(overlay.querySelector(".bk-f-current-chapter").value) : 0,
      onlineRating: overlay.querySelector(".bk-f-online-rating").value ? Number(overlay.querySelector(".bk-f-online-rating").value) : null,
      myRating: overlay.querySelector(".bk-f-my-rating").value ? Number(overlay.querySelector(".bk-f-my-rating").value) : null,
      notes: overlay.querySelector(".bk-f-notes").value.trim(),
      link: overlay.querySelector(".bk-f-link").value.trim(),
    };
    if (!updated.title) return;
    if (isNew) {
      sheet.items.push({ id: nextId(), ...updated });
    } else {
      Object.assign(item, updated);
    }
    scheduleSave();
    overlay.remove();
    renderBookSheet(sheetId);
  });

  const deleteBtn = overlay.querySelector(".bk-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      confirmModal("Delete book?", `Remove "${item.title}" from your book list?`, "Delete", () => {
        sheet.items = sheet.items.filter((b) => b.id !== item.id);
        scheduleSave();
        overlay.remove();
        renderBookSheet(sheetId);
      });
    });
  }

  document.body.appendChild(overlay);
}

// Logging a day's reading — pick which book (from the library, since a
// day of reading only means something attached to a specific book), how
// far she got, format-aware label pulled straight from that book's own
// Format field rather than asking again. Upserts today's entry so
// re-logging the same day just updates the chapter instead of stacking
// duplicates, and rolls the chapter forward onto the book itself so the
// Book List row's progress fact stays in sync.
function openReadingLogModal(sheetId, presetBookId) {
  const sheet = state.customSheets[sheetId];
  if (!sheet) return;
  if (!sheet.items.length) {
    openBookItemModal(sheetId, null);
    return;
  }
  const todayStr = todayISO();
  const existing = (state.learningLog || []).find((e) => e.date === todayStr);
  const startBookId = presetBookId || existing?.bookId || sheet.items[0].id;

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Log today's reading</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Book</label>
          <div class="rl-search-wrap">
            <input type="text" class="rl-search-input" placeholder="Search your books…" />
          </div>
          <select class="rl-f-book"></select>
          <div class="rl-search-empty" hidden>No books match — try a different search.</div>

          <label class="muted rl-f-format-label"></label>

          <label class="muted">What chapter did you finish?</label>
          <input type="number" min="0" class="rl-f-chapter" />
          <div class="rl-chapter-hint muted">Read more than one? Just enter the last one — the rest count automatically.</div>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <div></div>
          <button type="button" class="btn-primary rl-save">${existing ? "Update log" : "Log it"}</button>
        </div>
      </div>
    </div>
  `);

  const searchInput = overlay.querySelector(".rl-search-input");
  const bookSelect = overlay.querySelector(".rl-f-book");
  const emptyNote = overlay.querySelector(".rl-search-empty");
  const chapterInput = overlay.querySelector(".rl-f-chapter");
  const formatLabel = overlay.querySelector(".rl-f-format-label");
  const saveBtn = overlay.querySelector(".rl-save");

  // A long shelf makes a plain dropdown slow to search on mobile — typing
  // here narrows the actual <select> down to matching title/author before
  // she has to open it, so the picker itself stays a normal, familiar
  // control instead of a custom widget.
  function renderOptions(query, keepId) {
    const q = query.trim().toLowerCase();
    const matches = sheet.items.filter((b) => !q || `${b.title} ${b.author}`.toLowerCase().includes(q));
    const selectedId = matches.some((b) => b.id === keepId) ? keepId : matches[0]?.id;
    bookSelect.innerHTML = matches.map((b) => `<option value="${b.id}" ${b.id === selectedId ? "selected" : ""}>${escapeHtml(b.title)}${b.author ? ` — ${escapeHtml(b.author)}` : ""}</option>`).join("");
    const hasMatches = matches.length > 0;
    bookSelect.hidden = !hasMatches;
    emptyNote.hidden = hasMatches;
    saveBtn.disabled = !hasMatches;
    return selectedId;
  }

  // A <select>'s .value is always a string, but book ids are numbers
  // (assigned by nextId()) — comparing them with === silently fails, so
  // every read of bookSelect.value gets coerced back to a number here
  // before it's ever matched against sheet.items.
  function syncForBook() {
    const book = sheet.items.find((b) => b.id === Number(bookSelect.value));
    formatLabel.textContent = book?.format ? `Format: ${book.format}` : "";
    const carryOverChapter = book?.id === existing?.bookId ? existing?.chapter : null;
    chapterInput.value = carryOverChapter ?? book?.currentChapter ?? 0;
  }
  renderOptions("", startBookId);
  syncForBook();

  searchInput.addEventListener("input", () => {
    renderOptions(searchInput.value, Number(bookSelect.value));
    syncForBook();
  });
  bookSelect.addEventListener("change", syncForBook);

  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector(".rl-save").addEventListener("click", () => {
    const bookId = Number(bookSelect.value);
    const book = sheet.items.find((b) => b.id === bookId);
    const chapter = chapterInput.value ? Number(chapterInput.value) : null;
    if (!book) return;

    state.learningLog = (state.learningLog || []).filter((e) => e.date !== todayStr);
    state.learningLog.push({ date: todayStr, bookId, chapter });

    if (chapter !== null) {
      book.currentChapter = chapter;
      if (book.totalChapters && chapter >= book.totalChapters) book.read = true;
    }

    scheduleSave();
    overlay.remove();
    renderBookSheet(sheetId);
    renderHome();
  });

  document.body.appendChild(overlay);
}

// Reading streak — state.learningLog is global (one entry per calendar
// date, across every Book List sheet, per the "re-logging today just
// updates the entry" rule above), so this reads off that shared log
// rather than anything scoped to a particular sheet's own items.
function computeReadingStreak(today) {
  const log = state.learningLog || [];
  let streak = 0;
  let d = today;
  while (log.some((e) => e.date === d)) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}
function computeLongestReadingStreak() {
  const dates = [...new Set((state.learningLog || []).map((e) => e.date))].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  dates.forEach((d) => {
    current = prev && addDays(prev, 1) === d ? current + 1 : 1;
    longest = Math.max(longest, current);
    prev = d;
  });
  return longest;
}
const BOOK_MILESTONES = [
  {
    key: "tenReadingDays",
    label: "10 reading days logged",
    icon: "📖",
    progress: (sheet) => {
      const n = (state.learningLog || []).length;
      return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `${n} of 10` };
    },
  },
  {
    key: "fiveBooksFinished",
    label: "5 books finished",
    icon: "📚",
    progress: (sheet) => {
      const n = sheet.items.filter((b) => b.read).length;
      return { earned: n >= 5, frac: Math.min(1, n / 5), caption: `${n} of 5` };
    },
  },
  {
    key: "twentyBooksFinished",
    label: "20 books finished",
    icon: "🏅",
    progress: (sheet) => {
      const n = sheet.items.filter((b) => b.read).length;
      return { earned: n >= 20, frac: Math.min(1, n / 20), caption: `${n} of 20` };
    },
  },
  {
    key: "weekStreak",
    label: "7-day streak",
    icon: "🏆",
    progress: () => {
      const longest = computeLongestReadingStreak();
      return { earned: longest >= 7, frac: Math.min(1, longest / 7), caption: `Best: ${longest} of 7` };
    },
  },
];

// ------------------------------------------------------------------
// Connections Log — the Social Connection pillar's home. Built around
// people, not a plain entry list: each person you've logged becomes a
// quick-log chip (tap to log today with their usual kind, no form),
// the app surfaces whoever's overdue against their own normal rhythm,
// and "Your circle" groups history by person instead of by date so it
// reads as who's been neglected, not just a feed of what happened.
// ------------------------------------------------------------------
const SOCIAL_KIND_OPTIONS = ["In person", "Phone call", "Video call", "Text / message thread", "Group hangout"];
// Below this many days since last contact, don't bother flagging anyone
// overdue — a couple of days' gap is normal, not a lapse.
const SOCIAL_MIN_OVERDUE_DAYS = 5;
// Nobody's logged twice yet, so there's no real cadence to compare
// against — assume a weekly rhythm until a second log says otherwise.
const SOCIAL_DEFAULT_CADENCE_DAYS = 7;

function socialPersonEntries(sheet, personId) {
  return sheet.items.filter((e) => e.personId === personId).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

// A person's own rhythm, read back from their own log history — the
// same "on track" vs "overdue" read the mockup showed, computed for
// real instead of hard-coded.
function socialPersonCadence(sheet, person, today) {
  const entries = socialPersonEntries(sheet, person.id);
  if (!entries.length) return { lastDate: null, daysSince: null, cadenceDays: SOCIAL_DEFAULT_CADENCE_DAYS, status: "new" };
  const lastDate = entries[entries.length - 1].date;
  const daysSince = daysBetween(new Date(lastDate + "T00:00:00"), new Date(today + "T00:00:00"));
  const gaps = [];
  for (let i = 1; i < entries.length; i++) {
    gaps.push(daysBetween(new Date(entries[i - 1].date + "T00:00:00"), new Date(entries[i].date + "T00:00:00")));
  }
  const cadenceDays = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) || 1 : SOCIAL_DEFAULT_CADENCE_DAYS;
  const overdueThreshold = Math.max(Math.round(cadenceDays * 1.5), SOCIAL_MIN_OVERDUE_DAYS);
  const status = daysSince === 0 ? "today" : daysSince >= overdueThreshold ? "overdue" : "onTrack";
  return { lastDate, daysSince, cadenceDays, status, overdueThreshold };
}

function socialCadenceLabel(cadence) {
  if (cadence.status === "today") return "Logged today";
  if (cadence.status === "new") return "First log";
  if (cadence.lastDate == null) return "";
  return `${cadence.daysSince} day${cadence.daysSince === 1 ? "" : "s"} ago`;
}

// Logs today for a person with one tap — their most recently used kind,
// no form. If they're already logged today this is treated as "log
// again" (a second real connection that day), which is rare but real.
function socialQuickLog(sheetId, personId) {
  const sheet = state.customSheets[sheetId];
  const person = sheet.people.find((p) => p.id === personId);
  if (!person) return;
  const entries = socialPersonEntries(sheet, personId);
  const lastKind = entries.length ? entries[entries.length - 1].kind : SOCIAL_KIND_OPTIONS[0];
  sheet.items.push({ id: nextId(), personId, kind: lastKind, date: todayISO(), notes: "" });
  scheduleSave();
  renderSocialSheet(sheetId);
  renderHome();
}

// Overall "day streak" for Connections, separate from and on top of the
// per-person cadence tracking above — same qualifying condition the
// Social pillar already uses (a real entry logged that day, any person,
// any kind), so this always agrees with what Home shows as Yes/No.
function computeSocialStreak(sheet, today) {
  let streak = 0;
  let d = today;
  while (sheet.items.some((i) => i.date === d)) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}
function computeLongestSocialStreak(sheet) {
  const dates = [...new Set(sheet.items.map((i) => i.date))].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  dates.forEach((d) => {
    current = prev && addDays(prev, 1) === d ? current + 1 : 1;
    longest = Math.max(longest, current);
    prev = d;
  });
  return longest;
}
const SOCIAL_MILESTONES = [
  {
    key: "tenLogged",
    label: "10 connections logged",
    icon: "💛",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `${n} of 10` };
    },
  },
  {
    key: "fiftyLogged",
    label: "50 connections logged",
    icon: "🌻",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 50, frac: Math.min(1, n / 50), caption: `${n} of 50` };
    },
  },
  {
    key: "hundredLogged",
    label: "100 connections logged",
    icon: "🏅",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 100, frac: Math.min(1, n / 100), caption: `${n} of 100` };
    },
  },
  {
    key: "weekStreak",
    label: "7-day streak",
    icon: "🏆",
    progress: (sheet) => {
      const longest = computeLongestSocialStreak(sheet);
      return { earned: longest >= 7, frac: Math.min(1, longest / 7), caption: `Best: ${longest} of 7` };
    },
  },
];

// ------------------------------------------------------------------
// Activity Log — Workout Log's sibling under the Movement pillar for
// everything that isn't sets and reps: a walk, a hike, a run, a ride.
// Deliberately manual-only (duration + optional distance, no elevation,
// no GPS) since this runs as a web app with no device sensor access.
// Always logs as today, on purpose — no date field, so a missed day is
// genuinely missed rather than quietly backfilled, the same "it's
// alive" logic the streak already runs on. An already-logged entry can
// still be corrected afterward (fixing a typo in History), just never
// backdated into existence.
// ------------------------------------------------------------------
const ACTIVITY_CORE_TYPES = [
  { key: "walk", label: "Walk", icon: "🚶" },
  { key: "hike", label: "Hike", icon: "🥾" },
  { key: "run", label: "Run", icon: "🏃" },
  { key: "bike", label: "Bike", icon: "🚴" },
  { key: "swim", label: "Swim", icon: "🏊" },
  { key: "yoga", label: "Yoga", icon: "🧘" },
  { key: "climbing", label: "Climbing", icon: "🧗" },
];
const ACTIVITY_ADD_ICON_SUGGESTIONS = ["🏈", "🏒", "⚽", "🎾", "🏓", "⛹️", "🤾", "🚣"];
const ACTIVITY_WEEKLY_GOAL_DEFAULT = 150;
// The grid only ever shows this many tiles, plus "Add new" as the
// eighth — otherwise it would grow forever as custom types pile up.
// Which seven make the cut is driven by actual use (see
// activityTypesForGrid), not creation order, so whatever you're
// actually doing lately surfaces on its own and something you've
// stopped doing quietly drifts out of the way — never deleted, just
// not competing for space up top.
const ACTIVITY_GRID_CAP = 7;

// Session-only UI state (which chip is selected, whether "Add new" is
// open) — resets each session, not persisted, same treatment as
// settingsSubTab/bookSearchQuery. Keyed by sheet id in case more than
// one Activity Log space ever exists.
let activityUiStateBySheet = {};
function activityUiState(id) {
  return (activityUiStateBySheet[id] ||= { selectedTypeKey: ACTIVITY_CORE_TYPES[0].key, addingNew: false });
}

function activityTypesFor(sheet) {
  return ACTIVITY_CORE_TYPES.concat(sheet.customTypes || []);
}
function activityTypeByKey(sheet, key) {
  return activityTypesFor(sheet).find((t) => t.key === key) || { key, label: "Activity", icon: "🏃" };
}

// Most-recently-logged first (ties broken by definition order — core
// types in their fixed order, then custom types in the order they were
// added), so whatever you've actually been doing lately floats to the
// front of the grid the same way Connections Log's quick-log chips
// already reorder by who you last talked to. A type you've never used
// sorts to the back, not off the list — it still shows once there's
// room, just never displaces something you use.
function activityTypesByRecency(sheet) {
  const all = activityTypesFor(sheet);
  const lastUsed = new Map();
  sheet.items.forEach((entry) => {
    const prev = lastUsed.get(entry.typeKey);
    if (!prev || entry.date > prev) lastUsed.set(entry.typeKey, entry.date);
  });
  return all
    .map((t, i) => ({ t, order: i, used: lastUsed.get(t.key) || null }))
    .sort((a, b) => {
      if (a.used && b.used) return a.used < b.used ? 1 : a.used > b.used ? -1 : a.order - b.order;
      if (a.used) return -1;
      if (b.used) return 1;
      return a.order - b.order;
    })
    .map((x) => x.t);
}
// The grid's visible slice — capped so it never grows without bound.
function activityTypesForGrid(sheet) {
  return activityTypesByRecency(sheet).slice(0, ACTIVITY_GRID_CAP);
}
function activityDateShort(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}
function activityDurationLabel(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

// Consecutive days with at least one logged entry — same "today gets a
// grace day" logic as computeStreakStats, so logging later today still
// counts even before you've gotten to it.
function computeActivityStreak(sheet, today) {
  let current = 0;
  let cursor = today;
  let isToday = true;
  while (true) {
    const active = sheet.items.some((i) => i.date === cursor);
    if (active) current++;
    else if (!isToday) break;
    isToday = false;
    cursor = addDays(cursor, -1);
  }
  return current;
}

// Minutes logged in the rolling 7-day window ending today (not a
// calendar week) — matches how the rest of the app measures windows
// (deposit cycles, the sleep trend) as "last N days" rather than
// resetting on a fixed weekday.
function computeActivityWeeklyMinutes(sheet, today) {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, -i);
    sheet.items.forEach((entry) => {
      if (entry.date === d) total += entry.durationMin || 0;
    });
  }
  return total;
}

// The mix pulls from every space actually mapped to Movement, not just
// this one — so a week of strength training shows up here too, instead
// of the chart implying nothing happened when Workout Log tells a
// different story.
function computeMovementMix(sheet, today) {
  const WINDOW = 30;
  const counts = new Map(); // label -> count
  for (let i = 0; i < WINDOW; i++) {
    const d = addDays(today, -i);
    sheet.items.forEach((entry) => {
      if (entry.date !== d) return;
      const t = activityTypeByKey(sheet, entry.typeKey);
      counts.set(t.label, (counts.get(t.label) || 0) + 1);
    });
  }
  (state.pillarSourceMap?.movement || []).forEach((sheetId) => {
    const other = state.customSheets[sheetId];
    if (!other || other.templateKey !== "workout") return;
    const goodDays = flattenWorkoutDays(other).slice(-WINDOW).filter((d) => d.tone === "good").length;
    if (goodDays) {
      const otherSheet = state.sheets.find((s) => s.id === sheetId);
      const label = `Strength (${otherSheet ? sheetLabel(otherSheet) : "Workout Log"})`;
      counts.set(label, (counts.get(label) || 0) + goodDays);
    }
  });
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count, pct: total ? Math.round((count / total) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);
}

// ------------------------------------------------------------------
// Shared practice-page building blocks — the streak chip at the top and
// the Milestones card near the bottom look and sit the same way across
// every ongoing practice (Activity Log, Meal Log, Workout Log,
// Connections, Book List), even though what they're each counting is
// completely different underneath. One shared builder for each means
// they can't quietly drift apart from each other again the way they had
// before this pass.
// ------------------------------------------------------------------
function buildStreakCard(streak, label, extraHtml) {
  return el(`
    <div class="card">
      <div class="al-streak-chip">${homeStreakFlameSvg(streak)}<span class="num">${streak}</span><span class="lbl">${escapeHtml(label)}</span></div>
      ${extraHtml || ""}
    </div>
  `);
}

// Permanent, cumulative — unlike the streak above, these never reset.
// Each returns a fraction toward the goal so an unearned milestone can
// still show real progress instead of just looking locked. `sheet` here
// is whatever record the milestone defs' progress() functions expect —
// almost always a customSheet, but callers decide.
function buildMilestonesCard(sheet, milestoneDefs, today) {
  sheet.milestonesEarned ||= {};
  let earnedChanged = false;
  milestoneDefs.forEach((m) => {
    const p = m.progress(sheet);
    if (p.earned && !sheet.milestonesEarned[m.key]) {
      sheet.milestonesEarned[m.key] = today;
      earnedChanged = true;
    }
  });
  if (earnedChanged) scheduleSave();

  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div class="al-card-title">Milestones</div>`));
  card.appendChild(el(`<div class="al-note-line" style="margin-bottom:14px;">Permanent, once earned &mdash; unlike the streak above, these never reset.</div>`));
  const badgeRow = el(`<div class="pr-badge-grid"></div>`);
  milestoneDefs.forEach((m) => {
    const p = m.progress(sheet);
    const earnedDate = sheet.milestonesEarned[m.key];
    const badge = earnedDate
      ? el(`
          <div class="pr-badge">
            <div class="pr-badge-medal earned">${m.icon}</div>
            <div class="pr-badge-text">
              <div class="lbl">${escapeHtml(m.label)}</div>
              <div class="sub earned-date">Earned ${activityDateShort(earnedDate)}</div>
            </div>
          </div>
        `)
      : el(`
          <div class="pr-badge">
            <div class="pr-badge-medal progress" style="background: conic-gradient(#C6883F 0% ${Math.round(p.frac * 100)}%, var(--border) ${Math.round(p.frac * 100)}% 100%);">
              <div class="pr-badge-medal-inner">${m.icon}</div>
            </div>
            <div class="pr-badge-text">
              <div class="lbl">${escapeHtml(m.label)}</div>
              <div class="sub">${escapeHtml(p.caption)}</div>
            </div>
          </div>
        `);
    badgeRow.appendChild(badge);
  });
  card.appendChild(badgeRow);
  return card;
}

const ACTIVITY_MILESTONES = [
  {
    key: "first5milehike",
    label: "First 5-mile hike",
    icon: "🥾",
    progress: (sheet) => {
      const best = Math.max(0, ...sheet.items.filter((i) => i.typeKey === "hike").map((i) => i.distanceMi || 0));
      return { earned: best >= 5, frac: Math.min(1, best / 5), caption: `${best.toFixed(1)} of 5 mi` };
    },
  },
  {
    key: "fiftyMilesWalked",
    label: "50 miles walked",
    icon: "🔥",
    progress: (sheet) => {
      const sum = sheet.items.filter((i) => i.typeKey === "walk").reduce((a, i) => a + (i.distanceMi || 0), 0);
      return { earned: sum >= 50, frac: Math.min(1, sum / 50), caption: `${Math.round(sum)} of 50 mi` };
    },
  },
  {
    key: "hundredActivities",
    label: "100 activities logged",
    icon: "🏅",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 100, frac: Math.min(1, n / 100), caption: `${n} of 100` };
    },
  },
  {
    key: "fiftyHours",
    label: "50 hours total",
    icon: "⏱️",
    progress: (sheet) => {
      const hours = sheet.items.reduce((a, i) => a + (i.durationMin || 0), 0) / 60;
      return { earned: hours >= 50, frac: Math.min(1, hours / 50), caption: `${hours.toFixed(1)} of 50h` };
    },
  },
];

function renderActivitySheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.items ||= [];
  sheet.customTypes ||= [];
  sheet.weeklyGoalMinutes ||= ACTIVITY_WEEKLY_GOAL_DEFAULT;
  sheet.milestonesEarned ||= {};
  const ui = activityUiState(id);
  const today = todayISO();
  panel.innerHTML = "";

  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  // ---- Summary: weekly minutes + streak ----
  const weeklyMinutes = computeActivityWeeklyMinutes(sheet, today);
  const goal = sheet.weeklyGoalMinutes;
  const barPct = goal ? Math.min(100, Math.round((weeklyMinutes / goal) * 100)) : 0;
  // 2026-09 apps rearchitecture: Activity Log is its own Practice now,
  // with its own independent streak from its own logged days — it no
  // longer shares a combined "movement" streak with Workout Log.
  const streak = appCurrentStreak(id, today);
  const summaryCard = el(`
    <div class="card">
      <div class="al-summary-row">
        <span class="al-summary-label">Active minutes this week</span>
        <span class="al-summary-count">${weeklyMinutes} of <span class="al-goal-edit" title="Tap to change your weekly goal">${goal}</span></span>
      </div>
      <div class="al-bar" style="margin-bottom:12px;"><div class="al-bar-fill" style="width:${barPct}%;"></div></div>
      <div class="al-streak-chip">${homeStreakFlameSvg(streak)}<span class="num">${streak}</span><span class="lbl">day movement streak</span></div>
    </div>
  `);
  summaryCard.querySelector(".al-goal-edit").addEventListener("click", () => {
    const next = window.prompt("Weekly active-minutes goal:", String(goal));
    if (next == null) return;
    const n = parseInt(next, 10);
    if (!Number.isFinite(n) || n <= 0) return;
    sheet.weeklyGoalMinutes = n;
    scheduleSave();
    renderActivitySheet(id);
  });
  panel.appendChild(summaryCard);

  // ---- Log an activity ----
  const logCard = el(`<div class="card"></div>`);
  logCard.appendChild(el(`<div class="al-card-title">Log an activity</div>`));
  const chipRow = el(`<div class="al-chip-row"></div>`);
  const gridTypes = activityTypesForGrid(sheet);
  const overflowTypes = activityTypesByRecency(sheet).slice(ACTIVITY_GRID_CAP);
  gridTypes.forEach((t) => {
    const chip = el(`<button type="button" class="al-chip${t.key === ui.selectedTypeKey ? " active" : ""}"><span class="em">${t.icon}</span>${escapeHtml(t.label)}</button>`);
    chip.addEventListener("click", () => {
      ui.selectedTypeKey = t.key;
      ui.addingNew = false;
      renderActivitySheet(id);
    });
    chipRow.appendChild(chip);
  });
  const addChip = el(`<button type="button" class="al-chip al-chip-add${ui.addingNew ? " active" : ""}"><span class="em">➕</span>Add new</button>`);
  addChip.addEventListener("click", () => {
    ui.addingNew = !ui.addingNew;
    renderActivitySheet(id);
  });
  chipRow.appendChild(addChip);
  logCard.appendChild(chipRow);

  if (ui.addingNew) {
    const addBox = el(`
      <div class="al-add-box">
        ${
          overflowTypes.length
            ? `<label class="muted">Already have one of these? Tap it instead of adding a duplicate</label>
               <div class="al-chip-row al-overflow-row"></div>
               <div class="al-add-hint" style="margin-top:0;">Bumped off the grid above since it hasn't been used in a while — still yours, just tap to bring it back.</div>`
            : ""
        }
        <label class="muted" style="margin-top:${overflowTypes.length ? "12px" : "0"};">Or add something new</label>
        <input type="text" class="al-add-name" placeholder="e.g. Football" />
        <label class="muted" style="margin-top:10px;">Pick an icon</label>
        <div class="al-icon-swatch-row"></div>
        <label class="muted" style="margin-top:2px;">Or pick literally any emoji</label>
        <input type="text" class="al-add-emoji" maxlength="4" placeholder="😀" />
        <div class="al-add-hint">Tap in, then switch to your phone's emoji keyboard — anything there works, not just what's suggested above.</div>
        <button type="button" class="al-save-btn al-add-save">Add to my activities</button>
      </div>
    `);
    if (overflowTypes.length) {
      const overflowRow = addBox.querySelector(".al-overflow-row");
      overflowTypes.forEach((t) => {
        const chip = el(`<button type="button" class="al-chip"><span class="em">${t.icon}</span>${escapeHtml(t.label)}</button>`);
        chip.addEventListener("click", () => {
          ui.selectedTypeKey = t.key;
          ui.addingNew = false;
          renderActivitySheet(id);
        });
        overflowRow.appendChild(chip);
      });
    }
    let chosenIcon = ACTIVITY_ADD_ICON_SUGGESTIONS[0];
    const swatchRow = addBox.querySelector(".al-icon-swatch-row");
    const emojiInput = addBox.querySelector(".al-add-emoji");
    ACTIVITY_ADD_ICON_SUGGESTIONS.forEach((icon, i) => {
      const sw = el(`<button type="button" class="al-icon-swatch${i === 0 ? " sel" : ""}">${icon}</button>`);
      sw.addEventListener("click", () => {
        chosenIcon = icon;
        emojiInput.value = "";
        swatchRow.querySelectorAll(".al-icon-swatch").forEach((n) => n.classList.remove("sel"));
        sw.classList.add("sel");
      });
      swatchRow.appendChild(sw);
    });
    emojiInput.addEventListener("input", () => {
      if (emojiInput.value.trim()) {
        chosenIcon = emojiInput.value.trim();
        swatchRow.querySelectorAll(".al-icon-swatch").forEach((n) => n.classList.remove("sel"));
      }
    });
    addBox.querySelector(".al-add-save").addEventListener("click", () => {
      const name = addBox.querySelector(".al-add-name").value.trim();
      if (!name) return;
      const key = `custom_${nextId()}`;
      sheet.customTypes.push({ key, label: name, icon: chosenIcon });
      ui.selectedTypeKey = key;
      ui.addingNew = false;
      scheduleSave();
      renderActivitySheet(id);
    });
    logCard.appendChild(addBox);
  }

  const fieldRow1 = el(`
    <div class="al-field-row">
      <div class="al-field"><label>Duration (min)</label><input type="number" min="0" class="al-f-duration" /></div>
      <div class="al-field"><label>Distance (mi, optional)</label><input type="number" min="0" step="0.1" class="al-f-distance" /></div>
    </div>
  `);
  const fieldRow2 = el(`<div class="al-field-row"><div class="al-field"><label>Notes (optional)</label><input type="text" class="al-f-notes" /></div></div>`);
  logCard.appendChild(fieldRow1);
  logCard.appendChild(fieldRow2);
  const saveBtn = el(`<button type="button" class="al-save-btn">Save activity</button>`);
  saveBtn.addEventListener("click", () => {
    const durationMin = parseInt(logCard.querySelector(".al-f-duration").value, 10);
    if (!Number.isFinite(durationMin) || durationMin <= 0) {
      logCard.querySelector(".al-f-duration").focus();
      return;
    }
    const distanceRaw = logCard.querySelector(".al-f-distance").value;
    const distanceMi = distanceRaw ? parseFloat(distanceRaw) : null;
    const notes = logCard.querySelector(".al-f-notes").value.trim();
    sheet.items.push({ id: nextId(), typeKey: ui.selectedTypeKey, date: today, durationMin, distanceMi, notes });
    scheduleSave();
    renderHome(); // runs pillar auto-detection first, so the Movement streak below reflects today
    renderActivitySheet(id);
  });
  logCard.appendChild(saveBtn);
  logCard.appendChild(el(`<div class="al-note-line">Always logs as today &mdash; no backdating. Miss the day, miss the entry.</div>`));
  panel.appendChild(logCard);

  // ---- Milestones (right under logging — permanent, so it's worth
  // seeing before scrolling, unlike the lower-frequency lookback stuff
  // below) ----
  panel.appendChild(buildMilestonesCard(sheet, ACTIVITY_MILESTONES, today));

  // ---- Movement mix — collapsible, same treatment as Home's Trends
  // section: interesting to check in on, not something that needs to
  // sit open on every visit ----
  const mix = computeMovementMix(sheet, today);
  if (mix.length) {
    const mixDetails = el(`
      <details class="card">
        <summary class="book-summary" style="margin-bottom:2px;"><span class="al-card-title" style="margin:0;">Movement mix &middot; last 30 days</span></summary>
      </details>
    `);
    const mixWrap = el(`<div class="al-mix-wrap" style="margin-top:12px;"></div>`);
    // Cumulative stops use each slice's exact fraction of the total, not
    // the rounded display percentage — rounding five slices independently
    // (as the legend does) can overshoot 100% and visibly clip the wedge.
    const mixTotal = mix.reduce((a, m) => a + m.count, 0) || 1;
    let acc = 0;
    const stops = mix
      .map((m, i) => {
        const from = acc;
        acc += (m.count / mixTotal) * 100;
        const color = ["#A9804F", "#7C5C36", "#C7A876", "#DCC9A6", "#EFE3CF"][i % 5];
        return `${color} ${from}% ${acc}%`;
      })
      .join(", ");
    mixWrap.appendChild(el(`<div class="al-donut" style="background: conic-gradient(${stops});"></div>`));
    const legend = el(`<div class="al-legend"></div>`);
    mix.forEach((m, i) => {
      const color = ["#A9804F", "#7C5C36", "#C7A876", "#DCC9A6", "#EFE3CF"][i % 5];
      legend.appendChild(el(`<div class="al-legend-row"><span class="al-legend-dot" style="background:${color};"></span>${escapeHtml(m.label)}<span class="al-legend-pct">${m.pct}%</span></div>`));
    });
    mixWrap.appendChild(legend);
    mixDetails.appendChild(mixWrap);
    panel.appendChild(mixDetails);
  }

  // ---- History — the lookback list, at the bottom ----
  const historyCard = el(`<div class="card"></div>`);
  historyCard.appendChild(el(`<div class="al-card-title">History</div>`));
  const recent = [...sheet.items].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 20);
  if (!recent.length) {
    historyCard.appendChild(el(`<div class="muted">Nothing logged yet.</div>`));
  } else {
    historyCard.appendChild(el(`<div class="al-note-line" style="margin-bottom:6px;">Tap an entry to fix a typo &mdash; this corrects what you logged, it doesn't add a new day.</div>`));
    recent.forEach((entry) => {
      const t = activityTypeByKey(sheet, entry.typeKey);
      const metaParts = [activityDurationLabel(entry.durationMin)];
      if (entry.distanceMi) metaParts.push(`${entry.distanceMi} mi`);
      const dateLabel = entry.date === today ? "Today" : entry.date === addDays(today, -1) ? "Yesterday" : activityDateShort(entry.date);
      const row = el(`
        <button type="button" class="al-hist-row">
          <span class="al-hist-icon">${t.icon}</span>
          <span class="al-hist-main">
            <span class="al-hist-type">${escapeHtml(t.label)}${entry.notes ? ` &middot; ${escapeHtml(entry.notes)}` : ""}</span>
            <span class="al-hist-meta">${metaParts.join(" &middot; ")}</span>
          </span>
          <span class="al-hist-date">${dateLabel}</span>
        </button>
      `);
      row.addEventListener("click", () => openActivityEntryEditor(id, entry.id));
      historyCard.appendChild(row);
    });
  }
  panel.appendChild(historyCard);
}

// Corrects an already-logged entry (type, duration, distance, notes) —
// deliberately no date field here, same reasoning as the log form
// itself: this fixes a mistake in something you really did log, it
// never lets a new day get added after the fact.
function openActivityEntryEditor(sheetId, entryId) {
  const sheet = state.customSheets[sheetId];
  const entry = sheet?.items.find((i) => i.id === entryId);
  if (!sheet || !entry) return;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Edit activity</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Type</label>
          <div class="mp-kind-row ael-type-row">
            ${activityTypesFor(sheet)
              .map((t) => `<button type="button" class="mp-kind ael-type-opt${t.key === entry.typeKey ? " sel" : ""}" data-key="${escapeHtml(t.key)}">${t.icon} ${escapeHtml(t.label)}</button>`)
              .join("")}
          </div>
          <label class="muted">Duration (min)</label>
          <input type="number" min="0" class="ael-f-duration" value="${entry.durationMin}" />
          <label class="muted">Distance (mi, optional)</label>
          <input type="number" min="0" step="0.1" class="ael-f-distance" value="${entry.distanceMi || ""}" />
          <label class="muted">Notes</label>
          <textarea class="ael-f-notes" rows="2">${escapeHtml(entry.notes || "")}</textarea>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn-ghost danger ael-delete">Delete</button>
          <button type="button" class="btn-primary ael-save">Save</button>
        </div>
      </div>
    </div>
  `);
  let selectedKey = entry.typeKey;
  overlay.querySelectorAll(".ael-type-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedKey = btn.dataset.key;
      overlay.querySelectorAll(".ael-type-opt").forEach((b) => b.classList.toggle("sel", b === btn));
    });
  });
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.querySelector(".ael-delete").addEventListener("click", () => {
    sheet.items = sheet.items.filter((i) => i.id !== entryId);
    scheduleSave();
    close();
    renderActivitySheet(sheetId);
    renderHome();
  });
  overlay.querySelector(".ael-save").addEventListener("click", () => {
    const durationMin = parseInt(overlay.querySelector(".ael-f-duration").value, 10);
    if (!Number.isFinite(durationMin) || durationMin <= 0) return;
    const distanceRaw = overlay.querySelector(".ael-f-distance").value;
    entry.typeKey = selectedKey;
    entry.durationMin = durationMin;
    entry.distanceMi = distanceRaw ? parseFloat(distanceRaw) : null;
    entry.notes = overlay.querySelector(".ael-f-notes").value.trim();
    scheduleSave();
    close();
    renderActivitySheet(sheetId);
    renderHome();
  });
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Meal Log — Food's practice. Two light pieces: a meal library (go-to
// meals you keep coming back to, not a weekly schedule) and the daily
// log itself. Same rules as everywhere else: always logs
// as today, correct a past entry but never backdate a new one.
//
// Completion is deliberately NOT "did you log every meal" — every other
// pillar in the app completes off one real entry, not full-day coverage,
// and requiring breakfast+lunch+dinner here would make this the one
// pillar that's a real food diary. Instead it mirrors Sleep protected:
// logging always saves, but the day only completes once at least one
// entry that day is Nourishing or Balanced (see MEAL_HEALTHY_QUALITY_KEYS
// / mealLogDayQualifies). An Indulgent or Rushed day still logs honestly,
// it just doesn't complete the streak on its own — no all-or-nothing
// grading of the whole day.
// ------------------------------------------------------------------
const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "🍳" },
  { key: "lunch", label: "Lunch", icon: "🥗" },
  { key: "dinner", label: "Dinner", icon: "🍽️" },
  { key: "snack", label: "Snack", icon: "🍎" },
  { key: "drinks", label: "Drinks", icon: "🥤" },
];
const MEAL_QUALITY = [
  { key: "nourishing", label: "Nourishing", icon: "🥗" },
  { key: "balanced", label: "Balanced", icon: "🍽️" },
  { key: "indulgent", label: "Indulgent", icon: "🍰" },
  { key: "rushed", label: "Rushed", icon: "⏱️" },
];
const MEAL_HEALTHY_QUALITY_KEYS = ["nourishing", "balanced"];

let mealLogUiStateBySheet = {};
function mealLogUiState(id) {
  return (mealLogUiStateBySheet[id] ||= { selectedMealType: MEAL_TYPES[0].key, selectedQuality: MEAL_QUALITY[0].key });
}
function mealTypeByKey(key) {
  return MEAL_TYPES.find((t) => t.key === key) || MEAL_TYPES[0];
}
function mealQualityByKey(key) {
  return MEAL_QUALITY.find((q) => q.key === key) || MEAL_QUALITY[0];
}

// A day "counts" once one real entry that day is Nourishing or Balanced —
// see the block comment above for why this isn't "every meal logged."
function mealLogDayQualifies(sheet, date) {
  return sheet.items.some((i) => i.date === date && MEAL_HEALTHY_QUALITY_KEYS.includes(i.quality));
}
function computeMealLogStreak(sheet, today) {
  let current = 0;
  let cursor = today;
  let isToday = true;
  while (true) {
    const qualifies = mealLogDayQualifies(sheet, cursor);
    if (qualifies) current++;
    else if (!isToday) break;
    isToday = false;
    cursor = addDays(cursor, -1);
  }
  return current;
}
// Pure information, never gates anything — today's honest mix, shown
// alongside the streak so the fuller picture isn't lost just because the
// streak itself only needs one good entry to complete.
function mealLogTodaySummary(sheet, today) {
  const counts = {};
  sheet.items.forEach((i) => {
    if (i.date !== today) return;
    counts[i.quality] = (counts[i.quality] || 0) + 1;
  });
  return MEAL_QUALITY.map((q) => ({ ...q, count: counts[q.key] || 0 })).filter((q) => q.count > 0);
}

// Longest run ever of qualifying (Nourishing/Balanced) days — not the
// current streak, which resets. Scanned fresh from real entries rather
// than tracked separately, so it can never drift out of sync with the
// actual log.
function computeLongestMealStreak(sheet) {
  const days = new Set(sheet.items.filter((i) => MEAL_HEALTHY_QUALITY_KEYS.includes(i.quality)).map((i) => i.date));
  let longest = 0;
  days.forEach((d) => {
    if (days.has(addDays(d, -1))) return; // not the start of a run
    let len = 1;
    let cursor = d;
    while (days.has(addDays(cursor, 1))) {
      len++;
      cursor = addDays(cursor, 1);
    }
    if (len > longest) longest = len;
  });
  return longest;
}

// Permanent badges, same visual language as Activity Log's — once earned,
// never reset, unlike the streak above.
const MEAL_MILESTONES = [
  {
    key: "tenHealthy",
    label: "10 healthy meals",
    icon: "🥗",
    progress: (sheet) => {
      const n = sheet.items.filter((i) => MEAL_HEALTHY_QUALITY_KEYS.includes(i.quality)).length;
      return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `${n} of 10` };
    },
  },
  {
    key: "fiftyHealthy",
    label: "50 healthy meals",
    icon: "🔥",
    progress: (sheet) => {
      const n = sheet.items.filter((i) => MEAL_HEALTHY_QUALITY_KEYS.includes(i.quality)).length;
      return { earned: n >= 50, frac: Math.min(1, n / 50), caption: `${n} of 50` };
    },
  },
  {
    key: "hundredLogged",
    label: "100 meals logged",
    icon: "🏅",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 100, frac: Math.min(1, n / 100), caption: `${n} of 100` };
    },
  },
  {
    key: "weekStreak",
    label: "7-day streak",
    icon: "🏆",
    progress: (sheet) => {
      const longest = computeLongestMealStreak(sheet);
      return { earned: longest >= 7, frac: Math.min(1, longest / 7), caption: `Best: ${longest} of 7` };
    },
  },
];

function renderMealLogSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.items ||= [];
  sheet.milestonesEarned ||= {};
  const ui = mealLogUiState(id);
  const today = todayISO();
  panel.innerHTML = "";

  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  // ---- Streak + honest daily recap, at the top like the other practices
  // — recap is informational only, never gates the streak (see the block
  // comment above the completion helpers). ----
  const streak = computeMealLogStreak(sheet, today);
  const todaySummary = mealLogTodaySummary(sheet, today);
  const recapHtml = todaySummary.length
    ? `<div class="ml-today-recap">Today: ${todaySummary.map((s) => `${s.count} ${s.label.toLowerCase()}`).join(", ")}</div>`
    : `<div class="ml-today-recap muted">Nothing logged yet today.</div>`;
  panel.appendChild(buildStreakCard(streak, "day food streak", recapHtml));

  // ---- Log a meal — meal type and quality are both told apart by their
  // own compact styling rather than a heading label over each one; that's
  // what keeps this from reading as four separate stacked decisions. No
  // library, no picking from a list — just what it was, how it went, and
  // optionally what it actually was, in the note.
  const logCard = el(`<div class="card"></div>`);
  logCard.appendChild(el(`<div class="al-card-title">Log a meal</div>`));

  const mealRow = el(`<div class="ml-type-row"></div>`);
  MEAL_TYPES.forEach((t) => {
    const chip = el(`<button type="button" class="al-chip${t.key === ui.selectedMealType ? " active" : ""}"><span class="em">${t.icon}</span>${escapeHtml(t.label)}</button>`);
    chip.addEventListener("click", () => {
      ui.selectedMealType = t.key;
      renderMealLogSheet(id);
    });
    mealRow.appendChild(chip);
  });
  logCard.appendChild(mealRow);

  const qualityRow = el(`<div class="ml-quality-row"></div>`);
  MEAL_QUALITY.forEach((q) => {
    const chip = el(`<button type="button" class="al-chip${q.key === ui.selectedQuality ? " active" : ""}"><span class="em">${q.icon}</span>${escapeHtml(q.label)}</button>`);
    chip.addEventListener("click", () => {
      ui.selectedQuality = q.key;
      renderMealLogSheet(id);
    });
    qualityRow.appendChild(chip);
  });
  logCard.appendChild(qualityRow);

  const notesInput = el(`<input type="text" class="ml-f-notes ml-note-input" placeholder="What did you eat? (optional)" />`);
  logCard.appendChild(notesInput);
  const saveBtn = el(`<button type="button" class="al-save-btn">Save meal</button>`);
  saveBtn.addEventListener("click", () => {
    const notes = logCard.querySelector(".ml-f-notes").value.trim();
    sheet.items.push({ id: nextId(), date: today, mealType: ui.selectedMealType, quality: ui.selectedQuality, notes });
    scheduleSave();
    renderMealLogSheet(id);
    renderHome();
  });
  logCard.appendChild(saveBtn);
  logCard.appendChild(el(`<div class="al-note-line">Always logs as today &mdash; no backdating. Miss the day, miss the entry.</div>`));
  panel.appendChild(logCard);

  // ---- Milestones — permanent, unlike the streak above ----
  panel.appendChild(buildMilestonesCard(sheet, MEAL_MILESTONES, today));

  // ---- History ----
  const historyCard = el(`<div class="card"></div>`);
  historyCard.appendChild(el(`<div class="al-card-title">History</div>`));
  const recent = [...sheet.items].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 20);
  if (!recent.length) {
    historyCard.appendChild(el(`<div class="muted">Nothing logged yet.</div>`));
  } else {
    historyCard.appendChild(el(`<div class="al-note-line" style="margin-bottom:6px;">Tap an entry to fix a typo &mdash; this corrects what you logged, it doesn't add a new day.</div>`));
    recent.forEach((entry) => {
      const mt = mealTypeByKey(entry.mealType);
      const q = mealQualityByKey(entry.quality);
      const mainLabel = entry.notes || mt.label;
      const dateLabel = entry.date === today ? "Today" : entry.date === addDays(today, -1) ? "Yesterday" : activityDateShort(entry.date);
      const row = el(`
        <button type="button" class="al-hist-row">
          <span class="al-hist-icon">${mt.icon}</span>
          <span class="al-hist-main">
            <span class="al-hist-type">${escapeHtml(mainLabel)}</span>
            <span class="al-hist-meta">${q.icon} ${escapeHtml(q.label)}</span>
          </span>
          <span class="al-hist-date">${dateLabel}</span>
        </button>
      `);
      row.addEventListener("click", () => openMealLogEntryEditor(id, entry.id));
      historyCard.appendChild(row);
    });
  }
  panel.appendChild(historyCard);
}

// Corrects an already-logged meal (type, quality, notes) — no date field,
// same reasoning as everywhere else: fixes a mistake in something real,
// never lets a new day get added after the fact.
function openMealLogEntryEditor(sheetId, entryId) {
  const sheet = state.customSheets[sheetId];
  const entry = sheet?.items.find((i) => i.id === entryId);
  if (!sheet || !entry) return;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Edit meal</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Meal</label>
          <div class="mp-kind-row mel-type-row">
            ${MEAL_TYPES.map((t) => `<button type="button" class="mp-kind mel-type-opt${t.key === entry.mealType ? " sel" : ""}" data-key="${escapeHtml(t.key)}">${t.icon} ${escapeHtml(t.label)}</button>`).join("")}
          </div>
          <label class="muted">How'd it feel</label>
          <div class="mp-kind-row mel-quality-row">
            ${MEAL_QUALITY.map((q) => `<button type="button" class="mp-kind mel-quality-opt${q.key === entry.quality ? " sel" : ""}" data-key="${escapeHtml(q.key)}">${q.icon} ${escapeHtml(q.label)}</button>`).join("")}
          </div>
          <label class="muted">Notes</label>
          <textarea class="mel-f-notes" rows="2">${escapeHtml(entry.notes || "")}</textarea>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn-ghost danger mel-delete">Delete</button>
          <button type="button" class="btn-primary mel-save">Save</button>
        </div>
      </div>
    </div>
  `);
  let selectedMealType = entry.mealType;
  let selectedQuality = entry.quality;
  overlay.querySelectorAll(".mel-type-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMealType = btn.dataset.key;
      overlay.querySelectorAll(".mel-type-opt").forEach((b) => b.classList.toggle("sel", b === btn));
    });
  });
  overlay.querySelectorAll(".mel-quality-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedQuality = btn.dataset.key;
      overlay.querySelectorAll(".mel-quality-opt").forEach((b) => b.classList.toggle("sel", b === btn));
    });
  });
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.querySelector(".mel-delete").addEventListener("click", () => {
    sheet.items = sheet.items.filter((i) => i.id !== entryId);
    scheduleSave();
    close();
    renderMealLogSheet(sheetId);
    renderHome();
  });
  overlay.querySelector(".mel-save").addEventListener("click", () => {
    entry.mealType = selectedMealType;
    entry.quality = selectedQuality;
    entry.notes = overlay.querySelector(".mel-f-notes").value.trim();
    scheduleSave();
    close();
    renderMealLogSheet(sheetId);
    renderHome();
  });
  document.body.appendChild(overlay);
}

function renderSocialSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.people ||= [];
  sheet.milestonesEarned ||= {};
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const todayStr = todayISO();
  const cadenceByPerson = new Map(sheet.people.map((p) => [p.id, socialPersonCadence(sheet, p, todayStr)]));

  // ---- Streak, at the top like the other practices — this is the
  // overall "logged someone today" streak, separate from each person's
  // own cadence tracked below. ----
  const socialStreak = computeSocialStreak(sheet, todayStr);
  panel.appendChild(buildStreakCard(socialStreak, "day connection streak"));

  // Quick log — people already logged before, most recently contacted
  // first, so whoever's top of mind is also the fastest to tap again.
  panel.appendChild(el(`<div class="social-quicklog-label">Quick log</div>`));
  const chipRow = el(`<div class="social-quicklog-row"></div>`);
  const sortedPeople = [...sheet.people].sort((a, b) => {
    const da = cadenceByPerson.get(a.id).lastDate || "";
    const db = cadenceByPerson.get(b.id).lastDate || "";
    return da < db ? 1 : da > db ? -1 : 0;
  });
  sortedPeople.forEach((person) => {
    const cadence = cadenceByPerson.get(person.id);
    const chip = el(`
      <button type="button" class="social-chip">
        <span class="social-chip-avatar${cadence.status === "today" ? " today" : ""}${cadence.status === "overdue" ? " due" : ""}">
          ${escapeHtml((person.name.trim()[0] || "?").toUpperCase())}
          ${cadence.status === "today" ? `<span class="social-chip-dot">${checkSvg}</span>` : ""}
        </span>
        <span class="social-chip-name">${escapeHtml(person.name)}</span>
      </button>
    `);
    // Already logged today — tapping again opens the full form (to add
    // another kind, a note, or just review) rather than silently
    // stacking a second identical entry.
    chip.addEventListener("click", () => {
      if (cadence.status === "today") openSocialEntryModal(id, null, person.id);
      else socialQuickLog(id, person.id);
    });
    chipRow.appendChild(chip);
  });
  const addChip = el(`
    <button type="button" class="social-chip">
      <span class="social-chip-avatar social-chip-add">+</span>
      <span class="social-chip-name">New</span>
    </button>
  `);
  addChip.addEventListener("click", () => openSocialEntryModal(id, null, null));
  chipRow.appendChild(addChip);
  panel.appendChild(chipRow);
  panel.appendChild(el(`<div class="social-quicklog-hint">Tap a face to log today's default kind. Tap "New" for someone else or a different kind.</div>`));

  // Reconnect nudge — whoever's furthest past their own normal rhythm,
  // if anyone qualifies. Recomputed every render, so logging them (or
  // anyone else being more overdue) is what makes it change or clear —
  // no separate dismiss state to manage.
  let mostOverdue = null;
  sheet.people.forEach((person) => {
    const cadence = cadenceByPerson.get(person.id);
    if (cadence.status !== "overdue") return;
    const severity = cadence.daysSince - cadence.overdueThreshold;
    if (!mostOverdue || severity > mostOverdue.severity) mostOverdue = { person, cadence, severity };
  });
  if (mostOverdue) {
    const nudge = el(`
      <div class="social-nudge-card">
        <span class="social-nudge-icon">💛</span>
        <span class="social-nudge-text">It's been <strong>${mostOverdue.cadence.daysSince} days</strong> since you connected with ${escapeHtml(mostOverdue.person.name)}.</span>
        <button type="button" class="social-nudge-btn">Log it</button>
      </div>
    `);
    nudge.querySelector(".social-nudge-btn").addEventListener("click", () => socialQuickLog(id, mostOverdue.person.id));
    panel.appendChild(nudge);
  }

  // Your circle — grouped by person instead of a chronological feed, so
  // it reads as who's on track vs. who's slipping, not just a log.
  if (sheet.people.length) {
    panel.appendChild(el(`<div class="social-circle-title">Your circle</div>`));
    const circleSorted = [...sheet.people].sort((a, b) => {
      const ca = cadenceByPerson.get(a.id);
      const cb = cadenceByPerson.get(b.id);
      const rank = (c) => (c.status === "overdue" ? 0 : c.status === "new" ? 1 : c.status === "onTrack" ? 2 : 3);
      if (rank(ca) !== rank(cb)) return rank(ca) - rank(cb);
      return (cb.daysSince ?? 0) - (ca.daysSince ?? 0);
    });
    circleSorted.forEach((person) => {
      const cadence = cadenceByPerson.get(person.id);
      const entries = [...socialPersonEntries(sheet, person.id)].reverse();
      const badgeClass = cadence.status === "overdue" ? "warn" : cadence.status === "new" ? "" : "good";
      const badgeLabel = cadence.status === "overdue" ? "overdue" : cadence.status === "new" ? "new" : cadence.status === "today" ? "logged today" : "on track";
      const row = el(`
        <details class="wardrobe-item social-circle-row">
          <summary class="wardrobe-row">
            <div class="social-circle-avatar">${escapeHtml((person.name.trim()[0] || "?").toUpperCase())}</div>
            <div class="wi-body">
              <div class="wi-name">${escapeHtml(person.name)}${person.sobrietySupport ? `<span class="support-tag">Support</span>` : ""}</div>
              <div class="wi-sub">${escapeHtml(socialCadenceLabel(cadence))}</div>
            </div>
            ${badgeLabel ? `<span class="social-circle-badge${badgeClass ? ` ${badgeClass}` : ""}">${badgeLabel}</span>` : ""}
            ${person.phone ? `<a href="tel:${escapeHtml(person.phone)}" class="icon-btn social-call-btn" title="Call ${escapeHtml(person.name)}" onclick="event.stopPropagation();">${iconSvg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.2a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c1 .3 2 .5 3 .7a2 2 0 0 1 1.5 2z"></path>')}</a>` : ""}
            <span class="wardrobe-chevron">${chevronSvg}</span>
          </summary>
          <div class="wardrobe-item-detail">
            <div class="wi-detail-actions">
              <button type="button" class="btn-ghost social-log-again">Log again</button>
              <button type="button" class="btn-ghost wi-detail-edit-name">Edit</button>
            </div>
            ${
              entries.length
                ? entries
                    .map(
                      (entry) => `
                <div class="social-history-row" data-entry-id="${entry.id}">
                  <div>
                    <div class="social-history-kind">${escapeHtml(entry.kind || "")}</div>
                    <div class="social-history-date">${escapeHtml(entry.date)}${entry.notes ? ` &middot; ${escapeHtml(entry.notes)}` : ""}</div>
                  </div>
                  <div class="social-history-actions">
                    <button type="button" class="icon-btn social-history-edit" data-entry-id="${entry.id}">${editSvg}</button>
                  </div>
                </div>
              `
                    )
                    .join("")
                : `<div class="muted" style="padding:8px 0; font-size:12px;">No log entries yet.</div>`
            }
          </div>
        </details>
      `);
      row.querySelector(".social-log-again").addEventListener("click", (e) => {
        e.preventDefault();
        socialQuickLog(id, person.id);
      });
      row.querySelector(".wi-detail-edit-name").addEventListener("click", (e) => {
        e.preventDefault();
        openSocialPersonEditModal(id, person.id);
      });
      row.querySelectorAll(".social-history-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          openSocialEntryModal(id, btn.dataset.entryId, person.id);
        });
      });
      panel.appendChild(row);
    });
  } else {
    panel.appendChild(el(`<div class="muted" style="padding:16px 0;">Nothing logged yet — tap "New" above to log who you connected with today.</div>`));
  }

  // ---- Milestones — permanent, unlike the streak above ----
  panel.appendChild(buildMilestonesCard(sheet, SOCIAL_MILESTONES, todayStr));
}

// ------------------------------------------------------------------
// Prayer Log — the same quick-tap-to-log idea as Connections, but with
// no "who" to pick first, just "which": one of the five daily prayers,
// or one of three open-ended kinds (Gratitude, For someone, Protection).
// Tapping a chip logs immediately; whatever's in the note field at that
// moment rides along with it, then the field clears for next time.
// ------------------------------------------------------------------
const PRAYER_DAILY_TYPES = [
  { key: "dawn", label: "Dawn", icon: "🌄" },
  { key: "midday", label: "Midday", icon: "☀️" },
  { key: "afternoon", label: "Afternoon", icon: "🌇" },
  { key: "sunset", label: "Sunset", icon: "🌆" },
  { key: "night", label: "Night", icon: "🌌" },
];
const PRAYER_OTHER_TYPES = [
  { key: "gratitude", label: "Gratitude", icon: "🙌" },
  { key: "forSomeone", label: "For someone", icon: "🕊️" },
  { key: "protection", label: "Protection", icon: "🛡️" },
];
const PRAYER_ALL_TYPES = [...PRAYER_DAILY_TYPES, ...PRAYER_OTHER_TYPES];
function prayerTypeByKey(key) {
  return PRAYER_ALL_TYPES.find((t) => t.key === key) || PRAYER_ALL_TYPES[0];
}

// Same "any logged entry today" shape as Connections/Activity — always
// agrees with what Home shows for the Spiritual pillar.
function computePrayerStreak(sheet, today) {
  let streak = 0;
  let d = today;
  while (sheet.items.some((i) => i.date === d)) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}
function computeLongestPrayerStreak(sheet) {
  const dates = [...new Set(sheet.items.map((i) => i.date))].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  dates.forEach((d) => {
    current = prev && addDays(prev, 1) === d ? current + 1 : 1;
    longest = Math.max(longest, current);
    prev = d;
  });
  return longest;
}
const PRAYER_MILESTONES = [
  {
    key: "tenLogged",
    label: "10 prayers logged",
    icon: "🙏",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `${n} of 10` };
    },
  },
  {
    key: "fiftyLogged",
    label: "50 prayers logged",
    icon: "🕊️",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 50, frac: Math.min(1, n / 50), caption: `${n} of 50` };
    },
  },
  {
    key: "hundredLogged",
    label: "100 prayers logged",
    icon: "✨",
    progress: (sheet) => {
      const n = sheet.items.length;
      return { earned: n >= 100, frac: Math.min(1, n / 100), caption: `${n} of 100` };
    },
  },
  {
    key: "sevenDayStreak",
    label: "7-day streak",
    icon: "🔥",
    progress: (sheet) => {
      const longest = computeLongestPrayerStreak(sheet);
      return { earned: longest >= 7, frac: Math.min(1, longest / 7), caption: `Best: ${longest} of 7` };
    },
  },
];

function renderPrayerSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.items ||= [];
  sheet.milestonesEarned ||= {};
  const today = todayISO();
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const streak = computePrayerStreak(sheet, today);
  panel.appendChild(buildStreakCard(streak, "day prayer streak"));

  const logCard = el(`<div class="card"></div>`);
  logCard.appendChild(el(`<div class="al-card-title">Log a prayer</div>`));
  logCard.appendChild(el(`<div class="prayer-quicklog-label">Daily prayers</div>`));
  const dailyRow = el(`<div class="prayer-quicklog-row"></div>`);
  const noteInput = el(`<input type="text" class="prayer-note-input" placeholder="Add a note (optional)" />`);
  const logPrayer = (kind) => {
    const note = noteInput.value.trim();
    sheet.items.push({ id: nextId(), date: today, kind, note });
    scheduleSave();
    renderHome(); // runs pillar auto-detection first, so Spiritual reflects this immediately
    renderPrayerSheet(id);
  };
  PRAYER_DAILY_TYPES.forEach((t) => {
    const chip = el(`<button type="button" class="prayer-chip"><span class="prayer-chip-avatar">${t.icon}</span><span class="prayer-chip-lbl">${escapeHtml(t.label)}</span></button>`);
    chip.addEventListener("click", () => logPrayer(t.key));
    dailyRow.appendChild(chip);
  });
  logCard.appendChild(dailyRow);
  logCard.appendChild(el(`<div class="prayer-quicklog-label">Other</div>`));
  const otherRow = el(`<div class="prayer-quicklog-row"></div>`);
  PRAYER_OTHER_TYPES.forEach((t) => {
    const chip = el(`<button type="button" class="prayer-chip"><span class="prayer-chip-avatar">${t.icon}</span><span class="prayer-chip-lbl">${escapeHtml(t.label)}</span></button>`);
    chip.addEventListener("click", () => logPrayer(t.key));
    otherRow.appendChild(chip);
  });
  logCard.appendChild(otherRow);
  logCard.appendChild(noteInput);

  const todayEntries = sheet.items.filter((i) => i.date === today);
  const recap = todayEntries.length ? `Today: ${todayEntries.map((e) => prayerTypeByKey(e.kind).label).join(", ")}` : "Nothing logged yet today.";
  logCard.appendChild(el(`<div class="prayer-today-recap${todayEntries.length ? "" : " muted"}">${escapeHtml(recap)}</div>`));
  panel.appendChild(logCard);

  // ---- Milestones — permanent, unlike the streak above ----
  panel.appendChild(buildMilestonesCard(sheet, PRAYER_MILESTONES, today));

  // ---- History ----
  const historyCard = el(`<div class="card"></div>`);
  historyCard.appendChild(el(`<div class="al-card-title">History</div>`));
  const recent = [...sheet.items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id)).slice(0, 30);
  if (!recent.length) {
    historyCard.appendChild(el(`<div class="muted">Nothing logged yet.</div>`));
  } else {
    recent.forEach((entry) => {
      const t = prayerTypeByKey(entry.kind);
      const dateLabel = entry.date === today ? "Today" : entry.date === addDays(today, -1) ? "Yesterday" : activityDateShort(entry.date);
      const row = el(`
        <button type="button" class="al-hist-row">
          <span class="al-hist-icon">${t.icon}</span>
          <span class="al-hist-main">
            <span class="al-hist-type">${escapeHtml(t.label)}${entry.note ? ` &middot; ${escapeHtml(entry.note)}` : ""}</span>
          </span>
          <span class="al-hist-date">${dateLabel}</span>
        </button>
      `);
      row.addEventListener("click", () => openPrayerEntryEditor(id, entry.id));
      historyCard.appendChild(row);
    });
  }
  panel.appendChild(historyCard);
}

// Corrects an already-logged prayer (which one, the note) — no date
// field, same reasoning as everywhere else: fixes a mistake, doesn't
// backdate a new entry.
function openPrayerEntryEditor(sheetId, entryId) {
  const sheet = state.customSheets[sheetId];
  const entry = sheet?.items.find((i) => i.id === entryId);
  if (!sheet || !entry) return;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Edit prayer</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Which one</label>
          <div class="mp-kind-row prel-kind-row">
            ${PRAYER_ALL_TYPES.map((t) => `<button type="button" class="mp-kind prel-kind-opt${t.key === entry.kind ? " sel" : ""}" data-key="${escapeHtml(t.key)}">${t.icon} ${escapeHtml(t.label)}</button>`).join("")}
          </div>
          <label class="muted">Notes</label>
          <textarea class="prel-f-notes" rows="2">${escapeHtml(entry.note || "")}</textarea>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn-ghost danger prel-delete">Delete</button>
          <button type="button" class="btn-primary prel-save">Save</button>
        </div>
      </div>
    </div>
  `);
  let selectedKind = entry.kind;
  overlay.querySelectorAll(".prel-kind-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedKind = btn.dataset.key;
      overlay.querySelectorAll(".prel-kind-opt").forEach((b) => b.classList.toggle("sel", b === btn));
    });
  });
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.querySelector(".prel-delete").addEventListener("click", () => {
    sheet.items = sheet.items.filter((i) => i.id !== entryId);
    scheduleSave();
    close();
    renderPrayerSheet(sheetId);
    renderHome();
  });
  overlay.querySelector(".prel-save").addEventListener("click", () => {
    entry.kind = selectedKind;
    entry.note = overlay.querySelector(".prel-f-notes").value.trim();
    scheduleSave();
    close();
    renderPrayerSheet(sheetId);
    renderHome();
  });
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Breathe — a guided breathing session (box breathing or a slower
// inhale/exhale) with a quick mood check-in before and after. Sound is
// fully generated in-browser (no audio files) via the Web Audio API so
// there's nothing to license or host; three selectable voices are
// built from oscillators/noise rather than recordings. Multiple
// sessions per day are stored as separate timestamped items, same as
// Prayer Log, so a morning + evening session both count.
// ------------------------------------------------------------------
const BREATHE_MOODS_BEFORE = [
  { key: "tense", label: "Tense", emoji: "😖" },
  { key: "unsettled", label: "Unsettled", emoji: "😕" },
  { key: "okay", label: "Okay", emoji: "🙂" },
];
const BREATHE_MOODS_AFTER = [
  { key: "tense", label: "Tense", emoji: "😖" },
  { key: "unsettled", label: "Unsettled", emoji: "😕" },
  { key: "calmer", label: "Calmer", emoji: "😌" },
];
const BREATHE_METHODS = {
  box: {
    label: "Box breathing",
    sub: "In 4 · hold 4 · out 4 · hold 4",
    style: "box",
    cycleSeconds: 16,
    phases: [
      { text: "Breathe in", grow: true, seconds: 4 },
      { text: "Hold", grow: true, seconds: 4, hold: true },
      { text: "Breathe out", grow: false, seconds: 4 },
      { text: "Hold", grow: false, seconds: 4, hold: true },
    ],
  },
  slow: {
    label: "Slow breath",
    sub: "In 4 · out 6, no holds",
    style: "slow",
    cycleSeconds: 10,
    phases: [
      { text: "Breathe in", grow: true, seconds: 4 },
      { text: "Breathe out", grow: false, seconds: 6 },
    ],
  },
};
const BREATHE_DURATIONS = [2, 5, 10]; // minutes, box only
const BREATHE_SLOW_MINUTES = 3; // fixed session length for slow breath

function computeBreatheStreak(sheet, today) {
  let streak = 0;
  let d = today;
  while (sheet.items.some((i) => i.date === d)) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}
function computeLongestBreatheStreak(sheet) {
  const dates = [...new Set(sheet.items.map((i) => i.date))].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  dates.forEach((d) => {
    current = prev && addDays(prev, 1) === d ? current + 1 : 1;
    longest = Math.max(longest, current);
    prev = d;
  });
  return longest;
}
const BREATHE_MILESTONES = [
  { key: "firstSession", label: "First session", icon: "🧘", progress: (sheet) => { const n = sheet.items.length; return { earned: n >= 1, frac: Math.min(1, n), caption: n >= 1 ? "Done" : "0 of 1" }; } },
  { key: "tenSessions", label: "10 sessions", icon: "📿", progress: (sheet) => { const n = sheet.items.length; return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `${n} of 10` }; } },
  { key: "fiveCalmer", label: "Felt calmer after, 5 times", icon: "🌤️", progress: (sheet) => { const n = sheet.items.filter((i) => i.moodAfter === "calmer").length; return { earned: n >= 5, frac: Math.min(1, n / 5), caption: `${n} of 5` }; } },
  { key: "sevenDayStreak", label: "7-day streak", icon: "🔥", progress: (sheet) => { const longest = computeLongestBreatheStreak(sheet); return { earned: longest >= 7, frac: Math.min(1, longest / 7), caption: `Best: ${longest} of 7` }; } },
];

// ---- Generative audio engine -------------------------------------
// Guards against overlapping sound: only one audio "voice" (a preview
// tap or a live session) is ever allowed to be sounding at once,
// app-wide, no matter how the user navigates, switches tabs mid-session,
// or double-taps a sound chip. This is the fix for the "sounds combined"
// bug found in the mockup — safeCloseCtx() plus this single shared
// handle are both required, not just one or the other.
let __breatheActiveAudio = null; // { ctx, stop() }
function safeCloseCtx(ctx) {
  if (!ctx || ctx.state === "closed") return;
  try {
    ctx.close().catch(() => {});
  } catch (e) {}
}
function stopActiveBreatheAudio() {
  if (__breatheActiveAudio) {
    try {
      __breatheActiveAudio.stop();
    } catch (e) {}
    __breatheActiveAudio = null;
  }
}

const BREATH_VOICES = {
  pad: {
    name: "Warm Pad",
    build(ctx) {
      const out = ctx.createGain();
      out.gain.value = 1;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 340; // darker/rounder than before — less edge, more warmth
      filter.Q.value = 0.3;
      filter.connect(out);
      const root = ctx.createOscillator();
      root.type = "sine";
      root.frequency.value = 130.81; // C3
      const rootSub = ctx.createOscillator(); // an octave below — body/warmth, not brightness
      rootSub.type = "sine";
      rootSub.frequency.value = 65.41;
      const fifth = ctx.createOscillator();
      fifth.type = "sine";
      fifth.frequency.value = 196.03; // G3, a hair off-pure so it doesn't beat hard against the root
      const rootGain = ctx.createGain();
      rootGain.gain.value = 0.5;
      const subGain = ctx.createGain();
      subGain.gain.value = 0.28;
      const fifthGain = ctx.createGain();
      fifthGain.gain.value = 0.22;
      root.connect(rootGain).connect(filter);
      rootSub.connect(subGain).connect(filter);
      fifth.connect(fifthGain).connect(filter);
      root.start();
      rootSub.start();
      fifth.start();
      return {
        output: out,
        modulate(direction, now, tc) {
          // Slower glide (tc is already scaled up from the phase length below)
          // so a breath transition reads as a slow drift, not a pitch-bend siren.
          const base = direction === "in" ? 138.59 : 130.81; // a gentle half-step lift, not a whole step
          root.frequency.setTargetAtTime(base, now, tc);
          rootSub.frequency.setTargetAtTime(base / 2, now, tc);
          fifth.frequency.setTargetAtTime(base * 1.5, now, tc);
          filter.frequency.setTargetAtTime(direction === "in" ? 420 : 300, now, tc);
        },
        stop(t) {
          root.stop(t);
          rootSub.stop(t);
          fifth.stop(t);
        },
      };
    },
  },
  bowl: {
    name: "Singing Bowl",
    build(ctx) {
      const out = ctx.createGain();
      out.gain.value = 1;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      filter.connect(out);
      // A real bowl's overtones aren't a perfectly-tuned harmonic stack — they're
      // slightly inharmonic, which is what gives it a "shimmer" instead of a
      // synth-chord sound. Fundamental plus two soft, quiet upper partials,
      // each barely detuned from a clean ratio, replaces the old "two near-
      // identical fundamentals beating at 3Hz" (which read as an electronic
      // warble, not a resonant strike).
      const partials = [
        { ratio: 1, detune: 0, gain: 0.55 },
        { ratio: 2.42, detune: 1.015, gain: 0.16 },
        { ratio: 3.86, detune: 0.992, gain: 0.09 },
      ];
      const fundamental = 196.0; // G3 — lower and less piercing than the old C4
      const oscs = partials.map((p) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = fundamental * p.ratio * p.detune === 0 ? fundamental * p.ratio : fundamental * p.ratio * (p.detune || 1);
        const g = ctx.createGain();
        g.gain.value = p.gain;
        o.connect(g).connect(filter);
        o.start();
        return { o, g, ratio: p.ratio, detune: p.detune || 1 };
      });
      return {
        output: out,
        modulate(direction, now, tc) {
          const base = direction === "in" ? 220.0 : 196.0;
          oscs.forEach(({ o, ratio, detune }) => o.frequency.setTargetAtTime(base * ratio * detune, now, tc));
          filter.frequency.setTargetAtTime(direction === "in" ? 1700 : 1300, now, tc);
        },
        stop(t) {
          oscs.forEach(({ o }) => o.stop(t));
        },
      };
    },
  },
  waves: {
    name: "Ocean Waves",
    build(ctx) {
      const out = ctx.createGain();
      out.gain.value = 1;
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 350;
      filter.Q.value = 0.8;
      noise.connect(filter).connect(out);
      noise.start();
      return {
        output: out,
        modulate(direction, now, tc) {
          filter.frequency.setTargetAtTime(direction === "in" ? 900 : 350, now, tc);
        },
        stop(t) {
          noise.stop(t);
        },
      };
    },
  },
};

function createBreathTone(voiceKey) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Some browsers create a new AudioContext already suspended even from
  // inside a click handler — without this, everything below runs and no
  // error is ever thrown, but nothing audible ever comes out.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  let voice = BREATH_VOICES[voiceKey] || BREATH_VOICES.pad;
  let built = voice.build(ctx);
  built.output.connect(master);
  let muted = false;
  const controller = {
    setVoice(key) {
      // swap voices by tearing down and rebuilding the sound graph
      const old = built;
      voice = BREATH_VOICES[key] || BREATH_VOICES.pad;
      built = voice.build(ctx);
      built.output.connect(master);
      const now = ctx.currentTime;
      old.output.gain.setTargetAtTime(0, now, 0.3);
      setTimeout(() => {
        try {
          old.stop(ctx.currentTime);
        } catch (e) {}
      }, 500);
    },
    toggleMute() {
      muted = !muted;
      master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.2);
      return muted;
    },
    phase(direction, seconds) {
      const now = ctx.currentTime;
      if (!muted) master.gain.setTargetAtTime(0.8, now, 0.4);
      built.modulate(direction, now, seconds * 0.35);
    },
    hold() {
      // sustain whatever the sound was doing through a hold phase
    },
    stop() {
      const now = ctx.currentTime;
      master.gain.setTargetAtTime(0, now, 0.3);
      setTimeout(() => {
        try {
          built.stop(ctx.currentTime);
        } catch (e) {}
        safeCloseCtx(ctx);
      }, 600);
    },
  };
  __breatheActiveAudio = { ctx, stop: () => controller.stop() };
  return controller;
}

function previewSound(key) {
  stopActiveBreatheAudio();
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const voice = BREATH_VOICES[key] || BREATH_VOICES.pad;
  const built = voice.build(ctx);
  built.output.connect(master);
  const now = ctx.currentTime;
  master.gain.setTargetAtTime(0.8, now, 0.3);
  built.modulate("in", now, 1.2);
  const stop = () => {
    const t = ctx.currentTime;
    master.gain.setTargetAtTime(0, t, 0.25);
    setTimeout(() => {
      try {
        built.stop(ctx.currentTime);
      } catch (e) {}
      safeCloseCtx(ctx);
    }, 500);
  };
  __breatheActiveAudio = { ctx, stop };
  setTimeout(() => {
    if (__breatheActiveAudio && __breatheActiveAudio.ctx === ctx) {
      stop();
      __breatheActiveAudio = null;
    }
  }, 2200);
}

function moodByKey(list, key) {
  return list.find((m) => m.key === key) || list[0];
}

function renderBreatheSheet(id) {
  const panel = document.getElementById(`panel-${id}`);
  const sheet = state.customSheets[id];
  if (!panel || !sheet) return;
  sheet.items ||= [];
  sheet.milestonesEarned ||= {};
  sheet.soundVoice ||= "pad";
  const today = todayISO();
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  const streak = computeBreatheStreak(sheet, today);
  panel.appendChild(buildStreakCard(streak, "day breathe streak"));

  // ---- local session state (resets whenever this panel re-renders) ----
  let selectedMethod = "box";
  let selectedDuration = 5;
  let moodBefore = "unsettled";
  let moodAfter = "calmer";
  let selectedVoice = sheet.soundVoice;
  let tone = null;
  let running = false;
  let sessionMuted = false;
  let sessionToken = 0; // bumped on stop/cancel so an in-flight setTimeout chain from a cancelled session can't keep ticking

  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div class="al-card-title">New session</div>`));

  const beforeBlock = el(`<div class="breathe-before"></div>`);
  const afterBlock = el(`<div class="breathe-after" style="display:none;"></div>`);

  // Mood before
  beforeBlock.appendChild(el(`<div class="prayer-quicklog-label">How are you feeling?</div>`));
  const moodBeforeRow = el(`<div class="sleep-mood-row"></div>`);
  BREATHE_MOODS_BEFORE.forEach((m) => {
    const chip = el(`<button type="button" class="sleep-mood-choice${m.key === moodBefore ? " sel" : ""}"><span class="emoji">${m.emoji}</span><span class="lbl">${escapeHtml(m.label)}</span></button>`);
    chip.addEventListener("click", () => {
      moodBefore = m.key;
      moodBeforeRow.querySelectorAll(".sleep-mood-choice").forEach((b) => b.classList.remove("sel"));
      chip.classList.add("sel");
    });
    moodBeforeRow.appendChild(chip);
  });
  beforeBlock.appendChild(moodBeforeRow);

  // Method row
  beforeBlock.appendChild(el(`<div class="prayer-quicklog-label">Method</div>`));
  const methodRow = el(`<div class="method-row"></div>`);
  const durWrap = el(`<div class="dur-row"></div>`);
  function renderDurChips() {
    durWrap.innerHTML = "";
    BREATHE_DURATIONS.forEach((mins) => {
      const chip = el(`<button type="button" class="dur-chip${mins === selectedDuration ? " sel" : ""}">${mins} min</button>`);
      chip.addEventListener("click", () => {
        if (running) return;
        selectedDuration = mins;
        durWrap.querySelectorAll(".dur-chip").forEach((b) => b.classList.remove("sel"));
        chip.classList.add("sel");
      });
      durWrap.appendChild(chip);
    });
  }
  renderDurChips();
  Object.keys(BREATHE_METHODS).forEach((key) => {
    const m = BREATHE_METHODS[key];
    const chip = el(`<button type="button" class="method-chip${key === selectedMethod ? " sel" : ""}"><span class="m-name">${escapeHtml(m.label)}</span><span class="m-sub">${escapeHtml(m.sub)}</span></button>`);
    chip.addEventListener("click", () => {
      if (running) return; // method/duration are fixed once a session is underway — restart to change them
      selectedMethod = key;
      methodRow.querySelectorAll(".method-chip").forEach((b) => b.classList.remove("sel"));
      chip.classList.add("sel");
      durWrap.style.display = key === "box" ? "flex" : "none";
      circleEl.classList.toggle("slow-style", key === "slow");
    });
    methodRow.appendChild(chip);
  });
  methodRow.appendChild(el(`<button type="button" class="method-chip ghost" disabled><span class="m-name">+ More methods</span><span class="m-sub">Coming soon</span></button>`));
  beforeBlock.appendChild(methodRow);
  beforeBlock.appendChild(durWrap);

  // Sound row
  beforeBlock.appendChild(el(`<div class="prayer-quicklog-label">Sound</div>`));
  const soundRow = el(`<div class="sound-row"></div>`);
  Object.keys(BREATH_VOICES).forEach((key) => {
    const v = BREATH_VOICES[key];
    const chip = el(`<button type="button" class="sound-chip${key === selectedVoice ? " sel" : ""}"><span class="s-name">${escapeHtml(v.name)}</span><span class="s-preview">▶</span></button>`);
    chip.addEventListener("click", () => {
      selectedVoice = key;
      sheet.soundVoice = key;
      scheduleSave();
      soundRow.querySelectorAll(".sound-chip").forEach((b) => b.classList.remove("sel"));
      chip.classList.add("sel");
      // Sound is the one thing you CAN change mid-session — swap the live
      // voice in place rather than tearing down and previewing, which
      // would otherwise cut the running session's audio off entirely.
      if (running && tone) {
        tone.setVoice(key);
      } else {
        previewSound(key);
      }
    });
    soundRow.appendChild(chip);
  });
  beforeBlock.appendChild(soundRow);

  // Breathing stage
  const stage = el(`
    <div class="breathe-stage">
      <div class="breathe-ring-wrap">
        <div class="breathe-track"></div>
        <div class="breathe-circle"><span class="breathe-phase-label">Ready</span></div>
      </div>
      <div class="breathe-btn-row">
        <button type="button" class="breathe-start-btn">Begin</button>
        <button type="button" class="breathe-sound-btn" title="Mute sound">🔊</button>
      </div>
    </div>
  `);
  beforeBlock.appendChild(stage);
  const circleEl = stage.querySelector(".breathe-circle");
  const labelEl = stage.querySelector(".breathe-phase-label");
  const startBtn = stage.querySelector(".breathe-start-btn");
  const soundBtn = stage.querySelector(".breathe-sound-btn");

  soundBtn.addEventListener("click", () => {
    if (!tone) return;
    sessionMuted = tone.toggleMute();
    soundBtn.textContent = sessionMuted ? "🔇" : "🔊";
    soundBtn.classList.toggle("muted", sessionMuted);
  });

  function setChipsDisabled(disabled) {
    methodRow.querySelectorAll(".method-chip:not(.ghost)").forEach((b) => (b.disabled = disabled));
    durWrap.querySelectorAll(".dur-chip").forEach((b) => (b.disabled = disabled));
    methodRow.classList.toggle("disabled", disabled);
    durWrap.classList.toggle("disabled", disabled);
  }

  function step(method, phaseIndex, cyclesDone, totalCycles, myToken) {
    if (myToken !== sessionToken) return; // a cancelled/replaced session's old timers land here and stop dead
    const phase = method.phases[phaseIndex];
    labelEl.textContent = phase.text;
    circleEl.style.transitionDuration = `${phase.seconds}s`;
    circleEl.classList.toggle("grown", !!phase.grow);
    if (phase.hold) {
      if (tone) tone.hold();
    } else if (tone) {
      tone.phase(phase.grow ? "in" : "out", phase.seconds);
    }
    setTimeout(() => {
      if (myToken !== sessionToken) return;
      const nextIndex = phaseIndex + 1;
      if (nextIndex >= method.phases.length) {
        const nextCycles = cyclesDone + 1;
        if (nextCycles >= totalCycles) {
          finishSession();
        } else {
          step(method, 0, nextCycles, totalCycles, myToken);
        }
      } else {
        step(method, nextIndex, cyclesDone, totalCycles, myToken);
      }
    }, phase.seconds * 1000);
  }

  function finishSession() {
    running = false;
    if (tone) {
      tone.stop();
      tone = null;
    }
    labelEl.textContent = "Done";
    circleEl.classList.remove("grown");
    beforeBlock.style.display = "none";
    afterBlock.style.display = "block";
  }

  function cancelSession() {
    sessionToken++; // invalidates any in-flight step() timers from this session
    running = false;
    if (tone) {
      tone.stop();
      tone = null;
    }
    startBtn.textContent = "Begin";
    startBtn.classList.remove("stop");
    setChipsDisabled(false);
    labelEl.textContent = "Ready";
    circleEl.classList.remove("grown");
  }

  startBtn.addEventListener("click", () => {
    if (running) {
      cancelSession();
      return;
    }
    stopActiveBreatheAudio();
    running = true;
    startBtn.textContent = "Stop";
    startBtn.classList.add("stop");
    setChipsDisabled(true);
    sessionToken++;
    const myToken = sessionToken;
    tone = createBreathTone(selectedVoice);
    if (sessionMuted) tone.toggleMute();
    const method = BREATHE_METHODS[selectedMethod];
    const minutes = selectedMethod === "box" ? selectedDuration : BREATHE_SLOW_MINUTES;
    const totalCycles = Math.max(1, Math.round((minutes * 60) / method.cycleSeconds));
    step(method, 0, 0, totalCycles, myToken);
  });

  card.appendChild(beforeBlock);

  // After block
  afterBlock.appendChild(el(`
    <div class="breathe-complete">
      <div class="check">✓</div>
      <div class="msg">Session complete</div>
    </div>
  `));
  afterBlock.appendChild(el(`<div class="prayer-quicklog-label">How do you feel now?</div>`));
  const moodAfterRow = el(`<div class="sleep-mood-row"></div>`);
  BREATHE_MOODS_AFTER.forEach((m) => {
    const chip = el(`<button type="button" class="sleep-mood-choice${m.key === moodAfter ? " sel" : ""}"><span class="emoji">${m.emoji}</span><span class="lbl">${escapeHtml(m.label)}</span></button>`);
    chip.addEventListener("click", () => {
      moodAfter = m.key;
      moodAfterRow.querySelectorAll(".sleep-mood-choice").forEach((b) => b.classList.remove("sel"));
      chip.classList.add("sel");
    });
    moodAfterRow.appendChild(chip);
  });
  afterBlock.appendChild(moodAfterRow);
  const noteInput = el(`<input type="text" class="breathe-note-input" placeholder="Add a note (optional)" />`);
  afterBlock.appendChild(noteInput);
  const saveBtn = el(`<button type="button" class="save-session-btn">Save &amp; finish</button>`);
  saveBtn.addEventListener("click", () => {
    sheet.items.push({
      id: nextId(),
      date: today,
      method: selectedMethod,
      moodBefore,
      moodAfter,
      note: noteInput.value.trim(),
    });
    scheduleSave();
    renderHome(); // pillar auto-detection first, so Spiritual reflects this immediately
    renderBreatheSheet(id);
  });
  afterBlock.appendChild(saveBtn);
  card.appendChild(afterBlock);

  panel.appendChild(card);
  panel.appendChild(buildMilestonesCard(sheet, BREATHE_MILESTONES, today));

  const historyCard = el(`<div class="card"></div>`);
  historyCard.appendChild(el(`<div class="al-card-title">History</div>`));
  const recent = [...sheet.items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id)).slice(0, 30);
  if (!recent.length) {
    historyCard.appendChild(el(`<div class="muted">Nothing logged yet.</div>`));
  } else {
    recent.forEach((entry) => {
      const method = BREATHE_METHODS[entry.method] || BREATHE_METHODS.box;
      const afterMood = moodByKey(BREATHE_MOODS_AFTER, entry.moodAfter);
      const dateLabel = entry.date === today ? "Today" : entry.date === addDays(today, -1) ? "Yesterday" : activityDateShort(entry.date);
      const row = el(`
        <button type="button" class="al-hist-row">
          <span class="al-hist-icon">${afterMood.emoji}</span>
          <span class="al-hist-main">
            <span class="al-hist-type">${escapeHtml(method.label)}${entry.note ? ` &middot; ${escapeHtml(entry.note)}` : ""}</span>
          </span>
          <span class="al-hist-date">${dateLabel}</span>
        </button>
      `);
      row.addEventListener("click", () => openBreatheEntryEditor(id, entry.id));
      historyCard.appendChild(row);
    });
  }
  panel.appendChild(historyCard);

  // Initial dur-row visibility matches default method
  durWrap.style.display = selectedMethod === "box" ? "flex" : "none";
}

function openBreatheEntryEditor(sheetId, entryId) {
  const sheet = state.customSheets[sheetId];
  const entry = sheet?.items.find((i) => i.id === entryId);
  if (!sheet || !entry) return;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Edit session</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">How did you feel after</label>
          <div class="mp-kind-row prel-kind-row">
            ${BREATHE_MOODS_AFTER.map((m) => `<button type="button" class="mp-kind breathe-mood-opt${m.key === entry.moodAfter ? " sel" : ""}" data-key="${escapeHtml(m.key)}">${m.emoji} ${escapeHtml(m.label)}</button>`).join("")}
          </div>
          <label class="muted">Notes</label>
          <textarea class="breathe-f-notes" rows="2">${escapeHtml(entry.note || "")}</textarea>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn-ghost danger breathe-delete">Delete</button>
          <button type="button" class="btn-primary breathe-save">Save</button>
        </div>
      </div>
    </div>
  `);
  let selectedMood = entry.moodAfter;
  overlay.querySelectorAll(".breathe-mood-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMood = btn.dataset.key;
      overlay.querySelectorAll(".breathe-mood-opt").forEach((b) => b.classList.toggle("sel", b === btn));
    });
  });
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.querySelector(".breathe-delete").addEventListener("click", () => {
    sheet.items = sheet.items.filter((i) => i.id !== entryId);
    scheduleSave();
    close();
    renderBreatheSheet(sheetId);
    renderHome();
  });
  overlay.querySelector(".breathe-save").addEventListener("click", () => {
    entry.moodAfter = selectedMood;
    entry.note = overlay.querySelector(".breathe-f-notes").value.trim();
    scheduleSave();
    close();
    renderBreatheSheet(sheetId);
    renderHome();
  });
  document.body.appendChild(overlay);
}

// Edit a connection — name, a phone number (new: this is what powers
// tap-to-call, both here and from anything that reaches into Connections
// for a contact, like Sobriety's support-contact feature), and, only
// when Sobriety is actually turned on, a plain checkbox for flagging
// this person as a sponsor/support contact. The checkbox is gated on
// Sobriety being *added* (state.extraTrackers.sobriety), not on having
// checked in yet — so it's there the moment someone picks up the
// tracker, not after they've logged something under it.
function openSocialPersonEditModal(sheetId, personId) {
  const sheet = state.customSheets[sheetId];
  const person = sheet.people.find((p) => p.id === personId);
  if (!person) return;
  const sobrietyOn = !!state.extraTrackers?.sobriety;

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Edit connection</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Name</label>
          <input type="text" class="sp-f-name" value="${escapeHtml(person.name)}" />

          <label class="muted">Phone</label>
          <input type="tel" class="sp-f-phone" value="${escapeHtml(person.phone || "")}" placeholder="Optional — adds a tap-to-call button" />

          ${
            sobrietyOn
              ? `<label style="display:flex;align-items:center;gap:10px;margin-top:14px;font-size:13px;color:var(--text);"><input type="checkbox" class="sp-f-support" style="width:auto;flex-shrink:0;" ${person.sobrietySupport ? "checked" : ""} /> This is my sponsor / support contact</label>
                 <div class="al-note-line" style="margin-top:4px;">Shows up with one tap to call, right inside a Sobriety check-in. Flag more than one if you want.</div>`
              : ""
          }
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn-ghost danger sp-delete">Remove person</button>
          <button type="button" class="btn-primary sp-save">Save</button>
        </div>
      </div>
    </div>
  `);

  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector(".sp-save").addEventListener("click", () => {
    const name = overlay.querySelector(".sp-f-name").value.trim();
    if (!name) return;
    person.name = name;
    person.phone = overlay.querySelector(".sp-f-phone").value.trim();
    if (sobrietyOn) person.sobrietySupport = overlay.querySelector(".sp-f-support").checked;
    scheduleSave();
    overlay.remove();
    renderSocialSheet(sheetId);
    renderHome();
  });

  overlay.querySelector(".sp-delete").addEventListener("click", () => {
    const entries = socialPersonEntries(sheet, person.id);
    confirmModal("Remove person?", `This removes ${person.name} and all ${entries.length} logged entr${entries.length === 1 ? "y" : "ies"} for them.`, "Remove", () => {
      sheet.people = sheet.people.filter((p) => p.id !== person.id);
      sheet.items = sheet.items.filter((i) => i.personId !== person.id);
      scheduleSave();
      overlay.remove();
      renderSocialSheet(sheetId);
      renderHome();
    });
  });

  document.body.appendChild(overlay);
}

// Logging (or editing a past log for) one person — kind is a tap-once
// chip row rather than a dropdown, same as the mockup, since there are
// only a handful of options and tapping is faster than opening a select
// on mobile.
function openSocialEntryModal(sheetId, itemId, presetPersonId) {
  const sheet = state.customSheets[sheetId];
  sheet.people ||= [];
  const isNew = !itemId;
  const item = isNew ? { personId: presetPersonId || null, kind: SOCIAL_KIND_OPTIONS[0], date: todayISO(), notes: "" } : sheet.items.find((i) => i.id === itemId);
  if (!item) return;
  if (isNew && item.personId) {
    const entries = socialPersonEntries(sheet, item.personId);
    if (entries.length) item.kind = entries[entries.length - 1].kind;
  }

  const existingNames = sheet.people.map((p) => p.name).sort();
  const startingName = item.personId ? sheet.people.find((p) => p.id === item.personId)?.name || "" : "";

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>${isNew ? "Log a connection" : "Edit entry"}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">Who</label>
          <input type="text" class="sc-f-who" value="${escapeHtml(startingName)}" placeholder="e.g. Mom, Jess" list="sc-people-list" />
          <datalist id="sc-people-list">${existingNames.map((n) => `<option value="${escapeHtml(n)}"></option>`).join("")}</datalist>

          <label class="muted">What</label>
          <div class="mp-kind-row">
            ${SOCIAL_KIND_OPTIONS.map((k) => `<button type="button" class="mp-kind sc-kind-opt${item.kind === k ? " sel" : ""}" data-kind="${escapeHtml(k)}">${escapeHtml(k)}</button>`).join("")}
          </div>

          ${
            isNew
              ? ""
              : `<label class="muted">When</label><div class="sc-f-date-fixed">${escapeHtml(item.date)}</div>`
          }

          <label class="muted">Notes</label>
          <textarea class="sc-f-notes" rows="3" placeholder="Optional">${escapeHtml(item.notes)}</textarea>
        </div>
        <div class="modal-actions" style="justify-content:space-between;">
          <div>${isNew ? "" : `<button type="button" class="btn-ghost danger sc-delete">Delete</button>`}</div>
          <button type="button" class="btn-primary sc-save">${isNew ? "Log it" : "Save"}</button>
        </div>
        ${isNew ? `<div class="al-note-line" style="text-align:center;margin-top:2px;">Always logs as today &mdash; no backdating. Miss the day, miss the entry.</div>` : `<div class="al-note-line" style="text-align:center;margin-top:2px;">The date can't be changed &mdash; delete and re-log it today if it's wrong.</div>`}
      </div>
    </div>
  `);

  let selectedKind = item.kind;
  overlay.querySelectorAll(".sc-kind-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedKind = btn.dataset.kind;
      overlay.querySelectorAll(".sc-kind-opt").forEach((b) => b.classList.toggle("sel", b === btn));
    });
  });

  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector(".sc-save").addEventListener("click", () => {
    const name = overlay.querySelector(".sc-f-who").value.trim();
    const date = isNew ? todayISO() : item.date;
    const notes = overlay.querySelector(".sc-f-notes").value.trim();
    if (!name) return;

    let person = sheet.people.find((p) => p.name.trim().toLowerCase() === name.toLowerCase());
    if (!person) {
      person = { id: nextId(), name };
      sheet.people.push(person);
    }

    if (isNew) {
      sheet.items.push({ id: nextId(), personId: person.id, kind: selectedKind, date, notes });
    } else {
      Object.assign(item, { personId: person.id, kind: selectedKind, date, notes });
    }
    scheduleSave();
    overlay.remove();
    renderSocialSheet(sheetId);
    renderHome();
  });

  const deleteBtn = overlay.querySelector(".sc-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      confirmModal("Delete entry?", `Remove this connection log?`, "Delete", () => {
        sheet.items = sheet.items.filter((i) => i.id !== item.id);
        scheduleSave();
        overlay.remove();
        renderSocialSheet(sheetId);
        renderHome();
      });
    });
  }

  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Workout Log — weekly, grouped by day, each exercise carrying its own
// rep range. "+ New week" spins off a fresh week seeded from the
// currently-open one: last week's Actual becomes this week's Previous,
// and (when the exercise allows it) a new Target gets suggested from
// how she did against her rep range — see suggestedWorkoutTarget().
// ------------------------------------------------------------------
const WORKOUT_SEED_DAYS = [
  {
    label: "Day 1",
    exercises: [
      {
        code: "A1",
        name: "Squat",
        muscles: "Quads / Glutes / Core",
        repMin: 8,
        repMax: 10,
        perSide: false,
        direction: "up",
        autoSuggest: true,
        notes: "Add your own notes here, like form cues or how it felt.",
        sets: [
          { setType: "Warm Up", prev: "", target: "", actual: "" },
          { setType: "Working Set", prev: "", target: "", actual: "" },
          { setType: "Working Set", prev: "", target: "", actual: "" },
        ],
      },
      {
        code: "A2",
        name: "Push-Up",
        muscles: "Chest / Shoulders / Triceps",
        repMin: 8,
        repMax: 12,
        perSide: false,
        direction: "up",
        autoSuggest: false,
        notes: "Bodyweight to start — add weight later if you want.",
        sets: [
          { setType: "Set 1", prev: "", target: "", actual: "" },
          { setType: "Set 2", prev: "", target: "", actual: "" },
        ],
      },
      {
        code: "B",
        name: "Plank",
        muscles: "Core",
        repMin: 30,
        repMax: 45,
        perSide: false,
        direction: "up",
        autoSuggest: false,
        notes: "Seconds held, not reps.",
        sets: [
          { setType: "Set 1", prev: "", target: "", actual: "" },
        ],
      },
    ],
  },
];

function weekLabelFromStart(startDate) {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(start.getTime() + 4 * 86400000);
  const fmtMonth = (d) => d.toLocaleDateString("en-CA", { month: "short" });
  return start.getMonth() === end.getMonth()
    ? `${fmtMonth(start)} ${start.getDate()}–${end.getDate()}`
    : `${fmtMonth(start)} ${start.getDate()}–${fmtMonth(end)} ${end.getDate()}`;
}

function seedWorkoutSheetData() {
  const startDate = "2026-08-17";
  const week = {
    id: nextId(),
    startDate,
    label: weekLabelFromStart(startDate),
    days: WORKOUT_SEED_DAYS.map((day) => ({
      id: nextId(),
      label: day.label,
      exercises: day.exercises.map((ex) => ({
        id: nextId(),
        code: ex.code,
        name: ex.name,
        muscles: ex.muscles,
        repMin: ex.repMin,
        repMax: ex.repMax,
        perSide: ex.perSide,
        direction: ex.direction,
        autoSuggest: ex.autoSuggest,
        link: ex.link || "",
        notes: ex.notes,
        sets: ex.sets.map((s) => ({ id: nextId(), ...s })),
      })),
    })),
  };
  return {
    workoutSchemaV: 1,
    weeks: [week],
    activeWeekId: week.id,
    progressionSettings: { autoSuggest: true, hitBumpPct: 2, exceedBumpPct: 8, roundTo: 5, missBehavior: "repeat" },
    openDays: {},
    openExercises: {},
  };
}

// Reads a logged "Actual" value back into a number, if it has one. Formats
// seen in practice: "125 x 12" (weight x reps), "15 x 12/side" (weight x
// reps, per side), "10/side" or "12" (bodyweight, reps only — no weight to
// progress), and "✖️" (skipped — nothing to read at all).
function parseWorkoutActual(str) {
  const s = String(str || "").trim();
  if (!s || s === "✖️") return null;
  const clean = s.replace(/\/side$/i, "").trim();
  const withWeight = clean.match(/^([\d.]+)\s*x\s*([\d.]+)$/i);
  if (withWeight) return { weight: parseFloat(withWeight[1]), reps: parseFloat(withWeight[2]), hasWeight: true };
  const repsOnly = clean.match(/^([\d.]+)$/);
  if (repsOnly) return { weight: null, reps: parseFloat(repsOnly[1]), hasWeight: false };
  return null;
}

// The heart of "+ New week": given an exercise and the set it's replacing,
// decide what to suggest as this set's new Target. Nothing here ever
// touches Actual (that always starts blank) or the exercise's own rep
// range — it only ever proposes a next number, and always leaves the
// field editable afterward.
function suggestedWorkoutTarget(exercise, lastSet, settings) {
  const parsed = parseWorkoutActual(lastSet.actual);
  if (!parsed || !parsed.hasWeight || !exercise.autoSuggest || !settings.autoSuggest) {
    // Nothing logged, a bodyweight/rep-only move, or auto-suggest turned
    // off for this exercise (or globally) — just repeat last week's target.
    return lastSet.target;
  }
  let pct;
  if (parsed.reps > exercise.repMax) pct = settings.exceedBumpPct;
  else if (parsed.reps === exercise.repMax) pct = settings.hitBumpPct;
  else if (parsed.reps < exercise.repMin) pct = settings.missBehavior === "drop5" ? -5 : null;
  else pct = null; // within range but not at the top yet — still building up to it
  if (pct === null) return lastSet.target;
  const dir = exercise.direction === "down" ? -1 : 1;
  const round = settings.roundTo || 5;
  let newWeight = parsed.weight * (1 + (dir * pct) / 100);
  newWeight = Math.max(0, Math.round(newWeight / round) * round);
  const suffix = exercise.perSide ? "/side" : "";
  const weightLabel = exercise.direction === "down" ? `${newWeight} assist` : `${newWeight} lb`;
  return `${weightLabel}${suffix}`;
}

function createNextWorkoutWeek(sheet, startDate) {
  const settings = sheet.progressionSettings;
  const fromWeek = sheet.weeks.find((w) => w.id === sheet.activeWeekId) || sheet.weeks[sheet.weeks.length - 1];
  return {
    id: nextId(),
    startDate,
    label: weekLabelFromStart(startDate),
    days: fromWeek.days.map((day) => ({
      id: nextId(),
      label: day.label,
      exercises: day.exercises.map((ex) => ({
        id: nextId(),
        code: ex.code,
        name: ex.name,
        muscles: ex.muscles,
        repMin: ex.repMin,
        repMax: ex.repMax,
        perSide: ex.perSide,
        direction: ex.direction,
        autoSuggest: ex.autoSuggest,
        link: ex.link || "",
        notes: ex.notes,
        sets: ex.sets.map((s) => ({
          id: nextId(),
          setType: s.setType,
          prev: s.actual && s.actual !== "✖️" ? s.actual : s.prev,
          target: suggestedWorkoutTarget(ex, s, settings),
          actual: "",
        })),
      })),
    })),
  };
}

// Home tab's "Workout Progress" card — same shape as Wellness Progress
// (a ring plus a 14-cell tone strip), fed from the sets she's actually
// logged instead of a separate tracked field. A day "worked out" once
// most of its exercises have something in Actual; the 80% bar matches
// the one Wellness Progress already uses, so the two cards read the same.
function exerciseTouched(ex) {
  return ex.sets.some((s) => (s.actual || "").trim() !== "");
}
function dayWorkoutTone(day) {
  if (!day.exercises.length) return "none";
  const touched = day.exercises.filter(exerciseTouched).length;
  if (touched === 0) return "none";
  return touched / day.exercises.length >= 0.8 ? "good" : "mixed";
}
function flattenWorkoutDays(sheet) {
  const weeks = [...sheet.weeks].sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
  const flat = [];
  weeks.forEach((week) => {
    week.days.forEach((day) => flat.push({ weekId: week.id, dayId: day.id, tone: dayWorkoutTone(day) }));
  });
  return flat;
}
function computeWorkoutProgressStats(sheet) {
  if (!sheet.weeks.length) return null;
  const activeWeek = sheet.weeks.find((w) => w.id === sheet.activeWeekId) || sheet.weeks[sheet.weeks.length - 1];
  const weekTotal = activeWeek.days.length;
  const weekDone = activeWeek.days.filter((d) => dayWorkoutTone(d) === "good").length;
  const weekPct = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0;
  const tones = flattenWorkoutDays(sheet).slice(-14).map((d) => d.tone);
  while (tones.length < 14) tones.unshift("none");
  return { weekDone, weekTotal, weekPct, weekLabel: activeWeek.label, tones };
}

// A "day" in Workout Log is a week-relative slot (Day A, Day B), not a
// calendar date — so streak tracking rides on day.lastLoggedDate, a real
// date stamped the moment any set's Actual is filled in (see
// renderWorkoutExercise). This is what actually gives Workout Log a
// streak at all, matching the other ongoing practices.
function workoutLoggedDatesSet(sheet) {
  const dates = new Set();
  sheet.weeks.forEach((week) => week.days.forEach((day) => { if (day.lastLoggedDate) dates.add(day.lastLoggedDate); }));
  return dates;
}
function computeWorkoutStreak(sheet, today) {
  const dates = workoutLoggedDatesSet(sheet);
  let streak = 0;
  let d = today;
  while (dates.has(d)) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}
function computeLongestWorkoutStreak(sheet) {
  const sorted = [...workoutLoggedDatesSet(sheet)].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  sorted.forEach((d) => {
    current = prev && addDays(prev, 1) === d ? current + 1 : 1;
    longest = Math.max(longest, current);
    prev = d;
  });
  return longest;
}
function countWorkoutSetsLogged(sheet) {
  let n = 0;
  sheet.weeks.forEach((week) => week.days.forEach((day) => day.exercises.forEach((ex) => { n += ex.sets.filter((s) => (s.actual || "").trim() !== "").length; })));
  return n;
}
const WORKOUT_MILESTONES = [
  {
    key: "tenDays",
    label: "10 workout days",
    icon: "🏋️",
    progress: (sheet) => {
      const n = workoutLoggedDatesSet(sheet).size;
      return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `${n} of 10` };
    },
  },
  {
    key: "fiftyDays",
    label: "50 workout days",
    icon: "🔥",
    progress: (sheet) => {
      const n = workoutLoggedDatesSet(sheet).size;
      return { earned: n >= 50, frac: Math.min(1, n / 50), caption: `${n} of 50` };
    },
  },
  {
    key: "hundredSets",
    label: "100 sets logged",
    icon: "🏅",
    progress: (sheet) => {
      const n = countWorkoutSetsLogged(sheet);
      return { earned: n >= 100, frac: Math.min(1, n / 100), caption: `${n} of 100` };
    },
  },
  {
    key: "weekStreak",
    label: "7-day streak",
    icon: "🏆",
    progress: (sheet) => {
      const longest = computeLongestWorkoutStreak(sheet);
      return { earned: longest >= 7, frac: Math.min(1, longest / 7), caption: `Best: ${longest} of 7` };
    },
  },
];

function openNewWeekModal(sheetId) {
  const sheet = state.customSheets[sheetId];
  const fromWeek = sheet.weeks.find((w) => w.id === sheet.activeWeekId) || sheet.weeks[sheet.weeks.length - 1];
  const defaultStart = fromWeek?.startDate ? addDays(fromWeek.startDate, 7) : todayISO();
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Start a new week</h3>
        <p>Every day and exercise carries over from "${escapeHtml(fromWeek?.label || "")}" — last week's Actual becomes this week's Previous, and Target gets a fresh suggestion wherever auto-suggest is on.</p>
        <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Week starting</label>
        <input type="date" class="new-week-start" value="${defaultStart}" style="width:100%;box-sizing:border-box;" />
        <div class="modal-actions">
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-primary modal-confirm">Create week</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  overlay.querySelector(".modal-confirm").addEventListener("click", () => {
    const startDate = overlay.querySelector(".new-week-start").value || todayISO();
    const newWeek = createNextWorkoutWeek(sheet, startDate);
    sheet.weeks.push(newWeek);
    sheet.activeWeekId = newWeek.id;
    scheduleSave();
    overlay.remove();
    renderWorkoutSheet(sheetId);
  });
  document.body.appendChild(overlay);
}

function renderProgressionSettingsCard(sheet, sheetId) {
  const s = sheet.progressionSettings;
  const card = el(`
    <div class="card">
      <div class="progression-row">
        <div class="progression-summary">
          Auto-suggest next week's target: <strong>${s.autoSuggest ? "On" : "Off"}</strong><br>
          Hit the top of your range → <strong>+${s.hitBumpPct}%</strong> &middot; Exceed it → <strong>+${s.exceedBumpPct}%</strong> &middot; round to nearest <strong>${s.roundTo} lb</strong>
        </div>
        <button type="button" class="btn-ghost small prog-edit-toggle">Edit</button>
      </div>
      <div class="progression-form">
        <div class="prog-field-row">
          <label>Auto-suggest next week's target</label>
          <div class="toggle-switch ${s.autoSuggest ? "on" : ""}" data-field="autoSuggest"></div>
        </div>
        <div class="prog-field-row">
          <label>If I hit the top of my rep range, bump by</label>
          <input type="number" min="0" max="30" data-field="hitBumpPct" value="${s.hitBumpPct}" /> <span class="muted">%</span>
        </div>
        <div class="prog-field-row">
          <label>If I exceed the top of my rep range, bump by</label>
          <input type="number" min="0" max="30" data-field="exceedBumpPct" value="${s.exceedBumpPct}" /> <span class="muted">%</span>
        </div>
        <div class="prog-field-row">
          <label>Round the suggested weight to the nearest</label>
          <select class="wide" data-field="roundTo">
            ${[2.5, 5, 10].map((v) => `<option value="${v}" ${s.roundTo === v ? "selected" : ""}>${v} lb</option>`).join("")}
          </select>
        </div>
        <div class="prog-field-row">
          <label>If I miss the bottom of my rep range</label>
          <select class="wide" data-field="missBehavior">
            <option value="repeat" ${s.missBehavior === "repeat" ? "selected" : ""}>Repeat the same target</option>
            <option value="drop5" ${s.missBehavior === "drop5" ? "selected" : ""}>Drop by 5%</option>
          </select>
        </div>
      </div>
    </div>
  `);
  const form = card.querySelector(".progression-form");
  card.querySelector(".prog-edit-toggle").addEventListener("click", () => form.classList.toggle("open"));
  card.querySelector('[data-field="autoSuggest"]').addEventListener("click", (e) => {
    s.autoSuggest = !s.autoSuggest;
    scheduleSave();
    renderWorkoutSheet(sheetId);
  });
  card.querySelectorAll("input[data-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const v = parseFloat(input.value);
      if (Number.isFinite(v)) s[input.dataset.field] = v;
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
  });
  card.querySelectorAll("select[data-field]").forEach((select) => {
    select.addEventListener("change", () => {
      s[select.dataset.field] = select.dataset.field === "roundTo" ? parseFloat(select.value) : select.value;
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
  });
  return card;
}

function openWorkoutExerciseModal(sheetId, dayId, exerciseId) {
  const sheet = state.customSheets[sheetId];
  const week = sheet.weeks.find((w) => w.id === sheet.activeWeekId);
  const day = week.days.find((d) => d.id === dayId);
  const isNew = !exerciseId;
  const exercise = isNew ? null : day.exercises.find((e) => e.id === exerciseId);
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <h3>${isNew ? "Add exercise" : "Edit exercise"}</h3>
        <div class="wardrobe-item-form">
          <label class="muted" style="font-size:12px;">Code (e.g. A1, B)</label>
          <input type="text" name="code" value="${escapeHtml(exercise?.code || "")}" />
          <label class="muted" style="font-size:12px;">Exercise name</label>
          <input type="text" name="name" value="${escapeHtml(exercise?.name || "")}" required />
          <label class="muted" style="font-size:12px;">Primary muscles</label>
          <input type="text" name="muscles" value="${escapeHtml(exercise?.muscles || "")}" />
          <label class="muted" style="font-size:12px;">Target rep range</label>
          <div class="rep-range-row" style="margin-bottom:10px;">
            <input type="number" name="repMin" value="${exercise?.repMin ?? 8}" style="width:56px;" />
            <span class="muted">to</span>
            <input type="number" name="repMax" value="${exercise?.repMax ?? 10}" style="width:56px;" />
            <span class="muted">reps</span>
            <label style="display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--muted);margin-left:8px;">
              <input type="checkbox" name="perSide" style="width:auto;" ${exercise?.perSide ? "checked" : ""} /> per side
            </label>
          </div>
          <label class="muted" style="font-size:12px;">Progression direction</label>
          <select name="direction">
            <option value="up" ${(!exercise || exercise.direction === "up") ? "selected" : ""}>Heavier is harder (most exercises)</option>
            <option value="down" ${exercise?.direction === "down" ? "selected" : ""}>Lighter is harder (assisted machines)</option>
          </select>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin:10px 0;">
            <input type="checkbox" name="autoSuggest" style="width:auto;flex-shrink:0;" ${!exercise || exercise.autoSuggest ? "checked" : ""} /> Auto-suggest this exercise's target
          </label>
          <label class="muted" style="font-size:12px;">Video link</label>
          <input type="url" name="link" placeholder="https://youtu.be/… or an Instagram link" value="${escapeHtml(exercise?.link || "")}" />
          <label class="muted" style="font-size:12px;">Notes</label>
          <textarea name="notes" rows="2">${escapeHtml(exercise?.notes || "")}</textarea>
        </div>
        <div class="modal-actions">
          ${!isNew ? '<button type="button" class="btn-ghost danger wi-delete" style="margin-right:auto;">Delete</button>' : ""}
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-primary modal-confirm">${isNew ? "Add" : "Save"}</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  overlay.querySelector(".modal-confirm").addEventListener("click", () => {
    const form = overlay.querySelector(".wardrobe-item-form");
    const name = form.querySelector('[name="name"]').value.trim();
    if (!name) return;
    const updated = {
      code: form.querySelector('[name="code"]').value.trim(),
      name,
      muscles: form.querySelector('[name="muscles"]').value.trim(),
      repMin: parseFloat(form.querySelector('[name="repMin"]').value) || 0,
      repMax: parseFloat(form.querySelector('[name="repMax"]').value) || 0,
      perSide: form.querySelector('[name="perSide"]').checked,
      direction: form.querySelector('[name="direction"]').value,
      autoSuggest: form.querySelector('[name="autoSuggest"]').checked,
      link: form.querySelector('[name="link"]').value.trim(),
      notes: form.querySelector('[name="notes"]').value.trim(),
    };
    if (isNew) {
      day.exercises.push({
        id: nextId(),
        ...updated,
        sets: [{ id: nextId(), setType: "Top", prev: "", target: "", actual: "" }],
      });
    } else {
      Object.assign(exercise, updated);
    }
    scheduleSave();
    overlay.remove();
    renderWorkoutSheet(sheetId);
  });
  const deleteBtn = overlay.querySelector(".wi-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      confirmModal("Remove this exercise?", `Remove "${exercise.name}" from this day?`, "Remove", () => {
        day.exercises = day.exercises.filter((e) => e.id !== exercise.id);
        scheduleSave();
        overlay.remove();
        renderWorkoutSheet(sheetId);
      });
    });
  }
  document.body.appendChild(overlay);
}

function renderWorkoutExercise(sheetId, dayId, exercise, day) {
  const sheet = state.customSheets[sheetId];
  const wasOpen = sheet.openExercises[exercise.id];
  const item = el(`
    <details class="workout-ex-item" ${wasOpen ? "open" : ""}>
      <summary class="workout-ex-row">
        <span class="workout-ex-code">${escapeHtml(exercise.code || "")}</span>
        <div class="workout-ex-row-body">
          <div class="workout-ex-name">${escapeHtml(exercise.name)}${
    exercise.link
      ? `<a class="wi-link-icon" href="${escapeHtml(exercise.link)}" target="_blank" rel="noopener noreferrer" title="Watch demo">${linkSvg}</a>`
      : ""
  }</div>
          <div class="workout-ex-hint">${escapeHtml(exercise.muscles || "")}${
    exercise.repMin != null && exercise.repMax != null
      ? ` · ${exercise.repMin}–${exercise.repMax} reps${exercise.perSide ? "/side" : ""}`
      : ""
  }</div>
        </div>
        <span class="wardrobe-chevron">${chevronSvg}</span>
      </summary>
      <div class="workout-ex-detail">
        <div class="workout-set-row workout-set-head">
          <div></div><span class="workout-set-col-label">Previous</span><span class="workout-set-col-label">Target</span><span class="workout-set-col-label">Actual</span>
        </div>
        <div class="workout-ex-sets"></div>
        <div class="wi-detail-notes workout-ex-notes-display" style="${exercise.notes ? "" : "display:none;"}">${escapeHtml(exercise.notes || "")}</div>
        <div class="workout-ex-actions">
          ${
            exercise.link
              ? `<a class="btn-ghost small" href="${escapeHtml(exercise.link)}" target="_blank" rel="noopener noreferrer">${linkSvg} Watch demo</a>`
              : ""
          }
          <button type="button" class="btn-ghost small wex-add-set">+ Add set</button>
          <button type="button" class="btn-ghost small wex-edit">Edit exercise</button>
        </div>
      </div>
    </details>
  `);
  item.querySelector(".wi-link-icon")?.addEventListener("click", (e) => e.stopPropagation());
  item.addEventListener("toggle", () => {
    sheet.openExercises[exercise.id] = item.open;
    scheduleSave();
  });
  const setsWrap = item.querySelector(".workout-ex-sets");
  exercise.sets.forEach((set) => {
    const missed = set.actual === "✖️";
    const row = el(`
      <div class="workout-set-row">
        <div class="workout-set-type">${escapeHtml(set.setType)}</div>
        <div class="workout-set-prev ${missed ? "workout-miss" : ""}">${escapeHtml(set.prev || "—")}</div>
        <input type="text" class="wset-target" value="${escapeHtml(set.target || "")}" placeholder="e.g. 65 lb" />
        <input type="text" class="wset-actual" value="${escapeHtml(set.actual || "")}" placeholder="—" />
        <button type="button" class="icon-btn wset-remove" title="Remove set">&times;</button>
      </div>
    `);
    row.querySelector(".wset-target").addEventListener("change", (e) => {
      set.target = e.target.value.trim();
      scheduleSave();
    });
    row.querySelector(".wset-actual").addEventListener("change", (e) => {
      set.actual = e.target.value.trim();
      // Stamps the day itself, not just the set — this is what lets a
      // streak read on Workout Log at all, since a week/day slot has no
      // calendar date of its own otherwise. Same "always today, never
      // backdated" rule as everywhere else: clearing a value doesn't
      // un-stamp a day that was genuinely logged. Only re-renders the
      // page when this actually moves the streak/milestones, so typing
      // into Target right after doesn't get interrupted.
      if (set.actual && day && day.lastLoggedDate !== todayISO()) {
        day.lastLoggedDate = todayISO();
        scheduleSave();
        renderHome(); // runs pillar auto-detection first, so the Movement streak below reflects today
        renderWorkoutSheet(sheetId);
        return;
      }
      scheduleSave();
    });
    row.querySelector(".wset-remove").addEventListener("click", () => {
      exercise.sets = exercise.sets.filter((s) => s.id !== set.id);
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
    setsWrap.appendChild(row);
  });
  item.querySelector(".wex-add-set").addEventListener("click", () => {
    const last = exercise.sets[exercise.sets.length - 1];
    exercise.sets.push({ id: nextId(), setType: "Extra", prev: last?.target || "", target: last?.target || "", actual: "" });
    scheduleSave();
    renderWorkoutSheet(sheetId);
  });
  item.querySelector(".wex-edit").addEventListener("click", () => openWorkoutExerciseModal(sheetId, dayId, exercise.id));
  return item;
}

function renderWorkoutSheet(sheetId) {
  const panel = document.getElementById(`panel-${sheetId}`);
  const sheet = state.customSheets[sheetId];
  if (!panel || !sheet) return;
  sheet.milestonesEarned ||= {};
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">${escapeHtml(sheet.label)}</h2>`));

  // ---- Streak, at the top like the other practices. 2026-09 apps
  // rearchitecture: Workout Log is its own Practice now, with its own
  // independent streak — no longer shared with Activity Log. ----
  const workoutToday = todayISO();
  panel.appendChild(buildStreakCard(appCurrentStreak(sheetId, workoutToday), "day streak"));

  const workoutStatsHere = computeWorkoutProgressStats(sheet);
  if (workoutStatsHere) {
    panel.appendChild(
      buildProgressCard(
        "Workout Progress",
        workoutStatsHere.weekPct,
        `<strong>${workoutStatsHere.weekDone} of ${workoutStatsHere.weekTotal}</strong> days worked out this week<br/>${workoutStatsHere.weekLabel}`,
        workoutStatsHere.tones,
        "Last 14 training days",
        null
      )
    );
  }

  if (!sheet.weeks.some((w) => w.id === sheet.activeWeekId)) {
    sheet.activeWeekId = sheet.weeks[sheet.weeks.length - 1]?.id;
  }
  const week = sheet.weeks.find((w) => w.id === sheet.activeWeekId);

  const weekRow = el(`<div class="workout-week-row"></div>`);
  const pills = el(`<div class="workout-week-pills"></div>`);
  sheet.weeks.forEach((w) => {
    const btn = el(`<button type="button" class="${w.id === sheet.activeWeekId ? "active" : ""}">${escapeHtml(w.label)}</button>`);
    btn.addEventListener("click", () => {
      sheet.activeWeekId = w.id;
      scheduleSave();
      renderWorkoutSheet(sheetId);
    });
    pills.appendChild(btn);
  });
  weekRow.appendChild(pills);
  const newWeekBtn = el(`<button type="button" class="btn-ghost small">+ New week</button>`);
  newWeekBtn.addEventListener("click", () => openNewWeekModal(sheetId));
  weekRow.appendChild(newWeekBtn);
  panel.appendChild(weekRow);

  if (!week) {
    panel.appendChild(el(`<div class="muted">No weeks yet — start one above.</div>`));
    return;
  }

  panel.appendChild(renderProgressionSettingsCard(sheet, sheetId));

  week.days.forEach((day) => {
    const details = el(`
      <details class="wardrobe-group" ${sheet.openDays[day.id] !== false ? "open" : ""}>
        <summary class="wardrobe-summary">
          <span class="wardrobe-cat-title workout-day-title-text">${escapeHtml(day.label)}</span>
          <span class="muted">${day.exercises.length} exercise${day.exercises.length === 1 ? "" : "s"}</span>
        </summary>
        <div class="wardrobe-items"></div>
      </details>
    `);
    details.addEventListener("toggle", () => {
      sheet.openDays[day.id] = details.open;
      scheduleSave();
    });
    details.querySelector(".workout-day-title-text").title = "Double-click to rename";
    details.querySelector(".workout-day-title-text").addEventListener("dblclick", (e) => {
      e.preventDefault();
      const titleEl = details.querySelector(".workout-day-title-text");
      const input = el(`<input type="text" value="${escapeHtml(day.label)}" style="font-weight:600;font-size:14px;" />`);
      titleEl.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        day.label = input.value.trim() || day.label;
        scheduleSave();
        renderWorkoutSheet(sheetId);
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e2) => {
        if (e2.key === "Enter") input.blur();
        if (e2.key === "Escape") renderWorkoutSheet(sheetId);
      });
    });
    const itemsWrap = details.querySelector(".wardrobe-items");
    day.exercises.forEach((ex) => itemsWrap.appendChild(renderWorkoutExercise(sheetId, day.id, ex, day)));
    const addExBtn = el(`<button type="button" class="btn-ghost small" style="margin-top:10px;">+ Add exercise</button>`);
    addExBtn.addEventListener("click", () => openWorkoutExerciseModal(sheetId, day.id, null));
    itemsWrap.appendChild(addExBtn);
    const removeDayBtn = el(`<button type="button" class="btn-ghost small danger" style="margin-top:10px;margin-left:8px;">Remove day</button>`);
    removeDayBtn.addEventListener("click", () => {
      confirmModal("Remove this day?", `Remove "${day.label}" and all its exercises from this week?`, "Remove", () => {
        week.days = week.days.filter((d) => d.id !== day.id);
        scheduleSave();
        renderWorkoutSheet(sheetId);
      });
    });
    itemsWrap.appendChild(removeDayBtn);
    panel.appendChild(details);
  });

  const addDayBtn = el(`<button type="button" class="btn-ghost small" style="margin-top:14px;">+ Add day</button>`);
  addDayBtn.addEventListener("click", () => {
    week.days.push({ id: nextId(), label: `Day ${week.days.length + 1}`, exercises: [] });
    scheduleSave();
    renderWorkoutSheet(sheetId);
  });
  panel.appendChild(addDayBtn);

  // ---- Milestones — permanent, unlike the streak above ----
  panel.appendChild(buildMilestonesCard(sheet, WORKOUT_MILESTONES, workoutToday));
}

// ------------------------------------------------------------------
// Lists — one home for every running list, not just tasks. Each list is
// either a plain checklist (Groceries, Packing — no priority, just a
// name and a checkbox) or a task list (priority dots, same as the old
// single To-Do). The overview shows every list with its own icon/color;
// tapping one drills into it, same tab, no separate nav entry needed.
// ------------------------------------------------------------------
const LIST_ICON_CHOICES = [
  { key: "checklist", svg: `<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>` },
  { key: "cart", svg: `<path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 3h2l1 3"/>` },
  { key: "gift", svg: `<path d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4M4 12l1.5 8h13L20 12M4 12h16M9 6V4h6v2"/>` },
  { key: "plane", svg: `<path d="M3 11l18-7-7 18-3-8-8-3z"/>` },
  { key: "clock", svg: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>` },
];
const LIST_COLOR_CHOICES = ["#8C3F2B", "#55694A", "#8B6BAE", "#4E7C93", "#C9A24A"];
const LIST_PRIORITY_CYCLE = ["1. High", "2. Medium", "3. Low"];

function listIconSvg(key) {
  return (LIST_ICON_CHOICES.find((i) => i.key === key) || LIST_ICON_CHOICES[0]).svg;
}
function listPriorityClass(priority) {
  return priority?.includes("High") ? "high" : priority?.includes("Low") ? "low" : "medium";
}
function activeList() {
  return state.lists.find((l) => l.id === state.activeListId) || null;
}

function renderLists() {
  const panel = document.getElementById("panel-todo");
  panel.innerHTML = "";
  const list = activeList();
  if (list) panel.appendChild(renderListDetail(list));
  else panel.appendChild(renderListsOverview());
}

function renderListsOverview() {
  const wrap = el(`<div></div>`);
  wrap.appendChild(el(`<h2 class="section-title serif">Lists</h2>`));

  state.lists.forEach((list) => {
    const openCount = list.items.filter((i) => !i.done).length;
    const sub = list.style === "checklist" ? `${list.items.length} item${list.items.length === 1 ? "" : "s"}` : `${openCount} open`;
    const card = el(`
      <button type="button" class="list-card">
        <span class="list-card-icon" style="background:${list.color};">${iconSvg(listIconSvg(list.icon))}</span>
        <span class="list-card-body">
          <span class="list-card-name">${escapeHtml(list.name)}</span>
          <span class="list-card-sub">${escapeHtml(sub)}</span>
        </span>
        <span class="list-card-chevron">${chevronRightSvg}</span>
      </button>
    `);
    card.addEventListener("click", () => {
      state.activeListId = list.id;
      scheduleSave();
      renderLists();
    });
    wrap.appendChild(card);
  });

  const newListBtn = el(`
    <button type="button" class="new-list-tile">
      <span class="new-list-tile-icon">${iconSvg('<path d="M12 5v14M5 12h14"/>')}</span>
      <span class="new-list-tile-label">New list</span>
    </button>
  `);
  newListBtn.addEventListener("click", () => openNewListModal());
  wrap.appendChild(newListBtn);

  return wrap;
}

function openNewListModal() {
  let icon = LIST_ICON_CHOICES[0].key;
  let color = LIST_COLOR_CHOICES[0];
  let style = "task";
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box account-modal-box">
        <h3>New List</h3>
        <div class="field-label">Name</div>
        <input type="text" class="list-name-input" placeholder="e.g. Packing — Bali" style="width:100%;box-sizing:border-box;" />
        <div class="field-label">Icon</div>
        <div class="icon-grid"></div>
        <div class="field-label">Color</div>
        <div class="color-grid"></div>
        <div class="field-label">Style</div>
        <div class="style-toggle">
          <button type="button" class="style-choice" data-value="checklist">Simple checklist</button>
          <button type="button" class="style-choice selected" data-value="task">Task list (priority)</button>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-ghost modal-cancel">Cancel</button>
          <button type="button" class="btn-primary modal-confirm">Create list</button>
        </div>
      </div>
    </div>
  `);

  const iconGrid = overlay.querySelector(".icon-grid");
  LIST_ICON_CHOICES.forEach((choice) => {
    const btn = el(`<button type="button" class="icon-choice${choice.key === icon ? " selected" : ""}">${iconSvg(choice.svg)}</button>`);
    btn.addEventListener("click", () => {
      icon = choice.key;
      iconGrid.querySelectorAll(".icon-choice").forEach((b) => b.classList.toggle("selected", b === btn));
    });
    iconGrid.appendChild(btn);
  });

  const colorGrid = overlay.querySelector(".color-grid");
  LIST_COLOR_CHOICES.forEach((c) => {
    const btn = el(`<button type="button" class="color-choice${c === color ? " selected" : ""}" style="background:${c};"></button>`);
    btn.addEventListener("click", () => {
      color = c;
      colorGrid.querySelectorAll(".color-choice").forEach((b) => b.classList.toggle("selected", b === btn));
    });
    colorGrid.appendChild(btn);
  });

  overlay.querySelectorAll(".style-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      style = btn.dataset.value;
      overlay.querySelectorAll(".style-choice").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });

  const nameInput = overlay.querySelector(".list-name-input");
  const submit = () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }
    const newList = { id: "list_" + nextId(), name, icon, color, style, items: [] };
    state.lists.push(newList);
    state.activeListId = newList.id;
    scheduleSave();
    overlay.remove();
    renderLists();
  };
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
  overlay.querySelector(".modal-cancel").addEventListener("click", () => overlay.remove());
  overlay.querySelector(".modal-confirm").addEventListener("click", submit);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
  nameInput.focus();
}

let draggedListItemId = null;
function reorderListItem(list, draggedId, targetId, before) {
  const draggedIdx = list.items.findIndex((i) => i.id === draggedId);
  const targetIdx = list.items.findIndex((i) => i.id === targetId);
  if (draggedIdx < 0 || targetIdx < 0) return;
  const [item] = list.items.splice(draggedIdx, 1);
  const newTargetIdx = list.items.findIndex((i) => i.id === targetId);
  const insertAt = before ? newTargetIdx : newTargetIdx + 1;
  list.items.splice(insertAt, 0, item);
  list.items.forEach((i, idx) => (i.sortOrder = idx));
  scheduleSave();
  renderLists();
}

function renderListDetail(list) {
  const wrap = el(`<div></div>`);

  const topRow = el(`
    <div class="list-detail-topbar">
      <button type="button" class="list-back-btn">${backArrowSvg}</button>
      <h2 class="section-title serif list-detail-title" style="margin:0;" title="Double-click to rename">${escapeHtml(list.name)}</h2>
      <button type="button" class="list-delete-btn" title="Delete this list">${trashSvg}</button>
    </div>
  `);
  topRow.querySelector(".list-back-btn").addEventListener("click", () => {
    state.activeListId = null;
    scheduleSave();
    renderLists();
  });
  topRow.querySelector(".list-delete-btn").addEventListener("click", () => {
    confirmModal("Delete list?", `Delete "${list.name}" and everything in it? This can't be undone.`, "Delete", () => {
      state.lists = state.lists.filter((l) => l.id !== list.id);
      state.activeListId = null;
      scheduleSave();
      renderLists();
    });
  });
  const titleEl = topRow.querySelector(".list-detail-title");
  titleEl.addEventListener("dblclick", () => {
    const input = el(`<input type="text" class="list-edit-name" value="${escapeHtml(list.name)}" style="font-size:20px;width:100%;box-sizing:border-box;" />`);
    topRow.replaceChild(input, titleEl);
    input.focus();
    input.select();
    const commit = () => {
      list.name = input.value.trim() || list.name;
      scheduleSave();
      renderLists();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") renderLists();
    });
  });
  wrap.appendChild(topRow);

  const sorted = [...list.items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const card = el(`<div class="card"></div>`);
  if (!sorted.length) card.appendChild(el(`<div class="muted" style="padding:10px 0;">Nothing here yet.</div>`));
  sorted.forEach((item) => card.appendChild(listItemRow(list, item)));
  wrap.appendChild(card);

  const addBtn = el(`<button type="button" class="btn-primary todo-add-btn">+ Add item</button>`);
  addBtn.addEventListener("click", () => {
    addBtn.replaceWith(listAddComposer(list));
  });
  wrap.appendChild(addBtn);

  return wrap;
}

// Expands right in place where the new item will land — no popup. Shows
// priority dots only for a task-style list; a checklist skips straight
// to Save since it has nothing else to pick.
function listAddComposer(list) {
  const box = el(`
    <div class="inline-composer">
      <input type="text" class="inline-composer-input" placeholder="${list.style === "task" ? "New task…" : "New item…"}" />
      <div class="inline-composer-row">
        <div class="inline-pri-picks"></div>
        <div class="inline-composer-actions">
          <button type="button" class="inline-btn cancel">Cancel</button>
          <button type="button" class="inline-btn save">Add</button>
        </div>
      </div>
    </div>
  `);
  let priority = "2. Medium";
  if (list.style === "task") {
    const picks = box.querySelector(".inline-pri-picks");
    LIST_PRIORITY_CYCLE.forEach((p) => {
      const dot = el(`<button type="button" class="inline-pri-dot priority-${listPriorityClass(p)}${p === priority ? " sel" : ""}"></button>`);
      dot.addEventListener("click", () => {
        priority = p;
        picks.querySelectorAll(".inline-pri-dot").forEach((d) => d.classList.toggle("sel", d === dot));
      });
      picks.appendChild(dot);
    });
  }
  const input = box.querySelector(".inline-composer-input");
  const restoreAddBtn = () => {
    const addBtn = el(`<button type="button" class="btn-primary todo-add-btn">+ Add item</button>`);
    addBtn.addEventListener("click", () => box.replaceWith(listAddComposer(list)));
    box.replaceWith(addBtn);
  };
  const submit = () => {
    const task = input.value.trim();
    if (!task) {
      input.focus();
      return;
    }
    list.items.push({
      id: nextId(),
      task,
      priority: list.style === "task" ? priority : undefined,
      done: false,
      sortOrder: list.items.length,
    });
    scheduleSave();
    renderLists();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") restoreAddBtn();
  });
  box.querySelector(".cancel").addEventListener("click", restoreAddBtn);
  box.querySelector(".save").addEventListener("click", submit);
  setTimeout(() => input.focus(), 0);
  return box;
}

function listItemRow(list, item) {
  const row = el(`
    <div class="row todo-row" draggable="true" data-item-id="${item.id}">
      <span class="todo-drag-handle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
      </span>
      <div class="checkbox todo-col-check ${item.done ? "checked" : ""}">${checkSvg}</div>
      <div class="todo-task-label" style="cursor:pointer;" title="Double-click to edit">
        <span class="${item.done ? "strike" : ""}">${escapeHtml(item.task)}</span>
      </div>
      ${
        list.style === "task"
          ? `<button type="button" class="todo-priority-dot priority-${listPriorityClass(item.priority)}" title="Tap to change priority"></button>`
          : `<span class="todo-priority-dot" style="background:none;visibility:hidden;"></span>`
      }
      <button class="remove-btn todo-col-actions" title="Delete">${trashSvg}</button>
    </div>
  `);

  row.addEventListener("dragstart", (e) => {
    draggedListItemId = item.id;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(item.id));
    } catch (err) {
      // Some browsers require this call to not throw even if unused.
    }
  });
  row.addEventListener("dragend", () => {
    draggedListItemId = null;
    document.querySelectorAll(".todo-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
  });
  row.addEventListener("dragover", (e) => {
    if (draggedListItemId == null || draggedListItemId === item.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    row.classList.toggle("drag-over-top", before);
    row.classList.toggle("drag-over-bottom", !before);
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("drag-over-top", "drag-over-bottom");
  });
  row.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedListItemId == null || draggedListItemId === item.id) return;
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    reorderListItem(list, draggedListItemId, item.id, before);
  });

  row.querySelector(".checkbox").addEventListener("click", () => {
    item.done = !item.done;
    scheduleSave();
    renderLists();
  });
  row.querySelector(".remove-btn").addEventListener("click", () => {
    confirmModal("Delete item?", `Delete "${item.task}"? This can't be undone.`, "Delete", () => {
      list.items = list.items.filter((x) => x.id !== item.id);
      scheduleSave();
      renderLists();
    });
  });

  const priorityDot = row.querySelector(".todo-priority-dot");
  if (priorityDot) {
    priorityDot.addEventListener("click", () => {
      const idx = LIST_PRIORITY_CYCLE.indexOf(item.priority || "2. Medium");
      item.priority = LIST_PRIORITY_CYCLE[(idx + 1) % LIST_PRIORITY_CYCLE.length];
      scheduleSave();
      renderLists();
    });
  }

  const taskLabel = row.querySelector(".todo-task-label");
  taskLabel.addEventListener("dblclick", () => {
    const input = el(`<input type="text" class="todo-edit-task" value="${escapeHtml(item.task)}" style="width:100%;box-sizing:border-box;" />`);
    row.replaceChild(input, taskLabel);
    input.focus();
    input.select();
    const commit = () => {
      item.task = input.value.trim() || item.task;
      scheduleSave();
      renderLists();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") {
        input.removeEventListener("blur", commit);
        renderLists();
      }
    });
  });

  return row;
}

// ------------------------------------------------------------------
// Budget — categories, sections, financial goals + paycheck view
// ------------------------------------------------------------------
let budgetView = "sections"; // "sections" | "paycheck" — synced from state.budgetView at boot
let budgetShowHidden = false; // synced from state.budgetShowHidden at boot

// Display order for budget sections — Subscriptions merges into Fixed Costs
// (see BUDGET_SECTION_MERGE_VERSION below), Giving sits right after it, and
// anything in a section not listed here sorts to the end.
const BUDGET_SECTION_ORDER = ["Categories", "Giving", "Savings & Investing", "Debt"];
// One-time merge of the old separate "Subscriptions" section into "Fixed
// Costs" — applied once in boot(), never re-run so later edits stick.
const BUDGET_SECTION_MERGE_VERSION = "2026-08-22c";


// Bucket definitions per pay frequency. Buckets are calendar-day-of-month
// ranges (matching how due dates already work in the By Category view),
// not actual tracked pay dates — so no extra "when do you get paid" field
// is needed in Paycheck Settings, just the frequency itself.
function getPaycheckBuckets(frequency) {
  if (frequency === "weekly") {
    return [
      { key: "w1", label: "Week 1", range: [1, 7] },
      { key: "w2", label: "Week 2", range: [8, 14] },
      { key: "w3", label: "Week 3", range: [15, 21] },
      { key: "w4", label: "Week 4", range: [22, 31] },
    ];
  }
  if (frequency === "monthly") {
    return [{ key: "m1", label: "This month", range: [1, 31] }];
  }
  // Semi-monthly and biweekly both approximate to two calendar-half pay periods.
  return [
    { key: "p1", label: "1st Paycheck", range: [1, 15] },
    { key: "p2", label: "2nd Paycheck", range: [16, 31] },
  ];
}

function paycheckBucketFor(item, buckets) {
  if (item.split) return "split";
  if (item.dueDay == null) return "unassigned";
  const match = buckets.find((b) => item.dueDay >= b.range[0] && item.dueDay <= b.range[1]);
  return match ? match.key : buckets[buckets.length - 1].key;
}

// Paycheck settings — one amount + frequency, used to flag when the budget
// asks for more than she actually brings home.
const PAYCHECK_FREQUENCIES = {
  weekly: { label: "Weekly", monthlyMultiplier: 52 / 12 },
  biweekly: { label: "Biweekly (every 2 weeks)", monthlyMultiplier: 26 / 12 },
  semimonthly: { label: "Semi-monthly (twice a month)", monthlyMultiplier: 2 },
  monthly: { label: "Monthly", monthlyMultiplier: 1 },
};

function monthlyIncomeFromPaycheck(settings) {
  const freq = PAYCHECK_FREQUENCIES[settings.frequency] || PAYCHECK_FREQUENCIES.semimonthly;
  return Number(settings.amount || 0) * freq.monthlyMultiplier;
}

function budgetFlagHtml(budgeted, income, label) {
  const diff = budgeted - income;
  if (diff > 0.5) {
    return `<div class="budget-flag over">Over your ${label} by $${diff.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div>`;
  }
  return `<div class="budget-flag ok">$${Math.abs(diff).toLocaleString("en-CA", { maximumFractionDigits: 0 })} under your ${label}</div>`;
}

function renderBudget() {
  const panel = document.getElementById("panel-budget");
  const items = state.budget;
  const total = items.filter((i) => !i.hidden).reduce((s, i) => s + Number(i.amount || 0), 0);

  const monthlyIncome = monthlyIncomeFromPaycheck(state.paycheckSettings);

  panel.innerHTML = "";
  panel.appendChild(el(`
    <div class="top-summary" style="align-items:center;margin-bottom:6px;">
      <h2 class="section-title serif" style="margin:0;">Budget</h2>
      <div style="text-align:right;">
        <div class="muted" style="font-size:12px;">Total / month</div>
        <div class="value serif">$${total.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div>
      </div>
    </div>
  `));
  panel.appendChild(el(`<div style="text-align:right;margin-bottom:14px;">${budgetFlagHtml(total, monthlyIncome, `$${monthlyIncome.toLocaleString("en-CA", { maximumFractionDigits: 0 })}/mo take-home`)}</div>`));

  const paycheckRow = el(`
    <div class="paycheck-settings-row">
      <div class="muted" style="font-size:13px;">
        Paycheck: <strong>$${Number(state.paycheckSettings.amount || 0).toLocaleString("en-CA")}</strong> · ${
    PAYCHECK_FREQUENCIES[state.paycheckSettings.frequency]?.label || "Semi-monthly (twice a month)"
  }
      </div>
      <button type="button" class="btn-ghost small paycheck-edit-toggle">Edit</button>
    </div>
  `);
  const paycheckForm = el(`
    <div class="paycheck-settings-form" style="display:none;">
      <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Amount per paycheck</label>
      <input type="number" step="0.01" class="paycheck-amount-input" value="${state.paycheckSettings.amount}" style="width:100%;box-sizing:border-box;" />
      <label class="muted" style="display:block;font-size:12px;margin:10px 0 4px 0;">Frequency</label>
      <select class="paycheck-frequency-select" style="width:100%;box-sizing:border-box;">
        ${Object.entries(PAYCHECK_FREQUENCIES)
          .map(([key, f]) => `<option value="${key}" ${state.paycheckSettings.frequency === key ? "selected" : ""}>${f.label}</option>`)
          .join("")}
      </select>
      <button type="button" class="btn-primary small paycheck-save-btn" style="margin-top:10px;width:100%;">Save</button>
    </div>
  `);
  paycheckRow.querySelector(".paycheck-edit-toggle").addEventListener("click", () => {
    paycheckForm.style.display = paycheckForm.style.display === "none" ? "block" : "none";
  });
  paycheckForm.querySelector(".paycheck-save-btn").addEventListener("click", () => {
    const amt = parseFloat(paycheckForm.querySelector(".paycheck-amount-input").value);
    state.paycheckSettings.amount = Number.isFinite(amt) && amt >= 0 ? amt : state.paycheckSettings.amount;
    state.paycheckSettings.frequency = paycheckForm.querySelector(".paycheck-frequency-select").value;
    scheduleSave();
    renderBudget();
  });
  panel.appendChild(paycheckRow);
  panel.appendChild(paycheckForm);

  const hiddenCount = items.filter((i) => i.hidden).length;
  const toggleRow = el(`<div class="view-toggle-row"></div>`);
  const toggle = el(`
    <div class="view-toggle">
      <button data-view="sections" class="${budgetView === "sections" ? "active" : ""}">By Category</button>
      <button data-view="paycheck" class="${budgetView === "paycheck" ? "active" : ""}">By Paycheck</button>
    </div>
  `);
  toggle.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      budgetView = b.dataset.view;
      state.budgetView = budgetView;
      scheduleSave();
      renderBudget();
    });
  });
  toggleRow.appendChild(toggle);
  if (hiddenCount > 0) {
    const hiddenToggle = el(`
      <button type="button" class="btn-ghost small hidden-toggle-btn ${budgetShowHidden ? "active" : ""}">
        ${budgetShowHidden ? "Hide" : "Show"} hidden (${hiddenCount})
      </button>
    `);
    hiddenToggle.addEventListener("click", () => {
      budgetShowHidden = !budgetShowHidden;
      state.budgetShowHidden = budgetShowHidden;
      scheduleSave();
      renderBudget();
    });
    toggleRow.appendChild(hiddenToggle);
  }
  panel.appendChild(toggleRow);

  const visibleItems = items.filter((i) => !i.hidden || budgetShowHidden);

  if (budgetView === "sections") {
    renderBudgetBySection(panel, visibleItems);
  } else {
    renderBudgetByPaycheck(panel, visibleItems);
  }

  renderFinancialGoals(panel);
}

function renderBudgetBySection(panel, items) {
  const bySection = {};
  items.forEach((i) => (bySection[i.section || "Other"] ||= []).push(i));
  const orderedSections = Object.keys(bySection).sort((a, b) => {
    const ai = BUDGET_SECTION_ORDER.indexOf(a);
    const bi = BUDGET_SECTION_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  orderedSections.forEach((section) => {
    const rows = bySection[section];
    const sectionTotal = rows.filter((i) => !i.hidden).reduce((s, i) => s + Number(i.amount || 0), 0);
    const card = el(`
      <details class="card" open>
        <summary class="book-summary" style="margin-bottom:8px;">
          <strong>${escapeHtml(section)}</strong>
          <span class="muted">$${sectionTotal.toLocaleString("en-CA")}</span>
        </summary>
      </details>
    `);
    rows.forEach((r) => card.appendChild(budgetRow(r)));
    panel.appendChild(card);
  });

  const form = el(`
    <form class="add-form">
      <input name="category" placeholder="New category" required />
      <input name="amount" type="number" step="0.01" placeholder="$/month" required />
      <input name="section" placeholder="Section (e.g. Categories)" />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    state.budget.push({
      id: nextId(),
      category: fd.get("category"),
      amount: parseFloat(fd.get("amount")) || 0,
      section: fd.get("section") || "Other",
      dueDay: null,
      split: false,
      hidden: false,
      sortOrder: state.budget.length,
    });
    scheduleSave();
    renderBudget();
  });
  panel.appendChild(form);
}

function budgetRow(item, opts = {}) {
  const row = el(`<div class="row budget-row" draggable="true" data-item-id="${item.id}"></div>`);

  row.addEventListener("dragstart", (e) => {
    draggedBudgetItemId = item.id;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(item.id));
    } catch (err) {
      // Some browsers require this call to not throw even if unused.
    }
  });
  row.addEventListener("dragend", () => {
    draggedBudgetItemId = null;
    document.querySelectorAll(".budget-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
  });
  row.addEventListener("dragover", (e) => {
    if (draggedBudgetItemId == null || draggedBudgetItemId === item.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    row.classList.toggle("drag-over-top", before);
    row.classList.toggle("drag-over-bottom", !before);
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("drag-over-top", "drag-over-bottom");
  });
  row.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedBudgetItemId == null || draggedBudgetItemId === item.id) return;
    const rect = row.getBoundingClientRect();
    const before = e.clientY - rect.top < rect.height / 2;
    reorderBudgetItem(draggedBudgetItemId, item.id, before);
  });

  function showDisplay() {
    row.classList.remove("editing");
    row.classList.toggle("hidden-item", !!item.hidden);
    row.innerHTML = "";
    row.appendChild(el(`
      <span class="budget-drag-handle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
      </span>
    `));
    row.appendChild(el(`<div class="budget-row-main">${escapeHtml(item.category)}${opts.splitNote ? ` <span class="muted">(${opts.splitNote})</span>` : ""}${item.hidden ? `<span class="muted-sub">Hidden from totals</span>` : ""}</div>`));
    const shownAmount = opts.displayAmount != null ? opts.displayAmount : item.amount;
    row.appendChild(el(`<span class="budget-row-amount">$${Number(shownAmount || 0).toLocaleString("en-CA", { maximumFractionDigits: 0 })}</span>`));
    const right = el(`
      <div class="budget-row-actions">
        <button type="button" class="icon-btn budget-edit-btn" title="Edit due date, split, amount, or hide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
        </button>
        <button class="remove-btn" title="Delete">&times;</button>
      </div>
    `);
    right.querySelector(".budget-edit-btn").addEventListener("click", showEdit);
    right.querySelector(".remove-btn").addEventListener("click", () => {
      state.budget = state.budget.filter((x) => x.id !== item.id);
      scheduleSave();
      renderBudget();
    });
    row.appendChild(right);
  }

  function showEdit() {
    row.classList.add("editing");
    row.innerHTML = "";
    row.appendChild(el(`<div class="budget-row-main">${escapeHtml(item.category)}</div>`));
    const fields = el(`
      <div class="budget-fields">
        <label class="muted" style="font-size:11px;">Due</label>
        <input type="number" min="1" max="31" class="due-input" value="${item.dueDay ?? ""}" placeholder="day" />
        <button type="button" class="split-chip ${item.split ? "on" : ""}">Split 50/50</button>
        <span>$</span>
        <input type="number" step="0.01" class="amount-input" value="${item.amount}" />
        <button type="button" class="icon-btn hide-chip ${item.hidden ? "active-toggle" : ""}" title="${item.hidden ? "Hidden from totals — click to include again" : "Hide from totals"}">${eyeToggleSvg(item.hidden)}</button>
        <button type="button" class="icon-btn budget-done-btn" title="Done">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
      </div>
    `);
    const dueInput = fields.querySelector(".due-input");
    const splitChip = fields.querySelector(".split-chip");
    const amountInput = fields.querySelector(".amount-input");
    const hideChip = fields.querySelector(".hide-chip");

    dueInput.addEventListener("change", () => {
      const v = parseInt(dueInput.value, 10);
      item.dueDay = Number.isFinite(v) && v >= 1 && v <= 31 ? v : null;
      if (item.dueDay != null) {
        item.split = false;
        splitChip.classList.remove("on");
      }
      scheduleSave();
    });
    splitChip.addEventListener("click", () => {
      item.split = !item.split;
      if (item.split) {
        item.dueDay = null;
        dueInput.value = "";
      }
      splitChip.classList.toggle("on", item.split);
      scheduleSave();
    });
    amountInput.addEventListener("change", () => {
      item.amount = parseFloat(amountInput.value) || 0;
      scheduleSave();
    });
    hideChip.addEventListener("click", () => {
      item.hidden = !item.hidden;
      hideChip.classList.toggle("active-toggle", item.hidden);
      hideChip.title = item.hidden ? "Hidden from totals — click to include again" : "Hide from totals";
      hideChip.innerHTML = eyeToggleSvg(item.hidden);
      scheduleSave();
    });
    fields.querySelector(".budget-done-btn").addEventListener("click", () => {
      scheduleSave();
      renderBudget();
    });
    row.appendChild(fields);
  }

  showDisplay();
  return row;
}

function renderBudgetByPaycheck(panel, items) {
  const frequency = state.paycheckSettings.frequency || "semimonthly";
  const paycheckBuckets = getPaycheckBuckets(frequency);
  const buckets = { unassigned: [] };
  paycheckBuckets.forEach((b) => (buckets[b.key] = []));

  items.forEach((item) => {
    const b = paycheckBucketFor(item, paycheckBuckets);
    if (b === "split") {
      const share = item.amount / paycheckBuckets.length;
      paycheckBuckets.forEach((pb) =>
        buckets[pb.key].push({ item, displayAmount: share, splitNote: `1/${paycheckBuckets.length}` })
      );
    } else {
      buckets[b].push({ item, displayAmount: item.amount, splitNote: null });
    }
  });

  const defs = [...paycheckBuckets, { key: "unassigned", label: "No due date set" }];
  const paycheckAmount = Number(state.paycheckSettings.amount || 0);

  defs.forEach(({ key, label }) => {
    const rows = buckets[key];
    const bucketTotal = rows.filter((r) => !r.item.hidden).reduce((s, r) => s + Number(r.displayAmount || 0), 0);
    const card = el(`
      <div class="card">
        <div class="paycheck-card-head">
          <strong>${label}</strong>
          <span class="amt serif">$${bucketTotal.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    `);
    if (key !== "unassigned") {
      card.appendChild(el(budgetFlagHtml(bucketTotal, paycheckAmount, "paycheck")));
    } else if (rows.length > 0) {
      const visibleRows = rows.filter((r) => !r.item.hidden);
      card.appendChild(
        el(
          `<div class="unassigned-callout">${visibleRows.length} categor${
            visibleRows.length === 1 ? "y" : "ies"
          } with no due date — $${bucketTotal.toLocaleString("en-CA", {
            maximumFractionDigits: 0,
          })} isn't reflected in either paycheck above.</div>`
        )
      );
    }
    if (rows.length === 0) {
      card.appendChild(el(`<div class="muted">Nothing here.</div>`));
    }
    rows.forEach((r) => {
      card.appendChild(budgetRow(r.item, { displayAmount: r.displayAmount, splitNote: r.splitNote }));
    });
    panel.appendChild(card);
  });
  const rangeNote =
    frequency === "weekly"
      ? "This view splits the month into four due-date weeks (1–7, 8–14, 15–21, 22–31) and compares each to your weekly paycheck."
      : frequency === "monthly"
      ? "This view shows the whole month as one pay period."
      : "This view splits the month by due date (1st–15th and 16th–31st) and compares each half to one paycheck.";
  panel.appendChild(el(`<div class="muted" style="margin-top:-6px;margin-bottom:10px;">${rangeNote}</div>`));
  panel.appendChild(el(`<div class="muted" style="margin-top:-6px;margin-bottom:18px;">Set a due date or mark an item "Split 50/50" from the By Category view to place it here.</div>`));
}

function renderFinancialGoals(panel) {
  const section = el(`
    <details class="goals-section" ${state.goalsOpen === false ? "" : "open"}>
      <summary class="goals-section-summary">
        <h3 class="subsection-title serif" style="margin:0;">Financial Goals</h3>
        <span class="wardrobe-chevron">${chevronSvg}</span>
      </summary>
      <div class="goals-section-body"></div>
    </details>
  `);
  section.addEventListener("toggle", () => {
    state.goalsOpen = section.open;
    scheduleSave();
  });
  const card = el(`<div class="card"></div>`);
  state.goals
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((g) => {
      const row = el(`
        <div class="goal-row" draggable="true" data-item-id="${g.id}">
          <span class="goal-drag-handle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"></circle><circle cx="8" cy="12" r="1.6"></circle><circle cx="8" cy="18" r="1.6"></circle><circle cx="16" cy="6" r="1.6"></circle><circle cx="16" cy="12" r="1.6"></circle><circle cx="16" cy="18" r="1.6"></circle></svg>
          </span>
          <div class="checkbox ${g.done ? "checked" : ""}">${checkSvg}</div>
          <div class="goal-label ${g.done ? "done" : ""}">${escapeHtml(g.label)}</div>
          <button class="remove-btn" title="Delete">&times;</button>
        </div>
      `);
      row.addEventListener("dragstart", (e) => {
        draggedGoalId = g.id;
        row.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        try {
          e.dataTransfer.setData("text/plain", String(g.id));
        } catch (err) {
          // Some browsers require this call to not throw even if unused.
        }
      });
      row.addEventListener("dragend", () => {
        draggedGoalId = null;
        document.querySelectorAll(".goal-row").forEach((r) => r.classList.remove("dragging", "drag-over-top", "drag-over-bottom"));
      });
      row.addEventListener("dragover", (e) => {
        if (draggedGoalId == null || draggedGoalId === g.id) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const rect = row.getBoundingClientRect();
        const before = e.clientY - rect.top < rect.height / 2;
        row.classList.toggle("drag-over-top", before);
        row.classList.toggle("drag-over-bottom", !before);
      });
      row.addEventListener("dragleave", () => {
        row.classList.remove("drag-over-top", "drag-over-bottom");
      });
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedGoalId == null || draggedGoalId === g.id) return;
        const rect = row.getBoundingClientRect();
        const before = e.clientY - rect.top < rect.height / 2;
        reorderGoal(draggedGoalId, g.id, before);
      });
      row.querySelector(".checkbox").addEventListener("click", () => {
        g.done = !g.done;
        scheduleSave();
        renderBudget();
      });
      row.querySelector(".remove-btn").addEventListener("click", () => {
        state.goals = state.goals.filter((x) => x.id !== g.id);
        scheduleSave();
        renderBudget();
      });
      const labelEl = row.querySelector(".goal-label");
      labelEl.title = "Double-click to edit";
      labelEl.addEventListener("dblclick", () => {
        const input = el(`<input type="text" class="goal-label-input" value="${escapeHtml(g.label)}" />`);
        row.replaceChild(input, labelEl);
        input.focus();
        input.select();
        const commit = () => {
          g.label = input.value.trim() || g.label;
          scheduleSave();
          renderBudget();
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") input.blur();
          if (e.key === "Escape") {
            input.removeEventListener("blur", commit);
            renderBudget();
          }
        });
      });
      card.appendChild(row);
    });
  const body = section.querySelector(".goals-section-body");
  body.appendChild(card);

  const form = el(`
    <form class="add-form">
      <input name="label" placeholder="New goal" required />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    state.goals.push({ id: nextId(), label: fd.get("label"), done: false, sortOrder: state.goals.length });
    scheduleSave();
    renderBudget();
  });
  body.appendChild(form);
  panel.appendChild(section);
}

// ------------------------------------------------------------------
// Investments — accounts (RRSP/TFSA/FHSA), holdings, portfolio balancer
// ------------------------------------------------------------------
let portfolioChoice = "yours"; // synced from state.portfolioChoice at boot
let lastImportMessage = ""; // survives the renderInvestments() re-render triggered right after an import

const ACCOUNT_BUDGET_MATCH = {
  rrsp: /rrsp/i,
  tfsa: /tfsa/i,
  fhsa: /fhsa/i,
};

const ASSET_CLASS_MAP = {
  SPYM: "US Equity",
  SCHF: "Intl Equity",
  SHLD: "US Equity",
};
function assetClassFor(holdingName) {
  const key = Object.keys(ASSET_CLASS_MAP).find((k) => holdingName.toUpperCase().includes(k));
  if (key) return ASSET_CLASS_MAP[key];
  if (/gold|gltr|kilo|commod/i.test(holdingName)) return "Gold & Commodities";
  if (/bond|agg|tlt|govt/i.test(holdingName)) return "Bonds";
  return "Other";
}

const PORTFOLIO_PRESETS = {
  yours: {
    label: "Yours",
    note: "Whatever holdings you add above, in whatever ratio you want — no fixed number of tickers.",
    targets: null, // shown via the holdings table itself
  },
  dalio: {
    label: "Ray Dalio — All Weather",
    note: "Built to hold up across growth, recession, inflation, and deflation — heavy on bonds, light on stocks.",
    targets: { "US/Global Equity": 30, "Long-Term Bonds": 40, "Intermediate Bonds": 15, "Gold": 7.5, "Commodities": 7.5 },
  },
  bogleheads: {
    label: "Bogleheads Three-Fund",
    note: "The classic low-cost index approach: total US market, international, and bonds.",
    targets: { "US Equity": 60, "Intl Equity": 30, "Bonds": 10 },
  },
  classic: {
    label: "Classic 60/40",
    note: "The traditional balanced-investor split.",
    targets: { "US/Global Equity": 60, "Bonds": 40 },
  },
};

function currentMonthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}
function getBudgetContribution(accountKey) {
  const re = ACCOUNT_BUDGET_MATCH[accountKey];
  return state.budget.filter((b) => re.test(b.category)).reduce((s, b) => s + Number(b.amount || 0), 0);
}

function currentInvestmentAccount() {
  return state.investmentAccounts.find((a) => a.key === state.selectedInvestmentAccount) || state.investmentAccounts[0];
}

function renderInvestments() {
  const panel = document.getElementById("panel-investments");
  if (!panel) return;
  panel.innerHTML = "";
  panel.appendChild(el(`<h2 class="section-title serif">Investments</h2>`));

  // Deleting the Investments sheet for good (Settings) clears every account
  // — and there's no "add account" flow to rebuild from, so this is a real
  // dead end, not just an empty list. Render that plainly instead of
  // crashing on an account that no longer exists.
  if (!state.investmentAccounts.length) {
    panel.appendChild(
      el(`<div class="card muted" style="text-align:center;padding:32px 16px;">No investment accounts here anymore.</div>`)
    );
    return;
  }

  const thisMonth = currentMonthKey();
  const totalBalance = state.investmentAccounts.reduce((s, a) => s + Number(a.balance || 0), 0);
  panel.appendChild(el(`
    <div class="top-summary">
      <div>
        <div class="muted">Accounts total</div>
        <div class="value serif">$${totalBalance.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div>
      </div>
    </div>
  `));

  // ---- Account switcher: one account in view at a time ----
  const tabsWrap = el(`<div class="view-toggle" style="flex-wrap:wrap;"></div>`);
  state.investmentAccounts.forEach((a) => {
    const btn = el(`<button data-key="${a.key}" class="${state.selectedInvestmentAccount === a.key ? "active" : ""}">${escapeHtml(a.name)}</button>`);
    btn.addEventListener("click", () => {
      state.selectedInvestmentAccount = a.key;
      scheduleSave();
      renderInvestments();
    });
    tabsWrap.appendChild(btn);
  });
  panel.appendChild(tabsWrap);

  const acct = currentInvestmentAccount();
  const contribution = getBudgetContribution(acct.key);
  const deployed = acct.deployedMonths.includes(thisMonth);

  // ---- One consolidated card: account overview, balancer preset, and
  // holdings all live together here instead of as separate blocks. ----
  const card = el(`<div class="card"></div>`);

  const header = el(`
    <div class="row" style="align-items:flex-start;">
      <div style="flex:1;min-width:180px;">
        <div style="font-weight:600;font-size:15px;">${escapeHtml(acct.name)}</div>
        <div class="muted" style="margin-top:2px;">This month's planned contribution: $${contribution.toLocaleString("en-CA", { maximumFractionDigits: 0 })} (from Budget)</div>
      </div>
      <div class="budget-fields">
        <label class="muted" style="font-size:11px;">Balance $</label>
        <input type="number" step="0.01" class="acct-balance" value="${acct.balance}" style="width:100px;" />
      </div>
      <button type="button" class="split-chip deploy-chip ${deployed ? "on" : ""}">${deployed ? "Deployed ✓" : `Deploy for ${monthLabel(thisMonth)}`}</button>
    </div>
  `);
  header.querySelector(".acct-balance").addEventListener("change", (e) => {
    acct.balance = parseFloat(e.target.value) || 0;
    scheduleSave();
    renderInvestments();
  });
  header.querySelector(".deploy-chip").addEventListener("click", () => {
    if (acct.deployedMonths.includes(thisMonth)) {
      acct.deployedMonths = acct.deployedMonths.filter((m) => m !== thisMonth);
    } else {
      acct.deployedMonths.push(thisMonth);
    }
    scheduleSave();
    renderInvestments();
  });
  card.appendChild(header);
  card.appendChild(el(`<div class="muted" style="margin:6px 0 16px 0;">"Deploy" just marks that this month's set-aside cash actually got invested, not left sitting in cash.</div>`));
  card.appendChild(el(`<div style="border-top:1px solid var(--border);margin:0 0 16px 0;"></div>`));

  // Preset tabs pick what "Target" is measured against, right where the
  // holdings themselves are shown — not a separate section further down.
  const presetTabs = el(`<div class="view-toggle" style="flex-wrap:wrap;margin-bottom:12px;"></div>`);
  Object.entries(PORTFOLIO_PRESETS).forEach(([key, preset]) => {
    const btn = el(`<button data-key="${key}" class="${portfolioChoice === key ? "active" : ""}">${escapeHtml(preset.label)}</button>`);
    btn.addEventListener("click", () => {
      portfolioChoice = key;
      state.portfolioChoice = key;
      scheduleSave();
      renderInvestments();
    });
    presetTabs.appendChild(btn);
  });
  card.appendChild(presetTabs);

  const preset = PORTFOLIO_PRESETS[portfolioChoice];
  card.appendChild(el(`<div class="muted" style="margin-bottom:14px;">${escapeHtml(preset.note)}</div>`));

  renderHoldingsTable(card, acct, preset);

  const form = el(`
    <form class="add-form">
      <input name="holding" placeholder="Ticker / holding" required />
      <input name="currentPct" type="number" step="0.1" placeholder="Current %" />
      <button class="btn-primary" type="submit">Add</button>
    </form>
  `);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    acct.holdings.push({
      id: nextId(),
      holding: fd.get("holding"),
      currentPct: parseFloat(fd.get("currentPct")) || null,
      targetPct: null,
      action: null,
      sortOrder: acct.holdings.length,
    });
    scheduleSave();
    renderInvestments();
  });
  card.appendChild(form);

  panel.appendChild(card);

  renderPortfolioImport(panel, acct);
}

// ------------------------------------------------------------------
// Portfolio import — read a CSV exported from a brokerage and match its
// holdings/weights onto the RRSP Holdings table above.
// ------------------------------------------------------------------
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function normalizeHeader(h) {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const SYMBOL_HEADERS = ["symbol", "ticker", "security", "securitysymbol", "equitysymbol", "assettype"];
const PERCENT_HEADERS = ["percent", "percentage", "weight", "allocation", "pctofportfolio", "portfoliopercent", "ofportfolio", "allocationpercent"];
const VALUE_HEADERS = ["value", "marketvalue", "amount", "currentvalue", "marketvaluecad", "marketvalueusd", "totalvalue"];

// Sheet names (normalized, no spaces/punctuation) worth trying first in a
// multi-sheet workbook — a Questrade export's "Positions" or per-ticker
// "SecuritiesOwnedSD" sheet holds real holdings; its "Balances" summary
// sheet (always first) and "Allocations..." sheet (asset-class rollups,
// e.g. "ETFs"/"Cash" instead of tickers) do not and should be skipped.
const PREFERRED_SHEET_NAMES = ["positions", "securitiesownedsd", "holdings", "securities"];
const SKIP_SHEET_NAME_PATTERN = /allocation/i;

function findColumn(headers, candidates) {
  const idx = headers.findIndex((h) => candidates.includes(normalizeHeader(h)));
  return idx;
}

// `rows` is a 2D array: rows[0] is the header row, rows[1..] are data rows.
// Cells may be strings (from CSV) or native numbers (from a parsed .xlsx sheet) —
// everything is coerced to a string before pattern-matching, which handles both.
function rowsToHoldings(rows) {
  if (rows.length < 2) throw new Error("That file doesn't look like it has any data rows.");
  const headers = rows[0].map((h) => String(h ?? "").trim());
  const symbolIdx = findColumn(headers, SYMBOL_HEADERS);
  const percentIdx = findColumn(headers, PERCENT_HEADERS);
  const valueIdx = findColumn(headers, VALUE_HEADERS);
  if (symbolIdx === -1) {
    throw new Error('Couldn\'t find a "Symbol" or "Ticker" column in that file.');
  }
  if (percentIdx === -1 && valueIdx === -1) {
    throw new Error('Couldn\'t find a "Value" or "Percent" column in that file.');
  }

  const parsedRows = rows
    .slice(1)
    .map((cols) => {
      const symbol = String(cols[symbolIdx] ?? "").trim();
      const percentRaw = percentIdx !== -1 ? cols[percentIdx] : null;
      const valueRaw = valueIdx !== -1 ? cols[valueIdx] : null;
      return { symbol, percentRaw, valueRaw };
    })
    .filter((r) => r.symbol);

  if (!parsedRows.length) throw new Error("No holdings with a symbol were found in that file.");

  let results;
  if (percentIdx !== -1) {
    results = parsedRows.map((r) => ({
      holding: r.symbol,
      currentPct: parseFloat(String(r.percentRaw ?? "").replace(/[^0-9.\-]/g, "")) || 0,
    }));
  } else {
    const values = parsedRows.map((r) => parseFloat(String(r.valueRaw ?? "").replace(/[^0-9.\-]/g, "")) || 0);
    const total = values.reduce((s, v) => s + v, 0);
    results = parsedRows.map((r, i) => ({
      holding: r.symbol,
      currentPct: total > 0 ? (values[i] / total) * 100 : 0,
    }));
  }
  return results;
}

function csvTextToRows(text) {
  return text.split(/\r?\n/).filter((l) => l.trim().length > 0).map(parseCsvLine);
}

function isExcelFile(file) {
  return /\.(xlsx|xls)$/i.test(file.name);
}

// A brokerage export often bundles several sheets: an account-summary
// sheet (no tickers), the actual per-holding sheet(s), and sometimes an
// asset-class rollup sheet that shares column names with the real one.
// Try the sheets most likely to hold real tickers first, skip known
// rollup sheets, and otherwise scan every sheet in order — returning the
// first one that actually parses into holdings, tagged with its name so
// the result message can say which sheet was used.
function pickHoldingsSheet(workbook) {
  const candidateNames = workbook.SheetNames.filter((n) => !SKIP_SHEET_NAME_PATTERN.test(n));
  const tryNames = [
    ...PREFERRED_SHEET_NAMES.map((pref) => candidateNames.find((n) => normalizeHeader(n) === pref)).filter(Boolean),
    ...candidateNames,
  ];
  const tried = new Set();
  for (const name of tryNames) {
    if (tried.has(name)) continue;
    tried.add(name);
    try {
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, raw: true, blankrows: false });
      const parsed = rowsToHoldings(rows);
      if (parsed.length) return { sheetName: name, parsed };
    } catch {
      // This sheet doesn't have the right columns — try the next one.
    }
  }
  return null;
}

function renderPortfolioImport(panel, acct) {
  const card = el(`
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:220px;">
          <strong>Import into ${escapeHtml(acct.name)}</strong>
          <div class="muted" style="margin-top:2px;">Upload a CSV or Excel file (like Questrade's positions export) with a Symbol column and either a Value or Percent column — it'll match tickers already in ${escapeHtml(acct.name)} and add any new ones. For a multi-sheet workbook, it looks past the account-summary sheet for the one with your actual holdings.</div>
        </div>
        <label class="btn-ghost small" style="cursor:pointer;">
          Choose file
          <input type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" class="import-file-input" style="display:none;" />
        </label>
      </div>
      <div class="import-result muted" style="margin-top:10px;"></div>
    </div>
  `);
  const fileInput = card.querySelector(".import-file-input");
  const resultEl = card.querySelector(".import-result");
  if (lastImportMessage) {
    resultEl.textContent = lastImportMessage;
    lastImportMessage = "";
  }

  function applyParsedHoldings(parsed, sourceNote) {
    let updated = 0;
    let added = 0;
    parsed.forEach((p) => {
      const existing = acct.holdings.find((r) => r.holding.trim().toUpperCase() === p.holding.trim().toUpperCase());
      if (existing) {
        existing.currentPct = Math.round(p.currentPct * 10) / 10;
        updated++;
      } else {
        acct.holdings.push({
          id: nextId(),
          holding: p.holding,
          currentPct: Math.round(p.currentPct * 10) / 10,
          targetPct: null,
          action: null,
          sortOrder: acct.holdings.length,
        });
        added++;
      }
    });
    scheduleSave();
    lastImportMessage = `Updated ${updated} holding${updated === 1 ? "" : "s"} in ${acct.name}, added ${added} new${sourceNote ? ` (from the "${sourceNote}" sheet)` : ""}.`;
    renderInvestments();
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();

    if (isExcelFile(file)) {
      reader.onload = () => {
        try {
          if (!window.XLSX) throw new Error("Excel support didn't load — try a CSV export instead.");
          const workbook = XLSX.read(new Uint8Array(reader.result), { type: "array" });
          if (!workbook.SheetNames.length) throw new Error("That workbook doesn't have any sheets.");
          const best = pickHoldingsSheet(workbook);
          if (!best) {
            throw new Error(
              "Couldn't find a sheet with ticker symbols and a value or percentage in that workbook — checked " +
                workbook.SheetNames.join(", ") +
                "."
            );
          }
          applyParsedHoldings(best.parsed, best.sheetName);
        } catch (err) {
          resultEl.textContent = err.message || "Couldn't read that file.";
        }
      };
      reader.onerror = () => {
        resultEl.textContent = "Couldn't read that file.";
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = () => {
        try {
          applyParsedHoldings(rowsToHoldings(csvTextToRows(String(reader.result))));
        } catch (err) {
          resultEl.textContent = err.message || "Couldn't read that file.";
        }
      };
      reader.onerror = () => {
        resultEl.textContent = "Couldn't read that file.";
      };
      reader.readAsText(file);
    }
  });

  panel.appendChild(card);
}

// Groups this account's holdings by broad asset class, and — for a model
// preset — works out which target each class is measured against
// (handling combined buckets like "US/Global Equity" or a split "Gold" +
// "Commodities" target that both draw on one combined holding).
function buildClassBreakdown(preset, currentByClass) {
  const rows = [];
  const rawToEntry = {};
  Object.entries(preset.targets).forEach(([label, target]) => {
    let current = currentByClass[label] || 0;
    let rawLabels = [label];
    if (label === "US/Global Equity") {
      current = (currentByClass["US Equity"] || 0) + (currentByClass["Intl Equity"] || 0);
      rawLabels = ["US Equity", "Intl Equity"];
    } else if ((label === "Gold" || label === "Commodities") && "Gold" in preset.targets && "Commodities" in preset.targets) {
      current = (currentByClass["Gold & Commodities"] || 0) / 2;
      rawLabels = ["Gold & Commodities"];
    }
    const entry = { label, target, current };
    rows.push(entry);
    rawLabels.forEach((raw) => {
      if (!(raw in rawToEntry)) rawToEntry[raw] = entry;
    });
  });
  return { rows, rawToEntry };
}

function gapLabelFor(current, target) {
  const gap = current - target;
  return Math.abs(gap) < 1 ? "On target" : gap < 0 ? `${Math.abs(gap).toFixed(0)}pt under — add` : `${gap.toFixed(0)}pt over — trim`;
}

// The one holdings table for an account: what you own, how much it's
// worth, and — right alongside it — how it measures up against whichever
// balancer preset is selected above. "Yours" gets an editable per-ticker
// target/action; a model preset gets a read-only class-level target and
// gap, plus a compact class breakdown underneath for the bigger picture.
function renderHoldingsTable(card, acct, preset) {
  if (!acct.holdings.length) {
    card.appendChild(el(`<div class="muted" style="margin-bottom:4px;">No holdings added yet — add one below or import a file.</div>`));
    return;
  }

  const isYours = !preset.targets;
  const currentByClass = {};
  acct.holdings.forEach((r) => {
    const cls = assetClassFor(r.holding);
    currentByClass[cls] = (currentByClass[cls] || 0) + (Number(r.currentPct) || 0);
  });
  const { rows: classRows, rawToEntry } = isYours ? { rows: [], rawToEntry: {} } : buildClassBreakdown(preset, currentByClass);

  const tableWrap = el(`<div class="table-scroll"></div>`);
  const table = el(`
    <table>
      <thead><tr><th>Holding</th><th>Amount</th><th>Current</th><th>${isYours ? "Target" : "Class target"}</th><th>${isYours ? "Action" : "Gap"}</th><th></th></tr></thead>
      <tbody></tbody>
    </table>
  `);
  tableWrap.appendChild(table);
  const tbody = table.querySelector("tbody");

  acct.holdings.forEach((r) => {
    const amount = Number(acct.balance || 0) * ((Number(r.currentPct) || 0) / 100);
    const amountLabel = `$${amount.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`;

    let targetCellHtml, actionCellHtml;
    if (isYours) {
      targetCellHtml = `<input type="text" class="target-input" value="${escapeHtml(r.targetPct || "")}" placeholder="e.g. 50-55%" />`;
      actionCellHtml = `<input type="text" class="action-input" value="${escapeHtml(r.action || "")}" placeholder="e.g. add" />`;
    } else {
      const cls = assetClassFor(r.holding);
      const entry = rawToEntry[cls];
      targetCellHtml = entry ? `${entry.target}% <span class="muted">(${escapeHtml(entry.label)})</span>` : `<span class="muted">— (${escapeHtml(cls)})</span>`;
      actionCellHtml = entry ? `<span class="muted">${gapLabelFor(entry.current, entry.target)}</span>` : `<span class="muted">No target for this class</span>`;
    }

    const tr = el(`
      <tr>
        <td>${escapeHtml(r.holding)}</td>
        <td class="muted">${amountLabel}</td>
        <td><input type="number" step="0.1" class="current-input" value="${r.currentPct ?? ""}" style="width:64px;" />%</td>
        <td>${targetCellHtml}</td>
        <td>${actionCellHtml}</td>
        <td><button class="remove-btn">&times;</button></td>
      </tr>
    `);
    tr.querySelector(".current-input").addEventListener("change", (e) => {
      r.currentPct = parseFloat(e.target.value);
      if (Number.isNaN(r.currentPct)) r.currentPct = null;
      scheduleSave();
      renderInvestments();
    });
    if (isYours) {
      tr.querySelector(".target-input").addEventListener("change", (e) => {
        r.targetPct = e.target.value || null;
        scheduleSave();
      });
      tr.querySelector(".action-input").addEventListener("change", (e) => {
        r.action = e.target.value || null;
        scheduleSave();
      });
    }
    tr.querySelector(".remove-btn").addEventListener("click", () => {
      acct.holdings = acct.holdings.filter((x) => x.id !== r.id);
      scheduleSave();
      renderInvestments();
    });
    tbody.appendChild(tr);
  });
  card.appendChild(tableWrap);

  if (!isYours && classRows.length) {
    card.appendChild(el(`<div class="muted" style="margin:14px 0 6px 0;font-size:12px;">By asset class</div>`));
    const classTableWrap = el(`<div class="table-scroll"></div>`);
    const classTable = el(`
      <table>
        <thead><tr><th>Asset class</th><th>Target</th><th>You hold</th><th>Amount</th><th>Gap</th></tr></thead>
        <tbody></tbody>
      </table>
    `);
    classTableWrap.appendChild(classTable);
    const classBody = classTable.querySelector("tbody");
    classRows.forEach(({ label, target, current }) => {
      const amount = Number(acct.balance || 0) * (current / 100);
      classBody.appendChild(el(`
        <tr>
          <td>${escapeHtml(label)}</td>
          <td>${target}%</td>
          <td>${current.toFixed(0)}%</td>
          <td class="muted">$${amount.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</td>
          <td class="muted">${gapLabelFor(current, target)}</td>
        </tr>
      `));
    });
    card.appendChild(classTableWrap);
  }
}

// ------------------------------------------------------------------
// Bible Reading — grouped by book, collapsible chapter grids
// ------------------------------------------------------------------
function parseBookAndChapter(reading) {
  const m = reading.match(/^(.*\D)\s+(\d+)$/);
  if (!m) return { book: reading, chapter: null };
  return { book: m[1].trim(), chapter: parseInt(m[2], 10) };
}

const OT_BOOKS = new Set([
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
]);
const BIBLE_BOOK_COUNT = 66;
const BIBLE_NT_BOOK_COUNT = BIBLE_BOOK_COUNT - OT_BOOKS.size;

// Lifetime, permanent — books ever fully finished, in the order they were
// finished. Deliberately separate from state.bible's live done/completedDate
// flags so a "Start over" on the reading plan can't erase these. sheet-shaped
// (milestonesEarned + booksEverFinished) so it can go through the same
// buildMilestonesCard() every other practice uses.
const BIBLE_MILESTONES = [
  {
    key: "firstBookFinished",
    label: "First book finished",
    icon: "📗",
    progress: (sheet) => {
      const n = sheet.booksEverFinished.length;
      return { earned: n >= 1, frac: Math.min(1, n / 1), caption: n >= 1 ? sheet.booksEverFinished[0] : "0 of 1" };
    },
  },
  {
    key: "fiveBooksFinished",
    label: "5 books finished",
    icon: "📚",
    progress: (sheet) => {
      const n = sheet.booksEverFinished.length;
      return { earned: n >= 5, frac: Math.min(1, n / 5), caption: `${n} of 5` };
    },
  },
  {
    key: "otFinished",
    label: "Old Testament finished",
    icon: "📜",
    progress: (sheet) => {
      const n = sheet.booksEverFinished.filter((b) => OT_BOOKS.has(b)).length;
      return { earned: n >= OT_BOOKS.size, frac: Math.min(1, n / OT_BOOKS.size), caption: `${n} of ${OT_BOOKS.size} books` };
    },
  },
  {
    key: "ntFinished",
    label: "New Testament finished",
    icon: "✝️",
    progress: (sheet) => {
      const n = sheet.booksEverFinished.filter((b) => !OT_BOOKS.has(b)).length;
      return { earned: n >= BIBLE_NT_BOOK_COUNT, frac: Math.min(1, n / BIBLE_NT_BOOK_COUNT), caption: `${n} of ${BIBLE_NT_BOOK_COUNT} books` };
    },
  },
  {
    key: "wholeBibleFinished",
    label: "Whole Bible finished",
    icon: "🏆",
    progress: (sheet) => {
      const n = sheet.booksEverFinished.length;
      return { earned: n >= BIBLE_BOOK_COUNT, frac: Math.min(1, n / BIBLE_BOOK_COUNT), caption: `${n} of ${BIBLE_BOOK_COUNT} books` };
    },
  },
];

// "all" | "ot" | "nt" — synced from state.bibleTestament at boot.
let bibleTestament = "all";

// Small bookmark glyph for the "jump to where you left off" control —
// an icon so it doesn't cost a whole row of space.
const bookmarkSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"></path></svg>`;

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function renderBiblePace(panel, doneCount, total) {
  const settings = state.bibleSettings;
  const startDate = new Date(settings.startDate + "T00:00:00");
  const today = new Date();
  const daysElapsed = Math.max(1, daysBetween(startDate, today) + 1);
  const pace = doneCount / daysElapsed; // chapters/day so far
  const remaining = total - doneCount;
  const fmt = (d) => d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  let projectedEnd = null;
  if (remaining > 0 && pace > 0) {
    const daysToFinish = Math.ceil(remaining / pace);
    projectedEnd = new Date(today.getTime() + daysToFinish * 86400000);
  }

  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const finishLabel = remaining <= 0 ? "Finished!" : projectedEnd ? fmt(projectedEnd) : "—";

  // Ring replaces the old plain "73%" text, matching the same
  // conic-gradient ring used on Wellness and Home — one visual language
  // for "percent of something done" across the app, per Veronika's
  // walkthrough approval (mockup: bible_and_pattern_mockups.html).
  const card = el(`
    <div class="card bible-pace-card">
      <div class="bible-ring-row">
        <div class="bible-ring" style="background:conic-gradient(var(--accent) ${pct}%, var(--border) ${pct}% 100%);">
          <div class="bible-ring-inner"><div class="bible-ring-pct">${pct}%</div></div>
        </div>
        <div class="bible-ring-caption"><strong>${doneCount} of ${total}</strong> chapters read<br/>Projected finish: <strong>${finishLabel}</strong></div>
      </div>
      <div class="bible-pace-track" title="${doneCount} of ${total} chapters (${pct}%)">
        <div class="bible-pace-track-fill" style="width:${pct}%;"></div>
      </div>
      <div class="bible-pace-mini-row">
        <label class="muted">Start date</label>
        <input type="date" class="bible-start-date" value="${settings.startDate}" />
        <button type="button" class="filler-btn bible-start-over-btn">&#8630; Start over</button>
      </div>
    </div>
  `);
  card.querySelector(".bible-start-date").addEventListener("change", (e) => {
    if (e.target.value) {
      settings.startDate = e.target.value;
      scheduleSave();
      renderBible();
    }
  });
  card.querySelector(".bible-start-over-btn").addEventListener("click", () => {
    confirmModal(
      "Start the reading plan over?",
      "Every chapter goes back to unread and the pace resets from today. Your Milestones below are permanent and won't be affected.",
      "Start over",
      () => {
        state.bible.forEach((r) => {
          r.done = false;
          r.completedDate = null;
        });
        settings.startDate = todayISO();
        scheduleSave();
        renderBible();
      }
    );
  });
  panel.appendChild(card);
}

function renderBible() {
  const panel = document.getElementById("panel-bible");
  const rows = state.bible;
  const total = rows.length;
  const doneCount = rows.filter((r) => r.done).length;

  panel.innerHTML = "";
  renderBiblePace(panel, doneCount, total);

  const books = [];
  const byBook = new Map();
  rows.forEach((r) => {
    const { book, chapter } = parseBookAndChapter(r.reading);
    if (!byBook.has(book)) {
      byBook.set(book, []);
      books.push(book);
    }
    byBook.get(book).push({ ...r, chapter });
  });

  // A book counts as "in progress" once at least one chapter is done but
  // not all of them — the first one, in canonical order, is where a jump
  // link should land, since that's where reading naturally picks back up.
  const firstInProgressBook = books.find((book) => {
    const chapters = byBook.get(book);
    const bookDone = chapters.filter((c) => c.done).length;
    return bookDone > 0 && bookDone < chapters.length;
  });

  const toolbarRow = el(`<div class="view-toggle-row"></div>`);
  const testamentToggle = el(`
    <div class="view-toggle">
      <button data-testament="all" class="${bibleTestament === "all" ? "active" : ""}">All</button>
      <button data-testament="ot" class="${bibleTestament === "ot" ? "active" : ""}">Old Testament</button>
      <button data-testament="nt" class="${bibleTestament === "nt" ? "active" : ""}">New Testament</button>
    </div>
  `);
  testamentToggle.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      bibleTestament = b.dataset.testament;
      state.bibleTestament = bibleTestament;
      scheduleSave();
      renderBible();
    });
  });
  toolbarRow.appendChild(testamentToggle);
  if (firstInProgressBook) {
    const jumpBtn = el(
      `<button type="button" class="icon-btn bible-jump-btn" title="Jump to where you left off — ${escapeHtml(firstInProgressBook)}" aria-label="Jump to where you left off — ${escapeHtml(firstInProgressBook)}">${bookmarkSvg}</button>`
    );
    jumpBtn.addEventListener("click", () => {
      const jumpToTarget = () => {
        const target = panel.querySelector(`.book-group[data-book="${CSS.escape(firstInProgressBook)}"]`);
        if (target) {
          target.open = true;
          state.bibleOpenBooks[firstInProgressBook] = true;
          scheduleSave();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      // If the current filter is hiding that book's testament, switch to
      // "All" first so there's actually something to scroll to.
      const bookIsOT = OT_BOOKS.has(firstInProgressBook);
      if ((bibleTestament === "ot" && !bookIsOT) || (bibleTestament === "nt" && bookIsOT)) {
        bibleTestament = "all";
        state.bibleTestament = bibleTestament;
        scheduleSave();
        renderBible();
        requestAnimationFrame(jumpToTarget);
      } else {
        jumpToTarget();
      }
    });
    toolbarRow.appendChild(jumpBtn);
  }
  panel.appendChild(toolbarRow);

  const visibleBooks = books.filter((book) => {
    if (bibleTestament === "all") return true;
    const isOT = OT_BOOKS.has(book);
    return bibleTestament === "ot" ? isOT : !isOT;
  });

  visibleBooks.forEach((book) => {
    const chapters = byBook.get(book);
    const bookDone = chapters.filter((c) => c.done).length;
    const inProgress = bookDone > 0 && bookDone < chapters.length;
    // Respect whatever she last set by hand — only fall back to
    // auto-opening in-progress books the first time a book is ever seen.
    const remembered = state.bibleOpenBooks[book];
    const shouldOpen = remembered !== undefined ? remembered : inProgress;
    const details = el(`
      <details class="book-group" data-book="${escapeHtml(book)}" ${shouldOpen ? "open" : ""}>
        <summary class="book-summary">
          <span class="book-title">${escapeHtml(book)}</span>
          <span class="muted">${bookDone}/${chapters.length}</span>
        </summary>
        <div class="chapter-grid"></div>
      </details>
    `);
    details.addEventListener("toggle", () => {
      state.bibleOpenBooks[book] = details.open;
      scheduleSave();
    });
    const grid = details.querySelector(".chapter-grid");
    chapters.forEach((c) => {
      const chip = el(`<div class="chapter-chip ${c.done ? "done" : ""}">${c.chapter ?? ""}</div>`);
      chip.addEventListener("click", () => {
        const original = state.bible.find((x) => x.id === c.id);
        original.done = !original.done;
        if (original.done) original.completedDate = todayISO();
        // Lifetime Milestones tracking — check whether this book just
        // became (or is still) fully done, independent of the toggle
        // above so a book can be un-toggled without ever un-recording it.
        if (chapters.every((row) => (state.bible.find((x) => x.id === row.id) || {}).done)) {
          if (!state.bibleBooksEverFinished.includes(book)) state.bibleBooksEverFinished.push(book);
        }
        scheduleSave();
        renderBible();
      });
      grid.appendChild(chip);
    });
    panel.appendChild(details);
  });

  const milestonesSheet = { milestonesEarned: state.bibleMilestonesEarned, booksEverFinished: state.bibleBooksEverFinished };
  panel.appendChild(buildMilestonesCard(milestonesSheet, BIBLE_MILESTONES, todayISO()));
}

// ------------------------------------------------------------------
// Wellness — today's quick entry + recent history
// ------------------------------------------------------------------
function todayISO() {
  // Local calendar date, not UTC — toISOString() rolls over at UTC
  // midnight, which reads as "tomorrow" for anyone west of Greenwich
  // in the evening (e.g. still 9pm Eastern but already past midnight UTC).
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Yes/No fields, color-coded green/muted-red like a sheet's conditional formatting.
const WELLNESS_YESNO_FIELDS = [
  ["movement", "Movement"],
  ["spiritualAnchor", "Spiritual"],
  ["sleepProtected", "Sleep"],
  ["socialConnection", "Social"],
  ["learning", "Learning"],
  ["food", "Food"],
];
// Small enumerated dropdowns, also color-coded.
const WELLNESS_ENUM_FIELDS = {
  cyclePhase: {
    label: "Cycle phase",
    options: [
      { value: "Menstrual", text: "1. Menstrual", title: "Menstrual — your period" },
      { value: "Follicular", text: "2. Follicular", title: "Follicular — after period, energy building" },
      { value: "Ovulatory", text: "3. Ovulatory", title: "Ovulatory — mid-cycle, egg release" },
      { value: "Luteal", text: "4. Luteal", title: "Luteal — after ovulation, before next period" },
    ],
  },
  foodQuality: {
    label: "Food quality",
    options: [
      { value: "Good", text: "Good" },
      { value: "Okay", text: "Okay" },
      { value: "Poor", text: "Poor" },
    ],
  },
};
const WELLNESS_NOTE_FIELDS = [
  ["whatWorked", "What worked?"],
  ["whatHarder", "What made things harder?"],
  ["adjustment", "One adjustment to make"],
];

// Which space(s) "fulfill" each pillar — editable from the "You" page's
// Pillar Mapping screen. Real, not just a label: if you log something
// today in a mapped space, that pillar marks itself done automatically.
// Tapping a pillar on Home still works manually too, for anything a
// mapped space can't see (a trip to church, meditating without logging
// it anywhere) — this is additive, not a replacement for the tap.
// state.pillarSourceMap holds {pillarKey: [sheetId, ...]}.
function pillarSourceLabel(key) {
  const ids = state.pillarSourceMap?.[key] || [];
  const labels = ids
    .map((id) => {
      if (id === "bible") {
        const sheet = state.sheets.find((s) => s.id === "bible" && s.visible);
        return sheet ? sheetLabel(sheet) : null;
      }
      const sheet = state.sheets.find((s) => s.id === id && s.visible);
      return sheet ? sheetLabel(sheet) : null;
    })
    .filter(Boolean);
  return labels.length ? labels.join(", ") : null;
}

// Which spaces actually make sense as a source for a given pillar — curated
// per pillar rather than one generic "any checklist" list, so Movement only
// ever offers Workout Log, Spiritual anchor only ever offers Bible/Quran,
// and Sleep protected / Social connection offer nothing until a space that
// fits them exists. This is deliberately conceptual, not the same as
// "can we detect activity here" (see sheetActiveToday below) — Workout Log
// belongs under Movement even though its week/day data can't yet be
// checked against today's date automatically.
function pillarCandidateSheets(key) {
  const results = [];
  if (key === "spiritualAnchor") {
    const bibleSheet = state.sheets.find((s) => s.id === "bible" && s.visible);
    if (bibleSheet) results.push({ id: "bible", label: sheetLabel(bibleSheet) });
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && (cs.templateKey === "quran" || cs.templateKey === "prayer" || cs.templateKey === "breathe")) results.push({ id: s.id, label: sheetLabel(s) });
    });
  } else if (key === "movement") {
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && (cs.templateKey === "workout" || cs.templateKey === "activity")) results.push({ id: s.id, label: sheetLabel(s) });
    });
  } else if (key === "sleepProtected") {
    const sleepSheet = state.sheets.find((s) => s.id === "sleep" && s.visible);
    if (sleepSheet) results.push({ id: "sleep", label: sheetLabel(sleepSheet) });
  } else if (key === "learning") {
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && cs.templateKey === "books") results.push({ id: s.id, label: sheetLabel(s) });
    });
  } else if (key === "socialConnection") {
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && cs.templateKey === "social") results.push({ id: s.id, label: sheetLabel(s) });
    });
  } else if (key === "food") {
    state.sheets.forEach((s) => {
      if (s.kind !== "custom" || !s.visible) return;
      const cs = state.customSheets[s.id];
      if (cs && cs.templateKey === "mealLog") results.push({ id: s.id, label: sheetLabel(s) });
    });
  }
  return results;
}

// Which pillar (if any) a gallery template belongs to. Used to auto-map
// a newly created space into that pillar's sources at creation time —
// adding a space is already an opt-in, so Pillar Mapping in Settings is
// where you opt back OUT, not where you go to turn it on.
function pillarKeyForTemplateKey(templateKey) {
  if (templateKey === "quran" || templateKey === "prayer" || templateKey === "breathe") return "spiritualAnchor";
  if (templateKey === "workout" || templateKey === "activity") return "movement";
  if (templateKey === "books") return "learning";
  if (templateKey === "social") return "socialConnection";
  if (templateKey === "mealLog") return "food";
  return null;
}

function wellnessColorClass(field, value) {
  if (!value) return "";
  if (field === "foodQuality") return value === "Good" ? "good" : value === "Poor" ? "bad" : "mid";
  if (value === "Yes") return "good";
  if (value === "No") return "bad";
  return "mid"; // cycle phase and anything else: neutral highlight
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// A day counts as "good" for Veronika's Bonus if at least 80% of that
// day's scoreable fields (the Yes/No fields plus food quality) came back
// positive — cycle phase never counts either way since it's information,
// not a good/bad outcome. A day with nothing scoreable logged isn't good
// or bad, it just didn't happen.
function isWellnessDayPositive(entry) {
  if (!entry) return false;
  const classes = [];
  WELLNESS_YESNO_FIELDS.forEach(([k]) => {
    if (entry[k]) classes.push(wellnessColorClass(k, entry[k]));
  });
  if (entry.foodQuality) classes.push(wellnessColorClass("foodQuality", entry.foodQuality));
  const good = classes.filter((c) => c === "good").length;
  const bad = classes.filter((c) => c === "bad").length;
  if (good + bad === 0) return false;
  return good / (good + bad) >= 0.8;
}

// Small "i" glyph for the field-info popups (cycle phase diagram, example
// chips for Food quality / Movement / Spiritual anchor). Kept tiny and
// unobtrusive so it doesn't compete with the field itself.
const infoSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="11" x2="12" y2="16.5"></line><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"></circle></svg>`;
const closeSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg>`;

// What each info popup shows. Cycle phase gets a simple diagram; the
// others get a short list of example answers she gave herself — not a
// strict rulebook, just examples of what tends to count.
const WELLNESS_FIELD_INFO = {
  cyclePhase: { type: "cycle" },
  foodQuality: {
    type: "examples",
    intro: "Not a strict rule — whatever “good” food looks like for you. A few examples:",
    examples: ["Meal prepped", "Protein bowls", "Home-cooked meals", "Balanced plate with veggies"],
  },
  movement: {
    type: "examples",
    intro: "Anything intentional counts. A few examples:",
    examples: ["Strength trained", "Went for a walk", "Yoga or stretching", "A workout class"],
  },
  spiritualAnchor: {
    type: "examples",
    intro: "Whatever grounds you. A few examples:",
    examples: ["Morning devotions", "Meditation", "Church", "Quiet prayer time"],
  },
  sleepProtected: {
    type: "examples",
    intro: "Whatever helps you actually get rest. A few examples:",
    examples: ["In bed by a set time", "No phone before bed", "7+ hours", "Wound down before sleep"],
  },
  socialConnection: {
    type: "examples",
    intro: "Any real connection counts. A few examples:",
    examples: ["Called a friend", "Time with family", "Coffee with someone", "A meaningful conversation"],
  },
};

function infoModal(title, bodyEl) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box">
        <div class="info-modal-header">
          <h3>${escapeHtml(title)}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body"></div>
      </div>
    </div>
  `);
  overlay.querySelector(".info-modal-body").appendChild(bodyEl);
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

function buildExamplesInfoBody(info) {
  const body = el(`<div></div>`);
  body.appendChild(el(`<p class="muted" style="font-size:13px;margin:0 0 12px 0;line-height:1.5;">${escapeHtml(info.intro)}</p>`));
  const list = el(`<div class="example-chip-list"></div>`);
  info.examples.forEach((ex) => {
    list.appendChild(el(`<span class="example-chip">${escapeHtml(ex)}</span>`));
  });
  body.appendChild(list);
  return body;
}

// A simplified 28-day cycle timeline — four segments sized roughly to
// how many days each phase tends to span, with a short plain-language
// description under each. Illustrative, not medical guidance.
// fertility is a static label for this generic 28-day reference guide
// only — the real full screen computes its own fertility line per day
// from her actual averages (see cycleFertilityForDay), which can land a
// little differently than this general picture. Both say the same
// thing in spirit: fertility rises through late follicular, peaks
// across ovulation, then drops off in luteal.
const CYCLE_PHASE_INFO = [
  { key: "menstrual", label: "1. Menstrual", days: "Days 1–5", flex: 5, desc: "Your period. Energy is often lowest here — a natural time to rest more.", fertility: "Low chance of pregnancy" },
  { key: "follicular", label: "2. Follicular", days: "Days 6–13", flex: 8, desc: "After your period. Energy tends to build as estrogen rises.", fertility: "Rising toward the end of this phase" },
  { key: "ovulatory", label: "3. Ovulatory", days: "~Day 14", flex: 2, desc: "Mid-cycle. Often the highest-energy window, around when an egg is released.", fertility: "High chance of pregnancy" },
  { key: "luteal", label: "4. Luteal", days: "Days 15–28", flex: 13, desc: "After ovulation, before your next period. Energy gradually tapers; PMS symptoms can show up toward the end.", fertility: "Low chance of pregnancy" },
];

// activeValue (e.g. "Ovulatory") highlights that phase's card — used by
// the Cycle tab's "See all phases" link (see renderCyclePanel) so the
// diagram doubles as a "here's where the prediction places you"
// reminder, not just reference material. Omitted entirely for the
// plain info-popup use (openFieldInfo), which has nothing to highlight.
// onSelectPhase used to be how the old daily quick-log sheet let you tap
// a card to log that phase directly; Cycle no longer logs a phase by
// hand at all (see cyclePhaseForDay/cycleTodayInfo — it's predicted from
// logged period dates instead), so nothing currently passes this, but
// the parameter stays since the cards were built to double as tap
// targets and there's no reason to lose that.
function buildCyclePhaseInfoBody(activeValue, onSelectPhase) {
  const body = el(`<div></div>`);
  body.appendChild(el(`<p class="muted" style="font-size:13px;margin:0 0 14px 0;line-height:1.5;">A general guide to a typical 28-day cycle — yours may run shorter, longer, or less predictably, and that's normal.</p>`));
  const track = el(`<div class="cycle-phase-track"></div>`);
  CYCLE_PHASE_INFO.forEach((p) => {
    track.appendChild(el(`<div class="cycle-phase-seg cycle-phase-${p.key}" style="flex:${p.flex};"></div>`));
  });
  body.appendChild(track);
  const cards = el(`<div class="cycle-phase-cards"></div>`);
  CYCLE_PHASE_INFO.forEach((p) => {
    const isActive = activeValue && p.label.toLowerCase().includes(activeValue.toLowerCase());
    const card = el(`
      <div class="cycle-phase-card${isActive ? " active" : ""}${onSelectPhase ? " tappable" : ""}">
        <div class="cycle-phase-card-dot cycle-phase-${p.key}"></div>
        <div class="cycle-phase-card-body">
          <div class="cycle-phase-card-title">${escapeHtml(p.label)} <span class="muted" style="font-weight:400;">&middot; ${escapeHtml(p.days)}</span></div>
          <div class="cycle-phase-card-desc">${escapeHtml(p.desc)}</div>
          <div class="cycle-phase-card-fertility cyc-fertility-${p.key === "ovulatory" ? "high" : p.key === "follicular" ? "medium" : "low"}">${escapeHtml(p.fertility)}</div>
        </div>
        ${onSelectPhase ? `<div class="cycle-phase-card-tap">${isActive ? "Logged" : "Tap to log"}</div>` : ""}
      </div>
    `);
    if (onSelectPhase) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", () => onSelectPhase(p.label.replace(/^\d+\.\s*/, "")));
    }
    cards.appendChild(card);
  });
  body.appendChild(cards);
  body.appendChild(el(`<p class="muted" style="font-size:12px;margin:14px 0 0 0;line-height:1.5;">General education, not medical advice. If your cycle has been changing a lot, that's worth mentioning to your doctor.</p>`));
  return body;
}

function openFieldInfo(field, label) {
  const info = WELLNESS_FIELD_INFO[field];
  if (!info) return;
  if (info.type === "cycle") {
    infoModal(label, buildCyclePhaseInfoBody());
  } else if (info.type === "examples") {
    infoModal(label, buildExamplesInfoBody(info));
  }
}

function wellnessSelect(field, label, options, currentValue, onChange) {
  const wrap = el(`<div></div>`);
  const labelRow = el(`<div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;"><label class="muted" style="font-size:11px;">${label}</label></div>`);
  if (WELLNESS_FIELD_INFO[field]) {
    const infoBtn = el(`<button type="button" class="field-info-btn" aria-label="What does ${escapeHtml(label)} mean?" title="What does ${escapeHtml(label)} mean?">${infoSvg}</button>`);
    infoBtn.addEventListener("click", () => openFieldInfo(field, label));
    labelRow.appendChild(infoBtn);
  }
  wrap.appendChild(labelRow);
  const select = document.createElement("select");
  select.className = `wellness-select ${wellnessColorClass(field, currentValue)}`;
  select.appendChild(el(`<option value="">—</option>`));
  options.forEach((opt) => {
    const value = typeof opt === "string" ? opt : opt.value;
    const text = typeof opt === "string" ? opt : opt.text;
    const title = typeof opt === "object" && opt.title ? opt.title : text;
    select.appendChild(
      el(`<option value="${escapeHtml(value)}" title="${escapeHtml(title)}" ${value === currentValue ? "selected" : ""}>${escapeHtml(text)}</option>`)
    );
  });
  const syncTitle = () => {
    const selectedOption = select.options[select.selectedIndex];
    select.title = selectedOption ? selectedOption.title : "";
  };
  select.addEventListener("change", () => {
    select.className = `wellness-select ${wellnessColorClass(field, select.value)}`;
    syncTitle();
    onChange(select.value || null);
  });
  syncTitle();
  wrap.appendChild(select);
  return wrap;
}

// Attaches the "what did you do" field under a pillar's Yes/No select —
// shared by Today's card and the day editor, since a correction made
// after the fact deserves the exact same detail a same-day quick-log
// gets. Only meaningful while the pillar reads Yes; the caller wires
// show/hide and clearing the record on a flip to No.
function attachPillarActivityField(fieldWrap, key, dateStr) {
  const activity = pillarActivityFor(key, dateStr);
  const activityWrap = el(`
    <div class="wde-activity-wrap">
      <input type="text" class="wde-activity-input" placeholder="What did you do? (optional)" list="wde-activity-list-${key}-${dateStr}" value="${escapeHtml(activity?.label || "")}" />
      <datalist id="wde-activity-list-${key}-${dateStr}">${pillarManualLabelHistory(key)
        .map((h) => `<option value="${escapeHtml(h)}"></option>`)
        .join("")}</datalist>
    </div>
  `);
  activityWrap.querySelector(".wde-activity-input").addEventListener("change", (e) => {
    setPillarActivity(key, dateStr, e.target.value.trim(), "manual");
    scheduleSave();
  });
  fieldWrap.appendChild(activityWrap);
  return activityWrap;
}

// Finds today's wellness log, creating a blank one if this is the first
// touch of the day. Shared by the Wellness page and Home's pillar tiles so
// both are always reading and writing the exact same row.
function ensureTodaysWellnessEntry(today) {
  let entry = state.wellness.find((l) => l.logDate === today);
  if (!entry) {
    entry = { id: nextId(), logDate: today };
    state.wellness.push(entry);
  }
  return entry;
}

// ------------------------------------------------------------------
// Sleep — a wind-down check-in the night before, a quick quality log the
// next morning, and (once there's enough real data) a trend report that
// looks for patterns across the two. The two halves merge into one
// "night" record keyed by the evening's date; a missed night just means
// that date has no record, it never resets the count toward unlocking
// the report. Once 10 nights are logged the report turns on and keeps
// recomputing over a rolling window, so it's a living read on current
// habits, not a one-time reward.
// ------------------------------------------------------------------
const SLEEP_MOOD_META = {
  calm: { emoji: "😌", label: "Calm" },
  woundup: { emoji: "😕", label: "Wound up" },
  anxious: { emoji: "😟", label: "Anxious" },
};
const SLEEP_QUALITY_META = {
  rough: { emoji: "😩", label: "Rough", score: 1 },
  okay: { emoji: "😌", label: "Okay", score: 2 },
  great: { emoji: "😴", label: "Great", score: 3 },
};
const SLEEP_HABITS = [
  ["noCaffeine", "No caffeine after 2pm"],
  ["phoneOff", "Phone off by target time"],
  ["noAlcohol", "No alcohol tonight"],
];
const SLEEP_NIGHTS_TO_UNLOCK = 10;
const SLEEP_TREND_WINDOW = 30;

// A night only counts as "protected" if it actually held up — enough hours
// against her own target, and not a night she rated Rough even if the
// hours were technically there (insomnia, restless sleep). The habit flags
// (caffeine, phone, alcohol) are never part of this check directly; they're
// the inputs the trend report correlates against this outcome, not the
// outcome itself.
function sleepNightProtected(entry) {
  if (!entry || !entry.am || entry.am.quality == null || entry.am.hours == null) return false;
  const target = state.sleepSettings?.targetHours || 7;
  return entry.am.quality !== "rough" && entry.am.hours >= target;
}

// Real record for a given night's date — creates it in state the first
// time something is actually saved against it. Never call this just to
// read a value; use sleepPeek for that, so opening the tab doesn't
// silently write empty draft entries into state.
function sleepEntryForDate(dateStr) {
  let entry = state.sleepLogs.find((e) => e.date === dateStr);
  if (!entry) {
    entry = { id: nextId(), date: dateStr, pm: null, am: null };
    state.sleepLogs.push(entry);
  }
  return entry;
}

// Read-only look at a night's date for rendering — returns a blank shape
// if nothing's been saved yet, without creating anything.
function sleepPeek(dateStr) {
  return state.sleepLogs.find((e) => e.date === dateStr) || { date: dateStr, pm: null, am: null };
}

// A "logged night" is one with a completed morning entry — that's the
// data point the progress counter and trend report both run on.
function sleepLoggedNights() {
  return state.sleepLogs
    .filter((e) => e.am && e.am.completedDate)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Best-ever run of consecutive protected nights, recomputed from the full
// history each time rather than tracked live — framed as "something to
// celebrate" per her request, not a streak that can lapse. No live streak
// chip on Sleep; this is the only streak-shaped thing shown here.
function computeLongestSleepProtectedStreak() {
  const dates = state.sleepLogs
    .filter((e) => sleepNightProtected(e))
    .map((e) => e.date)
    .sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  dates.forEach((d) => {
    current = prev && addDays(prev, 1) === d ? current + 1 : 1;
    longest = Math.max(longest, current);
    prev = d;
  });
  return longest;
}
const SLEEP_MILESTONES = [
  {
    key: "night3",
    label: "3-night sleep streak",
    icon: "🌙",
    progress: () => {
      const n = computeLongestSleepProtectedStreak();
      return { earned: n >= 3, frac: Math.min(1, n / 3), caption: `Best: ${n} of 3` };
    },
  },
  {
    key: "night7",
    label: "7-night sleep streak",
    icon: "🌟",
    progress: () => {
      const n = computeLongestSleepProtectedStreak();
      return { earned: n >= 7, frac: Math.min(1, n / 7), caption: `Best: ${n} of 7` };
    },
  },
  {
    key: "night10",
    label: "10-night sleep streak",
    icon: "🏅",
    progress: () => {
      const n = computeLongestSleepProtectedStreak();
      return { earned: n >= 10, frac: Math.min(1, n / 10), caption: `Best: ${n} of 10` };
    },
  },
  {
    key: "night14",
    label: "14-night sleep streak",
    icon: "🏆",
    progress: () => {
      const n = computeLongestSleepProtectedStreak();
      return { earned: n >= 14, frac: Math.min(1, n / 14), caption: `Best: ${n} of 14` };
    },
  },
];

// Plain-language patterns over the most recent logged nights (capped at
// SLEEP_TREND_WINDOW so it stays a read on current habits, not a lifetime
// average). Returns null until there's enough data to say anything real;
// each individual insight only appears once there's enough of a sample
// on both sides of it to be worth mentioning.
function computeSleepTrend() {
  const nights = sleepLoggedNights();
  if (nights.length < SLEEP_NIGHTS_TO_UNLOCK) return null;
  const windowNights = nights.slice(0, SLEEP_TREND_WINDOW);
  const protectedCount = windowNights.filter((n) => sleepNightProtected(n)).length;
  const insights = [];

  const noCaffNights = windowNights.filter((n) => n.pm && n.pm.noCaffeine);
  if (noCaffNights.length >= 3) {
    const greatCount = noCaffNights.filter((n) => n.am.quality === "great").length;
    insights.push({
      icon: "☕",
      tone: "good",
      text: `Nights with <b>no late caffeine</b>, you slept "Great" <b>${greatCount} of ${noCaffNights.length}</b> times`,
      pct: Math.round((greatCount / noCaffNights.length) * 100),
    });
  }

  const withMovementFlag = windowNights.map((n) => ({
    n,
    moved: state.wellness.find((w) => w.logDate === n.date)?.movement === "Yes",
  }));
  const movedNights = withMovementFlag.filter((x) => x.moved);
  const restNights = withMovementFlag.filter((x) => !x.moved);
  if (movedNights.length >= 3 && restNights.length >= 3) {
    const avgScore = (arr) => arr.reduce((s, x) => s + SLEEP_QUALITY_META[x.n.am.quality].score, 0) / arr.length;
    const movedAvg = avgScore(movedNights);
    const restAvg = avgScore(restNights);
    if (restAvg > 0) {
      const diffPct = Math.round(((movedAvg - restAvg) / restAvg) * 100);
      if (Math.abs(diffPct) >= 5) {
        insights.push({
          icon: "🧘",
          tone: diffPct >= 0 ? "good" : "bad",
          text:
            diffPct >= 0
              ? `Sleep quality was <b>${diffPct}% higher</b> the night after you moved`
              : `Sleep quality was <b>${Math.abs(diffPct)}% lower</b> the night after you moved`,
          pct: Math.min(100, Math.abs(diffPct) + 40),
        });
      }
    }
  }

  const anxiousNights = windowNights.filter((n) => n.pm && n.pm.mood === "anxious" && n.am.hours != null);
  const calmerNights = windowNights.filter((n) => (!n.pm || n.pm.mood !== "anxious") && n.am.hours != null);
  if (anxiousNights.length >= 3 && calmerNights.length >= 3) {
    const avgHours = (arr) => arr.reduce((s, x) => s + x.am.hours, 0) / arr.length;
    const diff = avgHours(calmerNights) - avgHours(anxiousNights);
    if (Math.abs(diff) >= 0.3) {
      insights.push({
        icon: "😟",
        tone: "bad",
        text: `On "Anxious" nights, you slept about <b>${diff.toFixed(1)} fewer hours</b> on average`,
        pct: Math.min(100, Math.round(Math.abs(diff) * 30) + 30),
      });
    }
  }

  return { basedOn: windowNights.length, protectedCount, insights };
}

// Once today's wind-down or last night's log is saved, the card collapses
// to a one-line summary instead of staying open as a full form someone
// might mistake for unfinished — tapping it re-expands for editing. Plain
// in-memory flags, not persisted, same pattern as Home's "Your Spaces"
// collapse: they just reset to collapsed-by-default each fresh session.
let sleepPmExpanded = false;
let sleepAmExpanded = false;

function renderSleepWindDownCollapsed(pm, onExpand) {
  const moodMeta = SLEEP_MOOD_META[pm.mood];
  const row = el(`
    <button type="button" class="card sleep-card sleep-collapsed-row">
      <span class="sleep-collapsed-emoji">${moodMeta ? moodMeta.emoji : "🌙"}</span>
      <span class="sleep-collapsed-text">
        <span class="sleep-collapsed-title">Wind Down &mdash; Tonight</span>
        <span class="sleep-collapsed-sub">${moodMeta ? moodMeta.label + " &middot; " : ""}Saved for tonight</span>
      </span>
      <span class="sleep-collapsed-chevron">${chevronSvg}</span>
    </button>
  `);
  row.addEventListener("click", onExpand);
  return row;
}

function renderSleepMorningCollapsed(am, onExpand) {
  const qualityMeta = SLEEP_QUALITY_META[am.quality];
  const isProtected = sleepNightProtected({ am });
  const row = el(`
    <button type="button" class="card sleep-card sleep-collapsed-row">
      <span class="sleep-collapsed-emoji">${qualityMeta ? qualityMeta.emoji : "😴"}</span>
      <span class="sleep-collapsed-text">
        <span class="sleep-collapsed-title">How was last night?</span>
        <span class="sleep-collapsed-sub">${qualityMeta ? qualityMeta.label + " &middot; " : ""}${am.hours} hrs &middot; ${
    isProtected ? "Protected" : "Below target"
  }</span>
      </span>
      <span class="sleep-collapsed-chevron">${chevronSvg}</span>
    </button>
  `);
  row.addEventListener("click", onExpand);
  return row;
}

function renderSleepWindDownCard(today) {
  const view = sleepPeek(today);
  const pm = view.pm || { mood: null, note: "", noCaffeine: false, phoneOff: false, noAlcohol: false, completedDate: null };
  const isSaved = pm.completedDate === today;

  const withPm = (mutate) => {
    const entry = sleepEntryForDate(today);
    entry.pm ||= { mood: null, note: "", noCaffeine: false, phoneOff: false, noAlcohol: false, completedDate: null };
    mutate(entry.pm);
    scheduleSave();
    return entry.pm;
  };

  const card = el(`<div class="card sleep-card"></div>`);
  card.appendChild(el(`<strong>Wind Down &mdash; Tonight</strong>`));
  card.appendChild(el(`<div class="muted" style="font-size:12px;margin:2px 0 10px;">${escapeHtml(today)}</div>`));
  card.appendChild(el(`<div class="muted" style="font-size:12px;font-weight:600;margin-bottom:8px;">How are you feeling right now?</div>`));

  const moodRow = el(`<div class="sleep-mood-row"></div>`);
  Object.entries(SLEEP_MOOD_META).forEach(([key, meta]) => {
    const btn = el(
      `<button type="button" class="sleep-mood-choice${pm.mood === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
    );
    btn.addEventListener("click", () => {
      withPm((p) => (p.mood = key));
      renderSleep();
    });
    moodRow.appendChild(btn);
  });
  card.appendChild(moodRow);

  const noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.className = "sleep-note-input";
  noteInput.placeholder = "What's on your mind? (optional)";
  noteInput.value = pm.note || "";
  noteInput.addEventListener("change", () => withPm((p) => (p.note = noteInput.value)));
  card.appendChild(noteInput);

  card.appendChild(
    el(
      `<div class="muted" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:12px 0 6px;">Tonight's habits</div>`
    )
  );
  SLEEP_HABITS.forEach(([key, label]) => {
    const row = el(`<label class="sleep-habit-row"><span class="sleep-habit-check${pm[key] ? " on" : ""}"></span> ${escapeHtml(label)}</label>`);
    row.addEventListener("click", (e) => {
      e.preventDefault();
      withPm((p) => (p[key] = !p[key]));
      renderSleep();
    });
    card.appendChild(row);
  });

  const saveBtn = el(`<button type="button" class="sleep-save-btn">${isSaved ? "Update tonight's wind-down" : "Start wind-down"}</button>`);
  saveBtn.addEventListener("click", () => {
    withPm((p) => (p.completedDate = today));
    sleepPmExpanded = false;
    renderSleep();
  });
  card.appendChild(saveBtn);
  if (isSaved) card.appendChild(el(`<div class="sleep-saved-note">Saved for tonight</div>`));
  return card;
}

function renderSleepMorningCard(nightDate, today) {
  const view = sleepPeek(nightDate);
  const am = view.am || { quality: null, hours: 7, completedDate: null };
  const isSaved = am.completedDate === today;

  const withAm = (mutate) => {
    const entry = sleepEntryForDate(nightDate);
    entry.am ||= { quality: null, hours: 7, completedDate: null };
    mutate(entry.am);
    scheduleSave();
    return entry.am;
  };

  const card = el(`<div class="card sleep-card"></div>`);
  card.appendChild(el(`<strong>How was last night?</strong>`));
  card.appendChild(el(`<div class="muted" style="font-size:12px;margin:2px 0 10px;">${escapeHtml(nightDate)}</div>`));

  const qualityRow = el(`<div class="sleep-mood-row"></div>`);
  Object.entries(SLEEP_QUALITY_META).forEach(([key, meta]) => {
    const btn = el(
      `<button type="button" class="sleep-mood-choice${am.quality === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
    );
    btn.addEventListener("click", () => {
      withAm((a) => (a.quality = key));
      renderSleep();
    });
    qualityRow.appendChild(btn);
  });
  card.appendChild(qualityRow);

  const hoursRow = el(`
    <div class="sleep-hours-row">
      <div><div class="muted" style="font-size:11px;">Hours slept</div><div class="sleep-hours-big">${am.hours}</div></div>
      <div class="sleep-stepper"><button type="button" data-dir="-1">&minus;</button><button type="button" data-dir="1">+</button></div>
    </div>
  `);
  hoursRow.querySelectorAll("button[data-dir]").forEach((b) => {
    b.addEventListener("click", () => {
      withAm((a) => {
        a.hours = Math.max(0, Math.min(14, Math.round((a.hours + Number(b.dataset.dir) * 0.25) * 4) / 4));
      });
      renderSleep();
    });
  });
  card.appendChild(hoursRow);

  if (am.quality != null) {
    const isProtected = sleepNightProtected({ am });
    card.appendChild(
      el(`
        <div class="sleep-target-feedback ${isProtected ? "good" : "bad"}">
          ${
            isProtected
              ? "Meets your sleep target"
              : `Short of your ${state.sleepSettings.targetHours}hr target${am.quality === "rough" ? " &mdash; rated Rough" : ""}`
          }
        </div>
      `)
    );
  }

  const dayEntry = state.wellness.find((w) => w.logDate === nightDate);
  if (dayEntry?.movement === "Yes") {
    card.appendChild(el(`<div class="sleep-autodetect-chip"><span class="sleep-chip-tick">&#10003;</span> Auto-detected: you moved that day</div>`));
  }

  const saveBtn = el(`<button type="button" class="sleep-save-btn">${isSaved ? "Update last night" : "Save last night"}</button>`);
  saveBtn.addEventListener("click", () => {
    if (am.quality == null) return;
    withAm((a) => (a.completedDate = today));
    sleepAmExpanded = false;
    renderSleep();
  });
  card.appendChild(saveBtn);
  if (isSaved) card.appendChild(el(`<div class="sleep-saved-note">Saved</div>`));
  return card;
}

function renderSleepProgressCard() {
  const count = sleepLoggedNights().length;
  const remaining = SLEEP_NIGHTS_TO_UNLOCK - count;
  const card = el(`<div class="sleep-progress-card"></div>`);
  card.appendChild(el(`<div class="sleep-progress-label">${count} of ${SLEEP_NIGHTS_TO_UNLOCK} nights logged</div>`));
  const dots = el(`<div class="sleep-progress-dots"></div>`);
  for (let i = 0; i < SLEEP_NIGHTS_TO_UNLOCK; i++) {
    dots.appendChild(el(`<span class="${i < count ? "done" : ""}"></span>`));
  }
  card.appendChild(dots);
  card.appendChild(el(`<div class="sleep-progress-sub">${remaining} more night${remaining === 1 ? "" : "s"} and your trend report unlocks</div>`));
  return card;
}

function renderSleepTrendCard(trend) {
  const wrap = el(`<div></div>`);
  const hero = el(`
    <div class="sleep-report-hero">
      <div class="sleep-report-label">Based on your last ${trend.basedOn} nights</div>
      <h3>You protected your sleep on ${trend.protectedCount} of ${trend.basedOn} nights</h3>
      <div class="sleep-report-sub">Refreshes every night &mdash; nothing to unlock again</div>
    </div>
  `);
  wrap.appendChild(hero);
  if (!trend.insights.length) {
    wrap.appendChild(el(`<div class="account-note">No strong patterns yet — keep logging and this will fill in.</div>`));
  }
  trend.insights.forEach((ins) => {
    wrap.appendChild(
      el(`
        <div class="sleep-insight-card">
          <div class="sleep-insight-top">
            <span class="sleep-insight-ic ${ins.tone}">${ins.icon}</span>
            <div class="sleep-insight-text">${ins.text}</div>
          </div>
          <div class="sleep-bar-track"><div class="sleep-bar-fill ${ins.tone}" style="width:${ins.pct}%;"></div></div>
        </div>
      `)
    );
  });
  return wrap;
}

function renderSleepHistory(panel) {
  const nights = sleepLoggedNights().slice(0, 14).reverse();
  if (!nights.length) return;
  panel.appendChild(
    el(
      `<div class="muted" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:16px 0 8px;">Recent nights &mdash; tap to edit</div>`
    )
  );
  const row = el(`<div class="sleep-dot-cal"></div>`);
  nights.forEach((n) => {
    const tone = n.am.quality === "great" ? "good" : n.am.quality === "rough" ? "bad" : "mid";
    const dot = el(
      `<button type="button" class="sleep-dot ${tone}" title="${escapeHtml(n.date)} — ${SLEEP_QUALITY_META[n.am.quality]?.label || ""}"></button>`
    );
    dot.addEventListener("click", () => openSleepNightEditor(n.date));
    row.appendChild(dot);
  });
  panel.appendChild(row);
}

// A single night's full record, editable regardless of date — the inline
// cards on the tab only ever expose tonight and last night, so this is
// the only way to go back and fix an older night (a typo'd hours value,
// a quality picked in a hurry) the same way Wellness's day editor already
// lets you correct any past day.
function openSleepNightEditor(dateStr) {
  const entry = sleepEntryForDate(dateStr);
  entry.pm ||= { mood: null, note: "", noCaffeine: false, phoneOff: false, noAlcohol: false, completedDate: null };
  entry.am ||= { quality: null, hours: 7, completedDate: null };

  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box sleep-editor-box">
        <div class="info-modal-header">
          <h3>${escapeHtml(dateStr)}</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body">
          <div class="sleep-editor-section-label">Evening</div>
          <div class="sleep-editor-mood-row"></div>
          <input class="sleep-note-input sleep-editor-note" type="text" placeholder="What's on your mind? (optional)" />
          <div class="sleep-editor-habits"></div>
          <div class="sleep-editor-section-label" style="margin-top:16px;">Morning</div>
          <div class="sleep-editor-quality-row"></div>
          <div class="sleep-editor-hours-row"></div>
          <div class="sleep-editor-feedback"></div>
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button type="button" class="btn-primary sleep-editor-done" style="padding:8px 18px;border-radius:8px;border:none;">Done</button>
          </div>
        </div>
      </div>
    </div>
  `);

  const moodRow = overlay.querySelector(".sleep-editor-mood-row");
  const renderMoodRow = () => {
    moodRow.innerHTML = "";
    Object.entries(SLEEP_MOOD_META).forEach(([key, meta]) => {
      const btn = el(
        `<button type="button" class="sleep-mood-choice${entry.pm.mood === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
      );
      btn.addEventListener("click", () => {
        entry.pm.mood = key;
        scheduleSave();
        renderMoodRow();
      });
      moodRow.appendChild(btn);
    });
  };
  renderMoodRow();

  const noteInput = overlay.querySelector(".sleep-editor-note");
  noteInput.value = entry.pm.note || "";
  noteInput.addEventListener("change", () => {
    entry.pm.note = noteInput.value;
    scheduleSave();
  });

  const habitsWrap = overlay.querySelector(".sleep-editor-habits");
  const renderHabits = () => {
    habitsWrap.innerHTML = "";
    SLEEP_HABITS.forEach(([key, label]) => {
      const row = el(
        `<label class="sleep-habit-row"><span class="sleep-habit-check${entry.pm[key] ? " on" : ""}"></span> ${escapeHtml(label)}</label>`
      );
      row.addEventListener("click", (e) => {
        e.preventDefault();
        entry.pm[key] = !entry.pm[key];
        scheduleSave();
        renderHabits();
      });
      habitsWrap.appendChild(row);
    });
  };
  renderHabits();

  const qualityRow = overlay.querySelector(".sleep-editor-quality-row");
  const feedbackWrap = overlay.querySelector(".sleep-editor-feedback");
  const renderFeedback = () => {
    feedbackWrap.innerHTML = "";
    if (entry.am.quality == null) return;
    const isProtected = sleepNightProtected(entry);
    feedbackWrap.appendChild(
      el(`
        <div class="sleep-target-feedback ${isProtected ? "good" : "bad"}">
          ${
            isProtected
              ? "Meets your sleep target"
              : `Short of your ${state.sleepSettings.targetHours}hr target${entry.am.quality === "rough" ? " &mdash; rated Rough" : ""}`
          }
        </div>
      `)
    );
  };
  const renderQualityRow = () => {
    qualityRow.innerHTML = "";
    Object.entries(SLEEP_QUALITY_META).forEach(([key, meta]) => {
      const btn = el(
        `<button type="button" class="sleep-mood-choice${entry.am.quality === key ? " sel" : ""}"><span class="emoji">${meta.emoji}</span><span class="lbl">${meta.label}</span></button>`
      );
      btn.addEventListener("click", () => {
        entry.am.quality = key;
        scheduleSave();
        renderQualityRow();
        renderFeedback();
      });
      qualityRow.appendChild(btn);
    });
  };
  renderQualityRow();

  const hoursRow = overlay.querySelector(".sleep-editor-hours-row");
  const renderHoursRow = () => {
    hoursRow.innerHTML = "";
    hoursRow.appendChild(
      el(`
        <div class="sleep-hours-row">
          <div><div class="muted" style="font-size:11px;">Hours slept</div><div class="sleep-hours-big">${entry.am.hours}</div></div>
          <div class="sleep-stepper"><button type="button" data-dir="-1">&minus;</button><button type="button" data-dir="1">+</button></div>
        </div>
      `)
    );
    hoursRow.querySelectorAll("button[data-dir]").forEach((b) => {
      b.addEventListener("click", () => {
        entry.am.hours = Math.max(0, Math.min(14, Math.round((entry.am.hours + Number(b.dataset.dir) * 0.25) * 4) / 4));
        scheduleSave();
        renderHoursRow();
        renderFeedback();
      });
    });
  };
  renderHoursRow();
  renderFeedback();

  const close = () => {
    // Only counts as a real, dated entry once there's actually a quality
    // logged — an editor opened and closed without picking anything
    // shouldn't leave a phantom completedDate behind.
    if (entry.am.quality != null) entry.am.completedDate = entry.am.completedDate || dateStr;
    if (entry.pm.mood != null || entry.pm.note || entry.pm.noCaffeine || entry.pm.phoneOff || entry.pm.noAlcohol) {
      entry.pm.completedDate = entry.pm.completedDate || dateStr;
    }
    scheduleSave();
    overlay.remove();
    renderSleep();
  };
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.querySelector(".sleep-editor-done").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

// Floor at 5 hours — below that isn't really a "target" worth
// protecting anymore. Rather than silently refusing the tap with no
// feedback, the minus button explains why it stopped once it's there.
const SLEEP_TARGET_MIN = 5;
const SLEEP_TARGET_MAX = 11;
function renderSleepTargetControl() {
  const wrap = el(`<div class="sleep-target-wrap"></div>`);
  const row = el(`<div class="sleep-target-row"></div>`);
  row.appendChild(el(`<span class="muted" style="font-size:12px;">Your target</span>`));
  const big = el(`<span class="sleep-target-value">${state.sleepSettings.targetHours}</span>`);
  row.appendChild(big);
  row.appendChild(el(`<span class="muted" style="font-size:12px;">hrs a night</span>`));
  const stepper = el(`<div class="sleep-stepper"><button type="button" data-dir="-1">&minus;</button><button type="button" data-dir="1">+</button></div>`);
  const warning = el(`<div class="sleep-target-warning" style="display:none;">${SLEEP_TARGET_MIN} hours is as low as this goes — anything less isn't much of a target to protect.</div>`);
  stepper.querySelectorAll("button[data-dir]").forEach((b) => {
    b.addEventListener("click", () => {
      const dir = Number(b.dataset.dir);
      if (dir < 0 && state.sleepSettings.targetHours <= SLEEP_TARGET_MIN) {
        warning.style.display = "block";
        return;
      }
      const next = Math.round((state.sleepSettings.targetHours + dir * 0.5) * 2) / 2;
      state.sleepSettings.targetHours = Math.max(SLEEP_TARGET_MIN, Math.min(SLEEP_TARGET_MAX, next));
      state.sleepSettings.updatedAt = Date.now();
      warning.style.display = "none";
      scheduleSave();
      renderSleep();
    });
  });
  row.appendChild(stepper);
  wrap.appendChild(row);
  wrap.appendChild(warning);
  return wrap;
}

function renderSleep() {
  const panel = document.getElementById("panel-sleep");
  if (!panel) return;
  panel.innerHTML = "";
  const today = todayISO();
  const yesterday = addDays(today, -1);
  panel.appendChild(el(`<h2 class="section-title serif">Sleep</h2>`));
  panel.appendChild(renderSleepTargetControl());

  // Last night leads — it's the pending thing waiting on you when you open
  // the tab (usually in the morning), while tonight's wind-down is for
  // later. Seeing "plan for tonight" above "you never logged last night"
  // read backwards.
  const amView = sleepPeek(yesterday);
  const amSavedToday = amView.am?.completedDate === today;
  if (amSavedToday && !sleepAmExpanded) {
    panel.appendChild(renderSleepMorningCollapsed(amView.am, () => { sleepAmExpanded = true; renderSleep(); }));
  } else {
    panel.appendChild(renderSleepMorningCard(yesterday, today));
  }

  const pmView = sleepPeek(today);
  const pmSavedToday = pmView.pm?.completedDate === today;
  if (pmSavedToday && !sleepPmExpanded) {
    panel.appendChild(renderSleepWindDownCollapsed(pmView.pm, () => { sleepPmExpanded = true; renderSleep(); }));
  } else {
    panel.appendChild(renderSleepWindDownCard(today));
  }
  const trend = computeSleepTrend();
  panel.appendChild(trend ? renderSleepTrendCard(trend) : renderSleepProgressCard());
  // Best-ever protected-streak badges — no live streak chip on Sleep by
  // design (see computeLongestSleepProtectedStreak comment), just this.
  const sleepMilestonesSheet = { milestonesEarned: state.sleepMilestonesEarned };
  panel.appendChild(buildMilestonesCard(sleepMilestonesSheet, SLEEP_MILESTONES, today));
  renderSleepHistory(panel);
}

// ------------------------------------------------------------------
// Pillar trends — reads purely off state.wellness + state.pillarActivity,
// so it reflects whatever mix of space-detected and manual days actually
// happened, not a separate tracked metric of its own.
// ------------------------------------------------------------------
const TREND_WINDOW_DAYS = 21; // three weeks — enough to see a pattern, few enough to still read as a strip
const COOCCUR_WINDOW_DAYS = 60; // a longer, sturdier window for the between-pillar stat specifically
const COOCCUR_MIN_DAYS = 15; // below this in either bucket, the rate is too noisy to show
const COOCCUR_MIN_DIFF = 0.15; // don't surface a "pattern" that's within normal day-to-day noise

function pillarTrendBreakdown(key, today) {
  const days = [];
  for (let i = TREND_WINDOW_DAYS - 1; i >= 0; i--) days.push(addDays(today, -i));
  const counts = new Map();
  let activeCount = 0;
  let manualCount = 0;
  const dayCells = days.map((d) => {
    const entry = state.wellness.find((w) => w.logDate === d);
    if (!(entry && entry[key] === "Yes")) return { date: d, active: false };
    activeCount++;
    const activity = pillarActivityFor(key, d);
    const isManual = activity?.source === "manual";
    if (isManual) manualCount++;
    const lbl = activity?.label || (activity ? labelForActivitySource(activity.source) : null) || "Logged";
    counts.set(lbl, (counts.get(lbl) || 0) + 1);
    return { date: d, active: true, source: isManual ? "manual" : "practice", label: lbl };
  });
  return {
    days: dayCells,
    activeCount,
    manualCount,
    totalDays: TREND_WINDOW_DAYS,
    breakdown: [...counts.entries()].sort((a, b) => b[1] - a[1]),
  };
}

// Same "today not yet logged doesn't break yesterday" rule as the
// overall streak on Home, just scoped to one pillar.
function pillarCurrentStreak(key, today) {
  let streak = 0;
  // Today itself is never grace-covered — the day isn't over yet, so
  // there's nothing to protect it from until tomorrow.
  const todayEntry = state.wellness.find((w) => w.logDate === today);
  let cursor = todayEntry && todayEntry[key] === "Yes" ? today : addDays(today, -1);
  while (true) {
    if (isStreakDayPositiveWithGrace(key, cursor)) {
      streak++;
      cursor = addDays(cursor, -1);
    } else break;
  }
  return streak;
}

// Distinct, muted hues per pillar so the pulse chart's day-dots, the
// streak rings, and (eventually) anything else pillar-colored all agree
// with each other — deliberately not reused from the cycle-phase colors,
// which mean something different (a phase of the month, not a habit).
const PILLAR_TREND_COLOR = {
  movement: "#A9804F",
  spiritualAnchor: "#8A6BA8",
  sleepProtected: "#4F7A93",
  socialConnection: "#B36B4A",
  learning: "#5F8F5B",
};

// One plain-language sentence about whichever pillar is doing best right
// now, instead of leading the section with raw grids. "Best" weighs both
// how many days were active AND the current streak, so a pillar with a
// long streak going right now can win out over one with slightly more
// total days but no momentum.
function computeStrongestPillarTrend(today) {
  let best = null;
  WELLNESS_YESNO_FIELDS.forEach(([key, label]) => {
    const trend = pillarTrendBreakdown(key, today);
    const streak = pillarCurrentStreak(key, today);
    const score = trend.activeCount + streak * 0.5;
    if (!best || score > best.score) best = { key, label, score, activeCount: trend.activeCount, totalDays: trend.totalDays, streak };
  });
  return best;
}

function renderTrendInsightBanner(panel, today) {
  const best = computeStrongestPillarTrend(today);
  if (!best || !best.activeCount) return; // nothing logged yet — nothing to say
  const streakClause = best.streak >= 2 ? `, including a ${best.streak}-day streak right now` : "";
  panel.appendChild(el(`
    <div class="trend-insight-banner">
      <div class="trend-insight-icon">🔥</div>
      <div class="trend-insight-text"><strong>${escapeHtml(best.label)}</strong> is your strongest habit &mdash; ${best.activeCount} of the last ${best.totalDays} days${streakClause}.</div>
    </div>
  `));
}

// One line instead of five rows of squares: for each of the last
// TREND_WINDOW_DAYS days, how many of the 5 pillars were a "Yes" that
// day. A smooth SVG line + soft fill under it, matching the app's other
// hand-drawn (non-library) charts.
function renderPulseChart(panel, today) {
  const dates = [];
  for (let i = TREND_WINDOW_DAYS - 1; i >= 0; i--) dates.push(addDays(today, -i));
  const totals = dates.map((d) => {
    const entry = state.wellness.find((w) => w.logDate === d);
    if (!entry) return 0;
    return WELLNESS_YESNO_FIELDS.reduce((n, [key]) => n + (entry[key] === "Yes" ? 1 : 0), 0);
  });

  const W = 320, H = 100, PAD = 6, maxY = WELLNESS_YESNO_FIELDS.length;
  const n = totals.length;
  const stepX = n > 1 ? (W - PAD * 2) / (n - 1) : 0;
  const pts = totals.map((t, i) => [PAD + i * stepX, H - PAD - (t / maxY) * (H - PAD * 2 - 12)]);
  const linePath = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const areaPath = pts.length ? `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${H - PAD} L${pts[0][0].toFixed(1)},${H - PAD} Z` : "";
  const gridLines = [0, 1, 2, 3, 4, 5]
    .filter((v) => v <= maxY)
    .map((v) => {
      const y = H - PAD - (v / maxY) * (H - PAD * 2 - 12);
      return `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="var(--border)" stroke-width="1" ${v === 0 ? "" : 'stroke-dasharray="2,3"'}/>`;
    })
    .join("");
  const lastPt = pts[pts.length - 1];

  panel.appendChild(el(`
    <div class="card pulse-card">
      <div class="pulse-head">
        <div class="t">Days you showed up</div>
        <div class="n">last ${TREND_WINDOW_DAYS} days</div>
      </div>
      <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="overflow:visible;">
        <defs>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#A9804F" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#A9804F" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridLines}
        ${areaPath ? `<path d="${areaPath}" fill="url(#pulseGrad)"/>` : ""}
        ${linePath ? `<path d="${linePath}" fill="none" stroke="#7C5C36" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round"/>` : ""}
        ${lastPt ? `<circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="4.5" fill="#7C5C36" stroke="var(--bg)" stroke-width="2"/>` : ""}
      </svg>
    </div>
  `));
}

// One full-width row per pillar — a colored dot, the label, a mini strip
// of the last 7 days, and the current streak on the right. Five items in
// a single column always reads evenly; the earlier 2-up ring grid left an
// odd one stranded alone on its own row, which is what this replaces.
// Per-app streaks, not per-pillar — each Practice you've added gets its
// own row, its own 7-day dot strip, and its own streak count, matching
// the "no combined streak, every app runs its own" model. Trackers are
// left out here on purpose: they never have a streak to show.
const APP_TREND_COLOR_CYCLE = ["#A9804F", "#5B7A93", "#6E9B6A", "#B3543E", "#8A6A22", "#7C5C36"];
function renderPillarStreakList(panel, today) {
  const list = el(`<div class="streak-chip-list"></div>`);
  const last7 = [];
  for (let i = 6; i >= 0; i--) last7.push(addDays(today, -i));
  const practiceApps = currentAppEntries().filter((e) => e.type === "practice");
  if (!practiceApps.length) {
    list.appendChild(el(`<div class="muted" style="font-size:12px;padding:4px 0;">Add a practice to start building streaks.</div>`));
    panel.appendChild(list);
    return;
  }
  practiceApps.forEach((app, i) => {
    const streak = appCurrentStreak(app.id, today);
    const color = APP_TREND_COLOR_CYCLE[i % APP_TREND_COLOR_CYCLE.length];
    const dots = last7
      .map((d) => {
        const on = isAppLoggedToday(app.id, d);
        return `<i class="${on ? "on" : ""}" style="${on ? `background:${color}` : ""}"></i>`;
      })
      .join("");
    list.appendChild(el(`
      <div class="streak-chip">
        <span class="sc-dot" style="background:${color}"></span>
        <span class="sc-label">${escapeHtml(app.label)}</span>
        <span class="sc-mini">${dots}</span>
        <span class="sc-streak">${streak ? `${streak}d` : "&mdash;"}</span>
      </div>
    `));
  });
  panel.appendChild(list);
}

// Plain conditional frequency between two pillars over a longer window —
// deliberately not a claim about causation, since the data here can't
// tell "movement improves sleep" from "good sleep makes movement more
// likely." Returns null when either bucket is too small to be more than
// noise.
function pillarCooccurrence(keyA, keyB, today) {
  let withA = 0,
    withABothB = 0,
    withoutA = 0,
    withoutABothB = 0;
  for (let i = 0; i < COOCCUR_WINDOW_DAYS; i++) {
    const entry = state.wellness.find((w) => w.logDate === addDays(today, -i));
    if (!entry) continue;
    const aYes = entry[keyA] === "Yes";
    const bYes = entry[keyB] === "Yes";
    if (aYes) {
      withA++;
      if (bYes) withABothB++;
    } else {
      withoutA++;
      if (bYes) withoutABothB++;
    }
  }
  if (withA < COOCCUR_MIN_DAYS || withoutA < COOCCUR_MIN_DAYS) return null;
  const rateWith = withABothB / withA;
  const rateWithout = withoutABothB / withoutA;
  return { keyA, keyB, withA, withoutA, rateWith, rateWithout, diff: rateWith - rateWithout };
}

// Checks every ordered pair, keeps only the stronger direction of each
// unordered pair, and surfaces at most two — enough to be interesting,
// not so many it reads as the app fishing for patterns.
function computeNotableCooccurrences(today) {
  const keys = WELLNESS_YESNO_FIELDS.map(([k]) => k);
  const results = [];
  keys.forEach((a) => {
    keys.forEach((b) => {
      if (a === b) return;
      const r = pillarCooccurrence(a, b, today);
      if (r && Math.abs(r.diff) >= COOCCUR_MIN_DIFF) results.push(r);
    });
  });
  const byPair = new Map();
  results.forEach((r) => {
    const pairKey = [r.keyA, r.keyB].sort().join("|");
    const existing = byPair.get(pairKey);
    if (!existing || Math.abs(r.diff) > Math.abs(existing.diff)) byPair.set(pairKey, r);
  });
  return [...byPair.values()].sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 2);
}

// Promoted to hero placement (right under the streak banner) per
// Veronika's UI/UX audit walkthrough — reuses the same trend-insight-banner
// gradient card as the streak banner above it, with its own eyebrow label,
// rather than the plain dashed cards it used to sit in further down the
// page. Quietly renders nothing when there's not enough data yet, same as
// the streak banner does, since a "not enough data" hero card would read
// as an error in this prominent a spot.
function wellnessPillarLabel(k) {
  return WELLNESS_YESNO_FIELDS.find(([key]) => key === k)?.[1] || k;
}

function renderCooccurrenceCard(panel, today) {
  const labelFor = wellnessPillarLabel;
  const notable = computeNotableCooccurrences(today);
  if (!notable.length) return;
  notable.forEach((r) => {
    panel.appendChild(el(`
      <div class="trend-insight-banner">
        <div class="trend-insight-icon">🔗</div>
        <div class="trend-insight-text">
          <div class="insight-hero-eyebrow">Pattern spotted</div>
          On days you logged <b>${escapeHtml(labelFor(r.keyA))}</b>, <b>${escapeHtml(labelFor(r.keyB))}</b> was also true <b>${Math.round(r.rateWith * 100)}%</b> of the time &mdash; versus ${Math.round(r.rateWithout * 100)}% otherwise.
        </div>
      </div>
    `));
  });
  panel.appendChild(el(`<div class="trend-pattern-note">Observed together, not proven cause and effect &mdash; it could run either direction.</div>`));
}

// Shared editor for a single day's wellness log, whether that's a day with
// no data at all yet or one that just needs a correction. Reuses the same
// selects/notes as Today's card so editing history never feels like a
// different, lesser feature.
function openWellnessDayEditor(dateStr, onClose) {
  let entry = state.wellness.find((l) => l.logDate === dateStr);
  if (!entry) {
    entry = { id: nextId(), logDate: dateStr };
    state.wellness.push(entry);
  }
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box wellness-editor-box">
        <div class="info-modal-header">
          <h3>${escapeHtml(dateStr)}</h3>
          <button type="button" class="icon-btn info-modal-close wellness-editor-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body">
          <div class="wellness-editor-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;"></div>
          <div class="wellness-editor-notes" style="margin-top:12px;display:flex;flex-direction:column;gap:10px;"></div>
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button type="button" class="btn-primary wellness-editor-done" style="padding:8px 18px;border-radius:8px;border:none;">Done</button>
          </div>
        </div>
      </div>
    </div>
  `);
  const grid = overlay.querySelector(".wellness-editor-grid");
  Object.entries(WELLNESS_ENUM_FIELDS).forEach(([key, { label, options }]) => {
    grid.appendChild(
      wellnessSelect(key, label, options, entry[key] || "", (val) => {
        entry[key] = val;
        scheduleSave();
      })
    );
  });
  WELLNESS_YESNO_FIELDS.forEach(([key, label]) => {
    const fieldWrap = wellnessSelect(key, label, ["Yes", "No"], entry[key] || "", (val) => {
      entry[key] = val;
      scheduleSave();
      activityWrap.style.display = val === "Yes" ? "block" : "none";
      if (val !== "Yes") clearPillarActivity(key, dateStr);
    });
    const activityWrap = attachPillarActivityField(fieldWrap, key, dateStr);
    activityWrap.style.display = entry[key] === "Yes" ? "block" : "none";
    grid.appendChild(fieldWrap);
  });
  const notesWrap = overlay.querySelector(".wellness-editor-notes");
  WELLNESS_NOTE_FIELDS.forEach(([key, label]) => {
    const field = el(`<div></div>`);
    field.appendChild(el(`<label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">${escapeHtml(label)}</label>`));
    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.value = entry[key] || "";
    input.addEventListener("change", () => {
      entry[key] = input.value || null;
      scheduleSave();
    });
    field.appendChild(input);
    notesWrap.appendChild(field);
  });
  const close = () => {
    overlay.remove();
    if (onClose) onClose();
  };
  overlay.querySelector(".wellness-editor-close").addEventListener("click", close);
  overlay.querySelector(".wellness-editor-done").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------------
// Your Reward — an optional real-dollar savings goal. Progress is earned
// by logging habits (see computeDollarPerLog/awardRewardForPillarLog
// below), not by a linked bank balance. Set up (or skipped) once at the
// end of onboarding, and revisited any time in Settings → Your Reward.
// Home shows the full photo banner (see renderHomeRewardBanner) plus its
// progress bar — per Veronika's call, the photo is a real motivator and
// stays prominent — but never the "link a bank account" card, which is
// reserved for onboarding and the popup sheet.
//
// A linked account is purely informational here: "realGrowth" is (its
// current balance) minus (its balance the day this cycle started), shown
// alongside the earned progress as an honest comparison, never a gate on
// "reached" — that fires the moment earnedAmount clears the goal.
// ------------------------------------------------------------------
// The rate a single pillar completion earns toward the dollar goal —
// spread evenly across the whole cycle so a perfect run lands right
// around the target date. Computed once, whenever the goal or cycle
// length is set (setup or edit), never re-derived on the fly, so it
// stays predictable through the cycle even if the active pillar count
// changes later. Rounded to the nearest quarter so the number reads
// clean ($9.25, not $9.259259...).
function computeDollarPerLog(goal, cycleLengthDays, pillarCount) {
  const slots = Math.max(1, cycleLengthDays) * Math.max(1, pillarCount);
  const raw = (goal || 0) / slots;
  return Math.max(0.25, Math.round(raw / 0.25) * 0.25);
}

function computeRewardProgress(prize, today) {
  const enabled = !!prize.enabled;
  const linked = !!(prize.linkedAccount && prize.linkedAccount.itemId);
  const goal = prize.depositGoal || 0; // dollars, set during reward setup
  // Progress is earned by logging — one pillar completion = dollarPerLog,
  // credited in awardRewardForPillarLog. The linked bank balance is a
  // separate, informational number (realGrowth below): real dollars
  // actually saved since the cycle started, shown alongside as an
  // honest comparison, never the thing that gates the goal.
  const earned = Math.max(0, prize.earnedAmount || 0);
  const pct = goal ? Math.max(0, Math.min(100, Math.round((earned / goal) * 100))) : 0;
  const reached = goal > 0 && earned >= goal;
  const realGrowth = linked
    ? Math.max(0, (prize.linkedAccount.currentBalance || 0) - (prize.linkedAccount.cycleStartBalance || 0))
    : null;
  const targetDate = addDays(prize.cycleStartDate, prize.cycleLengthDays);
  return { enabled, linked, goal, earned, pct, reached, realGrowth, targetDate };
}

// Credits one Practice log toward the reward the moment it happens —
// called from applyPracticeDepositsForToday, the single place a Practice's
// deposit ledger flips to true for a given day. Idempotent per app per day
// isn't needed here since the ledger check upstream already guarantees
// this only runs once per app per day.
function awardRewardForPracticeLog() {
  const prize = state.veronikasPrize;
  if (!prize?.enabled || !prize.dollarPerLog) return;
  prize.earnedAmount = Math.max(0, (prize.earnedAmount || 0) + prize.dollarPerLog);
}

// Fractions of the dollar goal, marked as ticks right on the progress
// bar (Settings → Your Reward) rather than a separate callout card.
const REWARD_MILESTONE_FRACTIONS = [0.25, 0.5, 0.75];

// Same "good day" logic as isWellnessDayPositive, but as a 3-step tone
// instead of a strict yes/no, so a day with SOME logging that just missed
// the 80% bar still reads as "partial" rather than looking identical to a
// day nothing was logged at all. Used by the Home tab's 14-day grid.
function wellnessDayTone(entry) {
  if (!entry) return "none";
  const classes = [];
  WELLNESS_YESNO_FIELDS.forEach(([k]) => {
    if (entry[k]) classes.push(wellnessColorClass(k, entry[k]));
  });
  if (entry.foodQuality) classes.push(wellnessColorClass("foodQuality", entry.foodQuality));
  const good = classes.filter((c) => c === "good").length;
  const bad = classes.filter((c) => c === "bad").length;
  if (good + bad === 0) return "none";
  return good / (good + bad) >= 0.8 ? "good" : "mixed";
}

const TRACKING_TONE_COLOR = {
  none: "var(--border)",
  mixed: "var(--accent)",
  good: "var(--accent-dark)",
};

// Renders the little 14-cell tone strip shared by the Wellness and Workout
// Progress cards — same shape, same color ramp, just fed a different list
// of day tones so the two read as one family rather than two one-off bits
// of UI.
function renderTrackingGrid(tones, caption) {
  const cellsHtml = tones.map((tone) => `<div class="tracking-cell" style="background:${TRACKING_TONE_COLOR[tone] || TRACKING_TONE_COLOR.none};"></div>`).join("");
  return el(`
    <div class="tracking-grid-wrap">
      <div class="tracking-grid">${cellsHtml}</div>
      <div class="tracking-grid-caption">${escapeHtml(caption)}</div>
    </div>
  `);
}

// The ring-plus-grid card shape shared by Wellness Progress and Workout
// Progress. `onOpen` is a click handler for an "Open →" link (used on the
// Home tab, where the card is a teaser for another page); pass null when
// the card is rendered at the top of that page itself, since there's
// nowhere left to open it to.
function buildProgressCard(title, pct, ringCaptionHtml, tones, gridCaption, onOpen) {
  const card = el(`<div class="card"></div>`);
  const header = el(`
    <div class="home-card-header">
      <div style="font-weight:600;">${escapeHtml(title)}</div>
      ${onOpen ? `<button type="button" class="mini-link">Open &rarr;</button>` : ""}
    </div>
  `);
  if (onOpen) header.querySelector(".mini-link").addEventListener("click", onOpen);
  card.appendChild(header);
  card.appendChild(el(`
    <div class="home-streak-row">
      <div class="home-streak-ring" style="background:conic-gradient(var(--accent) ${pct}%, var(--border) ${pct}% 100%);">
        <div class="home-streak-ring-inner">${pct}%</div>
      </div>
      <div class="home-streak-caption">${ringCaptionHtml}</div>
    </div>
  `));
  card.appendChild(renderTrackingGrid(tones, gridCaption));
  return card;
}

// ------------------------------------------------------------------
// Streaks — consecutive "good" days (same 80%-of-logged-pillars bar as
// the rest of Wellness), read straight off state.wellness so there's
// nothing new to keep in sync. Today not being logged yet doesn't break
// yesterday's streak — there's still time left in the day — but any
// other gap does.
// ------------------------------------------------------------------
function computeStreakStats(today) {
  const entries = state.wellness.slice().sort((a, b) => (a.logDate < b.logDate ? -1 : 1));
  let longest = 0;
  let run = 0;
  let prevDate = null;
  entries.forEach((e) => {
    const positive = isWellnessDayPositive(e);
    if (positive) {
      run = prevDate && addDays(prevDate, 1) === e.logDate ? run + 1 : 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    prevDate = e.logDate;
  });

  // Today is checked raw (never grace-covered — the day isn't over), every
  // earlier day gets the grace-aware check so a covered gap doesn't end
  // the streak.
  let current = 0;
  let cursor = today;
  let isToday = true;
  while (true) {
    const positive = isToday ? isStreakDayPositive("overall", cursor) : isStreakDayPositiveWithGrace("overall", cursor);
    if (positive) {
      current++;
    } else if (!isToday) {
      break;
    }
    isToday = false;
    cursor = addDays(cursor, -1);
  }
  return { current, longest: Math.max(longest, current) };
}

// ------------------------------------------------------------------
// Grace Days — a small, bankable allowance of "this missed day doesn't
// break your streak" tokens. Free accounts earn 1/month, paid earn 2,
// both cap at a 7-day bank (a real vacation, not an excuse to stop
// caring about the streak). Coverage is per streak — each of the six
// pillars plus the overall streak has its own independent gap it can
// bridge — and once a date is marked covered it's permanent history,
// never re-decided on a later boot.
//
// Deliberately automatic and silent: there's no "use a token?" prompt
// in the moment. The whole point is removing the anxiety of a missed
// day, not turning it into another decision.
// ------------------------------------------------------------------
const GRACE_BANK_CAP = 7;
const GRACE_LOOKBACK_DAYS = 14; // how far back reconcileGraceDays scans for a coverable gap
// Bonus tokens ride the same streak ladder the push notifications already
// celebrate. 2026-09 apps rearchitecture: this now runs per Practice app
// (state.grace.bonusAwardedAt[appId]) instead of once off a combined
// "overall" streak, so tracking more Practices means more chances to
// earn, never fewer. 14 added ahead of 30 per the plan's milestone list.
const GRACE_BONUS_MILESTONES = [14, 30, 60, 100, 150, 200, 365];

function graceMonthlyEarnRate() {
  const acct = state.account || {};
  return acct.plan === "paid" || acct.isFounder ? 2 : 1;
}

// Raw check, no grace applied — the ground truth used to decide whether a
// gap needs covering in the first place. "overall" reuses the same
// 80%-of-logged-pillars bar as the streak flame; anything else is one
// pillar's own Yes/No field.
function isStreakDayPositive(key, date) {
  const entry = state.wellness.find((w) => w.logDate === date);
  if (key === "overall") return isWellnessDayPositive(entry);
  return !!(entry && entry[key] === "Yes");
}

// What the streak math actually reads: real data, or a date this account
// already spent a grace token covering.
function isStreakDayPositiveWithGrace(key, date) {
  if (isStreakDayPositive(key, date)) return true;
  return !!(state.grace && state.grace.coveredDates[`${key}|${date}`]);
}

// How many consecutive days (grace-aware) a streak has run, counting
// backward from `endDate` inclusive. Used only to rank which streak is
// "longest" when the bank can't cover every pillar missed on the same day —
// this walks the same coveredDates the outer scan is building, so a
// same-pass coverage on an earlier date is already reflected here.
function graceStreakRunEndingAt(key, endDate) {
  let run = 0;
  let cursor = endDate;
  while (isStreakDayPositiveWithGrace(key, cursor)) {
    run++;
    cursor = addDays(cursor, -1);
  }
  return run;
}

// Runs once per boot. Grants this month's tokens if they haven't been
// granted yet, then looks back over recent days for any single-day gap
// that's actually bridging a real streak (the day before it was itself
// alive) and spends a banked token to cover it, oldest gap first so a
// short bank empties in the order the days actually happened.
function reconcileGraceDays(today) {
  state.grace ||= { banked: 0, lastGrantMonthKey: "", coveredDates: {}, bonusAwardedAt: {} };
  const g = state.grace;
  g.coveredDates ||= {};
  g.bonusAwardedAt ||= {};

  const currentMonthKey = today.slice(0, 7);
  if (!g.lastGrantMonthKey) {
    // First time this has ever run for this account — starts counting
    // from this month, no backfilling months that already passed.
    g.lastGrantMonthKey = currentMonthKey;
  } else if (g.lastGrantMonthKey !== currentMonthKey) {
    g.banked = Math.min(GRACE_BANK_CAP, g.banked + graceMonthlyEarnRate());
    g.lastGrantMonthKey = currentMonthKey;
  }

  // 2026-09 apps rearchitecture: coverage runs off every currently-added
  // Practice app's own id — no more fixed pillar keys, no more combined
  // "overall" key. A Practice removed after a gap was covered keeps its
  // history (coveredDates is permanent), it just stops being scanned here.
  const appIds = currentPracticeAppIds();
  for (let i = GRACE_LOOKBACK_DAYS; i >= 1; i--) {
    const date = addDays(today, -i);
    const prevDate = addDays(date, -1);

    // Every app that actually needs covering on this date — a real gap,
    // bridging a streak that was genuinely alive the day before.
    const needsCoverage = appIds.filter((id) => {
      if (g.coveredDates[`${id}|${date}`]) return false; // already decided, permanent
      if (isAppLoggedToday(id, date)) return false; // nothing to cover
      const prevAlive = isAppLoggedToday(id, prevDate) || g.coveredDates[`${id}|${prevDate}`];
      return prevAlive;
    });
    if (!needsCoverage.length) continue;

    // When the bank can't cover everything missed on the same day, the
    // longest-standing streak wins — losing 100 days of one practice hurts
    // more than losing 3 days of another, whatever order they're listed
    // in. Ties (equal length) keep the app-list order.
    needsCoverage
      .map((id) => ({ id, runLength: appStreakRunEndingAt(id, prevDate) }))
      .sort((a, b) => b.runLength - a.runLength)
      .forEach(({ id }) => {
        if (g.banked <= 0) return;
        g.coveredDates[`${id}|${date}`] = true;
        g.banked -= 1;
      });
  }

  // Bonus tokens per Practice, off that Practice's own streak — every
  // current Practice runs its own independent set of checkpoints.
  appIds.forEach((id) => {
    const streak = appCurrentStreak(id, today);
    GRACE_BONUS_MILESTONES.forEach((day) => {
      if (streak >= day && (g.bonusAwardedAt[id] || 0) < day) {
        g.bonusAwardedAt[id] = day;
        if (g.banked < GRACE_BANK_CAP) g.banked += 1;
      }
    });
  });
}

// Same shape as graceStreakRunEndingAt, but for an app id under the new
// per-Practice model — grace-aware, walking backward from endDate.
function appStreakRunEndingAt(appId, endDate) {
  let run = 0;
  let cursor = endDate;
  while (isAppDayPositiveWithGrace(appId, cursor)) {
    run++;
    cursor = addDays(cursor, -1);
  }
  return run;
}

// The most recent day grace actually stepped in for, if any — this is
// what drives the quiet "a grace day covered you" banner on Home. Only
// looks at yesterday specifically so the banner naturally disappears
// after a day, rather than needing its own "seen it" flag.
function mostRecentGraceCoverage(today) {
  const yesterday = addDays(today, -1);
  const appLookup = new Map(currentAppEntries().map((a) => [a.id, a.label]));
  for (const id of currentPracticeAppIds()) {
    if (state.grace?.coveredDates[`${id}|${yesterday}`]) {
      return { key: id, label: appLookup.get(id) || id };
    }
  }
  return null;
}

function graceFeatherSvg() {
  return iconSvg('<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line>');
}

// ------------------------------------------------------------------
// Home — a quiet, read-only summary that lives dead center in the nav
// on mobile (a fixed circle, never scrolled away) and first in the
// sidebar on desktop. Pulls the same identity quote / wellness
// progress / bonus data straight from Wellness — nothing is editable
// here, tapping "Open" just switches to the Wellness tab for that.
// ------------------------------------------------------------------
function renderHome() {
  const panel = document.getElementById("panel-home");
  if (!panel) return;
  panel.innerHTML = "";

  const today = todayISO();

  panel.appendChild(
    el(`<div class="home-greeting">Good ${homeGreetingTime()}${currentUserFirstName ? `, ${escapeHtml(currentUserFirstName)}` : ""}</div>`)
  );

  // One page now, not two — Wellness's unique content (today's
  // pillars/reflection, trends, history) lives here. The reward — if one's
  // even set up — is deliberately NOT a card on Home anymore: per
  // Veronika's 2026-09 call, it was taking up too much room and mixing a
  // real-dollar goal with the habit surface. All it gets here is the slim
  // pill inside renderHomeHero; the photo, quote, and full progress live
  // in Settings → Your Reward.
  const hero = renderHomeHero(today);
  if (hero) panel.appendChild(hero);
  panel.appendChild(renderHomeAppsGrid(today));

  // Trends comes right after the apps grid now — per Veronika's call,
  // it's one of the more important sections and shouldn't sit below the
  // journal card, especially with that card on its way out to become its
  // own Journal app. Both Trends and History still read straight off the
  // historical Wellness records exactly as they always have (2026-09:
  // past days aren't rewritten under the new per-app model, only going
  // forward does it take over). The identity quote ("Who do you say you
  // are?") lives on the You sheet.
  renderCooccurrenceCard(panel, today);
  renderHomeTrendsSection(panel, today);
  panel.appendChild(renderHomeTodayDetailsCard(today));
  renderWellnessHistory(panel, today);

  panel.appendChild(el(`<div class="muted" style="font-size:12px;text-align:center;margin-top:8px;">Tap an app above to log it.</div>`));
}

// The streak flame's own color climbs from a dark ember to a bright gold
// as the streak grows, so the color alone hints at the streak length
// before you even read the number — mockups (three directions, then
// three color/depth variants of this one) confirmed with Veronika before
// building. Stops are hand-picked at the same milestone days the push
// notifications celebrate (3/7/14/30/60/100/365); colors interpolate
// smoothly between them so every day of progress shows, not just the
// milestone days themselves.
const FLAME_COLOR_STOPS = [
  { day: 0, deep: "#8A7F70", mid: "#8A7F70", light: "#8A7F70" }, // unlit — no streak yet
  { day: 1, deep: "#5A3A2A", mid: "#8C5030", light: "#B8724A" },
  { day: 7, deep: "#6B4326", mid: "#A05F30", light: "#CC8850" },
  { day: 14, deep: "#7C5236", mid: "#B8763F", light: "#E0A868" },
  { day: 30, deep: "#8A5C2E", mid: "#C6883F", light: "#EEC078" },
  { day: 60, deep: "#946026", mid: "#D89A3A", light: "#F5D28A" },
  { day: 100, deep: "#9C6318", mid: "#E6A928", light: "#FADE9E" },
  { day: 365, deep: "#A46A00", mid: "#F0BB1E", light: "#FFEAB0" },
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}
function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(a.map((v, i) => v + (b[i] - v) * t));
}

// Finds the two stops the streak falls between and interpolates — a
// 20-day streak reads as partway from the 14-day color toward the
// 30-day color, not a hard jump at either boundary.
function flameColorsForStreak(days) {
  if (days <= 0) return FLAME_COLOR_STOPS[0];
  let i = 1;
  while (i < FLAME_COLOR_STOPS.length - 1 && days > FLAME_COLOR_STOPS[i].day) i++;
  const lo = FLAME_COLOR_STOPS[i - 1];
  const hi = FLAME_COLOR_STOPS[i];
  const span = hi.day - lo.day || 1;
  const t = Math.max(0, Math.min(1, (days - lo.day) / span));
  return {
    deep: lerpColor(lo.deep, hi.deep, t),
    mid: lerpColor(lo.mid, hi.mid, t),
    light: lerpColor(lo.light, hi.light, t),
  };
}

// Lucide's "flame" glyph — a real flame silhouette rather than a flat
// emoji, so it renders identically across iOS/Android/desktop instead of
// however each platform happens to draw 🔥, and so it can actually carry
// a gradient.
const FLAME_GLYPH_PATH =
  "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";
const FLAME_CORE_PATH =
  "M9.2 15.2c.3 1.6 1.6 2.6 3 2.4 1.8-.3 2.6-2 2.3-3.7-.2-1-.9-1.7-1.1-2.7.9 1.5.4 3-.6 3.6-1 .6-2.2.1-2.6-1-.4-1 .1-2 .8-3-1.3.9-2.1 2.7-1.8 4.4z";
let flameGradientSeq = 0;

function homeStreakFlameSvg(days) {
  const c = flameColorsForStreak(days);
  const gradId = `flameGrad${flameGradientSeq++}`;
  return `
    <svg viewBox="0 0 24 24" width="28" height="28" style="overflow:visible;flex-shrink:0;">
      <defs>
        <linearGradient id="${gradId}" x1="0.2" y1="1" x2="0.8" y2="0">
          <stop offset="0%" stop-color="${c.deep}"/>
          <stop offset="55%" stop-color="${c.mid}"/>
          <stop offset="100%" stop-color="${c.light}"/>
        </linearGradient>
      </defs>
      <path d="${FLAME_GLYPH_PATH}" fill="url(#${gradId})"/>
      <path d="${FLAME_CORE_PATH}" fill="#fff" opacity="0.3"/>
    </svg>`;
}

// Lucide-style cupcake glyph — the icon for the reward feature everywhere
// it shows up (Home pill, Settings row, Your Reward screen): a fluted
// liner, a scalloped frosting dome with a couple of sprinkles, and a
// little flag on top. `stroke` lets callers match either the white-on-
// gradient badge treatment or a plain muted list-row icon.
function rewardCupcakeSvg(stroke) {
  return `
    <path d="M5.5 14 C5 11.5 6.5 10 8 10.5 C8 8 10.5 6.5 12 8 C13.5 6.5 16 8 16 10.5 C17.5 10 19 11.5 18.5 14 Z"></path>
    <path d="M5.5 14 L7.5 19.5 L12 21 L16.5 19.5 L18.5 14 Z"></path>
    <path d="M9 14 L10 20"></path>
    <path d="M12 14 L12 21"></path>
    <path d="M14.5 14 L14 20"></path>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <path d="M12 3 L15.5 4 L12 5.3 Z"></path>
    <line x1="9" y1="11.3" x2="9.7" y2="12"></line>
    <line x1="13.2" y1="9.8" x2="13.9" y2="10.5"></line>
  `;
}
function rewardCupcakeBadgeSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${rewardCupcakeSvg()}</svg>`;
}

// Small piggy-bank badge for anything nudging toward linking a bank
// account — deliberately not the cupcake, which stays the reward's own
// identity icon everywhere it already appears.
function rewardPiggyBankSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 12c0-3.5 3.4-6 7.5-6 2.7 0 5 1.1 6.3 2.8.2-.1.4-.1.7-.1 1.1 0 2 .9 2 2v.3c0 .8-.5 1.5-1.2 1.8-.3 1.6-1.4 3-2.8 3.8V19a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-.3c-.6.1-1.3.2-2 .2s-1.4-.1-2-.2V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2.6C4.9 15.5 4.5 13.9 4.5 12z"></path>
    <circle cx="16" cy="11.3" r=".6" fill="currentColor" stroke="none"></circle>
    <path d="M8 6.3 7.2 4.6"></path>
  </svg>`;
}

// The big Home banner for the reward — same 16:10 photo size/shape the
// old full Your Reward screen used, relocated onto Home directly, since
// the photo itself is the motivator and Veronika was explicit it needs to
// stay prominent there. What does NOT come back onto Home is the "link a
// bank account" card — that stays reserved for onboarding and the popup
// sheet (renderHomeRewardLinkLine/openLinkBankAccountSheet just below).
// Progress is earned-dollars vs. goal (logging habits moves this, always,
// whether or not a bank is linked) — never gated on Plaid. Tapping the
// banner opens Settings → Your Reward, same as the old pill did.
function renderHomeRewardBanner(today) {
  const prize = state.veronikasPrize;
  // The reward pill is hidden entirely once there are zero Practice
  // apps — nothing can deposit toward it, so showing an empty/stuck
  // progress bar would just be confusing.
  if (!prize.enabled || !currentPracticeAppIds().length) return null;
  const stats = computeRewardProgress(prize, today);
  const name = prize.itemName || "your reward";

  const banner = el(`<div class="home-reward-banner${stats.reached ? " reached" : ""}"></div>`);
  if (prize.itemPhoto) {
    banner.appendChild(el(`<img src="${prize.itemPhoto}" />`));
  } else {
    banner.appendChild(el(`
      <div class="home-reward-banner-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${rewardCupcakeSvg()}</svg>
      </div>
    `));
  }
  banner.appendChild(el(`
    <div class="home-reward-scrim">
      <div class="home-reward-name">${escapeHtml(name)}${stats.reached ? " — ready to claim!" : ""}</div>
      <div class="home-reward-sub">${stats.reached ? "Tap to claim" : `Targeting ${stats.targetDate}`}</div>
    </div>
  `));
  banner.addEventListener("click", () => openYourRewardScreen());

  const wrap = el(`<div></div>`);
  wrap.appendChild(banner);
  wrap.appendChild(el(`
    <div class="home-reward-progress">
      <div class="home-reward-progress-row">
        <span class="home-reward-progress-label">Earned so far</span>
        <span class="home-reward-progress-figure">$${stats.earned.toFixed(2).replace(/\.00$/, "")} of $${stats.goal}</span>
      </div>
      <div class="home-reward-bar"><div class="home-reward-fill${stats.reached ? " reached" : ""}" style="width:${stats.pct}%;"></div></div>
    </div>
  `));
  return wrap;
}

// The small dashed "not linked yet" nudge that lives on Home once a
// reward is set up and progress is earning normally — deliberately not a
// big card (that lives only in onboarding, see the reward-setup step in
// finishOnboarding). Tapping it pops the same "Track this in real
// dollars" content as a bottom sheet instead of a permanent Home fixture.
function renderHomeRewardLinkLine() {
  const prize = state.veronikasPrize;
  if (!prize.enabled || !currentPracticeAppIds().length || (prize.linkedAccount && prize.linkedAccount.itemId)) return null;
  const line = el(`
    <div class="home-link-line">
      <span class="home-link-line-icon">${rewardPiggyBankSvg()}</span>
      <span>Link a bank account to start tracking</span>
    </div>
  `);
  line.addEventListener("click", () => openLinkBankAccountSheet());
  return line;
}

// The same "Track it in real dollars" prompt shown in onboarding, popped
// up as a bottom sheet instead of living permanently on Home. This is the
// only place that big prompt appears again after setup — per Veronika's
// call, Home itself only ever shows the small dashed line above.
function openLinkBankAccountSheet() {
  const overlay = el(`
    <div class="sheet-overlay">
      <div class="sheet-box">
        <button type="button" class="icon-btn sheet-close" aria-label="Close">${closeSvg}</button>
        <div class="link-empty-icon">${rewardPiggyBankSvg()}</div>
        <div class="onboarding-headline" style="margin-top:10px;">Track it in real dollars</div>
        <div class="onboarding-subline">Link a bank account so you can see your real balance alongside what you've earned. Read-only — Addley can see the balance, never move money.</div>
        <button type="button" class="sheet-primary-btn link-sheet-btn">Link a bank account</button>
      </div>
    </div>
  `);
  overlay.querySelector(".sheet-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  const linkBtn = overlay.querySelector(".link-sheet-btn");
  linkBtn.addEventListener("click", () => {
    linkBtn.textContent = "Connecting…";
    linkBtn.disabled = true;
    startPlaidLink(
      () => { overlay.remove(); render(); renderHome(); },
      () => { linkBtn.textContent = "Link a bank account"; linkBtn.disabled = false; }
    );
  });
  document.body.appendChild(overlay);
}

// The new front door: the reward-progress pill (2026-09 — no more
// combined streak flame, since there's no single combined streak once
// every Practice runs its own). Hidden entirely when there are zero
// Practice apps — see renderHomeRewardBanner/renderHomeRewardLinkLine.
function renderHomeHero(today) {
  ensureTodaysWellnessEntry(today);
  applyPracticeDepositsForToday(today);

  const hero = el(`<div class="card"></div>`);

  const graceCovered = mostRecentGraceCoverage(today);
  if (graceCovered) {
    hero.appendChild(el(`
      <div class="trend-insight-banner grace-banner">
        <div class="trend-insight-icon grace-icon">${graceFeatherSvg()}</div>
        <div class="trend-insight-text">
          <strong>A grace day covered you</strong> — ${escapeHtml(graceCovered.label)} kept going.
          <div class="trend-insight-sub">${state.grace.banked} grace day${state.grace.banked === 1 ? "" : "s"} banked</div>
        </div>
      </div>
    `));
  }

  const rewardBanner = renderHomeRewardBanner(today);
  if (rewardBanner) hero.appendChild(rewardBanner);
  const linkLine = renderHomeRewardLinkLine();
  if (linkLine) hero.appendChild(linkLine);

  return hero.children.length ? hero : null;
}

// ------------------------------------------------------------------
// Home's unified apps grid (2026-09 rearchitecture) — replaces the old
// six-pillar tap grid entirely. One grid, every added Practice + Tracker
// (never Tools) as same-style tiles, a small checkmark on anything
// logged today, an "Add / remove" tile at the end opening the
// Marketplace. Empty state (zero Practices) shows a plain prompt instead
// — Trackers/Tools still show normally even then.
// ------------------------------------------------------------------
function renderHomeAppsGrid(today) {
  // Sobriety's milestone check runs here now that its own Home row is
  // gone — this is still the first place a new day's crossing gets
  // noticed, same as before.
  if (state.extraTrackers?.sobriety) {
    const newTier = sobrietyRecomputeMilestones(today);
    if (newTier) {
      scheduleSave();
      setTimeout(() => openSobrietyCelebration(newTier), 0);
    }
  }

  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div class="home-hero-pillars-label">Today</div>`));

  const nudges = renderExtraTrackersSection(today, () => renderHome());
  if (nudges) card.appendChild(nudges);

  const apps = currentAppEntries();
  const hasPractice = apps.some((a) => a.type === "practice");

  if (!hasPractice) {
    const empty = el(`
      <div class="home-empty-practices">
        <div class="home-empty-practices-title">Add a practice to start tracking</div>
        <button type="button" class="btn-primary home-empty-practices-btn">Browse the Marketplace</button>
      </div>
    `);
    empty.querySelector(".home-empty-practices-btn").addEventListener("click", () => {
      settingsSubTab = "gallery";
      activateTab("settings");
    });
    card.appendChild(empty);
    // Trackers/Tools still show normally even with zero Practices — the
    // grid below just won't have any Practice tiles in it.
    if (!apps.length) return card;
  }

  const grid = el(`<div class="home-yourspaces-grid home-apps-grid"></div>`);
  apps.forEach((app) => {
    const loggedToday = isAppLoggedToday(app.id, today);
    const tile = el(`
      <button type="button" class="home-yourspaces-tile home-app-tile${app.type === "tracker" ? " is-tracker" : ""}">
        <span class="home-yourspaces-tile-icon ${appIconWellClass(app.type)}">${iconSvg(app.icon || `<circle cx="12" cy="12" r="9"></circle>`)}${
      loggedToday ? `<span class="home-app-tile-check">${checkSvg}</span>` : ""
    }</span>
        <span class="home-yourspaces-tile-label">${escapeHtml(app.label)}</span>
      </button>
    `);
    tile.addEventListener("click", () => {
      // Sobriety and Cycle are real tabs now, same as everything else on
      // this grid — no more modal popup for just these two.
      activateTab(app.id);
    });
    grid.appendChild(tile);
  });
  const addTile = el(`
    <button type="button" class="home-yourspaces-tile manage">
      <span class="home-yourspaces-tile-icon">+</span>
      <span class="home-yourspaces-tile-label">Add / remove</span>
    </button>
  `);
  addTile.addEventListener("click", () => {
    settingsSubTab = "gallery";
    activateTab("settings");
  });
  grid.appendChild(addTile);
  card.appendChild(grid);

  return card;
}

// Food quality and the three reflection questions — this used to be the
// Wellness page's own "Today" card, one page away from the pillar taps
// above. Same fields, same behavior, now living right under them since
// it's the same "today" either way.
//
// Deliberately does NOT repeat the per-pillar "what did you do" detail
// here: the real detail already lives in whatever space marked the
// pillar done (Activity Log's notes, Connections' notes, etc.), so
// restating it as a second editable field was pure duplication — Veronika
// flagged this directly. A pillar marked done manually (no real space
// behind it) still gets to name what happened, right at the moment it's
// logged, via the quick-log modal; correcting a past day's manual label
// afterward still goes through the History day editor.
// Food quality's old standalone dropdown is retired from here now that
// Food is a real pillar with its own practice (Meal Log) — showing both
// would be the exact redundancy just fixed for the other pillars. The
// field itself (WELLNESS_ENUM_FIELDS.foodQuality) still exists for old
// data and stays correctable from the History day editor.
// Collapsible now, and collapsed by default — this is on its way out to
// become its own Journal app (2026-09), so it's deliberately de-emphasized
// on Home in the meantime rather than sitting open and prominent for a
// feature that's about to move.
function renderHomeTodayDetailsCard(today) {
  const todaysEntry = ensureTodaysWellnessEntry(today);
  const card = el(`<details class="card wellness-journal-card"><summary class="book-summary" style="margin-bottom:2px;"><span class="wellness-journal-title serif" style="margin:0;">How today went</span></summary></details>`);

  WELLNESS_NOTE_FIELDS.forEach(([key, label]) => {
    const q = el(`<div class="journal-q"></div>`);
    q.appendChild(el(`<label>${escapeHtml(label)}</label>`));
    const textarea = document.createElement("textarea");
    textarea.className = "auto-grow";
    textarea.rows = 1;
    textarea.placeholder = "…";
    textarea.value = todaysEntry[key] || "";
    const autoGrow = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
    textarea.addEventListener("input", autoGrow);
    textarea.addEventListener("change", () => {
      todaysEntry[key] = textarea.value || null;
      scheduleSave();
    });
    q.appendChild(textarea);
    card.appendChild(q);
    requestAnimationFrame(autoGrow);
  });

  return card;
}

// "synced 8 minutes ago" / "synced yesterday" — coarse on purpose, this is
// just reassurance that syncing is working, not a precise audit trail.
function timeAgoLabel(isoString) {
  if (!isoString) return "never";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

// ------------------------------------------------------------------
// Plaid — read-only bank balance sync. Addley never sees or stores your
// Plaid access token; it lives server-side in the plaid_items table,
// reachable only by the Edge Functions below through the service role.
// The client only ever holds the current balance and the balance the
// cycle started with, both plain numbers on state.veronikasPrize.
// ------------------------------------------------------------------

// Loaded lazily — most sessions never touch Plaid, so there's no reason
// to pay for the script on every boot.
let plaidLinkScriptPromise = null;
function loadPlaidLinkScript() {
  if (window.Plaid) return Promise.resolve();
  plaidLinkScriptPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Couldn't load Plaid"));
    document.head.appendChild(s);
  });
  return plaidLinkScriptPromise;
}

// Opens Plaid's own hosted linking flow. On success, exchanges the
// public token server-side and snapshots the current balance as this
// cycle's starting point — `onLinked` re-renders whatever screen asked.
async function startPlaidLink(onLinked, onError) {
  try {
    await loadPlaidLinkScript();
    const { data: tokenData, error: tokenErr } = await sb.functions.invoke("plaid-create-link-token");
    if (tokenErr || !tokenData?.link_token) throw tokenErr || new Error("No link token returned");
    const handler = window.Plaid.create({
      token: tokenData.link_token,
      onSuccess: async (public_token) => {
        const { data, error } = await sb.functions.invoke("plaid-exchange-token", { body: { public_token } });
        if (error || !data) { onError?.(error || new Error("Linking failed")); return; }
        const prize = state.veronikasPrize;
        prize.linkedAccount = {
          itemId: data.item_id,
          institutionName: data.institution_name,
          mask: data.mask,
          currentBalance: data.balance,
          cycleStartBalance: data.balance,
          lastSyncedAt: new Date().toISOString(),
        };
        scheduleSave();
        onLinked?.();
      },
      onExit: () => {},
    });
    handler.open();
  } catch (err) {
    onError?.(err);
  }
}

async function syncRewardBalance(onDone, onError) {
  const prize = state.veronikasPrize;
  if (!prize.linkedAccount) return;
  try {
    const { data, error } = await sb.functions.invoke("plaid-sync-balance", { body: { item_id: prize.linkedAccount.itemId } });
    if (error || typeof data?.balance !== "number") throw error || new Error("No balance returned");
    prize.linkedAccount.currentBalance = data.balance;
    prize.linkedAccount.lastSyncedAt = new Date().toISOString();
    scheduleSave();
    onDone?.();
  } catch (err) {
    onError?.(err);
  }
}

async function unlinkRewardAccount(onDone) {
  const prize = state.veronikasPrize;
  const itemId = prize.linkedAccount?.itemId;
  prize.linkedAccount = null;
  scheduleSave();
  onDone?.();
  if (itemId) {
    try { await sb.functions.invoke("plaid-unlink", { body: { item_id: itemId } }); } catch (e) { /* already unlinked client-side either way */ }
  }
}

// ------------------------------------------------------------------
// Your Reward — the one screen (reached from Settings → Your Reward, or
// by tapping the Home pill) that carries everything the old always-on
// Home card used to: photo, quote, big dollar progress with milestone
// ticks, the linked account's sync/unlink controls, and editing the
// name/goal/target date. Claiming or extending the cycle is always a
// deliberate tap here, never automatic.
// ------------------------------------------------------------------
function openYourRewardScreen() {
  const prize = state.veronikasPrize;
  const overlay = el(`<div class="modal-overlay"><div class="modal-box info-modal-box account-modal-box" style="width:380px;"></div></div>`);
  const box = overlay.querySelector(".modal-box");

  function render() {
    box.innerHTML = "";
    const stats = computeRewardProgress(prize, todayISO());

    box.appendChild(el(`
      <div class="info-modal-header">
        <h3 style="display:flex;align-items:center;gap:10px;">
          <span class="reward-pill-icon" style="width:30px;height:30px;background:radial-gradient(circle at 35% 30%, #EFE0C4, #C7A876 60%, #8E6B3E 100%);">${rewardCupcakeBadgeSvg()}</span>
          Your Reward
        </h3>
        <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
      </div>
    `));
    box.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());

    if (!prize.enabled) {
      box.appendChild(el(`<div class="account-note" style="padding:14px 0;">You skipped setting up a reward during onboarding — streaks and milestones still work exactly the same without one. Set one up any time.</div>`));
      const startBtn = el(`<button type="button" class="sheet-primary-btn" style="margin-top:4px;">Set up a reward</button>`);
      startBtn.addEventListener("click", () => openEditRewardModal(render));
      box.appendChild(startBtn);
      document.body.appendChild(overlay);
      return;
    }

    const banner = el(`<div class="home-hero-prize-banner"></div>`);
    if (prize.itemPhoto) {
      banner.appendChild(el(`<img src="${prize.itemPhoto}" />`));
    } else {
      banner.appendChild(el(`<div class="home-hero-prize-banner-noimg">No photo yet — tap to add one</div>`));
    }
    banner.appendChild(el(`
      <div class="home-hero-prize-scrim">
        <div class="home-hero-prize-name">${escapeHtml(prize.itemName || "Not named yet")}</div>
        <div class="home-hero-prize-sub">${stats.reached ? "Ready to claim" : `Targeting ${stats.targetDate}`}</div>
      </div>
    `));
    const photoInput = el(`<input type="file" accept="image/*" style="display:none;" />`);
    banner.appendChild(photoInput);
    banner.addEventListener("click", (e) => { if (e.target !== editBtn && !editBtn.contains(e.target)) photoInput.click(); });
    photoInput.addEventListener("change", () => {
      const file = photoInput.files[0];
      if (!file) return;
      resizeImageToDataUrl(file).then((dataUrl) => {
        prize.itemPhoto = dataUrl;
        scheduleSave();
        render();
      });
    });
    const editBtn = el(`
      <button type="button" class="home-hero-prize-edit-btn" aria-label="Edit reward">
        ${iconSvg('<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>')}
      </button>
    `);
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); openEditRewardModal(render); });
    banner.appendChild(editBtn);
    box.appendChild(banner);

    // Primary progress — earned by logging, not by the bank balance.
    // Always shown once a reward exists, linked or not.
    box.appendChild(el(`
      <div class="account-section" style="border-top:none;padding-top:4px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-size:11.5px;font-weight:700;">Earned so far</span>
          <span style="font-size:11.5px;font-weight:700;color:var(--accent-dark);">$${stats.earned.toFixed(2).replace(/\.00$/, "")} of $${stats.goal}</span>
        </div>
        <div class="home-deposit-track-bar">
          <div class="home-deposit-track-fill" style="width:${stats.pct}%;"></div>
          ${REWARD_MILESTONE_FRACTIONS.map((f) => `<div class="home-deposit-tick ${stats.earned >= Math.round(stats.goal * f) ? "passed" : ""}" style="left:${f * 100}%;"></div>`).join("")}
        </div>
        ${prize.dollarPerLog ? `<div class="account-note" style="margin-top:6px;">$${prize.dollarPerLog} earned per pillar logged, each day.</div>` : ""}
      </div>
    `));

    // Real bank balance — informational only from here on. Linking never
    // moves money and never changes the progress bar above; it's just an
    // honest side-by-side with what's actually in the account.
    if (!stats.linked) {
      box.appendChild(el(`<div class="account-note" style="margin:10px 0;">Optionally link a bank account to see your real balance alongside this. Read-only — Addley can see the balance, never move money.</div>`));
      const linkBtn = el(`<button type="button" class="sheet-primary-btn" style="margin-top:0;">Link a bank account</button>`);
      linkBtn.addEventListener("click", () => {
        linkBtn.textContent = "Connecting…";
        linkBtn.disabled = true;
        startPlaidLink(() => { render(); renderHome(); }, () => { linkBtn.textContent = "Link a bank account"; linkBtn.disabled = false; });
      });
      box.appendChild(linkBtn);
    } else {
      box.appendChild(el(`
        <div class="account-note" style="margin-top:12px;">Your linked balance has grown $${stats.realGrowth} since you started — separate from the progress above.</div>
      `));
      const syncRow = el(`
        <div class="account-note" style="display:flex;justify-content:space-between;align-items:center;">
          <span>${escapeHtml(prize.linkedAccount.institutionName)} •••• ${escapeHtml(prize.linkedAccount.mask)} &middot; synced ${timeAgoLabel(prize.linkedAccount.lastSyncedAt)}</span>
          <button type="button" class="sync-btn" style="background:none;border:none;color:var(--accent-dark);font-weight:700;cursor:pointer;font-family:inherit;">Sync</button>
        </div>
      `);
      syncRow.querySelector(".sync-btn").addEventListener("click", (e) => {
        e.target.textContent = "…";
        syncRewardBalance(() => { render(); renderHome(); }, () => { e.target.textContent = "Sync"; });
      });
      box.appendChild(syncRow);
    }

    if (stats.reached) {
      box.appendChild(el(`<div class="prize-divider"></div>`));
      const actionRow = el(`<div style="display:flex;gap:10px;margin-top:14px;"></div>`);
      const itemLabel = prize.itemName ? prize.itemName : "your reward";
      const claimBtn = el(`<button type="button" class="btn-primary" style="flex:1;">Claim ${escapeHtml(itemLabel)}</button>`);
      const extendBtn = el(`<button type="button" class="btn-ghost" style="flex:1;">Give myself more time</button>`);
      actionRow.appendChild(claimBtn);
      actionRow.appendChild(extendBtn);
      box.appendChild(actionRow);
      claimBtn.addEventListener("click", () => {
        prize.cycleStartDate = todayISO();
        prize.itemName = "";
        prize.itemPhoto = null;
        prize.earnedAmount = 0;
        if (prize.linkedAccount) prize.linkedAccount.cycleStartBalance = prize.linkedAccount.currentBalance;
        scheduleSave();
        render();
        renderHome();
      });
      extendBtn.addEventListener("click", () => {
        prize.cycleLengthDays += 30;
        scheduleSave();
        render();
      });
    } else if (stats.linked) {
      const unlinkBtn = el(`<button type="button" class="unlink-btn">Unlink bank account</button>`);
      unlinkBtn.addEventListener("click", () => unlinkRewardAccount(() => { render(); renderHome(); }));
      box.appendChild(unlinkBtn);
    }

    document.body.appendChild(overlay);
  }

  render();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

// Name, dollar goal, and target date — the three things that change
// rarely enough to sit behind an explicit edit rather than inline.
function openEditRewardModal(onSaved) {
  const prize = state.veronikasPrize;
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box account-modal-box">
        <div class="info-modal-header">
          <h3>Edit reward</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="info-modal-body">
          <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Name</label>
          <input type="text" class="reward-name-input" value="${escapeHtml(prize.itemName || "")}" placeholder="What are you saving for?" style="width:100%;box-sizing:border-box;margin-bottom:14px;border:1.5px solid var(--border);border-radius:10px;padding:12px 14px;font-size:14px;font-family:inherit;background:var(--surface);color:var(--text);" />
          <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Savings goal</label>
          <div class="goal-dollar-row" style="display:flex;align-items:center;border:1.5px solid var(--border);border-radius:10px;background:var(--surface);margin-bottom:14px;overflow:hidden;">
            <span style="padding:10px 0 10px 12px;color:var(--muted);font-weight:700;">$</span>
            <input type="number" min="1" class="reward-goal-input" value="${prize.depositGoal || ""}" style="border:none;padding:10px 12px 10px 4px;flex:1;min-width:0;background:transparent;font-family:inherit;font-size:14px;" />
          </div>
          <label class="muted" style="display:block;font-size:12px;margin-bottom:4px;">Target date</label>
          <div class="reward-target-days-hint" style="font-size:11.5px;color:var(--accent-dark);font-weight:600;margin-bottom:6px;"></div>
          <input type="date" class="prize-start-date" value="${addDays(prize.cycleStartDate, prize.cycleLengthDays)}" style="width:100%;box-sizing:border-box;border:1.5px solid var(--border);border-radius:10px;padding:12px 14px;font-size:14px;font-family:inherit;background:var(--surface);color:var(--text);-webkit-appearance:none;appearance:none;" />
          <button type="button" class="btn-primary reward-save-btn" style="margin-top:18px;width:100%;padding:10px;border-radius:8px;border:none;">Save</button>
        </div>
      </div>
    </div>
  `);
  const dateInput = overlay.querySelector(".prize-start-date");
  const daysHint = overlay.querySelector(".reward-target-days-hint");
  function updateDaysHint() {
    if (!dateInput.value) { daysHint.textContent = ""; return; }
    const days = Math.round((new Date(dateInput.value) - new Date(todayISO())) / 86400000);
    if (days > 0) daysHint.textContent = `${days} day${days === 1 ? "" : "s"} from today`;
    else if (days === 0) daysHint.textContent = "That's today";
    else daysHint.textContent = `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  }
  updateDaysHint();
  dateInput.addEventListener("input", updateDaysHint);
  dateInput.addEventListener("change", updateDaysHint);

  overlay.querySelector(".reward-save-btn").addEventListener("click", () => {
    const newName = overlay.querySelector(".reward-name-input").value;
    const newGoal = parseInt(overlay.querySelector(".reward-goal-input").value, 10);
    const newTarget = overlay.querySelector(".prize-start-date").value;
    prize.enabled = true;
    prize.itemName = newName;
    if (newGoal > 0) prize.depositGoal = newGoal;
    if (!prize.cycleStartDate) prize.cycleStartDate = todayISO();
    if (newTarget) {
      const days = Math.max(1, Math.round((new Date(newTarget) - new Date(prize.cycleStartDate)) / 86400000));
      prize.cycleLengthDays = days;
    }
    // Re-locks the per-log rate whenever the goal or target date changes —
    // it's what keeps "earn dollars by logging" honest to the new numbers.
    if (prize.depositGoal) {
      prize.dollarPerLog = computeDollarPerLog(
        prize.depositGoal,
        prize.cycleLengthDays,
        currentPracticeAppIds().length
      );
    }
    scheduleSave();
    overlay.remove();
    renderHome();
    onSaved?.();
  });
  const close = () => overlay.remove();
  overlay.querySelector(".info-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.body.appendChild(overlay);
}

// Same milestone ladder the push notifications celebrate — used here just
// to say "you've hit this" per practice, not to fire anything.
const HOME_STREAK_MILESTONES = [3, 7, 10, 14, 21, 30, 60, 100, 150, 200, 365];
function renderTrendMilestonesRow(panel, today) {
  const practiceApps = currentAppEntries().filter((e) => e.type === "practice");
  const hits = practiceApps
    .map((app) => {
      const streak = appCurrentStreak(app.id, today);
      const reached = HOME_STREAK_MILESTONES.filter((m) => streak >= m).pop();
      return reached ? { label: app.label, reached } : null;
    })
    .filter(Boolean);
  if (!hits.length) return;
  panel.appendChild(el(`<div class="trend-title" style="margin:10px 0 8px;">Milestones</div>`));
  const row = el(`<div class="streak-chip-list"></div>`);
  hits.forEach((h) => {
    row.appendChild(el(`<div class="streak-chip"><span class="sc-label">🎉 ${escapeHtml(h.label)}</span><span class="sc-streak">${h.reached}d</span></div>`));
  });
  panel.appendChild(row);
}

// Trends — open by default (per Veronika's call, this is one of the more
// important sections, not something to bury behind a tap), but still a
// <details> so it can be collapsed same as History right below it.
function renderHomeTrendsSection(panel, today) {
  const section = el(`
    <details class="card" open>
      <summary class="book-summary" style="margin-bottom:2px;"><span class="home-section-title-group"><span class="home-section-icon">📈</span><span class="subsection-title serif" style="margin:0;">Trends</span></span></summary>
    </details>
  `);
  panel.appendChild(section);
  // The "strongest habit" line lives inside Trends now — it's describing
  // this section's own data, so it reads as this section's own data.
  renderTrendInsightBanner(section, today);
  renderPulseChart(section, today);
  renderTrendMilestonesRow(section, today);
  section.appendChild(el(`<div class="trend-title" style="margin:10px 0 8px;">Streaks right now</div>`));
  renderPillarStreakList(section, today);
}

// ------------------------------------------------------------------
// Cycle — built from real dates instead of a daily manual tap: logging
// when a period starts (and, once it's over, when it ended) is the
// only input. Today's predicted phase, the countdown to the next
// period, and the running averages are all computed fresh from that
// log every render, never stored separately. Fewer than 2 logged
// periods falls back to the standard 28-day cycle (plus whatever
// period length was given at setup); from the 2nd period on, real
// history quietly takes over — see cycleAvgCycleLength/
// cycleAvgPeriodLength. Veronika was explicit this should predict from
// history like a real period-tracking app, not repeat the old
// tap-a-phase-every-day dropdown (still kept as WELLNESS_ENUM_FIELDS.
// cyclePhase / CYCLE_PHASE_INFO for History/trend compatibility — see
// cycleSyncTodaysWellnessPhase — and its diagram is reused as-is in
// the full screen below, just no longer the way you log anything).
// ------------------------------------------------------------------
const cycleDropSvgPath = `<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"></path>`;
const CYCLE_FLOW_OPTIONS = ["Light", "Medium", "Heavy"];

function cycleSortedPeriods() {
  return [...state.cycle.periods].sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
}

// "Where you are right now" — the period whose start date is on or
// before today, closest to it. Not just the most recently logged one,
// in case a period was ever back-logged out of order.
function cycleCurrentPeriod(today) {
  const sorted = cycleSortedPeriods().filter((p) => p.startDate <= today);
  return sorted.length ? sorted[sorted.length - 1] : null;
}

// Real logged data always wins once there's enough of it (2+ periods
// for cycle length, 1+ closed period for period length); the manual
// numbers — set at first setup, editable any time after from the
// average card — are only ever the fallback for before that.
function cycleAvgCycleLength() {
  const sorted = cycleSortedPeriods();
  if (sorted.length >= 2) {
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      gaps.push(daysBetween(new Date(sorted[i - 1].startDate + "T00:00:00"), new Date(sorted[i].startDate + "T00:00:00")));
    }
    const recent = gaps.slice(-6).filter((g) => g > 0);
    if (recent.length) return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
  }
  return state.cycle.manualCycleLengthDays || 28;
}
function cycleAvgPeriodLength() {
  const lengths = cycleSortedPeriods()
    .filter((p) => p.endDate)
    .slice(-6)
    .map((p) => daysBetween(new Date(p.startDate + "T00:00:00"), new Date(p.endDate + "T00:00:00")) + 1)
    .filter((n) => n > 0);
  if (lengths.length) return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  return state.cycle.manualPeriodLengthDays || 5;
}

// Which of the four phases a given cycle day falls in, given the
// average cycle/period lengths. Ovulation is placed 14 days before the
// NEXT period rather than a fixed day number, since the luteal phase
// is the most biologically consistent part of the cycle even when the
// rest runs short or long.
function cyclePhaseForDay(day, avgCycleLen, avgPeriodLen) {
  const ovulationCenter = Math.max(avgPeriodLen + 2, avgCycleLen - 14);
  const ovulStart = ovulationCenter - 1;
  const ovulEnd = ovulationCenter + 1;
  if (day <= avgPeriodLen) return { key: "menstrual", label: "Menstrual", color: "var(--cyc-menstrual)" };
  if (day < ovulStart) return { key: "follicular", label: "Follicular", color: "var(--cyc-follicular)" };
  if (day <= ovulEnd) return { key: "ovulatory", label: "Ovulatory", color: "var(--cyc-ovulatory)" };
  if (day <= avgCycleLen) return { key: "luteal", label: "Luteal", color: "var(--cyc-luteal)" };
  return { key: "luteal", label: "Late luteal", color: "var(--cyc-luteal)" };
}

// Same ovulation-day math as cyclePhaseForDay, translated into a
// pregnancy-chance line instead of a phase name — sperm can survive a
// few days, and the egg about a day past ovulation, so "high" spans a
// window around ovulation rather than just that one day. Veronika
// asked for this directly: the phase name alone ("Ovulatory") doesn't
// tell you what it means for fertility unless you already know.
function cycleFertilityForDay(day, avgCycleLen, avgPeriodLen) {
  const ovulationCenter = Math.max(avgPeriodLen + 2, avgCycleLen - 14);
  const highStart = ovulationCenter - 5;
  const highEnd = ovulationCenter + 1;
  const medStart = highStart - 2;
  if (day >= highStart && day <= highEnd) return { level: "high", label: "High chance of pregnancy" };
  if (day >= medStart && day < highStart) return { level: "medium", label: "Rising chance of pregnancy" };
  return { level: "low", label: "Low chance of pregnancy" };
}

// The one function everything else reads from. Null means no periods
// logged yet at all — handled as its own setup state everywhere this
// is called, never faked as "Day 1".
function cycleTodayInfo(today) {
  const current = cycleCurrentPeriod(today);
  if (!current) return null;
  const avgCycleLen = cycleAvgCycleLength();
  const avgPeriodLen = cycleAvgPeriodLength();
  const day = daysBetween(new Date(current.startDate + "T00:00:00"), new Date(today + "T00:00:00")) + 1;
  const phase = cyclePhaseForDay(day, avgCycleLen, avgPeriodLen);
  const fertility = cycleFertilityForDay(day, avgCycleLen, avgPeriodLen);
  const predictedNextStart = addDays(current.startDate, avgCycleLen);
  const daysToNext = daysBetween(new Date(today + "T00:00:00"), new Date(predictedNextStart + "T00:00:00"));
  return { current, day, avgCycleLen, avgPeriodLen, phase, fertility, predictedNextStart, daysToNext, isOpen: !current.endDate };
}

// Keeps the pre-existing wellness enum field in sync so History's day
// editor and anything built on WELLNESS_ENUM_FIELDS.cyclePhase keep
// working exactly as before — it's just auto-filled from the
// prediction now instead of manually tapped in.
function cycleSyncTodaysWellnessPhase(todaysEntry, info) {
  const label = info ? info.phase.label.replace(/^Late /, "") : null;
  if (label && todaysEntry.cyclePhase !== label) {
    todaysEntry.cyclePhase = label;
    scheduleSave();
  }
}

function renderCycleTrackerRowInner(todaysEntry, today, onDone) {
  if (!state.cycle.periods.length) {
    const row = el(`
      <button type="button" class="cycle-tracker-row">
        <span class="cycle-tracker-icon cycle-off">${iconSvg(cycleDropSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="14" height="14"')}</span>
        <span class="cycle-tracker-text">
          <span class="cycle-tracker-title">Cycle</span>
          <span class="cycle-tracker-sub">Let's find your rhythm</span>
        </span>
        <span class="cycle-tracker-value muted">Set up</span>
      </button>
    `);
    row.addEventListener("click", () => activateTab("cycle"));
    return row;
  }
  const info = cycleTodayInfo(today);
  cycleSyncTodaysWellnessPhase(todaysEntry, info);
  const row = el(`
    <button type="button" class="cycle-tracker-row predicted">
      <span class="cycle-tracker-icon" style="background:var(--cyc-light);border-color:var(--cyc-light);color:${info.phase.color};">${iconSvg(cycleDropSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="14" height="14"')}</span>
      <span class="cycle-tracker-text">
        <span class="cycle-tracker-title">Cycle &middot; Day ${info.day}</span>
        <span class="cycle-tracker-sub">${escapeHtml(info.phase.label)}</span>
      </span>
      <span class="cycle-tracker-value" style="background:${info.phase.color};color:#fff;">${escapeHtml(info.phase.label)}</span>
    </button>
  `);
  row.addEventListener("click", () => activateTab("cycle"));
  return row;
}

// The two Home nudges Veronika asked for — same visual family as the
// existing Connections reconnect nudge, so this reads as a familiar
// pattern rather than a new kind of interruption. Recomputed every
// render, no separate "seen it" state to manage, except the one small
// per-period ack below so tapping "Still going" doesn't just re-show
// the same card again a second later on the very same day.
function renderCycleNudges(today, onDone) {
  if (!state.cycle.periods.length) return null;
  const info = cycleTodayInfo(today);
  const wrap = el(`<div></div>`);
  let any = false;

  if (!info.isOpen && info.daysToNext <= 1) {
    any = true;
    const text =
      info.daysToNext === 1
        ? "Your period is predicted to start <strong>tomorrow</strong>, based on your average."
        : info.daysToNext === 0
        ? "Your period is predicted to start <strong>today</strong>, based on your average."
        : `Your period was predicted <strong>${Math.abs(info.daysToNext)} day${Math.abs(info.daysToNext) === 1 ? "" : "s"} ago</strong>.`;
    const card = el(`
      <div class="cyc-nudge-card">
        <span class="cyc-nudge-icon">🩸</span>
        <span class="cyc-nudge-text">${text}</span>
        <button type="button" class="cyc-nudge-btn">Log it</button>
      </div>
    `);
    card.querySelector(".cyc-nudge-btn").addEventListener("click", () => openCycleLogPeriodSheet(today, onDone));
    wrap.appendChild(card);
  }

  if (info.isOpen && info.day > info.avgPeriodLen && info.current.ackStillGoingDate !== today) {
    any = true;
    const over = info.day - info.avgPeriodLen;
    const card = el(`
      <div class="cyc-nudge-card">
        <span class="cyc-nudge-icon">🩸</span>
        <span class="cyc-nudge-text">Still on your period? Day <strong>${info.day}</strong> is ${over} day${over === 1 ? "" : "s"} longer than your usual ${info.avgPeriodLen}.</span>
        <div class="cyc-nudge-row">
          <button type="button" class="cyc-nudge-btn still-going">Still going</button>
          <button type="button" class="cyc-nudge-btn ghost it-ended">It ended</button>
        </div>
      </div>
    `);
    card.querySelector(".still-going").addEventListener("click", () => {
      info.current.ackStillGoingDate = today;
      state.cycle.updatedAt = new Date().toISOString();
      scheduleSave();
      onDone();
    });
    card.querySelector(".it-ended").addEventListener("click", () => openCycleEndPeriodSheet(info.current, today, onDone));
    wrap.appendChild(card);
  }

  return any ? wrap : null;
}

// Cycle's own Home nudges (period due soon / still going past the usual
// length) — Cycle itself is just another tile in the unified apps grid
// now (2026-09), but these two reminders are specific to whether Cycle
// is even on, so they still get their own small banner above the grid.
function renderExtraTrackersSection(today, onDone) {
  if (!state.extraTrackers?.cycle) return null;
  return renderCycleNudges(today, onDone);
}

// A small bottom sheet, the same chrome as Sobriety's reset sheet
// (.sheet-overlay/.sheet-box/.sheet-primary-btn) — logging a period
// start is the one new piece of manual input the whole feature runs
// on. defaultDate lets the Home/full-screen "it started" actions and
// the overdue nudge all default sensibly instead of always assuming
// today.
function openCycleLogPeriodSheet(defaultDate, onDone) {
  const isFirst = !state.cycle.periods.length;
  const suggestedLen = cycleAvgPeriodLength();
  const overlay = el(`
    <div class="sheet-overlay">
      <div class="sheet-box" style="max-width:400px;">
        <button type="button" class="icon-btn sheet-close" aria-label="Close">${closeSvg}</button>
        <div class="onboarding-headline">${isFirst ? "Let's find your rhythm" : "Log your period"}</div>
        <div class="onboarding-subline">${
          isFirst
            ? "One start date and about how many days it usually runs is enough to start predicting — Addley gets more accurate every period after this."
            : "This is the one thing that powers everything else — your predicted phase, your next period, your average."
        }</div>
        <div class="cyc-field" style="text-align:left;">
          <label>${isFirst ? "Last period started" : "Start date"}</label>
          <input type="date" class="cyc-input cyc-start-input" value="${escapeHtml(defaultDate)}" max="${escapeHtml(todayISO())}" />
        </div>
        ${
          isFirst
            ? ""
            : `<div class="cyc-field" style="text-align:left;">
                <label>How's the flow, if you know yet</label>
                <div class="cyc-toggle-row cyc-flow-row">
                  ${CYCLE_FLOW_OPTIONS.map((f, i) => `<div class="cyc-toggle${i === 0 ? " sel" : ""}" data-flow="${f}">${f}</div>`).join("")}
                </div>
              </div>`
        }
        <div class="cyc-field" style="text-align:left;">
          <label>Usually lasts about</label>
          <div class="cyc-toggle-row cyc-len-row">
            ${[4, 5, 6, 7].map((n) => `<div class="cyc-toggle${n === Math.min(7, Math.max(4, suggestedLen)) ? " sel" : ""}" data-len="${n}">${n === 7 ? "7+" : `${n} days`}</div>`).join("")}
          </div>
        </div>
        <button type="button" class="sheet-primary-btn cyc-log-save">${isFirst ? "Start predicting" : "Save"}</button>
      </div>
    </div>
  `);
  let flow = CYCLE_FLOW_OPTIONS[0];
  overlay.querySelectorAll(".cyc-flow-row .cyc-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      overlay.querySelectorAll(".cyc-flow-row .cyc-toggle").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      flow = btn.dataset.flow;
    });
  });
  let len = Math.min(7, Math.max(4, suggestedLen));
  overlay.querySelectorAll(".cyc-len-row .cyc-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      overlay.querySelectorAll(".cyc-len-row .cyc-toggle").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      len = Number(btn.dataset.len);
    });
  });

  const close = () => overlay.remove();
  overlay.querySelector(".sheet-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector(".cyc-log-save").addEventListener("click", () => {
    const startDate = overlay.querySelector(".cyc-start-input").value || defaultDate;
    state.cycle.manualPeriodLengthDays = len;

    // Never leave two periods open at once — if the previous one was
    // never closed, this new start date is exactly the signal that it
    // must have ended, so close it out the day before.
    const openPrev = cycleSortedPeriods().find((p) => !p.endDate && p.startDate < startDate);
    if (openPrev) openPrev.endDate = addDays(startDate, -1);

    const period = { id: nextId(), startDate, endDate: null, flow: isFirst ? null : flow };
    if (isFirst) {
      // A first-time setup date is describing a period that's already
      // over, not one starting today — close it immediately using the
      // length just given, so it seeds cycleAvgPeriodLength as real
      // data right away instead of sitting open indefinitely.
      period.endDate = addDays(startDate, len - 1);
    }
    state.cycle.periods.push(period);
    state.cycle.updatedAt = new Date().toISOString();
    scheduleSave();
    close();
    onDone();
  });
  document.body.appendChild(overlay);
}

// The popup Veronika asked for specifically: tapping "It ended" never
// just stamps today's date, because by the time that's tapped the
// period may well have actually ended a day or two earlier — and that
// date is what the period-length average is built from.
function openCycleEndPeriodSheet(period, today, onDone) {
  const yesterday = addDays(today, -1);
  const overlay = el(`
    <div class="sheet-overlay">
      <div class="sheet-box" style="max-width:400px;">
        <button type="button" class="icon-btn sheet-close" aria-label="Close">${closeSvg}</button>
        <div class="onboarding-headline">When did it end?</div>
        <div class="onboarding-subline">Started ${escapeHtml(activityDateShort(period.startDate))}</div>
        <div class="cyc-toggle-row" style="margin:14px 0;">
          <div class="cyc-toggle" data-date="${yesterday}">Yesterday</div>
          <div class="cyc-toggle sel" data-date="${today}">Today</div>
        </div>
        <div class="cyc-field" style="text-align:left;">
          <label>Or pick a date</label>
          <input type="date" class="cyc-input cyc-end-input" value="${escapeHtml(today)}" min="${escapeHtml(period.startDate)}" max="${escapeHtml(today)}" />
        </div>
        <button type="button" class="sheet-primary-btn cyc-end-save">Save</button>
      </div>
    </div>
  `);
  const endInput = overlay.querySelector(".cyc-end-input");
  overlay.querySelectorAll(".cyc-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      overlay.querySelectorAll(".cyc-toggle").forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      endInput.value = btn.dataset.date;
    });
  });
  endInput.addEventListener("change", () => {
    overlay.querySelectorAll(".cyc-toggle").forEach((b) => b.classList.remove("sel"));
  });

  const close = () => overlay.remove();
  overlay.querySelector(".sheet-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector(".cyc-end-save").addEventListener("click", () => {
    const chosen = endInput.value || today;
    period.endDate = chosen < period.startDate ? period.startDate : chosen;
    delete period.ackStillGoingDate;
    state.cycle.updatedAt = new Date().toISOString();
    scheduleSave();
    close();
    onDone();
  });
  document.body.appendChild(overlay);
}

// "Edit manually" on the average card — adjusts the fallback numbers
// only; once there's enough real history, cycleAvgCycleLength /
// cycleAvgPeriodLength ignore these in favor of the actual logged
// dates, same as the note on the mockup said they would.
function openCycleEditAveragesSheet(onDone) {
  const overlay = el(`
    <div class="sheet-overlay">
      <div class="sheet-box" style="max-width:400px;">
        <button type="button" class="icon-btn sheet-close" aria-label="Close">${closeSvg}</button>
        <div class="onboarding-headline">Edit your averages</div>
        <div class="onboarding-subline">Used as a fallback before you've logged enough for Addley to average from your own history — real dates always win once there's enough of them.</div>
        <div class="cyc-field" style="text-align:left;">
          <label>Cycle length (days)</label>
          <input type="number" min="10" max="90" class="cyc-input cyc-avg-cycle-input" value="${cycleAvgCycleLength()}" />
        </div>
        <div class="cyc-field" style="text-align:left;">
          <label>Period length (days)</label>
          <input type="number" min="1" max="14" class="cyc-input cyc-avg-period-input" value="${cycleAvgPeriodLength()}" />
        </div>
        <button type="button" class="sheet-primary-btn cyc-avg-save">Save</button>
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".sheet-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector(".cyc-avg-save").addEventListener("click", () => {
    const cycleLen = Number(overlay.querySelector(".cyc-avg-cycle-input").value);
    const periodLen = Number(overlay.querySelector(".cyc-avg-period-input").value);
    if (cycleLen > 0) state.cycle.manualCycleLengthDays = Math.round(cycleLen);
    if (periodLen > 0) state.cycle.manualPeriodLengthDays = Math.round(periodLen);
    state.cycle.updatedAt = new Date().toISOString();
    scheduleSave();
    close();
    onDone();
  });
  document.body.appendChild(overlay);
}

// A logged period, correctable — tapping a history row opens this
// rather than the log being permanent once entered, same as
// everywhere else in the app.
function openCycleEditPeriodSheet(period, onDone) {
  const overlay = el(`
    <div class="sheet-overlay">
      <div class="sheet-box" style="max-width:400px;">
        <button type="button" class="icon-btn sheet-close" aria-label="Close">${closeSvg}</button>
        <div class="onboarding-headline">Edit this period</div>
        <div class="cyc-field" style="text-align:left;">
          <label>Start date</label>
          <input type="date" class="cyc-input cyc-edit-start" value="${escapeHtml(period.startDate)}" max="${escapeHtml(todayISO())}" />
        </div>
        <div class="cyc-field" style="text-align:left;">
          <label>End date (leave blank if still ongoing)</label>
          <input type="date" class="cyc-input cyc-edit-end" value="${escapeHtml(period.endDate || "")}" max="${escapeHtml(todayISO())}" />
        </div>
        <button type="button" class="sheet-primary-btn cyc-edit-save">Save</button>
        <button type="button" class="btn-ghost cyc-edit-delete" style="width:100%;margin-top:10px;color:#8C3F2B;">Delete this period</button>
      </div>
    </div>
  `);
  const close = () => overlay.remove();
  overlay.querySelector(".sheet-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector(".cyc-edit-save").addEventListener("click", () => {
    const start = overlay.querySelector(".cyc-edit-start").value || period.startDate;
    const end = overlay.querySelector(".cyc-edit-end").value || null;
    period.startDate = start;
    period.endDate = end && end >= start ? end : null;
    state.cycle.updatedAt = new Date().toISOString();
    scheduleSave();
    close();
    onDone();
  });
  overlay.querySelector(".cyc-edit-delete").addEventListener("click", () => {
    state.cycle.periods = state.cycle.periods.filter((p) => p.id !== period.id);
    state.cycle.updatedAt = new Date().toISOString();
    scheduleSave();
    close();
    onDone();
  });
  document.body.appendChild(overlay);
}

// A real tab panel now, same as Sobriety (2026-09: these were the only
// two "apps" that opened as a modal popup instead of a normal tab —
// Veronika flagged the inconsistency directly). `render` is passed
// straight into every sub-sheet as its completion callback, same job
// the old `done` wrapper did, just without an overlay left to close.
function renderCyclePanel() {
  const box = document.getElementById("panel-cycle");
  if (!box) return;

  function render() {
    const today = todayISO();
    box.innerHTML = "";
    box.appendChild(el(`<h2 class="section-title serif">Cycle</h2>`));

    if (!state.cycle.periods.length) {
      box.appendChild(el(`
        <div>
          <div style="text-align:center;padding:14px 10px 4px;">
            <div class="cyc-empty-icon">${iconSvg(cycleDropSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="24" height="24" stroke="#7A3B26"')}</div>
            <div class="cyc-phase-name" style="color:var(--text);">Let's find your rhythm</div>
            <div class="cyc-phase-sub" style="max-width:280px;margin-left:auto;margin-right:auto;">Log your last period's start date and about how many days it usually runs — Addley predicts from those two numbers until it has enough of your own history to do better.</div>
          </div>
          <button type="button" class="cyc-log-btn cyc-setup-btn">When did your last period start?</button>
        </div>
      `));
      box.querySelector(".cyc-setup-btn").addEventListener("click", () => openCycleLogPeriodSheet(today, render));
      return;
    }

    const info = cycleTodayInfo(today);
    const circumference = 276.5;
    const frac = Math.max(0, Math.min(1, info.day / info.avgCycleLen));
    const offset = Math.round(circumference * (1 - frac) * 10) / 10;

    box.appendChild(el(`
      <div class="cyc-hero">
        <div class="cyc-hero-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="50" cy="50" r="44" fill="none" stroke="${info.phase.color}" stroke-width="8" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
          </svg>
          <div class="cyc-hero-inner">
            <div class="cyc-day-num">${info.day}</div>
            <div class="cyc-day-label">of ~${info.avgCycleLen}</div>
          </div>
        </div>
        <div class="cyc-phase-name" style="color:${info.phase.color};">${escapeHtml(info.phase.label)}</div>
        <div class="cyc-phase-sub">${escapeHtml(CYCLE_PHASE_INFO.find((p) => p.key === info.phase.key)?.desc || "")}</div>
        <div class="cyc-fertility cyc-fertility-${info.fertility.level}">${escapeHtml(info.fertility.label)}</div>
      </div>
    `));

    // The count-down alone ("3 days") makes you do the math yourself to
    // know whether that lands before a trip or a weekend — the actual
    // calendar date underneath it is what Veronika asked for directly.
    // Skipped once you're overdue: predictedNextStart is already in the
    // past by then, so a date there would just restate "days past due"
    // less usefully.
    const predictCell =
      info.daysToNext >= 0
        ? `<div class="cyc-predict-cell"><div class="cyc-predict-num">${info.daysToNext}</div><div class="cyc-predict-label">Days to next period</div><div class="cyc-predict-date">${escapeHtml(activityDateShort(info.predictedNextStart))}</div></div>`
        : `<div class="cyc-predict-cell"><div class="cyc-predict-num" style="color:var(--cyc-menstrual);">${info.daysToNext}</div><div class="cyc-predict-label">Days past due</div></div>`;
    box.appendChild(el(`
      <div class="cyc-predict-strip">
        ${predictCell}
        <div class="cyc-predict-cell"><div class="cyc-predict-num">${info.avgCycleLen}</div><div class="cyc-predict-label">Avg. cycle length</div></div>
      </div>
    `));

    if (info.isOpen) {
      const stillBtn = el(`<button type="button" class="cyc-log-ghost">It ended</button>`);
      stillBtn.addEventListener("click", () => openCycleEndPeriodSheet(info.current, today, render));
      box.appendChild(stillBtn);
    } else if (info.daysToNext <= 0) {
      const startedBtn = el(`<button type="button" class="cyc-log-btn period-due">My period started</button>`);
      startedBtn.addEventListener("click", () => openCycleLogPeriodSheet(today, render));
      box.appendChild(startedBtn);
      const notYetBtn = el(`<button type="button" class="cyc-log-ghost" style="margin-top:8px;">Not yet — remind me tomorrow</button>`);
      notYetBtn.addEventListener("click", () => activateTab("home"));
      box.appendChild(notYetBtn);
    } else {
      const logBtn = el(`<button type="button" class="cyc-log-ghost">Log period start</button>`);
      logBtn.addEventListener("click", () => openCycleLogPeriodSheet(today, render));
      box.appendChild(logBtn);
    }

    box.appendChild(el(`<div class="cyc-section-title">Where you are in the cycle</div>`));
    const track = el(`<div class="cyc-track"></div>`);
    CYCLE_PHASE_INFO.forEach((p) => {
      let flex = p.flex;
      if (p.key === "menstrual") flex = info.avgPeriodLen;
      if (p.key === "ovulatory") flex = Math.max(1, Math.min(3, info.avgCycleLen - 14 >= info.avgPeriodLen + 2 ? 3 : 1));
      track.appendChild(el(`<div class="cyc-seg cycle-phase-${p.key}" style="flex:${flex};"></div>`));
    });
    track.appendChild(el(`<div class="cyc-track-marker" style="left:${Math.round(frac * 100)}%;"></div>`));
    box.appendChild(track);

    box.appendChild(el(`<div class="cyc-section-title">Your average</div>`));
    const avgStrip = el(`
      <div class="cyc-avg-strip">
        <div class="cyc-avg"><div class="cyc-avg-num">${info.avgCycleLen}</div><div class="cyc-avg-label">days, cycle</div></div>
        <div class="cyc-avg-divider"></div>
        <div class="cyc-avg"><div class="cyc-avg-num">${info.avgPeriodLen}</div><div class="cyc-avg-label">days, period</div></div>
        <div class="cyc-avg-divider"></div>
        <div class="cyc-avg-note">Based on your last ${Math.min(6, cycleSortedPeriods().length)} logged period${cycleSortedPeriods().length === 1 ? "" : "s"}.</div>
      </div>
    `);
    box.appendChild(avgStrip);

    // No repeat-the-current-phase card here anymore — the hero up top
    // already names the phase, gives its one-line description, AND the
    // fertility line, so a second "About Follicular" card lower down
    // was just restating the same three facts a second time (Veronika
    // flagged this directly). Just the link now, straight to the full
    // 4-phase breakdown for anyone who wants it.
    box.appendChild(el(`<a href="#" class="cyc-see-all-phases-link" style="display:inline-block;margin-top:18px;font-size:12px;font-weight:600;color:var(--accent-dark);">See all phases &rarr;</a>`));
    box.querySelector(".cyc-see-all-phases-link").addEventListener("click", (e) => {
      e.preventDefault();
      infoModal("Cycle phases", buildCyclePhaseInfoBody(info.phase.label.replace(/^Late /, "")));
    });

    const history = cycleSortedPeriods().reverse();
    box.appendChild(el(`
      <div class="cyc-section-title" style="margin-top:26px;display:flex;align-items:baseline;justify-content:space-between;">
        <span>History</span>
        <a href="#" class="cyc-edit-avg-link" style="font-size:11px;font-weight:600;">Edit manually</a>
      </div>
    `));
    box.querySelector(".cyc-edit-avg-link").addEventListener("click", (e) => { e.preventDefault(); openCycleEditAveragesSheet(render); });
    history.forEach((p, i) => {
      const next = history[i - 1]; // one newer than p, since the list is newest-first
      const lenLabel = next ? `${daysBetween(new Date(p.startDate + "T00:00:00"), new Date(next.startDate + "T00:00:00"))}-day cycle` : "&mdash;";
      const row = el(`
        <div class="cyc-hist-row" role="button" tabindex="0">
          <div class="cyc-hist-dates">Started ${escapeHtml(activityDateShort(p.startDate))}</div>
          <div class="cyc-hist-len">${lenLabel}</div>
        </div>
      `);
      row.addEventListener("click", () => openCycleEditPeriodSheet(p, render));
      box.appendChild(row);
    });
  }

  render();
}

// ------------------------------------------------------------------
// Sobriety — a day count with teeth: a daily check-in (not just the
// calendar) is what actually confirms the count, milestones are
// re-earnable rather than permanent trophies (a reset clears the
// current grid so there's something real to work back toward, while
// a separate all-time record never moves backward), and a craving
// moment surfaces a real person to call plus a national hotline as a
// floor under that. Support contacts live in Connections, not a
// parallel list of their own — see allSupportContacts below, and
// ensureAnySocialSheetId, which means adding one from in here never
// depends on Connections having been chosen as a visible practice.
// Never "streak", never "run" anywhere in this section's copy —
// Veronika was explicit both read the same as each other, and neither
// is what this tracker is for. Doesn't touch the reward mechanic at
// all: see awardRewardForPillarLog, which only ever fires from a real
// pillar log, never from here.
// ------------------------------------------------------------------
const SOBRIETY_TIERS = [
  { key: "24h", days: 1, label: "24 Hours", color: "var(--t-24h)" },
  { key: "1wk", days: 7, label: "1 Week", color: "var(--t-1wk)" },
  { key: "30d", days: 30, label: "30 Days", color: "var(--t-30d)" },
  { key: "60d", days: 60, label: "60 Days", color: "var(--t-60d)" },
  { key: "90d", days: 90, label: "90 Days", color: "var(--t-90d)" },
  { key: "6mo", days: 182, label: "6 Months", color: "var(--t-6mo)" },
  { key: "1yr", days: 365, label: "1 Year", color: "var(--t-1yr)" },
  { key: "2yr", days: 730, label: "2 Years", color: "var(--t-2yr)" },
  { key: "3yr", days: 1095, label: "3 Years", color: "var(--t-3yr)" },
];
const SOBRIETY_MOODS = [
  { key: "steady", emoji: "😌", label: "Steady" },
  { key: "strong", emoji: "💪", label: "Strong" },
  { key: "tempted", emoji: "😣", label: "Tempted" },
  { key: "rough", emoji: "😔", label: "Rough" },
  { key: "grateful", emoji: "🙏", label: "Grateful" },
];
const SOBRIETY_INTENSITY = ["Passed quickly", "Strong, but okay", "Still hard right now"];
const SOBRIETY_HELPLINE = { name: "SAMHSA National Helpline", phone: "1-800-662-4357" };
const SOBRIETY_AFFIRMATIONS = [
  "Progress isn't a straight line. Showing up today is the whole practice.",
  "One day, fully present. That's the whole practice.",
  "You don't have to feel ready to keep going.",
  "This counts even on the quiet days.",
  "However you got here, you're here. That's what counts.",
];
const sobrietyCallSvgPath = `<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.2a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c1 .3 2 .5 3 .7a2 2 0 0 1 1.5 2z"></path>`;
const sobrietyPersonAddSvgPath = `<circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path><path d="M19 8h4M21 6v4"></path>`;

function sobrietyDayCount(today) {
  const start = new Date(state.sobriety.startDate + "T00:00:00");
  const now = new Date(today + "T00:00:00");
  return Math.max(1, daysBetween(start, now) + 1);
}
// Full 24-hour periods actually elapsed since startDate — 0 on the day
// the tracker is started/reset, 1 the next day, and so on. Milestones
// are checked against this, never against sobrietyDayCount's display
// number: that display count is 1-indexed ("Day 1" the moment you
// start) specifically so it reads well on screen, but it means "count
// >= 1" is already true the instant the tracker is added, which used
// to hand out the 24 Hours badge — and its celebration popup — before
// any actual time had passed.
function sobrietyElapsedDays(today) {
  const start = new Date(state.sobriety.startDate + "T00:00:00");
  const now = new Date(today + "T00:00:00");
  return Math.max(0, daysBetween(start, now));
}
function sobrietyAffirmation(today) {
  return SOBRIETY_AFFIRMATIONS[sobrietyDayCount(today) % SOBRIETY_AFFIRMATIONS.length];
}
function sobrietyCheckInToday(today) {
  return state.sobriety.checkIns.find((c) => c.date === today) || null;
}

// Recomputes which tiers are earned (current + all-time) against
// today's count — safe to call on every render. Returns the highest
// tier that just became newly earned THIS call (current-grid sense —
// re-crossing an already-earned all-time tier doesn't count), or null.
function sobrietyRecomputeMilestones(today) {
  const count = sobrietyDayCount(today);
  const elapsed = sobrietyElapsedDays(today);
  state.sobriety.allTimeBestDays = Math.max(state.sobriety.allTimeBestDays, count);
  let newlyEarned = null;
  SOBRIETY_TIERS.forEach((t) => {
    if (elapsed >= t.days) {
      if (!state.sobriety.milestonesAllTime[t.key]) state.sobriety.milestonesAllTime[t.key] = today;
      if (!state.sobriety.milestonesCurrent[t.key]) {
        state.sobriety.milestonesCurrent[t.key] = today;
        newlyEarned = t;
      }
    }
  });
  return newlyEarned;
}

// ---- Shared contact list — Connections and Sobriety both read/write
// the same underlying people, never a separate silo of Sobriety's own.
function allSocialSheetIds() {
  return state.sheets.filter((s) => s.kind === "custom" && state.customSheets[s.id]?.templateKey === "social").map((s) => s.id);
}
// Creates a Connections space behind the scenes the first time it's
// needed from in here, so adding a support contact never depends on
// Connections already being chosen as a visible practice. Deliberately
// skips the pillar auto-opt-in that a real Gallery add triggers (see
// createSheetFromTemplateUnchecked) — a Sobriety contact shouldn't
// silently start counting toward the Social Connection pillar — and
// stays hidden from the practice list until Connections is opened on
// its own terms.
function ensureAnySocialSheetId() {
  const existing = allSocialSheetIds();
  if (existing.length) return existing[0];
  const id = `sheet_${nextId()}`;
  state.customSheets[id] = { label: "Connections", templateKey: "social", socialSchemaV: 2, people: [], items: [] };
  state.sheets.push({ id, kind: "custom", visible: false });
  return id;
}
function allConnectionsPeople() {
  const out = [];
  allSocialSheetIds().forEach((sid) => {
    (state.customSheets[sid].people || []).forEach((p) => out.push(p));
  });
  return out;
}
function allSupportContacts() {
  return allConnectionsPeople().filter((p) => p.sobrietySupport);
}

// The Home row — sibling to Cycle's, same visual language, own icon
// and its own tap target (the full screen), never the pillar grid's
// red/green pass-fail treatment.
function renderSobrietyTrackerRowInner(today, onDone) {
  // Milestones are date-driven, not check-in-driven — this Home render
  // is the first place a new one can be noticed on any given day, so
  // it's also where the celebration fires. sobrietyRecomputeMilestones
  // marks a tier the moment it's crossed, so this only ever returns
  // non-null once per tier, however many times Home re-renders after.
  const newTier = sobrietyRecomputeMilestones(today);
  scheduleSave();
  if (newTier) setTimeout(() => openSobrietyCelebration(newTier), 0);
  const count = sobrietyDayCount(today);
  const checkedIn = !!sobrietyCheckInToday(today);
  const row = el(`
    <button type="button" class="cycle-tracker-row">
      <span class="cycle-tracker-icon ${checkedIn ? "cycle-on" : "cycle-off"}">${checkedIn ? checkSvg : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'}</span>
      <span class="cycle-tracker-text">
        <span class="cycle-tracker-title">Sobriety</span>
        <span class="cycle-tracker-sub">${checkedIn ? "Checked in for today" : "Tap to see your count"}</span>
      </span>
      <span class="cycle-tracker-value">Day ${count}</span>
    </button>
  `);
  row.addEventListener("click", () => activateTab("sobriety"));
  return row;
}

// The full screen — a real tab panel now (2026-09: Sobriety and Cycle
// used to be the only two "apps" that opened as a modal popup instead
// of a normal tab, which read as inconsistent once everything else in
// My Apps/Home behaved the same way — Veronika flagged this directly).
// Re-rendered in place after every action so the count/milestones/
// history are always current, same as it did as a modal.
function renderSobrietyPanel() {
  const box = document.getElementById("panel-sobriety");
  if (!box) return;

  function render() {
    const today = todayISO();
    sobrietyRecomputeMilestones(today);
    scheduleSave();
    const count = sobrietyDayCount(today);
    const checkedIn = sobrietyCheckInToday(today);

    box.innerHTML = "";
    box.appendChild(el(`<h2 class="section-title serif">Sobriety</h2>`));

    box.appendChild(el(`
      <div class="sob-hero">
        <div class="sob-hero-icon">${iconSvg('<path d="M12 21c-4-3-7-6.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 3.5-3 7-7 10-1.5-.9-2.7-1.8-3.9-2.7"></path>').replace('class="tab-icon" width="20" height="20"', 'width="26" height="26" stroke="#fff"')}</div>
        <div class="sob-count">${count}</div>
        <div class="sob-count-label">day${count === 1 ? "" : "s"}</div>
        <div class="sob-since">Since ${activityDateShort(state.sobriety.startDate)}</div>
      </div>
      <div class="sob-affirmation">"${escapeHtml(sobrietyAffirmation(today))}"</div>
    `));

    if (checkedIn) {
      const done = el(`
        <button type="button" class="checkin-done">
          <span class="checkin-done-icon">${checkSvg}</span>
          <span>
            <div class="checkin-done-title">Checked in for Day ${count}</div>
            <div class="checkin-done-sub">${SOBRIETY_MOODS.find((m) => m.key === checkedIn.mood)?.label || ""} — tap to edit today's entry.</div>
          </span>
        </button>
      `);
      done.addEventListener("click", () => openSobrietyCheckInCard(box, today, checkedIn, render));
      box.appendChild(done);
    } else {
      box.appendChild(buildSobrietyCheckInCard(today, null, render));
    }

    const whyLink = el(`<button type="button" class="why-edit-link" style="margin-top:8px;">${state.sobriety.whyItems.length ? "Edit your why" : "+ Add your why"}</button>`);
    whyLink.addEventListener("click", () => openSobrietyWhyEditor(render));
    box.appendChild(whyLink);

    // ---- Your record — permanent, plus the re-earnable grid below ----
    box.appendChild(el(`<div class="alltime-title">Your record</div>`));
    const strip = el(`<div class="alltime-strip"></div>`);
    strip.appendChild(el(`
      <div class="alltime-best">
        <div class="alltime-best-num">${state.sobriety.allTimeBestDays}</div>
        <div class="alltime-best-label">longest yet</div>
      </div>
      <div class="alltime-divider"></div>
    `));
    const chips = el(`<div class="alltime-chips"></div>`);
    SOBRIETY_TIERS.forEach((t) => {
      if (!state.sobriety.milestonesAllTime[t.key]) return;
      chips.appendChild(el(`
        <div class="alltime-medal-mini" style="background: radial-gradient(circle at 35% 30%, #fff, ${t.color} 75%);" title="${escapeHtml(t.label)}">${checkSvg}</div>
      `));
    });
    strip.appendChild(chips);
    box.appendChild(strip);

    box.appendChild(el(`<div class="milestone-section-title">Milestones</div>`));
    box.appendChild(el(`<div class="milestone-section-sub">Every one of these is earnable again, no matter how many times you've hit it before.</div>`));
    const grid = el(`<div class="pr-badge-grid"></div>`);
    SOBRIETY_TIERS.forEach((t) => {
      const earnedDate = state.sobriety.milestonesCurrent[t.key];
      const badge = earnedDate
        ? el(`
            <div class="pr-badge">
              <div class="pr-badge-medal earned" style="background: radial-gradient(circle at 35% 30%, #fff, ${t.color} 75%);">${checkSvg}</div>
              <div class="pr-badge-text">
                <div class="lbl">${escapeHtml(t.label)}</div>
                <div class="sub earned-date">Earned ${activityDateShort(earnedDate)}</div>
              </div>
            </div>
          `)
        : el(`
            <div class="pr-badge">
              <div class="pr-badge-medal locked" style="border-color:${t.color};color:${t.color};">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"></circle></svg>
              </div>
              <div class="pr-badge-text">
                <div class="lbl">${escapeHtml(t.label)}</div>
                <div class="sub">Not yet</div>
              </div>
            </div>
          `);
      grid.appendChild(badge);
    });
    box.appendChild(grid);

    // ---- Recent check-ins ----
    const recent = [...state.sobriety.checkIns].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
    if (recent.length) {
      box.appendChild(el(`<div class="history-title">Recent check-ins</div>`));
      recent.forEach((c) => {
        const mood = SOBRIETY_MOODS.find((m) => m.key === c.mood);
        box.appendChild(el(`
          <div class="history-row">
            <div class="history-emoji">${mood?.emoji || "•"}</div>
            <div>
              <span class="history-day">${escapeHtml(c.date)}</span>
              ${c.note ? `<div class="history-note">${escapeHtml(c.note)}</div>` : ""}
            </div>
          </div>
        `));
      });
    }

    const resetLink = el(`<button type="button" class="sob-reset-link">Had a slip? Log it here</button>`);
    resetLink.addEventListener("click", () => openSobrietyResetSheet(render));
    box.appendChild(resetLink);
  }

  render();
}

// Swaps the check-in card in place (used both for the initial full
// render and for re-opening an already-checked-in day to edit it).
function openSobrietyCheckInCard(box, today, existing, onDone) {
  const old = box.querySelector(".checkin-card, .checkin-done");
  const fresh = buildSobrietyCheckInCard(today, existing, onDone);
  old.replaceWith(fresh);
}

// The check-in itself: mood chips, an inline craving branch when
// "Tempted" is picked (intensity + Your Why + a support contact or the
// national hotline), and an optional journal line. Submitting is what
// actually confirms the day — the count itself stays date-math-based
// either way, this is what makes it trustworthy.
function buildSobrietyCheckInCard(today, existing, onDone) {
  const card = el(`
    <div class="checkin-card">
      <div class="checkin-title">How are you today?</div>
      <div class="checkin-sub">This is what actually confirms Day ${sobrietyDayCount(today)} — a real check-in, not just the calendar.</div>
      <div class="checkin-mood-row"></div>
    </div>
  `);
  const moodRow = card.querySelector(".checkin-mood-row");
  let selectedMood = existing?.mood || null;
  let selectedIntensity = existing?.cravingIntensity || null;
  let cravingBox = null;

  function renderCravingBranch() {
    if (cravingBox) cravingBox.remove();
    if (selectedMood !== "tempted") { cravingBox = null; return; }
    cravingBox = el(`<div class="craving-expand"></div>`);
    cravingBox.appendChild(el(`<div class="craving-label">How strong was it?</div>`));
    const row = el(`<div class="craving-intensity-row"></div>`);
    SOBRIETY_INTENSITY.forEach((label) => {
      const chip = el(`<div class="craving-chip${selectedIntensity === label ? " sel" : ""}">${escapeHtml(label)}</div>`);
      chip.addEventListener("click", () => {
        selectedIntensity = label;
        row.querySelectorAll(".craving-chip").forEach((c) => c.classList.toggle("sel", c === chip));
      });
      row.appendChild(chip);
    });
    cravingBox.appendChild(row);

    if (state.sobriety.whyItems.length) {
      const why = el(`<div class="why-card" style="margin-top:0;margin-bottom:12px;"><div class="why-title-row"><div class="why-title">Your why</div></div></div>`);
      state.sobriety.whyItems.forEach((w) => why.appendChild(el(`<div class="why-item"><span class="dot"></span>${escapeHtml(w)}</div>`)));
      cravingBox.appendChild(why);
    }

    const contacts = allSupportContacts();
    if (contacts.length) {
      contacts.forEach((p) => {
        cravingBox.appendChild(el(`
          <div class="support-row">
            <div class="support-avatar">${escapeHtml((p.name.trim()[0] || "?").toUpperCase())}</div>
            <div><span class="support-name">${escapeHtml(p.name)}</span></div>
            ${p.phone ? `<a href="tel:${escapeHtml(p.phone)}" class="support-call" title="Call ${escapeHtml(p.name)}">${iconSvg(sobrietyCallSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="15" height="15"')}</a>` : ""}
          </div>
        `));
      });
    } else {
      const addBtn = el(`<button type="button" class="add-support-btn">${iconSvg(sobrietyPersonAddSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="16" height="16"')} Add someone you can call</button>`);
      addBtn.addEventListener("click", () => openSobrietySupportPicker(() => { renderCravingBranch(); }));
      cravingBox.appendChild(addBtn);
    }

    cravingBox.appendChild(el(`
      <div class="helpline-row">
        <div class="helpline-icon">${iconSvg(sobrietyCallSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="14" height="14"')}</div>
        <div class="helpline-text">Or talk to someone now: <b>${escapeHtml(SOBRIETY_HELPLINE.name)}</b>, ${escapeHtml(SOBRIETY_HELPLINE.phone)} — free, confidential, 24/7.</div>
      </div>
    `));
    moodRow.insertAdjacentElement("afterend", cravingBox);
  }

  SOBRIETY_MOODS.forEach((m) => {
    const chip = el(`<div class="checkin-mood${selectedMood === m.key ? " sel" : ""}"><span class="emoji">${m.emoji}</span><span class="lbl">${escapeHtml(m.label)}</span></div>`);
    chip.addEventListener("click", () => {
      selectedMood = m.key;
      moodRow.querySelectorAll(".checkin-mood").forEach((c) => c.classList.toggle("sel", c === chip));
      renderCravingBranch();
    });
    moodRow.appendChild(chip);
  });
  renderCravingBranch();

  const journal = el(`<textarea class="checkin-journal" placeholder="Anything you want to remember about today? (optional)" style="margin-top:12px;"></textarea>`);
  journal.value = existing?.note || "";
  card.appendChild(journal);

  const btn = el(`<button type="button" class="checkin-btn">${existing ? "Save" : "Check in for today"}</button>`);
  btn.addEventListener("click", () => {
    if (!selectedMood) return;
    const entry = existing || { date: today };
    entry.mood = selectedMood;
    entry.cravingIntensity = selectedMood === "tempted" ? selectedIntensity : null;
    entry.note = journal.value.trim();
    if (!existing) state.sobriety.checkIns.push(entry);
    const newTier = sobrietyRecomputeMilestones(today);
    scheduleSave();
    onDone();
    if (newTier) openSobrietyCelebration(newTier);
  });
  card.appendChild(btn);
  return card;
}

// Picking (or adding) a support contact — reads and writes the same
// Connections people Connections itself shows, never a parallel list.
function openSobrietySupportPicker(onDone) {
  const people = allConnectionsPeople();
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Someone you can call</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form"></div>
      </div>
    </div>
  `);
  const form = overlay.querySelector(".wardrobe-item-form");
  if (people.length) {
    form.appendChild(el(`<label class="muted">Pick from your Connections</label>`));
    people.forEach((p) => {
      const row = el(`<div class="import-row"><span>${escapeHtml(p.name)}${p.phone ? ` &middot; ${escapeHtml(p.phone)}` : ""}</span><button type="button">Use this</button></div>`);
      row.querySelector("button").addEventListener("click", () => {
        p.sobrietySupport = true;
        scheduleSave();
        overlay.remove();
        onDone();
      });
      form.appendChild(row);
    });
  }
  form.appendChild(el(`<label class="muted" style="margin-top:${people.length ? "14px" : "0"};">Or add someone new</label>`));
  form.appendChild(el(`<input type="text" class="ssp-name" placeholder="Name" />`));
  form.appendChild(el(`<input type="tel" class="ssp-phone" placeholder="Phone (optional)" />`));
  const saveBtn = el(`<button type="button" class="btn-primary" style="margin-top:12px;width:100%;">Add</button>`);
  saveBtn.addEventListener("click", () => {
    const name = overlay.querySelector(".ssp-name").value.trim();
    if (!name) return;
    const phone = overlay.querySelector(".ssp-phone").value.trim();
    const sheetId = ensureAnySocialSheetId();
    const sheet = state.customSheets[sheetId];
    sheet.people ||= [];
    sheet.people.push({ id: nextId(), name, phone, sobrietySupport: true });
    scheduleSave();
    overlay.remove();
    onDone();
  });
  form.appendChild(saveBtn);

  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// A quiet celebration, colored to the tier just earned — no confetti,
// no repeat-count callout ("you've hit this 3 times" was explicitly
// ruled out), just a beat of acknowledgment before "Keep going".
function openSobrietyCelebration(tier) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box info-modal-box" style="width:340px;text-align:center;">
        <div class="celebrate-toast" style="flex-direction:column;text-align:center;">
          <div class="celebrate-badge" style="background:${tier.color};width:56px;height:56px;">${checkSvg}</div>
          <div>
            <div class="celebrate-title">${escapeHtml(tier.label)}</div>
            <div class="celebrate-sub">However you got here, you're here. That's what counts.</div>
          </div>
        </div>
        <button type="button" class="sheet-primary-btn sob-celebrate-btn" style="background:${tier.color};">Keep going</button>
      </div>
    </div>
  `);
  overlay.querySelector(".sob-celebrate-btn").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// Logging a reset — the record and all-time chips are untouched; only
// startDate moves to today and the current-tier grid clears, so
// there's something real to re-earn starting tomorrow. Your Why and a
// support contact (or the hotline) surface here too, same as the
// craving branch — the last stop before it happens, not just the
// first.
function openSobrietyResetSheet(onDone) {
  const overlay = el(`
    <div class="sheet-overlay">
      <div class="sheet-box" style="max-width:400px;">
        <button type="button" class="icon-btn sheet-close" aria-label="Close">${closeSvg}</button>
        <div class="link-empty-icon">${iconSvg('<path d="M12 21c-4-3-7-6.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 3.5-3 7-7 10-1.5-.9-2.7-1.8-3.9-2.7"></path>').replace('class="tab-icon" width="20" height="20"', 'width="28" height="28" stroke="#fff"')}</div>
        <div class="onboarding-headline" style="margin-top:10px;">This counts, not against you</div>
        <div class="onboarding-subline">Logging today starts your count over at <b>Day 1</b>. Your <b>longest stretch stays at ${state.sobriety.allTimeBestDays} days</b> — and every milestone is yours to earn all over again, starting with 24 Hours tomorrow.</div>
        ${
          state.sobriety.whyItems.length
            ? `<div class="why-card" style="text-align:left;"><div class="why-title-row"><div class="why-title">Before you do — your why</div></div>${state.sobriety.whyItems.map((w) => `<div class="why-item"><span class="dot"></span>${escapeHtml(w)}</div>`).join("")}</div>`
            : ""
        }
        <div class="sobriety-reset-support"></div>
        <div class="helpline-row" style="text-align:left;">
          <div class="helpline-icon">${iconSvg(sobrietyCallSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="14" height="14"')}</div>
          <div class="helpline-text">No one tagged? ${escapeHtml(SOBRIETY_HELPLINE.name)} is ${escapeHtml(SOBRIETY_HELPLINE.phone)}, free and 24/7.</div>
        </div>
        <div class="sobriety-sheet-actions">
          <button type="button" class="btn-ghost sob-reset-cancel">Not now</button>
          <button type="button" class="sheet-primary-btn sob-reset-confirm">Log it</button>
        </div>
      </div>
    </div>
  `);
  const supportSlot = overlay.querySelector(".sobriety-reset-support");
  allSupportContacts().forEach((p) => {
    supportSlot.appendChild(el(`
      <div class="support-row">
        <div class="support-avatar">${escapeHtml((p.name.trim()[0] || "?").toUpperCase())}</div>
        <div><span class="support-name">${escapeHtml(p.name)}</span></div>
        ${p.phone ? `<a href="tel:${escapeHtml(p.phone)}" class="support-call" title="Call ${escapeHtml(p.name)}">${iconSvg(sobrietyCallSvgPath).replace('class="tab-icon" width="20" height="20"', 'width="15" height="15"')}</a>` : ""}
      </div>
    `));
  });

  overlay.querySelector(".sheet-close").addEventListener("click", () => overlay.remove());
  overlay.querySelector(".sob-reset-cancel").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector(".sob-reset-confirm").addEventListener("click", () => {
    state.sobriety.lastResetDate = todayISO();
    state.sobriety.startDate = todayISO();
    state.sobriety.milestonesCurrent = {};
    scheduleSave();
    overlay.remove();
    onDone();
    renderHome();
  });
  document.body.appendChild(overlay);
}

// Editing "Your why" — a short, personal, editable list resurfaced
// both inside a craving check-in and again right before a reset.
function openSobrietyWhyEditor(onDone) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-box wardrobe-modal-box">
        <div class="info-modal-header">
          <h3>Your why</h3>
          <button type="button" class="icon-btn info-modal-close" aria-label="Close">${closeSvg}</button>
        </div>
        <div class="wardrobe-item-form">
          <label class="muted">One reason per line</label>
          <textarea class="sob-why-text" rows="5">${escapeHtml(state.sobriety.whyItems.join("\n"))}</textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-primary sob-why-save">Save</button>
        </div>
      </div>
    </div>
  `);
  overlay.querySelector(".info-modal-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector(".sob-why-save").addEventListener("click", () => {
    state.sobriety.whyItems = overlay
      .querySelector(".sob-why-text")
      .value.split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    scheduleSave();
    overlay.remove();
    onDone();
  });
  document.body.appendChild(overlay);
}

// One always-visible card for everything not already pinned to the bottom
// bar. Deliberately never collapsed — spaces you added on purpose
// shouldn't need a tap just to be seen. Shows only what ISN'T one of the
// first MOBILE_PINNED_COUNT bar icons, so nothing appears twice between
// the bar and this card. Capped at 6 tiles before a 7th "See all" tile
// takes over (a screen-size limit, the same for every plan); under that,
// an explicit "Add a space" tile closes out the grid so there's always
// one visible, obvious way in — never a hidden gesture.
function homeGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

// Lives in the You sheet now, not Home — it used to sit between Trends
// and History on Home for no real reason connected to either. `wrapInCard`
// exists because Home wrapped it in its own `.card`, while the You sheet
// already provides that container.
function renderIdentityQuote(panel, wrapInCard = true) {
  const prize = state.veronikasPrize;
  const container = wrapInCard ? el(`<div class="card"></div>`) : panel;

  const quoteBox = el(`
    <div class="prize-quote">
      <textarea class="auto-grow" rows="2" placeholder="Who do you say you are?">${escapeHtml(prize.quote)}</textarea>
    </div>
  `);
  const quoteTextarea = quoteBox.querySelector("textarea");
  const autoGrowQuote = () => {
    quoteTextarea.style.height = "auto";
    quoteTextarea.style.height = quoteTextarea.scrollHeight + "px";
  };
  quoteTextarea.addEventListener("input", autoGrowQuote);
  quoteTextarea.addEventListener("change", (e) => {
    prize.quote = e.target.value;
    scheduleSave();
  });
  container.appendChild(quoteBox);
  requestAnimationFrame(autoGrowQuote);

  if (wrapInCard) panel.appendChild(container);
}


function renderWellnessHistory(panel, today) {
  const section = el(`
    <details class="card">
      <summary class="book-summary" style="margin-bottom:2px;"><span class="home-section-title-group"><span class="home-section-icon">🗓️</span><span class="subsection-title serif" style="margin:0;">History</span></span></summary>
    </details>
  `);
  panel.appendChild(section);
  panel = section;

  const history = state.wellness.filter((l) => l.logDate !== today && Object.keys(l).some((k) => l[k] && k !== "id" && k !== "logDate"));

  if (!history.length) {
    panel.appendChild(el(`<div class="muted">No past entries yet — once you log a few days, they'll show up here grouped by month.</div>`));
    return;
  }

  const byYear = new Map();
  history
    .sort((a, b) => (a.logDate < b.logDate ? 1 : -1))
    .forEach((l) => {
      const [y, m] = l.logDate.split("-");
      const yearKey = y;
      const monthKey = `${y}-${m}`;
      if (!byYear.has(yearKey)) byYear.set(yearKey, new Map());
      const months = byYear.get(yearKey);
      if (!months.has(monthKey)) months.set(monthKey, []);
      months.get(monthKey).push(l);
    });

  [...byYear.entries()].forEach(([year, months], yi) => {
    const yearDetails = el(`<details class="book-group" ${yi === 0 ? "open" : ""}><summary class="book-summary"><span class="book-title">${year}</span></summary></details>`);
    [...months.entries()].forEach(([monthKey, entries], mi) => {
      const monthDetails = el(`
        <details class="book-group" style="padding-left:14px;" ${yi === 0 && mi === 0 ? "open" : ""}>
          <summary class="book-summary"><span>${monthLabel(monthKey)}</span><span class="muted">${entries.length} ${entries.length === 1 ? "entry" : "entries"}</span></summary>
        </details>
      `);
      entries.forEach((l) => {
        const badges = [...WELLNESS_YESNO_FIELDS.map(([k]) => k), ...Object.keys(WELLNESS_ENUM_FIELDS)]
          .filter((k) => l[k])
          .map((k) => `<span class="wellness-badge ${wellnessColorClass(k, l[k])}">${l[k]}</span>`)
          .join(" ");
        const notesHtml = WELLNESS_NOTE_FIELDS.filter(([k]) => l[k])
          .map(([k, label]) => `<div class="wellness-history-note"><span class="muted">${escapeHtml(label)}</span> ${escapeHtml(l[k])}</div>`)
          .join("");
        const entryEl = el(`
          <div class="wellness-history-entry">
            <div class="row wellness-history-row">
              <div style="flex:1;">${l.logDate}</div>
              <div>${badges || '<span class="muted">&mdash;</span>'}</div>
              <button type="button" class="wellness-history-edit-btn" title="Edit ${escapeHtml(l.logDate)}" aria-label="Edit ${escapeHtml(l.logDate)}">Edit</button>
            </div>
            ${notesHtml}
          </div>
        `);
        entryEl.querySelector(".wellness-history-edit-btn").addEventListener("click", () => {
          openWellnessDayEditor(l.logDate, () => renderHome());
        });
        monthDetails.appendChild(entryEl);
      });
      yearDetails.appendChild(monthDetails);
    });
    panel.appendChild(yearDetails);
  });
}

// ------------------------------------------------------------------
// Boot
// ------------------------------------------------------------------
// First-run setup: six pillars, one practice each, arranged into a
// four-slot Home toolbar and a two-item Additional Practices group. Sleep,
// Social, Learning, and Food each have exactly one built-in practice today,
// so those fill in with no tap required — only Spiritual and Movement have
// more than one option, so those are the only real choices made here.
const ONBOARDING_SPIRITUAL_OPTIONS = [
  { key: "prayer", label: "Prayer log" },
  { key: "quran", label: "Qur'an reading" },
  { key: "breathe", label: "Breathe / meditation" },
];
const ONBOARDING_MOVEMENT_OPTIONS = [
  { key: "workout", label: "Workout log" },
  { key: "activity", label: "Daily activity" },
];
// Same stroke-icon style as the rest of the app (iconSvg/sheetIcon), not
// emoji — emoji render inconsistently across platforms and read younger/
// more novelty than the rest of Addley's visual language.
const ONBOARDING_PILLAR_META = {
  movement: {
    name: "Movement",
    icon: `<rect x="1.5" y="9" width="3" height="6" rx="1"></rect><rect x="19.5" y="9" width="3" height="6" rx="1"></rect><rect x="5.5" y="7" width="2.5" height="10" rx="1"></rect><rect x="16" y="7" width="2.5" height="10" rx="1"></rect><line x1="8" y1="12" x2="16" y2="12"></line>`,
  },
  spiritualAnchor: {
    name: "Spiritual",
    icon: `<path d="M12 2v6"></path><path d="M8.5 8c0 2 1 3.5 3.5 3.5S15.5 10 15.5 8"></path><rect x="9.5" y="11" width="5" height="10" rx="1"></rect>`,
  },
  sleepProtected: {
    name: "Sleep",
    icon: `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>`,
  },
  socialConnection: {
    name: "Social",
    icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
  },
  learning: {
    name: "Learning",
    icon: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M9 7h7"></path>`,
  },
  food: {
    name: "Food",
    icon: `<path d="M11 2a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3v8"></path><path d="M18 2v9a3 3 0 0 1-3 3"></path><path d="M18 2v20"></path>`,
  },
};
function onboardingPillarIconSvg(key) {
  return iconSvg(ONBOARDING_PILLAR_META[key].icon);
}

function showOnboardingFlow() {
  const STEPS = ["welcome", "spiritual", "movement", "toolbar", "review", "rewardAsk", "rewardDetails", "rewardPhoto", "rewardLink"];
  let stepIdx = 0;
  let spiritualChoice = null;
  let movementChoice = null;
  let toolbarOrder = ["movement", "spiritualAnchor", "sleepProtected", "food"];
  let extraOrder = ["socialConnection", "learning"];

  // The reward ask is the one branch point in onboarding: "rewardDetails",
  // "rewardPhoto", and "rewardLink" only get visited if she opts in on
  // "rewardAsk" — choosing "Not right now" jumps straight to
  // finishOnboarding, same as if those steps didn't exist.
  let wantsReward = true;
  let rewardName = "";
  let rewardGoalDollars = 500;
  let rewardTargetDays = 90;
  let rewardPhotoDataUrl = null;
  // finishOnboarding can legitimately fire twice for the reward branch — a
  // successful Plaid link calls it directly, but so does the "I'll link
  // this later" skip button, and either could theoretically double-fire.
  // This guards the reward-writing block specifically, independent of
  // prize.enabled (which may already be true on an account whose reward
  // predates onboarding becoming opt-in).
  let rewardApplied = false;

  const overlay = el(`<div class="onboarding-overlay"><div class="onboarding-box" id="onboardingBox"></div></div>`);
  document.body.appendChild(overlay);
  const box = overlay.querySelector("#onboardingBox");

  function dotsHtml() {
    return `<div class="onboarding-dots">${STEPS.map((_, i) => `<span class="onboarding-dot${i === stepIdx ? " active" : ""}"></span>`).join("")}</div>`;
  }

  function renderStep() {
    box.innerHTML = dotsHtml();
    const step = STEPS[stepIdx];

    if (step === "welcome") {
      box.insertAdjacentHTML("beforeend", `
        <div class="onboarding-eyebrow">Welcome to Addley</div>
        <div class="onboarding-headline">Let's set up your six pillars</div>
        <div class="onboarding-subline">Movement, Spiritual, Sleep, Social, Learning, Food. Pick one practice for each to start — you can always add more later.</div>
        <div class="onboarding-pillar-list">
          ${Object.keys(ONBOARDING_PILLAR_META).map((key) => {
            const meta = ONBOARDING_PILLAR_META[key];
            return `<div class="onboarding-pillar-card"><div class="onboarding-pillar-icon">${onboardingPillarIconSvg(key)}</div><div class="onboarding-pillar-name">${escapeHtml(meta.name)}</div></div>`;
          }).join("")}
        </div>
        <button type="button" class="sheet-primary-btn">Get started</button>
      `);
      box.querySelector(".sheet-primary-btn").addEventListener("click", () => { stepIdx++; renderStep(); });
    }

    if (step === "spiritual" || step === "movement") {
      const isSpiritual = step === "spiritual";
      const options = isSpiritual ? ONBOARDING_SPIRITUAL_OPTIONS : ONBOARDING_MOVEMENT_OPTIONS;
      const pillarKeyForStep = isSpiritual ? "spiritualAnchor" : "movement";
      const meta = ONBOARDING_PILLAR_META[pillarKeyForStep];
      const current = isSpiritual ? spiritualChoice : movementChoice;
      box.insertAdjacentHTML("beforeend", `
        <div class="onboarding-eyebrow">Pillar ${isSpiritual ? "1" : "2"} of 2</div>
        <div class="onboarding-headline"><span class="onboarding-headline-icon">${onboardingPillarIconSvg(pillarKeyForStep)}</span> ${escapeHtml(meta.name)}</div>
        <div class="onboarding-subline">Which practice do you want to start with?</div>
        <div class="onboarding-choice-row">
          ${options.map((o) => `<div class="onboarding-choice-opt${current === o.key ? " sel" : ""}" data-key="${o.key}">${escapeHtml(o.label)}</div>`).join("")}
        </div>
      `);
      box.querySelectorAll(".onboarding-choice-opt").forEach((opt) => {
        opt.addEventListener("click", () => {
          if (isSpiritual) spiritualChoice = opt.dataset.key;
          else movementChoice = opt.dataset.key;
          stepIdx++;
          renderStep();
        });
      });
    }

    if (step === "toolbar") {
      box.insertAdjacentHTML("beforeend", `
        <div class="onboarding-eyebrow">Almost done</div>
        <div class="onboarding-headline">Arrange your toolbar</div>
        <div class="onboarding-subline">Drag to choose 4 for one-tap logging on Home. The other 2 live in Additional Practices.</div>
        <div class="onboarding-extra-label">Home toolbar</div>
        <div class="onboarding-toolbar-target" id="onbToolbarZone"></div>
        <div class="onboarding-extra-label">Additional practices</div>
        <div class="onboarding-extra-row" id="onbExtraZone"></div>
        <button type="button" class="sheet-primary-btn" id="onbToolbarNext">Looks good</button>
      `);
      const toolbarZone = box.querySelector("#onbToolbarZone");
      const extraZone = box.querySelector("#onbExtraZone");
      let dragKey = null;

      function tileHtml(key, isToolbar) {
        const meta = ONBOARDING_PILLAR_META[key];
        const cls = isToolbar ? "onboarding-toolbar-slot" : "onboarding-extra-slot";
        return `<div class="${cls}" draggable="true" data-key="${key}"><span class="ic">${onboardingPillarIconSvg(key)}</span>${escapeHtml(meta.name)}</div>`;
      }
      function renderZones() {
        toolbarZone.innerHTML = toolbarOrder.map((k) => tileHtml(k, true)).join("");
        extraZone.innerHTML = extraOrder.map((k) => tileHtml(k, false)).join("");
        [...toolbarZone.children, ...extraZone.children].forEach((tile) => {
          tile.addEventListener("dragstart", () => { dragKey = tile.dataset.key; tile.classList.add("dragging"); });
          tile.addEventListener("dragend", () => tile.classList.remove("dragging"));
          tile.addEventListener("dragover", (e) => e.preventDefault());
          tile.addEventListener("drop", (e) => {
            e.preventDefault();
            if (!dragKey || dragKey === tile.dataset.key) return;
            const destIsToolbar = toolbarZone.contains(tile);
            toolbarOrder = toolbarOrder.filter((k) => k !== dragKey);
            extraOrder = extraOrder.filter((k) => k !== dragKey);
            const destList = destIsToolbar ? toolbarOrder : extraOrder;
            const destIdx = destList.indexOf(tile.dataset.key);
            if (destIsToolbar && destList.length >= 4) {
              const bumped = destList.splice(destIdx, 1, dragKey)[0];
              extraOrder.unshift(bumped);
            } else {
              destList.splice(destIdx, 0, dragKey);
            }
            dragKey = null;
            renderZones();
          });
        });
      }
      renderZones();
      box.querySelector("#onbToolbarNext").addEventListener("click", () => { stepIdx++; renderStep(); });
    }

    if (step === "review") {
      box.insertAdjacentHTML("beforeend", `
        <div class="completion-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
        </div>
        <div class="onboarding-eyebrow">You're set up</div>
        <div class="onboarding-headline">Here's your starting kit</div>
        <div class="onboarding-review-card">
          <div class="onboarding-review-title">Home toolbar · 4 <span class="drag-hint">drag to reorder</span></div>
          <div class="onboarding-extra-row" id="reviewToolbarZone"></div>
        </div>
        <div class="onboarding-review-card">
          <div class="onboarding-review-title">Additional practices · 2 <span class="drag-hint">drag to reorder</span></div>
          <div class="onboarding-extra-row" id="reviewExtraZone"></div>
        </div>
        <div class="onboarding-lock-note">🔓 <div><strong>6 active practices, always free.</strong> Want more later? The Marketplace has extra practices — upgrading unlocks up to 15 active at once.</div></div>
        <div class="closing-beat">Your six practices are set. <b>Day one starts now.</b></div>
        <button type="button" class="sheet-primary-btn" id="onbFinish">Continue</button>
      `);
      const reviewToolbarZone = box.querySelector("#reviewToolbarZone");
      const reviewExtraZone = box.querySelector("#reviewExtraZone");
      let reviewDragKey = null;
      function reviewTileHtml(key) {
        const meta = ONBOARDING_PILLAR_META[key];
        return `<div class="onboarding-extra-slot" draggable="true" data-key="${key}"><span class="ic">${onboardingPillarIconSvg(key)}</span>${escapeHtml(meta.name)}</div>`;
      }
      function renderReviewZones() {
        reviewToolbarZone.innerHTML = toolbarOrder.map(reviewTileHtml).join("");
        reviewExtraZone.innerHTML = extraOrder.map(reviewTileHtml).join("");
        [...reviewToolbarZone.children, ...reviewExtraZone.children].forEach((tile) => {
          tile.addEventListener("dragstart", () => { reviewDragKey = tile.dataset.key; tile.classList.add("dragging"); });
          tile.addEventListener("dragend", () => tile.classList.remove("dragging"));
          tile.addEventListener("dragover", (e) => { e.preventDefault(); tile.classList.add("drag-over"); });
          tile.addEventListener("dragleave", () => tile.classList.remove("drag-over"));
          tile.addEventListener("drop", (e) => {
            e.preventDefault();
            tile.classList.remove("drag-over");
            if (!reviewDragKey || reviewDragKey === tile.dataset.key) return;
            const destIsToolbar = reviewToolbarZone.contains(tile);
            toolbarOrder = toolbarOrder.filter((k) => k !== reviewDragKey);
            extraOrder = extraOrder.filter((k) => k !== reviewDragKey);
            const destList = destIsToolbar ? toolbarOrder : extraOrder;
            const destIdx = destList.indexOf(tile.dataset.key);
            if (destIsToolbar && destList.length >= 4) {
              const bumped = destList.splice(destIdx, 1, reviewDragKey)[0];
              extraOrder.unshift(bumped);
            } else {
              destList.splice(destIdx, 0, reviewDragKey);
            }
            reviewDragKey = null;
            renderReviewZones();
          });
        });
      }
      renderReviewZones();
      box.querySelector("#onbFinish").addEventListener("click", () => { stepIdx++; renderStep(); });
    }

    if (step === "rewardAsk") {
      box.insertAdjacentHTML("beforeend", `
        <div class="onboarding-eyebrow">One more thing</div>
        <div class="onboarding-headline">Want to save toward something?</div>
        <div class="onboarding-subline">Some people like tying their streak to a real reward — a trip, a splurge, whatever. Totally optional.</div>
        <div class="onboarding-choice-row">
          <div class="onboarding-choice-opt${wantsReward ? " sel" : ""}" id="wantRewardOpt">
            <span>Yes, set up a reward<span class="opt-sub">Name it, set a savings goal, link an account</span></span>
            <span>›</span>
          </div>
          <div class="onboarding-choice-opt${wantsReward ? "" : " sel"}" id="skipRewardOpt">
            <span>Not right now<span class="opt-sub">Just track streaks and milestones</span></span>
            <span>›</span>
          </div>
        </div>
        <button type="button" class="sheet-primary-btn" id="rewardAskContinue">Continue</button>
      `);
      box.querySelector("#wantRewardOpt").addEventListener("click", () => {
        wantsReward = true;
        box.querySelector("#wantRewardOpt").classList.add("sel");
        box.querySelector("#skipRewardOpt").classList.remove("sel");
      });
      box.querySelector("#skipRewardOpt").addEventListener("click", () => {
        wantsReward = false;
        box.querySelector("#skipRewardOpt").classList.add("sel");
        box.querySelector("#wantRewardOpt").classList.remove("sel");
      });
      box.querySelector("#rewardAskContinue").addEventListener("click", () => {
        if (wantsReward) { stepIdx++; renderStep(); }
        else finishOnboarding();
      });
    }

    if (step === "rewardDetails") {
      box.insertAdjacentHTML("beforeend", `
        <div class="onboarding-eyebrow">Your reward</div>
        <div class="onboarding-headline">What are you working toward?</div>
        <label class="onboarding-field-label">Reward name</label>
        <input class="onboarding-text-input" id="rewardNameInput" value="${escapeHtml(rewardName)}" placeholder="Weekend in Charleston" />
        <label class="onboarding-field-label">Savings goal</label>
        <div class="goal-dollar-row"><span class="goal-dollar-sign">$</span><input type="number" min="1" id="rewardGoalInput" value="${rewardGoalDollars}" /></div>
        <label class="onboarding-field-label">Target date</label>
        <input type="date" class="onboarding-text-input" id="rewardTargetInput" value="${addDays(todayISO(), rewardTargetDays)}" style="margin-bottom:0;" />
        <button type="button" class="sheet-primary-btn" id="rewardDetailsContinue">Continue</button>
      `);
      box.querySelector("#rewardDetailsContinue").addEventListener("click", () => {
        rewardName = box.querySelector("#rewardNameInput").value.trim();
        const goal = parseInt(box.querySelector("#rewardGoalInput").value, 10);
        if (goal > 0) rewardGoalDollars = goal;
        const targetVal = box.querySelector("#rewardTargetInput").value;
        if (targetVal) {
          rewardTargetDays = Math.max(1, Math.round((new Date(targetVal) - new Date(todayISO())) / 86400000));
        }
        stepIdx++;
        renderStep();
      });
    }

    if (step === "rewardPhoto") {
      box.insertAdjacentHTML("beforeend", `
        <div class="onboarding-eyebrow">Your reward</div>
        <div class="onboarding-headline">What does it look like?</div>
        <div class="onboarding-subline">A photo of the actual thing you're working toward — makes it feel real every time you check in.</div>
        <div class="photo-upload-zone" id="rewardPhotoZone">
          <div class="photo-upload-zone-inner" id="rewardPhotoZoneInner">
            <div class="plus-badge"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>
            <div class="label">Add a photo</div>
            <div class="sub">${rewardName ? `of ${escapeHtml(rewardName)}` : ""}</div>
          </div>
        </div>
        <input type="file" accept="image/*" id="rewardPhotoInput" style="display:none;" />
        <button type="button" class="sheet-primary-btn" id="rewardPhotoChoose">Choose a photo</button>
        <button type="button" class="onboarding-skip-link" id="rewardPhotoSkip">Skip for now</button>
      `);
      const zone = box.querySelector("#rewardPhotoZone");
      const zoneInner = box.querySelector("#rewardPhotoZoneInner");
      const fileInput = box.querySelector("#rewardPhotoInput");
      if (rewardPhotoDataUrl) {
        zone.style.backgroundImage = `url(${rewardPhotoDataUrl})`;
        zone.style.backgroundSize = "cover";
        zone.style.backgroundPosition = "center";
        zoneInner.style.display = "none";
      }
      box.querySelector("#rewardPhotoChoose").addEventListener("click", () => fileInput.click());
      zone.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        resizeImageToDataUrl(file).then((dataUrl) => {
          rewardPhotoDataUrl = dataUrl;
          stepIdx++;
          renderStep();
        });
      });
      box.querySelector("#rewardPhotoSkip").addEventListener("click", () => { stepIdx++; renderStep(); });
    }

    if (step === "rewardLink") {
      box.insertAdjacentHTML("beforeend", `
        <div class="link-empty-icon" style="margin-bottom:10px;">${rewardPiggyBankSvg()}</div>
        <div class="onboarding-eyebrow">Your reward</div>
        <div class="onboarding-headline">Track it in real dollars</div>
        <div class="onboarding-subline">Logging your habits is what earns this — linking a bank account just lets you see your real balance alongside it. Read-only, optional, and it never moves money.</div>
        <button type="button" class="sheet-primary-btn" id="rewardLinkBtn">Link a bank account</button>
        <button type="button" class="onboarding-skip-link" id="rewardLinkSkip">I'll link this later, from Settings</button>
      `);
      const linkBtn = box.querySelector("#rewardLinkBtn");
      linkBtn.addEventListener("click", () => {
        linkBtn.textContent = "Connecting…";
        linkBtn.disabled = true;
        // The reward isn't written to state.veronikasPrize until
        // finishOnboarding runs, but Plaid Link needs somewhere to attach
        // its result right now — stash it locally and finishOnboarding
        // will fold it into the real prize object it creates.
        startPlaidLink(
          () => finishOnboarding(),
          () => { linkBtn.textContent = "Link a bank account"; linkBtn.disabled = false; }
        );
      });
      box.querySelector("#rewardLinkSkip").addEventListener("click", finishOnboarding);
    }
  }

  function finishOnboarding() {
    // Sleep's practice is the built-in "sleep" sheet — just make sure it's
    // visible and mapped, no template to add.
    const sleepSheet = state.sheets.find((s) => s.id === "sleep");
    if (sleepSheet) sleepSheet.visible = true;
    state.pillarSourceMap ||= {};
    state.pillarSourceMap.sleepProtected ||= [];
    if (!state.pillarSourceMap.sleepProtected.includes("sleep")) state.pillarSourceMap.sleepProtected.push("sleep");

    // Social, Learning, and Food each have exactly one template — add it
    // if it isn't already there for some reason.
    [
      ["social"],
      ["books"],
      ["mealLog"],
    ].forEach(([tplKey]) => {
      const already = Object.values(state.customSheets).some((cs) => cs.templateKey === tplKey);
      if (!already) {
        const tpl = SHEET_GALLERY.find((t) => t.key === tplKey);
        if (tpl) createSheetFromTemplateUnchecked(tpl);
      }
    });

    // Spiritual and Movement use whichever option was tapped.
    [spiritualChoice, movementChoice].forEach((tplKey) => {
      if (!tplKey) return;
      const already = Object.values(state.customSheets).some((cs) => cs.templateKey === tplKey);
      if (!already) {
        const tpl = SHEET_GALLERY.find((t) => t.key === tplKey);
        if (tpl) createSheetFromTemplateUnchecked(tpl);
      }
    });

    // Resolve each pillar key to the id of the sheet that now represents
    // it, so the toolbar/additional order can be written back as a real
    // sheet order.
    function sheetIdForPillar(pillarKey) {
      if (pillarKey === "sleepProtected") return "sleep";
      const candidates = pillarCandidateSheets(pillarKey);
      return candidates.length ? candidates[candidates.length - 1].id : null;
    }
    const orderedIds = [...toolbarOrder, ...extraOrder].map(sheetIdForPillar).filter(Boolean);
    const rest = state.sheets.filter((s) => !orderedIds.includes(s.id));
    const reordered = [];
    orderedIds.forEach((id) => {
      const found = state.sheets.find((s) => s.id === id);
      if (found) reordered.push(found);
    });
    state.sheets = [...reordered, ...rest];

    // The reward — only written if she actually opted in on "rewardAsk".
    // A skip leaves state.veronikasPrize exactly as boot() defaulted it,
    // so nothing reward-related shows up anywhere until she goes looking
    // for "Your Reward" in Settings herself. Guarded by rewardApplied
    // (not prize.enabled) so this can't double-fire — a successful Plaid
    // link and the "link later" skip button both call finishOnboarding —
    // without that guard also silently blocking accounts whose reward
    // predates onboarding becoming opt-in.
    if (wantsReward && !rewardApplied) {
      rewardApplied = true;
      state.veronikasPrize.enabled = true;
      state.veronikasPrize.itemName = rewardName;
      state.veronikasPrize.depositGoal = rewardGoalDollars;
      state.veronikasPrize.cycleStartDate = todayISO();
      state.veronikasPrize.cycleLengthDays = rewardTargetDays;
      state.veronikasPrize.earnedAmount = 0;
      // Computed silently from the three inputs she already entered above
      // (name, dollar goal, target date) — no extra onboarding step.
      state.veronikasPrize.dollarPerLog = computeDollarPerLog(
        rewardGoalDollars,
        rewardTargetDays,
        currentPracticeAppIds().length
      );
      if (rewardPhotoDataUrl) state.veronikasPrize.itemPhoto = rewardPhotoDataUrl;
      // A bank linked during this flow already snapshotted its own
      // cycleStartBalance in startPlaidLink's onSuccess handler — that
      // balance is shown as an informational comparison only now; it
      // doesn't feed into progress (see computeRewardProgress).
    }

    state.onboardingComplete = true;
    scheduleSave();
    overlay.remove();
    rebuildNav();
    renderAll();
    activateTab("home");
  }

  renderStep();
}

async function boot() {
  // Sign-in gate first — nothing below runs until someone's identity is
  // known, since the data itself lives behind that identity now.
  const session = await requireAuth();
  currentUserId = session.user.id;
  currentUserEmail = session.user.email || "";
  // Google's the only OAuth provider Addley signs in with today, and
  // Supabase only ever surfaces the combined name it got back from
  // Google as user_metadata.full_name — never given_name/family_name
  // separately, even though Google's own response has them split. So
  // "first name" here just means "the first word of full_name" — right
  // for the overwhelming majority of names, occasionally wrong for a
  // two-word first name, with no clean fix on Supabase's end today.
  // Password-based accounts have no full_name at all, hence the guard.
  const googleFullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
  currentUserFirstName = googleFullName.trim().split(/\s+/)[0] || "";

  // Load this account's row. The signup trigger on the database side
  // creates it automatically the moment someone creates an account, so
  // a genuinely missing row (loadStateFromSupabase returning null) means
  // "new user" and starting blank below is correct. A THROWN error is a
  // different thing entirely — a dropped connection, a timeout, a
  // Supabase hiccup — and must stop boot() here rather than falling
  // through to a blank slate, which would get written straight back to
  // the database a few lines down and silently erase everything real
  // that was there before. Retries a few times first since most of these
  // clear up within a couple of seconds on their own.
  try {
    state = await loadStateWithRetries(currentUserId);
  } catch (err) {
    console.error("Could not load your data after retrying:", err);
    showBootLoadError();
    return;
  }
  let isBrandNewAccount = false;
  if (!state) {
    state = { todos: [], budget: [], investmentAccounts: [], bible: [], goals: [], wellness: [], nextId: 1 };
    isBrandNewAccount = true;
    // New accounts start onboarding on their very first load; anyone with
    // an existing row skips it below once state has loaded successfully.
    state.onboardingComplete = false;
  }
  // Backfill in case any array/field is missing from an older save.
  state.todos ||= [];
  state.todos.forEach((t, i) => (t.sortOrder ??= i));
  // One-time cleanup: the to-do list originally shipped with specific
  // weekdays pre-assigned, which wasn't the intent — it's meant to be one
  // running list. Clear any leftover day assignments once; after that,
  // any day she sets herself (via the day picker) sticks normally.
  if (!state.todoDaysCleared) {
    state.todos.forEach((t) => {
      t.day = null;
    });
    state.todoDaysCleared = true;
  }
  // One-time: the single flat To-Do array becomes the first list in the
  // new "Lists" space, so nothing gets lost when it stops being the only
  // list you can have. A brand-new account with no history gets the same
  // starter list, just empty, so Lists never opens to a totally bare
  // "+ New list" screen with nothing familiar in it.
  state.lists ||= [];
  state.activeListId ??= null;
  if (!state.listsMigrationApplied) {
    if (state.todos.length || !state.lists.length) {
      state.lists.unshift({
        id: "list_" + nextId(),
        name: "To-Do",
        icon: "checklist",
        color: "#8C3F2B",
        style: "task",
        items: state.todos.map((t) => ({
          id: t.id,
          task: t.task,
          priority: t.priority || "2. Medium",
          done: !!t.done,
          sortOrder: t.sortOrder ?? 0,
        })),
      });
    }
    state.listsMigrationApplied = true;
  }
  state.budget ||= [];
  state.budget.forEach((b) => (b.hidden ??= false));
  // One-time merge: fold the old "Subscriptions" and "Fixed Costs" sections
  // into one plain "Categories" section, since not everything in it is
  // actually fixed. Runs once and never touches a section she's since
  // renamed or reassigned herself.
  if (state.budgetSectionMergeVersion !== BUDGET_SECTION_MERGE_VERSION) {
    state.budget.forEach((b) => {
      if (b.section === "Subscriptions" || b.section === "Fixed Costs") b.section = "Categories";
    });
    state.budgetSectionMergeVersion = BUDGET_SECTION_MERGE_VERSION;
  }
  state.investmentAccounts ||= [];
  state.investmentAccounts.forEach((a) => {
    a.holdings ||= [];
    a.deployedMonths ||= [];
  });
  // Migrate a pre-account-tabs save: a flat `investments` array with nowhere
  // to live goes onto the RRSP account, since that's where it always was.
  if (Array.isArray(state.investments) && state.investments.length) {
    const rrsp = state.investmentAccounts.find((a) => a.key === "rrsp");
    if (rrsp) rrsp.holdings = rrsp.holdings.concat(state.investments);
    delete state.investments;
  }
  state.bible ||= [];
  state.bibleSettings ||= { startDate: "2026-01-01" };
  // Lifetime Bible Milestones — permanent, survive a "Start over" of the
  // live reading plan above. See BIBLE_MILESTONES.
  state.bibleBooksEverFinished ||= [];
  state.bibleMilestonesEarned ||= {};
  // One-time: credit any book that was already fully finished before this
  // feature shipped — otherwise real progress made before today would
  // start invisible, since normal tracking only notices a book finishing
  // at the moment a chapter gets toggled (see the chapter-chip handler).
  if (!state.bibleMilestonesBackfilled) {
    const byBookInit = new Map();
    state.bible.forEach((r) => {
      const { book } = parseBookAndChapter(r.reading);
      if (!byBookInit.has(book)) byBookInit.set(book, []);
      byBookInit.get(book).push(r);
    });
    byBookInit.forEach((rows, book) => {
      if (rows.length && rows.every((r) => r.done) && !state.bibleBooksEverFinished.includes(book)) {
        state.bibleBooksEverFinished.push(book);
      }
    });
    state.bibleMilestonesBackfilled = true;
  }
  state.goals ||= [];
  state.wellness ||= [];
  state.sleepLogs ||= [];
  state.sleepMilestonesEarned ||= {};
  state.sleepSettings ||= { targetHours: 7, updatedAt: 0 };
  state.sleepSettings.updatedAt ||= 0;
  // Learning pillar — a real reading log: which book, what chapter, what
  // day. Older saves stored this as a plain array of date strings (just
  // "did she read today", not linked to any book) — migrate those
  // forward into the same shape as a real logged entry, minus the parts
  // that were never captured.
  state.learningLog ||= [];
  state.learningLog = state.learningLog.map((e) =>
    typeof e === "string" ? { date: e, bookId: null, chapter: null } : e
  );
  state.nextId ||= 1;
  state.activeTab ||= "home";
  state.budgetView ||= "sections";
  state.budgetShowHidden ||= false;
  state.theme ||= "cream";
  state.bibleTestament ||= "all";
  state.bibleOpenBooks ||= {};
  // Starts unset; the over/under flags just don't show anything meaningful
  // until this is filled in from the Budget tab.
  state.paycheckSettings ||= { amount: 0, frequency: "semimonthly" };
  state.portfolioChoice ||= "yours";
  state.selectedInvestmentAccount ||= "rrsp";
  // Plan/account info — nothing reads this for gating yet, but every
  // account gets a real shape here from the start so that logic has
  // something safe to check once it exists, instead of treating a missing
  // field as either plan by accident.
  state.account ||= { plan: "free", planLabel: "Free", isFounder: false, unlimitedSpaces: false };

  // Settings — sheet order/visibility, plus any sheets added from the gallery.
  state.deletedBuiltinSheets ||= [];
  state.sheets ||= BUILTIN_SHEET_ORDER.filter((id) => !state.deletedBuiltinSheets.includes(id)).map((id) => ({
    id,
    kind: "builtin",
    visible: true,
  }));
  BUILTIN_SHEET_ORDER.forEach((id) => {
    if (!state.deletedBuiltinSheets.includes(id) && !state.sheets.some((s) => s.id === id)) {
      state.sheets.push({ id, kind: "builtin", visible: true });
    }
  });
  // Anyone who already has a saved row skips onboarding — this only ever
  // defaults to false in the brand-new-account branch above.
  state.onboardingComplete ??= true;
  if (isBrandNewAccount) {
    // Bible sits off to the side as an extra, not part of the six-pillar
    // starter kit — onboarding hands a new account Prayer/Qur'an/Breathe
    // as its Spiritual choice instead. Still there in the Gallery-style
    // list whenever it's wanted; just not pinned or counted on day one.
    const bibleSheet = state.sheets.find((s) => s.id === "bible");
    if (bibleSheet) bibleSheet.visible = false;
  }
  // One-time: Home now shows the wellness ring, the reward, and today's
  // pillars directly, so Wellness no longer needs its own bottom-bar slot —
  // hide it exactly the way the eye toggle in Settings already can, which
  // frees that slot for an actual space. The Wellness page itself is
  // untouched and still reachable from Home's "See full wellness history"
  // link; this only ever runs once, so turning it back on visible from
  // Settings afterward sticks normally.
  // Deliberately a fresh flag, not the pre-existing
  // homeAbsorbsWellnessV1Applied — an account whose data predates the
  // hide-Wellness line above already had that older flag set to true from
  // an earlier version of this same migration block, which meant this
  // step silently never ran for it even though the flag looked "done".
  if (!state.homeAbsorbsWellnessHideV1Applied) {
    const wellnessSheet = state.sheets.find((s) => s.id === "wellness");
    if (wellnessSheet) wellnessSheet.visible = false;
    state.homeAbsorbsWellnessHideV1Applied = true;
  }
  state.homeAbsorbsWellnessV1Applied = true;
  state.customSheets ||= {};
  // One-time: shortened three gallery template labels ("Connections Log",
  // "Quran Reading Plan", "Capsule Wardrobe") so they stay well clear of
  // truncating on the mobile bottom bar — "Connections Log" was confirmed
  // cut off there, and even "Bible Reading" (13 chars) turns out to clip
  // by a hair at some widths, so the replacements go shorter than that
  // rather than just under it. Only touches a space still carrying the
  // old default label; anything she's renamed herself afterward is left
  // alone.
  if (!state.sheetLabelShortenV1Applied) {
    const OLD_TO_NEW_SHEET_LABELS = {
      "Connections Log": "Connections",
      "Quran Reading Plan": "Quran Plan",
      "Capsule Wardrobe": "Wardrobe",
    };
    Object.values(state.customSheets).forEach((cs) => {
      if (OLD_TO_NEW_SHEET_LABELS[cs.label]) cs.label = OLD_TO_NEW_SHEET_LABELS[cs.label];
    });
    state.sheetLabelShortenV1Applied = true;
  }
  // One-time (v2): "Book List" -> "Books", same reasoning as the shorten
  // pass above, just decided later. Separate flag since v1 already ran.
  if (!state.sheetLabelShortenV2Applied) {
    Object.values(state.customSheets).forEach((cs) => {
      if (cs.label === "Book List") cs.label = "Books";
    });
    state.sheetLabelShortenV2Applied = true;
  }
  // Pillar Mapping — which spaces auto-complete each pillar. Defaults to
  // Bible for Spiritual anchor once, the first time someone has a Bible
  // sheet, since that matched what was already in use; everything else
  // starts unmapped (manual-only) until she picks something in the "You"
  // page's Pillar Mapping screen.
  state.pillarSourceMap ||= { movement: [], spiritualAnchor: [], sleepProtected: [], socialConnection: [], learning: [], food: [] };
  state.pillarSourceMap.learning ||= [];
  state.pillarSourceMap.food ||= [];
  // Real per-day record of what a pillar's "Yes" actually was — see
  // setPillarActivity/pillarActivityFor above. Older saves have none of
  // this yet; that's fine, it only affects trend detail going forward.
  state.pillarActivity ||= [];
  if (!state.pillarSourceMapDefaultApplied) {
    if (state.sheets.some((s) => s.id === "bible" && s.visible) && !state.pillarSourceMap.spiritualAnchor.length) {
      state.pillarSourceMap.spiritualAnchor = ["bible"];
    }
    state.pillarSourceMapDefaultApplied = true;
  }
  // One-time upgrade: any Capsule Wardrobe sheet added before it had
  // real category/color/season/price data (just a plain checklist of
  // placeholder items like "Tops", "Bottoms"...) gets replaced with the
  // full seeded item list, tagged schema v2 so this never runs again —
  // items she edits or adds herself after this point stick normally.
  Object.entries(state.customSheets).forEach(([id, sheet]) => {
    if (sheet.templateKey === "wardrobe" && sheet.wardrobeSchemaV !== 2) {
      sheet.items = seedWardrobeItems();
      sheet.wardrobeSchemaV = 2;
      sheet.openCategories ||= {};
      sheet.activeSeason ??= null;
    }
  });
  // One-time backfill: the real product links she'd had in her original
  // spreadsheet only survived in the .xlsx re-export, not the earlier
  // .csv. Matched back onto her already-migrated items by POSITION, not
  // name — a couple of rows (two identical "Long Sleeve Tee, Black"
  // lines) are indistinguishable by name+color alone, and matching by
  // name could cross-assign one item's link to a different item that
  // happens to share the same description. Position is safe here because
  // the prior migration seeded everyone's list in this exact order; the
  // name check is just a sanity guard in case she's since reordered or
  // deleted something, and it only ever fills in a link, never overwrites
  // one she's set herself.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey === "wardrobe" && !sheet.wardrobeLinksImported) {
      sheet.items.forEach((it, i) => {
        if (it.link) return;
        const seed = WARDROBE_SEED_ITEMS[i];
        if (seed && seed.link && seed.category === it.category && seed.name === it.name && seed.color === it.color) {
          it.link = seed.link;
        }
      });
      sheet.wardrobeLinksImported = true;
    }
  });
  // One-time backfill: the Botanical Satchel's real product photo (she
  // sent it directly). "Botanical Satchel" is a one-of-a-kind name in the
  // seed list, so a plain name+category match is safe here — no duplicate
  // rows to worry about the way the tee links needed position-matching.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey === "wardrobe" && !sheet.wardrobePhotoImported) {
      const seedPhoto = WARDROBE_SEED_ITEMS.find((s) => s.category === "Bags" && s.name === "Botanical Satchel")?.photo;
      if (seedPhoto) {
        const target = sheet.items.find((it) => it.category === "Bags" && it.name === "Botanical Satchel" && !it.photo);
        if (target) target.photo = seedPhoto;
      }
      sheet.wardrobePhotoImported = true;
    }
  });
  // One-time fix: a couple of exercises came from her spreadsheet with
  // "TBD" as the Target weight — that reflected Matt not having assigned
  // a number YET, not an ongoing state. Since she already has a real
  // logged Actual for those sets, there's no reason to keep showing TBD;
  // backfill the target with that same weight (matching what "Prev" pulls
  // forward for a new week) so it reads as a real number to hit or beat.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey !== "workout" || sheet.workoutTbdFixed) return;
    (sheet.weeks || []).forEach((week) => {
      week.days.forEach((day) => {
        day.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            if (!/^TBD/i.test(set.target || "")) return;
            const parsed = parseWorkoutActual(set.actual);
            if (parsed && parsed.hasWeight) {
              const unit = ex.direction === "down" ? "assist" : "lb";
              set.target = set.target.replace(/^TBD/i, `${parsed.weight} ${unit}`);
            }
          });
        });
      });
    });
    sheet.workoutTbdFixed = true;
  });
  // One-time fix: Target used to repeat the exercise's rep range on every
  // set ("85 lb x 8–10"), which just re-showed the same range three or
  // four times per exercise and crowded the field on mobile. The rep
  // range now shows once, next to the exercise name — trim it back out
  // of any target text already saved.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey !== "workout" || sheet.workoutTargetSimplified) return;
    (sheet.weeks || []).forEach((week) => {
      week.days.forEach((day) => {
        day.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            const match = (set.target || "").match(/^(.*?)\s*x\s*\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?(\/side)?$/);
            if (match) set.target = match[1] + (match[2] || "");
          });
        });
      });
    });
    sheet.workoutTargetSimplified = true;
  });
  // One-time upgrade: Connections Log started as a flat list of entries
  // with a free-text "who" on each one — no shared identity between two
  // entries for the same person, so there was nothing to hang a quick-log
  // chip or a per-person cadence read off of. Promote each distinct name
  // into a real person record and re-point every entry at it by id;
  // matching is name-based (trimmed, case-insensitive) since that's all
  // the old data had to go on.
  Object.values(state.customSheets).forEach((sheet) => {
    if (sheet.templateKey !== "social" || sheet.socialSchemaV === 2) return;
    sheet.people ||= [];
    const byName = new Map(sheet.people.map((p) => [p.name.trim().toLowerCase(), p]));
    sheet.items.forEach((entry) => {
      if (entry.personId) return;
      const key = (entry.who || "").trim().toLowerCase();
      let person = byName.get(key);
      if (!person) {
        person = { id: nextId(), name: (entry.who || "Someone").trim() || "Someone" };
        sheet.people.push(person);
        byName.set(key, person);
      }
      entry.personId = person.id;
      delete entry.who;
    });
    sheet.socialSchemaV = 2;
  });

  // Veronika's Bonus — an identity statement, a quiet rhythm reading
  // from Daily Wellness, and whatever this 90-day cycle's bonus is.
  const DEFAULT_PRIZE_QUOTE = "I show up for myself \u2014 spiritually, physically, and financially \u2014 and I follow through.";
  const OLD_DEFAULT_PRIZE_QUOTE = "I'm someone who shows up for herself spiritually, for her health, and her money \u2014 and treats herself accordingly.";
  state.veronikasPrize ||= {
    quote: DEFAULT_PRIZE_QUOTE,
    cycleStartDate: todayISO(),
    cycleLengthDays: 90,
    itemName: "",
    itemPhoto: "",
    depositGoal: null, // dollar amount now, set during reward setup — see computeRewardProgress
    nudgedMilestones: [],
    enabled: false,
    linkedAccount: null,
  };
  state.veronikasPrize.nudgedMilestones ||= [];
  // The reward became opt-in (asked once, skippably, at the end of
  // onboarding) in 2026-09. Accounts that already had one going before
  // that keep seeing it; only brand-new accounts start with it off.
  if (state.veronikasPrize.enabled === undefined) state.veronikasPrize.enabled = true;
  state.veronikasPrize.linkedAccount ||= null;
  // Habit-logging-earns-it mechanic (2026-09): progress is driven by
  // earnedAmount, credited per pillar completion at dollarPerLog each.
  // A linked Plaid balance is informational only from here on (see
  // computeRewardProgress). Existing accounts get a dollarPerLog backfilled
  // from whatever goal/cycle length they already have so earning starts
  // immediately without asking them to re-enter anything.
  if (state.veronikasPrize.earnedAmount === undefined) state.veronikasPrize.earnedAmount = 0;
  if (!state.veronikasPrize.dollarPerLog && state.veronikasPrize.depositGoal) {
    state.veronikasPrize.dollarPerLog = computeDollarPerLog(
      state.veronikasPrize.depositGoal,
      state.veronikasPrize.cycleLengthDays,
      currentPracticeAppIds().length
    );
  }
  // One-time backfill for accounts that already had a reward going before
  // this mechanic existed: without this, switching from "balance is the
  // goal" to "logging earns it" would make an account's progress bar drop
  // back to $0 even though real pillar history already exists for this
  // cycle — reads as lost progress, not a fresh start. Credits every
  // Yes already logged since cycleStartDate, once, at the locked-in rate.
  if (!state.veronikasPrize.earnedBackfillV1Applied) {
    state.veronikasPrize.earnedBackfillV1Applied = true;
    if (state.veronikasPrize.dollarPerLog && state.veronikasPrize.cycleStartDate) {
      const startDate = state.veronikasPrize.cycleStartDate;
      let backfilledLogs = 0;
      (state.wellness || []).forEach((entry) => {
        if (!entry.logDate || entry.logDate < startDate) return;
        WELLNESS_YESNO_FIELDS.forEach(([key]) => {
          if (entry[key] === "Yes") backfilledLogs++;
        });
      });
      if (backfilledLogs > 0) {
        state.veronikasPrize.earnedAmount = Math.max(
          state.veronikasPrize.earnedAmount || 0,
          backfilledLogs * state.veronikasPrize.dollarPerLog
        );
      }
    }
  }
  // Upgrade the default wording once, but never touch it if she's
  // written her own quote (i.e. it no longer matches either default).
  if (state.veronikasPrize.quote === OLD_DEFAULT_PRIZE_QUOTE) {
    state.veronikasPrize.quote = DEFAULT_PRIZE_QUOTE;
  }

  // Extra trackers (Cycle, eventually others) are their own family,
  // separate from practices: they don't map to a pillar, don't count
  // against the practice cap, and are always free to add or remove.
  // Cycle used to be forced on for everyone with no way to turn it off.
  // Per Veronika's explicit call, it moves fully off Home by default now
  // — including for accounts that already had it — and only shows up
  // again if chosen from the Gallery's "Extra trackers" section. No data
  // is lost by this: the tracker's own logged entries aren't touched,
  // only whether its row renders on Home.
  state.extraTrackers ||= {};
  if (state.extraTrackers.cycle === undefined) state.extraTrackers.cycle = false;
  // A one-time forced flip, separate from the default above: the first
  // version of this migration grandfathered existing accounts to `true`,
  // which is exactly the opposite of what's wanted now — this runs once
  // more to override that regardless of the value already saved.
  if (!state.extraTrackersCycleOffV1Applied) {
    state.extraTrackers.cycle = false;
    state.extraTrackersCycleOffV1Applied = true;
  }
  if (state.extraTrackers.sobriety === undefined) state.extraTrackers.sobriety = false;

  // Sobriety tracker data — a day count since startDate, a re-earnable
  // milestone grid that clears on reset (an all-time record never does),
  // a daily check-in log, and a short list of personal reasons ("Your
  // why") shown during a craving and again before a reset. None of this
  // feeds the reward mechanic — see awardRewardForPillarLog, which only
  // ever fires from a real pillar log.
  state.sobriety ||= {
    startDate: todayISO(),
    allTimeBestDays: 0,
    milestonesAllTime: {},
    milestonesCurrent: {},
    checkIns: [],
    whyItems: [],
    lastResetDate: null,
  };
  state.sobriety.milestonesAllTime ||= {};
  state.sobriety.milestonesCurrent ||= {};
  state.sobriety.checkIns ||= [];
  state.sobriety.whyItems ||= [];

  // Cycle tracker data — a list of logged periods (start date, optional
  // end date, optional flow) is the only real input; everything else
  // (today's predicted phase, days to next period, the averages) is
  // computed from it every render, never stored. manualCycleLengthDays
  // and manualPeriodLengthDays are just the fallback numbers used before
  // there's enough real history to average from (see cycleAvgCycleLength
  // / cycleAvgPeriodLength) — real logged data always wins once there's
  // enough of it.
  state.cycle ||= { periods: [], manualCycleLengthDays: null, manualPeriodLengthDays: null };
  state.cycle.periods ||= [];

  budgetView = state.budgetView;
  budgetShowHidden = state.budgetShowHidden;
  bibleTestament = state.bibleTestament;
  portfolioChoice = state.portfolioChoice;

  // Capture this device's live IANA timezone on every boot (not just
  // once) — the notification backend reads state.timezone to know when
  // "evening" is and what day "today" is for each account. Re-reading it
  // every time rather than storing it once means it self-corrects the
  // next time she opens the app after traveling, with no setting to
  // remember to change.
  try {
    const liveTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (liveTz) state.timezone = liveTz;
  } catch (err) {
    // Very old browsers without Intl support just keep whatever was
    // saved before (or none) — the reminder/milestone timing falls back
    // to UTC server-side rather than breaking anything.
  }

  // Grace Days — grant this month's tokens and cover any real gap from
  // the last couple weeks before anything renders, so streaks and the
  // Home banner already reflect it on first paint.
  reconcileGraceDays(todayISO());

  // Write straight back after any migrations above so the row reflects
  // the current shape immediately, rather than waiting for the first
  // real edit to trigger a save.
  doSave();

  applyTheme();
  ensureCustomPanels();
  initTabs();
  renderAll();
  if (!state.onboardingComplete) showOnboardingFlow();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight);
  registerServiceWorker();

  // The boot-loading overlay (see index.html) covers the very first paint —
  // hide it now that there's something real underneath it. The fade is
  // CSS-driven so this only has to flip a class.
  const bootLoading = document.getElementById("boot-loading");
  if (bootLoading) {
    bootLoading.classList.add("hide");
    setTimeout(() => bootLoading.remove(), 300);
  }

  // Heals anything saved before photos were downscaled on upload (see
  // resizeImageToDataUrl) — a full-size camera photo saved directly can
  // be large enough on its own to push a save past the browser's storage
  // quota, which then silently fails every save afterward, for anything
  // in the app, until the oversized photo is gone. Runs after the first
  // render so it never blocks showing the page.
  healOversizedPhotos();
}

// Anything already bigger than ~150KB as a dataURL (roughly 110KB of
// actual image data) gets re-encoded smaller. A freshly-resized photo
// from resizeImageToDataUrl is nowhere near this, so this is a no-op
// after the first pass — safe to just check size rather than track a
// one-time-migration flag.
const OVERSIZED_PHOTO_THRESHOLD = 150000;

function shrinkDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Could not decode stored image"));
    img.onload = () => {
      const maxDim = 900;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = dataUrl;
  });
}

async function healOversizedPhotos() {
  const targets = [];
  if (state.veronikasPrize?.itemPhoto?.length > OVERSIZED_PHOTO_THRESHOLD) {
    targets.push({ get: () => state.veronikasPrize.itemPhoto, set: (v) => (state.veronikasPrize.itemPhoto = v) });
  }
  Object.values(state.customSheets || {}).forEach((sheet) => {
    (sheet.items || []).forEach((item) => {
      if (item.photo?.length > OVERSIZED_PHOTO_THRESHOLD) {
        targets.push({ get: () => item.photo, set: (v) => (item.photo = v) });
      }
    });
  });
  if (!targets.length) return;
  let healedAny = false;
  for (const t of targets) {
    try {
      const shrunk = await shrinkDataUrl(t.get());
      t.set(shrunk);
      healedAny = true;
    } catch (err) {
      console.error("Could not shrink a stored photo:", err);
    }
  }
  if (healedAny) {
    scheduleSave();
    // Whatever's currently on screen may be showing one of the photos
    // just swapped out from under it — cheapest fix is just re-rendering.
    renderAll();
  }
}

boot();
